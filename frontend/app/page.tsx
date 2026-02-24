'use client';

import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';
import { motion } from 'framer-motion';
import LogoSVG from '@/components/LogoSVG';

export default function Home() {
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

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-8" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329', color: '#A1A8B3' }}>
          <span style={{ color: '#2F6BFF' }}>NEW</span> Built on x402 — Polygon's emerging payment standard
        </div>

        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LogoSVG 
              variant="full" 
              width={448} 
              height={112}
              className="drop-shadow-[0_0_50px_rgba(47,107,255,0.4)]"
            />
          </motion.div>
        </div>

        <h1 className="text-6xl font-bold leading-tight mb-6">
          Policy-Enforced Execution<br />
          Infrastructure for <span style={{ color: '#2F6BFF' }}>Autonomous Agents</span>
        </h1>

        <p className="text-xl max-w-xl mb-4" style={{ color: '#A1A8B3' }}>
          The deterministic control layer that prevents autonomous AI agents from becoming financially unbounded.
        </p>

        <p className="max-w-lg mb-4" style={{ color: '#6B7280' }}>
          As AI agents begin executing financial actions independently, unconstrained autonomy introduces systemic risk. AgentPay formalizes bounded, deterministic execution on Polygon through enforceable on-chain policy.
        </p>

        <p className="max-w-lg mb-10" style={{ color: '#6B7280' }}>
          Every transaction is policy-checked before settlement. Spending limits and recipient whitelists constrain agent behavior. Receipt-level verification ensures confirmed execution with block number and gas transparency.
        </p>

        <div className="flex gap-3 mb-16">
          <Link 
            href="/dashboard" 
            className="px-6 py-3 rounded-lg font-semibold text-sm transition"
            style={{ backgroundColor: '#2F6BFF', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A7FFF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F6BFF'}
          >
            Launch Dashboard →
          </Link>
          <Link 
            href="/docs" 
            className="px-6 py-3 rounded-lg font-semibold text-sm transition"
            style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}
          >
            View Architecture
          </Link>
          <a 
            href={`${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/address/${process.env.NEXT_PUBLIC_AGENT_VAULT}#code`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg font-semibold text-sm transition"
            style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}
          >
            View Contract ↗
          </a>
        </div>

        {/* Credibility Strip */}
        <div className="flex items-center justify-center gap-6 mb-16 text-xs" style={{ color: '#6B7280' }}>
          <span>Bounded Execution</span>
          <span style={{ color: '#2F2F2F' }}>•</span>
          <span>Policy-Enforced</span>
          <span style={{ color: '#2F2F2F' }}>•</span>
          <span>Receipt-Verified</span>
          <span style={{ color: '#2F2F2F' }}>•</span>
          <span>Deterministic Control</span>
        </div>

        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#6B7280' }}>How it works</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mx-auto mb-3" style={{ backgroundColor: '#1a2332' }}>
                👤
              </div>
              <div className="text-xs font-mono mb-1" style={{ color: '#2F6BFF' }}>Step 1</div>
              <div className="text-sm font-semibold mb-1">Human sets policy</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Max per tx, daily cap, whitelist</div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mx-auto mb-3" style={{ backgroundColor: '#1a2332' }}>
                🤖
              </div>
              <div className="text-xs font-mono mb-1" style={{ color: '#2F6BFF' }}>Step 2</div>
              <div className="text-sm font-semibold mb-1">Agent calls API</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Gets 402 Payment Required</div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mx-auto mb-3" style={{ backgroundColor: '#1a2332' }}>
                🔒
              </div>
              <div className="text-xs font-mono mb-1" style={{ color: '#2F6BFF' }}>Step 3</div>
              <div className="text-sm font-semibold mb-1">Contract enforces</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Policy checked on-chain</div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mx-auto mb-3" style={{ backgroundColor: '#1a2332' }}>
                ✅
              </div>
              <div className="text-xs font-mono mb-1" style={{ color: '#2F6BFF' }}>Step 4</div>
              <div className="text-sm font-semibold mb-1">USDC settles</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>API unlocks, agent gets data</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden mb-16" style={{ backgroundColor: '#1F2329', border: '1px solid #1F2329' }}>
          <div className="px-8 py-6" style={{ backgroundColor: '#0F1115' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#2F6BFF' }}>$0.001</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Per API call (USDC)</div>
          </div>
          <div className="px-8 py-6" style={{ backgroundColor: '#0F1115' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#2F6BFF' }}>&lt;2s</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Payment settlement</div>
          </div>
          <div className="px-8 py-6" style={{ backgroundColor: '#0F1115' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#2F6BFF' }}>100%</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>On-chain enforced</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-6 transition" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ backgroundColor: '#1a2332' }}>
              🔒
            </div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#2F6BFF' }}>Financial authority is limited by policy.</div>
            <h3 className="font-semibold mb-2">Bounded Execution</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Spending caps enforced by smart contract — not by trust. 
              Agent behavior constrained by on-chain limits and whitelists.
            </p>
          </div>

          <div className="rounded-2xl p-6 transition" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ backgroundColor: '#1a2332' }}>
              ⚡
            </div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#2F6BFF' }}>Deterministic, rule-bound execution.</div>
            <h3 className="font-semibold mb-2">Contract-Enforced Control</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Smart contract logic enforces predictable outcomes. No discretionary overrides.
              Execution is deterministic, not heuristic.
            </p>
          </div>

          <div className="rounded-2xl p-6 transition" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2F6BFF'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F2329'}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ backgroundColor: '#1a2332' }}>
              📊
            </div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#2F6BFF' }}>Block-level verification, not assumptions.</div>
            <h3 className="font-semibold mb-2">Receipt-Level Verification</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Transactions validated via confirmed receipts. Block number and gas usage surfaced.
              Event decoding ensures verified settlement.
            </p>
          </div>
        </div>

        {/* Security Model */}
        <div className="mt-16 rounded-2xl p-8" style={{ backgroundColor: '#16181D', border: '1px solid #1F2329' }}>
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#6B7280' }}>Execution Governance Model</div>
          <h2 className="text-2xl font-bold mb-6">Financial containment by design</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: '#1a3a2e' }}>
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Agent never holds private keys</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>All signing happens at the operator wallet layer, not inside agent logic.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: '#1a3a2e' }}>
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Smart contract is final authority</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>SDK pre-checks are for UX. The contract will revert any out-of-policy transaction on-chain.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: '#1a3a2e' }}>
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Funds locked in vault contract</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>USDC is held by AgentVault, not by the agent. Owner can withdraw at any time.</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: '#1a3a2e' }}>
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Execution authority is bounded</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>Maximum loss is capped by on-chain policy limits. Even in full agent compromise, financial damage is contained.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: '#1a3a2e' }}>
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Instant human override</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>Owner can pause any agent instantly. All payments stop immediately.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: '#1a3a2e' }}>
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Full on-chain auditability</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>Every payment emits an on-chain event. Nothing is hidden or off-chain only.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-24" style={{ borderColor: '#1F2329' }}>
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 gap-12">
            {/* Left Section */}
            <div>
              <div className="font-semibold text-lg mb-2">AgentPay</div>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                Policy-Enforced Execution Infrastructure for Autonomous Agents on Polygon
              </p>
            </div>

            {/* Right Section */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#A1A8B3' }}>
                  Resources
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/address/${process.env.NEXT_PUBLIC_AGENT_VAULT}#code`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition"
                      style={{ color: '#6B7280' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2F6BFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                    >
                      Contract Address ↗
                    </a>
                  </div>
                  <div>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/address/${process.env.NEXT_PUBLIC_AGENT_VAULT}#code`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition"
                      style={{ color: '#6B7280' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2F6BFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                    >
                      View on Polygonscan ↗
                    </a>
                  </div>
                  <div>
                    <a 
                      href={process.env.NEXT_PUBLIC_GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition"
                      style={{ color: '#6B7280' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2F6BFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                    >
                      GitHub Repository ↗
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#A1A8B3' }}>
                  Documentation
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <Link 
                      href="/docs"
                      className="transition"
                      style={{ color: '#6B7280' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2F6BFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                    >
                      Testnet Deployment
                    </Link>
                  </div>
                  <div>
                    <Link 
                      href="/"
                      className="transition"
                      style={{ color: '#6B7280' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2F6BFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                    >
                      Security Model
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 text-xs text-center" style={{ borderTop: '1px solid #1F2329', color: '#6B7280' }}>
            © 2026 AgentPay. Built for Polygon Hackathon.
          </div>
        </div>
      </footer>
    </main>
  );
}
