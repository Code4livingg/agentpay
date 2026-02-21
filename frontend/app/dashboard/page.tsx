'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: number;
  agent_id: string;
  recipient: string;
  amount_usdc: number;
  tx_hash: string;
  status: string;
  timestamp: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-sm text-purple-400 font-mono mb-1">
              🟣 Network: Polygon Amoy (Testnet)
            </div>
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
            <div className="text-gray-400 text-sm mb-1">Policy</div>
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
          </div>
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
                    <td className="p-4 font-mono text-purple-400 truncate max-w-xs">
                      {tx.tx_hash?.slice(0, 16)}...
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
    </main>
  );
}
