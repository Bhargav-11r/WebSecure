import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Mitigations({
  currentScanId,
  setActivePage,
  currentTheme = 'dark',
}) {
  const isLight = currentTheme === 'light';

  const [findings, setFindings] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [resolvedStatus, setResolvedStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // =========================================================
  // LOAD FINDINGS FOR SELECTED SCAN
  // =========================================================

  useEffect(() => {
    if (!currentScanId) {
      setFindings([]);
      setErrorMsg('');
      return;
    }

    const loadFindings = async () => {
      setIsLoading(true);
      setErrorMsg('');

      try {
        const response = await fetch(
          `${API_BASE}/api/scan/${currentScanId}/findings`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load findings. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        setFindings(data.findings || []);
      } catch (error) {
        console.error('Failed to load mitigation findings:', error);

        setFindings([]);
        setErrorMsg(
          error.message || 'Unable to load findings for this scan.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFindings();
  }, [currentScanId]);

  // =========================================================
  // COPY
  // =========================================================

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error('Unable to copy mitigation guidance:', error);
    }
  };

  // =========================================================
  // RESOLVED STATE
  // =========================================================

  const toggleResolved = (id) => {
    setResolvedStatus((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  // =========================================================
  // SEVERITY STYLING
  // =========================================================

  const getSeverityBadge = (severity) => {
    const normalized = (severity || '').toLowerCase();

    if (isLight) {
      switch (normalized) {
        case 'critical':
          return 'bg-red-50 text-red-700 border-red-200/80';

        case 'high':
          return 'bg-amber-50 text-amber-700 border-amber-200/80';

        case 'medium':
          return 'bg-blue-50 text-blue-700 border-blue-200/80';

        case 'low':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';

        default:
          return 'bg-slate-100 text-slate-600 border-slate-200';
      }
    }

    switch (normalized) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

      case 'medium':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';

      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // =========================================================
  // BUILD MITIGATION GUIDANCE
  // =========================================================

  const buildMitigation = (finding) => {
    const title = (finding.title || '').toLowerCase();
    const evidence = (finding.evidence || '').toLowerCase();
    const combined = `${title} ${evidence}`;

    // -------------------------------------------------------
    // HTTP SERVICE EXPOSURE
    // -------------------------------------------------------

    if (
      combined.includes('exposed http service') ||
      combined.includes('port 80')
    ) {
      return {
        title: 'Review HTTP service exposure',
        strategy:
          'Confirm that the HTTP service needs to be reachable. If it is required, restrict access to trusted networks or hosts where appropriate and prefer HTTPS for application traffic.',
        codeSnippet:
          '# Review the service and network access rules\n' +
          '# Restrict port 80 to trusted sources where appropriate\n' +
          '# Redirect application traffic to HTTPS\n' +
          '# Verify the resulting exposure with a new scan',
      };
    }

    // -------------------------------------------------------
    // DATABASE EXPOSURE
    // -------------------------------------------------------

    if (
      combined.includes('database network exposure') ||
      combined.includes('mysql') ||
      combined.includes('mariadb') ||
      combined.includes('port 3306')
    ) {
      return {
        title: 'Restrict database network exposure',
        strategy:
          'Database services should normally be reachable only by trusted application servers or administrative hosts. Review firewall rules and database bind/access settings.',
        codeSnippet:
          '# Example review steps\n' +
          '# 1. Identify which hosts require database access\n' +
          '# 2. Restrict TCP/3306 at the firewall\n' +
          '# 3. Review database bind-address and access rules\n' +
          '# 4. Re-scan to verify the exposed port',
      };
    }

    // -------------------------------------------------------
    // GENERIC HTTP SECURITY HEADERS
    // -------------------------------------------------------

    if (
      combined.includes('strict-transport-security') ||
      combined.includes('hsts')
    ) {
      return {
        title: 'Configure Strict-Transport-Security',
        strategy:
          'Configure HSTS only when the application is correctly served over HTTPS. Validate certificate, HTTPS coverage, and subdomain requirements before enabling an appropriate max-age.',
        codeSnippet:
          '# Example Nginx configuration\n' +
          'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;',
      };
    }

    if (combined.includes('x-content-type-options')) {
      return {
        title: 'Configure X-Content-Type-Options',
        strategy:
          'Configure the application or reverse proxy to send X-Content-Type-Options with a value of nosniff where appropriate.',
        codeSnippet:
          '# Example Nginx configuration\n' +
          'add_header X-Content-Type-Options "nosniff" always;',
      };
    }

    if (combined.includes('content-security-policy')) {
      return {
        title: 'Review Content-Security-Policy',
        strategy:
          'Define a Content-Security-Policy appropriate for the application and test it before enforcing restrictive directives in production.',
        codeSnippet:
          '# Example starting point — review before production use\n' +
          'add_header Content-Security-Policy "default-src \'self\'" always;',
      };
    }

    if (combined.includes('referrer-policy')) {
      return {
        title: 'Configure Referrer-Policy',
        strategy:
          'Set an explicit Referrer-Policy appropriate for the application so browsers do not unnecessarily disclose URL information to other origins.',
        codeSnippet:
          '# Example Nginx configuration\n' +
          'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
      };
    }

    if (combined.includes('permissions-policy')) {
      return {
        title: 'Configure Permissions-Policy',
        strategy:
          'Review browser features used by the application and explicitly restrict unnecessary capabilities through Permissions-Policy.',
        codeSnippet:
          '# Example — review required features first\n' +
          'add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;',
      };
    }

    // -------------------------------------------------------
    // GENERIC OPEN SERVICE
    // -------------------------------------------------------

    if (title.includes('exposed ') || title.includes('open')) {
      return {
        title: 'Review exposed network service',
        strategy:
          'Confirm that the detected service is required and intentionally reachable. If it is not required, disable it. Otherwise restrict access to trusted networks or hosts.',
        codeSnippet:
          '# Review the service\n' +
          '# Check whether the port must be externally reachable\n' +
          '# Apply firewall/network restrictions where appropriate\n' +
          '# Verify the result with a follow-up scan',
      };
    }

    // -------------------------------------------------------
    // GENERIC FALLBACK
    // -------------------------------------------------------

    return {
      title: 'Review and remediate the finding',
      strategy:
        'Review the scanner evidence and determine whether the observed condition is required. Apply the appropriate configuration or code-level control, then verify the change with a follow-up scan.',
      codeSnippet:
        '# Review the evidence associated with this finding\n' +
        '# Apply the appropriate remediation\n' +
        '# Verify the change with a follow-up security scan',
    };
  };

  // =========================================================
  // PREPARE MITIGATION DATA
  // =========================================================

  const mitigationItems = useMemo(() => {
    return findings.map((finding) => ({
      ...finding,
      mitigation: buildMitigation(finding),
    }));
  }, [findings]);

  // =========================================================
  // NO SELECTED SCAN
  // =========================================================

  if (!currentScanId) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div
          className={`p-6 rounded-2xl border ${
            isLight
              ? 'bg-white border-slate-200/80 shadow-xs'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <span
            className={`text-[11px] font-bold tracking-wider uppercase ${
              isLight ? 'text-blue-600' : 'text-blue-400'
            }`}
          >
            Remediation Action Plan
          </span>

          <h2
            className={`text-xl font-bold tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Security Mitigations
          </h2>

          <p
            className={`text-xs mt-1 leading-relaxed ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Select a scan to view remediation guidance for its findings.
          </p>

          <button
            onClick={() => setActivePage('scan-history')}
            className="mt-5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Open Scan History →
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="space-y-6 max-w-5xl">

      {/* =====================================================
          OVERVIEW
      ====================================================== */}

      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/70 shadow-xs'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

          <div>
            <span
              className={`text-[11px] font-bold tracking-wider uppercase ${
                isLight ? 'text-blue-600' : 'text-blue-400'
              }`}
            >
              Remediation Action Plan
            </span>

            <div className="flex items-center gap-2 mt-0.5">
              <h2
                className={`text-xl font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Security Mitigations
              </h2>

              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-md border ${
                  isLight
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                SCAN #{currentScanId}
              </span>
            </div>

            <p
              className={`text-xs mt-1 leading-relaxed ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Remediation guidance generated from the findings recorded for
              the selected scan.
            </p>
          </div>

          <button
            onClick={() => setActivePage('scan')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            Verify via New Scan →
          </button>
        </div>

        <div
          className={`mt-5 pt-4 border-t flex flex-wrap gap-x-6 gap-y-2 text-[11px] ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
            Findings:{' '}
            <strong
              className={isLight ? 'text-slate-800' : 'text-slate-200'}
            >
              {findings.length}
            </strong>
          </span>

          <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
            Pending:{' '}
            <strong
              className={isLight ? 'text-slate-800' : 'text-slate-200'}
            >
              {
                findings.filter(
                  (item) => !resolvedStatus[item.id]
                ).length
              }
            </strong>
          </span>

          <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
            Resolved:{' '}
            <strong
              className={isLight ? 'text-slate-800' : 'text-slate-200'}
            >
              {
                findings.filter(
                  (item) => resolvedStatus[item.id]
                ).length
              }
            </strong>
          </span>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {errorMsg && (
        <div
          className={`p-4 rounded-xl border text-xs ${
            isLight
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {errorMsg}
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {isLoading && (
        <div
          className={`p-8 rounded-2xl border text-center ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <p
            className={`text-xs font-mono ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            LOADING MITIGATION DATA...
          </p>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!isLoading && !errorMsg && findings.length === 0 && (
        <div
          className={`p-8 rounded-2xl border text-center ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <h3
            className={`text-sm font-semibold ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            No remediation items
          </h3>

          <p
            className={`text-xs mt-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            No findings were recorded for this scan.
          </p>
        </div>
      )}

      {/* =====================================================
          REMEDIATION CARDS
      ====================================================== */}

      {!isLoading && mitigationItems.length > 0 && (
        <div className="space-y-5">

          {mitigationItems.map((item) => {
            const isResolved = !!resolvedStatus[item.id];

            const severity = item.severity || 'Informational';

            const identifier = item.cve_id || 'Observation';

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

                {/* =================================================
                    HEADER META
                ================================================== */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">

                  <div className="flex items-center gap-2 flex-wrap">

                    <span
                      className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getSeverityBadge(
                        severity
                      )}`}
                    >
                      {severity}
                    </span>

                    <span
                      className={`text-xs font-mono font-semibold ${
                        item.cve_id
                          ? isLight
                            ? 'text-blue-600'
                            : 'text-blue-400'
                          : isLight
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {identifier}
                    </span>

                    <span
                      className={
                        isLight
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }
                    >
                      •
                    </span>

                    <span
                      className={`text-xs font-mono ${
                        isLight
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      Finding #{item.id}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleResolved(item.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer self-start sm:self-auto ${
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

                {/* =================================================
                    FINDING
                ================================================== */}

                <p
                  className={`text-[11px] font-mono mb-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-500'
                  }`}
                >
                  Original finding
                </p>

                <h3
                  className={`text-base font-bold tracking-tight mb-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {item.title || 'Untitled finding'}
                </h3>

                <div
                  className={`rounded-xl border p-3 mb-5 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <p
                    className={`text-xs font-mono leading-relaxed ${
                      isLight
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.evidence || 'No evidence recorded.'}
                  </p>
                </div>

                {/* =================================================
                    MITIGATION
                ================================================== */}

                <p
                  className={`text-[11px] font-mono mb-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-500'
                  }`}
                >
                  Recommended action
                </p>

                <h3
                  className={`text-base font-bold tracking-tight mb-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {item.mitigation.title}
                </h3>

                <p
                  className={`text-xs leading-relaxed mb-4 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {item.mitigation.strategy}
                </p>

                {/* =================================================
                    CONFIGURATION GUIDANCE
                ================================================== */}

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
                    <span className="font-mono text-[11px]">
                      Configuration Guidance
                    </span>

                    <button
                      onClick={() =>
                        handleCopy(
                          item.id,
                          item.mitigation.codeSnippet
                        )
                      }
                      className={`font-semibold text-[11px] cursor-pointer transition-colors ${
                        isLight
                          ? 'text-blue-600 hover:text-blue-700'
                          : 'text-blue-400 hover:text-blue-300'
                      }`}
                    >
                      {copiedId === item.id ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  <pre
                    className={`p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                      isLight
                        ? 'text-slate-800'
                        : 'text-emerald-400'
                    }`}
                  >
                    {item.mitigation.codeSnippet}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}