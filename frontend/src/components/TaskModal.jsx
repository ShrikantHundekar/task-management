import React, { useState, useEffect } from 'react';
import { X, Sparkles, Terminal, GitBranch, GitPullRequest, Code2, Loader2, Check } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TaskModal({ isOpen, onClose, initialData, defaultStatus }) {
  const { addTask, updateTask, decomposeTaskWithAi, addSubtask, toggleSubtask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('backlog');
  const [priority, setPriority] = useState('medium');
  const [language, setLanguage] = useState('Go');
  const [branchName, setBranchName] = useState('feat/core-service');
  const [prNumber, setPrNumber] = useState('');
  const [codeDiff, setCodeDiff] = useState('+120 -15');
  const [assigneeName, setAssigneeName] = useState('Alex Chen');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [isDecomposing, setIsDecomposing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'backlog');
      setPriority(initialData.priority || 'medium');
      setLanguage(initialData.language || 'Go');
      setBranchName(initialData.branch_name || 'feat/core-service');
      setPrNumber(initialData.pr_number || '');
      setCodeDiff(initialData.code_diff || '+120 -15');
      setAssigneeName(initialData.assignee_name || 'Alex Chen');
      setTags(initialData.tags || []);
      setSubtasks(initialData.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus || 'backlog');
      setPriority('medium');
      setLanguage('Go');
      setBranchName('feat/core-service');
      setPrNumber('');
      setCodeDiff('+120 -15');
      setAssigneeName('Alex Chen');
      setTags(['Backend', 'Distributed']);
      setSubtasks([]);
    }
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleDecomposeWithAi = async () => {
    if (!title.trim()) return;
    setIsDecomposing(true);
    const result = await decomposeTaskWithAi(title, description);
    setIsDecomposing(false);
    if (result && result.subtasks) {
      const formatted = result.subtasks.map((st, i) => ({
        id: 'temp-' + i,
        title: st,
        is_completed: false
      }));
      setSubtasks(prev => [...prev, ...formatted]);
      if (result.suggested_priority) setPriority(result.suggested_priority);
      if (result.suggested_language) setLanguage(result.suggested_language);
      if (result.suggested_branch) setBranchName(result.suggested_branch);
      if (result.suggested_tags) setTags(Array.from(new Set([...tags, ...result.suggested_tags])));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      status,
      priority,
      language,
      branch_name: branchName,
      pr_number: prNumber,
      code_diff: codeDiff,
      assignee_name: assigneeName,
      tags
    };

    if (initialData) {
      await updateTask(initialData.id, payload);
    } else {
      const res = await addTask(payload);
      if (res.success && subtasks.length > 0) {
        for (const st of subtasks) {
          await addSubtask(res.task.id, st.title);
        }
      }
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
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
              backgroundColor: 'var(--dev-indigo-light)',
              color: 'var(--dev-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Terminal size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {initialData ? 'Edit Engineering Issue' : 'Create New Engineering Issue / PR'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '1px 0 0 0' }}>
                Repository: hyperion/core-engine
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* AI Decompose Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '12px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--dev-indigo)' }}>
              <Sparkles size={14} />
              <span>Groq AI Architecture Decomposer</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Auto-generate RFC specs, subtasks checklist, git branch name, and language
            </p>
          </div>

          <button
            type="button"
            onClick={handleDecomposeWithAi}
            disabled={!title.trim() || isDecomposing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--dev-indigo)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: title.trim() && !isDecomposing ? 'pointer' : 'default',
              opacity: title.trim() && !isDecomposing ? 1 : 0.6,
              flexShrink: 0
            }}
          >
            {isDecomposing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>Decompose</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Issue / PR Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement distributed rate limiting via Redis token bucket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Technical Specification & Context</label>
            <textarea
              rows={3}
              placeholder="RFC architecture notes, concurrency requirements, bench targets..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Language & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Primary Language / Runtime</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
                <option value="Go">Go (Golang)</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Rust">Rust</option>
                <option value="SQL">PostgreSQL / SQL</option>
                <option value="Docker">Docker / K8s</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Priority Level</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                <option value="urgent">P0 - Blocker</option>
                <option value="high">P1 - High</option>
                <option value="medium">P2 - Medium</option>
                <option value="low">P3 - Low</option>
              </select>
            </div>
          </div>

          {/* Branch & PR */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Git Branch Name</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="feat/short-slug"
                style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            <div>
              <label style={labelStyle}>PR Number (Optional)</label>
              <input
                type="text"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                placeholder="#248"
                style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>
          </div>

          {/* Workflow Status & Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Workflow Stage</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="backlog">Backlog / Triage</option>
                <option value="in_dev">In Development</option>
                <option value="code_review">Code Review / PR</option>
                <option value="testing">CI/CD & Testing</option>
                <option value="done">Deployed / Done</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Assignee</label>
              <select value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} style={inputStyle}>
                <option value="Alex Chen">Alex Chen (Staff SRE)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (DBA & SRE)</option>
                <option value="Elena Rostova">Elena Rostova (DevOps)</option>
                <option value="Marcus Vance">Marcus Vance (Systems)</option>
                <option value="Kavita Patel">Kavita Patel (Full Stack)</option>
              </select>
            </div>
          </div>

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div>
              <label style={labelStyle}>Engineering Checklist ({subtasks.length})</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {subtasks.map((st, i) => (
                  <div
                    key={st.id || i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={st.is_completed}
                      onChange={() => {
                        if (st.id && !st.id.toString().startsWith('temp-')) {
                          toggleSubtask(st.id);
                        } else {
                          setSubtasks(subtasks.map((item, idx) => idx === i ? { ...item, is_completed: !item.is_completed } : item));
                        }
                      }}
                    />
                    <span style={{
                      textDecoration: st.is_completed ? 'line-through' : 'none',
                      color: st.is_completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      flex: 1
                    }}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--dev-indigo)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}
            >
              {initialData ? 'Update Issue' : 'Submit Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '11.5px',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  marginBottom: '5px'
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '12.5px',
  outline: 'none'
};
