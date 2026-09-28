import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskStore } from './store/taskStore';
import { useProjectStore } from './store/projectStore';
import { useAppStore } from './store/useAppStore';

// Master Layout
import { AppLayout } from './layouts/AppLayout';

// Domain Pages
import { DashboardPage } from './pages/Dashboard';
import { TasksPage } from './pages/Tasks';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailsPage } from './pages/ProjectDetails';
import { KanbanPage } from './pages/Kanban';
import { CalendarPage } from './pages/Calendar';
import { AIAgentPage } from './pages/AIAgent';
import { EditorPage } from './pages/Editor';
import { AnalyticsPage } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';
import { LoginPage } from './pages/Login';
import { OnboardingPage } from './pages/Onboarding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  const { fetchTasks } = useTaskStore();
  const { fetchProjects } = useProjectStore();
  const { theme } = useAppStore();

  useEffect(() => {
    // Apply theme class and attribute
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    // Initial domain state hydration
    fetchProjects();
    fetchTasks();
  }, [theme, fetchProjects, fetchTasks]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Core Authenticated App Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailsPage />} />
            <Route path="kanban" element={<KanbanPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="ai" element={<AIAgentPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
