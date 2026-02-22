'use client';

import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';

export default function Docs() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">
            A
          </div>
          <span className="font-semibold">AgentPay</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs bg-purple-950 border border-purple-800 text-purple-300 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            Polygon Amoy Testnet
          </div>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <Link href="/" className="text-gray-500 hover:text-white text-sm mb-8 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold mb-4">SDK Docs</h1>
        <p className="text-gray-400 mb-12">
          Integrate AgentPay into any Python AI agent in 3 steps.
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-purple-400">Step 1 — Install</h2>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-300">
              pip install agentpay-sdk
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-purple-400">Step 2 — Configure</h2>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-300 whitespace-pre">
              {`# .env
PRIVATE_KEY=your_operator_wallet_key
ALCHEMY_RPC=https://polygon-amoy.g.alchemy.com/v2/your_key
AGENT_VAULT_ADDRESS=0x522996599e987d03cc9f07e77c3c11a3C23dE225
USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
MOCK_PAYMENT=false`}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-purple-400">Step 3 — Use in your agent</h2>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-300 whitespace-pre">
              {`from agentpay_sdk import call_paid_endpoint

# Your agent calls a paid API
result = await call_paid_endpoint(
  agent_id="my_agent",
  endpoint="https://api.example.com/data"
)

# If the API returns 402, AgentPay:
# 1. Checks policy (amount, whitelist, daily cap)
# 2. Submits USDC tx on Polygon
# 3. Retries the endpoint with payment proof
# 4. Returns the response — zero human clicks`}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-purple-400">Policy Rules</h2>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-300 whitespace-pre">
              {`# Register agent with spending policy
registry.registerAgent(
  agentId,
  maxPerTx=1_000_000,   # 1 USDC (6 decimals)
  dailyCap=5_000_000,   # 5 USDC per day
  whitelist=["0xRecipient1", "0xRecipient2"]
)`}
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Contracts (Polygon Amoy Testnet)</h2>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">AgentVault</span>
                <a 
                  href="https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code" 
                  target="_blank" 
                  className="text-purple-400 hover:underline"
                >
                  0x5229...E225
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PolicyRegistry</span>
                <a 
                  href="https://amoy.polygonscan.com/address/0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6#code" 
                  target="_blank" 
                  className="text-purple-400 hover:underline"
                >
                  0xB99b...ef6
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">USDC (ERC-20, Amoy)</span>
                <span className="text-gray-400">0x41E9...7582</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
