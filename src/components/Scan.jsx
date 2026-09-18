import React, { useState } from 'react';

export default function Scan({
  isScanning,
  setIsScanning,
  scanTarget,
  setScanTarget,
  logs,
  setLogs,
}) {
  const [profile, setProfile] = useState('full');
  const [tools, setTools] = useState({
    nmap: true,
    nikto: true,
    zap: false,
  });

  const toggleTool = (toolKey) => {
    setTools((prev) => ({ ...prev, [toolKey]: !prev[toolKey] }));
  };

  const handleStartScan = (e) => {
    e.preventDefault();
    if (!scanTarget.trim()) return;

    setIsScanning(true);
    setLogs([
      `[INIT] Initializing scan sequence for target: ${scanTarget}`,
      `[CONFIG] Scan profile: ${profile.toUpperCase()}`,
      `[ENGINES] Active agents: ${Object.keys(tools).filter((k) => tools[k]).join(', ').toUpperCase()}`,
    ]);

    setTimeout(() => {
      setLogs((prev) => [...prev, '[NMAP] Host discovery complete: Target is alive. Scanning ports 1-65535...']);
    }, 1200);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        '[NIKTO] Performing web server fingerprinting & security header audit...',
        '[OWASP ZAP] Passive endpoint spidering initialized...',
      ]);
    }, 2400);

    setTimeout(() => {
      setLogs((prev) => [...prev, '[COMPLETE] Scan finished successfully. 4 actionable findings logged.']);
      setIsScanning(false);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration Form */}
      <form onSubmit={handleStartScan} className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6">
          <label className="block text-sm font-semibold text-white mb-2">Target Host or IP</label>
          <input
            type="text"
            value={scanTarget}
            onChange={(e) => setScanTarget(e.target.value)}
            placeholder="e.g. scanme.nmap.org or 192.168.1.10"
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-lg text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
            required
            disabled={isScanning}
          />
          <p className="text-xs text-slate-500 mt-2">Enter a fully qualified domain name (FQDN) or an IPv4/IPv6 address.</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Scan Depth Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'quick', label: 'Quick Recon', desc: 'Top 100 ports & basic banner grabs' },
              { id: 'full', label: 'Full Audit', desc: 'Complete port sweep, Nikto & CVE probes' },
              { id: 'custom', label: 'Custom Probe', desc: 'Custom engine flags & port ranges' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setProfile(item.id)}
                disabled={isScanning}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
                  profile === item.id
                    ? 'bg-blue-600/10 border-blue-500 text-white'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <strong className="block text-sm text-white">{item.label}</strong>
                <span className="text-xs mt-1 block text-slate-400 leading-relaxed">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Security Engines</h2>
          <div className="space-y-3">
            {[
              { key: 'nmap', name: 'Nmap', detail: 'Port scanner & OS/service version detection' },
              { key: 'nikto', name: 'Nikto', detail: 'Web server vulnerability scanner & misconfiguration audit' },
              { key: 'zap', name: 'OWASP ZAP', detail: 'Application vulnerability testing (XSS, SQLi, CSRF)' },
            ].map((tool) => (
              <div
                key={tool.key}
                onClick={() => !isScanning && toggleTool(tool.key)}
                className={`flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-lg transition-colors ${
                  isScanning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-slate-700'
                }`}
              >
                <div>
                  <strong className="text-sm text-white block">{tool.name}</strong>
                  <span className="text-xs text-slate-400">{tool.detail}</span>
                </div>
                <input
                  type="checkbox"
                  checked={tools[tool.key]}
                  onChange={() => {}}
                  disabled={isScanning}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isScanning}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/20"
        >
          {isScanning ? 'Scan in Execution...' : 'Launch Assessment'}
        </button>
      </form>

      {/* Real-time Terminal Output */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6 flex flex-col h-[520px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <h2 className="text-sm font-semibold text-white">Execution Console</h2>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              isScanning
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isScanning ? 'Running' : 'Idle'}
          </span>
        </div>

        <div className="flex-1 bg-slate-950 rounded-lg p-4 font-mono text-xs overflow-y-auto space-y-2 border border-slate-800/80">
          {logs.length === 0 ? (
            <p className="text-slate-500">Awaiting launch instruction. Console output will stream here...</p>
          ) : (
            logs.map((log, idx) => (
              <p key={idx} className="text-emerald-400 leading-relaxed">
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}