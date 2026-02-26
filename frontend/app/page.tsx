'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';

export default function Home() {
  // Typewriter effect
  useEffect(() => {
    const text = "The policy-enforced execution layer for autonomous agents.";
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    let i = 0;
    const timer = setTimeout(() => {
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, 35);
        }
      };
      type();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#030305', color: '#ffffff' }}>

      {/* ── Fixed Grid Background ── */}
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none" />

      {/* ── Navigation ── */}
      <nav
        className="absolute top-0 w-full z-50 backdrop-blur-md"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(3,3,5,0.8)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <defs>
                <linearGradient id="navGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2F6BFF" />
                  <stop offset="1" stopColor="#00D1FF" />
                </linearGradient>
                <linearGradient id="navGradBack" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2F6BFF" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#00D1FF" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <polygon points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7" stroke="url(#navGradBack)" strokeWidth="2" strokeLinejoin="miter" fill="none" />
              <g stroke="url(#navGrad)" strokeWidth="2" strokeLinejoin="miter" strokeLinecap="butt">
                <path d="M 6.5 17 L 12 6 L 17.5 17" />
                <path d="M 8.75 12.5 H 20.66" />
                <path d="M 16.5 8.5 L 20.66 12.5 L 16.5 16.5" />
              </g>
            </svg>
            <span className="font-semibold text-base tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>AgentPay</span>
          </div>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-6">
            {[
              { label: 'Infrastructure', href: '/infrastructure' },
              { label: 'Policies', href: '/policies' },
              { label: 'Docs', href: '/docs' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-medium transition-colors"
                style={{ color: '#9CA3AF' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div
              className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: '#1a2332', border: '1px solid #2F6BFF', color: '#4A7FFF' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2F6BFF' }} />
              Polygon Amoy Testnet
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
      >
        {/* LEFT: Content */}
        <div className="w-full lg:w-[50%] flex flex-col items-start text-left">

          {/* Trust badge */}
          <div
            className="fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded mb-6 shadow-sm"
            style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#2F6BFF', boxShadow: '0 0 4px #2F6BFF' }}
            />
            <span className="text-xs font-medium tracking-wide" style={{ color: '#9CA3AF' }}>
              Built on x402 — Polygon&apos;s execution standard
            </span>
          </div>

          {/* Headline */}
          <h1
            className="fade-in-up delay-100 font-medium tracking-tight leading-[1.15] mb-6 text-4xl sm:text-5xl lg:text-[3.5rem]"
            style={{ color: '#ffffff' }}
          >
            Policy-Enforced Execution Infrastructure for{' '}
            <br className="hidden sm:block" />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(to right, #2F6BFF, #00D1FF)' }}
            >
              Autonomous Agents
            </span>
          </h1>

          {/* Typewriter */}
          <div className="fade-in-up delay-200 h-6 mb-8 flex items-center">
            <p
              className="text-xs sm:text-sm tracking-tight font-medium"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(0,209,255,0.8)' }}
            >
              <span id="typewriter-text" />
              <span
                className="inline-block ml-[2px] align-middle cursor-blink"
                style={{ width: '1.5px', height: '0.875rem', backgroundColor: '#00D1FF' }}
              />
            </p>
          </div>

          {/* Description */}
          <p
            className="fade-in-up delay-300 text-sm sm:text-base max-w-[28rem] leading-relaxed mb-10 font-medium"
            style={{ color: '#9CA3AF' }}
          >
            AgentPay provides deterministic payment control and bounded execution environments.
            Ensure machine-scale safety and prevent financial runaway for your AI agents through
            strict, policy-driven programmatic guardrails.
          </p>

          {/* CTAs */}
          <div className="fade-in-up delay-400 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="btn-glow group relative w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 rounded text-white text-sm font-medium"
              style={{
                background: 'linear-gradient(to bottom, rgba(47,107,255,0.1), rgba(0,209,255,0.1))',
                border: '1px solid rgba(47,107,255,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(47,107,255,0.5)';
                e.currentTarget.style.background = 'rgba(47,107,255,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(47,107,255,0.3)';
                e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(47,107,255,0.1), rgba(0,209,255,0.1))';
              }}
            >
              Deploy Policy
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/docs"
              className="btn-secondary w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 rounded text-sm font-medium"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#D1D5DB', backgroundColor: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#D1D5DB';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              Read Documentation
            </Link>
          </div>
        </div>

        {/* RIGHT: Animated SVG Visual */}
        <div className="w-full lg:w-[50%] relative flex justify-center items-center mt-16 lg:mt-0 fade-in-up delay-300">
          <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center animate-float-subtle">

            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
              <defs>
                <linearGradient id="coreGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2F6BFF" />
                  <stop offset="1" stopColor="#00D1FF" />
                </linearGradient>
                <linearGradient id="coreGradBack" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2F6BFF" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#00D1FF" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Base hex grid */}
              <polygon points="200,60 321.2,130 321.2,270 200,340 78.8,270 78.8,130" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeLinejoin="miter" fill="none" />

              {/* Outer orbit */}
              <g className="animate-spin-slow" style={{ transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="150" stroke="rgba(47,107,255,0.2)" strokeWidth="1" fill="none" />
                <circle cx="200" cy="200" r="150" stroke="#00D1FF" strokeWidth="1.5" strokeLinecap="butt" fill="none" className="particle-drift" opacity="0.8" />
                <circle cx="350" cy="200" r="2.5" fill="#2F6BFF" />
                <circle cx="50" cy="200" r="2.5" fill="#2F6BFF" />
              </g>

              {/* Inner orbit */}
              <g className="animate-spin-reverse" style={{ transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="110" stroke="rgba(0,209,255,0.2)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                <rect x="198" y="88" width="4" height="4" fill="#00D1FF" opacity="0.9" />
                <rect x="198" y="308" width="4" height="4" fill="#2F6BFF" opacity="0.9" />
              </g>

              {/* Connecting spines */}
              <line x1="200" y1="60" x2="200" y2="130" stroke="rgba(0,209,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="270" x2="200" y2="340" stroke="rgba(0,209,255,0.15)" strokeWidth="1" />
              <line x1="78.8" y1="130" x2="139.4" y2="165" stroke="rgba(0,209,255,0.15)" strokeWidth="1" />
              <line x1="321.2" y1="270" x2="260.6" y2="235" stroke="rgba(0,209,255,0.15)" strokeWidth="1" />

              {/* Central AgentPay Mark */}
              <g transform="translate(130, 130) scale(5.83)">
                <polygon points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7" stroke="url(#coreGradBack)" strokeWidth="1.5" strokeLinejoin="miter" fill="none" />
                <g stroke="url(#coreGrad)" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="butt">
                  <path d="M 6.5 17 L 12 6 L 17.5 17" />
                  <path d="M 8.75 12.5 H 20.66" />
                  <path d="M 16.5 8.5 L 20.66 12.5 L 16.5 16.5" />
                </g>
              </g>
            </svg>

            {/* Floating badge: POLICY_ACTIVE */}
            <div
              className="absolute top-[18%] right-[8%] rounded px-2.5 py-1 text-[0.65rem] font-medium flex items-center gap-1.5 animate-float-subtle"
              style={{
                animationDelay: '-2s',
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: '#030305',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                color: '#D1D5DB',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: '#00D1FF' }} />
              POLICY_ACTIVE
            </div>

            {/* Floating badge: VAL */}
            <div
              className="absolute bottom-[22%] left-[6%] rounded px-2.5 py-1 text-[0.65rem] font-medium flex items-center gap-1.5 animate-float-subtle"
              style={{
                animationDelay: '-4s',
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: '#030305',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                color: '#9CA3AF',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              VAL_0x4F...9A
            </div>

          </div>
        </div>
      </main>

      {/* ── Below-fold sections ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">

        {/* Credibility Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16 text-xs" style={{ color: '#4B5563' }}>
          {['Bounded Execution', 'Policy-Enforced', 'Receipt-Verified', 'Deterministic Control'].map((item, i, arr) => (
            <span key={item} className="flex items-center gap-4 sm:gap-6">
              <span style={{ color: '#6B7280' }}>{item}</span>
              {i < arr.length - 1 && <span style={{ color: '#2a2a2a' }}>•</span>}
            </span>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#6B7280' }}>How it works</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { step: 'Step 1', icon: '👤', title: 'Human sets policy', sub: 'Max per tx, daily cap, whitelist' },
              { step: 'Step 2', icon: '🤖', title: 'Agent calls API', sub: 'Gets 402 Payment Required' },
              { step: 'Step 3', icon: '🔒', title: 'Contract enforces', sub: 'Policy checked on-chain' },
              { step: 'Step 4', icon: '✅', title: 'USDC settles', sub: 'API unlocks, agent gets data' },
            ].map(({ step, icon, title, sub }) => (
              <div
                key={step}
                className="card-interactive rounded-xl p-4 text-center"
                style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mx-auto mb-3" style={{ backgroundColor: '#1a2332' }}>
                  {icon}
                </div>
                <div className="text-xs font-mono mb-1" style={{ color: '#2F6BFF' }}>{step}</div>
                <div className="text-sm font-semibold mb-1 text-white">{title}</div>
                <div className="text-xs" style={{ color: '#6B7280' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden mb-16"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { value: '$0.001', label: 'Per API call (USDC)' },
            { value: '<2s', label: 'Payment settlement' },
            { value: '100%', label: 'On-chain enforced' },
          ].map(({ value, label }) => (
            <div key={label} className="px-5 sm:px-8 py-6" style={{ backgroundColor: '#030305' }}>
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(to right, #2F6BFF, #00D1FF)' }}
              >
                {value}
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            {
              icon: '🔒',
              label: 'Financial authority is limited by policy.',
              title: 'Bounded Execution',
              body: 'Spending caps enforced by smart contract — not by trust. Agent behavior constrained by on-chain limits and whitelists.',
            },
            {
              icon: '⚡',
              label: 'Deterministic, rule-bound execution.',
              title: 'Contract-Enforced Control',
              body: 'Smart contract logic enforces predictable outcomes. No discretionary overrides. Execution is deterministic, not heuristic.',
            },
            {
              icon: '📊',
              label: 'Block-level verification, not assumptions.',
              title: 'Receipt-Level Verification',
              body: 'Transactions validated via confirmed receipts. Block number and gas usage surfaced. Event decoding ensures verified settlement.',
            },
          ].map(({ icon, label, title, body }) => (
            <div
              key={title}
              className="card-interactive rounded-2xl p-6"
              style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ backgroundColor: '#1a2332' }}>
                {icon}
              </div>
              <div className="text-xs font-semibold mb-2" style={{ color: '#2F6BFF' }}>{label}</div>
              <h3 className="font-semibold mb-2 text-white">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Security Model */}
        <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#6B7280' }}>Execution Governance Model</div>
          <h2 className="text-2xl font-bold mb-6 text-white">Financial containment by design</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              ['Agent never holds private keys', 'All signing happens at the operator wallet layer, not inside agent logic.'],
              ['Smart contract is final authority', 'SDK pre-checks are for UX. The contract will revert any out-of-policy transaction on-chain.'],
              ['Funds locked in vault contract', 'USDC is held by AgentVault, not by the agent. Owner can withdraw at any time.'],
              ['Execution authority is bounded', 'Maximum loss is capped by on-chain policy limits. Even in full agent compromise, financial damage is contained.'],
              ['Instant human override', 'Owner can pause any agent instantly. All payments stop immediately.'],
              ['Full on-chain auditability', 'Every payment emits an on-chain event. Nothing is hidden or off-chain only.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-xs mt-0.5 shrink-0"
                  style={{ backgroundColor: '#1a3a2e', color: '#4ade80' }}
                >
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 text-white">{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footerGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2F6BFF" />
                      <stop offset="1" stopColor="#00D1FF" />
                    </linearGradient>
                    <linearGradient id="footerGradBack" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2F6BFF" stopOpacity="0.3" />
                      <stop offset="1" stopColor="#00D1FF" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <polygon points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7" stroke="url(#footerGradBack)" strokeWidth="2" strokeLinejoin="miter" fill="none" />
                  <g stroke="url(#footerGrad)" strokeWidth="2" strokeLinejoin="miter" strokeLinecap="butt">
                    <path d="M 6.5 17 L 12 6 L 17.5 17" />
                    <path d="M 8.75 12.5 H 20.66" />
                    <path d="M 16.5 8.5 L 20.66 12.5 L 16.5 16.5" />
                  </g>
                </svg>
                <span className="font-semibold text-base text-white">AgentPay</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                Policy-Enforced Execution Infrastructure for Autonomous Agents on Polygon
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#A1A8B3' }}>Resources</div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Contract Address ↗', href: `${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/address/${process.env.NEXT_PUBLIC_AGENT_VAULT}#code`, external: true },
                    { label: 'View on Polygonscan ↗', href: `${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/address/${process.env.NEXT_PUBLIC_AGENT_VAULT}#code`, external: true },
                    { label: 'GitHub Repository ↗', href: process.env.NEXT_PUBLIC_GITHUB_URL ?? '#', external: true },
                  ].map(({ label, href, external }) => (
                    <div key={label}>
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="transition-colors"
                        style={{ color: '#6B7280' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2F6BFF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        {label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#A1A8B3' }}>Documentation</div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Testnet Deployment', href: '/docs' },
                    { label: 'Security Model', href: '/' },
                    { label: 'Dashboard', href: '/dashboard' },
                  ].map(({ label, href }) => (
                    <div key={label}>
                      <Link
                        href={href}
                        className="transition-colors"
                        style={{ color: '#6B7280' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2F6BFF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        {label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-12 pt-8 text-xs text-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: '#4B5563' }}
          >
            © 2026 AgentPay. Built for Polygon Hackathon.
          </div>
        </div>
      </footer>

    </div>
  );
}
