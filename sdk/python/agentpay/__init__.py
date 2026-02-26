import requests


class AgentPayClient:
    def __init__(self, backend_url: str, agent_id: str):
        self.backend_url = backend_url.rstrip("/")
        self.agent_id = agent_id

    def execute_payment(self, amount: float, recipient: str) -> dict:
        resp = requests.post(f"{self.backend_url}/execute-demo", timeout=180)
        resp.raise_for_status()
        return resp.json()

    def get_executions(self) -> list:
        resp = requests.get(f"{self.backend_url}/executions", timeout=30)
        resp.raise_for_status()
        return resp.json().get("executions", [])

    def get_vault_balance(self) -> str:
        resp = requests.get(f"{self.backend_url}/vault-balance", timeout=30)
        resp.raise_for_status()
        return resp.json().get("balance_usdc", "0.00")
