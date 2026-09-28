import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { AppSidebar } from '../components/layout/AppSidebar';
import { CommandPalette } from '../components/layout/CommandPalette';
import { ToastContainer } from '../components/ui/ToastContainer';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';
import { AICopilotDrawer } from '../components/ai/AICopilotDrawer';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#0B0D10] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-150">
      {/* 1. Global Top Navbar */}
      <AppNavbar />

      {/* 2. Main Body with Sidebar + Routed Outlet */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Navigation Sidebar */}
        <AppSidebar />

        {/* Routed Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFD]/60 dark:bg-[#0B0D10]/95">
          <Outlet />
        </main>
      </div>

      {/* 3. Global Slide-Over Panels & Modals */}
      <TaskDetailsDrawer />
      <AICopilotDrawer />
      <CommandPalette />
      <CreateTaskModal />
      <CreateProjectModal />
      <ToastContainer />
    </div>
  );
};
