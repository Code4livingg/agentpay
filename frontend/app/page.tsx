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
            <h3 className="font-semibold mb-2">Full Audit Trail</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every transaction logged on-chain. Pause any agent instantly. 
              Complete visibility at all times.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
