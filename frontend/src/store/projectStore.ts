import { create } from 'zustand';
import { Project } from '../types';
import { projectService } from '../services/projectService';
import { useAppStore } from './useAppStore';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  setActiveProject: (project: Project | null) => void;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: number, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await projectService.getProjects();
      set({ projects, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveProject: (project: Project | null) => {
    set({ activeProject: project });
  },

  createProject: async (data: Partial<Project>) => {
    const newProj = await projectService.createProject(data);
    set((state) => ({ projects: [newProj, ...state.projects] }));
    useAppStore.getState().addToast({
      title: 'Project Created',
      description: `Project "${newProj.name}" has been created successfully.`,
      type: 'success',
    });
    return newProj;
  },

  updateProject: async (id: number, data: Partial<Project>) => {
    const updated = await projectService.updateProject(id, data);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
      activeProject: state.activeProject?.id === id ? updated : state.activeProject,
    }));
    useAppStore.getState().addToast({
      title: 'Project Updated',
      description: `Changes to "${updated.name}" saved.`,
      type: 'info',
    });
    return updated;
  },

  deleteProject: async (id: number) => {
    const proj = get().projects.find((p) => p.id === id);
    await projectService.deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    }));
    useAppStore.getState().addToast({
      title: 'Project Deleted',
      description: proj ? `Deleted project "${proj.name}".` : 'Project deleted.',
      type: 'warning',
    });
  },

  toggleFavorite: async (id: number) => {
    const proj = get().projects.find((p) => p.id === id);
    if (!proj) return;
    const isFav = !proj.is_favorite;
    await get().updateProject(id, { is_favorite: isFav });
  },
}));
