import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from '../tasks/TaskCard';
import { Task } from '../../types';
import { Sparkles, CheckCircle2, ListFilter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TodayTasksProps {
  tasks: Task[];
}

export const TodayTasks: React.FC<TodayTasksProps> = ({ tasks }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'in_progress' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'critical') return t.priority === 'critical' || t.priority === 'high';
    if (filter === 'in_progress') return t.status === 'in_progress';
    if (filter === 'completed') return t.status === 'done';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header with Filter Pills & Link to full tasks view */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Today's Tasks</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sprint priorities and active development issues
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'critical', label: 'High Priority' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all duration-150 ${
                filter === tab.id
                  ? 'bg-white dark:bg-[#1E2530] text-gray-900 dark:text-white shadow-xs font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">No tasks in this view</h4>
          <p className="text-xs text-gray-400 mt-1">All clear or no tasks match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* View all tasks link */}
      {tasks.length > 6 && (
        <div className="pt-2 text-center">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <span>View all {tasks.length} tasks in backlog & sprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
