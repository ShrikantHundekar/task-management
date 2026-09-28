import React, { useState } from 'react';
import {
  GitBranch,
  GitPullRequest,
  MoreVertical,
  Sparkles,
  Edit2,
  Trash2,
  ArrowRight,
  MessageSquare,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTasks } from '../context/TaskContext';

export default function TaskCard({ task, onEdit, onDecompose }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);

  const nextStatusMap = {
    backlog: 'in_dev',
    in_dev: 'code_review',
    code_review: 'testing',
    testing: 'done',
    done: 'backlog'
  };

  const nextStatusLabel = {
    backlog: 'Start Development',
    in_dev: 'Submit for PR Review',
    code_review: 'Send to CI/CD Testing',
    testing: 'Deploy to Production',
    done: 'Move back to Backlog'
  };

  const handleNextStatus = () => {
    const next = nextStatusMap[task.status] || 'done';
    if (next === 'done') {
      // Trigger confetti celebration!
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
    updateTaskStatus(task.id, next);
    setMenuOpen(false);
  };

  const getLanguageBadge = (lang) => {
    switch (lang) {
      case 'Go':
        return { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' };
      case 'TypeScript':
        return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      case 'Python':
        return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
      case 'Rust':
        return { bg: '#FFF7ED', color: '#EA580C', border: '#FFEDD5' };
      case 'Docker':
        return { bg: '#F0F9FF', color: '#0369A1', border: '#E0F2FE' };
      case 'SQL':
        return { bg: '#FAF5FF', color: '#7E22CE', border: '#F3E8FF' };
      default:
        return { bg: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: 'var(--border-light)' };
    }
  };

  const langStyle = getLanguageBadge(task.language || 'Go');

  // Priority color
  const getPriorityStyle = (p) => {
    switch (p) {
      case 'urgent':
        return { text: 'P0 Blocker', color: '#EF4444', bg: '#FEF2F2' };
      case 'high':
        return { text: 'P1 High', color: '#F97316', bg: '#FFF7ED' };
      case 'medium':
        return { text: 'P2 Medium', color: '#6366F1', bg: '#EEF2FF' };
      default:
        return { text: 'P3 Low', color: '#64748B', bg: '#F8FAFC' };
    }
  };

  const pStyle = getPriorityStyle(task.priority);
  const completedSub = (task.subtasks || []).filter(s => s.is_completed).length;
  const totalSub = (task.subtasks || []).length;
  const progressPct = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : (task.status === 'done' ? 100 : 0);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
      className="animate-entrance"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
        e.currentTarget.style.borderColor = 'var(--dev-indigo)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--border-light)';
      }}
    >
      {/* Top Metadata: Branch / Language / Priority */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        flexWrap: 'wrap',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Language badge */}
          {task.language && (
            <span style={{
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '5px',
              backgroundColor: langStyle.bg,
              color: langStyle.color,
              border: `1px solid ${langStyle.border}`,
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {task.language}
            </span>
          )}

          {/* PR number if exists */}
          {task.pr_number && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '5px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--dev-indigo)',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              <GitPullRequest size={11} />
              <span>{task.pr_number}</span>
            </span>
          )}

          {/* Priority */}
          <span style={{
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '5px',
            backgroundColor: pStyle.bg,
            color: pStyle.color,
            fontSize: '10.5px'
          }}>
            {pStyle.text}
          </span>
        </div>

        {/* 3-dots Context Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '3px',
              borderRadius: '4px'
            }}
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '22px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-hover)',
              border: '1px solid var(--border-light)',
              padding: '6px',
              minWidth: '175px',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <button
                onClick={() => { onEdit(task); setMenuOpen(false); }}
                style={menuItemStyle}
              >
                <Edit2 size={13} />
                <span>Edit Issue</span>
              </button>

              <button
                onClick={() => { onDecompose(task); setMenuOpen(false); }}
                style={{ ...menuItemStyle, color: 'var(--dev-indigo)', fontWeight: 600 }}
              >
                <Sparkles size={13} />
                <span>⚡ AI Code Review</span>
              </button>

              <button
                onClick={handleNextStatus}
                style={menuItemStyle}
              >
                <ArrowRight size={13} />
                <span>{nextStatusLabel[task.status] || 'Move next'}</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }} />

              <button
                onClick={() => { deleteTask(task.id); setMenuOpen(false); }}
                style={{ ...menuItemStyle, color: '#EF4444' }}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 style={{
        fontSize: '13.5px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: '1.4',
        margin: 0
      }}>
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {task.description}
        </p>
      )}

      {/* Git Branch Badge & Code Diff */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontFamily: 'JetBrains Mono, monospace',
        backgroundColor: 'var(--bg-subtle)',
        padding: '5px 10px',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <GitBranch size={12} color="var(--dev-indigo)" />
          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {task.branch_name || 'feat/core'}
          </span>
        </div>

        {task.code_diff && (
          <span style={{ fontWeight: 700, color: '#10B981' }}>
            {task.code_diff}
          </span>
        )}
      </div>

      {/* Subtask Progress Bar */}
      {totalSub > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '3px' }}>
            <span>Subtasks ({completedSub}/{totalSub})</span>
            <span style={{ fontWeight: 700, color: 'var(--dev-indigo)' }}>{progressPct}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-light)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: 'var(--dev-indigo)', borderRadius: '9999px' }} />
          </div>
        </div>
      )}

      {/* Footer: Assignee on Left, AI Decompose button + Comments on Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '6px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '11.5px'
      }}>
        {/* Assignee Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img
            src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
            alt={task.assignee_name}
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            {task.assignee_name?.split(' ')[0]}
          </span>
        </div>

        {/* Quick AI Action + Comments */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onDecompose(task)}
            title="Groq AI Review & Subtask Generator"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--dev-indigo)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '6px'
            }}
          >
            <Sparkles size={12} />
            <span>AI Review</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <MessageSquare size={12} />
            <span>{task.comments_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 10px',
  borderRadius: '6px',
  border: 'none',
  background: 'none',
  color: 'var(--text-primary)',
  fontSize: '12px',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  transition: 'background 0.1s ease'
};
