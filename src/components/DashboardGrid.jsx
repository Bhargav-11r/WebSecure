import React from 'react';

export default function DashboardGrid({ setActivePage, currentTheme = 'dark' }) {
  const isLight = currentTheme === 'light';

  const targets = [
    { host: 'api.production.internal', status: 'Audited', flaws: '2 Critical', time: '12m ago' },
    { host: 'ingress-router-01.us-east', status: 'Scanning', flaws: 'In Progress', time: 'Just now' },
    { host: 'auth.staging-vpc.net', status: 'Clean', flaws: '0 Flaws', time: '1h ago' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Severity Breakdown Donut Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className={`text-sm font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Severity Distribution
          </h3>
          <button
            onClick={() => setActivePage('findings')}
            className={`btn-interactive text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200'
                : 'bg-slate-800/80 hover:bg-slate-800 text-blue-400 border-slate-700'
            }`}
          >
            All CVEs &rarr;
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center shrink-0 shadow-inner"
            style={{
              background: 'conic-gradient(#f43f5e 0% 32%, #f59e0b 32% 65%, #38bdf8 65% 85%, #10b981 85% 100%)',
            }}
          >
            <div
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-md ${
                isLight ? 'bg-white' : 'bg-[#091322]'
              }`}
            >
              <span className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>28</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
            </div>
          </div>

          <div className="space-y-2 text-xs w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical
              </span>
              <strong className={isLight ? 'text-slate-800' : 'text-white'}>9 (32%)</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High
              </span>
              <strong className={isLight ? 'text-slate-800' : 'text-white'}>10 (33%)</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Medium
              </span>
              <strong className={isLight ? 'text-slate-800' : 'text-white'}>6 (20%)</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low
              </span>
              <strong className={isLight ? 'text-slate-800' : 'text-white'}>3 (15%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Target Feeds Card */}
      <div
        className={`lg:col-span-2 p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-sm font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Recent Target Assessments
          </h3>
          <button
            onClick={() => setActivePage('scan')}
            className={`btn-interactive text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200'
                : 'bg-slate-800/80 hover:bg-slate-800 text-blue-400 border-slate-700'
            }`}
          >
            + Add Target
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {targets.map((tgt, i) => (
            <div
              key={i}
              className={`py-3.5 flex items-center justify-between transition-colors px-2 -mx-2 rounded-xl ${
                isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'
              }`}
            >
              <div>
                <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {tgt.host}
                </span>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Last probe: {tgt.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    tgt.flaws.includes('Critical')
                      ? isLight
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : tgt.status === 'Scanning'
                      ? isLight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : isLight
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {tgt.flaws}
                </span>
                <button
                  onClick={() => setActivePage('mitigations')}
                  className={`btn-interactive text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  Triage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}