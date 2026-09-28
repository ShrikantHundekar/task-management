import { create } from 'zustand';
import { Workspace, AppNotification } from '../types';
import { INITIAL_WORKSPACES, INITIAL_NOTIFICATIONS } from '../services/mockData';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Modals & Drawers
  copilotOpen: boolean;
  copilotContext?: { prompt?: string; codeSnippet?: string; taskId?: number };
  openCopilot: (context?: { prompt?: string; codeSnippet?: string; taskId?: number }) => void;
  closeCopilot: () => void;

  createTaskModalOpen: boolean;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;

  createProjectModalOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;

  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (workspace: Workspace) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const initialTheme = (localStorage.getItem('app-theme') as 'dark' | 'light') || 'dark';

  return {
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    theme: initialTheme,
    toggleTheme: () => {
      const next = get().theme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('app-theme', next);
      set({ theme: next });
    },
    setTheme: (theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('app-theme', theme);
      set({ theme });
    },

    commandPaletteOpen: false,
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

    copilotOpen: false,
    copilotContext: undefined,
    openCopilot: (context) => set({ copilotOpen: true, copilotContext: context }),
    closeCopilot: () => set({ copilotOpen: false, copilotContext: undefined }),

    createTaskModalOpen: false,
    openCreateTaskModal: () => set({ createTaskModalOpen: true }),
    closeCreateTaskModal: () => set({ createTaskModalOpen: false }),

    createProjectModalOpen: false,
    openCreateProjectModal: () => set({ createProjectModalOpen: true }),
    closeCreateProjectModal: () => set({ createProjectModalOpen: false }),

    workspaces: INITIAL_WORKSPACES,
    activeWorkspace: INITIAL_WORKSPACES[0],
    setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),

    notifications: INITIAL_NOTIFICATIONS,
    markNotificationAsRead: (id) =>
      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      })),
    markAllNotificationsRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),

    toasts: [],
    addToast: (toast) => {
      const id = 'toast-' + Date.now() + Math.random().toString(36).slice(2, 6);
      const newToast: ToastItem = { ...toast, id };
      set((s) => ({ toasts: [...s.toasts, newToast] }));
      setTimeout(() => {
        get().removeToast(id);
      }, 3500);
    },
    removeToast: (id) =>
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      })),
  };
});
