import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Plus,
  Command,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useProjectStore } from '../../store/projectStore';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { Button } from '../ui/Button';

export const AppNavbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeWorkspace,
    openCopilot,
    setCommandPaletteOpen,
    openCreateTaskModal,
    notifications,
  } = useAppStore();

  const { activeProject } = useProjectStore();
  const location = useLocation();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Derive dynamic breadcrumb based on route
  const getBreadcrumbs = () => {
    const parts = [{ label: activeWorkspace.name, to: '/' }];
    const pathname = location.pathname;

    if (pathname.startsWith('/projects/') && activeProject) {
      parts.push({ label: activeProject.name, to: `/projects/${activeProject.id}` });
    } else if (pathname.startsWith('/projects')) {
      parts.push({ label: 'Projects', to: '/projects' });
    } else if (pathname.startsWith('/tasks')) {
      parts.push({ label: 'Tasks', to: '/tasks' });
    } else if (pathname.startsWith('/kanban')) {
      parts.push({ label: 'Kanban Board', to: '/kanban' });
    } else if (pathname.startsWith('/calendar')) {
      parts.push({ label: 'Calendar', to: '/calendar' });
    } else if (pathname.startsWith('/ai')) {
      parts.push({ label: 'AI Coding Agent', to: '/ai' });
    } else if (pathname.startsWith('/editor')) {
      parts.push({ label: 'Monaco Code Editor', to: '/editor' });
    } else if (pathname.startsWith('/analytics')) {
      parts.push({ label: 'Productivity Analytics', to: '/analytics' });
    } else if (pathname.startsWith('/settings')) {
      parts.push({ label: 'Settings', to: '/settings' });
    } else {
      parts.push({ label: 'Dashboard', to: '/' });
    }

    return parts;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-[60px] border-b border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0E1217]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-40 select-none transition-colors">
      {/* Left Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label + idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors truncate max-w-[150px]"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search trigger (Cmd+K) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 text-xs transition-all w-36 sm:w-56 justify-between group shadow-xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <span className="truncate">Search tasks, code...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-400">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Quick Add Task Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={openCreateTaskModal}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex font-medium text-xs"
        >
          New Task
        </Button>

        {/* AI Copilot Drawer Trigger */}
        <button
          onClick={() => openCopilot()}
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-pink-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all shadow-xs"
          title="Open CodeFlow AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span className="hidden md:inline">Ask AI</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileOpen(false);
            }}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0E1217]" />
            )}
          </button>
          {notificationOpen && <NotificationDropdown onClose={() => setNotificationOpen(false)} />}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
            }}
            aria-label="Open user profile menu"
            className="flex items-center gap-1.5 p-1 rounded-full ring-1 ring-gray-200 dark:ring-white/10 hover:ring-indigo-500 transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="Alex Rivera"
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>
          {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </header>
  );
};
