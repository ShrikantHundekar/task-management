import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-base', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 'w-8 h-8', text: 'text-lg', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-10 h-10', text: 'text-xl', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Geometric Symbol: < > + Arrow + Spark */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4/5 h-4/5"
        >
          {/* Left code bracket */}
          <path d="M7 8L3 12L7 16" stroke="currentColor" strokeOpacity="0.85" />
          {/* Right code bracket */}
          <path d="M17 8L21 12L17 16" stroke="currentColor" strokeOpacity="0.85" />
          {/* Forward flow slash/arrow */}
          <path d="M13 5L10 19" stroke="currentColor" />
          {/* Glowing AI Spark inside */}
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>

        {/* Subtle AI Spark Star at top right */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-[#0B0D10] animate-pulse" />
      </div>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`${currentSize.text} font-extrabold tracking-tight text-gray-900 dark:text-white`}>
            Code<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
          <span className={`${currentSize.badge} font-semibold rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono tracking-wider`}>
            AI
          </span>
        </div>
      )}
    </div>
  );
};
