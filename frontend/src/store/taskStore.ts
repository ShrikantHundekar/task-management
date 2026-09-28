import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority, Subtask } from '../types';
import { taskService } from '../services/taskService';
import { useAppStore } from './useAppStore';

interface TaskState {
  tasks: Task[];
  activeTask: Task | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  filterStatus: string;
  filterPriority: string;
  filterProjectId: number | 'all';
  searchQuery: string;

  fetchTasks: (projectId?: number) => Promise<void>;
  setActiveTask: (task: Task | null) => void;
  openTaskDrawer: (task: Task) => void;
  closeTaskDrawer: () => void;
  loadTaskById: (id: number) => Promise<Task>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: number, data: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (id: number, status: TaskStatus) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;

  // Subtasks
  toggleSubtask: (taskId: number, subtaskId: number, isCompleted: boolean) => Promise<void>;
  addSubtask: (taskId: number, title: string) => Promise<Subtask>;
  deleteSubtask: (taskId: number, subtaskId: number) => Promise<void>;
  acceptBatchSubtasks: (taskId: number, titles: string[]) => Promise<void>;

  // Filters
  setFilterStatus: (status: string) => void;
  setFilterPriority: (priority: string) => void;
  setFilterProjectId: (id: number | 'all') => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  activeTask: null,
  isDrawerOpen: false,
  isLoading: false,
  filterStatus: 'all',
  filterPriority: 'all',
  filterProjectId: 'all',
  searchQuery: '',

  fetchTasks: async (projectId?: number) => {
    set({ isLoading: true });
    try {
      const pid = projectId ?? (get().filterProjectId !== 'all' ? (get().filterProjectId as number) : undefined);
      const tasks = await taskService.getTasks({
        project_id: pid,
        status: get().filterStatus !== 'all' ? get().filterStatus : undefined,
        priority: get().filterPriority !== 'all' ? get().filterPriority : undefined,
        search: get().searchQuery || undefined,
      });
      set({ tasks, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveTask: (task: Task | null) => {
    set({ activeTask: task });
  },

  openTaskDrawer: (task: Task) => {
    set({ activeTask: task, isDrawerOpen: true });
  },

  closeTaskDrawer: () => {
    set({ isDrawerOpen: false, activeTask: null });
  },

  loadTaskById: async (id: number) => {
    const task = await taskService.getTaskById(id);
    set({ activeTask: task });
    return task;
  },

  createTask: async (data: Partial<Task>) => {
    const newTask = await taskService.createTask(data);
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    useAppStore.getState().addToast({
      title: 'Task Created',
      description: `"${newTask.title}" added to ${newTask.project_name || 'project'}.`,
      type: 'success',
    });
    return newTask;
  },

  updateTask: async (id: number, data: Partial<Task>) => {
    const updated = await taskService.updateTask(id, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      activeTask: state.activeTask?.id === id ? updated : state.activeTask,
    }));
    useAppStore.getState().addToast({
      title: 'Task Updated',
      description: `Saved changes to "${updated.title}".`,
      type: 'info',
    });
    return updated;
  },

  updateTaskStatus: async (id: number, status: TaskStatus) => {
    const prev = get().tasks.find((t) => t.id === id);
    if (!prev || prev.status === status) return;

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      activeTask: state.activeTask?.id === id ? { ...state.activeTask, status } : state.activeTask,
    }));

    useAppStore.getState().addToast({
      title: 'Status Updated',
      description: `Moved to ${status.replace('_', ' ').toUpperCase()}`,
      type: 'success',
    });

    try {
      await taskService.updateStatus(id, status);
    } catch (e) {
      get().fetchTasks();
    }
  },

  deleteTask: async (id: number) => {
    const taskToDelete = get().tasks.find((t) => t.id === id);
    await taskService.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      activeTask: state.activeTask?.id === id ? null : state.activeTask,
      isDrawerOpen: state.activeTask?.id === id ? false : state.isDrawerOpen,
    }));
    useAppStore.getState().addToast({
      title: 'Task Deleted',
      description: taskToDelete ? `Deleted "${taskToDelete.title}"` : 'Task removed.',
      type: 'warning',
    });
  },

  toggleSubtask: async (taskId: number, subtaskId: number, isCompleted: boolean) => {
    set((state) => {
      const updateList = (list: Task[]) =>
        list.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, is_completed: isCompleted } : st)),
          };
        });

      return {
        tasks: updateList(state.tasks),
        activeTask:
          state.activeTask?.id === taskId
            ? {
                ...state.activeTask,
                subtasks: state.activeTask.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, is_completed: isCompleted } : st
                ),
              }
            : state.activeTask,
      };
    });

    await taskService.updateSubtask(subtaskId, { is_completed: isCompleted });
  },

  addSubtask: async (taskId: number, title: string) => {
    const subtask = await taskService.createSubtask(taskId, title);
    set((state) => {
      const updateList = (list: Task[]) =>
        list.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, subtask] } : t));
      return {
        tasks: updateList(state.tasks),
        activeTask:
          state.activeTask?.id === taskId
            ? { ...state.activeTask, subtasks: [...state.activeTask.subtasks, subtask] }
            : state.activeTask,
      };
    });
    return subtask;
  },

  deleteSubtask: async (taskId: number, subtaskId: number) => {
    await taskService.deleteSubtask(subtaskId);
    set((state) => {
      const updateList = (list: Task[]) =>
        list.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) } : t));
      return {
        tasks: updateList(state.tasks),
        activeTask:
          state.activeTask?.id === taskId
            ? { ...state.activeTask, subtasks: state.activeTask.subtasks.filter((s) => s.id !== subtaskId) }
            : state.activeTask,
      };
    });
  },

  acceptBatchSubtasks: async (taskId: number, titles: string[]) => {
    const newSubtasks = await taskService.acceptBatchSubtasks(taskId, titles);
    set((state) => {
      const updateList = (list: Task[]) =>
        list.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...newSubtasks], ai_assisted: true } : t));
      return {
        tasks: updateList(state.tasks),
        activeTask:
          state.activeTask?.id === taskId
            ? { ...state.activeTask, subtasks: [...state.activeTask.subtasks, ...newSubtasks], ai_assisted: true }
            : state.activeTask,
      };
    });
    useAppStore.getState().addToast({
      title: 'Subtasks Added',
      description: `Accepted ${titles.length} AI-generated subtasks.`,
      type: 'success',
    });
  },

  setFilterStatus: (status: string) => {
    set({ filterStatus: status });
    get().fetchTasks();
  },

  setFilterPriority: (priority: string) => {
    set({ filterPriority: priority });
    get().fetchTasks();
  },

  setFilterProjectId: (id: number | 'all') => {
    set({ filterProjectId: id });
    get().fetchTasks();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchTasks();
  },
}));
