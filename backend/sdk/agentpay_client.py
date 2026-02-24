"""
AgentPay Client SDK
Implements on-chain payment execution flow for AI agents on Polygon Amoy
"""

import os
import json
import asyncio
from typing import Dict, Any
from pathlib import Path
from web3 import Web3
from eth_account import Account
import httpx
from dotenv import load_dotenv

# Load environment variables from parent directory
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Environment variables
ALCHEMY_RPC = os.getenv("ALCHEMY_RPC")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
AGENT_VAULT_ADDRESS = os.getenv("AGENT_VAULT_ADDRESS")
USDC_ADDRESS = os.getenv("USDC_ADDRESS")
BACKEND_URL = "http://127.0.0.1:8000"

# Contract deployment block on Polygon Amoy
DEPLOYMENT_BLOCK = 33980000

# Mock mode flag
MOCK_MODE = os.getenv("MOCK_PAYMENT", "false").lower() == "true"

# Validate required environment variables (skip in mock mode)
if not MOCK_MODE:
    # Validate required environment variables (skip in mock mode)
    if not ALCHEMY_RPC:
        raise ValueError("ALCHEMY_RPC not found in environment variables")
    if not PRIVATE_KEY:
        raise ValueError("PRIVATE_KEY not found in environment variables")
    if not AGENT_VAULT_ADDRESS:
        raise ValueError("AGENT_VAULT_ADDRESS not found in environment variables")
    if not USDC_ADDRESS:
        raise ValueError("USDC_ADDRESS not found in environment variables")

# Initialize Web3 and contracts (skip in mock mode)
if not MOCK_MODE:
    # Initialize Web3
    w3 = Web3(Web3.HTTPProvider(ALCHEMY_RPC))

    # Verify connection
    if not w3.is_connected():
        raise ConnectionError(f"Failed to connect to Polygon Amoy via {ALCHEMY_RPC}")

    print(f"[✓] Connected to Polygon Amoy")
    print(f"[✓] Chain ID: {w3.eth.chain_id}")
    print(f"[DEBUG] RPC URL: {ALCHEMY_RPC}")

    # Load account
    try:
        account = Account.from_key(PRIVATE_KEY)
        print(f"[✓] Account loaded: {account.address}")
        print(f"[DEBUG] Backend wallet address: {account.address}")
    except Exception as e:
        raise ValueError(f"Failed to load account from PRIVATE_KEY: {str(e)}")

    # Load AgentVault ABI
    abi_path = Path(__file__).parent.parent.parent / "contracts" / "artifacts" / "contracts" / "AgentVault.sol" / "AgentVault.json"

    if not abi_path.exists():
        raise FileNotFoundError(f"AgentVault ABI not found at {abi_path}")

    try:
        with open(abi_path, "r") as f:
            contract_json = json.load(f)
            AGENT_VAULT_ABI = contract_json["abi"]
        print(f"[✓] AgentVault ABI loaded")
    except Exception as e:
        raise ValueError(f"Failed to load AgentVault ABI: {str(e)}")

    # Create contract instance
    try:
        agent_vault = w3.eth.contract(
            address=Web3.to_checksum_address(AGENT_VAULT_ADDRESS),
            abi=AGENT_VAULT_ABI
        )
        print(f"[✓] AgentVault contract initialized at {AGENT_VAULT_ADDRESS}")
    except Exception as e:
        raise ValueError(f"Failed to initialize AgentVault contract: {str(e)}")
else:
    print(f"[✓] Running in MOCK MODE - no blockchain connection required")
    w3 = None
    account = None
    agent_vault = None


async def call_paid_endpoint(agent_id: str, endpoint: str) -> dict:
    """
    Call a paid API endpoint with automatic on-chain payment execution
    
    Args:
        agent_id: Agent identifier
        endpoint: Full URL of the paid endpoint
        
    Returns:
        Response JSON from the paid endpoint
        
    Raises:
        Exception: If payment or endpoint call fails
    """
    
    async with httpx.AsyncClient() as client:
        # STEP 1: Initial endpoint call
        print(f"[1] Calling endpoint")
        response = await client.get(endpoint)
        
        # If not 402, return response directly
        if response.status_code != 402:
            return response.json()
        
        # STEP 2: Parse 402 payment required response
        print("[2] 402 detected")
        payment_info = response.json()
        
        # FastAPI HTTPException wraps the detail
        if "detail" in payment_info:
            payment_info = payment_info["detail"]
        
        amount = float(payment_info["amount"])
        recipient = payment_info["recipient"]
        token = payment_info["token"]
        network = payment_info["network"]
        
        # STEP 3: Prepare and execute transaction
        print("[3] Executing on-chain payment")
        
        # Convert agent_id to bytes32
        agent_id_bytes = Web3.keccak(text=agent_id)
        
        # Convert USDC amount to 6 decimal units
        amount_units = int(amount * 10**6)
        
        # Prepare recipient address
        recipient_address = Web3.to_checksum_address(recipient)
        
        # Build transaction
        nonce = w3.eth.get_transaction_count(account.address)
        
        transaction = agent_vault.functions.executePayment(
            agent_id_bytes,
            recipient_address,
            amount_units
        ).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': w3.to_wei(30, "gwei"),
            'chainId': 80002
        })
        
        # Sign and send transaction
        signed_txn = account.sign_transaction(transaction)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        tx_hash_hex = tx_hash.hex()
        
        # Wait for receipt
        try:
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        except Exception as e:
            raise Exception(f"Transaction timeout or RPC error: {str(e)}")
        
        if receipt['status'] == 0:
            raise Exception("On-chain payment transaction reverted - policy check failed or insufficient balance")
        
        print(f"[4] Transaction confirmed: {tx_hash_hex}")
        
        # STEP 5: Retry endpoint with payment proof
        print("[5] Retrying endpoint")
        
        headers = {"X-Payment-Proof": tx_hash_hex}
        response = await client.get(endpoint, headers=headers)
        
        print("[6] Success")
        
        return response.json()


async def main():
    """Example usage"""
    agent_id = "agent-001"
    endpoint = "http://127.0.0.1:8000/api/weather"
    
    try:
        result = await call_paid_endpoint(agent_id, endpoint)
        print("\n=== Result ===")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"\n[✗] Error: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main())
