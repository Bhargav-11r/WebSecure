import React, { useState } from 'react';

export default function ScanBox({ onStartScan, isScanning }) {
  const [targetUrl, setTargetUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    onStartScan(targetUrl);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Quick Target Assessment</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Run automated recon, port discovery, and vulnerability checks on demand.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 max-w-xl gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="e.g. scanme.nmap.org or https://api.domain.com"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20 whitespace-nowrap"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Scanning...
              </>
            ) : (
              'Run Scan'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}