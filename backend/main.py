from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import time
import hashlib
import sqlite3
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from urllib.parse import urlparse
from web3 import Web3

# Import contract instance from SDK
from sdk.agentpay_client import (
    agent_vault,
    MOCK_MODE,
    w3,
    AGENT_VAULT_ADDRESS,
)

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()

app = FastAPI(title="AgentPay API")

# CORS configuration
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Database:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.backend = "postgres" if database_url.startswith(("postgres://", "postgresql://", "postgresql+asyncpg://")) else "sqlite"
        self.sqlite_path = "db/transactions.db"
        self.pg_pool = None

    async def init(self):
        if self.backend == "sqlite":
            os.makedirs("db", exist_ok=True)
            await asyncio.to_thread(self._sqlite_init)
            return

        try:
            import asyncpg
        except ImportError:
            raise RuntimeError(
                "DATABASE_URL points to Postgres but asyncpg is not installed. "
                "Install backend requirements before starting in Postgres mode."
            )

        pg_url = self.database_url
        if pg_url.startswith("postgresql+asyncpg://"):
            pg_url = pg_url.replace("postgresql+asyncpg://", "postgresql://", 1)
        elif pg_url.startswith("postgres://"):
            pg_url = pg_url.replace("postgres://", "postgresql://", 1)

        self.pg_pool = await asyncpg.create_pool(pg_url)
        async with self.pg_pool.acquire() as conn:
            await conn.execute(
                """
                CREATE TABLE IF NOT EXISTS transactions (
                    id BIGSERIAL PRIMARY KEY,
                    agent_id TEXT NOT NULL,
                    recipient TEXT NOT NULL,
                    amount_usdc DOUBLE PRECISION NOT NULL,
                    tx_hash TEXT NOT NULL UNIQUE,
                    status TEXT NOT NULL,
                    block_reason TEXT,
                    timestamp BIGINT NOT NULL,
                    created_at TEXT NOT NULL,
                    block_number BIGINT NOT NULL DEFAULT 0,
                    gas_used BIGINT NOT NULL DEFAULT 0
                )
                """
            )

    def _sqlite_init(self):
        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                agent_id TEXT NOT NULL,
                recipient TEXT NOT NULL,
                amount_usdc REAL NOT NULL,
                tx_hash TEXT NOT NULL UNIQUE,
                status TEXT NOT NULL,
                block_reason TEXT,
                timestamp INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                block_number INTEGER NOT NULL DEFAULT 0,
                gas_used INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        conn.commit()
        conn.close()

    async def insert_transaction(self, payload: dict) -> int:
        if self.backend == "sqlite":
            return await asyncio.to_thread(self._sqlite_insert, payload)

        async with self.pg_pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO transactions (
                    agent_id, recipient, amount_usdc, tx_hash, status, block_reason,
                    timestamp, created_at, block_number, gas_used
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                ON CONFLICT (tx_hash) DO NOTHING
                RETURNING id
                """,
                payload["agent_id"],
                payload["recipient"],
                payload["amount_usdc"],
                payload["tx_hash"],
                payload["status"],
                payload["block_reason"],
                payload["timestamp"],
                payload["created_at"],
                payload["block_number"],
                payload["gas_used"],
            )

            if not row:
                raise HTTPException(status_code=409, detail={"error": "Duplicate transaction hash"})
            return int(row["id"])

    def _sqlite_insert(self, payload: dict) -> int:
        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        try:
            cur.execute(
                """
                INSERT INTO transactions (
                    agent_id, recipient, amount_usdc, tx_hash, status, block_reason,
                    timestamp, created_at, block_number, gas_used
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    payload["agent_id"],
                    payload["recipient"],
                    payload["amount_usdc"],
                    payload["tx_hash"],
                    payload["status"],
                    payload["block_reason"],
                    payload["timestamp"],
                    payload["created_at"],
                    payload["block_number"],
                    payload["gas_used"],
                ),
            )
            conn.commit()
            return int(cur.lastrowid)
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=409, detail={"error": "Duplicate transaction hash"})
        finally:
            conn.close()

    async def fetch_transactions(self, limit: int = 50):
        if self.backend == "sqlite":
            return await asyncio.to_thread(self._sqlite_fetch, limit)

        async with self.pg_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, agent_id, recipient, amount_usdc, tx_hash, status, block_reason,
                       timestamp, created_at, block_number, gas_used
                FROM transactions
                ORDER BY timestamp DESC
                LIMIT $1
                """,
                limit,
            )
            return [dict(row) for row in rows]

    def _sqlite_fetch(self, limit: int):
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, agent_id, recipient, amount_usdc, tx_hash, status, block_reason,
                   timestamp, created_at, block_number, gas_used
            FROM transactions
            ORDER BY timestamp DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

    async def tx_hash_exists(self, tx_hash: str) -> bool:
        if self.backend == "sqlite":
            return await asyncio.to_thread(self._sqlite_exists, tx_hash)

        async with self.pg_pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT 1 FROM transactions WHERE tx_hash = $1 LIMIT 1",
                tx_hash,
            )
            return row is not None

    def _sqlite_exists(self, tx_hash: str) -> bool:
        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM transactions WHERE tx_hash = ? LIMIT 1", (tx_hash,))
        row = cur.fetchone()
        conn.close()
        return row is not None


DEFAULT_SQLITE_URL = "sqlite:///./db/transactions.db"


def _resolve_database_url() -> str:
    raw = os.getenv("DATABASE_URL")
    if not raw:
        return DEFAULT_SQLITE_URL

    if raw.startswith(("postgres://", "postgresql://", "postgresql+asyncpg://")):
        normalized = raw.replace("postgresql+asyncpg://", "postgresql://", 1)
        host = urlparse(normalized).hostname
        if os.getenv("RENDER") and host in {"localhost", "127.0.0.1", "::1"}:
            print("[!] DATABASE_URL points to localhost on Render; falling back to SQLite.")
            return DEFAULT_SQLITE_URL

    return raw


DATABASE_URL = _resolve_database_url()
db = Database(DATABASE_URL)


@app.on_event("startup")
async def on_startup():
    await db.init()


class Transaction(BaseModel):
    agent_id: str
    recipient: str
    amount_usdc: float
    tx_hash: str
    status: str
    block_reason: Optional[str] = None
    timestamp: int


def _validate_payment_proof(
    tx_hash: str,
    *,
    expected_agent_id: str,
    expected_recipient: str,
    expected_amount_usdc: float,
) -> dict:
    if MOCK_MODE and tx_hash.startswith("0xMOCK_TX_"):
        normalized_hash = "0x" + hashlib.sha256(f"{expected_agent_id}:{tx_hash}".encode()).hexdigest()
        return {"tx_hash": normalized_hash, "block_number": 0, "gas_used": 0}

    if not tx_hash.startswith("0x") or len(tx_hash) != 66:
        raise HTTPException(status_code=402, detail={"error": "Invalid payment proof format"})

    if MOCK_MODE:
        raise HTTPException(status_code=402, detail={"error": "Mock mode only accepts mock payment proofs"})

    if not all([w3, agent_vault, AGENT_VAULT_ADDRESS]):
        raise HTTPException(status_code=500, detail={"error": "Payment verifier is not configured"})

    try:
        receipt = w3.eth.get_transaction_receipt(tx_hash)
    except Exception:
        raise HTTPException(status_code=402, detail={"error": "Payment transaction not found"})

    if receipt.get("status") != 1:
        raise HTTPException(status_code=402, detail={"error": "Payment transaction failed"})

    to_address = receipt.get("to")
    if not to_address or to_address.lower() != AGENT_VAULT_ADDRESS.lower():
        raise HTTPException(status_code=402, detail={"error": "Payment tx did not target AgentVault"})

    try:
        events = agent_vault.events.PaymentExecuted().process_receipt(receipt)
    except Exception:
        raise HTTPException(status_code=402, detail={"error": "Unable to decode payment event"})

    expected_agent_id_bytes = Web3.keccak(text=expected_agent_id)
    expected_recipient_checksum = Web3.to_checksum_address(expected_recipient)
    expected_amount_units = int(expected_amount_usdc * 10**6)

    valid = False
    for event in events:
        args = event["args"]
        if (
            args["agentId"] == expected_agent_id_bytes
            and args["recipient"].lower() == expected_recipient_checksum.lower()
            and int(args["amount"]) == expected_amount_units
        ):
            valid = True
            break

    if not valid:
        raise HTTPException(status_code=402, detail={"error": "Payment proof does not match endpoint requirements"})

    return {
        "tx_hash": tx_hash,
        "block_number": int(receipt.get("blockNumber", 0) or 0),
        "gas_used": int(receipt.get("gasUsed", 0) or 0),
    }


async def _insert_paid_transaction(
    *,
    agent_id: str,
    recipient: str,
    amount_usdc: float,
    tx_hash: str,
    block_number: int,
    gas_used: int,
):
    if await db.tx_hash_exists(tx_hash):
        raise HTTPException(status_code=409, detail={"error": "Payment proof has already been used"})

    payload = {
        "agent_id": agent_id,
        "recipient": recipient,
        "amount_usdc": amount_usdc,
        "tx_hash": tx_hash,
        "status": "success",
        "block_reason": None,
        "timestamp": int(time.time()),
        "created_at": datetime.utcnow().isoformat(),
        "block_number": block_number,
        "gas_used": gas_used,
    }
    await db.insert_transaction(payload)


@app.get("/api/weather")
async def get_weather(x_payment_proof: Optional[str] = Header(None)):
    recipient = "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe"
    amount = 0.001
    agent_id = "weather_agent"

    if not x_payment_proof:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Payment Required",
                "amount": f"{amount:.3f}",
                "token": "USDC",
                "token_address": "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
                "network": "Polygon Amoy Testnet",
                "recipient": recipient,
                "description": "Weather API - per request fee",
            },
        )

    verification = _validate_payment_proof(
        x_payment_proof,
        expected_agent_id=agent_id,
        expected_recipient=recipient,
        expected_amount_usdc=amount,
    )
    await _insert_paid_transaction(
        agent_id=agent_id,
        recipient=recipient,
        amount_usdc=amount,
        tx_hash=verification["tx_hash"],
        block_number=verification["block_number"],
        gas_used=verification["gas_used"],
    )

    return {
        "city": "Bangalore",
        "temperature": "28C",
        "condition": "Partly Cloudy",
        "humidity": "65%",
        "paid": True,
        "payment_proof": x_payment_proof,
    }


@app.get("/api/data-feed")
async def get_data_feed(x_payment_proof: Optional[str] = Header(None)):
    recipient = "0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe"
    amount = 0.002
    agent_id = "weather_agent"

    if not x_payment_proof:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Payment Required",
                "amount": f"{amount:.3f}",
                "token": "USDC",
                "token_address": "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
                "network": "Polygon Amoy Testnet",
                "recipient": recipient,
                "description": "Data Feed API",
            },
        )

    verification = _validate_payment_proof(
        x_payment_proof,
        expected_agent_id=agent_id,
        expected_recipient=recipient,
        expected_amount_usdc=amount,
    )
    await _insert_paid_transaction(
        agent_id=agent_id,
        recipient=recipient,
        amount_usdc=amount,
        tx_hash=verification["tx_hash"],
        block_number=verification["block_number"],
        gas_used=verification["gas_used"],
    )

    return {
        "market": "crypto",
        "btc_price": "45000",
        "eth_price": "2800",
        "trend": "bullish",
        "paid": True,
        "payment_proof": x_payment_proof,
    }


@app.get("/transactions")
async def get_transactions():
    rows = await db.fetch_transactions(limit=50)
    data = []
    for tx in rows:
        tx["tx_url"] = f"https://amoy.polygonscan.com/tx/{tx['tx_hash']}"
        data.append(tx)
    return {"transactions": data}


@app.get("/transactions/onchain")
async def get_onchain_transactions():
    return await get_transactions()


@app.post("/transactions")
async def create_transaction(transaction: Transaction):
    block_number = 0
    gas_used = 0

    if transaction.tx_hash.startswith("0x") and len(transaction.tx_hash) == 66 and not MOCK_MODE and w3:
        try:
            receipt = w3.eth.get_transaction_receipt(transaction.tx_hash)
            block_number = int(receipt.get("blockNumber", 0) or 0)
            gas_used = int(receipt.get("gasUsed", 0) or 0)
        except Exception:
            pass

    payload = {
        "agent_id": transaction.agent_id,
        "recipient": transaction.recipient,
        "amount_usdc": transaction.amount_usdc,
        "tx_hash": transaction.tx_hash,
        "status": transaction.status,
        "block_reason": transaction.block_reason,
        "timestamp": transaction.timestamp,
        "created_at": datetime.utcnow().isoformat(),
        "block_number": block_number,
        "gas_used": gas_used,
    }

    transaction_id = await db.insert_transaction(payload)

    return {
        "id": transaction_id,
        "message": "Transaction saved successfully",
        **transaction.model_dump(),
    }


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "network": "Polygon Amoy Testnet",
        "database": db.backend,
        "mock_mode": MOCK_MODE,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
