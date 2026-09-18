import React, { useState } from 'react';

export default function Scan({ isScanning, setIsScanning, scanTarget, setScanTarget, logs, setLogs, currentTheme = 'dark' }) {
  const isLight = currentTheme === 'light';
  const [profile, setProfile] = useState('full');
  const [engines, setEngines] = useState({ nmap: true, nikto: true, zap: false });

  const handleLaunch = (e) => {
    e.preventDefault();
    if (!scanTarget.trim() || isScanning) return;

    setIsScanning(true);
    setLogs([
      `[00:00:01] Initializing WebSecure scanner engine for target: ${scanTarget}`,
      `[00:00:02] Engine profile loaded: ${profile.toUpperCase()}`,
      `[00:00:03] Spawning sub-process: Nmap TCP SYN scan (-sV -sC -T4)...`,
    ]);

    setTimeout(() => {
      setLogs((prev) => [...prev, `[00:00:05] Host discovery resolved: Ports 80, 443, 8080 detected OPEN`]);
    }, 1500);

    setTimeout(() => {
      setLogs((prev) => [...prev, `[00:00:08] Nikto web auditor checking headers and cookie flags...`]);
    }, 3000);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[00:00:11] Target analysis completed. 4 actionable CVE vulnerabilities registered.`,
      ]);
      setIsScanning(false);
    }, 4500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Scanner Trigger Form Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <h2 className={`text-base font-bold tracking-tight mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Launch Security Audit
        </h2>
        <p className={`text-xs mb-5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Input hostname, IPv4/v6 subnet, or domain to dispatch discovery and vulnerability scanners.
        </p>

        <form onSubmit={handleLaunch} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Target Hostname / IP
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={scanTarget}
                onChange={(e) => setScanTarget(e.target.value)}
                placeholder="e.g. 192.168.1.1 or api.domain.internal"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 focus:border-blue-500'
                }`}
              />
              <button
                type="submit"
                disabled={isScanning || !scanTarget.trim()}
                className={`btn-interactive px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  isScanning || !scanTarget.trim()
                    ? 'bg-slate-400 cursor-not-allowed opacity-60 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20'
                }`}
              >
                {isScanning ? 'Scan Running...' : 'Execute Scan ⚡'}
              </button>
            </div>
          </div>

          {/* Engine Selector Checkboxes */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={engines.nmap}
                onChange={(e) => setEngines({ ...engines, nmap: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}>Nmap Port Sweeper</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={engines.nikto}
                onChange={(e) => setEngines({ ...engines, nikto: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}>Nikto Web Examiner</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={engines.zap}
                onChange={(e) => setEngines({ ...engines, zap: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}>OWASP ZAP Passive Audit</span>
            </label>
          </div>
        </form>
      </div>

      {/* Real-Time Terminal Console */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          isLight
            ? 'bg-slate-50/80 border-slate-200/80 shadow-xs'
            : 'bg-[#050b14] border-slate-800'
        }`}
      >
        <div
          className={`flex justify-between items-center px-4 py-2.5 border-b text-xs ${
            isLight
              ? 'bg-white border-slate-200/80 text-slate-700'
              : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className="font-mono text-[11px] font-semibold">Live Telemetry Terminal</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">{logs.length} events logged</span>
        </div>
        <div className="p-4 min-h-[220px] max-h-[360px] overflow-y-auto font-mono text-xs space-y-1.5 leading-relaxed">
          {logs.length === 0 ? (
            <p className="text-slate-400 italic">No scanner routine dispatched. Enter target and click execute.</p>
          ) : (
            logs.map((log, index) => (
              <p
                key={index}
                className={
                  log.includes('completed')
                    ? isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold'
                    : isLight ? 'text-slate-700' : 'text-slate-300'
                }
              >
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}