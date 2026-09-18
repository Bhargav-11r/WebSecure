import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import DashboardGrid from './components/DashboardGrid';
import VulnerabilitiesTable from './components/VulnerabilitiesTable';
import Scan from './components/Scan';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="bg-[#07101d] min-h-screen text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 ml-[70px] sm:ml-[240px] p-5 sm:p-9 min-h-screen overflow-y-auto">
        {/* Header with Quick Action */}
        <Header setActivePage={setActivePage} />

        {/* Page 1: Dashboard View */}
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            <Stats />
            <DashboardGrid setActivePage={setActivePage} />
            <VulnerabilitiesTable setActivePage={setActivePage} />
          </div>
        )}

        {/* Page 2: Dedicated Scan View */}
        {activePage === 'scan' && <Scan />}

        {/* Placeholder Fallback for Unbuilt Views */}
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