import React from 'react';

export default function Stats() {
  const stats = [
    { label: 'Total Scans', value: '42', icon: '📡', iconBg: 'bg-[#241c50]' },
    { label: 'Critical', value: '3', icon: '🚨', iconBg: 'bg-[#491b22]' },
    { label: 'High', value: '8', icon: '⚠️', iconBg: 'bg-[#4b2c16]' },
    { label: 'Medium', value: '15', icon: '⚡', iconBg: 'bg-[#4a4214]' },
    { label: 'Low', value: '24', icon: '🛡️', iconBg: 'bg-[#123d28]' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-[#0b1727] border border-[#1a2b40] rounded-xl p-4 flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg ${stat.iconBg}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-xs text-[#8b99ad]">{stat.label}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{stat.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}