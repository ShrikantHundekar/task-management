import React from 'react';
import {
  Layers,
  LayoutDashboard,
  Kanban,
  FileCode2,
  Users,
  Settings,
  Sparkles,
  Sun,
  Moon,
  HelpCircle,
  Headphones
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

export default function SlimIconRail({ onToggleCopilot, onOpenSettings }) {
  const { activeTab, setActiveTab } = useTasks();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside style={{
      width: '64px',
      backgroundColor: 'var(--bg-rail)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0
    }}>
      {/* Top Brand Logo matching Screenshot 1 */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        marginBottom: '28px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      {/* Navigation Icons */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        flex: 1
      }}>
        {/* Dashboard Overview */}
        <button
          onClick={() => setActiveTab('Dashboard')}
          title="Dashboard Overview"
          style={railBtnStyle(activeTab === 'Dashboard')}
        >
          <LayoutDashboard size={20} />
        </button>

        {/* Kanban Board */}
        <button
          onClick={() => setActiveTab('Kanban')}
          title="Sprint Kanban Board"
          style={railBtnStyle(activeTab === 'Kanban')}
        >
          <Kanban size={20} />
        </button>

        {/* List & Code Specs */}
        <button
          onClick={() => setActiveTab('List')}
          title="List & Issues"
          style={railBtnStyle(activeTab === 'List')}
        >
          <FileCode2 size={20} />
        </button>

        {/* Team Members */}
        <button
          onClick={() => setActiveTab('Team')}
          title="Engineers Team"
          style={railBtnStyle(activeTab === 'Team')}
        >
          <Users size={20} />
        </button>

        {/* Groq Dev Copilot Trigger */}
        <button
          onClick={onToggleCopilot}
          title="Groq AI Dev Copilot"
          style={{
            ...railBtnStyle(false),
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(6, 182, 212, 0.12))',
            color: 'var(--primary)',
            borderRadius: '10px'
          }}
        >
          <Sparkles size={19} />
        </button>
      </nav>

      {/* Bottom Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-light)',
        width: '100%'
      }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            ...railBtnStyle(false),
            color: theme === 'light' ? '#64748B' : '#FBBF24'
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & Groq API Key"
          style={railBtnStyle(false)}
        >
          <Settings size={18} />
        </button>

        {/* Help / Info */}
        <button
          title="Help Center"
          style={railBtnStyle(false)}
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </aside>
  );
}

function railBtnStyle(active) {
  return {
    background: active ? 'var(--primary-light)' : 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '9px',
    borderRadius: '10px',
    transition: 'all 0.15s ease'
  };
}
