import React, { useState } from 'react';

export default function Mitigations({ setActivePage, currentTheme = 'dark' }) {
  const [copiedId, setCopiedId] = useState(null);
  const [resolvedStatus, setResolvedStatus] = useState({});
  const isLight = currentTheme === 'light';

  const playbooks = [
    {
      id: 'MIT-01',
      title: 'Remediate Blind SQL Injection',
      target: '/api/v1/auth/login',
      cve: 'CVE-2023-38606',
      severity: 'Critical',
      eta: '15 mins',
      strategy: 'Parameterize all raw SQL queries using ORM prepared statements and sanitize input payloads.',
      codeSnippet: `// Node.js / Express parameterized query
const query = 'SELECT id, email, password_hash FROM accounts WHERE email = $1';
const values = [req.body.email];
const result = await db.query(query, values);`,
    },
    {
      id: 'MIT-02',
      title: 'Harden SSH Ciphers against Terrapin Attack',
      target: 'Port 22/TCP (Production Core)',
      cve: 'CVE-2023-48795',
      severity: 'High',
      eta: '10 mins',
      strategy: 'Disable CBC-mode ciphers and vulnerable ChaCha20 variants in your SSH daemon configuration.',
      codeSnippet: `# Append to /etc/ssh/sshd_config
Ciphers -*cbc,chacha20-poly1305@openssh.com
KexAlgorithms -curve25519-sha256@libssh.org

# Restart daemon
sudo systemctl restart sshd`,
    },
    {
      id: 'MIT-03',
      title: 'Strip Server Version Identification Headers',
      target: 'Apache / Reverse Proxy',
      cve: 'CVE-2021-41773',
      severity: 'Medium',
      eta: '5 mins',
      strategy: 'Suppress banner information to prevent attackers from fingerprinting exact release numbers.',
      codeSnippet: `# Apache security configuration (/etc/apache2/conf-enabled/security.conf)
ServerTokens Prod
ServerSignature Off`,
    },
    {
      id: 'MIT-04',
      title: 'Enforce Strict-Transport-Security (HSTS)',
      target: 'Edge Ingress / Nginx',
      cve: 'CWE-319',
      severity: 'Low',
      eta: '5 mins',
      strategy: 'Add strict 1-year HSTS header directive including all subdomains to prevent SSL-stripping attacks.',
      codeSnippet: `# Nginx SSL server block configuration
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`,
    },
  ];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleResolved = (id) => {
    setResolvedStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityBadge = (severity) => {
    if (isLight) {
      switch (severity.toLowerCase()) {
        case 'critical':
          return 'bg-red-50 text-red-700 border-red-200/80';
        case 'high':
          return 'bg-amber-50 text-amber-700 border-amber-200/80';
        case 'medium':
          return 'bg-blue-50 text-blue-700 border-blue-200/80';
        default:
          return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      }
    }
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Overview Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/70 shadow-xs'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className={`text-[11px] font-bold tracking-wider uppercase ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
              Remediation Action Plan
            </span>
            <h2 className={`text-xl font-bold tracking-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Security Patches & Playbooks
            </h2>
            <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Engineered mitigation recipes and configuration snippets generated from active audits.
            </p>
          </div>
          <button
            onClick={() => setActivePage('scan')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            Verify via New Scan &rarr;
          </button>
        </div>
      </div>

      {/* Remediation Cards */}
      <div className="space-y-5">
        {playbooks.map((item) => {
          const isResolved = !!resolvedStatus[item.id];
          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-6 transition-all ${
                isResolved
                  ? isLight
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'bg-slate-950/40 border-slate-800 opacity-50'
                  : isLight
                  ? 'bg-white border-slate-200/70 shadow-xs hover:border-slate-300'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Meta Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getSeverityBadge(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className={`text-xs font-mono font-semibold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                    {item.cve}
                  </span>
                  <span className={isLight ? 'text-slate-300' : 'text-slate-700'}>•</span>
                  <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.target}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    ⏱ {item.eta}
                  </span>
                  <button
                    onClick={() => toggleResolved(item.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      isResolved
                        ? isLight
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isResolved ? '✓ Resolved' : 'Mark Resolved'}
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className={`text-base font-bold tracking-tight mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {item.strategy}
              </p>

              {/* Code Box: Soft Slate-50 in light mode, OLED dark in dark mode */}
              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isLight
                    ? 'bg-slate-50/80 border-slate-200/80'
                    : 'bg-[#050b14] border-slate-800/80'
                }`}
              >
                <div
                  className={`flex justify-between items-center px-4 py-2 border-b text-xs ${
                    isLight
                      ? 'border-slate-200/80 bg-white text-slate-500'
                      : 'border-slate-800/80 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <span className="font-mono text-[11px]">Configuration & Patch Command</span>
                  <button
                    onClick={() => handleCopy(item.id, item.codeSnippet)}
                    className={`font-semibold text-[11px] cursor-pointer transition-colors ${
                      isLight ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    {copiedId === item.id ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  className={`p-4 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed ${
                    isLight ? 'text-slate-800' : 'text-emerald-400'
                  }`}
                >
                  {item.codeSnippet}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}