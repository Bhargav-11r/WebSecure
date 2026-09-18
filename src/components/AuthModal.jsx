import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('alex.vance@websecure.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [displayName, setDisplayName] = useState('Alex Vance');
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' | 'admin'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = displayName.trim() || (selectedRole === 'admin' ? 'Root Admin' : 'Security Analyst');
    onLogin(selectedRole, email, finalName);
    onClose();
  };

  const setDemoRole = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin.root@websecure.internal');
      setDisplayName('Marcus Croft (SecOps)');
    } else {
      setEmail('alex.vance@websecure.internal');
      setDisplayName('Alex Vance (Analyst)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#091524] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {isRegisterMode ? 'Register New WebSecure Account' : 'Access WebSecure Portal'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRegisterMode ? 'Provision role credentials' : 'Authenticate your analytical workstation'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-mono cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Quick 1-Click Role Selector */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">
              Preset Role Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('user')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedRole === 'user'
                    ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm shadow-blue-500/10'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white mb-0.5">👤 Analyst</div>
                <div className="text-[10px] text-slate-400 leading-tight">Triage, audits, mitigations</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('admin')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedRole === 'admin'
                    ? 'border-purple-500 bg-purple-500/10 text-white shadow-sm shadow-purple-500/10'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-purple-300 mb-0.5">🛡️ Administrator</div>
                <div className="text-[10px] text-slate-400 leading-tight">Full engine & CLI sovereignty</div>
              </button>
            </div>
          </div>

          {/* User Name input (Visible during register or manual edit) */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Vance"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Email input */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 outline-none font-mono"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 outline-none font-mono"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer text-xs"
          >
            {isRegisterMode ? 'Create Account & Sign In' : `Sign In as ${selectedRole === 'admin' ? 'Administrator' : 'Security Analyst'}`}
          </button>

          {/* Mode Switcher */}
          <div className="text-center pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-medium transition-colors cursor-pointer"
            >
              {isRegisterMode
                ? 'Already provisioned? Return to Sign In'
                : "Need a new analyst login? Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}