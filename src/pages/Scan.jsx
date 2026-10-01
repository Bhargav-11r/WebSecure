import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const API_BASE = 'http://localhost:8000';

export default function Scan({
  isScanning,
  setIsScanning,
  scanTarget,
  setScanTarget,
  logs,
  setLogs,
  currentTheme,
  currentScanId,
  setCurrentScanId,
}) {
  const [useNmap, setUseNmap] = useState(true);
  const [useNikto, setUseNikto] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // =========================================================
  // REAL BACKEND SCAN STATE
  // =========================================================

  const [scanStatus, setScanStatus] = useState('idle');

  const [scanResults, setScanResults] = useState([]);
  const [scanEvidence, setScanEvidence] = useState([]);
  const [scanFindings, setScanFindings] = useState([]);
  const [scanSuggestions, setScanSuggestions] = useState([]);

  // =========================================================
  // LOAD COMPLETED SCAN DATA
  // =========================================================

  const loadCompletedScan = useCallback(
    async (completedScanId) => {
      if (!completedScanId) {
        return;
      }

      try {
        const endpoints = [
          {
            name: 'results',
            url: `${API_BASE}/api/scan/${completedScanId}/results`,
          },
          {
            name: 'evidence',
            url: `${API_BASE}/api/scan/${completedScanId}/evidence`,
          },
          {
            name: 'findings',
            url: `${API_BASE}/api/scan/${completedScanId}/findings`,
          },
          {
            name: 'suggestions',
            url: `${API_BASE}/api/scan/${completedScanId}/suggestions`,
          },
        ];

        const responses = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(endpoint.url, {
              method: 'GET',
              credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.detail ||
                  `Unable to load scan ${endpoint.name}.`
              );
            }

            return {
              name: endpoint.name,
              data,
            };
          })
        );

        const resultData =
          responses.find(
            (item) => item.name === 'results'
          )?.data || {};

        const evidenceData =
          responses.find(
            (item) => item.name === 'evidence'
          )?.data || {};

        const findingsData =
          responses.find(
            (item) => item.name === 'findings'
          )?.data || {};

        const suggestionsData =
          responses.find(
            (item) => item.name === 'suggestions'
          )?.data || {};

        // -------------------------------------------------------
        // Backend response normalization
        // -------------------------------------------------------

        const results = Array.isArray(resultData)
          ? resultData
          : resultData.results || [];

        const evidence = Array.isArray(evidenceData)
          ? evidenceData
          : evidenceData.evidence || [];

        const findings = Array.isArray(findingsData)
          ? findingsData
          : findingsData.findings || [];

        const suggestions = Array.isArray(suggestionsData)
          ? suggestionsData
          : suggestionsData.suggestions || [];

        setScanResults(results);
        setScanEvidence(evidence);
        setScanFindings(findings);
        setScanSuggestions(suggestions);

        setLogs((previousLogs) => {
          const newLogs = [
            `Loaded ${results.length} scan results.`,
            `Loaded ${evidence.length} evidence records.`,
            `Loaded ${findings.length} findings.`,
            `Loaded ${suggestions.length} suggestions.`,
            'Analysis data ready.',
          ];

          return [
            ...previousLogs,
            ...newLogs,
          ];
        });
      } catch (error) {
        console.error(
          'Error loading completed scan:',
          error
        );

        setErrorMsg(
          error.message ||
            'Unable to load completed scan data.'
        );

        setLogs((previousLogs) => [
          ...previousLogs,
          `ERROR: ${
            error.message ||
            'Unable to load completed scan data.'
          }`,
        ]);
      }
    },
    [setLogs]
  );

  // =========================================================
  // REHYDRATE SELECTED SCAN
  //
  // This allows Scan.jsx to recover its state when the user
  // navigates away and returns to the page.
  // =========================================================

  useEffect(() => {
    if (!currentScanId) {
      setScanStatus('idle');
      return;
    }

    let isCancelled = false;

    const loadSelectedScan = async () => {
      try {
        setErrorMsg('');

        const response = await fetch(
          `${API_BASE}/api/scan/status/${currentScanId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              'Unable to retrieve selected scan.'
          );
        }

        if (isCancelled) {
          return;
        }

        setScanStatus(data.status || 'idle');

        // Keep the target synchronized with the selected scan.
        if (data.target) {
          setScanTarget(data.target);
        }

        if (data.status === 'running') {
          setIsScanning(true);

          setLogs((previousLogs) => {
            const message =
              'Security scanners are running...';

            if (
              previousLogs[
                previousLogs.length - 1
              ] === message
            ) {
              return previousLogs;
            }

            return [
              ...previousLogs,
              message,
            ];
          });

          return;
        }

        if (data.status === 'completed') {
          setIsScanning(false);

          await loadCompletedScan(currentScanId);

          return;
        }

        if (data.status === 'failed') {
          setIsScanning(false);
          setErrorMsg('The security scan failed.');
        }
      } catch (error) {
        console.error(
          'Error rehydrating selected scan:',
          error
        );

        if (!isCancelled) {
          setErrorMsg(
            error.message ||
              'Unable to load selected scan.'
          );
        }
      }
    };

    loadSelectedScan();

    return () => {
      isCancelled = true;
    };
  }, [
    currentScanId,
    loadCompletedScan,
    setIsScanning,
    setLogs,
    setScanTarget,
  ]);

  // =========================================================
  // START SCAN
  // =========================================================

  const handleStartScan = async () => {
    const target = scanTarget.trim();

    setErrorMsg('');

    if (!target) {
      setErrorMsg('Please enter a target.');
      return;
    }

    if (!useNmap && !useNikto) {
      setErrorMsg(
        'Select at least one scanning engine.'
      );
      return;
    }

    // Reset previous scan data
    setScanResults([]);
    setScanEvidence([]);
    setScanFindings([]);
    setScanSuggestions([]);

    setCurrentScanId(null);
    setScanStatus('starting');

    setLogs([
      `Initializing security analysis for ${target}...`,
      `Nmap: ${
        useNmap ? 'enabled' : 'disabled'
      }`,
      `Nikto: ${
        useNikto ? 'enabled' : 'disabled'
      }`,
      'Contacting WebSecure backend...',
    ]);

    setIsScanning(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/scan/launch`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            target: target,
            run_nmap: useNmap,
            run_nikto: useNikto,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Unable to start the security scan.'
        );
      }

      if (!data.scan_id) {
        throw new Error(
          'Backend did not return a scan ID.'
        );
      }

      // The scan ID is now owned by App.jsx.
      setCurrentScanId(data.scan_id);

      setScanStatus(
        data.status || 'running'
      );

      setLogs((previousLogs) => [
        ...previousLogs,
        `Scan ${data.scan_id} started successfully.`,
        'Security scanners are running...',
      ]);
    } catch (error) {
      console.error(
        'Error starting scan:',
        error
      );

      setErrorMsg(
        error.message ||
          'Failed to start security scan.'
      );

      setScanStatus('failed');
      setIsScanning(false);

      setLogs((previousLogs) => [
        ...previousLogs,
        `ERROR: ${
          error.message ||
          'Failed to start security scan.'
        }`,
      ]);
    }
  };

  // =========================================================
  // POLL SCAN STATUS
  // =========================================================

  useEffect(() => {
    if (!isScanning || !currentScanId) {
      return;
    }

    let intervalId = null;
    let isCancelled = false;

    const checkScanStatus = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/scan/status/${currentScanId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              'Unable to retrieve scan status.'
          );
        }

        if (isCancelled) {
          return;
        }

        setScanStatus(
          data.status || 'idle'
        );

        if (data.target) {
          setScanTarget(data.target);
        }

        // -----------------------------------------------------
        // RUNNING
        // -----------------------------------------------------

        if (data.status === 'running') {
          setLogs((previousLogs) => {
            const message =
              'Security scanners are running...';

            const lastLog =
              previousLogs[
                previousLogs.length - 1
              ];

            if (lastLog === message) {
              return previousLogs;
            }

            return [
              ...previousLogs,
              message,
            ];
          });

          return;
        }

        // -----------------------------------------------------
        // COMPLETED
        // -----------------------------------------------------

        if (data.status === 'completed') {
          setLogs((previousLogs) => [
            ...previousLogs,
            'Security scan completed.',
            'Loading scan results...',
          ]);

          setIsScanning(false);

          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }

          await loadCompletedScan(
            currentScanId
          );

          return;
        }

        // -----------------------------------------------------
        // FAILED
        // -----------------------------------------------------

        if (data.status === 'failed') {
          setErrorMsg(
            data.error ||
              'The security scan failed.'
          );

          setLogs((previousLogs) => [
            ...previousLogs,
            `ERROR: ${
              data.error ||
              'Security scan failed.'
            }`,
          ]);

          setIsScanning(false);

          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (error) {
        console.error(
          'Error polling scan status:',
          error
        );

        if (!isCancelled) {
          setErrorMsg(
            error.message ||
              'Unable to check scan status.'
          );

          setIsScanning(false);

          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      }
    };

    checkScanStatus();

    intervalId = setInterval(
      checkScanStatus,
      1500
    );

    return () => {
      isCancelled = true;

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    currentScanId,
    isScanning,
    loadCompletedScan,
    setIsScanning,
    setLogs,
    setScanTarget,
  ]);

  // =========================================================
  // DERIVED SCAN STATISTICS
  // =========================================================

  const openPorts = useMemo(() => {
    return scanResults.filter(
      (result) =>
        String(
          result.state || ''
        ).toLowerCase() === 'open'
    ).length;
  }, [scanResults]);

  const serviceCount = useMemo(() => {
    const services = new Set();

    scanResults.forEach((result) => {
      if (result.service) {
        services.add(result.service);
      }
    });

    return services.size;
  }, [scanResults]);

  const findingCount =
    scanFindings.length;

  // =========================================================
  // RAW EVIDENCE
  // =========================================================

  const nmapEvidence = useMemo(() => {
    return scanEvidence.filter(
      (item) =>
        String(
          item.engine || ''
        ).toLowerCase() === 'nmap'
    );
  }, [scanEvidence]);

  const niktoEvidence = useMemo(() => {
    return scanEvidence.filter(
      (item) =>
        String(
          item.engine || ''
        ).toLowerCase() === 'nikto'
    );
  }, [scanEvidence]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-app-muted">
          Security Analysis
        </p>

        <div className="flex items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-app-primary">
              Scan a target
            </h1>

            <p className="text-sm text-app-secondary mt-1">
              Run security scanners and analyze the discovered
              attack surface.
            </p>
          </div>

          {currentScanId && (
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-wider text-app-muted">
                Scan ID
              </p>

              <p className="font-mono text-sm text-app-primary">
                #{currentScanId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {errorMsg && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl px-4 py-3">
          <p className="text-xs text-red-400 font-mono">
            {errorMsg}
          </p>
        </div>
      )}

      {/* =====================================================
          TARGET / SCANNER CONFIGURATION
      ====================================================== */}

      <section className="bg-surface border border-app rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-app-muted">
              Target Configuration
            </p>

            <h2 className="text-base font-semibold text-app-primary mt-1">
              Security scan
            </h2>
          </div>

          {scanStatus !== 'idle' && (
            <span className="text-[10px] uppercase tracking-wider font-mono text-app-secondary">
              {scanStatus}
            </span>
          )}
        </div>

        {/* TARGET */}

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-app-muted mb-2">
            Target
          </label>

          <input
            type="text"
            value={scanTarget}
            onChange={(event) =>
              setScanTarget(event.target.value)
            }
            disabled={isScanning}
            placeholder="127.0.0.1"
            className="w-full bg-app border border-app rounded-lg px-4 py-3 text-sm font-mono text-app-primary placeholder:text-app-muted outline-none focus:border-app-primary disabled:opacity-50"
          />
        </div>

        {/* SCANNER OPTIONS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* NMAP */}

          <button
            type="button"
            disabled={isScanning}
            onClick={() =>
              setUseNmap((value) => !value)
            }
            className={`text-left border rounded-xl p-4 transition ${
              useNmap
                ? 'border-app-primary bg-app'
                : 'border-app bg-surface'
            } disabled:opacity-50`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-app-primary">
                  Nmap
                </p>

                <p className="text-xs text-app-secondary mt-1">
                  Port and service discovery
                </p>
              </div>

              <span
                className={`text-[10px] font-mono uppercase ${
                  useNmap
                    ? 'text-emerald-400'
                    : 'text-app-muted'
                }`}
              >
                {useNmap
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>
          </button>

          {/* NIKTO */}

          <button
            type="button"
            disabled={isScanning}
            onClick={() =>
              setUseNikto((value) => !value)
            }
            className={`text-left border rounded-xl p-4 transition ${
              useNikto
                ? 'border-app-primary bg-app'
                : 'border-app bg-surface'
            } disabled:opacity-50`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-app-primary">
                  Nikto
                </p>

                <p className="text-xs text-app-secondary mt-1">
                  Web server security checks
                </p>
              </div>

              <span
                className={`text-[10px] font-mono uppercase ${
                  useNikto
                    ? 'text-emerald-400'
                    : 'text-app-muted'
                }`}
              >
                {useNikto
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>
          </button>
        </div>

        {/* START BUTTON */}

        <button
          type="button"
          onClick={handleStartScan}
          disabled={isScanning}
          className="w-full mt-4 bg-app-primary text-app rounded-lg px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isScanning
            ? 'Security Analysis Running...'
            : 'Start Security Analysis'}
        </button>
      </section>

      {/* =====================================================
          ANALYSIS SUMMARY
      ====================================================== */}

      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-app-muted">
              WebSecure Analysis
            </p>

            <h2 className="text-base font-semibold text-app-primary mt-1">
              Scan summary
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface border border-app rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-app-muted">
              Open Ports
            </p>

            <p className="text-2xl font-semibold text-app-primary mt-2">
              {scanResults.length > 0
                ? openPorts
                : '—'}
            </p>
          </div>

          <div className="bg-surface border border-app rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-app-muted">
              Services
            </p>

            <p className="text-2xl font-semibold text-app-primary mt-2">
              {scanResults.length > 0
                ? serviceCount
                : '—'}
            </p>
          </div>

          <div className="bg-surface border border-app rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-app-muted">
              Findings
            </p>

            <p className="text-2xl font-semibold text-app-primary mt-2">
              {scanFindings.length > 0
                ? findingCount
                : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          STRUCTURED RESULTS
      ====================================================== */}

      <section className="bg-surface border border-app rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-app">
          <p className="text-xs font-mono uppercase tracking-wider text-app-muted">
            Discovered Services
          </p>

          <h2 className="text-base font-semibold text-app-primary mt-1">
            Structured scan results
          </h2>
        </div>

        {scanResults.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-xs font-mono text-app-muted">
              No scan results available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-app">
                  <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-app-muted">
                    Port
                  </th>

                  <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-app-muted">
                    Protocol
                  </th>

                  <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-app-muted">
                    State
                  </th>

                  <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-app-muted">
                    Service
                  </th>

                  <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-app-muted">
                    Version
                  </th>
                </tr>
              </thead>

              <tbody>
                {scanResults.map(
                  (result, index) => (
                    <tr
                      key={`${result.port}-${result.protocol}-${index}`}
                      className="border-b border-app last:border-b-0"
                    >
                      <td className="px-5 py-3 text-sm font-mono text-app-primary">
                        {result.port ?? '—'}
                      </td>

                      <td className="px-5 py-3 text-xs font-mono text-app-secondary uppercase">
                        {result.protocol ?? '—'}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-mono uppercase ${
                            String(
                              result.state
                            ).toLowerCase() ===
                            'open'
                              ? 'text-emerald-400'
                              : 'text-app-secondary'
                          }`}
                        >
                          {result.state ?? '—'}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-sm text-app-primary">
                        {result.service ||
                          '—'}
                      </td>

                      <td className="px-5 py-3 text-xs font-mono text-app-secondary">
                        {result.version ||
                          result.product ||
                          '—'}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================
          RAW EVIDENCE
      ====================================================== */}

      <section className="bg-surface border border-app rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-app">
          <p className="text-xs font-mono uppercase tracking-wider text-app-muted">
            Raw Evidence
          </p>

          <h2 className="text-base font-semibold text-app-primary mt-1">
            Scanner output
          </h2>
        </div>

        {scanEvidence.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-xs font-mono text-app-muted">
              No raw scanner evidence available.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* NMAP RAW OUTPUT */}

            {nmapEvidence.map(
              (evidence, index) => (
                <div key={`nmap-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-app-muted">
                      Nmap
                    </p>

                    <span className="text-[10px] font-mono text-app-muted">
                      Raw Output
                    </span>
                  </div>

                  <pre className="bg-app border border-app rounded-lg p-4 overflow-x-auto text-xs leading-5 font-mono text-app-secondary whitespace-pre-wrap">
                    {evidence.output ||
                      'No output.'}
                  </pre>
                </div>
              )
            )}

            {/* NIKTO RAW OUTPUT */}

            {niktoEvidence.map(
              (evidence, index) => (
                <div key={`nikto-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-app-muted">
                      Nikto
                    </p>

                    <span className="text-[10px] font-mono text-app-muted">
                      Raw Output
                    </span>
                  </div>

                  <pre className="bg-app border border-app rounded-lg p-4 overflow-x-auto text-xs leading-5 font-mono text-app-secondary whitespace-pre-wrap">
                    {evidence.output ||
                      'No output.'}
                  </pre>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          FINDINGS
      ====================================================== */}

      {scanFindings.length > 0 && (
        <section className="bg-surface border border-app rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-app">
            <p className="text-xs font-mono uppercase tracking-wider text-app-muted">
              Findings
            </p>

            <h2 className="text-base font-semibold text-app-primary mt-1">
              Security observations
            </h2>
          </div>

          <div className="divide-y divide-app">
            {scanFindings.map(
              (finding, index) => (
                <div
                  key={
                    finding.id || index
                  }
                  className="px-5 py-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-app-primary">
                        {finding.title ||
                          'Security Finding'}
                      </p>

                      {finding.description && (
                        <p className="text-xs text-app-secondary mt-1">
                          {
                            finding.description
                          }
                        </p>
                      )}
                    </div>

                    {finding.severity && (
                      <span className="text-[10px] font-mono uppercase text-app-secondary shrink-0">
                        {
                          finding.severity
                        }
                      </span>
                    )}
                  </div>

                  {finding.evidence && (
                    <pre className="mt-3 bg-app border border-app rounded-lg p-3 overflow-x-auto text-[11px] leading-5 font-mono text-app-secondary whitespace-pre-wrap">
                      {finding.evidence}
                    </pre>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          SUGGESTIONS
      ====================================================== */}

      {scanSuggestions.length > 0 && (
        <section className="bg-surface border border-app rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-app">
            <p className="text-xs font-mono uppercase tracking-wider text-app-muted">
              Suggestions
            </p>

            <h2 className="text-base font-semibold text-app-primary mt-1">
              Recommended actions
            </h2>
          </div>

          <div className="divide-y divide-app">
            {scanSuggestions.map(
              (suggestion, index) => (
                <div
                  key={
                    suggestion.id || index
                  }
                  className="px-5 py-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-app-primary">
                        {suggestion.title ||
                          'Security recommendation'}
                      </p>

                      {suggestion.category && (
                        <p className="text-[10px] font-mono uppercase tracking-wider text-app-muted mt-1">
                          {
                            suggestion.category
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {suggestion.reason && (
                    <p className="text-xs text-app-secondary mt-2">
                      <span className="font-semibold">
                        Reason:
                      </span>{' '}
                      {suggestion.reason}
                    </p>
                  )}

                  {suggestion.recommendation && (
                    <p className="text-xs text-app-secondary mt-2">
                      <span className="font-semibold">
                        Recommendation:
                      </span>{' '}
                      {
                        suggestion.recommendation
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          SCOPE NOTE
      ====================================================== */}

      <div className="border-t border-app pt-4">
        <p className="text-[10px] leading-5 font-mono text-app-muted">
          Scope: WebSecure displays structured scanner results
          separately from raw scanner evidence. Vulnerability
          analysis and recommendations are generated from
          backend findings and scan data.
        </p>
      </div>
    </div>
  );
}