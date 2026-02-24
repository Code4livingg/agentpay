# AgentPay

> Policy-Enforced Execution Infrastructure for Autonomous Agents on Polygon

**AgentPay is the deterministic control layer that prevents autonomous AI agents from becoming financially unbounded.**

As AI agents begin executing financial actions independently, unconstrained autonomy introduces systemic risk. AgentPay formalizes bounded, deterministic execution on Polygon through enforceable on-chain policy.

---

## Problem Statement

Autonomous agents require bounded financial authority. Without it:

- **Runaway execution** — agents drain funds without limit
- **No deterministic control** — spending behavior is unpredictable
- **Unverified settlement** — no cryptographic proof of execution
- **Systemic risk** — compromised agents cause unbounded financial damage

**AgentPay does not enable AI payments. It constrains and governs AI financial execution.**

Traditional payment systems assume human oversight. Autonomous agents operate continuously at machine scale. They need:

1. **Bounded execution** — financial authority limited by enforceable policy
2. **Deterministic control** — smart contract logic enforces predictable outcomes
3. **Receipt-level verification** — cryptographic proof of every transaction
4. **Machine-scale safety** — designed for high-frequency autonomous operation

AgentPay provides this execution governance layer on Polygon.

---

## Why AI Agents Need Bounded Execution

Autonomous agents are not humans. They:
- Execute thousands of transactions per day without oversight
- Operate continuously without manual intervention
- Can be compromised or behave unexpectedly
- Require deterministic, rule-bound financial authority

**Without bounded execution:**
- Runaway agents drain funds
- No cryptographic proof of execution
- Financial authority is unlimited
- Agents cannot operate safely at scale

**With AgentPay:**
- Financial authority is limited by on-chain policy
- Every transaction is receipt-verified
- Spending limits and whitelists constrain behavior
- Deterministic smart contract enforcement
- Human operators retain full control via pause/policy updates

**AgentPay is not a payment app. It is a financial control layer for autonomous agents.**

---

## Why Polygon

AgentPay is built for Polygon PoS because:

1. **Low latency** — ~2 second block times enable deterministic confirmation
2. **Low cost** — $0.001 gas fees make machine-scale execution economically viable
3. **EVM compatibility** — standard Solidity contracts, no custom VM
4. **Production-grade** — battle-tested infrastructure with high uptime

Polygon's execution environment makes bounded, deterministic agent execution practical at scale.

---

## Architecture

```
┌─────────────────┐
│  Human Operator │  Sets policy, funds vault, monitors
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Smart Contracts (Polygon Amoy Testnet)             │
│                                                      │
│  ┌──────────────────┐      ┌──────────────────┐   │
│  │ PolicyRegistry   │◄─────┤  AgentVault      │   │
│  │                  │      │                  │   │
│  │ - maxPerTx       │      │ - executePayment │   │
│  │ - dailyCap       │      │ - deposit        │   │
│  │ - whitelist      │      │ - withdraw       │   │
│  │ - paused         │      │ - pause          │   │
│  └──────────────────┘      └──────────────────┘   │
│                                     │               │
│                                     ▼               │
│                            ┌──────────────────┐    │
│                            │  USDC (ERC-20)   │    │
│                            └──────────────────┘    │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Python SDK     │  Intercepts 402, executes payment, retries
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Paid API       │  Returns data after payment proof
└─────────────────┘
```

---

## Execution Flow

### 1. Policy Setup (One-Time)
```solidity
policyRegistry.registerAgent(
  agentId,
  maxPerTx: 1 USDC,
  dailyCap: 5 USDC,
  whitelist: [0xRecipient1, 0xRecipient2]
)
```

### 2. Vault Funding (As Needed)
```solidity
usdc.approve(agentVault, amount)
agentVault.deposit(agentId, amount)
```

### 3. Autonomous Payment (Agent-Initiated)
```python
# Agent calls paid API
result = await call_paid_endpoint(
  agent_id="weather_agent",
  endpoint="https://api.example.com/weather"
)

# SDK handles:
# 1. Detects 402 Payment Required
# 2. Checks policy (pre-check for UX)
# 3. Submits on-chain transaction
# 4. Contract enforces policy (final check)
# 5. USDC transferred to recipient
# 6. Retries endpoint with payment proof
# 7. Returns data to agent
```

### 4. Receipt Verification
Every payment emits an on-chain event:
```solidity
event PaymentExecuted(
  bytes32 indexed agentId,
  address indexed recipient,
  uint256 amount
)
```

Receipts are cryptographically verifiable and permanently logged.

---

## Execution Governance Model

### Threat: Agent Compromise
**Mitigation:** Financial authority is bounded by `maxPerTx` and `dailyCap`. Even if agent is fully compromised, execution authority is limited.

### Threat: Runaway Spending
**Mitigation:** Smart contract reverts any transaction exceeding policy limits. No discretionary overrides. Deterministic enforcement.

### Threat: Unauthorized Recipients
**Mitigation:** Whitelist enforced on-chain. Execution to non-whitelisted addresses reverts.

### Threat: Loss of Control
**Mitigation:** Human operator can pause agent execution authority instantly. All transactions stop immediately.

### Threat: Unverified Execution
**Mitigation:** Receipt-level verification. Block number and gas usage surfaced. Event decoding ensures confirmed settlement.

---

## Demo Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+
- Polygon Amoy testnet MATIC (for gas)
- Polygon Amoy testnet USDC

### 1. Clone Repository
```bash
git clone https://github.com/Code4livingg/agentpay
cd agentpay
```

### 2. Deploy Contracts (Already Deployed)
Contracts are deployed and verified on Polygon Amoy:
- **AgentVault**: `0x522996599e987d03cc9f07e77c3c11a3C23dE225`
- **PolicyRegistry**: `0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6`
- **USDC (Testnet)**: `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`

### 3. Setup Backend
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Add your PRIVATE_KEY and ALCHEMY_RPC

# Run backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Run Agent Demo
```bash
cd backend
source venv/bin/activate
python test_payment.py
```

---

## Contract Addresses (Polygon Amoy Testnet)

| Contract | Address | Verified |
|----------|---------|----------|
| AgentVault | [0x522996599e987d03cc9f07e77c3c11a3C23dE225](https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code) | ✓ |
| PolicyRegistry | [0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6](https://amoy.polygonscan.com/address/0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6#code) | ✓ |
| USDC (ERC-20) | 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582 | Testnet Token |

---

## Roadmap

### Phase 1: Testnet Validation (Current)
- ✅ Core contracts deployed and verified
- ✅ Python SDK with real on-chain execution
- ✅ Receipt-based event decoding
- ✅ Dashboard with transaction monitoring
- ✅ Policy enforcement testing

### Phase 2: Mainnet Preparation (Q2 2026)
- Multi-signature policy updates
- Gas optimization for high-frequency execution
- Batch payment support
- Enhanced monitoring and alerting
- Security audit

### Phase 3: Production Deployment (Q3 2026)
- Polygon PoS mainnet deployment
- Production SDK release
- Integration with major AI frameworks (LangChain, AutoGPT)
- Developer documentation and examples

### Phase 4: Protocol Expansion (Q4 2026)
- Multi-chain support (Ethereum L2s, Base, Arbitrum)
- Dynamic policy updates via governance
- Agent reputation scoring
- Payment routing optimization

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin |
| Blockchain | Polygon PoS (Amoy Testnet) |
| Token Standard | USDC (ERC-20) |
| Payment Protocol | x402 (emerging standard) |
| Backend | FastAPI (Python 3.11) |
| Agent SDK | Python, Web3.py, eth-account |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Testing | Hardhat (14 tests passing) |

---

## Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

**Output:**
```
  AgentPay Smart Contracts
    PolicyRegistry
      ✔ should register an agent with correct policy
      ✔ should revert if non-owner tries to register agent
      ✔ should update policy correctly
      ✔ should pause and unpause agent
      ✔ should add address to whitelist
    AgentVault - deposits
      ✔ should accept USDC deposit for agent
      ✔ should reflect correct balance after deposit
    AgentVault - executePayment
      ✔ should execute payment within policy limits
      ✔ should revert with ExceedsPerTxLimit when amount exceeds maxPerTx
      ✔ should revert with ExceedsDailyCap when daily cap is reached
      ✔ should revert with RecipientNotWhitelisted for non-whitelisted recipient
      ✔ should revert with AgentNotActive when agent is paused
      ✔ should revert with InsufficientBalance when vault has no funds
    AgentVault - daily reset
      ✔ should reset daily spend after 24 hours

  14 passing (2s)
```

---

## Contributing

AgentPay is early infrastructure. Contributions focused on stability, security, and production readiness are welcome.

**Priority areas:**
- Gas optimization
- Security hardening
- SDK improvements
- Documentation

Open an issue or PR on GitHub.

---

## License

MIT

---

## Contact

Built for Polygon Hackathon 2025

**AgentPay** — Foundational payment infrastructure for autonomous agents on Polygon.
