import React from 'react';
import {
  FolderGit2,
  GitPullRequest,
  Kanban,
  ListTodo,
  Activity,
  Layers,
  ShieldCheck,
  Code2,
  Radio
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function DevSidebar() {
  const { projects, activeProject, setActiveProject, activeTab, setActiveTab } = useTasks();

  const coreProjects = projects.filter(p => p.category === 'Core Services');
  const frontendProjects = projects.filter(p => p.category === 'Frontend Apps');
  const infraProjects = projects.filter(p => p.category === 'Infrastructure');

  const navItems = [
    { id: 'Dashboard', label: 'Sprint Kanban', icon: <Kanban size={16} /> },
    { id: 'List', label: 'PR & Issue Specs', icon: <ListTodo size={16} /> },
    { id: 'Overview', label: 'CI/CD Pipelines', icon: <Activity size={16} />, badge: 'LIVE' },
    { id: 'Timeline', label: 'Sprint Milestones', icon: <Layers size={16} /> },
    { id: 'Calendar', label: 'Release Roadmap', icon: <Radio size={16} /> }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-light)',
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      padding: '20px 14px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'sticky',
      top: '64px'
    }}>
      {/* 1. Main Navigation */}
      <div>
        <span style={sectionHeaderStyle}>SPRINT WORKFLOW</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '8px' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--dev-indigo-light)' : 'transparent',
                  color: isActive ? 'var(--dev-indigo)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Repositories Section */}
      <div>
        <span style={sectionHeaderStyle}>REPOSITORIES</span>
        
        {/* Core Services */}
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {projects.map(proj => {
            const isSelected = activeProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setActiveProject(proj)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--bg-subtle)' : 'transparent',
                  color: isSelected ? 'var(--dev-indigo)' : 'var(--text-primary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '12.5px',
                  fontFamily: 'JetBrains Mono, monospace',
                  borderLeft: isSelected ? '3px solid var(--dev-indigo)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: proj.color || '#6366F1',
                    flexShrink: 0
                  }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.repo_name || proj.name}
                  </span>
                </div>

                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  {proj.tasks_count || 4}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Tech Stack Tags */}
      <div>
        <span style={sectionHeaderStyle}>TECH STACKS</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {['Go', 'TypeScript', 'Python', 'Rust', 'PostgreSQL', 'Docker', 'eBPF', 'Kafka'].map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Bottom System Status Box */}
      <div style={{
        marginTop: 'auto',
        padding: '12px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>CLUSTER HEALTH</span>
          <span style={{ color: '#10B981', fontWeight: 700 }}>99.98%</span>
        </div>
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-light)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: '99%', height: '100%', backgroundColor: '#10B981' }} />
        </div>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>US-East K8s cluster • 24 pods</span>
      </div>
    </aside>
  );
}

const sectionHeaderStyle = {
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.8px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase'
};
