import React from 'react';

export default function ScanBox() {
  return (
    <section className="scan-box">
      <div className="scan-title">
        <span className="globe">🌐</span>
        <div>
          <h2>Scan a Website</h2>
          <p>Enter a website URL to begin security analysis.</p>
        </div>
      </div>

      <div className="scan-input">
        <input
          id="websiteUrl"
          type="text"
          placeholder="https://example.com"
        />
        <button id="startScan">
          🔍 Start Scan
        </button>
      </div>
    </section>
  );
}