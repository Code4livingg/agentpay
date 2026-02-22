'use client';

import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
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

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-full mb-8">
          <span className="text-purple-400">NEW</span> Built on x402 — Polygon's emerging payment standard
        </div>

        <h1 className="text-6xl font-bold leading-tight mb-6">
          Payments for<br />
          <span className="text-purple-500">AI Agents</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-xl mb-4">
          Policy-bound USDC micro-payments on Polygon. Humans set the rules once. 
          Smart contract enforces them on-chain.
        </p>

        <p className="text-gray-600 max-w-lg mb-10">
          Agents do not initiate arbitrary payments — payments occur only when a 
          predefined API call requires it AND passes all policy checks.
        </p>

        <div className="flex gap-3 mb-20">
          <Link 
            href="/dashboard" 
            className="bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-lg font-semibold text-sm"
          >
            View Dashboard →
          </Link>
          <Link 
            href="/demo" 
            className="bg-gray-900 hover:bg-gray-800 transition border border-gray-800 px-6 py-3 rounded-lg font-semibold text-sm"
          >
            Run Demo Agent
          </Link>
        </div>

        <div className="mb-16">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-6">How it works</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-purple-950 rounded-lg flex items-center justify-center text-sm mx-auto mb-3">
                👤
              </div>
              <div className="text-xs text-purple-400 font-mono mb-1">Step 1</div>
              <div className="text-sm font-semibold mb-1">Human sets policy</div>
              <div className="text-xs text-gray-600">Max per tx, daily cap, whitelist</div>
            </div>

            <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-purple-950 rounded-lg flex items-center justify-center text-sm mx-auto mb-3">
                🤖
              </div>
              <div className="text-xs text-purple-400 font-mono mb-1">Step 2</div>
              <div className="text-sm font-semibold mb-1">Agent calls API</div>
              <div className="text-xs text-gray-600">Gets 402 Payment Required</div>
            </div>

            <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-purple-950 rounded-lg flex items-center justify-center text-sm mx-auto mb-3">
                🔒
              </div>
              <div className="text-xs text-purple-400 font-mono mb-1">Step 3</div>
              <div className="text-sm font-semibold mb-1">Contract enforces</div>
              <div className="text-xs text-gray-600">Policy checked on-chain</div>
            </div>

            <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-purple-950 rounded-lg flex items-center justify-center text-sm mx-auto mb-3">
                ✅
              </div>
              <div className="text-xs text-purple-400 font-mono mb-1">Step 4</div>
              <div className="text-sm font-semibold mb-1">USDC settles</div>
              <div className="text-xs text-gray-600">API unlocks, agent gets data</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-gray-900 rounded-2xl overflow-hidden border border-gray-900 mb-16">
          <div className="bg-black px-8 py-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">$0.001</div>
            <div className="text-gray-500 text-sm">Per API call (USDC)</div>
          </div>
          <div className="bg-black px-8 py-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">&lt;2s</div>
            <div className="text-gray-500 text-sm">Payment settlement</div>
          </div>
          <div className="bg-black px-8 py-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">100%</div>
            <div className="text-gray-500 text-sm">On-chain enforced</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-950 rounded-2xl p-6 border border-gray-900 hover:border-purple-900 transition">
            <div className="w-10 h-10 bg-purple-950 rounded-xl flex items-center justify-center text-lg mb-4">
              🔒
            </div>
            <div className="text-xs text-purple-400 font-semibold mb-2">Hard limits. No runaway agents.</div>
            <h3 className="font-semibold mb-2">Policy Enforcement</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hard spending caps enforced by smart contract — not by trust. 
              Max per-tx, daily cap, whitelist.
            </p>
          </div>

          <div className="bg-gray-950 rounded-2xl p-6 border border-gray-900 hover:border-purple-900 transition">
            <div className="w-10 h-10 bg-purple-950 rounded-xl flex items-center justify-center text-lg mb-4">
              ⚡
            </div>
            <div className="text-xs text-purple-400 font-semibold mb-2">Native programmable payments.</div>
            <h3 className="font-semibold mb-2">x402 Payments</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Agents auto-pay 402 endpoints in under 2 seconds. Polygon PoS makes 
              $0.001 micro-payments viable.
            </p>
          </div>

          <div className="bg-gray-950 rounded-2xl p-6 border border-gray-900 hover:border-purple-900 transition">
            <div className="w-10 h-10 bg-purple-950 rounded-xl flex items-center justify-center text-lg mb-4">
              📊
            </div>
            <div className="text-xs text-purple-400 font-semibold mb-2">Every micro-payment recorded on-chain.</div>
            <h3 className="font-semibold mb-2">Full Audit Trail</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every transaction logged on-chain. Pause any agent instantly. 
              Complete visibility at all times.
            </p>
          </div>
        </div>

        {/* Security Model */}
        <div className="mt-16 bg-gray-950 border border-gray-800 rounded-2xl p-8">
          <div className="text-xs text-gray-600 uppercase tracking-widest mb-4">Security Model</div>
          <h2 className="text-2xl font-bold mb-6">Non-custodial by design</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-green-950 rounded flex items-center justify-center text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Agent never holds private keys</div>
                  <div className="text-xs text-gray-500">All signing happens at the operator wallet layer, not inside agent logic.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 bg-green-950 rounded flex items-center justify-center text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Smart contract is final authority</div>
                  <div className="text-xs text-gray-500">SDK pre-checks are for UX. The contract will revert any out-of-policy transaction on-chain.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 bg-green-950 rounded flex items-center justify-center text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Funds locked in vault contract</div>
                  <div className="text-xs text-gray-500">USDC is held by AgentVault, not by the agent. Owner can withdraw at any time.</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-green-950 rounded flex items-center justify-center text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Maximum loss is bounded</div>
                  <div className="text-xs text-gray-500">Even in a full agent compromise, losses are capped by on-chain policy limits.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 bg-green-950 rounded flex items-center justify-center text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Instant human override</div>
                  <div className="text-xs text-gray-500">Owner can pause any agent instantly. All payments stop immediately.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 bg-green-950 rounded flex items-center justify-center text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Full on-chain auditability</div>
                  <div className="text-xs text-gray-500">Every payment emits an on-chain event. Nothing is hidden or off-chain only.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
