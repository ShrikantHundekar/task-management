import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  CheckCircle2,
  FolderGit2,
  Sparkles,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useAppStore } from '../store/useAppStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/ui/Button';
import { TaskStatus, TaskPriority } from '../types';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    fetchTasks,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterProjectId,
    setFilterProjectId,
    searchQuery,
    setSearchQuery,
  } = useTaskStore();

  const { projects } = useProjectStore();
  const { openCreateTaskModal, openCopilot } = useAppStore();

  const [sortBy, setSortBy] = useState<'default' | 'priority' | 'date'>('default');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  let displayTasks = [...tasks];

  if (sortBy === 'priority') {
    const pWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    displayTasks.sort((a, b) => pWeight[b.priority] - pWeight[a.priority]);
  } else if (sortBy === 'date') {
    displayTasks.sort((a, b) => (new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime()));
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Engineering Tasks
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage issues, features, subtasks, and Groq AI code assistance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ai"
            size="sm"
            onClick={() =>
              openCopilot({
                prompt: 'Review all pending tasks in the current sprint and suggest the optimal sequence of execution.',
              })
            }
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            AI Sprint Planner
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, description, #ID, or label..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Project Filter */}
            <select
              value={filterProjectId}
              onChange={(e) =>
                setFilterProjectId(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="default">Sort: Default</option>
              <option value="priority">Sort: Highest Priority</option>
              <option value="date">Sort: Due Date</option>
            </select>
          </div>
        </div>

        {/* Status Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'backlog', label: 'Backlog' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'in_review', label: 'In Review' },
            { id: 'testing', label: 'Testing' },
            { id: 'done', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      {displayTasks.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.01]">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No tasks found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or create a new engineering task for your team.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateTaskModal}
            className="mt-4"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {displayTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
