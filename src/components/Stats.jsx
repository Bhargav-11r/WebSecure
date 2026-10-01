import React, { useEffect, useState } from 'react';
import SpotlightCard from './SpotlightCard';

// Smooth numeric count-up hook
function useCountUp(endValue, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTimestamp) / duration,
        1
      );

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easeOut * endValue));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration]);

  return count;
}

function MetricCard({
  label,
  targetNum,
  suffix = '',
  badge,
  badgeColor,
  sub,
  currentTheme,
}) {
  const isLight = currentTheme === 'light';
  const animatedNumber = useCountUp(targetNum, 1400);

  return (
    <SpotlightCard
      currentTheme={currentTheme}
      className={`p-5 card-interactive ${
        isLight
          ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
          : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isLight
              ? 'text-slate-500'
              : 'text-slate-400'
          }`}
        >
          {label}
        </span>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-transform hover:scale-105 ${badgeColor}`}
        >
          {badge}
        </span>
      </div>

      <div
        className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
          isLight
            ? 'text-slate-900'
            : 'text-white'
        }`}
      >
        {animatedNumber}
        {suffix}
      </div>

      <p
        className={`text-[11px] mt-1 ${
          isLight
            ? 'text-slate-500'
            : 'text-slate-400'
        }`}
      >
        {sub}
      </p>
    </SpotlightCard>
  );
}

export default function Stats({
  currentTheme = 'dark',
  scans = [],
  findings = [],
  loading = false,
}) {
  /*
   * Total scans recorded for the authenticated user.
   */
  const totalScans = scans.length;

  /*
   * Number of findings returned for the selected scan.
   */
  const totalFindings = findings.length;

  /*
   * Count only findings whose backend severity is actually Critical.
   */
  const criticalFindings = findings.filter(
    (finding) =>
      String(finding.severity || '').toLowerCase() ===
      'critical'
  ).length;

  /*
   * Count scans currently marked as running.
   */
  const runningScans = scans.filter(
    (scan) =>
      String(scan.status || '').toLowerCase() ===
      'running'
  ).length;

  /*
   * While the dashboard is loading, avoid showing
   * misleading intermediate values.
   */
  const displayTotalScans = loading ? 0 : totalScans;
  const displayTotalFindings = loading ? 0 : totalFindings;
  const displayCriticalFindings = loading
    ? 0
    : criticalFindings;
  const displayRunningScans = loading ? 0 : runningScans;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Scans */}
      <MetricCard
        label="Total Scans"
        targetNum={displayTotalScans}
        badge={
          runningScans > 0
            ? `${runningScans} running`
            : 'Recorded'
        }
        badgeColor="text-blue-500 bg-blue-500/10 border-blue-500/20"
        sub="Scans in your account"
        currentTheme={currentTheme}
      />

      {/* Total Findings */}
      <MetricCard
        label="Total Findings"
        targetNum={displayTotalFindings}
        badge={
          totalFindings > 0
            ? 'Review'
            : 'None'
        }
        badgeColor={
          totalFindings > 0
            ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
        }
        sub="Findings in selected scan"
        currentTheme={currentTheme}
      />

      {/* Critical Findings */}
      <MetricCard
        label="Critical Findings"
        targetNum={displayCriticalFindings}
        badge={
          criticalFindings > 0
            ? 'Review Required'
            : 'None'
        }
        badgeColor={
          criticalFindings > 0
            ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
        }
        sub="Critical severity findings"
        currentTheme={currentTheme}
      />

      {/* Running Scans */}
      <MetricCard
        label="Running Scans"
        targetNum={displayRunningScans}
        badge={
          runningScans > 0
            ? 'In Progress'
            : 'Idle'
        }
        badgeColor={
          runningScans > 0
            ? 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            : 'text-slate-500 bg-slate-500/10 border-slate-500/20'
        }
        sub="Currently active scans"
        currentTheme={currentTheme}
      />

    </div>
  );
}