import React from 'react';

export default function VulnerabilitiesTable({ setActivePage, currentTheme = 'dark' }) {
  const isLight = currentTheme === 'light';

  const rows = [
    { cve: 'CVE-2023-38606', title: 'SQL Injection in Auth API', target: '/api/v1/auth/login', cvss: '9.8', severity: 'Critical' },
    { cve: 'CVE-2023-48795', title: 'Terrapin SSH Prefix Truncation', target: 'Port 22/TCP', cvss: '7.5', severity: 'High' },
    { cve: 'CVE-2021-41773', title: 'Apache Server Version Disclosure', target: 'Edge Proxy', cvss: '5.3', severity: 'Medium' },
    { cve: 'CWE-319', title: 'Missing Strict-Transport-Security', target: 'HTTPS Ingress', cvss: '3.1', severity: 'Low' },
  ];

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-slate-200/80 shadow-xs'
          : 'bg-slate-900/60 border-slate-800'
      }`}
    >
      <div className={`p-5 border-b flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
        <div>
          <h3 className={`text-sm font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Active Threat Triage
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Prioritized by Common Vulnerability Scoring System (CVSS v3.1)
          </p>
        </div>
        <button
          onClick={() => setActivePage('findings')}
          className={`btn-interactive text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200'
              : 'bg-slate-800/80 hover:bg-slate-800 text-blue-400 border-slate-700'
          }`}
        >
          View All Findings &rarr;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className={isLight ? 'bg-slate-50/75 text-slate-500 border-b border-slate-200' : 'bg-slate-950/60 text-slate-400 border-b border-slate-800'}>
            <tr>
              <th className="py-3 px-5 font-semibold">CVE Identifier</th>
              <th className="py-3 px-5 font-semibold">Vulnerability Title</th>
              <th className="py-3 px-5 font-semibold">Host Endpoint</th>
              <th className="py-3 px-5 font-semibold">CVSS</th>
              <th className="py-3 px-5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${isLight ? 'hover:bg-slate-50/60' : 'hover:bg-slate-800/30'}`}
              >
                <td className="py-3.5 px-5 font-mono font-bold text-blue-600">
                  {row.cve}
                </td>
                <td className={`py-3.5 px-5 font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  {row.title}
                </td>
                <td className="py-3.5 px-5 font-mono text-slate-500">
                  {row.target}
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2 py-0.5 rounded font-extrabold text-[11px] border ${
                      row.severity === 'Critical'
                        ? isLight
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : row.severity === 'High'
                        ? isLight
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : isLight
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}
                  >
                    {row.cvss} {row.severity}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => setActivePage('mitigations')}
                    className={`btn-interactive text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isLight
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Mitigate &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}