import React, { useEffect, useState } from 'react';

export default function Settings({
  userRole = 'user',
  userName = 'User',
  userEmail = '',
  currentTheme = 'dark',
  onUpdateTheme,
}) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saveStatus, setSaveStatus] = useState(null);

  // =========================================================
  // APPEARANCE
  // =========================================================

  const [selectedTheme, setSelectedTheme] =
    useState(currentTheme);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  // =========================================================
  // USER PROFILE
  // =========================================================

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });

  useEffect(() => {
    setProfile({
      name: userName,
      email: userEmail,
    });
  }, [userName, userEmail]);

  // =========================================================
  // NOTIFICATION PREFERENCES
  //
  // These are currently frontend preferences.
  // They are not sent to the backend because there is no
  // notification-preferences API in the current backend.
  // =========================================================

  const [userAlerts, setUserAlerts] = useState({
    emailSummary: true,
    browserPushes: false,
  });

  // =========================================================
  // ADMIN ENGINE DISPLAY
  //
  // These are the actual default executable locations used
  // by the Kali environment. The current scanner implementation
  // does not expose an API for changing them.
  // =========================================================

  const [adminConfig, setAdminConfig] = useState({
    nmapPath: '/usr/bin/nmap',
    niktoPath: '/usr/bin/nikto',
  });

  // =========================================================
  // SAVE / STATUS MESSAGE
  // =========================================================

  const showSaveStatus = (message) => {
    setSaveStatus(message);

    setTimeout(() => {
      setSaveStatus(null);
    }, 2500);
  };

  // =========================================================
  // THEME
  // =========================================================

  const handleApplyTheme = () => {
    if (onUpdateTheme) {
      onUpdateTheme(selectedTheme);
    }

    showSaveStatus(
      `Theme switched to ${selectedTheme.toUpperCase()}`
    );
  };

  // =========================================================
  // PROFILE
  //
  // Profile persistence is not implemented in the current
  // backend, so this only updates the local page state.
  // =========================================================

  const handleProfileSave = () => {
    showSaveStatus(
      'Profile changes are currently local to this session'
    );
  };

  // =========================================================
  // ALERTS
  //
  // These preferences are currently frontend-only.
  // =========================================================

  const handleAlertsSave = () => {
    showSaveStatus(
      'Alert preferences updated for this session'
    );
  };

  // =========================================================
  // ENGINE CONFIG
  //
  // The backend currently uses the system scanner commands
  // directly. These fields therefore remain informational.
  // =========================================================

  const handleEngineSave = () => {
    showSaveStatus(
      'Engine paths are managed by the backend environment'
    );
  };

  // =========================================================
  // TABS
  // =========================================================

  const tabs = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: '👤',
    },
    {
      id: 'appearance',
      label: 'Theme & Display',
      icon: '🎨',
    },
    {
      id: 'alerts',
      label: 'Notifications',
      icon: '🔔',
    },

    ...(userRole === 'admin'
      ? [
          {
            id: 'engines',
            label: 'Infrastructure & Engines',
            icon: '⚙️',
            adminOnly: true,
          },
          {
            id: 'danger',
            label: 'Admin Danger Zone',
            icon: '⚠️',
            adminOnly: true,
          },
        ]
      : []),
  ];

  const roleLabel =
    userRole === 'admin'
      ? 'Administrator'
      : 'Standard User';

  const roleDescription =
    userRole === 'admin'
      ? 'Administrative controls are available for this account.'
      : 'Engine configuration and destructive administrative actions are restricted.';

  return (
    <div className="max-w-5xl space-y-6">

      {/* =====================================================
          TOAST NOTICE
      ====================================================== */}

      {saveStatus && (
        <div className="fixed bottom-6 right-6 bg-surface border border-emerald-500/40 text-emerald-500 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold z-50">
          <span>✓</span>
          <span>{saveStatus}</span>
        </div>
      )}

      {/* =====================================================
          ROLE INDICATOR
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-surface border border-app rounded-xl">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-app-secondary">
            Current Session Scope:
          </span>

          <span
            className={`font-semibold px-2 py-0.5 rounded border uppercase text-[10px] tracking-wider ${
              userRole === 'admin'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
            }`}
          >
            {roleLabel}
          </span>
        </div>

        <p className="text-[11px] text-app-muted">
          {roleDescription}
        </p>
      </div>

      {/* =====================================================
          SUB-NAVIGATION
      ====================================================== */}

      <div className="flex border-b border-app gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              setActiveTab(tab.id)
            }
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

      {/* =====================================================
          TAB 1 — PROFILE
      ====================================================== */}

      {activeTab === 'profile' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">

          <div className="p-5 border-b border-app">
            <h3 className="text-sm font-semibold text-app-primary">
              User Profile
            </h3>

            <p className="text-xs text-app-secondary mt-0.5">
              View and manage the identity associated with
              your current WebSecure session.
            </p>
          </div>

          <div className="p-5 space-y-4 max-w-xl text-xs">

            {/* NAME */}

            <div>
              <label className="block text-app-secondary font-medium mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={profile.name}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    name: event.target.value,
                  })
                }
                className="w-full input-app border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="block text-app-secondary font-medium mb-1">
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full input-app border rounded-lg px-3 py-2 outline-none opacity-70 cursor-not-allowed font-mono"
              />
            </div>

            {/* ROLE */}

            <div>
              <label className="block text-app-secondary font-medium mb-1">
                Assigned Role
              </label>

              <input
                type="text"
                value={roleLabel}
                disabled
                className="w-full input-app border rounded-lg px-3 py-2 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="p-4 bg-surface-elevated border-t border-app flex justify-end">
            <button
              type="button"
              onClick={handleProfileSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 2 — APPEARANCE
      ====================================================== */}

      {activeTab === 'appearance' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">

          <div className="p-5 border-b border-app">
            <h3 className="text-sm font-semibold text-app-primary">
              Interface Theme
            </h3>

            <p className="text-xs text-app-secondary mt-0.5">
              Select a palette and apply it to the WebSecure
              workspace.
            </p>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {[
                {
                  id: 'dark',
                  title: 'SOC Obsidian (Dark)',
                  desc: 'High-contrast dark interface optimized for security monitoring.',
                  previewBox:
                    'bg-[#07101d] text-white border-slate-700',
                },
                {
                  id: 'midnight',
                  title: 'Midnight Navy',
                  desc: 'Deep blue interface with subdued background surfaces.',
                  previewBox:
                    'bg-[#0a1526] text-sky-200 border-blue-900',
                },
                {
                  id: 'light',
                  title: 'Enterprise Light',
                  desc: 'Bright interface optimized for clear document-style viewing.',
                  previewBox:
                    'bg-[#f1f5f9] text-slate-900 border-slate-300',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelectedTheme(item.id)
                  }
                  className={`text-left p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTheme === item.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10'
                      : 'border-app bg-surface-elevated hover:border-blue-400/50'
                  }`}
                >
                  <div
                    className={`w-full h-14 rounded-lg border mb-3 flex items-center justify-center text-xs font-mono font-bold shadow-xs ${item.previewBox}`}
                  >
                    Aa Preview
                  </div>

                  <strong className="block text-xs font-bold text-app-primary">
                    {item.title}
                  </strong>

                  <p className="text-[11px] text-app-secondary mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-surface-elevated border-t border-app flex justify-between items-center">

            <span className="text-xs text-app-secondary font-mono">
              Active:{' '}
              <strong className="text-blue-500 uppercase">
                {currentTheme}
              </strong>
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

      {/* =====================================================
          TAB 3 — ALERTS
      ====================================================== */}

      {activeTab === 'alerts' && (
        <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">

          <div className="p-5 border-b border-app">
            <h3 className="text-sm font-semibold text-app-primary">
              Alert Preferences
            </h3>

            <p className="text-xs text-app-secondary mt-0.5">
              Configure notification preferences for this
              WebSecure session.
            </p>
          </div>

          <div className="p-5 space-y-3.5 text-xs">

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  userAlerts.emailSummary
                }
                onChange={(event) =>
                  setUserAlerts({
                    ...userAlerts,
                    emailSummary:
                      event.target.checked,
                  })
                }
                className="w-4 h-4 accent-blue-600 rounded"
              />

              <span className="text-app-primary">
                Email me a summary when an automated scan
                finishes
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  userAlerts.browserPushes
                }
                onChange={(event) =>
                  setUserAlerts({
                    ...userAlerts,
                    browserPushes:
                      event.target.checked,
                  })
                }
                className="w-4 h-4 accent-blue-600 rounded"
              />

              <span className="text-app-primary">
                Enable in-browser desktop push notifications
                for Critical findings
              </span>
            </label>

            <p className="text-[10px] font-mono text-app-muted pt-1">
              Notification persistence will be connected when
              the backend notification service is implemented.
            </p>
          </div>

          <div className="p-4 bg-surface-elevated border-t border-app flex justify-end">
            <button
              type="button"
              onClick={handleAlertsSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 4 — ADMIN ENGINES
      ====================================================== */}

      {activeTab === 'engines' &&
        userRole === 'admin' && (
          <div className="bg-surface border border-app rounded-xl overflow-hidden shadow-sm">

            <div className="p-5 border-b border-app flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-app-primary">
                  Scanner Engine Binaries
                </h3>

                <p className="text-xs text-app-secondary mt-0.5">
                  Scanner executables available in the
                  WebSecure backend environment.
                </p>
              </div>

              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono font-bold">
                ADMIN
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">

              <div>
                <label className="block text-app-secondary font-medium mb-1">
                  Nmap Binary Path
                </label>

                <input
                  type="text"
                  value={adminConfig.nmapPath}
                  onChange={(event) =>
                    setAdminConfig({
                      ...adminConfig,
                      nmapPath:
                        event.target.value,
                    })
                  }
                  className="w-full input-app border rounded-lg px-3 py-2 font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-app-secondary font-medium mb-1">
                  Nikto CLI Script
                </label>

                <input
                  type="text"
                  value={adminConfig.niktoPath}
                  onChange={(event) =>
                    setAdminConfig({
                      ...adminConfig,
                      niktoPath:
                        event.target.value,
                    })
                  }
                  className="w-full input-app border rounded-lg px-3 py-2 font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div className="border border-app rounded-lg p-3 bg-surface-elevated">
                <p className="text-[10px] font-mono text-app-muted leading-5">
                  Current scanner execution is controlled by
                  the FastAPI backend on Kali. These values are
                  displayed for environment reference and are
                  not currently persisted by the settings page.
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-elevated border-t border-app flex justify-end">
              <button
                type="button"
                onClick={handleEngineSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Save Engine Paths
              </button>
            </div>
          </div>
        )}

      {/* =====================================================
          TAB 5 — ADMIN DANGER ZONE
      ====================================================== */}

      {activeTab === 'danger' &&
        userRole === 'admin' && (
          <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl overflow-hidden shadow-sm">

            <div className="p-5 border-b border-rose-800/30">
              <h3 className="text-sm font-semibold text-rose-500">
                Database & System Administration
              </h3>

              <p className="text-xs text-app-secondary mt-0.5">
                Destructive database operations require an
                explicit backend administration API.
              </p>
            </div>

            <div className="p-5 divide-y divide-rose-800/20 text-xs">

              <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>
                  <p className="font-semibold text-app-primary">
                    Purge All Telemetry & Scans
                  </p>

                  <p className="text-app-secondary mt-1">
                    Permanently delete scan history, findings,
                    evidence, and related records.
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  title="Backend purge endpoint is not implemented"
                  className="px-3 py-1.5 bg-rose-600/10 text-rose-400/50 border border-rose-500/20 font-semibold rounded-lg cursor-not-allowed"
                >
                  Purge Database
                </button>
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-mono text-rose-400/70 leading-5">
                  Destructive database operations are disabled
                  because the current WebSecure backend does not
                  expose a purge endpoint. The interface will not
                  claim that data was deleted when no deletion
                  actually occurred.
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}