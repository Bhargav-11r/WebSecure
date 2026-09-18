import React from 'react';

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Security Overview</h1>
        <p className="text-xs sm:text-sm text-[#8795a9] mt-1.5">Real-time target attack surface & scans</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1b3d72] text-white flex items-center justify-center font-bold text-sm border border-blue-400/30">
          WS
        </div>
      </div>
    </header>
  );
}