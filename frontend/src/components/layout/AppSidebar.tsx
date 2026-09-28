import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  Kanban,
  Calendar,
  Sparkles,
  BarChart3,
  Code2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useProjectStore } from '../../store/projectStore';
import { Logo } from '../ui/Logo';
import { cn } from '../../lib/utils';

export const AppSidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    openCreateProjectModal,
    setCommandPaletteOpen,
  } = useAppStore();

  const { projects } = useProjectStore();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'My Tasks', to: '/tasks', icon: CheckSquare },
    { label: 'Projects', to: '/projects', icon: FolderGit2 },
    { label: 'Kanban', to: '/kanban', icon: Kanban },
    { label: 'Calendar', to: '/calendar', icon: Calendar },
    { label: 'AI Agent', to: '/ai', icon: Sparkles, badge: 'Groq' },
    { label: 'Code Editor', to: '/editor', icon: Code2, badge: 'Monaco' },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative shrink-0 flex flex-col h-[calc(100vh-60px)] border-r border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0E1217]/95 backdrop-blur-md select-none z-30 transition-colors"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200/60 dark:border-white/5">
        <NavLink to="/" className="flex items-center min-w-0 overflow-hidden">
          <Logo size="sm" showText={!sidebarCollapsed} />
        </NavLink>
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          title={sidebarCollapsed ? 'Expand (Ctrl+[)' : 'Collapse (Ctrl+[)'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-5">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400 font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/70 dark:hover:bg-white/5'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 tracking-tight">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    {item.badge}
                  </span>
                )}
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-500" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Workspaces Section */}
        {!sidebarCollapsed ? (
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500 font-mono">
                Workspaces
              </span>
            </div>
            <div className="space-y-0.5">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => setActiveWorkspace(ws)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors',
                    activeWorkspace.id === ws.id
                      ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ws.color }} />
                    <span className="truncate">{ws.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                    {ws.projectsCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200/50 dark:border-white/5 pt-2 flex flex-col items-center gap-2">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspace(ws)}
                title={`Workspace: ${ws.name}`}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                  activeWorkspace.id === ws.id ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
                )}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ws.color }} />
              </button>
            ))}
          </div>
        )}

        {/* Projects Quick Access */}
        {!sidebarCollapsed && (
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500 font-mono">
                Projects
              </span>
              <button
                onClick={openCreateProjectModal}
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition-colors"
                title="New Project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.slice(0, 5).map((project) => (
                <NavLink
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors truncate',
                      isActive
                        ? 'bg-indigo-50/80 dark:bg-white/10 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                    )
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="truncate">{project.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User & Settings Area */}
      <div className="p-3 border-t border-gray-200/60 dark:border-white/10 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
              isActive
                ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
            )
          }
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          {!sidebarCollapsed && <span className="truncate">Settings</span>}
        </NavLink>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          title="Command Palette (Ctrl+K)"
        >
          <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Shortcuts</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-500">
                ⌘K
              </kbd>
            </div>
          )}
        </button>

        {/* Profile Card */}
        <div
          className={cn(
            'flex items-center gap-2.5 pt-2 mt-1 border-t border-gray-100 dark:border-white/5',
            sidebarCollapsed ? 'justify-center' : 'px-2'
          )}
        >
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="Alex Rivera"
              className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0E1217]" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">Alex Rivera</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Staff Full-Stack Eng</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
