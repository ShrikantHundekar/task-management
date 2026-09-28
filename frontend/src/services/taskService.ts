import { api } from './api';
import { Task, Subtask, Comment, ActivityLog, TaskStatus } from '../types';

export const taskService = {
  async getTasks(params?: { project_id?: number; status?: string; priority?: string; search?: string }): Promise<Task[]> {
    return api.getTasks(params);
  },

  async getTaskById(id: number): Promise<Task> {
    return api.getTask(id);
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    return api.createTask(data);
  },

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return api.updateTask(id, data);
  },

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    return api.updateTask(id, { status });
  },

  async deleteTask(id: number): Promise<{ message: string }> {
    return api.deleteTask(id);
  },

  // Subtasks
  async createSubtask(taskId: number, title: string): Promise<Subtask> {
    return api.createSubtask(taskId, title);
  },

  async updateSubtask(subtaskId: number, data: Partial<Subtask>): Promise<Subtask> {
    return api.updateSubtask(subtaskId, data);
  },

  async deleteSubtask(subtaskId: number): Promise<{ message: string }> {
    return api.deleteSubtask(subtaskId);
  },

  async acceptBatchSubtasks(taskId: number, titles: string[]): Promise<Subtask[]> {
    return api.acceptBatchSubtasks(taskId, titles);
  },

  // Comments & Activity
  async getComments(taskId: number): Promise<Comment[]> {
    return api.getComments(taskId);
  },

  async addComment(taskId: number, content: string): Promise<Comment> {
    return api.addComment(taskId, content);
  },

  async getActivityLogs(taskId: number): Promise<ActivityLog[]> {
    return api.getActivityLogs(taskId);
  },
};
