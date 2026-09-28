import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = 'http://127.0.0.1:8000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('task_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'demo_user',
      first_name: 'Tom',
      last_name: 'Pelosky',
      email: 'tom@ronasit.com'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('task_token') || '');

  useEffect(() => {
    if (user) {
      localStorage.setItem('task_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('task_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('task_token', data.token);
        return { success: true };
      }
      return { success: false, error: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('task_token');
    localStorage.removeItem('task_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
