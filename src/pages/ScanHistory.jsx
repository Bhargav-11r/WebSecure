
import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function ScanHistory({
  currentScanId,
  setCurrentScanId,
  setActivePage,
  currentTheme = 'dark',
}) {
  const isLight = currentTheme === 'light';

  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // =========================================================
  // LOAD SCAN HISTORY
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const loadScanHistory = async () => {
      setIsLoading(true);
      setErrorMsg('');

      try {
        const response = await fetch(
          `${API_BASE}/api/scan/history`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              'Your session has expired. Please sign in again.'
            );
          }

          throw new Error(
            `Unable to load scan history (${response.status}).`
          );
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setScans(
          Array.isArray(data.scans)
            ? data.scans
            : []
        );
      } catch (error) {
        console.error(
          'Failed to load scan history:',
          error
        );

        if (isMounted) {
          setErrorMsg(
            error.message ||
              'Unable to load scan history.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadScanHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDateTime = (timestamp) => {
    if (!timestamp) {
      return '—';
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // =========================================================
  // CALCULATE DURATION
  // =========================================================

  const getDuration = (scan) => {
    if (!scan.started_at || !scan.completed_at) {
      return '—';
    }

    const started = new Date(
      scan.started_at
    ).getTime();

    const completed = new Date(
      scan.completed_at
    ).getTime();

    if (
      Number.isNaN(started) ||
      Number.isNaN(completed) ||
      completed < started
    ) {
      return '—';
    }

    const durationSeconds =
      (completed - started) / 1000;

    if (durationSeconds < 1) {
      return '<1s';
    }

    if (durationSeconds < 60) {
      return `${durationSeconds.toFixed(1)}s`;
    }

    const minutes = Math.floor(
      durationSeconds / 60
    );

    const seconds = Math.round(
      durationSeconds % 60
    );

    return `${minutes}m ${seconds}s`;
  };

  // =========================================================
  // STATUS STYLING
  // =========================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed':
        return isLight
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

      case 'running':
        return isLight
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

      case 'failed':
        return isLight
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-red-500/10 text-red-400 border-red-500/20';

      default:
        return isLight
          ? 'bg-slate-100 text-slate-600 border-slate-200'
          : 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // =========================================================
  // SELECT SCAN
  // =========================================================

  const handleSelectScan = (scan) => {
    if (!scan || scan.id == null) {
      return;
    }

    setCurrentScanId(scan.id);

    /*
     * For now, selecting a scan takes the user to Findings.
     *
     * Later we can make this a dedicated scan-details view
     * or preserve the current page depending on the workflow.
     */
    setActivePage('findings');
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <p
            className={`text-[11px] uppercase tracking-[0.18em] font-mono ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-500'
            }`}
          >
            Security Operations
          </p>

          <h1
            className={`text-2xl font-bold mt-1 ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            Scan History
          </h1>
        </div>

        <div
          className={`rounded-2xl border p-8 text-center ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#07101d] border-slate-800'
          }`}
        >
          <p
            className={`text-xs font-mono ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}
          >
            LOADING SCAN HISTORY...
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (errorMsg) {
    return (
      <section className="space-y-6">
        <div>
          <p
            className={`text-[11px] uppercase tracking-[0.18em] font-mono ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-500'
            }`}
          >
            Security Operations
          </p>

          <h1
            className={`text-2xl font-bold mt-1 ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            Scan History
          </h1>
        </div>

        <div
          className={`rounded-2xl border p-6 ${
            isLight
              ? 'bg-white border-red-200'
              : 'bg-[#07101d] border-red-500/20'
          }`}
        >
          <p className="text-sm font-semibold text-red-500">
            Unable to load scan history
          </p>

          <p
            className={`text-xs mt-2 ${
              isLight
                ? 'text-slate-600'
                : 'text-slate-400'
            }`}
          >
            {errorMsg}
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <section className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p
            className={`text-[11px] uppercase tracking-[0.18em] font-mono ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-500'
            }`}
          >
            Security Operations
          </p>

          <h1
            className={`text-2xl font-bold mt-1 ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            Scan History
          </h1>

          <p
            className={`text-sm mt-2 ${
              isLight
                ? 'text-slate-600'
                : 'text-slate-400'
            }`}
          >
            Review previous security scans and select a
            scan for analysis.
          </p>
        </div>

        <div
          className={`px-3 py-2 rounded-lg border text-xs font-mono ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-slate-900/50 border-slate-800 text-slate-400'
          }`}
        >
          {scans.length} scan
          {scans.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {scans.length === 0 ? (
        <div
          className={`rounded-2xl border p-10 text-center ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#07101d] border-slate-800'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            No scans found
          </p>

          <p
            className={`text-xs mt-2 ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}
          >
            Run a security scan to create your first
            scan record.
          </p>

          <button
            onClick={() => setActivePage('scan')}
            className="mt-5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Start New Scan
          </button>
        </div>
      ) : (
        /* ===================================================
            HISTORY TABLE
        ==================================================== */

        <div
          className={`rounded-2xl border overflow-hidden ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#07101d] border-slate-800'
          }`}
        >
          {/* Table Header */}

          <div
            className={`grid grid-cols-[70px_minmax(180px,1.5fr)_120px_minmax(160px,1fr)_100px_110px] gap-4 px-5 py-3 border-b text-[10px] uppercase tracking-wider font-mono ${
              isLight
                ? 'border-slate-200 bg-slate-50 text-slate-500'
                : 'border-slate-800 bg-slate-900/40 text-slate-500'
            }`}
          >
            <span>ID</span>
            <span>Target</span>
            <span>Status</span>
            <span>Started</span>
            <span>Duration</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}

          {scans.map((scan) => {
            const isSelected =
              currentScanId === scan.id;

            return (
              <div
                key={scan.id}
                className={`grid grid-cols-[70px_minmax(180px,1.5fr)_120px_minmax(160px,1fr)_100px_110px] gap-4 items-center px-5 py-4 border-b last:border-b-0 transition-colors ${
                  isLight
                    ? `border-slate-100 ${
                        isSelected
                          ? 'bg-blue-50/60'
                          : 'hover:bg-slate-50'
                      }`
                    : `border-slate-800/70 ${
                        isSelected
                          ? 'bg-blue-500/5'
                          : 'hover:bg-slate-900/40'
                      }`
                }`}
              >
                {/* ID */}

                <span
                  className={`text-xs font-mono ${
                    isSelected
                      ? 'text-blue-500'
                      : isLight
                      ? 'text-slate-500'
                      : 'text-slate-500'
                  }`}
                >
                  #{scan.id}
                </span>

                {/* Target */}

                <div className="min-w-0">
                  <p
                    className={`text-sm font-mono truncate ${
                      isLight
                        ? 'text-slate-900'
                        : 'text-slate-200'
                    }`}
                    title={scan.target}
                  >
                    {scan.target || 'Unknown target'}
                  </p>
                </div>

                {/* Status */}

                <div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] uppercase tracking-wide font-semibold ${getStatusClasses(
                      scan.status
                    )}`}
                  >
                    {scan.status || 'unknown'}
                  </span>
                </div>

                {/* Started */}

                <span
                  className={`text-xs ${
                    isLight
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {formatDateTime(
                    scan.started_at
                  )}
                </span>

                {/* Duration */}

                <span
                  className={`text-xs font-mono ${
                    isLight
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {getDuration(scan)}
                </span>

                {/* Action */}

                <button
                  onClick={() =>
                    handleSelectScan(scan)
                  }
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isLight
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isSelected
                    ? 'Selected'
                    : 'View Scan'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

