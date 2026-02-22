'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';

interface Transaction {
  id: number;
  agent_id: string;
  recipient: string;
  amount_usdc: number;
  tx_hash: string;
  status: string;
  timestamp: number;
  tx_url?: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditPolicy, setShowEditPolicy] = useState(false);
  const [maxPerTx, setMaxPerTx] = useState('1.00');
  const [dailyCap, setDailyCap] = useState('5.00');
  const [showFundVault, setShowFundVault] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1.00');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`)
      .then(r => r.json())
      .then(data => {
        setTransactions(data.transactions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">
            A
          </div>
          <span className="font-semibold">AgentPay</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/demo" className="text-sm text-gray-400 hover:text-white transition">
            Demo
          </Link>
          <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition">
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs bg-purple-950 border border-purple-800 text-purple-300 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            Polygon Amoy Testnet
          </div>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Agent ID</div>
            <div className="font-mono font-semibold">weather_agent</div>
            <div className="mt-2 text-xs text-green-400">🟢 Active</div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex justify-between items-center mb-1">
              <div className="text-gray-400 text-sm">Policy</div>
              <button 
                onClick={() => setShowEditPolicy(true)} 
                className="text-xs text-purple-400 hover:underline"
              >
                Edit Policy
              </button>
            </div>
            <div className="font-semibold">Max $1.00 / tx</div>
            <div className="text-sm text-gray-400">Daily cap: $5.00</div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Contracts</div>
            <div className="text-xs font-mono text-purple-400 truncate">
              AgentVault: {process.env.NEXT_PUBLIC_AGENT_VAULT?.slice(0, 10)}...
            </div>
            <div className="text-xs font-mono text-purple-400 truncate">
              USDC (ERC-20, Amoy Testnet)
            </div>
            <div className="mt-2">
              <a 
                href="https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:underline"
              >
                View on Polygonscan ↗
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <button 
            onClick={() => setShowFundVault(true)} 
            className="flex items-center gap-2 bg-purple-950 border border-purple-800 hover:border-purple-600 text-purple-300 transition px-4 py-2 rounded-lg text-sm"
          >
            + Fund Vault
          </button>
          <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-red-700 hover:text-red-400 text-gray-400 transition px-4 py-2 rounded-lg text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
            Agent Active — Click to Pause
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold">Transaction Feed</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-gray-400 hover:text-white"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions yet. Run the demo to see payments appear here.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-gray-800">
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Agent</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Tx Hash</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-4 text-gray-400">
                      {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                    </td>
                    <td className="p-4 font-mono">{tx.agent_id}</td>
                    <td className="p-4">${tx.amount_usdc} USDC</td>
                    <td className="p-4 font-mono text-purple-400">
                      <a 
                        href={tx.tx_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                      >
                        {tx.tx_hash?.slice(0, 18)}...
                      </a>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          tx.status === 'success'
                            ? 'bg-green-900 text-green-400'
                            : 'bg-red-900 text-red-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showEditPolicy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Edit Agent Policy</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Max per transaction (USDC)</label>
                <input
                  type="number"
                  value={maxPerTx}
                  onChange={e => setMaxPerTx(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Daily spending cap (USDC)</label>
                <input
                  type="number"
                  value={dailyCap}
                  onChange={e => setDailyCap(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Whitelisted recipient</label>
                <input
                  type="text"
                  defaultValue="0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-6 p-3 bg-gray-900 rounded-lg">
              ⚠️ Policy changes require an on-chain transaction signed by the agent owner wallet.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditPolicy(false)}
                className="flex-1 border border-gray-700 hover:border-gray-600 px-4 py-2 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Connect wallet to sign policy update transaction');
                  setShowEditPolicy(false);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Update Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {showFundVault && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Fund Agent Vault</h2>
            <p className="text-gray-500 text-sm mb-6">
              Deposit USDC into the AgentVault contract. The agent will use this balance to pay for API calls within policy limits.
            </p>

            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Amount (USDC)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Depositing to</span>
                <span className="font-mono text-xs text-purple-400">AgentVault: 0x5229...E225</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Network</span>
                <span className="text-gray-300">Polygon Amoy Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Token</span>
                <span className="text-gray-300">USDC (ERC-20)</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-6 p-3 bg-gray-900 rounded-lg">
              Two transactions required: (1) Approve USDC spend, (2) Deposit into vault.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFundVault(false)}
                className="flex-1 border border-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Connect wallet to approve and deposit USDC');
                  setShowFundVault(false);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Approve & Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
