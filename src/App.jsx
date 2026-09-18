import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import DashboardGrid from './components/DashboardGrid';
import VulnerabilitiesTable from './components/VulnerabilitiesTable';
import Scan from './components/Scan';
import Findings from './components/Findings';
import Mitigations from './components/Mitigations';
import Settings from './components/Settings';
import AuthModal from './components/AuthModal';

export default function App() {
  // Navigation active tab: 'dashboard' | 'scan' | 'findings' | 'mitigations' | 'settings'
  const [activePage, setActivePage] = useState('dashboard');

  // Root Scanning Telemetry
  const [isScanning, setIsScanning] = useState(false);
  const [scanTarget, setScanTarget] = useState('');
  const [logs, setLogs] = useState([]);

  // Theme State: 'dark' (Obsidian) | 'midnight' (Navy) | 'light' (Enterprise Light)
  const [theme, setTheme] = useState('dark');

  // RBAC & Auth State
  const [userRole, setUserRole] = useState('user'); // 'user' | 'admin'
  const [userName, setUserName] = useState('Alex Vance');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authToast, setAuthToast] = useState(null);

  const handleLogin = (role, email, name) => {
    setUserRole(role);
    setUserName(name || (role === 'admin' ? 'Root Admin' : 'Security Analyst'));
    setIsLoggedIn(true);

    // Trigger toast notification
    setAuthToast({
      name: name || (role === 'admin' ? 'Root Admin' : 'Security Analyst'),
      role: role === 'admin' ? 'Administrator' : 'Security Analyst',
    });

    setTimeout(() => {
      setAuthToast(null);
    }, 3500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthToast({
      name: userName,
      role: 'Signed Out',
    });
    setTimeout(() => {
      setAuthToast(null);
    }, 2500);
  };

  return (
    <div
      className={`min-h-screen flex relative transition-colors duration-200 theme-${theme} bg-app text-app-primary bg-grid-pattern`}
    >
      {/* 1. Global Floating Toast Notification */}
      {authToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface border border-app px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="text-xs">
            <p className="font-semibold text-app-primary">
              {authToast.role === 'Signed Out' ? 'Logged Out' : `Signed in as ${authToast.name}`}
            </p>
            <p className="text-[11px] text-app-secondary">
              {authToast.role === 'Signed Out' ? 'Session terminated' : `Active Scope: ${authToast.role}`}
            </p>
          </div>
          <button
            onClick={() => setAuthToast(null)}
            className="text-app-muted hover:text-app-primary ml-2 text-xs cursor-pointer font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Global Left Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        currentTheme={theme}
      />

      {/* 3. Main Content Canvas */}
      <main className="flex-1 ml-[70px] sm:ml-[240px] p-5 sm:p-9 min-h-screen overflow-y-auto">
        {/* Dynamic Header with Breadcrumbs and Role Switcher */}
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          userRole={userRole}
          userName={userName}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          currentTheme={theme}
        />

        {/* View 1: Analytical Dashboard */}
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Shimmer Scanning Banner */}
            {isScanning && (
              <div className="animate-shimmer bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-app-primary">
                      Scan in progress on <span className="font-mono text-blue-400">{scanTarget || 'Target Host'}</span>
                    </p>
                    <p className="text-xs text-app-secondary mt-0.5">
                      Engines running active discovery routines. Auditing ports & service banners...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('scan')}
                  className="btn-interactive text-xs text-blue-400 hover:text-blue-300 font-semibold px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 whitespace-nowrap cursor-pointer relative z-10"
                >
                  View Live Console &rarr;
                </button>
              </div>
            )}

            <Stats currentTheme={theme} />
            <DashboardGrid setActivePage={setActivePage} currentTheme={theme} />
            <VulnerabilitiesTable setActivePage={setActivePage} currentTheme={theme} />
          </div>
        )}

        {/* View 2: Scan Workspace & Real-Time Console */}
        {activePage === 'scan' && (
          <Scan
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            scanTarget={scanTarget}
            setScanTarget={setScanTarget}
            logs={logs}
            setLogs={setLogs}
            currentTheme={theme}
          />
        )}

        {/* View 3: Searchable Findings & CVE Repository */}
        {activePage === 'findings' && (
          <Findings setActivePage={setActivePage} currentTheme={theme} />
        )}

        {/* View 4: Actionable Mitigations & Code Fixes */}
        {activePage === 'mitigations' && (
          <Mitigations setActivePage={setActivePage} currentTheme={theme} />
        )}

        {/* View 5: Role-Aware Settings (Profile, Themes, & Admin Engine Flags) */}
        {activePage === 'settings' && (
          <Settings
            userRole={userRole}
            userName={userName}
            currentTheme={theme}
            onUpdateTheme={setTheme}
          />
        )}
      </main>

      {/* 4. Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}