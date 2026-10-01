import React, { useEffect, useMemo, useState } from 'react';

import Stats from '../components/Stats';
import DashboardGrid from '../components/DashboardGrid';
import VulnerabilitiesTable from '../components/VulnerabilitiesTable';

const API_BASE = 'http://localhost:8000';

export default function Dashboard({
  isScanning,
  scanTarget,
  setActivePage,
  currentTheme,
  currentScanId,
}) {
  const [scans, setScans] = useState([]);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  /*
   * Load scan history.
   */
  useEffect(() => {
    const loadScanHistory = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        const response = await fetch(
          `${API_BASE}/api/scan/history`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Failed to load scan history.'
          );
        }

        setScans(
          Array.isArray(data.scans)
            ? data.scans
            : []
        );
      } catch (error) {
        console.error('Dashboard history error:', error);

        setErrorMsg(
          error.message || 'Unable to load dashboard data.'
        );

        setScans([]);
      } finally {
        setLoading(false);
      }
    };

    loadScanHistory();
  }, []);

  /*
   * Determine which scan should provide dashboard findings.
   *
   * If a scan has been selected elsewhere, use it.
   * Otherwise use the latest scan from history.
   */
  const selectedScanId = useMemo(() => {
    if (currentScanId) {
      return currentScanId;
    }

    if (scans.length > 0) {
      return scans[0].id;
    }

    return null;
  }, [currentScanId, scans]);

  /*
   * Load findings for the selected/latest scan.
   */
  useEffect(() => {
    if (!selectedScanId) {
      setFindings([]);
      return;
    }

    const loadFindings = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/scan/${selectedScanId}/findings`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Failed to load findings.'
          );
        }

        setFindings(
          Array.isArray(data.findings)
            ? data.findings
            : []
        );
      } catch (error) {
        console.error('Dashboard findings error:', error);
        setFindings([]);
      }
    };

    loadFindings();
  }, [selectedScanId]);

  return (
    <div className="space-y-6">

      {/* Live Scanning Banner */}
      {isScanning && (
        <div className="animate-shimmer bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
            </span>

            <div>
              <p className="text-sm font-semibold text-app-primary">
                Scan in progress on{' '}
                <span className="font-mono text-blue-400">
                  {scanTarget || 'Target Host'}
                </span>
              </p>

              <p className="text-xs text-app-secondary mt-0.5">
                Engines running active discovery routines. Auditing ports
                and service banners...
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('scan')}
            className="btn-interactive text-xs text-blue-400 hover:text-blue-300 font-semibold px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 whitespace-nowrap cursor-pointer relative z-10"
          >
            View Live Console →
          </button>
        </div>
      )}

      {/* Dashboard Error */}
      {errorMsg && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            currentTheme === 'light'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-red-950/20 border-red-900/50 text-red-400'
          }`}
        >
          {errorMsg}
        </div>
      )}

      {/* Dashboard Statistics */}
      <Stats
        currentTheme={currentTheme}
        scans={scans}
        findings={findings}
        loading={loading}
      />

      {/* Main Dashboard Grid */}
      <DashboardGrid
        setActivePage={setActivePage}
        currentTheme={currentTheme}
        scans={scans}
        findings={findings}
        loading={loading}
      />

      {/* Recent Findings */}
      <VulnerabilitiesTable
        setActivePage={setActivePage}
        currentTheme={currentTheme}
        findings={findings}
        loading={loading}
      />

    </div>
  );
}