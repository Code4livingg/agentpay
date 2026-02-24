# AgentPay - Polygon Buildathon Submission

## Canonical Positioning

**AgentPay is the policy-enforced execution layer that prevents autonomous AI agents from becoming financially unbounded.**

---

## What AgentPay Is

AgentPay is **execution governance infrastructure** for autonomous agents on Polygon.

It is NOT:
- An AI payments app
- A payment dashboard
- A crypto payment tool
- An AI transaction platform

It IS:
- A financial control layer
- A deterministic execution governance system
- A policy-bound constraint infrastructure
- An autonomous agent containment layer

---

## The Problem

As AI agents begin executing financial actions independently, unconstrained autonomy introduces systemic risk.

**Without bounded execution:**
- Runaway agents drain funds without limit
- No deterministic control over spending behavior
- No cryptographic proof of execution
- Compromised agents cause unbounded financial damage

**Traditional payment systems assume human oversight. Autonomous agents operate continuously at machine scale.**

---

## The Solution

AgentPay formalizes bounded, deterministic execution on Polygon through enforceable on-chain policy.

### 1. Bounded Execution
- Financial authority is limited by on-chain policy
- Spending limits (`maxPerTx`, `dailyCap`) constrain agent behavior
- Execution authority is not unlimited

### 2. Deterministic Control
- Smart contract logic enforces predictable outcomes
- No discretionary backend overrides
- Execution is rule-bound, not heuristic

### 3. Receipt-Level Verification
- Transactions validated via confirmed receipts
- Block number and gas usage surfaced
- Event decoding ensures verified settlement
- No reliance on block scanning assumptions

### 4. Machine-Scale Safety
- Designed for autonomous systems operating continuously
- Built for high-frequency agent execution
- Prevents runaway economic behavior

### 5. Polygon-Native Infrastructure
- Low fees enable scalable machine-to-machine transactions
- Fast finality supports deterministic confirmation
- EVM compatibility for standard Solidity contracts

---

## Architecture

```
Human Operator
    ↓
Sets Policy (maxPerTx, dailyCap, whitelist)
    ↓
PolicyRegistry.sol (on-chain policy storage)
    ↓
AgentVault.sol (execution enforcement)
    ↓
USDC Transfer (if policy check passes)
    ↓
Receipt Verification (block + gas + event)
    ↓
Dashboard (verified execution feed)
```

**Key Point:** The smart contract is the final authority. SDK pre-checks are for UX only.

---

## Execution Flow

1. **Agent calls paid API** → Receives 402 Payment Required
2. **SDK pre-checks policy** → Validates against local policy cache
3. **Contract enforces policy** → On-chain validation (final authority)
4. **USDC transferred** → If policy check passes
5. **Receipt verified** → Block number, gas used, event decoded
6. **API retried** → With payment proof header
7. **Data returned** → Agent receives response

**Every step is deterministic and verifiable.**

---

## Competitive Differentiation

### AgentPay is NOT a payment app
Most blockchain payment projects enable transactions. AgentPay **constrains and governs** them.

### Key Differentiators

1. **Bounded Execution**
   - Other projects: Enable unlimited spending
   - AgentPay: Limits financial authority by policy

2. **Deterministic Control**
   - Other projects: Heuristic or discretionary logic
   - AgentPay: Rule-bound smart contract enforcement

3. **Receipt-Level Verification**
   - Other projects: Assume block scanning works
   - AgentPay: Validates via confirmed receipts

4. **Machine-Scale Safety**
   - Other projects: Designed for human users
   - AgentPay: Built for autonomous, high-frequency execution

5. **Execution Governance**
   - Other projects: Payment infrastructure
   - AgentPay: Financial control layer

---

## Why Polygon

1. **Low latency** — ~2 second block times enable deterministic confirmation
2. **Low cost** — $0.001 gas fees make machine-scale execution viable
3. **EVM compatibility** — Standard Solidity, no custom VM
4. **Production-grade** — Battle-tested infrastructure

Polygon's execution environment makes bounded, deterministic agent execution practical at scale.

---

## Technical Implementation

### Smart Contracts (Solidity 0.8.20)
- **PolicyRegistry.sol** — Stores execution policies per agent
- **AgentVault.sol** — Enforces policy and executes transfers
- **14 tests passing** — Full policy enforcement coverage

### Backend (Python 3.11, FastAPI)
- **Real on-chain execution** — No mock mode in production
- **Receipt-based verification** — Decodes events from confirmed receipts
- **Graceful error handling** — RPC failures, transaction reverts

### Frontend (Next.js 14, TypeScript)
- **Execution feed** — Block number, gas used, status
- **Policy management** — Edit limits, whitelist, pause
- **Receipt verification** — Clickable Polygonscan links

### SDK (Python, Web3.py)
- **402 payment protocol** — Intercepts payment required responses
- **Policy pre-check** — Local validation for UX
- **Contract execution** — Final on-chain enforcement

---

## Execution Governance Model

### Threat: Agent Compromise
**Mitigation:** Financial authority is bounded. Maximum loss is capped by policy.

### Threat: Runaway Spending
**Mitigation:** Contract reverts out-of-policy transactions. Deterministic enforcement.

### Threat: Unauthorized Recipients
**Mitigation:** Whitelist enforced on-chain. No discretionary overrides.

### Threat: Loss of Control
**Mitigation:** Human operator can pause execution authority instantly.

### Threat: Unverified Execution
**Mitigation:** Receipt-level verification. Block + gas + event decoding.

---

## Contract Addresses (Polygon Amoy Testnet)

| Contract | Address | Status |
|----------|---------|--------|
| AgentVault | [0x522996599e987d03cc9f07e77c3c11a3C23dE225](https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code) | ✅ Verified |
| PolicyRegistry | [0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6](https://amoy.polygonscan.com/address/0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6#code) | ✅ Verified |

---

## Demo

**Live Frontend:** https://agentpay-henna.vercel.app

**Test Execution:**
```bash
cd backend
source venv/bin/activate
python test_payment.py
```

**Expected Output:**
- Transaction executes within policy limits
- Receipt returned with block number and gas used
- Execution appears in dashboard feed

---

## Roadmap

### Phase 1: Testnet Validation (Current)
- ✅ Core contracts deployed and verified
- ✅ Real on-chain execution
- ✅ Receipt-based verification
- ✅ Policy enforcement tested

### Phase 2: Mainnet Preparation (Q2 2026)
- Multi-signature policy updates
- Gas optimization for high-frequency execution
- Batch execution support
- Security audit

### Phase 3: Production Deployment (Q3 2026)
- Polygon PoS mainnet deployment
- Production SDK release
- Framework integrations (LangChain, AutoGPT)

### Phase 4: Protocol Expansion (Q4 2026)
- Multi-chain support (Ethereum L2s, Base, Arbitrum)
- Dynamic policy updates via governance
- Agent reputation scoring

---

## Key Insight

**AgentPay does not enable AI payments. It constrains and governs AI financial execution.**

This is not a payment app. It is a financial control layer for autonomous agents.

When judges evaluate AgentPay, they should understand:
- It prevents unbounded agent execution
- It enforces deterministic, rule-bound control
- It provides receipt-level verification
- It is designed for machine-scale safety

**AgentPay is execution governance infrastructure for autonomous agents on Polygon.**

---

## Team

Built for Polygon Buildathon 2025

## Links

- **GitHub:** https://github.com/Code4livingg/agentpay
- **Frontend:** https://agentpay-henna.vercel.app
- **Contracts:** Verified on Polygonscan (see addresses above)

---

**AgentPay** — The policy-enforced execution layer that prevents autonomous AI agents from becoming financially unbounded.
