from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import json
import os
import time
import hashlib
from datetime import datetime
from dotenv import load_dotenv

# Import contract instance from SDK
from sdk.agentpay_client import agent_vault, MOCK_MODE, DEPLOYMENT_BLOCK

load_dotenv()

app = FastAPI(title="AgentPay API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_PATH = "db/transactions.db"

def init_db():
    """Initialize SQLite database"""
    os.makedirs("db", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id TEXT,
            recipient TEXT,
            amount_usdc REAL,
            tx_hash TEXT,
            status TEXT,
            block_reason TEXT,
            timestamp INTEGER,
            created_at TEXT
        )
    """)
    
    # Add block_number and gas_used columns if they don't exist
    try:
        cursor.execute("ALTER TABLE transactions ADD COLUMN block_number INTEGER DEFAULT 0")
    except:
        pass
    
    try:
        cursor.execute("ALTER TABLE transactions ADD COLUMN gas_used INTEGER DEFAULT 0")
    except:
        pass
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models
class Transaction(BaseModel):
    agent_id: str
    recipient: str
    amount_usdc: float
    tx_hash: str
    status: str
    block_reason: Optional[str] = None
    timestamp: int

# Mock Paid API Endpoints
@app.get("/api/weather")
async def get_weather(x_payment_proof: Optional[str] = Header(None)):
    """Weather API endpoint requiring payment"""
    if not x_payment_proof:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Payment Required",
                "amount": "0.001",
                "token": "USDC",
                "token_address": "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
                "network": "Polygon Amoy Testnet",
                "recipient": "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe",
                "description": "Weather API - per request fee"
            }
        )
    
    # Generate realistic hash if mock
    agent_id = "weather_agent"
    tx_hash = x_payment_proof
    block_number = 0
    gas_used = 0
    
    if tx_hash.startswith("0xMOCK_TX_"):
        tx_hash = "0x" + hashlib.sha256(f"{agent_id}{time.time()}".encode()).hexdigest()
    else:
        # If real transaction, fetch block_number and gas_used from receipt
        if not MOCK_MODE and agent_vault is not None:
            try:
                from sdk.agentpay_client import w3
                receipt = w3.eth.get_transaction_receipt(x_payment_proof)
                block_number = receipt['blockNumber']
                gas_used = receipt['gasUsed']
            except:
                pass
    
    # Save transaction to database when payment proof is received
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    created_at = datetime.utcnow().isoformat()
    timestamp = int(time.time())
    
    cursor.execute("""
        INSERT INTO transactions 
        (agent_id, recipient, amount_usdc, tx_hash, status, timestamp, created_at, block_number, gas_used)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        agent_id,
        "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe",
        0.001,
        tx_hash,
        "success",
        timestamp,
        created_at,
        block_number,
        gas_used
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "city": "Bangalore",
        "temperature": "28°C",
        "condition": "Partly Cloudy",
        "humidity": "65%",
        "paid": True,
        "payment_proof": x_payment_proof
    }

@app.get("/api/data-feed")
async def get_data_feed(x_payment_proof: Optional[str] = Header(None)):
    """Data Feed API endpoint requiring payment"""
    if not x_payment_proof:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Payment Required",
                "amount": "0.002",
                "token": "USDC",
                "token_address": "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
                "network": "Polygon Amoy Testnet",
                "recipient": "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe",
                "description": "Data Feed API"
            }
        )
    
    # Generate realistic hash if mock
    agent_id = "weather_agent"
    tx_hash = x_payment_proof
    block_number = 0
    gas_used = 0
    
    if tx_hash.startswith("0xMOCK_TX_"):
        tx_hash = "0x" + hashlib.sha256(f"{agent_id}{time.time()}".encode()).hexdigest()
    else:
        # If real transaction, fetch block_number and gas_used from receipt
        if not MOCK_MODE and agent_vault is not None:
            try:
                from sdk.agentpay_client import w3
                receipt = w3.eth.get_transaction_receipt(x_payment_proof)
                block_number = receipt['blockNumber']
                gas_used = receipt['gasUsed']
            except:
                pass
    
    # Save transaction to database when payment proof is received
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    created_at = datetime.utcnow().isoformat()
    timestamp = int(time.time())
    
    cursor.execute("""
        INSERT INTO transactions 
        (agent_id, recipient, amount_usdc, tx_hash, status, timestamp, created_at, block_number, gas_used)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        agent_id,
        "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe",
        0.002,
        tx_hash,
        "success",
        timestamp,
        created_at,
        block_number,
        gas_used
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "market": "crypto",
        "btc_price": "45000",
        "eth_price": "2800",
        "trend": "bullish",
        "paid": True,
        "payment_proof": x_payment_proof
    }

# Dashboard API Endpoints
@app.get("/transactions")
async def get_transactions():
    """Get last 50 transactions"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM transactions 
        ORDER BY timestamp DESC 
        LIMIT 50
    """)
    
    rows = cursor.fetchall()
    conn.close()
    
    transactions = []
    for row in rows:
        tx = dict(row)
        tx['tx_url'] = f"https://amoy.polygonscan.com/tx/{tx['tx_hash']}"
        transactions.append(tx)
    
    return {"transactions": transactions}

@app.get("/transactions/onchain")
async def get_onchain_transactions():
    """Get on-chain transactions from SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM transactions 
        ORDER BY timestamp DESC 
        LIMIT 50
    """)
    
    rows = cursor.fetchall()
    conn.close()
    
    transactions = []
    for row in rows:
        tx = dict(row)
        tx['tx_url'] = f"https://amoy.polygonscan.com/tx/{tx['tx_hash']}"
        # Ensure block_number and gas_used have default values if not in DB
        if 'block_number' not in tx or tx['block_number'] is None:
            tx['block_number'] = 0
        if 'gas_used' not in tx or tx['gas_used'] is None:
            tx['gas_used'] = 0
        transactions.append(tx)
    
    return {"transactions": transactions}

@app.post("/transactions")
async def create_transaction(transaction: Transaction):
    """Save a new transaction"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    created_at = datetime.utcnow().isoformat()
    block_number = 0
    gas_used = 0
    
    # If real transaction, fetch block_number and gas_used from receipt
    if not transaction.tx_hash.startswith("0xMOCK_TX_") and not MOCK_MODE and agent_vault is not None:
        try:
            from sdk.agentpay_client import w3
            receipt = w3.eth.get_transaction_receipt(transaction.tx_hash)
            block_number = receipt['blockNumber']
            gas_used = receipt['gasUsed']
        except:
            pass
    
    cursor.execute("""
        INSERT INTO transactions 
        (agent_id, recipient, amount_usdc, tx_hash, status, block_reason, timestamp, created_at, block_number, gas_used)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        transaction.agent_id,
        transaction.recipient,
        transaction.amount_usdc,
        transaction.tx_hash,
        transaction.status,
        transaction.block_reason,
        transaction.timestamp,
        created_at,
        block_number,
        gas_used
    ))
    
    conn.commit()
    transaction_id = cursor.lastrowid
    conn.close()
    
    return {
        "id": transaction_id,
        "message": "Transaction saved successfully",
        **transaction.dict()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "network": "Polygon Amoy Testnet"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
