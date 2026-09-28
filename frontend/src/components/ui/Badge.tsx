import React from 'react';
import { cn } from '../../lib/utils';
import { TaskPriority, TaskStatus } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle2, Circle, Clock, Flame, Sparkles } from 'lucide-react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'priority' | 'status' | 'ai' | 'outline';
  priority?: TaskPriority;
  status?: TaskStatus;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  priority,
  status,
  size = 'md',
  children,
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  if (variant === 'priority' && priority) {
    const priorityConfig: Record<
      TaskPriority,
      { bg: string; text: string; border: string; icon: React.ReactNode; label: string }
    > = {
      critical: {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/20',
        icon: <Flame className="w-3 h-3 text-rose-500 shrink-0" />,
        label: 'CRITICAL',
      },
      high: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/20',
        icon: <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />,
        label: 'HIGH',
      },
      medium: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/20',
        icon: <AlertTriangle className="w-3 h-3 text-blue-500 shrink-0" />,
        label: 'MEDIUM',
      },
      low: {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/20',
        icon: <Circle className="w-2.5 h-2.5 text-slate-400 shrink-0" />,
        label: 'LOW',
      },
    };

    const cfg = priorityConfig[priority];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-semibold rounded-md border font-mono tracking-wide',
          cfg.bg,
          cfg.text,
          cfg.border,
          sizeClasses,
          className
        )}
        {...props}
      >
        {cfg.icon}
        <span>{children || cfg.label}</span>
      </span>
    );
  }

  if (variant === 'status' && status) {
    const statusConfig: Record<
      TaskStatus,
      { bg: string; text: string; border: string; dot: string; label: string }
    > = {
      backlog: {
        bg: 'bg-gray-500/10 dark:bg-gray-500/15',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-500/20',
        dot: 'bg-gray-400',
        label: 'Backlog',
      },
      todo: {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-500/20',
        dot: 'bg-indigo-500',
        label: 'Todo',
      },
      in_progress: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/15',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/20',
        dot: 'bg-blue-500 animate-pulse',
        label: 'In Progress',
      },
      in_review: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/20',
        dot: 'bg-amber-500',
        label: 'In Review',
      },
      testing: {
        bg: 'bg-purple-500/10 dark:bg-purple-500/15',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-500/20',
        dot: 'bg-purple-500',
        label: 'Testing',
      },
      done: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-500',
        label: 'Done',
      },
    };

    const cfg = statusConfig[status];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-full border',
          cfg.bg,
          cfg.text,
          cfg.border,
          sizeClasses,
          className
        )}
        {...props}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
        <span>{children || cfg.label}</span>
      </span>
    );
  }

  if (variant === 'ai') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-semibold rounded-md border font-mono',
          'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          sizeClasses,
          className
        )}
        {...props}
      >
        <Sparkles className="w-3 h-3 text-indigo-500" />
        <span>{children || 'AI ASSIST'}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300',
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
