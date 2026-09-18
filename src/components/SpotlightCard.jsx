import React, { useRef, useState } from 'react';

export default function SpotlightCard({ children, className = '', currentTheme = 'dark', onClick }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isLight = currentTheme === 'light';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glowColor = isLight
    ? 'rgba(37, 99, 235, 0.08)' // Soft sapphire blue for light
    : 'rgba(59, 130, 246, 0.18)'; // Vivid cyber blue for dark

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${className}`}
      style={{
        willChange: 'transform',
      }}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 60%)`,
        }}
      />
      {/* Inner Card Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}