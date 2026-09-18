import React from 'react';

export default function Header({ activePage, setActivePage }) {
  const pageTitles = {
    dashboard: 'Dashboard',
    scan: 'New Scan',
    findings: 'Findings & CVEs',
    mitigations: 'Mitigations',
    settings: 'Settings',
  };

  const currentTitle = pageTitles[activePage] || 'Overview';

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        {activePage === 'dashboard' ? (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              WebSecure · Security analysis and suggestions
            </p>
          </div>
        ) : (
          /* Enterprise Breadcrumb Pattern: "Dashboard / [Current Page]" */
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('dashboard')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 text-lg sm:text-xl font-medium transition-colors cursor-pointer group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Dashboard</span>
            </button>
            <span className="text-slate-600 font-normal">/</span>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentTitle}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Primary Action Button - Dashboard Only */}
        {activePage === 'dashboard' && (
          <button
            onClick={() => setActivePage('scan')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Launch Assessment</span>
          </button>
        )}

        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs tracking-wider">
          WS
        </div>
      </div>
    </header>
  );
}