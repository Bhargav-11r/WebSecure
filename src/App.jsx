import React, { useEffect, useState } from 'react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import Findings from './pages/Findings';
import Mitigations from './pages/Mitigations';
import ScanHistory from './pages/ScanHistory';
import Suggestions from './pages/Suggestions';
import Settings from './pages/Settings';

import AuthModal from './components/AuthModal';

const API_BASE = 'http://localhost:8000';

export default function App() {
  // =========================================================
  // APPLICATION STATE
  // =========================================================

  const [activePage, setActivePage] = useState('landing');

  // =========================================================
  // SCAN STATE
  // =========================================================

  const [isScanning, setIsScanning] = useState(false);
  const [scanTarget, setScanTarget] = useState('');
  const [logs, setLogs] = useState([]);

  // =========================================================
  // CURRENT SELECTED SCAN
  // =========================================================

  const [currentScanId, setCurrentScanId] = useState(null);

  // =========================================================
  // THEME
  // =========================================================

  const [theme, setTheme] = useState('dark');

  // =========================================================
  // AUTHENTICATION STATE
  // =========================================================

  const [userRole, setUserRole] = useState('user');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authToast, setAuthToast] = useState(null);

  // =========================================================
  // CHECK EXISTING BACKEND SESSION
  // =========================================================

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/me`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          setIsLoggedIn(false);
          setUserName('');
          setUserEmail('');
          setUserRole('user');
          setCurrentScanId(null);
          return;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
          setIsLoggedIn(true);

          setUserEmail(data.user.email);
          setUserName(data.user.email);

          // Current backend authentication does not expose
          // a role system yet.
          setUserRole('user');
        } else {
          setIsLoggedIn(false);
          setUserName('');
          setUserEmail('');
          setUserRole('user');
          setCurrentScanId(null);
        }
      } catch (error) {
        console.error(
          'Unable to verify authentication session:',
          error
        );

        setIsLoggedIn(false);
        setUserName('');
        setUserEmail('');
        setUserRole('user');
        setCurrentScanId(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = (user) => {
    if (!user) {
      return;
    }

    setUserEmail(user.email || '');
    setUserName(user.email || 'WebSecure User');
    setUserRole('user');
    setIsLoggedIn(true);

    // A newly authenticated user starts without a selected scan.
    setCurrentScanId(null);

    setAuthToast({
      name: user.email || 'WebSecure User',
      role: 'Security Analyst',
    });

    setTimeout(() => {
      setAuthToast(null);
    }, 3500);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        console.error(
          'Backend logout returned:',
          response.status
        );
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    // Clear authentication state.
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('');
    setUserRole('user');

    // Clear scan-related frontend state.
    setIsScanning(false);
    setScanTarget('');
    setLogs([]);
    setCurrentScanId(null);

    setAuthToast({
      name: 'WebSecure User',
      role: 'Signed Out',
    });

    setTimeout(() => {
      setAuthToast(null);
    }, 2500);

    setActivePage('landing');
  };

  // =========================================================
  // AUTHENTICATION CHECK SCREEN
  // =========================================================

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-slate-400">
        <p className="text-xs font-mono tracking-wider">
          VERIFYING WEBSECURE SESSION...
        </p>
      </div>
    );
  }

  // =========================================================
  // LANDING PAGE
  // =========================================================

  if (activePage === 'landing') {
    return (
      <>
        <LandingPage
          setActivePage={setActivePage}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  // =========================================================
  // APPLICATION / DASHBOARD
  // =========================================================

  return (
    <div
      className={`min-h-screen flex relative transition-colors duration-200 theme-${theme} bg-app text-app-primary bg-grid-pattern`}
    >
      {/* =====================================================
          AUTH TOAST
      ====================================================== */}

      {authToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface border border-app px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <div className="text-xs">
            <p className="font-semibold text-app-primary">
              {authToast.role === 'Signed Out'
                ? 'Logged Out'
                : `Signed in as ${authToast.name}`}
            </p>

            <p className="text-[11px] text-app-secondary">
              {authToast.role === 'Signed Out'
                ? 'Session terminated'
                : `Active Scope: ${authToast.role}`}
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

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        currentTheme={theme}
      />

      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}

      <main className="flex-1 ml-[70px] sm:ml-[240px] p-5 sm:p-9 min-h-screen overflow-y-auto">

        {/* ===================================================
            HEADER
        ==================================================== */}

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

        {/* ===================================================
            DASHBOARD
        ==================================================== */}

        {activePage === 'dashboard' && (
          <Dashboard
            isScanning={isScanning}
            scanTarget={scanTarget}
            currentScanId={currentScanId}
            setActivePage={setActivePage}
            currentTheme={theme}
          />
        )}

        {/* ===================================================
            SCAN
        ==================================================== */}

        {activePage === 'scan' && (
          <Scan
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            scanTarget={scanTarget}
            setScanTarget={setScanTarget}
            logs={logs}
            setLogs={setLogs}
            currentScanId={currentScanId}
            setCurrentScanId={setCurrentScanId}
            currentTheme={theme}
          />
        )}

        {/* ===================================================
            SCAN HISTORY
        ==================================================== */}

        {activePage === 'scan-history' && (
          <ScanHistory
            currentScanId={currentScanId}
            setCurrentScanId={setCurrentScanId}
            setActivePage={setActivePage}
            currentTheme={theme}
          />
        )}

        {/* ===================================================
            FINDINGS
        ==================================================== */}

        {activePage === 'findings' && (
          <Findings
            currentScanId={currentScanId}
            setActivePage={setActivePage}
            currentTheme={theme}
          />
        )}

        {/* ===================================================
            MITIGATIONS
        ==================================================== */}

        {activePage === 'mitigations' && (
          <Mitigations
            currentScanId={currentScanId}
            setActivePage={setActivePage}
            currentTheme={theme}
          />
        )}

        {/* ===================================================
            SUGGESTIONS
        ==================================================== */}

        {activePage === 'suggestions' && (
          <Suggestions
            currentScanId={currentScanId}
            setActivePage={setActivePage}
            currentTheme={theme}
          />
        )}

        {/* ===================================================
            SETTINGS
        ==================================================== */}

        {activePage === 'settings' && (
          <Settings
            userRole={userRole}
            userName={userName}
            userEmail={userEmail}
            currentTheme={theme}
            onUpdateTheme={setTheme}
          />
        )}
      </main>

      {/* =====================================================
          AUTH MODAL
      ====================================================== */}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}