import React, { useState } from 'react';

export default function Header({
  activePage,
  setActivePage,
  userRole,
  userName = 'Alex Vance',
  isLoggedIn,
  onLogout,
  onOpenAuthModal,
  currentTheme = 'dark',
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const isLight = currentTheme === 'light';

  const pageTitles = {
    dashboard: 'Dashboard',
    scan: 'New Scan',
    findings: 'Findings & CVEs',
    mitigations: 'Mitigations',
    settings: 'Settings',
  };

  const currentTitle = pageTitles[activePage] || 'Overview';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex justify-between items-center mb-8 relative">
      <div>
        {activePage === 'dashboard' ? (
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Dashboard
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              WebSecure · Providing security analysis and suggestions
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`flex items-center gap-1.5 text-lg sm:text-xl font-medium transition-colors cursor-pointer group ${
                isLight ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Dashboard</span>
            </button>
            <span className={isLight ? 'text-slate-400 font-normal' : 'text-slate-600 font-normal'}>/</span>
            <h1 className={`text-lg sm:text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {currentTitle}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
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

        {/* User Pill / Login */}
        <div className="relative">
          {isLoggedIn ? (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    userRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {initials || 'AV'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className={`block text-xs font-semibold leading-none ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    {userName}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {userRole === 'admin' ? 'Admin' : 'Analyst'}
                  </span>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-2xl py-2 z-50 text-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#091524] border-slate-800'
                  }`}
                >
                  <div className={`px-4 py-2 border-b ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                    <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{userName}</p>
                    <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {userRole === 'admin' ? 'admin.root@websecure.internal' : 'analyst@websecure.internal'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onOpenAuthModal();
                    }}
                    className={`w-full text-left px-4 py-2 cursor-pointer transition-colors ${
                      isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Switch Account / Role ⇄
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-rose-500 hover:bg-rose-500/10 cursor-pointer font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}