import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Plus,
  Circle,
  GitBranch,
  Terminal,
  Code2
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TreeWorkspaceSidebar({ onAddNewRepo }) {
  const { projects, activeProject, setActiveProject, tasks } = useTasks();

  const [expandedFolders, setExpandedFolders] = useState({
    'Core Services': true,
    'Frontend Web Apps': true,
    'Infrastructure': true
  });

  const toggleFolder = (name) => {
    setExpandedFolders(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const categories = [
    { id: 'backlog', label: 'To Do', color: 'var(--cat-todo)', count: tasks.filter(t => t.status === 'backlog').length },
    { id: 'in_dev', label: 'In Progres', color: 'var(--cat-inprog)', count: tasks.filter(t => t.status === 'in_dev').length },
    { id: 'code_review', label: 'Review', color: 'var(--cat-review)', count: tasks.filter(t => t.status === 'code_review').length },
    { id: 'done', label: 'Completed', color: 'var(--cat-done)', count: tasks.filter(t => t.status === 'done').length },
  ];

  const onlineEngineers = [
    { name: 'Alex Chen', role: 'Staff SRE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sarah Jenkins', role: 'Database Architect', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { name: 'Elena Rostova', role: 'DevOps Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
  ];

  return (
    <aside style={{
      width: '230px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-light)',
      height: '100vh',
      overflowY: 'auto',
      padding: '20px 14px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      position: 'sticky',
      top: 0
    }}>
      {/* 1. Workspace Switcher Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 4px',
        cursor: 'pointer'
      }}>
        <div>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
            Team Workspace
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            hyperion.cloud.org
          </span>
        </div>
        <ChevronDown size={15} color="var(--text-muted)" />
      </div>

      {/* 2. Project & Companies (Tree Structure) */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          padding: '0 4px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Project & Companies
          </span>
          <button
            onClick={onAddNewRepo}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '2px'
            }}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Tree List with indentation branches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Static Folder 1 */}
          <div style={treeFolderRow}>
            <Folder size={14} color="#64748B" />
            <span>Architecture RFCs</span>
          </div>

          {/* Static Folder 2 */}
          <div style={treeFolderRow}>
            <Folder size={14} color="#64748B" />
            <span>Mobile SDK Client</span>
          </div>

          {/* Expandable Folder: Core Services / Repositories */}
          <div>
            <div
              onClick={() => toggleFolder('Core Services')}
              style={{
                ...treeFolderRow,
                color: 'var(--text-primary)',
                fontWeight: 600,
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {expandedFolders['Core Services'] ? <FolderOpen size={15} color="var(--primary)" /> : <Folder size={15} color="var(--primary)" />}
                <span>Microservices</span>
              </div>
              <ChevronDown
                size={13}
                style={{
                  color: 'var(--text-muted)',
                  transform: expandedFolders['Core Services'] ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.15s ease'
                }}
              />
            </div>

            {/* Tree Branch Children */}
            {expandedFolders['Core Services'] && (
              <div style={{
                position: 'relative',
                paddingLeft: '22px',
                marginLeft: '8px',
                borderLeft: '1.5px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: '3px',
                marginBottom: '4px'
              }}>
                {projects.map(proj => {
                  const isSelected = activeProject?.id === proj.id;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => setActiveProject(proj)}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--bg-subtle)' : 'transparent',
                        color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '12px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Tree branch horizontal connector line */}
                      <span style={{
                        position: 'absolute',
                        left: '-22px',
                        top: '50%',
                        width: '14px',
                        height: '1.5px',
                        backgroundColor: 'var(--border-light)'
                      }} />

                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'var(--primary)' : 'rgba(99, 102, 241, 0.15)',
                        color: isSelected ? '#FFFFFF' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Code2 size={10} />
                      </div>

                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {proj.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* More items */}
          <div style={treeFolderRow}>
            <Folder size={14} color="#64748B" />
            <span>DevOps & Docker</span>
          </div>
          <div style={treeFolderRow}>
            <Folder size={14} color="#64748B" />
            <span>Security Audits</span>
          </div>
        </div>
      </div>

      {/* 3. Categories with colored dots matching Screenshot 1 */}
      <div>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 4px' }}>
          Categories
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: cat.color
                }} />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {cat.label}
                </span>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Message / Team Online list */}
      <div style={{ marginTop: 'auto' }}>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 4px' }}>
          Engineers Online
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {onlineEngineers.map((eng, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={eng.avatar}
                  alt={eng.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '1.5px solid var(--bg-sidebar)'
                }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.2' }}>
                  {eng.name}
                </span>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {eng.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

const treeFolderRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 8px',
  borderRadius: '6px',
  fontSize: '12.5px',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'background 0.15s ease'
};
