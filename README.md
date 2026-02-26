# AgentPay

AgentPay is a smart contract–enforced financial control layer that lets autonomous AI agents execute blockchain payments within deterministic policy boundaries.

## Problem
Autonomous agents can execute payments, but existing tools were designed for humans and don’t enforce deterministic, on-chain limits. This creates risk: overspending, policy drift, and opaque execution trails. Teams need machine-native controls with verifiable enforcement.

## Solution
AgentPay adds an on-chain policy gate via the AgentVault contract and indexes real executions for real-time visibility. Agents can trigger payments through a backend API while policy enforcement remains on-chain. A dashboard surfaces live executions, balances, and network context.

## Architecture
```
AI Agent -> Backend API -> AgentVault Contract -> Polygon Amoy
```

## Quickstart
```bash
# 1) Clone

git clone https://github.com/Code4livingg/agentpay.git
cd agentpay

# 2) Backend
pip install -r backend/requirements.txt
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000

# 3) Frontend
cd ../frontend
npm install
npm run dev

# 4) Run demo agent
BACKEND_URL=http://127.0.0.1:8000 python3 ../backend/scripts/run_execute_demo.py
```

## SDK (Python)
```python
from agentpay import AgentPayClient

client = AgentPayClient("https://your-backend.onrender.com", agent_id="weather_agent")
print(client.get_vault_balance())
tx = client.execute_payment(0.50, "0xRecipient")
executions = client.get_executions()
print(tx, executions)
```

## Contract (Polygon Amoy)
AgentVault: [0x522996599e987d03cc9f07e77c3c11a3C23dE225](https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code)

## Debug Endpoints
- `GET /debug/db-status` — DB backend, row count, schema
- `GET /vault-balance` — USDC balance for the agent vault

## Competitive Differentiation
| Capability | AgentPay | Gnosis Safe Limits | ERC-4337 Paymasters |
|---|---|---|---|
| Designed for AI agents (not humans) | ✅ | ❌ | ⚠️ |
| On-chain policy enforcement | ✅ | ⚠️ | ⚠️ |
| Backend-agnostic execution | ✅ | ❌ | ⚠️ |
| Real-time event indexing | ✅ | ❌ | ❌ |
| Machine-to-machine native | ✅ | ❌ | ⚠️ |
| Polygon-native | ✅ | ⚠️ | ⚠️ |

## Roadmap
- Wave 1 (Current) — Core infrastructure: AgentVault contract, policy enforcement, execution indexing, observability dashboard
- Wave 2 (Next) — Developer SDK release, multi-agent support (multiple agent_ids per vault), automated event polling replacing manual trigger
- Wave 3 — Polygon mainnet deployment, first external developer integrations, agent marketplace prototype
- Wave 4 — AggLayer integration for cross-chain agent execution, DAO-controlled policy governance, production SLA
