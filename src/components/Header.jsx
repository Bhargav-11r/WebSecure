import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div>
        <h1>Security Dashboard</h1>
        <p>Analyze your website and identify security vulnerabilities.</p>
      </div>

      <div className="profile">
        <div className="profile-circle">B</div>
        <span>Bhargav</span>
      </div>
    </header>
  );
}