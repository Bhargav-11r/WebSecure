import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Findings({
  currentScanId,
  setActivePage,
  currentTheme = 'dark',
}) {
  const isLight = currentTheme === 'light';

  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [findings, setFindings] = useState([]);
  const [target, setTarget] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // =========================================================
  // LOAD FINDINGS FOR SELECTED SCAN
  // =========================================================

  useEffect(() => {
    if (!currentScanId) {
      setFindings([]);
      setTarget('');
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
        console.error('Failed to load findings:', error);

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
  // FILTER FINDINGS
  // =========================================================

  const filteredFindings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return findings;
    }

    return findings.filter((item) => {
      const title = item.title || '';
      const severity = item.severity || '';
      const evidence = item.evidence || '';
      const description = item.description || '';
      const cve = item.cve_id || '';

      return (
        title.toLowerCase().includes(query) ||
        severity.toLowerCase().includes(query) ||
        evidence.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        cve.toLowerCase().includes(query)
      );
    });
  }, [findings, searchTerm]);

  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return 'Unknown time';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getSeverityClasses = (severity) => {
    const normalized = (severity || '').toLowerCase();

    if (normalized === 'critical') {
      return isLight
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }

    if (normalized === 'high') {
      return isLight
        ? 'bg-orange-50 text-orange-700 border-orange-200'
        : 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    }

    if (normalized === 'medium') {
      return isLight
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }

    if (normalized === 'low') {
      return isLight
        ? 'bg-sky-50 text-sky-700 border-sky-200'
        : 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }

    return isLight
      ? 'bg-slate-100 text-slate-600 border-slate-200'
      : 'bg-slate-800 text-slate-400 border-slate-700';
  };

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
          <h2
            className={`text-base font-bold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Findings
          </h2>

          <p
            className={`text-xs mt-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Select a completed scan from Scan History to inspect its findings.
          </p>

          <button
            onClick={() => setActivePage('scan-history')}
            className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
          HEADER
      ====================================================== */}

      <div
        className={`p-5 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200/80 shadow-xs'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-base font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Findings
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
              className={`text-xs mt-1 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Security observations and vulnerability findings identified
              during the selected scan.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search findings, CVE, or evidence..."
              className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Scan summary */}

        <div
          className={`mt-4 pt-4 border-t flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          <span
            className={isLight ? 'text-slate-500' : 'text-slate-500'}
          >
            Findings:{' '}
            <strong
              className={isLight ? 'text-slate-800' : 'text-slate-200'}
            >
              {findings.length}
            </strong>
          </span>

          <span
            className={isLight ? 'text-slate-500' : 'text-slate-500'}
          >
            Showing:{' '}
            <strong
              className={isLight ? 'text-slate-800' : 'text-slate-200'}
            >
              {filteredFindings.length}
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
            LOADING FINDINGS...
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
            No findings recorded
          </h3>

          <p
            className={`text-xs mt-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            This scan did not produce any findings.
          </p>
        </div>
      )}

      {/* =====================================================
          SEARCH EMPTY STATE
      ====================================================== */}

      {!isLoading &&
        !errorMsg &&
        findings.length > 0 &&
        filteredFindings.length === 0 && (
          <div
            className={`p-8 rounded-2xl border text-center ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <p
              className={`text-xs ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              No findings match your search.
            </p>
          </div>
        )}

      {/* =====================================================
          FINDINGS ACCORDION
      ====================================================== */}

      {!isLoading && filteredFindings.length > 0 && (
        <div className="space-y-4">

          {filteredFindings.map((item) => {
            const isExpanded = expandedId === item.id;

            const severity = item.severity || 'Informational';

            const identifier = item.cve_id || 'Observation';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isLight
                    ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >

                {/* =================================================
                    FINDING HEADER
                ================================================== */}

                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                    isLight
                      ? 'hover:bg-slate-50/50'
                      : 'hover:bg-slate-800/30'
                  }`}
                >

                  <div className="space-y-1.5 min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      {/* Severity */}

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${getSeverityClasses(
                          severity
                        )}`}
                      >
                        {severity}
                      </span>

                      {/* CVE / Observation */}

                      <span
                        className={`font-mono text-xs font-bold ${
                          item.cve_id
                            ? 'text-blue-600'
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
                            : 'text-slate-600'
                        }
                      >
                        •
                      </span>

                      <span
                        className={`font-mono text-[11px] ${
                          isLight
                            ? 'text-slate-500'
                            : 'text-slate-500'
                        }`}
                      >
                        FIND-{String(item.id).padStart(2, '0')}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {item.title || 'Untitled finding'}
                    </h3>
                  </div>

                  {/* Timestamp + expand */}

                  <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">

                    <span
                      className={`text-[11px] ${
                        isLight
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {formatDate(item.created_at)}
                    </span>

                    <span
                      className={`text-sm font-bold transition-transform ${
                        isExpanded
                          ? 'rotate-180 text-blue-600'
                          : 'text-slate-400'
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* =================================================
                    EXPANDED TECHNICAL PANEL
                ================================================== */}

                {isExpanded && (
                  <div
                    className={`p-5 border-t text-xs ${
                      isLight
                        ? 'bg-slate-50/60 border-slate-100'
                        : 'bg-slate-950/40 border-slate-800'
                    }`}
                  >

                    {/* Description */}

                    <div className="mb-5">
                      <h4
                        className={`font-semibold mb-1 ${
                          isLight
                            ? 'text-slate-800'
                            : 'text-slate-300'
                        }`}
                      >
                        Description
                      </h4>

                      <p
                        className={`leading-relaxed ${
                          isLight
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.description ||
                          'No additional description was provided by the analysis engine.'}
                      </p>
                    </div>

                    {/* Evidence */}

                    <div className="mb-5">
                      <h4
                        className={`font-semibold mb-1 ${
                          isLight
                            ? 'text-slate-800'
                            : 'text-slate-300'
                        }`}
                      >
                        Evidence
                      </h4>

                      <div
                        className={`rounded-xl border p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words ${
                          isLight
                            ? 'bg-white border-slate-200 text-slate-600'
                            : 'bg-black/30 border-slate-800 text-slate-400'
                        }`}
                      >
                        {item.evidence || 'No evidence recorded.'}
                      </div>
                    </div>

                    {/* Metadata */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">

                      <div
                        className={`rounded-xl border p-3 ${
                          isLight
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <p
                          className={`text-[10px] uppercase tracking-wider ${
                            isLight
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          Severity
                        </p>

                        <p
                          className={`mt-1 font-semibold ${
                            isLight
                              ? 'text-slate-800'
                              : 'text-slate-200'
                          }`}
                        >
                          {severity}
                        </p>
                      </div>

                      <div
                        className={`rounded-xl border p-3 ${
                          isLight
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <p
                          className={`text-[10px] uppercase tracking-wider ${
                            isLight
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          Identifier
                        </p>

                        <p
                          className={`mt-1 font-mono font-semibold ${
                            item.cve_id
                              ? 'text-blue-600'
                              : isLight
                              ? 'text-slate-700'
                              : 'text-slate-300'
                          }`}
                        >
                          {identifier}
                        </p>
                      </div>

                      <div
                        className={`rounded-xl border p-3 ${
                          isLight
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <p
                          className={`text-[10px] uppercase tracking-wider ${
                            isLight
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          Finding ID
                        </p>

                        <p
                          className={`mt-1 font-mono font-semibold ${
                            isLight
                              ? 'text-slate-700'
                              : 'text-slate-300'
                          }`}
                        >
                          #{item.id}
                        </p>
                      </div>
                    </div>

                    {/* Action */}

                    <div className="flex justify-end gap-3">

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setActivePage('mitigations');
                        }}
                        className="btn-interactive px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-600/20 text-xs"
                      >
                        View Mitigations →
                      </button>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}