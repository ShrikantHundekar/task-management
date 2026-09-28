import { create } from 'zustand';
import { AIMessage, Task } from '../types';
import { api } from '../services/api';

interface CopilotState {
  isOpen: boolean;
  activeTaskId: number | null;
  messages: AIMessage[];
  isThinking: boolean;
  thinkingAction: string | null;
  activeModal: 'subtasks' | 'review' | 'debug' | 'estimate' | 'createTask' | 'createProject' | null;
  modalData: any;

  openCopilot: (taskId?: number) => void;
  closeCopilot: () => void;
  toggleCopilot: () => void;
  setThinking: (thinking: boolean, action?: string) => void;
  fetchConversation: (taskId?: number) => Promise<void>;
  sendMessage: (prompt: string, task?: Task | null) => Promise<void>;
  runTaskAction: (action: string, task: Task, extra?: any) => Promise<any>;
  openModal: (modal: 'subtasks' | 'review' | 'debug' | 'estimate' | 'createTask' | 'createProject', data?: any) => void;
  closeModal: () => void;
  clearMessages: () => void;
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  isOpen: false,
  activeTaskId: null,
  messages: [
    {
      role: 'assistant',
      content: "Hello Alex! I am **CodeFlow AI Copilot**, powered by Groq LLaMA 3.3. I can explain complex logic, break tasks into actionable subtasks, debug stack traces, review code, and generate unit tests. How can I assist your sprint today?",
      created_at: new Date().toISOString(),
    },
  ],
  isThinking: false,
  thinkingAction: null,
  activeModal: null,
  modalData: null,

  openCopilot: (taskId?: number) => {
    set({ isOpen: true, activeTaskId: taskId ?? get().activeTaskId });
    if (taskId) {
      get().fetchConversation(taskId);
    }
  },

  closeCopilot: () => set({ isOpen: false }),
  toggleCopilot: () => set((state) => ({ isOpen: !state.isOpen })),

  setThinking: (thinking: boolean, action?: string) => {
    set({ isThinking: thinking, thinkingAction: action ?? null });
  },

  fetchConversation: async (taskId?: number) => {
    try {
      const msgs = await api.getAiConversation(taskId);
      if (msgs && msgs.length > 0) {
        set({ messages: msgs });
      }
    } catch {
      // Keep existing
    }
  },

  sendMessage: async (prompt: string, task?: Task | null) => {
    const userMsg: AIMessage = {
      role: 'user',
      content: prompt,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isThinking: true,
      thinkingAction: 'Processing reasoning request...',
    }));

    try {
      const res = await api.runAiAction({
        action: 'chat',
        task_id: task?.id || get().activeTaskId || undefined,
        prompt,
        code_snippet: task?.code_snippet,
        programming_language: task?.programming_language,
      });

      const assistantMsg: AIMessage = {
        role: 'assistant',
        content: res.content,
        action_type: res.action,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isThinking: false,
        thinkingAction: null,
      }));
    } catch (err: any) {
      const errorMsg: AIMessage = {
        role: 'assistant',
        content: `Error communicating with AI agent: ${err.message || 'Check your Groq API key in Settings.'}`,
        created_at: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isThinking: false,
        thinkingAction: null,
      }));
    }
  },

  runTaskAction: async (action: string, task: Task, extra?: any) => {
    set({ isThinking: true, thinkingAction: `Executing ${action}...` });
    try {
      const res = await api.runAiAction({
        action,
        task_id: task.id,
        prompt: extra?.prompt,
        code_snippet: extra?.code_snippet || task.code_snippet,
        programming_language: extra?.programming_language || task.programming_language,
        error_message: extra?.error_message,
      });

      set({ isThinking: false, thinkingAction: null });
      return res;
    } catch (err: any) {
      set({ isThinking: false, thinkingAction: null });
      throw err;
    }
  },

  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  clearMessages: () => set({ messages: [] }),
}));
