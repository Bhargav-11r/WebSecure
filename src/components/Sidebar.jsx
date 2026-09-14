import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🛡</div>
        <div>
          <h2>WebSecure</h2>
          <p>Security Analysis</p>
        </div>
      </div>

      <nav>
        <a className="active">⌂ <span>Dashboard</span></a>
        <a>⌕ <span>Scan Website</span></a>
        <a>◷ <span>Scan History</span></a>
        <a>⚠ <span>Vulnerabilities</span></a>
        <a>▣ <span>Reports</span></a>
        <a>💡 <span>Suggestions</span></a>
        <a>💬 <span>Chatbot</span></a>
      </nav>

      <div className="sidebar-bottom">
        <a>⚙ <span>Settings</span></a>
        <a>ⓘ <span>About</span></a>
      </div>
    </aside>
  );
}