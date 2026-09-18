import React from 'react';

export default function VulnerabilitiesTable({ setActivePage }) {
  const topIssues = [
    {
      title: 'SQL Injection in /api/v1/auth/login',
      cve: 'CVE-2023-38606',
      score: '9.8',
      engine: 'OWASP ZAP',
      severity: 'Critical',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      suggestion: 'Use parameterized queries / prepared statements; sanitize ORM inputs.',
      status: 'Fix Pending',
      statusStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Open SSH Port 22 with Deprecated Ciphers',
      cve: 'CVE-2023-48795',
      score: '7.5',
      engine: 'Nmap',
      severity: 'High',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      suggestion: 'Disable CBC ciphers in sshd_config and restrict Port 22 access via VPN.',
      status: 'In Review',
      statusStyle: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Outdated Web Server Header Information Leak',
      cve: 'CVE-2021-41773',
      score: '5.3',
      engine: 'Nikto',
      severity: 'Medium',
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      suggestion: 'Set "ServerTokens Prod" and "ServerSignature Off" in Apache config.',
      status: 'Fix Pending',
      statusStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-800/80 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide">Top Critical Findings</h2>
          <p className="text-xs text-slate-400 mt-0.5">High-priority findings requiring immediate operational triage</p>
        </div>
        <button
          onClick={() => setActivePage('findings')}
          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
        >
          View All 50 Findings &rarr;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3 px-4">Threat Description</th>
              <th className="py-3 px-4">Identifier</th>
              <th className="py-3 px-4">Engine</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Suggested Mitigation</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {topIssues.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => setActivePage('findings')}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-4 font-semibold text-white">{item.title}</td>
                <td className="py-3.5 px-4 font-mono text-blue-400">
                  {item.cve}
                  <span className="block text-[10px] text-slate-500">CVSS {item.score}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">{item.engine}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold uppercase tracking-wider ${item.badge}`}>
                    {item.severity}
                  </span>
                </td>
                <td className="py-3.5 px-4 max-w-xs text-slate-300 text-[11px] leading-relaxed truncate">
                  {item.suggestion}
                </td>
                <td className="py-3.5 px-4 text-right text-blue-400 hover:text-blue-300 font-medium">
                  Investigate &rarr;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}