import React from 'react';
import { useTasks } from '../context/TaskContext';

export default function ViewTabs() {
  const { activeTab, setActiveTab } = useTasks();

  const tabs = [
    'Overview',
    'List',
    'Dashboard',
    'Timeline',
    'Calendar'
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '18px 0 24px 0'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-card)',
        padding: '4px',
        borderRadius: '9999px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)',
        gap: '4px'
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 24px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? 'var(--accent-purple)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 12px rgba(112, 89, 226, 0.3)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
