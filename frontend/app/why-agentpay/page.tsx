import Link from 'next/link';

const rows = [
  { label: 'Designed for AI agents (not humans)', agentpay: '✅', gnosis: '❌', erc4337: '⚠️' },
  { label: 'On-chain policy enforcement', agentpay: '✅', gnosis: '⚠️', erc4337: '⚠️' },
  { label: 'Backend-agnostic execution', agentpay: '✅', gnosis: '❌', erc4337: '⚠️' },
  { label: 'Real-time event indexing', agentpay: '✅', gnosis: '❌', erc4337: '❌' },
  { label: 'Machine-to-machine native', agentpay: '✅', gnosis: '❌', erc4337: '⚠️' },
  { label: 'Polygon-native', agentpay: '✅', gnosis: '⚠️', erc4337: '⚠️' },
];

export default function WhyAgentPay() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-[#1F2329]">
        <div className="text-sm text-[#A1A8B3]">AgentPay</div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-[#A1A8B3] hover:text-white">Dashboard</Link>
          <Link href="/roadmap" className="text-sm text-[#A1A8B3] hover:text-white">Roadmap</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Why AgentPay</h1>
        <p className="mt-3 text-[#A1A8B3]">
          Purpose-built for autonomous AI agents to execute policy-bound payments on-chain.
        </p>

        <div className="mt-8 rounded-xl border border-[#1F2329] bg-[#16181D] overflow-hidden">
          <div className="grid grid-cols-4 text-xs uppercase tracking-wide text-[#6B7280] border-b border-[#1F2329]">
            <div className="p-4">Capability</div>
            <div className="p-4">AgentPay</div>
            <div className="p-4">Gnosis Safe Limits</div>
            <div className="p-4">ERC-4337 Paymasters</div>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-4 border-b border-[#1F2329] last:border-b-0">
              <div className="p-4 text-sm">{row.label}</div>
              <div className="p-4 text-sm">{row.agentpay}</div>
              <div className="p-4 text-sm">{row.gnosis}</div>
              <div className="p-4 text-sm">{row.erc4337}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
