import React from 'react';

export default function Stats() {
  return (
    <section className="stats">
      <div className="stat-card">
        <div className="stat-icon purple">🛡</div>
        <div>
          <p>Total Vulnerabilities</p>
          <h2>28</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon red">⚠</div>
        <div>
          <p>Critical</p>
          <h2>5</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon orange">⚠</div>
        <div>
          <p>High</p>
          <h2>9</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon yellow">⚠</div>
        <div>
          <p>Medium</p>
          <h2>10</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">✓</div>
        <div>
          <p>Low</p>
          <h2>4</h2>
        </div>
      </div>
    </section>
  );
}