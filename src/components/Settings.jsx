import React, { useState } from 'react';

export default function Settings({ userRole = 'user', userName = 'Alex Vance', currentTheme = 'dark', onUpdateTheme }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saveStatus, setSaveStatus] = useState(null);

  // Track draft theme selection
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  // User Profile State
  const [profile, setProfile] = useState({
    name: userName,
    email: userRole === 'admin' ? 'admin.root@websecure.internal' : 'alex.vance@websecure.internal',
    roleTitle: userRole === 'admin' ? 'Lead SecOps Engineer (Admin)' : 'Security Analyst',
  });

  const [userAlerts, setUserAlerts] = useState({
    emailSummary: true,
    browserPushes: false,
  });

  // Admin Config State
  const [adminConfig, setAdminConfig] = useState({
    nmapPath: '/usr/bin/nmap',
    niktoPath: '/usr/bin/nikto',
  });

  const handleApplyTheme = () => {
    if (onUpdateTheme) {
      onUpdateTheme(selectedTheme);
    }
    setSaveStatus(`Theme switched to ${selectedTheme.toUpperCase()}`);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleSave = (section) => {
    setSaveStatus(section);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'appearance', label: 'Theme & Display', icon: '🎨' },
    { id: 'alerts', label: 'Notifications', icon: '🔔' },
    ...(userRole === 'admin'
      ? [
          { id: 'engines', label: 'Infrastructure & Engines', icon: '⚙️', adminOnly: true },
          { id: 'danger', label: 'Admin Danger Zone', icon: '⚠️', adminOnly: true },
        ]
      : []),
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Toast Notice */}
      {saveStatus && (
        <div className="fixed bottom-6 right-6 bg-surface border border-emerald-500/40 text-emerald-500 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold z-50">
          <span>✓</span>
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Role Indicator Banner */}
      <div className="flex items-center justify-between p-3.5 bg-surface border border-app rounded-xl">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-app-secondary">Current Session Scope:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded border uppercase text-[10px] tracking-wider ${
              userRole === 'admin'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
            }`}
          >
            {userRole === 'admin' ? 'Administrator' : 'Standard User'}
          </span>
        </div>
        {userRole !== 'admin' && (
          <p className="text-[11px] text-app-muted">
            Engine configurations & database utilities are locked to Admins.
          </p>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-app gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-500 bg-blue-500/10'
                : 'border-transparent text-app-secondary hover:text-app-primary hover:border-app'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.adminOnly && (
              <span className="ml-1 text-[9px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono">
                ADMIN
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-app">
            <h3 className="text-sm font-semibold text-app-primary">User Profile</h3>
            <p className="text-xs text-app-secondary mt-0.5">Manage your personal credentials and identity.</p>
          </div>
          <div className="p-5 space-y-4 max-w-xl text-xs">
            <div>
              <label className="block text-app-secondary font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full input-app border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-app-secondary font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full input-app border rounded-lg px-3 py-2 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-app-secondary font-medium mb-1">Assigned Role</label>
              <input
                type="text"
                value={profile.roleTitle}
                disabled
                className="w-full input-app border rounded-lg px-3 py-2 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="p-4 bg-surface-elevated border-t border-app flex justify-end">
            <button
              onClick={() => handleSave('Profile updated')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Theme & Appearance */}
      {activeTab === 'appearance' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-app">
            <h3 className="text-sm font-semibold text-app-primary">Interface Theme</h3>
            <p className="text-xs text-app-secondary mt-0.5">Select a palette and click "Apply Theme" to update the entire workspace.</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'dark',
                  title: 'SOC Obsidian (Dark)',
                  desc: 'High-contrast OLED black optimized for security monitoring.',
                  previewBox: 'bg-[#07101d] text-white border-slate-700',
                },
                {
                  id: 'midnight',
                  title: 'Midnight Navy',
                  desc: 'Soft deep blue palette with subdued background cards.',
                  previewBox: 'bg-[#0a1526] text-sky-200 border-blue-900',
                },
                {
                  id: 'light',
                  title: 'Enterprise Light',
                  desc: 'High-brightness document styling for clear contrast.',
                  previewBox: 'bg-[#f1f5f9] text-slate-900 border-slate-300',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTheme(item.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTheme === item.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10'
                      : 'border-app bg-surface-elevated hover:border-blue-400/50'
                  }`}
                >
                  <div className={`w-full h-14 rounded-lg border mb-3 flex items-center justify-center text-xs font-mono font-bold shadow-xs ${item.previewBox}`}>
                    Aa Preview
                  </div>
                  <strong className="block text-xs font-bold text-app-primary">{item.title}</strong>
                  <p className="text-[11px] text-app-secondary mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-surface-elevated border-t border-app flex justify-between items-center">
            <span className="text-xs text-app-secondary font-mono">
              Active: <strong className="text-blue-500 uppercase">{currentTheme}</strong>
            </span>
            <button
              type="button"
              onClick={handleApplyTheme}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm shadow-blue-500/20"
            >
              Apply Theme
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Alerts */}
      {activeTab === 'alerts' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-app">
            <h3 className="text-sm font-semibold text-app-primary">Alert Preferences</h3>
            <p className="text-xs text-app-secondary mt-0.5">Control how and when you receive security alerts.</p>
          </div>
          <div className="p-5 space-y-3.5 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={userAlerts.emailSummary}
                onChange={(e) => setUserAlerts({ ...userAlerts, emailSummary: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-app-primary">Email me a summary when an automated scan finishes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={userAlerts.browserPushes}
                onChange={(e) => setUserAlerts({ ...userAlerts, browserPushes: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-app-primary">Enable in-browser desktop push notifications for Critical findings</span>
            </label>
          </div>
          <div className="p-4 bg-surface-elevated border-t border-app flex justify-end">
            <button
              onClick={() => handleSave('Alert preferences updated')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Admin Engines */}
      {activeTab === 'engines' && userRole === 'admin' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-app flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-app-primary">Scanner Engine Binaries</h3>
              <p className="text-xs text-app-secondary mt-0.5">Configure host service execution paths for CLI tools.</p>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono font-bold">
              ADMIN PRIVILEGES
            </span>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-app-secondary font-medium mb-1">Nmap Binary Path</label>
              <input
                type="text"
                value={adminConfig.nmapPath}
                onChange={(e) => setAdminConfig({ ...adminConfig, nmapPath: e.target.value })}
                className="w-full input-app border rounded-lg px-3 py-2 font-mono outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-app-secondary font-medium mb-1">Nikto CLI Script</label>
              <input
                type="text"
                value={adminConfig.niktoPath}
                onChange={(e) => setAdminConfig({ ...adminConfig, niktoPath: e.target.value })}
                className="w-full input-app border rounded-lg px-3 py-2 font-mono outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="p-4 bg-surface-elevated border-t border-app flex justify-end">
            <button
              onClick={() => handleSave('Engine binaries saved')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Save Engine Paths
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Admin Danger Zone */}
      {activeTab === 'danger' && userRole === 'admin' && (
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-rose-800/30">
            <h3 className="text-sm font-semibold text-rose-500">Database Purge & System Reset</h3>
            <p className="text-xs text-app-secondary mt-0.5">Destructive global actions requiring superuser validation.</p>
          </div>
          <div className="p-5 divide-y divide-rose-800/20 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-app-primary">Purge All Telemetry & Scans</p>
                <p className="text-app-secondary">Permanently clears all historical CVE findings, targets, and logs.</p>
              </div>
              <button
                onClick={() => confirm('Purge all data?') && alert('Data cleared.')}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Purge Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}