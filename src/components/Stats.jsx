import React, { useEffect, useState } from 'react';
import SpotlightCard from './SpotlightCard';

// Smooth numeric count-up hook
function useCountUp(endValue, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

function MetricCard({ label, targetNum, suffix = '', badge, badgeColor, sub, currentTheme }) {
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
        <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {label}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-transform hover:scale-105 ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
        {animatedNumber}{suffix}
      </div>
      <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
        {sub}
      </p>
    </SpotlightCard>
  );
}

export default function Stats({ currentTheme = 'dark' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Security Posture"
        targetNum={78}
        suffix="%"
        badge="+4% this wk"
        badgeColor="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        sub="Low exposure index"
        currentTheme={currentTheme}
      />
      <MetricCard
        label="Active Targets"
        targetNum={14}
        suffix=""
        badge="3 in-scan"
        badgeColor="text-blue-500 bg-blue-500/10 border-blue-500/20"
        sub="Production assets"
        currentTheme={currentTheme}
      />
      <MetricCard
        label="Critical CVEs"
        targetNum={4}
        suffix=""
        badge="Immediate Fix"
        badgeColor="text-rose-500 bg-rose-500/10 border-rose-500/20"
        sub="Unpatched endpoints"
        currentTheme={currentTheme}
      />
      <MetricCard
        label="Mean Triage Time"
        targetNum={42}
        suffix="m"
        badge="Fast Track"
        badgeColor="text-amber-500 bg-amber-500/10 border-amber-500/20"
        sub="Per identified flaw"
        currentTheme={currentTheme}
      />
    </div>
  );
}