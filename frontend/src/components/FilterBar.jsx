import React from 'react';
import { ChevronDown, Search, Plus, Sparkles, Filter } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function FilterBar({ onOpenNewTask, onOpenAiQuick }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedDepartment,
    setSelectedDepartment
  } = useTasks();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Left Filter Dropdowns */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
          <Filter size={13} />
          <span>Filters:</span>
        </div>

        {/* Priority Filter */}
        <div style={dropdownWrapper}>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={dropdownSelect}
          >
            <option value="all">Priority: All</option>
            <option value="urgent">P0 - Blocker</option>
            <option value="high">P1 - High</option>
            <option value="medium">P2 - Medium</option>
            <option value="low">P3 - Low</option>
          </select>
          <ChevronDown size={13} style={dropdownIcon} />
        </div>

        {/* Tech Stack Filter */}
        <div style={dropdownWrapper}>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={dropdownSelect}
          >
            <option value="Web development">Stack: All Services</option>
            <option value="Go">Go Microservices</option>
            <option value="TypeScript">TypeScript Frontends</option>
            <option value="Python">Python Event Spine</option>
            <option value="Rust">Rust eBPF Core</option>
          </select>
          <ChevronDown size={13} style={dropdownIcon} />
        </div>
      </div>

      {/* Right Search & Quick AI Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Filter issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '7px 12px 7px 32px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              outline: 'none',
              width: '180px'
            }}
          />
        </div>

        {/* AI Action */}
        <button
          onClick={onOpenAiQuick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            backgroundColor: 'var(--dev-indigo-light)',
            color: 'var(--dev-indigo)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="Create task with Groq Dev Copilot"
        >
          <Sparkles size={13} />
          <span>AI Task</span>
        </button>

        {/* Add Issue */}
        <button
          onClick={onOpenNewTask}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '7px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--dev-indigo)',
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          <Plus size={14} />
          <span>New Issue</span>
        </button>
      </div>
    </div>
  );
}

const dropdownWrapper = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center'
};

const dropdownSelect = {
  appearance: 'none',
  WebkitAppearance: 'none',
  padding: '6px 28px 6px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-light)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-secondary)',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none'
};

const dropdownIcon = {
  position: 'absolute',
  right: '10px',
  pointerEvents: 'none',
  color: 'var(--text-muted)'
};
