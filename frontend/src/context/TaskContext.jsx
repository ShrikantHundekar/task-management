import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext();

const API_BASE = 'http://127.0.0.1:8000/api';

export function TaskProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Kanban'); // 'Dashboard', 'Kanban', 'List', 'Calendar'

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('Web development');
  const [selectedDeadline, setSelectedDeadline] = useState('all');

  // Time Logs
  const [timeLogs, setTimeLogs] = useState([]);

  // Chat & AI
  const [chatMessages, setChatMessages] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState(() => localStorage.getItem('groq_api_key') || '');
  const [groqModel, setGroqModel] = useState(() => localStorage.getItem('groq_model') || 'llama-3.3-70b-versatile');

  const saveGroqApiKey = (key) => {
    setGroqApiKey(key);
    if (key) {
      localStorage.setItem('groq_api_key', key);
    } else {
      localStorage.removeItem('groq_api_key');
    }
  };

  const saveGroqModel = (model) => {
    setGroqModel(model);
    localStorage.setItem('groq_model', model);
  };

  // Helper headers
  const getHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (groqApiKey) {
      headers['X-Groq-Api-Key'] = groqApiKey;
    }
    const token = localStorage.getItem('task_token');
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }, [groqApiKey]);

  // Load projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        if (!activeProject && data.length > 0) {
          const dental = data.find(p => p.name === 'DentalPro') || data[0];
          setActiveProject(dental);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }, [activeProject]);

  // Load tasks for active project
  const fetchTasks = useCallback(async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks/?project=${activeProject.id}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  // Load timelogs
  const fetchTimeLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/timelogs/`);
      if (res.ok) {
        const data = await res.json();
        setTimeLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch timelogs:', err);
    }
  }, []);

  // Load chat messages
  const fetchChatMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat-messages/`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch chat:', err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchTimeLogs();
    fetchChatMessages();
  }, [fetchProjects, fetchTimeLogs, fetchChatMessages]);

  useEffect(() => {
    if (activeProject) {
      fetchTasks();
    }
  }, [activeProject, fetchTasks]);

  // Task CRUD operations
  const addTask = async (taskData) => {
    try {
      const payload = {
        ...taskData,
        project: activeProject ? activeProject.id : 3
      };
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [newTask, ...prev]);
        return { success: true, task: newTask };
      }
      return { success: false };
    } catch (err) {
      console.error('Failed to add task:', err);
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return { success: true, task: updated };
      }
      return { success: false };
    } catch (err) {
      console.error('Failed to update task:', err);
      return { success: false, error: err.message };
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/update_status/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error('Failed to delete task:', err);
      return { success: false, error: err.message };
    }
  };

  const addSubtask = async (taskId, title) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/add_subtask/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const newSub = await res.json();
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              subtasks: [...(t.subtasks || []), newSub]
            };
          }
          return t;
        }));
        return { success: true, subtask: newSub };
      }
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  const toggleSubtask = async (subtaskId) => {
    try {
      const res = await fetch(`${API_BASE}/subtasks/${subtaskId}/toggle/`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        const updatedSub = await res.json();
        setTasks(prev => prev.map(t => {
          if (t.subtasks && t.subtasks.some(s => s.id === subtaskId)) {
            return {
              ...t,
              subtasks: t.subtasks.map(s => s.id === subtaskId ? updatedSub : s)
            };
          }
          return t;
        }));
      }
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  // AI Operations
  const sendChatMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message locally
    const userMsg = {
      id: Date.now(),
      sender_type: 'user',
      sender_name: 'Tom Pelosky',
      sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      message: text,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setAiTyping(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          message: text,
          context: {
            project: activeProject ? activeProject.name : 'DentalPro',
            tasks: tasks.slice(0, 10)
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          id: Date.now() + 1,
          sender_type: 'ai',
          sender_name: 'Groq AI Agent',
          sender_avatar: '',
          message: data.reply,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('AI chat failed:', err);
    } finally {
      setAiTyping(false);
    }
  };

  const decomposeTaskWithAi = async (taskTitle, taskDesc) => {
    try {
      const res = await fetch(`${API_BASE}/ai/decompose/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title: taskTitle, description: taskDesc })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Decompose failed:', err);
    }
    return null;
  };

  const parseTaskWithAi = async (naturalText) => {
    try {
      const res = await fetch(`${API_BASE}/ai/parse-task/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text: naturalText })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Parse task failed:', err);
    }
    return null;
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = (task.description || '').toLowerCase().includes(query);
      const matchAssignee = (task.assignee_name || '').toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  return (
    <TaskContext.Provider value={{
      projects,
      activeProject,
      setActiveProject,
      tasks: filteredTasks,
      allTasksCount: tasks.length,
      loading,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      selectedPriority,
      setSelectedPriority,
      selectedDepartment,
      setSelectedDepartment,
      selectedDeadline,
      setSelectedDeadline,
      addTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      addSubtask,
      toggleSubtask,
      timeLogs,
      chatMessages,
      aiTyping,
      sendChatMessage,
      decomposeTaskWithAi,
      parseTaskWithAi,
      groqApiKey,
      saveGroqApiKey,
      groqModel,
      saveGroqModel,
      fetchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
