# AgentPay Python SDK

Quickstart:

```bash
pip install -e sdk/python
```

```python
from agentpay import AgentPayClient

client = AgentPayClient("https://your-backend.onrender.com", agent_id="weather_agent")
print(client.get_vault_balance())
tx = client.execute_payment(0.50, "0xRecipient")
print(tx)
print(client.get_executions())
```
