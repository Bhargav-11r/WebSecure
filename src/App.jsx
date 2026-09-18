import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ScanBox from './components/ScanBox';
import Stats from './components/Stats';
import DashboardGrid from './components/DashboardGrid';
import VulnerabilitiesTable from './components/VulnerabilitiesTable';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = (target) => {
    setIsScanning(true);
    // Simulating scan trigger (will connect to FastAPI backend)
    setTimeout(() => {
      setIsScanning(false);
      alert(`Scan simulation complete for ${target}`);
    }, 2500);
  };

  return (
    <div className="bg-[#07101d] min-h-screen text-white flex">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Page Content */}
      <main className="flex-1 ml-[70px] sm:ml-[240px] p-5 sm:p-9 min-h-screen overflow-y-auto">
        <Header />
        
        {activePage === 'dashboard' && (
          <>
            <ScanBox onStartScan={handleStartScan} isScanning={isScanning} />
            <Stats />
            <DashboardGrid />
            <VulnerabilitiesTable />
          </>
        )}

        {activePage !== 'dashboard' && (
          <div className="bg-[#0b1727] border border-[#1a2b40] rounded-xl p-12 text-center text-[#8795a9]">
            <h2 className="text-xl font-bold text-white capitalize mb-2">{activePage} Section</h2>
            <p className="text-sm">We will build this screen in our next step.</p>
          </div>
        )}
      </main>
    </div>
  );
}