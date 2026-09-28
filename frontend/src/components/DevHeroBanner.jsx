import React from 'react';
import {
  GitPullRequest,
  GitBranch,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  Terminal,
  Activity
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function DevHeroBanner({ onOpenAiQuick, onOpenNewTask }) {
  const { activeProject } = useTasks();

  const contributors = [
    { name: 'Alex Chen', role: 'Staff SRE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sarah Jenkins', role: 'DBA', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { name: 'Elena Rostova', role: 'DevOps', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
    { name: 'Marcus Vance', role: 'Systems', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  ];

  return (
    <div style={{
      borderRadius: '20px',
      background: 'var(--hero-gradient)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '26px 30px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      overflow: 'hidden',
      color: '#FFFFFF'
    }}>
      {/* Background Subtle Tech Grid & Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Repo & Sprint Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Code2 size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                {activeProject?.repo_name || 'hyperion/core-engine'}
              </h2>

              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                color: '#A5B4FC',
                fontFamily: 'JetBrains Mono, monospace',
                border: '1px solid rgba(99, 102, 241, 0.4)'
              }}>
                v2.4.0-rc1
              </span>
            </div>

            <p style={{
              fontSize: '13px',
              color: '#94A3B8',
              margin: '3px 0 0 0',
              fontWeight: 500
            }}>
              {activeProject?.sprint_name || 'Sprint 42 • Realtime Streaming & Vector DB'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenAiQuick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#C7D2FE',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} color="#818CF8" />
            <span>AI Architecture RFC</span>
          </button>

          <button
            onClick={() => onOpenNewTask('in_dev')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#6366F1',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <GitPullRequest size={14} />
            <span>Open Pull Request</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '14px',
        padding: '16px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Sprint Completion Progress */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
              Sprint Progress
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace' }}>
              68%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #6366F1, #06B6D4)', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* PRs Merged */}
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
            Merged Pull Requests
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <GitPullRequest size={15} color="#818CF8" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'JetBrains Mono, monospace' }}>
              84 PRs
            </span>
          </div>
        </div>

        {/* Test Coverage & CI */}
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
            CI Pipeline & Tests
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <CheckCircle2 size={15} color="#34D399" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#34D399', fontFamily: 'JetBrains Mono, monospace' }}>
              99.4% Passing
            </span>
          </div>
        </div>

        {/* Release Target */}
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
            Milestone Release
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <Clock size={15} color="#FBBF24" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
              {activeProject?.due_date_str || 'Oct 28, 2026'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
