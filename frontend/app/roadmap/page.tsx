import Link from 'next/link';

const milestones = [
  {
    title: 'Wave 6 — First Submission (Current)',
    description:
      'Core infrastructure: AgentVault contract, policy enforcement, execution indexing, observability dashboard, AI agent integration, Python SDK, developer docs',
    status: 'done',
  },
  {
    title: 'Wave 7 (Next)',
    description:
      'Multi-agent support (multiple agent_ids per vault), automated event polling, SDK v0.2 with TypeScript support',
    status: 'next',
  },
  {
    title: 'Wave 8',
    description:
      'Polygon mainnet deployment, first external developer integrations, agent marketplace prototype',
    status: 'next',
  },
  {
    title: 'Wave 9',
    description:
      'AggLayer integration for cross-chain agent execution, DAO-controlled policy governance, production SLA',
    status: 'next',
  },
];

export default function Roadmap() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-[#1F2329]">
        <div className="text-sm text-[#A1A8B3]">AgentPay</div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-[#A1A8B3] hover:text-white">Dashboard</Link>
          <Link href="/why-agentpay" className="text-sm text-[#A1A8B3] hover:text-white">Why AgentPay</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Roadmap</h1>
        <p className="mt-3 text-[#A1A8B3]">AgentPay's buildathon progress and forward roadmap — starting Wave 6.</p>

        <div className="mt-8 space-y-6">
          {milestones.map((m, idx) => {
            const isDone = m.status === 'done';
            return (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={
                      isDone
                        ? 'h-3 w-3 rounded-full bg-emerald-400'
                        : 'h-3 w-3 rounded-full border border-[#2A2F36] bg-[#0F1115]'
                    }
                  />
                  {idx !== milestones.length - 1 && (
                    <div className={isDone ? 'h-full w-px bg-emerald-400/40' : 'h-full w-px bg-[#1F2329]'} />
                  )}
                </div>
                <div className="pb-2">
                  <div className={isDone ? 'text-emerald-300 font-semibold' : 'text-white font-semibold'}>
                    {m.title}
                  </div>
                  <div className="text-sm text-[#A1A8B3] mt-1">{m.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
