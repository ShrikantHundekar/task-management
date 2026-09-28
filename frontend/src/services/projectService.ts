import { api } from './api';
import { Project } from '../types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return api.getProjects();
  },

  async getProjectById(id: number): Promise<Project> {
    return api.getProject(id);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    return api.createProject(data);
  },

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    return api.updateProject(id, data);
  },

  async deleteProject(id: number): Promise<{ message: string }> {
    return api.deleteProject(id);
  },
};
