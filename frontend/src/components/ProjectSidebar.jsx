import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, Circle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function ProjectSidebar() {
  const { projects, activeProject, setActiveProject } = useTasks();

  const [expandedSections, setExpandedSections] = useState({
    Active: true,
    Dribble: true,
    Behance: true
  });

  const [activeSubItem, setActiveSubItem] = useState('Website');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeProjects = projects.filter(p => p.category === 'Active');
  const dribbleProjects = projects.filter(p => p.category === 'Dribble');
  const behanceProjects = projects.filter(p => p.category === 'Behance');

  const dentalSubItems = [
    'Mobile app',
    'Website',
    'Brand identity',
    'Logo design'
  ];

  return (
    <aside style={{
      width: '230px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-light)',
      height: '100vh',
      overflowY: 'auto',
      padding: '24px 16px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'sticky',
      top: 0
    }}>
      {/* Active Section */}
      <div>
        <div
          onClick={() => toggleSection('Active')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '4px 8px',
            marginBottom: '8px'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Active</span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transform: expandedSections.Active ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>

        {expandedSections.Active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {activeProjects.map(proj => {
              const isSelected = activeProject?.id === proj.id;
              const isDental = proj.name === 'DentalPro';

              return (
                <div key={proj.id}>
                  <div
                    onClick={() => setActiveProject(proj)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(112, 89, 226, 0.08)' : 'transparent',
                      color: isSelected ? 'var(--accent-purple)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '13px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: proj.color || '#7C3AED',
                        display: 'inline-block',
                        flexShrink: 0
                      }} />
                      <span>{proj.name}</span>
                    </div>

                    {isDental && (
                      <span style={{
                        backgroundColor: '#FF6B6B',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px'
                      }}>2</span>
                    )}
                  </div>

                  {/* DentalPro Sub-items */}
                  {isDental && isSelected && (
                    <div style={{
                      paddingLeft: '26px',
                      marginTop: '2px',
                      marginBottom: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {dentalSubItems.map(item => (
                        <div
                          key={item}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSubItem(item);
                          }}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: activeSubItem === item ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: activeSubItem === item ? 600 : 400,
                            backgroundColor: activeSubItem === item ? 'var(--bg-subtle)' : 'transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dribble Section */}
      <div>
        <div
          onClick={() => toggleSection('Dribble')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '4px 8px',
            marginBottom: '8px'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Dribble</span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transform: expandedSections.Dribble ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>

        {expandedSections.Dribble && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {dribbleProjects.map(proj => {
              const isSelected = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProject(proj)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(112, 89, 226, 0.08)' : 'transparent',
                    color: isSelected ? 'var(--accent-purple)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '13px',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: proj.color || '#F59E0B',
                    display: 'inline-block',
                    flexShrink: 0
                  }} />
                  <span>{proj.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Behance Section */}
      <div>
        <div
          onClick={() => toggleSection('Behance')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '4px 8px',
            marginBottom: '8px'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Behance</span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transform: expandedSections.Behance ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>

        {expandedSections.Behance && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {behanceProjects.map(proj => {
              const isSelected = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProject(proj)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(112, 89, 226, 0.08)' : 'transparent',
                    color: isSelected ? 'var(--accent-purple)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '13px',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: proj.color || '#F97316',
                    display: 'inline-block',
                    flexShrink: 0
                  }} />
                  <span>{proj.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
