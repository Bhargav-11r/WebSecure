import React, { useState } from 'react';

export default function ScanBox({ onStartScan, isScanning }) {
  const [targetUrl, setTargetUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    onStartScan(targetUrl);
  };

  return (
    <div className="bg-[#0b1727] border border-[#1a2b40] rounded-xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-5">
        <span className="text-3xl">🌐</span>
        <div>
          <h2 className="text-lg font-bold text-white">Target Scanner</h2>
          <p className="text-sm text-[#8795a9] mt-0.5">Enter a domain or IP to run Nmap, Nikto, and OWASP ZAP checks</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com or 192.168.1.1"
          className="flex-1 px-4 py-3.5 bg-[#07101d] border border-[#26384e] rounded-lg text-white text-sm outline-none focus:border-[#2879ee] transition-colors"
        />
        <button
          type="submit"
          disabled={isScanning}
          className="px-6 py-3.5 bg-[#1769e0] hover:bg-[#2879ee] disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </form>
    </div>
  );
}