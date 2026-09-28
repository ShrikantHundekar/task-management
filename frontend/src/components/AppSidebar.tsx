import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  Code2,
  BarChart3,
  Settings,
  FolderGit2,
  Cpu,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const { tasks } = useTaskStore();
  const { projects, selectedProjectId, selectProject } = useProjectStore();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/kanban', label: 'Kanban Board', icon: KanbanSquare },
    { to: '/tasks', label: 'All Tasks', icon: ListTodo, badge: tasks.length },
    { to: '/workspace', label: 'Code Workspace', icon: Code2 },
    { to: '/analytics', label: 'Sprint Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings & Groq', icon: Settings },
  ];

  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const inReviewCount = tasks.filter((t) => t.status === 'in_review').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <aside className="w-60 h-[calc(100vh-3.5rem)] border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col justify-between py-4 px-3 select-none">
      <div className="space-y-6">
        {/* Navigation links */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sprint Status Snapshot */}
        <div className="space-y-2">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center justify-between">
            <span>Sprint Pulse</span>
            <span className="text-[10px] text-indigo-500 font-mono">v1.4</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 px-2">
            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/60 rounded-lg p-2 text-center shadow-xs">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">{inProgressCount}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-tight">Active</div>
            </div>

            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/60 rounded-lg p-2 text-center shadow-xs">
              <div className="flex items-center justify-center text-violet-500 mb-1">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">{inReviewCount}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-tight">Review</div>
            </div>

            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/60 rounded-lg p-2 text-center shadow-xs">
              <div className="flex items-center justify-center text-emerald-500 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">{doneCount}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-tight">Done</div>
            </div>
          </div>
        </div>

        {/* Repositories Quick Switch */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center justify-between">
            <span>Repositories</span>
            <span className="text-[10px] text-gray-400 font-mono">{projects.length}</span>
          </div>

          <div className="space-y-0.5 px-1 max-h-36 overflow-y-auto">
            {projects.map((p) => {
              const isSelected = p.id === selectedProjectId;
              return (
                <button
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between group transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700' : 'bg-gray-400'
                      }`}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{p.programming_language || 'code'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent border border-indigo-200/50 dark:border-indigo-800/30">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Groq Reasoning</span>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
          Sub-second task decomposition & code generation active.
        </p>
      </div>
    </aside>
  );
};
