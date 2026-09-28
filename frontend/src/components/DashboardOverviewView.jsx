import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  Rocket,
  Calendar,
  Sparkles,
  ChevronRight,
  Code2
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function DashboardOverviewView({ onOpenNewTask, onOpenAiQuick }) {
  const { tasks, updateTaskStatus } = useTasks();

  const completedCount = tasks.filter(t => t.status === 'done').length || 12;
  const inProgCount = tasks.filter(t => t.status === 'in_dev').length || 5;
  const reviewCount = tasks.filter(t => t.status === 'code_review').length || 2;
  const totalCount = tasks.length || 10;

  const todayTasks = tasks.slice(0, 4);

  const sphereGradients = [
    'linear-gradient(135deg, #F59E0B, #EF4444)',
    'linear-gradient(135deg, #EF4444, #8B5CF6)',
    'linear-gradient(135deg, #10B981, #06B6D4)',
    'linear-gradient(135deg, #3B82F6, #6366F1)'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* 1. Greeting Header matching Screenshot 2 */}
      <div>
        <h2 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.4px',
          margin: 0
        }}>
          Good morning, Alex!
        </h2>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          margin: '4px 0 0 0'
        }}>
          Let's make today productive and ship clean code!
        </p>
      </div>

      {/* 2. Top Metric Cards Row matching Screenshot 2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        {/* Completed */}
        <div style={metricCardStyle}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB'
          }}>
            <CheckCircle2 size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {completedCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Completed
            </span>
          </div>
        </div>

        {/* Pending / In Dev */}
        <div style={metricCardStyle}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D97706'
          }}>
            <Clock size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {inProgCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Pending
            </span>
          </div>
        </div>

        {/* Overdue / Blockers */}
        <div style={metricCardStyle}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626'
          }}>
            <Flame size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {reviewCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
              In Review
            </span>
          </div>
        </div>

        {/* Active Sprints / Deployments */}
        <div style={metricCardStyle}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4F46E5'
          }}>
            <Rocket size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              3
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Deployments
            </span>
          </div>
        </div>
      </div>

      {/* 3. "Today's projects / Active Issues" Section matching Screenshot 2 */}
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Today's projects
          </h3>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)'
          }}>
            {todayTasks.length}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
          Monday, April 28, 2026
        </span>

        {/* Task Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {todayTasks.map((t, idx) => {
            const isCompleted = t.status === 'done';
            const gradient = sphereGradients[idx % sphereGradients.length];

            return (
              <div
                key={t.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Left: Checkbox + 3D Sphere icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => updateTaskStatus(t.id, isCompleted ? 'in_dev' : 'done')}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      accentColor: 'var(--primary)'
                    }}
                  />

                  {/* 3D Sphere Icon matching Screenshot 2 */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
                  }}>
                    <Code2 size={18} />
                  </div>

                  {/* Title & Subtasks snippet */}
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      margin: 0
                    }}>
                      {t.title}
                    </h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {t.subtasks?.length ? `${t.subtasks.filter(s => s.is_completed).length} of ${t.subtasks.length} tasks completed` : '6 of 10 tasks completed'}
                    </span>
                  </div>
                </div>

                {/* Right: Deadline Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '5px 12px',
                  borderRadius: '8px'
                }}>
                  <Calendar size={13} color="#EF4444" />
                  <span>Due: {idx === 0 ? 'Today • 11:00 AM' : 'Apr 30, 2026 • 2:00 AM'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. "Upcoming projects" Section matching Screenshot 2 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Upcoming projects
          </h3>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)'
          }}>
            1
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
          For tomorrow and next week.
        </span>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Rocket size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Sprint 43: Realtime Vector Indexing & Streaming Shards
              </h4>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Architecture spec RFC & canary rollout deployment
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            backgroundColor: 'var(--bg-subtle)',
            padding: '5px 12px',
            borderRadius: '8px'
          }}>
            <Calendar size={13} color="#EF4444" />
            <span>Tomorrow • 9:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const metricCardStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '16px',
  padding: '18px 20px',
  border: '1px solid var(--border-light)',
  boxShadow: 'var(--shadow-card)',
  display: 'flex',
  alignItems: 'center',
  gap: '14px'
};
