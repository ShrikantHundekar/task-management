import React from 'react';
import { Plus, GitPullRequest, Terminal, CheckCircle2, FlaskConical, Archive } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';

export default function KanbanBoard({ onEditTask, onDecomposeTask, onAddNewToColumn }) {
  const { tasks } = useTasks();

  const columns = [
    { id: 'backlog', title: 'Backlog / Triage', icon: <Archive size={14} color="#64748B" />, borderTop: '#64748B' },
    { id: 'in_dev', title: 'In Development', icon: <Terminal size={14} color="#6366F1" />, borderTop: '#6366F1' },
    { id: 'code_review', title: 'Code Review / PR', icon: <GitPullRequest size={14} color="#F59E0B" />, borderTop: '#F59E0B' },
    { id: 'testing', title: 'CI/CD & Testing', icon: <FlaskConical size={14} color="#06B6D4" />, borderTop: '#06B6D4' },
    { id: 'done', title: 'Deployed / Done', icon: <CheckCircle2 size={14} color="#10B981" />, borderTop: '#10B981' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '16px',
      alignItems: 'start'
    }}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minWidth: 0,
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '16px',
              padding: '12px',
              borderTop: `3px solid ${col.borderTop}`,
              border: '1px solid var(--border-light)'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2px 4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {col.icon}
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {col.title}
                </h3>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Plus Button */}
              <button
                onClick={() => onAddNewToColumn(col.id)}
                title={`Add task to ${col.title}`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Column Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '140px'
            }}>
              {colTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDecompose={onDecomposeTask}
                />
              ))}

              {colTasks.length === 0 && (
                <div style={{
                  border: '2px dashed var(--border-light)',
                  borderRadius: '12px',
                  padding: '24px 12px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  // Empty queue
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
