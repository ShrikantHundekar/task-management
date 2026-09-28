import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useCopilotStore } from '../store/copilotStore';
import {
  Search,
  Filter,
  Plus,
  Sparkles,
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ListTree,
  ShieldCheck,
  Bug,
  Tag
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '../types';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    fetchTasks,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    updateTaskStatus
  } = useTaskStore();

  const { selectedProjectId } = useProjectStore();
  const { openModal } = useCopilotStore();

  useEffect(() => {
    fetchTasks(selectedProjectId || undefined);
  }, [selectedProjectId, filterStatus, filterPriority, searchQuery]);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.task_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Sprint Task Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage, filter, and inspect coding specifications and issues
          </p>
        </div>

        <button
          onClick={() => openModal('createTask')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tasks by ID, title, keyword..."
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <span className="text-[11px] text-gray-400 font-mono pl-2">
            {filteredTasks.length} items
          </span>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Subtasks</th>
                <th className="py-3 px-4">Tech Stack</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4 text-right">AI Assistant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredTasks.map((task) => {
                const completedSubtasks = task.subtasks.filter((s) => s.is_completed).length;
                return (
                  <tr
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="hover:bg-indigo-50/40 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {task.task_number}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</div>
                      <div className="text-[11px] text-gray-500 truncate">{task.description || 'No description'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          e.stopPropagation();
                          await updateTaskStatus(task.id, e.target.value as TaskStatus);
                        }}
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border-none focus:outline-none cursor-pointer ${
                          task.status === 'done'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : task.status === 'in_progress'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                            : task.status === 'in_review'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="testing">Testing</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          task.priority === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold'
                            : task.priority === 'high'
                            ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {completedSubtasks}/{task.subtasks.length}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-gray-600 dark:text-gray-400">
                        {task.programming_language || 'Code'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
                          alt={task.assignee_name || 'Assignee'}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-[11px] text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                          {task.assignee_name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openModal('subtasks', { task })}
                          className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          title="AI Break Subtasks"
                        >
                          <ListTree className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openModal('review', { task })}
                          className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                          title="AI Code Review"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openModal('debug', { task })}
                          className="p-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="AI Debugger"
                        >
                          <Bug className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No coding tasks match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
