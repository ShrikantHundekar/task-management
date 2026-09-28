import React, { useState } from 'react';
import {
  MoreHorizontal,
  Folder,
  MessageSquare,
  Sparkles,
  Edit2,
  Trash2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTasks } from '../context/TaskContext';

export default function KanbanCard({ task, onEdit, onDecompose }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);

  const nextStatusMap = {
    backlog: 'in_dev',
    in_dev: 'code_review',
    code_review: 'done',
    done: 'backlog'
  };

  const nextStatusLabel = {
    backlog: 'Start Development',
    in_dev: 'Send for Review',
    code_review: 'Mark Complete & Deploy',
    done: 'Move back to To Do'
  };

  const handleNextStatus = () => {
    const next = nextStatusMap[task.status] || 'done';
    if (next === 'done') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    updateTaskStatus(task.id, next);
    setMenuOpen(false);
  };

  // Tag styling matching Screenshot 1
  const getTagStyle = (tag) => {
    const l = tag.toLowerCase();
    if (l.includes('design') || l.includes('ui') || l.includes('ux') || l.includes('red')) {
      return { bg: '#FEF2F2', color: '#EF4444' };
    }
    if (l.includes('front') || l.includes('auth') || l.includes('blue') || l.includes('ts') || l.includes('react')) {
      return { bg: '#EFF6FF', color: '#3B82F6' };
    }
    if (l.includes('qa') || l.includes('review') || l.includes('media') || l.includes('perf')) {
      return { bg: '#FEF3C7', color: '#D97706' };
    }
    if (l.includes('back') || l.includes('data') || l.includes('sql') || l.includes('go') || l.includes('green')) {
      return { bg: '#ECFDF5', color: '#10B981' };
    }
    return { bg: 'var(--bg-subtle)', color: 'var(--text-secondary)' };
  };

  // Determine segmented progress (4 segments total: 0/4, 1/4, 2/4, 3/4, 4/4)
  const completedSub = (task.subtasks || []).filter(s => s.is_completed).length;
  const totalSub = (task.subtasks || []).length || 4;
  let filledSegments = 0;
  if (task.status === 'done') {
    filledSegments = 4;
  } else if (task.status === 'code_review') {
    filledSegments = 3;
  } else if (task.status === 'in_dev') {
    filledSegments = completedSub > 0 ? Math.min(3, completedSub) : 2;
  } else {
    filledSegments = 0;
  }

  const segmentColor = task.status === 'done' ? '#10B981' : task.status === 'code_review' ? '#F59E0B' : '#3B82F6';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '14px',
        padding: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      className="animate-fade-in"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--border-light)';
      }}
    >
      {/* 1. Top Tags & 3-dots Menu matching Screenshot 1 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {(task.tags || ['Frontend']).map((tag, idx) => {
            const style = getTagStyle(tag);
            return (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: style.bg,
                  color: style.color
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* 3-dots context menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '2px 4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-modal)',
              border: '1px solid var(--border-light)',
              padding: '5px',
              minWidth: '160px',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <button onClick={() => { onEdit(task); setMenuOpen(false); }} style={dropdownBtn}>
                <Edit2 size={12} />
                <span>Edit Task</span>
              </button>

              <button onClick={() => { onDecompose(task); setMenuOpen(false); }} style={{ ...dropdownBtn, color: 'var(--primary)' }}>
                <Sparkles size={12} />
                <span>AI Decompose</span>
              </button>

              <button onClick={handleNextStatus} style={dropdownBtn}>
                <ArrowRight size={12} />
                <span>{nextStatusLabel[task.status] || 'Next'}</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '3px 0' }} />

              <button onClick={() => { deleteTask(task.id); setMenuOpen(false); }} style={{ ...dropdownBtn, color: '#EF4444' }}>
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Title & Description Snippet matching Screenshot 1 */}
      <div>
        <h4 style={{
          fontSize: '13.5px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 4px 0',
          lineHeight: '1.35'
        }}>
          {task.title}
        </h4>

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
      </div>

      {/* 3. Segmented Progress Bar matching Screenshot 1 */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontWeight: 500,
          marginBottom: '5px'
        }}>
          <span>Progress</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {filledSegments}/4
          </span>
        </div>

        {/* 4 Segment Bars */}
        <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                flex: 1,
                borderRadius: '9999px',
                backgroundColor: index < filledSegments ? segmentColor : 'var(--bg-subtle)',
                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. Bottom Row: Assignee(s) on Left, Attachment & Comment count on Right matching Screenshot 1 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '6px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        {/* Assignee Avatar(s) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
            alt={task.assignee_name}
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
          />
          {task.secondary_assignee_avatar && (
            <img
              src={task.secondary_assignee_avatar}
              alt="Co-assignee"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginLeft: '-6px',
                border: '1.5px solid var(--bg-card)'
              }}
            />
          )}
        </div>

        {/* Folder & Comments count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Folder size={13} color="var(--text-muted)" />
            <span>{task.attachments_count || 3}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={13} color="var(--text-muted)" />
            <span>{task.comments_count || 6}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const dropdownBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 8px',
  borderRadius: '6px',
  border: 'none',
  background: 'none',
  color: 'var(--text-primary)',
  fontSize: '12px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left'
};
