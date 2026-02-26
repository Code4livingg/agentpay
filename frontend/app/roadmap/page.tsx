import Link from 'next/link';

const milestones = [
  {
    title: 'Wave 1 (Current)',
    description:
      'Core infrastructure: AgentVault contract, policy enforcement, execution indexing, observability dashboard',
    status: 'done',
  },
  {
    title: 'Wave 2 (Next)',
    description:
      'Developer SDK release, multi-agent support (multiple agent_ids per vault), automated event polling replacing manual trigger',
    status: 'next',
  },
  {
    title: 'Wave 3',
    description:
      'Polygon mainnet deployment, first external developer integrations, agent marketplace prototype',
    status: 'next',
  },
  {
    title: 'Wave 4',
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
        <p className="mt-3 text-[#A1A8B3]">A focused delivery plan for AgentPay on Polygon.</p>

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
