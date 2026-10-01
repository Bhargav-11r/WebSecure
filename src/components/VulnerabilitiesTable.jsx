import React from 'react';

function getSeverityClasses(severity, isLight) {
  const normalizedSeverity = String(severity || '').toLowerCase();

  if (normalizedSeverity === 'critical') {
    return isLight
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  }

  if (normalizedSeverity === 'high') {
    return isLight
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  if (normalizedSeverity === 'medium') {
    return isLight
      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }

  if (normalizedSeverity === 'low') {
    return isLight
      ? 'bg-sky-50 text-sky-700 border-sky-200'
      : 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  }

  return isLight
    ? 'bg-slate-50 text-slate-600 border-slate-200'
    : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
}

export default function VulnerabilitiesTable({
  setActivePage,
  currentTheme = 'dark',
  findings = [],
  loading = false,
}) {
  const isLight = currentTheme === 'light';

  /*
   * Show the most recent findings first.
   *
   * The backend currently returns findings ordered by ID,
   * so reversing creates a more recent-first presentation.
   */
  const rows = [...findings].reverse().slice(0, 8);

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-slate-200/80 shadow-xs'
          : 'bg-slate-900/60 border-slate-800'
      }`}
    >
      {/* Header */}
      <div
        className={`p-5 border-b flex justify-between items-center ${
          isLight
            ? 'border-slate-100'
            : 'border-slate-800'
        }`}
      >
        <div>
          <h3
            className={`text-sm font-bold tracking-wide ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            Active Threat Triage
          </h3>

          <p
            className={`text-xs mt-0.5 ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}
          >
            Findings from the selected security scan
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead
            className={
              isLight
                ? 'bg-slate-50/75 text-slate-500 border-b border-slate-200'
                : 'bg-slate-950/60 text-slate-400 border-b border-slate-800'
            }
          >
            <tr>
              <th className="py-3 px-5 font-semibold">
                Identifier
              </th>

              <th className="py-3 px-5 font-semibold">
                Finding
              </th>

              <th className="py-3 px-5 font-semibold">
                Evidence
              </th>

              <th className="py-3 px-5 font-semibold">
                Severity
              </th>

              <th className="py-3 px-5 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y ${
              isLight
                ? 'divide-slate-100'
                : 'divide-slate-800/60'
            }`}
          >
            {/* Loading */}
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className={`py-10 px-5 text-center ${
                    isLight
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  Loading findings...
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className={`py-10 px-5 text-center ${
                    isLight
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  No findings are available for the selected scan.
                </td>
              </tr>
            )}

            {/* Actual findings */}
            {!loading &&
              rows.map((row) => {
                const identifier =
                  row.cve_id || `F-${row.id}`;

                const severity =
                  row.severity || 'Informational';

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isLight
                        ? 'hover:bg-slate-50/60'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    {/* Identifier */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`font-mono font-bold ${
                          row.cve_id
                            ? 'text-blue-600'
                            : isLight
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {identifier}
                      </span>
                    </td>

                    {/* Finding title */}
                    <td
                      className={`py-3.5 px-5 font-medium ${
                        isLight
                          ? 'text-slate-900'
                          : 'text-slate-200'
                      }`}
                    >
                      <div className="max-w-xs">
                        {row.title}
                      </div>
                    </td>

                    {/* Evidence */}
                    <td
                      className={`py-3.5 px-5 font-mono ${
                        isLight
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      <div
                        className="max-w-sm truncate"
                        title={row.evidence || ''}
                      >
                        {row.evidence || 'No evidence recorded'}
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2 py-0.5 rounded font-extrabold text-[11px] border ${getSeverityClasses(
                          severity,
                          isLight
                        )}`}
                      >
                        {severity}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() =>
                          setActivePage('mitigations')
                        }
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
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}