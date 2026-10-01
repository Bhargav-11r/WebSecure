import React, { useState } from 'react';

export default function LandingPage({ setActivePage }) {
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);

  const runDemo = () => {
    setDemoRunning(true);
    setDemoComplete(false);

    setTimeout(() => {
      setDemoRunning(false);
      setDemoComplete(true);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white overflow-hidden">

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <nav className="h-20 border-b border-white/10 flex items-center justify-between px-6 sm:px-10 lg:px-16 bg-[#070b12]/90 backdrop-blur-xl sticky top-0 z-50">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-blue-500/40 bg-blue-500/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-5 h-5 text-blue-400"
            >
              <path d="M12 3L19 6V11C19 16 16 19.5 12 21C8 19.5 5 16 5 11V6L12 3Z" />
              <path d="M9 12L11 14L15 10" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.18em]">
              WEBSECURE
            </p>
            <p className="text-[9px] text-gray-500 tracking-widest uppercase">
              Security Analysis Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#platform" className="hover:text-white transition-colors">
            Platform
          </a>

          <a href="#workflow" className="hover:text-white transition-colors">
            How It Works
          </a>

          <a href="#capabilities" className="hover:text-white transition-colors">
            Capabilities
          </a>
        </div>

        {/* Login */}
        <button
          onClick={() => setActivePage('dashboard')}
          className="text-sm px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all"
        >
          Open Platform
        </button>
      </nav>


      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        id="platform"
        className="relative px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-24"
      >

        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '45px 45px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Hero Copy */}
          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/[0.06] text-blue-400 text-xs font-mono mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              SECURITY ANALYSIS PLATFORM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              See your web
              <span className="block text-blue-400">
                security posture.
              </span>
            </h1>

            <h2 className="mt-5 text-xl sm:text-2xl text-gray-300 font-normal">
              Understand the exposure.
              <span className="text-gray-500"> Know what to fix.</span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-gray-400">
              WebSecure analyzes exposed services and web-facing systems,
              organizes security observations by severity, and turns technical
              findings into actionable remediation guidance.
            </p>

            <div className="flex flex-wrap gap-3 mt-9">

              <button
                onClick={() => setActivePage('scan')}
                className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all shadow-lg shadow-blue-950/30"
              >
                Start a Security Scan
                <span className="ml-2">→</span>
              </button>

              <a
                href="#workflow"
                className="px-5 py-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-sm font-medium transition-all"
              >
                Explore Platform
              </a>

            </div>

            <div className="flex items-center gap-6 mt-8 text-xs text-gray-500 font-mono">
              <span>DISCOVERY</span>
              <span className="text-gray-700">/</span>
              <span>ANALYSIS</span>
              <span className="text-gray-700">/</span>
              <span>FINDINGS</span>
              <span className="text-gray-700">/</span>
              <span>REMEDIATION</span>
            </div>

          </div>


          {/* =====================================================
              HERO TELEMETRY PANEL
          ===================================================== */}
          <div className="relative">

            <div className="absolute -inset-8 bg-blue-500/[0.04] blur-3xl rounded-full" />

            <div className="relative rounded-2xl border border-white/10 bg-[#0b111b] shadow-2xl overflow-hidden">

              {/* Window Header */}
              <div className="h-11 px-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-mono text-gray-400">
                    websecure://analysis
                  </span>
                </div>

                <span className="text-[10px] text-gray-600 font-mono">
                  LIVE TELEMETRY
                </span>

              </div>

              <div className="p-6">

                <div className="flex items-start justify-between mb-7">

                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      Target
                    </p>

                    <p className="font-mono text-sm mt-1 text-gray-200">
                      example.com
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    ANALYSIS READY
                  </span>

                </div>


                {/* Analysis pipeline */}
                <div className="space-y-3">

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.025] border border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-600">
                        01
                      </span>
                      <span className="text-sm text-gray-300">
                        Attack Surface Discovery
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-mono">
                      COMPLETE
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.025] border border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-600">
                        02
                      </span>
                      <span className="text-sm text-gray-300">
                        Service Analysis
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-mono">
                      COMPLETE
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.025] border border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-600">
                        03
                      </span>
                      <span className="text-sm text-gray-300">
                        Web Security Analysis
                      </span>
                    </div>

                    <span className="text-[10px] text-blue-400 font-mono">
                      RUNNING
                    </span>
                  </div>

                </div>


                {/* Ports */}
                <div className="mt-7 pt-5 border-t border-white/[0.07]">

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                      Observed Services
                    </span>

                    <span className="text-[10px] text-gray-600 font-mono">
                      3 SERVICES
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">

                    <div className="p-3 rounded-lg bg-black/20 border border-white/[0.06]">
                      <p className="font-mono text-sm text-gray-200">22</p>
                      <p className="text-[10px] text-gray-500 mt-1">SSH</p>
                    </div>

                    <div className="p-3 rounded-lg bg-black/20 border border-white/[0.06]">
                      <p className="font-mono text-sm text-gray-200">80</p>
                      <p className="text-[10px] text-gray-500 mt-1">HTTP</p>
                    </div>

                    <div className="p-3 rounded-lg bg-black/20 border border-white/[0.06]">
                      <p className="font-mono text-sm text-gray-200">443</p>
                      <p className="text-[10px] text-gray-500 mt-1">HTTPS</p>
                    </div>

                  </div>

                </div>


                {/* Findings */}
                <div className="mt-5 flex items-center justify-between p-4 rounded-lg bg-blue-500/[0.04] border border-blue-500/10">

                  <div>
                    <p className="text-sm text-gray-300">
                      Security observations
                    </p>

                    <p className="text-xs text-gray-600 mt-1 font-mono">
                      awaiting correlation
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-semibold">
                      03
                    </p>

                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">
                      findings
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================
          WORKFLOW
      ========================================================= */}
      <section
        id="workflow"
        className="border-y border-white/[0.07] bg-[#090e16] px-6 sm:px-10 lg:px-16 py-24"
      >

        <div className="max-w-7xl mx-auto">

          <div className="max-w-2xl mb-14">

            <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-4">
              How WebSecure Works
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              From exposed surface to actionable insight.
            </h2>

            <p className="mt-5 text-gray-400 leading-7">
              WebSecure follows a structured security-analysis workflow so
              technical scan output can be understood in the context of
              security findings and remediation.
            </p>

          </div>


          <div className="grid md:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden">

            {[
              {
                number: '01',
                title: 'Discover',
                text: 'Identify exposed ports, services, and web-facing attack surface.',
              },
              {
                number: '02',
                title: 'Analyze',
                text: 'Inspect discovered services and security-relevant observations.',
              },
              {
                number: '03',
                title: 'Identify',
                text: 'Organize observations into understandable security findings.',
              },
              {
                number: '04',
                title: 'Remediate',
                text: 'Translate findings into practical mitigation guidance.',
              },
            ].map((item) => (
              <div
                key={item.number}
                className="bg-[#0b111b] p-7 hover:bg-[#0e1520] transition-colors"
              >
                <span className="text-xs font-mono text-gray-600">
                  {item.number}
                </span>

                <h3 className="text-lg font-medium mt-8">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-3">
                  {item.text}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          CAPABILITIES
      ========================================================= */}
      <section
        id="capabilities"
        className="px-6 sm:px-10 lg:px-16 py-24"
      >

        <div className="max-w-7xl mx-auto">

          <div className="mb-14">

            <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-4">
              Platform Capabilities
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Built around the security analyst workflow.
            </h2>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {[
              {
                title: 'Attack Surface',
                text: 'Discover exposed ports, services, and technologies.',
              },
              {
                title: 'Security Findings',
                text: 'Turn raw observations into structured security findings.',
              },
              {
                title: 'Evidence',
                text: 'Keep technical evidence connected to each observation.',
              },
              {
                title: 'Remediation',
                text: 'Provide actionable guidance for addressing findings.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg border border-blue-500/20 bg-blue-500/[0.06] flex items-center justify-center mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>

                <h3 className="font-medium">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-3">
                  {item.text}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          INTERACTIVE DEMO
      ========================================================= */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="rounded-2xl border border-white/[0.08] bg-[#0b111b] overflow-hidden">

            <div className="grid lg:grid-cols-2">

              {/* Copy */}
              <div className="p-8 sm:p-12">

                <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-5">
                  Interactive Preview
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  See the analysis workflow in action.
                </h2>

                <p className="mt-5 text-gray-400 leading-7 max-w-lg">
                  Explore a simulated WebSecure analysis to understand how
                  discovery, service inspection, findings, and remediation
                  fit together.
                </p>

                <button
                  onClick={runDemo}
                  disabled={demoRunning}
                  className="mt-8 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-medium transition-all"
                >
                  {demoRunning
                    ? 'Running Analysis...'
                    : demoComplete
                    ? 'Run Demo Again'
                    : 'Run Demo Analysis'}
                </button>

              </div>


              {/* Demo Console */}
              <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-black/20 p-7 sm:p-10">

                <div className="font-mono text-xs space-y-4">

                  <div className="flex gap-3">
                    <span className="text-gray-700">
                      01
                    </span>

                    <span className="text-gray-400">
                      Initializing security analysis...
                    </span>

                    <span className="text-emerald-400 ml-auto">
                      ✓
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-gray-700">
                      02
                    </span>

                    <span className="text-gray-400">
                      Discovering exposed services...
                    </span>

                    <span className="text-emerald-400 ml-auto">
                      ✓
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-gray-700">
                      03
                    </span>

                    <span className="text-gray-400">
                      Analyzing web surface...
                    </span>

                    <span className="text-blue-400 ml-auto">
                      {demoRunning ? '...' : demoComplete ? '✓' : '—'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-gray-700">
                      04
                    </span>

                    <span className="text-gray-400">
                      Correlating observations...
                    </span>

                    <span className="text-blue-400 ml-auto">
                      {demoRunning ? '...' : demoComplete ? '✓' : '—'}
                    </span>
                  </div>


                  {demoComplete && (
                    <div className="mt-7 pt-6 border-t border-white/[0.08]">

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">
                          Analysis complete
                        </span>

                        <span className="text-emerald-400">
                          READY
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">

                        <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                          <p className="text-lg text-white">03</p>
                          <p className="text-[9px] text-gray-600 uppercase mt-1">
                            Findings
                          </p>
                        </div>

                        <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                          <p className="text-lg text-white">07</p>
                          <p className="text-[9px] text-gray-600 uppercase mt-1">
                            Services
                          </p>
                        </div>

                        <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                          <p className="text-lg text-white">04</p>
                          <p className="text-[9px] text-gray-600 uppercase mt-1">
                            Actions
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="border-t border-white/[0.07] px-6 sm:px-10 lg:px-16 py-24">

        <div className="max-w-4xl mx-auto text-center">

          <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-5">
            WebSecure
          </p>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Understand what is exposed.
          </h2>

          <p className="mt-5 text-gray-500">
            Move from raw security telemetry to findings you can actually act on.
          </p>

          <button
            onClick={() => setActivePage('dashboard')}
            className="mt-8 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all"
          >
            Open WebSecure Dashboard →
          </button>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/[0.07] px-6 sm:px-10 lg:px-16 py-8">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-600">
            WebSecure — Security Analysis Platform
          </p>

          <p className="text-[10px] text-gray-700 font-mono">
            DISCOVER · ANALYZE · IDENTIFY · REMEDIATE
          </p>

        </div>

      </footer>

    </div>
  );
}