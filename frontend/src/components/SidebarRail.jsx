import React from 'react';
import {
  Home,
  Bell,
  MessageSquare,
  FolderKanban,
  Users,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SidebarRail({ onOpenSettings, onOpenAiQuick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside style={{
      width: '68px',
      height: '100vh',
      backgroundColor: 'var(--bg-sidebar-rail)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0
    }}>
      {/* Top User Avatar */}
      <div style={{ position: 'relative', marginBottom: '28px', cursor: 'pointer' }}>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
          alt="Profile"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--accent-purple)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '10px',
          height: '10px',
          backgroundColor: '#10B981',
          borderRadius: '50%',
          border: '2px solid var(--bg-sidebar-rail)'
        }} />
      </div>

      {/* Navigation Icons */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        flex: 1
      }}>
        {/* Home */}
        <button
          title="Overview"
          style={railBtnStyle(false)}
        >
          <Home size={20} />
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          style={railBtnStyle(false)}
        >
          <div style={{ position: 'relative' }}>
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              backgroundColor: '#EF4444',
              borderRadius: '50%'
            }} />
          </div>
        </button>

        {/* Messages */}
        <button
          title="Messages"
          style={railBtnStyle(false)}
        >
          <MessageSquare size={20} />
        </button>

        {/* Active Projects Folder (Active) */}
        <button
          title="Projects Board"
          style={{
            ...railBtnStyle(true),
            backgroundColor: 'var(--accent-purple-light)',
            color: 'var(--accent-purple)',
            borderRadius: '14px',
            padding: '10px'
          }}
        >
          <div style={{ position: 'relative' }}>
            <FolderKanban size={22} />
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-8px',
              backgroundColor: '#FF6B6B',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 700,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>2</span>
          </div>
        </button>

        {/* Team */}
        <button
          title="Team Members"
          style={railBtnStyle(false)}
        >
          <Users size={20} />
        </button>

        {/* Analytics */}
        <button
          title="Analytics"
          style={railBtnStyle(false)}
        >
          <BarChart3 size={20} />
        </button>

        {/* AI Quick Task */}
        <button
          onClick={onOpenAiQuick}
          title="AI Task Planner (Groq)"
          style={{
            ...railBtnStyle(false),
            background: 'linear-gradient(135deg, rgba(112, 89, 226, 0.15), rgba(255, 138, 72, 0.15))',
            color: 'var(--accent-purple)',
            borderRadius: '12px'
          }}
        >
          <Sparkles size={20} />
        </button>
      </nav>

      {/* Bottom Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-light)',
        width: '100%'
      }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            ...railBtnStyle(false),
            color: theme === 'light' ? '#F59E0B' : '#60A5FA'
          }}
        >
          {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Settings & Groq API Key"
          style={railBtnStyle(false)}
        >
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
}

function railBtnStyle(active) {
  return {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
  };
}
