import React from 'react';
import {
  Terminal,
  GitBranch,
  GitPullRequest,
  Search,
  Sparkles,
  Plus,
  Moon,
  Sun,
  Settings,
  CheckCircle2,
  Cpu,
  Flame
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

export default function DevNavbar({ onOpenNewTask, onOpenAiQuick, onOpenSettings }) {
  const { activeProject, projects, setActiveProject, searchQuery, setSearchQuery } = useTasks();
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left: Brand & Repository Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <Terminal size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
                CodePulse
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: 'var(--dev-indigo-light)',
                color: 'var(--dev-indigo)',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                DEV OS
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sprint & Engineering Hub</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }} />

        {/* Repo Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const selected = projects.find(p => p.id === parseInt(e.target.value));
              if (selected) setActiveProject(selected);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.repo_name || p.name}
              </option>
            ))}
          </select>

          {/* Active Git Branch Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '11.5px',
            fontFamily: 'JetBrains Mono, monospace',
            border: '1px solid var(--border-subtle)'
          }}>
            <GitBranch size={13} color="var(--dev-indigo)" />
            <span>{activeProject?.branch || 'main'}</span>
          </div>

          {/* CI/CD Passing Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'var(--dev-emerald-light)',
            color: '#047857',
            fontSize: '11.5px',
            fontWeight: 600
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block'
            }} className="neon-green-glow" />
            <span>CI: Passing</span>
          </div>
        </div>
      </div>

      {/* Center: Command Palette Search */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '320px'
      }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search PRs, branch, or issues... (Ctrl + K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 14px 8px 36px',
            borderRadius: '10px',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <span style={{
          position: 'absolute',
          right: '10px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-subtle)',
          padding: '2px 5px',
          borderRadius: '4px',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          /
        </span>
      </div>

      {/* Right: Actions, AI Copilot, Theme, and Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Groq AI Copilot Button */}
        <button
          onClick={onOpenAiQuick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 15px',
            borderRadius: '9999px',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.12))',
            color: 'var(--dev-indigo)',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Open Groq AI Developer Copilot"
        >
          <Sparkles size={14} />
          <span>Dev Copilot</span>
        </button>

        {/* Add Issue / PR Button */}
        <button
          onClick={onOpenNewTask}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--dev-indigo)',
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Plus size={15} />
          <span>New Task / PR</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={iconBtnStyle}
        >
          {theme === 'light' ? <Moon size={18} color="#64748B" /> : <Sun size={18} color="#FBBF24" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Groq API & Repo Settings"
          style={iconBtnStyle}
        >
          <Settings size={18} color="var(--text-secondary)" />
        </button>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
            alt="Alex Chen"
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--dev-indigo)' }}
          />
        </div>
      </div>
    </header>
  );
}

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s ease'
};
