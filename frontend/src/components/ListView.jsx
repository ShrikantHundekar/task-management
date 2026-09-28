import React from 'react';
import { useTasks } from '../context/TaskContext';
import { GitBranch, GitPullRequest, Sparkles, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export default function ListView({ onEditTask, onDecomposeTask }) {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();

  const statusBadges = {
    backlog: { label: 'Backlog', bg: '#F1F5F9', color: '#475569' },
    in_dev: { label: 'In Dev', bg: '#EEF2FF', color: '#4F46E5' },
    code_review: { label: 'Code Review', bg: '#FEF3C7', color: '#D97706' },
    testing: { label: 'Testing', bg: '#ECFEFF', color: '#0891B2' },
    done: { label: 'Deployed', bg: '#ECFDF5', color: '#059669' },
  };

  const priorityBadges = {
    urgent: { label: 'P0 Blocker', bg: '#FEF2F2', color: '#DC2626' },
    high: { label: 'P1 High', bg: '#FFF7ED', color: '#EA580C' },
    medium: { label: 'P2 Medium', bg: '#EEF2FF', color: '#4F46E5' },
    low: { label: 'P3 Low', bg: '#F8FAFC', color: '#64748B' },
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--bg-subtle)',
              borderBottom: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              <th style={{ padding: '12px 16px' }}>Issue & PR Title</th>
              <th style={{ padding: '12px 16px' }}>Stage</th>
              <th style={{ padding: '12px 16px' }}>Branch</th>
              <th style={{ padding: '12px 16px' }}>Diff</th>
              <th style={{ padding: '12px 16px' }}>Priority</th>
              <th style={{ padding: '12px 16px' }}>Assignee</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const sBadge = statusBadges[task.status] || statusBadges.backlog;
              const pBadge = priorityBadges[task.priority] || priorityBadges.medium;

              return (
                <tr
                  key={task.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Title & Lang */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {task.language && (
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--dev-indigo)',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {task.language}
                        </span>
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {task.title}
                      </span>
                    </div>
                  </td>

                  {/* Stage Dropdown */}
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: sBadge.bg,
                        color: sBadge.color,
                        fontWeight: 700,
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="in_dev">In Dev</option>
                      <option value="code_review">Code Review</option>
                      <option value="testing">Testing</option>
                      <option value="done">Deployed</option>
                    </select>
                  </td>

                  {/* Git Branch */}
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitBranch size={12} color="var(--dev-indigo)" />
                      <span>{task.branch_name || 'feat/core'}</span>
                    </div>
                  </td>

                  {/* Code Diff */}
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11.5px', fontWeight: 700, color: '#10B981' }}>
                    {task.code_diff || '+120 -15'}
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 7px',
                      borderRadius: '5px',
                      backgroundColor: pBadge.bg,
                      color: pBadge.color
                    }}>
                      {pBadge.label}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img
                        src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
                        alt={task.assignee_name}
                        style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {task.assignee_name}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => onDecomposeTask(task)}
                        title="AI Code Review"
                        style={{ background: 'none', border: 'none', color: 'var(--dev-indigo)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Sparkles size={14} />
                      </button>
                      <button
                        onClick={() => onEditTask(task)}
                        title="Edit"
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Delete"
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
