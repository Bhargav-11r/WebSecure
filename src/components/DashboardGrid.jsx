import React from 'react';

export default function DashboardGrid({ setActivePage }) {
  const recentScans = [
    { target: 'api.production-core.net', time: '12m ago', duration: '4.2s', status: 'Critical', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { target: 'auth.client-portal.io', time: '1h ago', duration: '2.1s', status: 'High', style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { target: 'staging.testnet.internal', time: '3h ago', duration: '8.4s', status: 'Medium', style: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { target: 'static-cdn.edge.org', time: '1d ago', duration: '1.2s', status: 'Clean', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Threat Severity Profile */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Threat Severity Profile</h2>
            <p className="text-xs text-slate-400 mt-0.5">Aggregated breakdown of detected issues</p>
          </div>
          <button
            onClick={() => setActivePage('findings')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            Full Report &rarr;
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: 'conic-gradient(#f43f5e 0deg 60deg, #f59e0b 60deg 170deg, #38bdf8 170deg 280deg, #10b981 280deg 360deg)',
            }}
          >
            <div className="w-[104px] h-[104px] bg-[#07101d] rounded-full flex flex-col items-center justify-center border border-slate-800/60">
              <span className="text-2xl font-bold tracking-tight text-white">50</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Issues</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 text-xs w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical
              </span>
              <span className="font-mono font-semibold text-rose-400">03</span>
            </div>
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> High
              </span>
              <span className="font-mono font-semibold text-amber-400">08</span>
            </div>
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span> Medium
              </span>
              <span className="font-mono font-semibold text-sky-400">15</span>
            </div>
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low / Info
              </span>
              <span className="font-mono font-semibold text-emerald-400">24</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Target Audits */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Recent Target Audits</h2>
            <p className="text-xs text-slate-400 mt-0.5">Execution history across all scanning agents</p>
          </div>
          <button
            onClick={() => setActivePage('scan')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            New Audit &rarr;
          </button>
        </div>

        <div className="space-y-2.5">
          {recentScans.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors"
            >
              <div className="min-w-0 pr-3">
                <p className="text-xs font-mono font-medium text-slate-200 truncate">{item.target}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{item.time}</span>
                  <span>•</span>
                  <span>Duration: {item.duration}</span>
                </div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium uppercase tracking-wider ${item.style}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}