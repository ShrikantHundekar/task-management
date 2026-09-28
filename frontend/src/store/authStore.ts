import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  groqKey: string;
  groqModel: string;
  theme: 'dark' | 'light';
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  setGroqKey: (key: string) => void;
  setGroqModel: (model: string) => void;
  toggleTheme: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: 1,
    email: 'alex@codeflow.io',
    full_name: 'Alex Chen',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
  token: localStorage.getItem('cf_token'),
  groqKey: localStorage.getItem('cf_groq_key') || '',
  groqModel: localStorage.getItem('cf_groq_model') || 'llama-3.3-70b-versatile',
  theme: (localStorage.getItem('cf_theme') as 'dark' | 'light') || 'dark',
  isLoading: false,

  login: async (email: string, pass: string) => {
    set({ isLoading: true });
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('cf_token', res.access_token);
      set({ token: res.access_token, user: res.user, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('cf_token');
    set({ token: null, user: null });
  },

  setGroqKey: (key: string) => {
    localStorage.setItem('cf_groq_key', key);
    set({ groqKey: key });
  },

  setGroqModel: (model: string) => {
    localStorage.setItem('cf_groq_model', model);
    set({ groqModel: model });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cf_theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    set({ theme: next });
  },

  initAuth: async () => {
    const theme = (localStorage.getItem('cf_theme') as 'dark' | 'light') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    try {
      const me = await api.getMe();
      set({ user: me });
    } catch {
      // Keep default demo user
    }
  },
}));
