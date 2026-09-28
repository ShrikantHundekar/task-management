import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Terminal, Bot, Code2, RefreshCw } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function GroqCopilotDrawer({ isOpen, onClose }) {
  const { chatMessages, sendChatMessage, aiTyping, activeProject } = useTasks();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, aiTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt) => {
    sendChatMessage(prompt);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '380px',
      backgroundColor: 'var(--bg-card)',
      borderLeft: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-modal)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Terminal size={17} />
          </div>
          <div>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
              Groq Dev Copilot
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Meta LLaMA 3.3 70B
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {chatMessages.map((msg, idx) => {
          const isUser = msg.sender_type === 'user';
          return (
            <div
              key={msg.id || idx}
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
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={14} />
                </div>
              )}

              <div style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: '12px',
                borderTopLeftRadius: isUser ? '12px' : '2px',
                borderTopRightRadius: isUser ? '2px' : '12px',
                backgroundColor: isUser ? 'var(--primary)' : 'var(--bg-subtle)',
                color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '12.5px',
                lineHeight: '1.45',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.message}
              </div>
            </div>
          );
        })}

        {aiTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <RefreshCw size={13} className="animate-spin" />
            <span>Groq Dev Copilot is analyzing repo...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompt suggestions */}
      <div style={{
        padding: '6px 14px',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--bg-card)'
      }}>
        <button onClick={() => handleQuickPrompt('How is our sprint progressing?')} style={copilotPromptChip}>
          ⚡ Sprint Health
        </button>
        <button onClick={() => handleQuickPrompt('Review PR #248 token rotation architecture')} style={copilotPromptChip}>
          🔍 Review PR #248
        </button>
        <button onClick={() => handleQuickPrompt('Suggest Dockerfile multi-stage optimization')} style={copilotPromptChip}>
          🐳 Docker Spec
        </button>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <input
          type="text"
          placeholder="Ask Groq Copilot for code or RFCs..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: inputText.trim() ? 'var(--primary)' : 'var(--bg-subtle)',
            color: inputText.trim() ? '#FFFFFF' : 'var(--text-muted)',
            cursor: inputText.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

const copilotPromptChip = {
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-secondary)',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};
