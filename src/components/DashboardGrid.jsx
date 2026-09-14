import React from 'react';

export default function DashboardGrid() {

    
  return (
    <section className="dashboard-grid">
      {/* Severity */}
      <div className="card severity-card">
        <div className="card-header">
          <h2>Vulnerability Severity</h2>
        </div>

        <div className="severity-content">
          <div className="circle-chart">
            <div>
              <strong>28</strong>
              <span>Total</span>
            </div>
          </div>

          <div className="legend">
            <div>
              <span className="dot critical"></span>
              Critical
              <strong>5</strong>
            </div>
            <div>
              <span className="dot high"></span>
              High
              <strong>9</strong>
            </div>
            <div>
              <span className="dot medium"></span>
              Medium
              <strong>10</strong>
            </div>
            <div>
              <span className="dot low"></span>
              Low
              <strong>4</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Scans</h2>
          <a>View All</a>
        </div>

        <div className="scan-history">
          <div className="history-item">
            <span>🌐</span>
            <div>
              <strong>example.com</strong>
              <small>26 Aug 2026 • 11:45 AM</small>
            </div>
            <b className="badge critical-bg">5 Critical</b>
          </div>

          <div className="history-item">
            <span>🌐</span>
            <div>
              <strong>testsite.com</strong>
              <small>24 Aug 2026 • 05:20 PM</small>
            </div>
            <b className="badge high-bg">3 High</b>
          </div>

          <div className="history-item">
            <span>🌐</span>
            <div>
              <strong>demo.org</strong>
              <small>22 Aug 2026 • 09:15 AM</small>
            </div>
            <b className="badge medium-bg">2 Medium</b>
          </div>
        </div>
      </div>
    </section>
  );
}