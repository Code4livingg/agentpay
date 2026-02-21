# AgentPay

> Policy-bound USDC micro-payments for AI agents on Polygon — smart contract enforced spending limits, fully auditable on-chain.

## The Problem

Today, AI agents already pay indirectly for LLM inference, data APIs, and SaaS tools. Someone has to manually top up credits, manage API keys, and reconcile invoices. AgentPay removes the need for manual payment approval inside these production workflows.

## Our Solution

Policy-bound USDC (ERC-20) micro-payments on Polygon PoS. Humans define rules once. Smart contract enforces them on-chain. Agent operates autonomously within those bounds.

Agents do not initiate arbitrary payments — payments occur only when a predefined tool or API call requires payment AND passes all policy checks.

## Threat Model

AgentPay assumes agents may be buggy or compromised. All financial authority lives at the smart contract layer, never in agent logic. In a full agent compromise scenario, maximum loss is strictly bounded by on-chain policy limits.

## Security Controls

- Hard cap per transaction (contract-enforced)
- Daily spending ceiling (contract-enforced)
- Whitelist of approved recipients only
- One-click human pause at any time
- All limits enforced on-chain, not in AI logic
- SDK performs pre-check for UX efficiency, but smart contract is the final source of truth and will revert any out-of-policy transaction on-chain

## How It Works

**Flow 1 — x402 Payment Loop**

1. AI agent calls a paid API endpoint
2. Server responds with 402 Payment Required + payment details
3. AgentPay SDK checks policy (pre-check)
4. Smart contract enforces policy (final check)
5. USDC transferred to recipient on Polygon
6. API retried with payment proof header
7. Agent receives data — zero human clicks

**Flow 2 — Policy Enforcement**

- Agent attempts payment above limit → contract reverts
- Agent attempts payment to non-whitelisted address → contract reverts
- Human pauses agent → all payments stop instantly

**Flow 3 — Audit Trail**

- Every transaction logged on-chain via events
- Dashboard shows real-time feed
- Human can update policy or pause anytime

## Why Polygon

x402 is an emerging open payment standard with official SDK support for TypeScript and Python. Polygon PoS gas fees (~$0.001) make $0.003 API micro-payments economically viable. AgentPay is designed to accelerate x402 adoption on Polygon.

## Contracts (Polygon Amoy Testnet)

| Contract | Address |
|----------|---------|
| AgentVault | [0x522996599e987d03cc9f07e77c3c11a3C23dE225](https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code) |
| PolicyRegistry | [0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6](https://amoy.polygonscan.com/address/0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6#code) |
| USDC (ERC-20, Amoy Testnet) | 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582 |

## Target Users

- AI customer support platforms paying per-API-call
- Autonomous research agents consuming data feeds
- LLM routing platforms managing inference costs
- Agent-based trading systems with strict spend controls

## Business Model

0.25% on agent transaction volume. B2B: sold to companies deploying production AI agents. As AI agent usage scales, transaction volume scales automatically with no additional sales overhead.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity, Hardhat, OpenZeppelin |
| Blockchain | Polygon PoS (Amoy Testnet) |
| Token | USDC (ERC-20) |
| Payment Protocol | x402 (emerging open standard) |
| AI Agent | Python, LangChain |
| Backend | FastAPI (Python) |
| Frontend | Next.js 14, Tailwind CSS |
| Testing | Hardhat (14 tests passing) |

## Live Demo

- **Frontend:** https://agentpay-henna.vercel.app
- **Contracts:** Verified on Polygonscan (links above)
- **Demo Video:** [link]

## Run Locally

**Backend:**

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Smart Contracts:**

```bash
cd contracts
npm install
npx hardhat test
npx hardhat run scripts/deploy.js --network amoy
```

**Agent Demo:**

```bash
cd backend
source venv/bin/activate
MOCK_PAYMENT=true python agent_demo.py
```

## Project Structure

```
agentpay/
├── contracts/          # Solidity smart contracts
│   ├── contracts/
│   │   ├── PolicyRegistry.sol
│   │   └── AgentVault.sol
│   ├── test/
│   └── scripts/
├── backend/            # FastAPI backend + Python SDK
│   ├── main.py
│   ├── agent.py
│   ├── agent_demo.py
│   └── sdk/
│       └── agentpay_client.py
└── frontend/           # Next.js dashboard
    └── app/
        ├── page.tsx
        ├── dashboard/
        └── demo/
```

## Testing

**Smart Contract Tests:**

```bash
cd contracts
npx hardhat test
```

Output:
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

## Security Considerations

1. **Smart Contract Layer**: All financial logic enforced on-chain
2. **Policy Immutability**: Policies can only be updated by contract owner
3. **Whitelist Enforcement**: Payments only to pre-approved addresses
4. **Daily Caps**: Automatic reset every 24 hours
5. **Emergency Pause**: Owner can pause any agent instantly
6. **Audit Trail**: All transactions logged via events

## Future Roadmap

- [ ] Multi-chain support (Ethereum L2s, Base, Arbitrum)
- [ ] Dynamic policy updates via governance
- [ ] Agent reputation scoring
- [ ] Batch payment optimization
- [ ] Integration with major AI frameworks
- [ ] Mainnet deployment

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

## Contact

Built for Polygon Hackathon 2025

---

**AgentPay** — Autonomous payments for autonomous agents.
