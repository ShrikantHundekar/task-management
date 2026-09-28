import React from 'react';
import { Bell, MessageSquare, Plus, ChevronDown, Terminal } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function ProjectTopHeader({ onOpenNewTask }) {
  const { activeProject } = useTasks();

  const members = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* 1. Breadcrumb & User Profile Top Row matching Screenshot 1 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '20px'
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span>Project</span>
          <span>&gt;</span>
          <span>{activeProject?.category || 'Core Services'}</span>
          <span>&gt;</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {activeProject?.repo_name || activeProject?.name}
          </span>
        </div>

        {/* Right Notification & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Bell */}
          <button style={topIconBtn} title="Notifications">
            <div style={{ position: 'relative' }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '7px',
                height: '7px',
                backgroundColor: '#EF4444',
                borderRadius: '50%'
              }} />
            </div>
          </button>

          {/* Message */}
          <button style={topIconBtn} title="Messages">
            <MessageSquare size={18} />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-light)' }} />

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="Alex Chen"
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Alex Chen</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>alex@codeforge.io</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Project Header Banner Row matching Screenshot 1 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Project Title & Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <Terminal size={22} strokeWidth={2.5} />
          </div>

          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.3px'
            }}>
              {activeProject?.name || 'Hyperion Cloud Engine'}
            </h1>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              repo: {activeProject?.repo_name || 'hyperion/core-engine'} • branch: {activeProject?.branch || 'main'}
            </span>
          </div>
        </div>

        {/* Member Avatars Stack & "+ New Task" Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {members.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Member"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: i === 0 ? 0 : '-8px',
                  border: '2px solid var(--bg-card)',
                  zIndex: members.length - i
                }}
              />
            ))}
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '2px solid var(--bg-card)',
              marginLeft: '-8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-secondary)'
            }}>
              +9
            </div>
          </div>

          <button
            onClick={() => onOpenNewTask('backlog')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const topIconBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: '6px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
