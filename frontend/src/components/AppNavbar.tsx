import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useCopilotStore } from '../store/copilotStore';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  FolderGit2, 
  Bot, 
  Bell, 
  ChevronDown,
  Terminal
} from 'lucide-react';

export const AppNavbar: React.FC = () => {
  const { theme, toggleTheme, user, groqKey } = useAuthStore();
  const { projects, selectedProjectId, selectProject } = useProjectStore();
  const { toggleCopilot, isOpen: isCopilotOpen, openModal } = useCopilotStore();
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Brand & Project Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-lg">CodeFlow<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">.ai</span></span>
        </div>

        <div className="h-5 w-px bg-gray-200 dark:bg-gray-800" />

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="max-w-[140px] truncate font-semibold">
              {activeProject ? activeProject.name : 'All Projects'}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Switch Repository
              </div>
              <button
                onClick={() => { selectProject(null); setIsProjectDropdownOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-gray-800 ${
                  selectedProjectId === null ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>All Projects</span>
                <span className="text-[10px] text-gray-400">{projects.length} repos</span>
              </button>

              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => { selectProject(proj.id); setIsProjectDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-gray-800 ${
                    selectedProjectId === proj.id ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="truncate pr-2">{proj.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {proj.programming_language || 'Code'}
                  </span>
                </button>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1 px-2">
                <button
                  onClick={() => { openModal('createProject'); setIsProjectDropdownOpen(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded flex items-center gap-1.5 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Command Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, code, git commits (e.g. RES-101)..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200/60 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all placeholder:text-gray-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: AI Model Status, Quick Actions, Theme, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Groq AI Engine Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-medium">Groq LLaMA 3.3 70B</span>
        </div>

        {/* New Task Button */}
        <button
          onClick={() => openModal('createTask')}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* AI Copilot Drawer Trigger */}
        <button
          onClick={toggleCopilot}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isCopilotOpen
              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/40'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-500/50'
          }`}
          title="Open AI Developer Copilot"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Copilot</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-gray-200 dark:border-gray-800">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
            alt="Alex Chen"
            className="w-7 h-7 rounded-full ring-1 ring-gray-300 dark:ring-gray-700 object-cover"
          />
        </div>
      </div>
    </header>
  );
};
