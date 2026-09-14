import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ScanBox from './components/ScanBox';
import Stats from './components/Stats';
import DashboardGrid from './components/DashboardGrid';
import VulnerabilitiesTable from './components/VulnerabilitiesTable';

// We import the CSS in main.jsx usually, but importing it here works too if needed
import './index.css'; 

function App() {
  return (
    <>
      <Sidebar />
      <main className="main">
        <Header />
        <ScanBox />
        <Stats />
        <DashboardGrid />
        <VulnerabilitiesTable />
      </main>
    </>
  );
}

export default App;