import { api } from './api';
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    return api.login(email, password);
  },

  async getCurrentUser(): Promise<User> {
    return api.getMe();
  },

  logout(): void {
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('cf_token');
  },
};
