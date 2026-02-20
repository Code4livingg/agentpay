// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PolicyRegistry.sol";

contract AgentVault is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    PolicyRegistry public policyRegistry;

    mapping(bytes32 => uint256) private agentBalances;
    mapping(bytes32 => uint256) private dailySpent;
    mapping(bytes32 => uint256) private lastResetDay;

    // Custom errors
    error AgentNotActive();
    error RecipientNotWhitelisted();
    error ExceedsPerTxLimit();
    error ExceedsDailyCap();
    error InsufficientBalance();

    // Events
    event Deposited(bytes32 indexed agentId, uint256 amount);
    event PaymentExecuted(bytes32 indexed agentId, address indexed recipient, uint256 amount, uint256 timestamp);
    event PaymentBlocked(bytes32 indexed agentId, string reason);

    constructor(address _usdcToken, address _policyRegistry) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        policyRegistry = PolicyRegistry(_policyRegistry);
    }

    function deposit(bytes32 agentId, uint256 amount) external {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        agentBalances[agentId] += amount;

        emit Deposited(agentId, amount);
    }

    function executePayment(
        bytes32 agentId,
        address recipient,
        uint256 amount
    ) external onlyOwner nonReentrant {
        // Check agent is active
        if (!policyRegistry.isAgentActive(agentId)) {
            revert AgentNotActive();
        }

        // Check recipient is whitelisted
        if (!policyRegistry.isWhitelisted(agentId, recipient)) {
            revert RecipientNotWhitelisted();
        }

        // Get policy
        PolicyRegistry.Policy memory policy = policyRegistry.getPolicy(agentId);

        // Check per-transaction limit
        if (amount > policy.maxPerTx) {
            revert ExceedsPerTxLimit();
        }

        // Reset daily spent if it's a new day
        uint256 currentDay = block.timestamp / 86400;
        if (currentDay > lastResetDay[agentId]) {
            dailySpent[agentId] = 0;
            lastResetDay[agentId] = currentDay;
        }

        // Check daily cap
        if (dailySpent[agentId] + amount > policy.dailyCap) {
            revert ExceedsDailyCap();
        }

        // Check balance
        if (agentBalances[agentId] < amount) {
            revert InsufficientBalance();
        }

        // Execute payment
        agentBalances[agentId] -= amount;
        dailySpent[agentId] += amount;

        require(usdcToken.transfer(recipient, amount), "Transfer failed");

        emit PaymentExecuted(agentId, recipient, amount, block.timestamp);
    }

    function getBalance(bytes32 agentId) external view returns (uint256) {
        return agentBalances[agentId];
    }

    function getDailySpent(bytes32 agentId) external view returns (uint256) {
        uint256 currentDay = block.timestamp / 86400;
        if (currentDay > lastResetDay[agentId]) {
            return 0;
        }
        return dailySpent[agentId];
    }

    function getRemainingDailyBudget(bytes32 agentId) external view returns (uint256) {
        PolicyRegistry.Policy memory policy = policyRegistry.getPolicy(agentId);
        uint256 currentDay = block.timestamp / 86400;
        uint256 spent = (currentDay > lastResetDay[agentId]) ? 0 : dailySpent[agentId];
        return policy.dailyCap - spent;
    }
}
