import React, { useState, useRef, useEffect } from 'react';
import {
  GitPullRequest,
  Activity,
  Sparkles,
  Send,
  Terminal,
  Bot,
  CheckCircle2,
  ExternalLink,
  Flame,
  Code2
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function DevRightPanel() {
  const { timeLogs, chatMessages, sendChatMessage, aiTyping, tasks } = useTasks();

  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(inputMsg);
    setInputMsg('');
  };

  const handleQuickPrompt = (prompt) => {
    sendChatMessage(prompt);
  };

  // PRs in code review
  const pendingPRs = tasks.filter(t => t.status === 'code_review' || t.pr_number);

  // TimeLogs / Commits for Wave Chart
  const defaultLogs = [
    { day: 'Mon', commits: 24, hours: 7.5 },
    { day: 'Tue', commits: 38, hours: 8.8 },
    { day: 'Wed', commits: 45, hours: 9.2 },
    { day: 'Thu', commits: 19, hours: 6.5 },
    { day: 'Fri', commits: 41, hours: 8.4 },
    { day: 'Sat', commits: 12, hours: 4.2 },
    { day: 'Sun', commits: 16, hours: 5.0 },
  ];

  const logData = timeLogs.length === 7 ? timeLogs : defaultLogs;
  const totalCommits = logData.reduce((acc, curr) => acc + (curr.commits_count || curr.commits || 20), 0);

  // SVG coordinates: Width: 280, Height: 85
  const points = logData.map((d, idx) => {
    const commits = d.commits_count || d.commits || 20;
    const x = 15 + idx * 42;
    const y = 75 - (commits / 50) * 60;
    return { x, y, commits, day: d.day };
  });

  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},80 L ${points[0].x},80 Z`;

  return (
    <aside style={{
      width: '360px',
      flexShrink: 0,
      backgroundColor: 'var(--bg-sidebar)',
      borderLeft: '1px solid var(--border-light)',
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      position: 'sticky',
      top: '64px'
    }}>
      {/* 1. Commit Velocity & Sprint Burndown */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} color="#F59E0B" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              Commit Velocity
            </span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '9999px',
            backgroundColor: 'var(--dev-emerald-light)',
            color: '#059669',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            +18% this sprint
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
            {totalCommits}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>commits across branches</span>
        </div>

        {/* Velocity Chart */}
        <div style={{ width: '100%', height: '90px', position: 'relative' }}>
          <svg viewBox="0 0 280 85" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="devWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={areaD} fill="url(#devWave)" />
            <path d={pathD} fill="none" stroke="var(--dev-indigo)" strokeWidth="2.5" strokeLinecap="round" />

            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#FFFFFF"
                stroke="var(--dev-indigo)"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Days */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
            {points.map((p, i) => (
              <span key={i}>{p.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Pull Request Review Queue */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitPullRequest size={15} color="var(--dev-indigo)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              PR Review Queue
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {pendingPRs.length} pending
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pendingPRs.slice(0, 2).map((pr, i) => (
            <div
              key={pr.id || i}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dev-indigo)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {pr.pr_number || `#${248 + i}`}
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>
                  {pr.code_diff || '+420 -65'}
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                {pr.title}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                By {pr.assignee_name} • branch: <code>{pr.branch_name}</code>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Groq Dev Copilot Chat */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: '340px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Terminal size={14} />
            </div>
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                Groq Dev Copilot
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                Meta LLaMA 3.3 70B
              </span>
            </div>
          </div>

          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981'
          }} />
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {chatMessages.map((msg, i) => {
            const isUser = msg.sender_type === 'user';
            const isAi = msg.sender_type === 'ai';

            return (
              <div
                key={msg.id || i}
                style={{
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isAi ? 'var(--dev-indigo-light)' : 'var(--bg-subtle)',
                    color: isAi ? 'var(--dev-indigo)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isAi ? <Bot size={14} /> : <Code2 size={14} />}
                  </div>
                )}

                <div style={{
                  maxWidth: '85%',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  borderTopLeftRadius: isUser ? '12px' : '3px',
                  borderTopRightRadius: isUser ? '3px' : '12px',
                  backgroundColor: isUser ? 'var(--dev-indigo)' : 'var(--bg-subtle)',
                  color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '12px',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })}

          {aiTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Terminal size={13} className="animate-spin" />
              <span>Analyzing code and sprint telemetry...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Prompt Chips */}
        <div style={{
          padding: '6px 12px',
          display: 'flex',
          gap: '5px',
          overflowX: 'auto',
          borderTop: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <button
            onClick={() => handleQuickPrompt('How is our sprint progressing?')}
            style={promptChipStyle}
          >
            ⚡ Sprint Health
          </button>
          <button
            onClick={() => handleQuickPrompt('Review PR #248 token rotation architecture')}
            style={promptChipStyle}
          >
            🔍 Review PR #248
          </button>
          <button
            onClick={() => handleQuickPrompt('Suggest Dockerfile multi-stage optimization')}
            style={promptChipStyle}
          >
            🐳 Docker Spec
          </button>
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '10px 12px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <input
            type="text"
            placeholder="Ask AI Copilot for code or RFCs..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: inputMsg.trim() ? 'var(--dev-indigo)' : 'var(--bg-subtle)',
              color: inputMsg.trim() ? '#FFFFFF' : 'var(--text-muted)',
              cursor: inputMsg.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </aside>
  );
}

const promptChipStyle = {
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-secondary)',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '10.5px',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};
