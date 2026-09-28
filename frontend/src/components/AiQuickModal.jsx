import React, { useState } from 'react';
import { X, Sparkles, Terminal, CheckCircle, Loader2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function AiQuickModal({ isOpen, onClose }) {
  const { parseTaskWithAi, addTask } = useTasks();

  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!promptText.trim()) return;
    setLoading(true);
    const result = await parseTaskWithAi(promptText);
    setLoading(false);
    if (result) {
      setParsedResult(result);
    }
  };

  const handleConfirmAdd = async () => {
    if (!parsedResult) return;
    await addTask({
      title: parsedResult.title,
      description: parsedResult.description || promptText,
      priority: parsedResult.priority || 'medium',
      status: parsedResult.status || 'backlog',
      language: parsedResult.language || 'Go',
      branch_name: parsedResult.branch_name || 'feat/dev-issue',
      assignee_name: parsedResult.assignee_name || 'Alex Chen',
      tags: parsedResult.tags || ['Engineered', 'Backend'],
    });
    setParsedResult(null);
    setPromptText('');
    onClose();
  };

  const samplePrompts = [
    'Create an urgent P0 ticket for Redis connection pool starvation in Go',
    'Add high priority task to optimize Docker multi-stage alpine build',
    'Implement OAuth2 PKCE biometric session refresh in TypeScript'
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      zIndex: 65,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-hover)',
        border: '1px solid var(--border-light)',
        padding: '26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        animation: 'slideDown 0.2s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Terminal size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Groq Dev AI Issue Creator
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '1px 0 0 0' }}>
                Prompt to structured engineering tickets, branch, & language
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Text input */}
        <div>
          <textarea
            rows={3}
            placeholder="e.g. Schedule an urgent P0 ticket for WebSocket consumer group rebalancing in Python by Friday..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              outline: 'none',
              resize: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptText(sp)}
                style={{
                  fontSize: '11px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleParse}
          disabled={!promptText.trim() || loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'var(--dev-indigo)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: promptText.trim() && !loading ? 'pointer' : 'default',
            opacity: promptText.trim() && !loading ? 1 : 0.6,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          <span>Generate Issue with Groq</span>
        </button>

        {/* Parsed Result Preview */}
        {parsedResult && (
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--dev-indigo)', textTransform: 'uppercase' }}>
                AI Parsed Preview
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: parsedResult.priority === 'urgent' ? '#FEE2E2' : '#EFF6FF',
                color: parsedResult.priority === 'urgent' ? '#DC2626' : '#2563EB',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {parsedResult.priority}
              </span>
            </div>

            <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {parsedResult.title}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              <span>Lang: <strong>{parsedResult.language || 'Go'}</strong></span>
              <span>•</span>
              <span>Branch: <code>{parsedResult.branch_name || 'feat/core'}</code></span>
              <span>•</span>
              <span>Stage: <strong>{parsedResult.status || 'backlog'}</strong></span>
            </div>

            <button
              onClick={handleConfirmAdd}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '9px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <CheckCircle size={14} />
              <span>Add to Repository Sprint</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
