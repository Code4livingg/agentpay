'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import ConnectButton from '@/components/ConnectButton';
import LogoSVG from '@/components/LogoSVG';

// ── Contract addresses (Polygon Amoy testnet) ──────────────────────────────
const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_VAULT ?? '0x522996599e987d03cc9f07e77c3c11a3C23dE225') as `0x${string}`;
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC ?? '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582') as `0x${string}`;

// ── Minimal ABIs ──────────────────────────────────────────────────────────
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

const AGENT_VAULT_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
] as const;

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
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditPolicy, setShowEditPolicy] = useState(false);
  const [maxPerTx, setMaxPerTx] = useState('1.00');
  const [dailyCap, setDailyCap] = useState('5.00');
  const [showFundVault, setShowFundVault] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1.00');
  const [isPaused, setIsPaused] = useState(false);
  const [depositStatus, setDepositStatus] = useState<'idle' | 'approving' | 'depositing' | 'done' | 'error'>('idle');
  const [isExecuting, setIsExecuting] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ backend: string; row_count: number } | null>(null);
  const [pollingActive, setPollingActive] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [vaultBalance, setVaultBalance] = useState<string>('—');
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<{ chain: string; chain_id: number; why_polygon: string } | null>(null);
  const [agentTask, setAgentTask] = useState('');
  const [agentResult, setAgentResult] = useState<{ steps: string[]; tx_hash?: string | null } | null>(null);
  const [agentRunning, setAgentRunning] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ status: string; network: string; database: string; mock_mode: boolean } | null>(null);

  const handleDeposit = async () => {
    if (!address) {
      alert('Please connect wallet first');
      return;
    }

    // USDC on Amoy uses 6 decimals (same as mainnet USDC)
    const amountUnits = parseUnits(depositAmount, 6);

    try {
      // ── Step 1: Approve USDC spend ────────────────────────────────────────
      setDepositStatus('approving');
      console.log('[AgentPay] Step 1 – Requesting USDC approval…', {
        token: USDC_ADDRESS,
        spender: VAULT_ADDRESS,
        amount: amountUnits.toString(),
      });

      const approveTxHash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [VAULT_ADDRESS, amountUnits],
      });
      console.log('[AgentPay] USDC approve tx sent:', approveTxHash);

      // ── Step 2: Deposit into AgentVault ──────────────────────────────────
      setDepositStatus('depositing');
      console.log('[AgentPay] Step 2 – Depositing into AgentVault…', {
        vault: VAULT_ADDRESS,
        amount: amountUnits.toString(),
      });

      const depositTxHash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: AGENT_VAULT_ABI,
        functionName: 'deposit',
        args: [amountUnits],
      });
      console.log('[AgentPay] Deposit tx sent:', depositTxHash);

      setDepositStatus('done');
      setShowFundVault(false);
      alert(`✅ Deposited ${depositAmount} USDC!\nTx: ${depositTxHash}`);
    } catch (err: unknown) {
      setDepositStatus('error');
      const message = err instanceof Error ? err.message : String(err);
      console.error('[AgentPay] Deposit failed:', err);
      alert(`❌ Deposit failed: ${message}`);
    } finally {
      // Reset status after a short delay so the button reflects the last state briefly
      setTimeout(() => setDepositStatus('idle'), 3000);
    }
  };

  const fetchExecutions = (showLoading = true) => {
    if (showLoading) setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/executions`)
      .then(r => r.json())
      .then(data => {
        console.log('[ExecutionFeed] /executions payload:', data);
        setTransactions(data.executions || []);
        console.log('[ExecutionFeed] state updated, count:', (data.executions || []).length);
        if (showLoading) setLoading(false);
      })
      .catch(() => {
        if (showLoading) setLoading(false);
      });
  };

  const startPolling = () => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      fetchExecutions(false);
    }, 5000);
    setPollingActive(true);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPollingActive(false);
  };

  const fetchDbStatus = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/debug/db-status`)
      .then(r => r.json())
      .then(data => setDbStatus(data))
      .catch(() => setDbStatus(null));
  };

  const fetchVaultBalance = () => {
    setBalanceLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vault-balance`)
      .then(r => r.json())
      .then(data => {
        setVaultBalance(data.balance_usdc ?? '—');
        setBalanceLoading(false);
      })
      .catch(() => {
        setVaultBalance('—');
        setBalanceLoading(false);
      });
  };

  const fetchNetworkInfo = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/network-info`)
      .then(r => r.json())
      .then(data => setNetworkInfo(data))
      .catch(() => setNetworkInfo(null));
  };

  const fetchHealth = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`)
      .then(r => r.json())
      .then(data => setHealthStatus(data))
      .catch(() => setHealthStatus(null));
  };

  const runAgent = async () => {
    if (!agentTask.trim()) return;
    setAgentRunning(true);
    setAgentResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/agent-execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: agentTask }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Agent execution failed');
      }
      const data = await res.json();
      setAgentResult({ steps: data.steps || [], tx_hash: data.tx_hash });
      fetchExecutions();
      startPolling();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setAgentResult({ steps: [`Error: ${message}`], tx_hash: null });
    } finally {
      setAgentRunning(false);
    }
  };

  const runDemoExecution = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/execute-demo`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Demo execution failed');
      }
      await res.json();
      fetchExecutions();
      startPolling();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`❌ Demo execution failed: ${message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
    fetchDbStatus();
    fetchVaultBalance();
    fetchNetworkInfo();
    fetchHealth();
    const balanceInterval = setInterval(fetchVaultBalance, 10000);
    return () => {
      clearInterval(balanceInterval);
      stopPolling();
    };
  }, []);

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#0F1115' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-5" style={{ borderBottom: '1px solid #1F2329' }}>
        <div className="flex items-center gap-2">
          <LogoSVG variant="mark" width={48} height={48} />
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm hover:text-white transition" style={{ color: '#A1A8B3' }}>
            Dashboard
          </Link>
          <Link href="/why-agentpay" className="text-sm hover:text-white transition" style={{ color: '#A1A8B3' }}>
            Why AgentPay
          </Link>
          <Link href="/roadmap" className="text-sm hover:text-white transition" style={{ color: '#A1A8B3' }}>
            Roadmap
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
          <div className="text-xs px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-300 bg-emerald-500/10">
            Vault: {balanceLoading ? 'Loading…' : `${vaultBalance} USDC`}
          </div>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Agent Dashboard — Powered by Polygon Amoy — sub-second finality for autonomous agents</h1>
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

        {networkInfo && (
          <div className="mb-8 rounded-xl bg-[#16181D] border border-[#1F2329] p-5">
            <div className="text-sm text-[#A1A8B3]">Network</div>
            <div className="font-semibold">
              {networkInfo.chain} · Chain ID {networkInfo.chain_id}
            </div>
            <div className="text-sm text-[#A1A8B3] mt-2">
              {networkInfo.why_polygon}
            </div>
          </div>
        )}

        <div className="mb-8 rounded-xl bg-[#16181D] border border-[#1F2329] p-5">
          <div className="text-sm text-[#A1A8B3] mb-3">Health Checks</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-[#1F2329] bg-[#0F1115] p-4">
              <div className="text-[#6B7280]">API</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full ${healthStatus?.status === 'ok' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                <span>{healthStatus?.status ?? 'unknown'}</span>
              </div>
            </div>
            <div className="rounded-lg border border-[#1F2329] bg-[#0F1115] p-4">
              <div className="text-[#6B7280]">Database</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full ${healthStatus?.database ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                <span>{healthStatus?.database ?? 'unknown'}</span>
              </div>
            </div>
            <div className="rounded-lg border border-[#1F2329] bg-[#0F1115] p-4">
              <div className="text-[#6B7280]">Network</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full ${healthStatus?.network ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                <span>{healthStatus?.network ?? 'unknown'}</span>
              </div>
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
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Execution Feed</h2>
              {pollingActive && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Live
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {dbStatus && (
                <div className="text-xs" style={{ color: '#6B7280' }}>
                  DB: {dbStatus.backend} · Rows: {dbStatus.row_count}
                </div>
              )}
              <button
                onClick={runDemoExecution}
                disabled={isExecuting}
                className="text-xs px-3 py-1.5 rounded"
                style={{
                  backgroundColor: isExecuting ? '#1F2329' : '#1a2332',
                  border: '1px solid #2F6BFF',
                  color: isExecuting ? '#6B7280' : '#4A7FFF',
                  cursor: isExecuting ? 'not-allowed' : 'pointer',
                }}
              >
                {isExecuting ? 'Running…' : 'Run Demo Execution'}
              </button>
              <button
                onClick={() => {
                  fetchExecutions();
                  fetchDbStatus();
                }}
                className="text-xs hover:text-white"
                style={{ color: '#A1A8B3' }}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-5">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="grid grid-cols-6 gap-4">
                    <div className="h-4 rounded bg-[#1F2329]"></div>
                    <div className="h-4 rounded bg-[#1F2329]"></div>
                    <div className="h-4 rounded bg-[#1F2329]"></div>
                    <div className="h-4 rounded bg-[#1F2329]"></div>
                    <div className="h-4 rounded bg-[#1F2329]"></div>
                    <div className="h-4 rounded bg-[#1F2329]"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280]">
              No executions yet. Run a demo to see live results.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs" style={{ color: '#6B7280', borderBottom: '1px solid #1F2329' }}>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Agent</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Recipient</th>
                  <th className="text-left p-4">Tx Hash</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #1F2329' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16181D'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="p-4" style={{ color: '#A1A8B3' }}>
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono">{tx.agent_id}</td>
                    <td className="p-4">${tx.amount_usdc} USDC</td>
                    <td className="p-4 font-mono" style={{ color: '#A1A8B3' }}>
                      {tx.recipient?.slice(0, 10)}...
                    </td>
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
                    <td className="p-4">
                      {tx.block_number ? (
                        <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-300">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-300">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-8 rounded-xl bg-[#16181D] border border-[#1F2329] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Agent</h3>
            <span className="text-xs text-[#6B7280]">Autonomous execution via OpenAI</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <input
              value={agentTask}
              onChange={(e) => setAgentTask(e.target.value)}
              placeholder="Give your agent a task"
              className="w-full rounded-lg border border-[#2A2F36] bg-[#0F1115] px-4 py-2 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/60"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={runAgent}
                disabled={agentRunning || !agentTask.trim()}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#2F6BFF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {agentRunning ? 'Running…' : 'Run Agent'}
              </button>
              {agentResult?.tx_hash && (
                <span className="text-xs text-emerald-300">
                  Tx: {agentResult.tx_hash.slice(0, 12)}...
                </span>
              )}
            </div>
            {agentResult && (
              <div className="rounded-lg border border-[#1F2329] bg-[#0F1115] p-4">
                <div className="text-xs text-[#6B7280] mb-2">Agent steps</div>
                <ul className="text-sm text-[#D1D5DB] list-disc pl-5">
                  {agentResult.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
                  if (!address) {
                    alert('Please connect wallet first');
                    return;
                  }
                  alert(`Ready to sign policy update from ${address.slice(0, 6)}...${address.slice(-4)}`);
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
                onClick={handleDeposit}
                disabled={!address || depositStatus === 'approving' || depositStatus === 'depositing'}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition"
                style={{
                  backgroundColor: depositStatus === 'error' ? '#7f1d1d' : '#2F6BFF',
                  color: 'white',
                  opacity: (!address || depositStatus === 'approving' || depositStatus === 'depositing') ? 0.6 : 1,
                  cursor: (!address || depositStatus === 'approving' || depositStatus === 'depositing') ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (depositStatus === 'idle') e.currentTarget.style.backgroundColor = '#4A7FFF';
                }}
                onMouseLeave={(e) => {
                  if (depositStatus === 'idle') e.currentTarget.style.backgroundColor = '#2F6BFF';
                }}
              >
                {depositStatus === 'approving' && '⏳ Approving…'}
                {depositStatus === 'depositing' && '⏳ Depositing…'}
                {depositStatus === 'done' && '✅ Done!'}
                {depositStatus === 'error' && '❌ Error — Retry'}
                {depositStatus === 'idle' && 'Approve & Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
