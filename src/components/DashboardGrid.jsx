import React, { useMemo } from 'react';

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return 'Unknown';
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  const difference = Date.now() - date.getTime();
  const seconds = Math.max(0, Math.floor(difference / 1000));

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

function getStatusLabel(status) {
  if (!status) {
    return 'Unknown';
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function DashboardGrid({
  setActivePage,
  currentTheme = 'dark',
  scans = [],
  findings = [],
  loading = false,
}) {
  const isLight = currentTheme === 'light';

  /*
   * Calculate severity counts from actual findings.
   */
  const severityCounts = useMemo(() => {
    const counts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0,
    };

    findings.forEach((finding) => {
      const severity = String(
        finding.severity || 'Informational'
      ).toLowerCase();

      if (severity === 'critical') {
        counts.Critical += 1;
      } else if (severity === 'high') {
        counts.High += 1;
      } else if (severity === 'medium') {
        counts.Medium += 1;
      } else if (severity === 'low') {
        counts.Low += 1;
      } else {
        counts.Informational += 1;
      }
    });

    return counts;
  }, [findings]);

  const totalFindings =
    severityCounts.Critical +
    severityCounts.High +
    severityCounts.Medium +
    severityCounts.Low +
    severityCounts.Informational;

  /*
   * Build the donut percentages from actual findings.
   *
   * If there are no findings, show an empty ring instead of
   * inventing percentages.
   */
  const donutStyle = useMemo(() => {
    if (totalFindings === 0) {
      return {
        background: isLight
          ? '#e2e8f0'
          : '#1e293b',
      };
    }

    const criticalEnd =
      (severityCounts.Critical / totalFindings) * 100;

    const highEnd =
      criticalEnd +
      (severityCounts.High / totalFindings) * 100;

    const mediumEnd =
      highEnd +
      (severityCounts.Medium / totalFindings) * 100;

    return {
      background: `conic-gradient(
        #f43f5e 0% ${criticalEnd}%,
        #f59e0b ${criticalEnd}% ${highEnd}%,
        #38bdf8 ${highEnd}% ${mediumEnd}%,
        #10b981 ${mediumEnd}% 100%
      )`,
    };
  }, [
    totalFindings,
    severityCounts,
    isLight,
  ]);

  /*
   * Display the most recent scans.
   */
  const recentScans = useMemo(() => {
    return scans.slice(0, 5);
  }, [scans]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Severity Distribution */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h3
            className={`text-sm font-bold tracking-wide ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            Severity Distribution
          </h3>

          <button
            onClick={() => setActivePage('findings')}
            className={`btn-interactive text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200'
                : 'bg-slate-800/80 hover:bg-slate-800 text-blue-400 border-slate-700'
            }`}
          >
            All Findings →
          </button>
        </div>

        {loading ? (
          <div className="h-36 flex items-center justify-center">
            <div
              className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${
                isLight
                  ? 'border-slate-700'
                  : 'border-slate-300'
              }`}
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">

            {/* Donut */}
            <div
              className="relative w-32 h-32 rounded-full flex items-center justify-center shrink-0 shadow-inner"
              style={donutStyle}
            >
              <div
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-md ${
                  isLight
                    ? 'bg-white'
                    : 'bg-[#091322]'
                }`}
              >
                <span
                  className={`text-lg font-black ${
                    isLight
                      ? 'text-slate-900'
                      : 'text-white'
                  }`}
                >
                  {totalFindings}
                </span>

                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Total
                </span>
              </div>
            </div>

            {/* Severity Values */}
            <div className="space-y-2 text-xs w-full sm:w-auto">

              {[
                {
                  label: 'Critical',
                  value: severityCounts.Critical,
                  color: 'bg-rose-500',
                },
                {
                  label: 'High',
                  value: severityCounts.High,
                  color: 'bg-amber-500',
                },
                {
                  label: 'Medium',
                  value: severityCounts.Medium,
                  color: 'bg-sky-400',
                },
                {
                  label: 'Low',
                  value: severityCounts.Low,
                  color: 'bg-emerald-500',
                },
              ].map((item) => {
                const percentage =
                  totalFindings > 0
                    ? Math.round(
                        (item.value / totalFindings) * 100
                      )
                    : 0;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="flex items-center gap-2 text-slate-500">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                      />

                      {item.label}
                    </span>

                    <strong
                      className={
                        isLight
                          ? 'text-slate-800'
                          : 'text-white'
                      }
                    >
                      {item.value} ({percentage}%)
                    </strong>
                  </div>
                );
              })}

              {severityCounts.Informational > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    Informational
                  </span>

                  <strong
                    className={
                      isLight
                        ? 'text-slate-800'
                        : 'text-white'
                    }
                  >
                    {severityCounts.Informational}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Target Assessments */}
      <div
        className={`lg:col-span-2 p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-sm font-bold tracking-wide ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            Recent Target Assessments
          </h3>

          <button
            onClick={() => setActivePage('scan')}
            className={`btn-interactive text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200'
                : 'bg-slate-800/80 hover:bg-slate-800 text-blue-400 border-slate-700'
            }`}
          >
            + Add Target
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-12 rounded-lg animate-pulse ${
                  isLight
                    ? 'bg-slate-100'
                    : 'bg-slate-800/60'
                }`}
              />
            ))}
          </div>
        ) : recentScans.length === 0 ? (
          <div
            className={`py-10 text-center text-sm ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-500'
            }`}
          >
            No scans have been recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentScans.map((scan) => {
              const status = String(
                scan.status || ''
              ).toLowerCase();

              const isRunning =
                status === 'running';

              const isFailed =
                status === 'failed';

              return (
                <div
                  key={scan.id}
                  className={`py-3.5 flex items-center justify-between transition-colors px-2 -mx-2 rounded-xl ${
                    isLight
                      ? 'hover:bg-slate-50/80'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-mono font-bold break-all ${
                        isLight
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    >
                      {scan.target}
                    </span>

                    <p
                      className={`text-[11px] ${
                        isLight
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      Last probe:{' '}
                      {formatRelativeTime(
                        scan.started_at
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isRunning
                          ? isLight
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : isFailed
                          ? isLight
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                          : isLight
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {getStatusLabel(scan.status)}
                    </span>

                    <button
                      onClick={() =>
                        setActivePage('findings')
                      }
                      className={`btn-interactive text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isLight
                          ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}