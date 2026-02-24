'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';
import LogoSVG from '@/components/LogoSVG';

interface Transaction {
  id: number;
  agent_id: string;
  recipient: string;
  amount_usdc: number;
  tx_hash: string;
  status: string;
  timestamp: number;
  tx_url?: string;
  block_number?: number;
  gas_used?: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditPolicy, setShowEditPolicy] = useState(false);
  const [maxPerTx, setMaxPerTx] = useState('1.00');
  const [dailyCap, setDailyCap] = useState('5.00');
  const [showFundVault, setShowFundVault] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1.00');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/onchain`)
      .then(r => r.json())
      .then(data => {
        setTransactions(data.transactions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#0F1115' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-5" style={{ borderBottom: '1px solid #1F2329' }}>
        <div className="flex items-center gap-2">
          <LogoSVG variant="mark" width={36} height={36} />
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm hover:text-white transition" style={{ color: '#A1A8B3' }}>
            Dashboard
          </Link>
          <Link href="/demo" className="text-sm hover:text-white transition" style={{ color: '#A1A8B3' }}>
            Demo
          </Link>
          <Link href="/docs" className="text-sm hover:text-white transition" style={{ color: '#A1A8B3' }}>
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: '#1a2332', border: '1px solid #2F6BFF', color: '#4A7FFF' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2F6BFF' }}></div>
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
          <Link href="/" className="hover:text-white text-sm" style={{ color: '#A1A8B3' }}>
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
            <div className="text-sm mb-1" style={{ color: '#A1A8B3' }}>Agent ID</div>
            <div className="font-mono font-semibold">weather_agent</div>
            {isPaused ? (
              <div className="mt-2 text-xs" style={{ color: '#ef4444' }}>🔴 Execution Paused</div>
            ) : (
              <div className="mt-2 text-xs" style={{ color: '#10b981' }}>🟢 Execution Active</div>
            )}
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm" style={{ color: '#A1A8B3' }}>Execution Policy</div>
              <button 
                onClick={() => setShowEditPolicy(true)} 
                className="text-xs hover:underline"
                style={{ color: '#2F6BFF' }}
              >
                Edit Policy
              </button>
            </div>
            <div className="font-semibold">Max $1.00 / tx</div>
            <div className="text-sm" style={{ color: '#A1A8B3' }}>Daily cap: $5.00</div>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
            <div className="text-sm mb-1" style={{ color: '#A1A8B3' }}>Contracts</div>
            <div className="text-xs font-mono truncate" style={{ color: '#2F6BFF' }}>
              AgentVault: {process.env.NEXT_PUBLIC_AGENT_VAULT?.slice(0, 10)}...
            </div>
            <div className="text-xs font-mono truncate" style={{ color: '#2F6BFF' }}>
              USDC (ERC-20, Amoy Testnet)
            </div>
            <div className="mt-2">
              <a 
                href="https://amoy.polygonscan.com/address/0x522996599e987d03cc9f07e77c3c11a3C23dE225#code" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: '#2F6BFF' }}
              >
                View on Polygonscan ↗
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <button 
            onClick={() => setShowFundVault(true)} 
            className="flex items-center gap-2 transition px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#1a2332', border: '1px solid #2F6BFF', color: '#4A7FFF' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4A7FFF'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
          >
            + Fund Vault
          </button>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 transition px-4 py-2 rounded-lg text-sm"
            style={isPaused 
              ? { backgroundColor: '#3a1a1a', border: '1px solid #ef4444', color: '#fca5a5' }
              : { backgroundColor: '#16181D', border: '1px solid #1F2329', color: '#A1A8B3' }
            }
            onMouseEnter={(e) => {
              if (!isPaused) e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              if (!isPaused) e.currentTarget.style.borderColor = '#1F2329';
            }}
          >
            <span className={`w-2 h-2 rounded-full inline-block`} style={{ backgroundColor: isPaused ? '#ef4444' : '#10b981' }}></span>
            {isPaused ? 'Execution Paused — Click to Resume' : 'Execution Active — Click to Pause'}
          </button>
        </div>

        <div className="rounded-xl" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
          <div className="p-5 flex justify-between items-center" style={{ borderBottom: '1px solid #1F2329' }}>
            <h2 className="font-semibold">Execution Feed</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-xs hover:text-white"
              style={{ color: '#A1A8B3' }}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center" style={{ color: '#6B7280' }}>Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center" style={{ color: '#6B7280' }}>
              No executions yet. Run the demo to see policy-bound transactions appear here.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs" style={{ color: '#6B7280', borderBottom: '1px solid #1F2329' }}>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Agent</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Tx Hash</th>
                  <th className="text-left p-4">Block</th>
                  <th className="text-left p-4">Gas Used</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #1F2329' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16181D'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="p-4" style={{ color: '#A1A8B3' }}>
                      {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                    </td>
                    <td className="p-4 font-mono">{tx.agent_id}</td>
                    <td className="p-4">${tx.amount_usdc} USDC</td>
                    <td className="p-4 font-mono">
                      <a 
                        href={tx.tx_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                        style={{ color: '#2F6BFF' }}
                      >
                        {tx.tx_hash?.slice(0, 18)}...
                      </a>
                    </td>
                    <td className="p-4" style={{ color: '#A1A8B3' }}>{tx.block_number || '—'}</td>
                    <td className="p-4" style={{ color: '#A1A8B3' }}>{tx.gas_used ? tx.gas_used.toLocaleString() : '—'}</td>
                    <td className="p-4">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={tx.status === 'success'
                          ? { backgroundColor: '#1a3a2e', color: '#10b981' }
                          : { backgroundColor: '#3a1a1a', color: '#ef4444' }
                        }
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
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl p-8 w-full max-w-md" style={{ backgroundColor: '#0F1115', border: '1px solid #1F2329' }}>
            <h2 className="text-xl font-bold mb-6">Edit Execution Policy</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm mb-2 block" style={{ color: '#A1A8B3' }}>Max per transaction (USDC)</label>
                <input
                  type="number"
                  value={maxPerTx}
                  onChange={e => setMaxPerTx(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-white outline-none"
                  style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#1F2329'}
                />
              </div>

              <div>
                <label className="text-sm mb-2 block" style={{ color: '#A1A8B3' }}>Daily spending cap (USDC)</label>
                <input
                  type="number"
                  value={dailyCap}
                  onChange={e => setDailyCap(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-white outline-none"
                  style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#1F2329'}
                />
              </div>

              <div>
                <label className="text-sm mb-2 block" style={{ color: '#A1A8B3' }}>Whitelisted recipient</label>
                <input
                  type="text"
                  defaultValue="0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe"
                  className="w-full rounded-lg px-4 py-2 text-white font-mono text-sm outline-none"
                  style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#1F2329'}
                />
              </div>
            </div>

            <div className="text-xs mb-6 p-3 rounded-lg" style={{ color: '#6B7280', backgroundColor: '#16181D' }}>
              ⚠️ Policy changes require an on-chain transaction signed by the agent owner wallet.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditPolicy(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm transition"
                style={{ border: '1px solid #1F2329' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Connect wallet to sign policy update transaction');
                  setShowEditPolicy(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition"
                style={{ backgroundColor: '#2F6BFF', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A7FFF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F6BFF'}
              >
                Update Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {showFundVault && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl p-8 w-full max-w-md" style={{ backgroundColor: '#0F1115', border: '1px solid #1F2329' }}>
            <h2 className="text-xl font-bold mb-2">Fund Agent Vault</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Deposit USDC into the AgentVault contract. The agent will use this balance to pay for API calls within policy limits.
            </p>

            <div className="mb-4">
              <label className="text-sm mb-2 block" style={{ color: '#A1A8B3' }}>Amount (USDC)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                className="w-full rounded-lg px-4 py-2 text-white outline-none"
                style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#1F2329'}
              />
            </div>

            <div className="rounded-lg p-4 mb-6 space-y-2 text-sm" style={{ backgroundColor: '#16181D' }}>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Depositing to</span>
                <span className="font-mono text-xs" style={{ color: '#2F6BFF' }}>AgentVault: 0x5229...E225</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Network</span>
                <span style={{ color: '#A1A8B3' }}>Polygon Amoy Testnet</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Token</span>
                <span style={{ color: '#A1A8B3' }}>USDC (ERC-20)</span>
              </div>
            </div>

            <div className="text-xs mb-6 p-3 rounded-lg" style={{ color: '#6B7280', backgroundColor: '#16181D' }}>
              Two transactions required: (1) Approve USDC spend, (2) Deposit into vault.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFundVault(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm transition"
                style={{ border: '1px solid #1F2329' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Connect wallet to approve and deposit USDC');
                  setShowFundVault(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition"
                style={{ backgroundColor: '#2F6BFF', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A7FFF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F6BFF'}
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
