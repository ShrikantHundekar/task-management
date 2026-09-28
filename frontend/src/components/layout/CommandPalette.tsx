import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  Kanban,
  Calendar,
  Sparkles,
  BarChart3,
  Code2,
  Moon,
  Sun,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTaskStore } from '../../store/taskStore';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    toggleTheme,
    theme,
    openCreateTaskModal,
    openCreateProjectModal,
    openCopilot,
  } = useAppStore();

  const { tasks, openTaskDrawer } = useTaskStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Reset query on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  const defaultCommands = [
    {
      id: 'create-task',
      label: 'Create New Task',
      category: 'Actions',
      icon: Plus,
      action: () => openCreateTaskModal(),
    },
    {
      id: 'create-proj',
      label: 'Create New Project',
      category: 'Actions',
      icon: FolderGit2,
      action: () => openCreateProjectModal(),
    },
    {
      id: 'ask-ai',
      label: 'Ask CodeFlow AI Agent',
      category: 'AI Assistant',
      icon: Sparkles,
      action: () => openCopilot(),
    },
    {
      id: 'nav-dash',
      label: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => navigate('/'),
    },
    {
      id: 'nav-tasks',
      label: 'Browse My Tasks',
      category: 'Navigation',
      icon: CheckSquare,
      action: () => navigate('/tasks'),
    },
    {
      id: 'nav-kanban',
      label: 'Open Kanban Board',
      category: 'Navigation',
      icon: Kanban,
      action: () => navigate('/kanban'),
    },
    {
      id: 'nav-cal',
      label: 'Open Calendar',
      category: 'Navigation',
      icon: Calendar,
      action: () => navigate('/calendar'),
    },
    {
      id: 'nav-ai',
      label: 'Dedicated AI Agent Workspace',
      category: 'Navigation',
      icon: Sparkles,
      action: () => navigate('/ai'),
    },
    {
      id: 'nav-editor',
      label: 'Open Monaco Code Editor',
      category: 'Navigation',
      icon: Code2,
      action: () => navigate('/editor'),
    },
    {
      id: 'nav-analytics',
      label: 'Open Analytics & Productivity',
      category: 'Navigation',
      icon: BarChart3,
      action: () => navigate('/analytics'),
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Preferences',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme(),
    },
  ];

  // Filter commands and matching tasks
  const filteredCommands = defaultCommands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchingTasks = query.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.task_number.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelect = (action: () => void) => {
    setCommandPaletteOpen(false);
    action();
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#11151A] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search tasks..."
                className="w-full bg-transparent border-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-500 shrink-0">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
              {/* Matching Tasks if query exists */}
              {matchingTasks.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[11px] font-mono uppercase text-gray-400 dark:text-gray-500 font-semibold tracking-wider">
                    Matching Tasks
                  </p>
                  <div className="space-y-0.5">
                    {matchingTasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCommandPaletteOpen(false);
                          openTaskDrawer(t);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                            {t.task_number}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{t.title}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Commands */}
              <div>
                <p className="px-3 py-1 text-[11px] font-mono uppercase text-gray-400 dark:text-gray-500 font-semibold tracking-wider">
                  Quick Commands
                </p>
                <div className="space-y-0.5">
                  {filteredCommands.length === 0 && matchingTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">No matching commands found.</div>
                  ) : (
                    filteredCommands.map((cmd) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd.action)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{cmd.label}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{cmd.category}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <span>Navigate: ↑ ↓</span>
                <span>Select: ↵</span>
              </div>
              <div className="flex items-center gap-1 text-indigo-500">
                <Terminal className="w-3 h-3" />
                <span>CodeFlow Engine</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
