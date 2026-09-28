import React, { useState, useRef, useEffect } from 'react';
import { Video, Phone, Send, Sparkles, Bot, User, Check, RefreshCw } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function AiChatWidget() {
  const { chatMessages, sendChatMessage, aiTyping, groqApiKey } = useTasks();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'team'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, aiTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt) => {
    sendChatMessage(prompt);
  };

  // Filter messages based on tab
  const displayedMessages = chatMessages.filter(msg => {
    if (activeTab === 'ai') return msg.sender_type === 'ai' || msg.sender_type === 'user';
    return msg.sender_type === 'team' || msg.sender_type === 'user';
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '20px',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      height: '380px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)'
      }}>
        {/* Toggle Pills: AI Agent vs Team Chat */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '3px',
          borderRadius: '9999px'
        }}>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'ai' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'ai' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={12} />
            <span>AI Agent</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            style={{
              border: 'none',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'team' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'team' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Team Chat
          </button>
        </div>

        {/* Video & Call Icons matching screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <button style={headerIconBtn} title="Start Video Call"><Video size={16} /></button>
          <button style={headerIconBtn} title="Audio Call"><Phone size={16} /></button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {displayedMessages.map((msg, idx) => {
          const isMe = msg.sender_type === 'user';
          const isAi = msg.sender_type === 'ai';

          return (
            <div
              key={msg.id || idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                flexDirection: isMe ? 'row-reverse' : 'row',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              {/* Avatar */}
              {!isMe && (
                isAi ? (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7059E2, #FF8A48)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}>
                    <Bot size={15} />
                  </div>
                ) : (
                  <img
                    src={msg.sender_avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'}
                    alt={msg.sender_name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                )
              )}

              {/* Message Bubble */}
              <div style={{
                maxWidth: '82%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderTopLeftRadius: isMe ? '16px' : '4px',
                  borderTopRightRadius: isMe ? '4px' : '16px',
                  backgroundColor: isMe
                    ? 'var(--accent-purple)'
                    : isAi
                      ? 'var(--accent-purple-light)'
                      : 'var(--bg-subtle)',
                  color: isMe
                    ? '#FFFFFF'
                    : 'var(--text-primary)',
                  fontSize: '12.5px',
                  lineHeight: '1.45',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-wrap',
                  border: isAi ? '1px solid rgba(112, 89, 226, 0.2)' : 'none'
                }}>
                  {msg.message}
                </div>

                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginTop: '3px',
                  padding: '0 4px'
                }}>
                  {isMe ? 'Just now' : '1h ago'}
                </span>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {aiTyping && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-purple-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)'
            }}>
              <RefreshCw size={12} className="animate-spin" />
            </div>
            <span>Groq AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {activeTab === 'ai' && (
        <div style={{
          padding: '6px 14px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <button
            onClick={() => handleQuickPrompt('How is our sprint progressing?')}
            style={quickChipStyle}
          >
            📊 Progress
          </button>
          <button
            onClick={() => handleQuickPrompt('Break down the popup creation task')}
            style={quickChipStyle}
          >
            🧩 Decompose Popups
          </button>
          <button
            onClick={() => handleQuickPrompt('What tasks are urgent today?')}
            style={quickChipStyle}
          >
            ⚡ Urgent Tasks
          </button>
        </div>
      )}

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <input
          type="text"
          placeholder={activeTab === 'ai' ? 'Ask Groq AI or type instructions...' : 'Reply to team...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: '9999px',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: inputText.trim() ? 'var(--accent-purple)' : 'var(--bg-subtle)',
            color: inputText.trim() ? '#FFFFFF' : 'var(--text-muted)',
            cursor: inputText.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

const headerIconBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: '4px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const quickChipStyle = {
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-secondary)',
  padding: '3px 9px',
  borderRadius: '9999px',
  fontSize: '11px',
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease'
};
