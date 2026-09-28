import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Kanban, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

interface GreetingHeroProps {
  scheduledCount?: number;
  criticalCount?: number;
}

export const GreetingHero: React.FC<GreetingHeroProps> = ({
  scheduledCount = 5,
  criticalCount = 2,
}) => {
  const { openCreateTaskModal, openCopilot } = useAppStore();
  const navigate = useNavigate();

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/10 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 dark:from-[#11151A] dark:via-[#131922] dark:to-[#171226] shadow-sm select-none"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{todayStr}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Good morning, Developer <span className="inline-block hover:rotate-12 transition-transform">👋</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1.5 font-medium max-w-xl">
            Let's make today productive. You have{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{scheduledCount} tasks</span> scheduled
            today{criticalCount > 0 ? `, with ${criticalCount} critical priority.` : '.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openCopilot()}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Ask CodeFlow AI
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/kanban')}
            leftIcon={<Kanban className="w-3.5 h-3.5 text-gray-500" />}
          >
            Kanban Board
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateTaskModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Task
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
