import React from 'react';

export default function DashboardGrid() {
  const recentScans = [
    { target: 'api.example.com', time: '20 mins ago', badge: 'Critical', badgeColor: 'bg-[#4b1d25] text-[#ff5b65]' },
    { target: 'auth.client-portal.io', time: '2 hours ago', badge: 'High', badgeColor: 'bg-[#4b2b16] text-[#ff9b45]' },
    { target: 'staging.testnet.org', time: 'Yesterday', badge: 'Medium', badgeColor: 'bg-[#494014] text-[#e9c72f]' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      {/* Severity Breakdown */}
      <div className="bg-[#0b1727] border border-[#1a2b40] rounded-xl p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-white">Severity Breakdown</h2>
          <span className="text-xs text-[#3c8cff] cursor-pointer hover:underline">View Breakdown</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-3">
          {/* Conic Gradient Donut Chart */}
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: 'conic-gradient(#ef4444 0deg 64deg, #f97316 64deg 180deg, #eab308 180deg 308deg, #22c55e 308deg 360deg)'
            }}
          >
            <div className="w-[102px] h-[102px] bg-[#0b1727] rounded-full flex flex-col items-center justify-center">
              <strong className="text-2xl font-bold text-white">50</strong>
              <span className="text-xs text-[#8492a6]">Issues</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2.5 w-32">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
              <span className="text-slate-300">Critical</span>
              <strong className="ml-auto text-white">3</strong>
            </div>
            <div className="flex items-center gap-2.5 w-32">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
              <span className="text-slate-300">High</span>
              <strong className="ml-auto text-white">8</strong>
            </div>
            <div className="flex items-center gap-2.5 w-32">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span>
              <span className="text-slate-300">Medium</span>
              <strong className="ml-auto text-white">15</strong>
            </div>
            <div className="flex items-center gap-2.5 w-32">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
              <span className="text-slate-300">Low</span>
              <strong className="ml-auto text-white">24</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-[#0b1727] border border-[#1a2b40] rounded-xl p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-white">Recent Scans</h2>
          <span className="text-xs text-[#3c8cff] cursor-pointer hover:underline">All Scans</span>
        </div>

        <div className="flex flex-col gap-3">
          {recentScans.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-[#081321] rounded-lg border border-[#142233]">
              <span className="text-xl">🎯</span>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs sm:text-sm text-white truncate">{item.target}</strong>
                <small className="text-xs text-[#748399]">{item.time}</small>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}