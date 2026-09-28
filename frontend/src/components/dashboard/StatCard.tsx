import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  trend: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor: string;
  bgGlow?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  isPositive = true,
  icon: Icon,
  accentColor,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 600;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: delay * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="relative overflow-hidden rounded-2xl p-5 border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs hover:shadow-md transition-all select-none group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
          {label}
        </span>
        <div
          className="p-2 rounded-xl transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-mono">
          {displayValue}
        </span>

        <div
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full font-mono',
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
              : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
          )}
        >
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend}</span>
        </div>
      </div>
    </motion.div>
  );
};
