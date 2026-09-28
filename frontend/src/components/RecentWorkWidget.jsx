import React from 'react';
import { Sparkles, Layers, Compass } from 'lucide-react';

export default function RecentWorkWidget() {
  const recentItems = [
    {
      id: 1,
      title: 'Design of the page "Reviews"',
      icon: <Layers size={18} color="#7C3AED" />,
      iconBg: '#EEECFC',
      progress: 71,
      assignees: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      ]
    },
    {
      id: 2,
      title: 'Preparing for UX Testing',
      icon: <Compass size={18} color="#F97316" />,
      iconBg: '#FFF4E5',
      progress: 43,
      assignees: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      ]
    }
  ];

  return (
    <div>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '14px'
      }}>
        Your recent project work
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}>
        {recentItems.map(item => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '18px',
              padding: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px'
            }}
          >
            {/* Top Icon */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: item.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              {item.icon}
            </div>

            {/* Title */}
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: '1.3',
              margin: '0 0 14px 0'
            }}>
              {item.title}
            </h4>

            {/* Bottom: Assignees & Progress */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  display: 'block',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginBottom: '4px'
                }}>
                  Assigned
                </span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.assignees.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Assignee"
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: idx === 0 ? 0 : '-6px',
                        border: '2px solid var(--bg-card)'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'block',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginBottom: '4px'
                }}>
                  Progress
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: item.progress > 50 ? 'var(--accent-purple)' : '#10B981'
                }}>
                  {item.progress}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
