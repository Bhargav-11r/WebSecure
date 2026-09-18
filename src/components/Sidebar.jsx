import React from 'react';

export default function Sidebar({ activePage, setActivePage }) {
  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'scan', label: 'New Scan', icon: '🔍' },
    { id: 'findings', label: 'Vulnerabilities', icon: '🛡️' },
    { id: 'mitigations', label: 'Mitigations', icon: '🛠️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[70px] sm:w-[240px] bg-[#081321] border-r border-[#17263a] py-6 px-3 sm:px-4 flex flex-col z-20 transition-all">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <span className="text-3xl">⚡</span>
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold text-white leading-tight">WebSecure</h2>
          <p className="text-xs text-[#8492a6]">Security Suite</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = activePage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full text-left ${
                isActive
                  ? 'bg-[#1557c0] text-white'
                  : 'text-[#9caabd] hover:bg-[#101f32] hover:text-white'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="mt-auto hidden sm:block pt-4 border-t border-[#17263a] text-xs text-[#8492a6] px-2">
        FastAPI Status: <span className="text-emerald-400 font-semibold">Online</span>
      </div>
    </aside>
  );
}