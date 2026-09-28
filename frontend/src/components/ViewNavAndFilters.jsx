import React from 'react';
import {
  Kanban,
  LayoutGrid,
  List,
  Calendar,
  Search,
  SlidersHorizontal,
  LayoutDashboard
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function ViewNavAndFilters() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useTasks();

  const tabs = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'Kanban', label: 'Kanban', icon: <Kanban size={15} /> },
    { id: 'List', label: 'List', icon: <List size={15} /> },
    { id: 'Calendar', label: 'Calendar', icon: <Calendar size={15} /> }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-light)',
      paddingBottom: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Tabs on Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                padding: '4px 0 12px 0',
                transition: 'color 0.15s ease'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>

              {/* Active Underline indicator */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: '-13px',
                  left: 0,
                  right: 0,
                  height: '2.5px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Filter on Right matching Screenshot 1 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search..."
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
              width: '190px'
            }}
          />
        </div>

        {/* Filter Button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
}
