import React, { useState } from 'react';

export default function Findings({ setActivePage, currentTheme = 'dark' }) {
  const isLight = currentTheme === 'light';
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const findingsList = [
    {
      id: 'FIND-01',
      cve: 'CVE-2023-38606',
      title: 'SQL Injection in User Authentication Route',
      target: 'api.production.internal /api/v1/auth/login',
      severity: 'Critical',
      cvss: 9.8,
      discovered: '22 mins ago',
      details: 'Unsanitized user payload allows remote attackers to bypass identity controls and extract password hash records via automated OR 1=1 union injections.',
    },
    {
      id: 'FIND-02',
      cve: 'CVE-2023-48795',
      title: 'Terrapin SSH Protocol Prefix Truncation',
      target: 'ingress-router-01.us-east Port 22/TCP',
      severity: 'High',
      cvss: 7.5,
      discovered: '1 hr ago',
      details: 'Cryptographic handshake vulnerability allows man-in-the-middle attackers to strip security sequence extension negotiations on ChaCha20-Poly1305 ciphers.',
    },
    {
      id: 'FIND-03',
      cve: 'CVE-2021-41773',
      title: 'Path Traversal & Server Version Banner Leak',
      target: 'edge-proxy-02.aws.internal',
      severity: 'Medium',
      cvss: 5.3,
      discovered: '3 hrs ago',
      details: 'Apache HTTP reverse proxy version 2.4.49 reveals precise distribution version in Server headers, simplifying exploit targeting.',
    },
    {
      id: 'FIND-04',
      cve: 'CWE-319',
      title: 'Cleartext HTTP Ingress Missing HSTS Header',
      target: 'auth.staging-vpc.net',
      severity: 'Low',
      cvss: 3.1,
      discovered: '1 day ago',
      details: 'Host does not enforce Strict-Transport-Security, making users vulnerable to SSL-stripping and downgrade attacks over untrusted Wi-Fi gateways.',
    },
  ];

  const filtered = findingsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cve.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Search Filter Header */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Vulnerability Repository
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Interactive database of validated threats identified during automated audits.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search CVE, endpoint, or flaw..."
              className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200 focus:border-blue-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Findings Accordion Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isLight
                  ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                  isLight ? 'hover:bg-slate-50/50' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                        item.severity === 'Critical'
                          ? isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : item.severity === 'High'
                          ? isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : isLight ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}
                    >
                      {item.severity} • {item.cvss}
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-600">{item.cve}</span>
                    <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span>
                    <span className="font-mono text-xs text-slate-500">{item.target}</span>
                  </div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.discovered}
                  </span>
                  <span className={`text-sm font-bold transition-transform ${isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Expandable Technical Panel */}
              {isExpanded && (
                <div className={`p-5 border-t text-xs ${isLight ? 'bg-slate-50/60 border-slate-100' : 'bg-slate-950/40 border-slate-800'}`}>
                  <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Technical Exposure Detail</h4>
                  <p className={`leading-relaxed mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.details}</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setActivePage('mitigations')}
                      className="btn-interactive px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-600/20 text-xs"
                    >
                      View Mitigation Patch &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}