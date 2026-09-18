import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import DashboardGrid from './components/DashboardGrid';
import VulnerabilitiesTable from './components/VulnerabilitiesTable';
import Scan from './components/Scan';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isScanning, setIsScanning] = useState(false);
  const [scanTarget, setScanTarget] = useState('');
  const [logs, setLogs] = useState([]);

  return (
    <div className="bg-[#07101d] min-h-screen text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 ml-[70px] sm:ml-[240px] p-5 sm:p-9 min-h-screen overflow-y-auto">
        <Header activePage={activePage} setActivePage={setActivePage} />

        {/* Page 1: Dashboard View */}
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            {/* Real-time Scanning Notification Banner */}
            {isScanning && (
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-blue-950/50">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Scan in progress on <span className="font-mono text-blue-400">{scanTarget || 'Target Host'}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Engines running active discovery routines. Auditing ports & service banners...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('scan')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  View Live Console &rarr;
                </button>
              </div>
            )}

            <Stats />
            <DashboardGrid setActivePage={setActivePage} />
            <VulnerabilitiesTable setActivePage={setActivePage} />
          </div>
        )}

        {/* Page 2: Dedicated Scan View */}
        {activePage === 'scan' && (
          <Scan
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            scanTarget={scanTarget}
            setScanTarget={setScanTarget}
            logs={logs}
            setLogs={setLogs}
          />
        )}

        {/* Placeholder Fallback for Other Tabs */}
        {activePage !== 'dashboard' && activePage !== 'scan' && (
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-12 text-center text-slate-400">
            <h2 className="text-xl font-bold text-white capitalize mb-2">{activePage} Section</h2>
            <p className="text-sm">We will build this workspace in our next step.</p>
          </div>
        )}
      </main>
    </div>
  );
}