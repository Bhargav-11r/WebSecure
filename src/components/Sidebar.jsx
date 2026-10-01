import React from 'react';

export default function Sidebar({
  activePage,
  setActivePage,
  currentTheme = 'dark',
}) {
  const isLight = currentTheme === 'light';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'scan', label: 'New Scan', icon: '🔍' },
    { id: 'scan-history', label: 'Scan History', icon: '🕘' },
    { id: 'findings', label: 'Findings & CVEs', icon: '🛡️' },
    { id: 'mitigations', label: 'Mitigations', icon: '🔧' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 w-[70px] sm:w-[240px] flex flex-col justify-between p-4 border-r transition-colors z-40 ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-[#07101d] border-slate-800'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
            ⚡
          </div>

          <div className="hidden sm:block overflow-hidden">
            <h1
              className={`text-base font-extrabold tracking-tight truncate ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              WebSecure
            </h1>

            <p
              className={`text-[11px] truncate ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Security suggestions
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="text-sm shrink-0">
                  {item.icon}
                </span>

                <span className="hidden sm:inline truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Backend Status Footer */}
      <div
        className={`p-3 rounded-xl border text-[11px] hidden sm:block ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-600'
            : 'bg-slate-900/50 border-slate-800 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

          <span className="font-semibold text-emerald-600">
            Engine Online
          </span>
        </div>

        <p className="text-[10px] mt-1 text-slate-400 font-mono">
          FastAPI v1.0.0
        </p>
      </div>
    </aside>
  );
}