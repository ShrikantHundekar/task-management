import {
  Project,
  Task,
  Subtask,
  Comment,
  ActivityLog,
  AnalyticsSummary,
  AIMessage,
  User,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ANALYTICS,
  INITIAL_CONVERSATIONS,
} from './mockData';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

// Local storage keys for resilient offline/standalone operation
const STORAGE_KEYS = {
  TASKS: 'codeflow_tasks',
  PROJECTS: 'codeflow_projects',
  CONVERSATIONS: 'codeflow_conversations',
  TOKEN: 'cf_token',
  USER: 'cf_user',
  GROQ_KEY: 'cf_groq_key',
  SETTINGS: 'cf_settings',
};

// Initialize local store from mock data if empty
function getLocalTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

function saveLocalTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

function getLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
  }
}

function saveLocalProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const groqKey = localStorage.getItem(STORAGE_KEYS.GROQ_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (groqKey) headers['X-Groq-Api-Key'] = groqKey;
  return headers;
}

export const api = {
  // ---------------- AUTH ----------------
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data;
      }
    } catch {
      // Backend not running, use mock response
    }

    const mockUser: User = {
      id: 1,
      email,
      full_name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      role: 'Lead Architect',
      created_at: new Date().toISOString(),
    };
    const mockToken = 'mock_jwt_cf_dev_session_token';
    localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    return { access_token: mockToken, user: mockUser };
  },

  async getMe(): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}

    const cached = localStorage.getItem(STORAGE_KEYS.USER);
    if (cached) return JSON.parse(cached);

    return {
      id: 1,
      email: 'alex.rivera@codeflow.ai',
      full_name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      role: 'Staff Full-Stack Engineer',
      created_at: '2026-01-15T00:00:00Z',
    };
  },

  // ---------------- PROJECTS ----------------
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        saveLocalProjects(data);
        return data;
      }
    } catch {}
    return getLocalProjects();
  },

  async getProject(id: number): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}

    const found = getLocalProjects().find((p) => p.id === id);
    if (found) return found;
    throw new Error('Project not found');
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocalProjects();
        saveLocalProjects([created, ...current]);
        return created;
      }
    } catch {}

    const newProject: Project = {
      id: Date.now(),
      user_id: 1,
      name: data.name || 'Untitled Project',
      description: data.description || '',
      programming_language: data.programming_language || 'TypeScript',
      framework: data.framework || 'React',
      repository_url: data.repository_url || '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tasks_count: 0,
      completed_tasks_count: 0,
      is_favorite: false,
      members_count: 1,
      ...data,
    };

    const current = getLocalProjects();
    saveLocalProjects([newProject, ...current]);
    return newProject;
  },

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocalProjects().map((p) => (p.id === id ? updated : p));
        saveLocalProjects(current);
        return updated;
      }
    } catch {}

    const current = getLocalProjects();
    const updated = current.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p));
    saveLocalProjects(updated);
    return updated.find((p) => p.id === id)!;
  },

  async deleteProject(id: number): Promise<{ message: string }> {
    try {
      await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}

    const current = getLocalProjects().filter((p) => p.id !== id);
    saveLocalProjects(current);
    return { message: 'Project deleted' };
  },

  // ---------------- TASKS ----------------
  async getTasks(params?: { project_id?: number; status?: string; priority?: string; search?: string }): Promise<Task[]> {
    try {
      const query = new URLSearchParams();
      if (params?.project_id) query.append('project_id', String(params.project_id));
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/tasks?${query.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        saveLocalTasks(data);
        return data;
      }
    } catch {}

    let list = getLocalTasks();
    if (params?.project_id) {
      list = list.filter((t) => t.project_id === params.project_id);
    }
    if (params?.status && params.status !== 'all') {
      list = list.filter((t) => t.status === params.status);
    }
    if (params?.priority && params.priority !== 'all') {
      list = list.filter((t) => t.priority === params.priority);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.task_number.toLowerCase().includes(q) ||
          t.labels.some((l) => l.name.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getTask(id: number): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}

    const found = getLocalTasks().find((t) => t.id === id);
    if (found) return found;
    throw new Error('Task not found');
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocalTasks();
        saveLocalTasks([created, ...current]);
        return created;
      }
    } catch {}

    const project = getLocalProjects().find((p) => p.id === (data.project_id || 1));
    const randomNum = Math.floor(100 + Math.random() * 900);
    const prefix = project ? project.name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase() : 'TASK';

    const newTask: Task = {
      id: Date.now(),
      project_id: data.project_id || 1,
      project_name: project ? project.name : 'AI Resume Analyzer',
      task_number: `${prefix}-${randomNum}`,
      title: data.title || 'Untitled Task',
      description: data.description || '',
      acceptance_criteria: data.acceptance_criteria || [],
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      programming_language: data.programming_language || 'Python',
      framework: data.framework || 'FastAPI',
      code_snippet: data.code_snippet || '',
      assignee_name: data.assignee_name || 'Alex Rivera',
      assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      estimated_hours: data.estimated_hours || 4,
      actual_hours: 0,
      due_date: data.due_date || new Date(Date.now() + 86400000 * 2).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtasks: data.subtasks || [
        { id: Date.now() + 1, task_id: Date.now(), title: 'Initial technical research & design', is_completed: false, order: 1 },
        { id: Date.now() + 2, task_id: Date.now(), title: 'Implementation & unit test coverage', is_completed: false, order: 2 },
      ],
      labels: data.labels || [{ id: 1, name: 'Feature', color: '#6366F1' }],
      comments_count: 0,
      ai_assisted: !!data.ai_assisted,
    };

    const current = getLocalTasks();
    saveLocalTasks([newTask, ...current]);
    return newTask;
  },

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocalTasks().map((t) => (t.id === id ? updated : t));
        saveLocalTasks(current);
        return updated;
      }
    } catch {}

    const current = getLocalTasks();
    const updated = current.map((t) => (t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t));
    saveLocalTasks(updated);
    return updated.find((t) => t.id === id)!;
  },

  async deleteTask(id: number): Promise<{ message: string }> {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}

    const current = getLocalTasks().filter((t) => t.id !== id);
    saveLocalTasks(current);
    return { message: 'Task deleted' };
  },

  // ---------------- SUBTASKS ----------------
  async createSubtask(taskId: number, title: string): Promise<Subtask> {
    try {
      const res = await fetch(`${API_BASE}/subtasks/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, is_completed: false }),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newSubtask: Subtask = {
      id: Date.now(),
      task_id: taskId,
      title,
      is_completed: false,
      order: 99,
      created_at: new Date().toISOString(),
    };

    const current = getLocalTasks();
    const updated = current.map((t) => {
      if (t.id === taskId) {
        return { ...t, subtasks: [...t.subtasks, newSubtask] };
      }
      return t;
    });
    saveLocalTasks(updated);
    return newSubtask;
  },

  async updateSubtask(subtaskId: number, data: Partial<Subtask>): Promise<Subtask> {
    try {
      const res = await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    let updatedSubtask: Subtask = { id: subtaskId, task_id: 0, title: '', is_completed: false, order: 0 };
    const current = getLocalTasks();
    const updated = current.map((t) => {
      const st = t.subtasks.find((s) => s.id === subtaskId);
      if (st) {
        updatedSubtask = { ...st, ...data };
        return {
          ...t,
          subtasks: t.subtasks.map((s) => (s.id === subtaskId ? updatedSubtask : s)),
        };
      }
      return t;
    });
    saveLocalTasks(updated);
    return updatedSubtask;
  },

  async deleteSubtask(subtaskId: number): Promise<{ message: string }> {
    try {
      await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}

    const current = getLocalTasks();
    const updated = current.map((t) => ({
      ...t,
      subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
    }));
    saveLocalTasks(updated);
    return { message: 'Subtask deleted' };
  },

  async acceptBatchSubtasks(taskId: number, titles: string[]): Promise<Subtask[]> {
    try {
      const res = await fetch(`${API_BASE}/subtasks/tasks/${taskId}/subtasks/accept-batch`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ subtask_titles: titles }),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newItems: Subtask[] = titles.map((title, idx) => ({
      id: Date.now() + idx,
      task_id: taskId,
      title,
      is_completed: false,
      order: 10 + idx,
      created_at: new Date().toISOString(),
    }));

    const current = getLocalTasks();
    const updated = current.map((t) => {
      if (t.id === taskId) {
        return { ...t, subtasks: [...t.subtasks, ...newItems], ai_assisted: true };
      }
      return t;
    });
    saveLocalTasks(updated);
    return newItems;
  },

  // ---------------- COMMENTS & ACTIVITY ----------------
  async getComments(taskId: number): Promise<Comment[]> {
    return [
      {
        id: 1,
        task_id: taskId,
        user_id: 1,
        author_name: 'Elena Rostova',
        author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        content: 'I verified the edge cases with simulated concurrent clients. Looks solid!',
        created_at: '2 hours ago',
      },
      {
        id: 2,
        task_id: taskId,
        user_id: 2,
        author_name: 'Alex Rivera',
        author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        content: 'Thanks Elena! Added the Redis revocation blacklist check today.',
        created_at: '45 minutes ago',
      },
    ];
  },

  async addComment(taskId: number, content: string): Promise<Comment> {
    return {
      id: Date.now(),
      task_id: taskId,
      user_id: 1,
      author_name: 'Alex Rivera',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      content,
      created_at: 'Just now',
    };
  },

  async getActivityLogs(taskId: number): Promise<ActivityLog[]> {
    return [
      { id: 1, task_id: taskId, user_id: 1, action: 'status_changed', details: 'Moved from Todo to In Progress', created_at: 'Yesterday' },
      { id: 2, task_id: taskId, user_id: 1, action: 'ai_subtasks_generated', details: 'Added 4 AI-generated subtasks via Groq', created_at: '3 hours ago' },
      { id: 3, task_id: taskId, user_id: 1, action: 'subtask_completed', details: 'Marked "Define User and Token Pydantic models" as done', created_at: '1 hour ago' },
    ];
  },

  // ---------------- AI ASSISTANT ----------------
  async runAiAction(data: {
    action: string;
    task_id?: number;
    prompt?: string;
    code_snippet?: string;
    programming_language?: string;
  }): Promise<{ action: string; content: string; structured_data?: any; code_block?: string }> {
    try {
      const res = await fetch(`${API_BASE}/ai/action`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    // Simulated high-fidelity developer response
    await new Promise((r) => setTimeout(r, 600));

    if (data.action === 'subtasks' || data.prompt?.includes('subtasks')) {
      return {
        action: 'subtasks',
        content: 'Here is an actionable implementation breakdown based on software engineering best practices:',
        structured_data: [
          'Design Pydantic schema validation & data transfer objects',
          'Write core business logic with unit test assertions',
          'Implement controller endpoints with OpenAPI documentation',
          'Add rate limiting and edge error handling middleware',
          'Configure integration tests and verify benchmark latency',
        ],
      };
    }

    if (data.action === 'debug' || data.prompt?.startsWith('/debug')) {
      return {
        action: 'debug',
        content: `### CodeFlow AI Debug Analysis
Root cause analysis on the provided code block:
1. **Potential Uncaught Exception**: The caller does not handle \`ExpiredSignatureError\` explicitly.
2. **Missing Algorithm Verification**: Ensure algorithms are pinned to \`["HS256"]\` in \`jwt.decode\` to guard against algorithm substitution attacks.
3. **Recommended Fix**: Use a dedicated try-except block wrapping the decode call.`,
        code_block: `try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
except jwt.ExpiredSignatureError:
    raise HTTPException(status_code=401, detail="Token has expired")
except jwt.JWTError:
    raise credentials_exception`,
      };
    }

    if (data.action === 'test' || data.prompt?.startsWith('/test')) {
      return {
        action: 'test',
        content: 'Here is a complete pytest test suite covering nominal and boundary conditions:',
        code_block: `import pytest
from fastapi.testclient import TestClient

def test_token_creation_and_expiration():
    token = create_access_token({"sub": "developer@codeflow.ai"})
    assert isinstance(token, str)
    assert len(token.split(".")) == 3

def test_expired_token_handling(client: TestClient):
    response = client.get("/api/v1/protected", headers={"Authorization": "Bearer expired_token"})
    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()`,
      };
    }

    return {
      action: data.action,
      content: `CodeFlow AI processed your request for **${data.prompt || 'Code Task'}**:
- Implementation aligns with modular design patterns.
- High performance guaranteed with zero memory leaks.
- Ready to commit or run in the test environment.`,
    };
  },

  async getAiConversations(): Promise<any[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_CONVERSATIONS;
  },

  // ---------------- ANALYTICS ----------------
  async getAnalytics(projectId?: number): Promise<AnalyticsSummary> {
    try {
      const url = projectId ? `${API_BASE}/analytics/summary?project_id=${projectId}` : `${API_BASE}/analytics/summary`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}

    const tasks = getLocalTasks();
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const pending = tasks.filter((t) => t.status === 'todo' || t.status === 'backlog').length;
    const overdue = 1;

    return {
      ...INITIAL_ANALYTICS,
      total_tasks: tasks.length,
      completed_tasks: completed,
      in_progress_tasks: inProgress,
      pending_tasks: pending,
      overdue_tasks: overdue,
      completion_rate: Math.round((completed / (tasks.length || 1)) * 100),
      tasks_by_status: {
        backlog: tasks.filter((t) => t.status === 'backlog').length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        in_progress: tasks.filter((t) => t.status === 'in_progress').length,
        in_review: tasks.filter((t) => t.status === 'in_review').length,
        testing: tasks.filter((t) => t.status === 'testing').length,
        done: completed,
      },
      tasks_by_priority: {
        critical: tasks.filter((t) => t.priority === 'critical').length,
        high: tasks.filter((t) => t.priority === 'high').length,
        medium: tasks.filter((t) => t.priority === 'medium').length,
        low: tasks.filter((t) => t.priority === 'low').length,
      },
    };
  },
};
