import React from 'react';
import {
  ChevronLeft,
  ChevronsLeft,
  MessageSquare,
  Share2,
  Star,
  MoreVertical,
  Activity
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function ProjectHeroBanner() {
  const { activeProject } = useTasks();

  const members = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Top action navigation bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        {/* Left Chevrons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={topNavIconBtn} title="Collapse"><ChevronsLeft size={18} /></button>
          <button style={topNavIconBtn} title="Back"><ChevronLeft size={18} /></button>
        </div>

        {/* Right Members & Utility Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar Stack */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {members.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Member"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--bg-app)',
                  marginLeft: idx === 0 ? 0 : '-8px',
                  zIndex: members.length - idx
                }}
              />
            ))}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '2px solid var(--bg-app)',
              marginLeft: '-8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              zIndex: 0
            }}>
              +{activeProject?.members_count ? activeProject.members_count - 5 : 11}
            </div>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-light)' }} />

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button style={topNavIconBtn} title="Chat"><MessageSquare size={17} /></button>
            <button style={topNavIconBtn} title="Share"><Share2 size={17} /></button>
            <button style={topNavIconBtn} title="Bookmark"><Star size={17} /></button>
            <button style={topNavIconBtn} title="Options"><MoreVertical size={17} /></button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Wavy Pastel Curves */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        background: 'var(--banner-gradient)',
        padding: '36px 44px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        {/* Soft SVG Background Waves matching RonasIT design */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.7,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          <svg
            viewBox="0 0 1000 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <path
              d="M0,120 C150,200 350,40 500,120 C650,200 850,50 1000,100 L1000,0 L0,0 Z"
              fill="rgba(255, 255, 255, 0.4)"
            />
            <path
              d="M0,160 C200,60 400,220 600,140 C800,60 900,180 1000,140 L1000,240 L0,240 Z"
              fill="rgba(255, 255, 255, 0.2)"
            />
          </svg>
        </div>

        {/* Left Title & Icon */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7C3AED, #9D75F7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(124, 58, 237, 0.25)'
          }}>
            <Activity size={26} strokeWidth={2.4} />
          </div>

          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--banner-text)',
              letterSpacing: '-0.5px'
            }}>
              {activeProject?.name || 'DentalPro'}
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'var(--banner-subtext)',
              fontWeight: 500
            }}>
              {activeProject?.description || 'Active Clinic Platform Redesign'}
            </p>
          </div>
        </div>

        {/* Right Stats Columns */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '44px',
          flexWrap: 'wrap'
        }}>
          {/* Created */}
          <div>
            <span style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--banner-subtext)',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              Created
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--banner-text)'
            }}>
              {activeProject?.created_date_str || 'Dec 3, 9:52 am'}
            </span>
          </div>

          {/* Due Date */}
          <div>
            <span style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--banner-subtext)',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              Due Date
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--banner-text)'
            }}>
              {activeProject?.due_date_str || 'JAN 24, 00:00 am'}
            </span>
          </div>

          {/* Tracked Time */}
          <div>
            <span style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--banner-subtext)',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              Tracked Time
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--banner-text)'
            }}>
              {activeProject?.tracked_time_str || '5 days, 39 sec'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const topNavIconBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: '6px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.15s ease'
};
