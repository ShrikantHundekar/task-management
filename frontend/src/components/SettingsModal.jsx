import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Loader2, Sparkles, Moon, Sun, RefreshCw } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { groqApiKey, saveGroqApiKey, groqModel, saveGroqModel } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [inputKey, setInputKey] = useState(groqApiKey);
  const [selectedModel, setSelectedModel] = useState(groqModel);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    saveGroqApiKey(inputKey.trim());
    saveGroqModel(selectedModel);
    onClose();
  };

  const handleTestConnection = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Groq API key to test' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai/test-key/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Groq-Api-Key': inputKey.trim()
        },
        body: JSON.stringify({ groq_api_key: inputKey.trim() })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setTestResult({ success: true, message: data.message || 'Groq API Key verified successfully!' });
      } else {
        setTestResult({ success: false, message: data.message || 'Verification failed. Please check the key.' });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Connection error: ' + err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-light)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-purple-light)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Settings & AI Configuration
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '1px 0 0 0' }}>
                Manage Groq Cloud integration and interface preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Theme Setting */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)'
        }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
              Appearance Theme
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Current mode: {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
            </span>
          </div>

          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {theme === 'light' ? <Moon size={14} color="#60A5FA" /> : <Sun size={14} color="#F59E0B" />}
            <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
          </button>
        </div>

        {/* Groq API Key Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Groq API Key
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="gsk_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Your key stays in your browser session & local environment. If left blank, the app runs in intelligent simulated mode.
          </span>
        </div>

        {/* Model Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Groq Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="llama-3.3-70b-versatile">Meta LLaMA 3.3 70B Versatile (Recommended)</option>
            <option value="llama-3.1-8b-instant">Meta LLaMA 3.1 8B Instant (Ultra Fast)</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B (MoE)</option>
          </select>
        </div>

        {/* Test Connection Button */}
        <div>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: testing ? 'default' : 'pointer'
            }}
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            <span>Test Groq Connection</span>
          </button>

          {testResult && (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              backgroundColor: testResult.success ? '#ECFDF5' : '#FEF2F2',
              color: testResult.success ? '#065F46' : '#991B1B',
              border: `1px solid ${testResult.success ? '#A7F3D0' : '#FECACA'}`
            }}>
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'var(--accent-purple)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(112, 89, 226, 0.35)'
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
