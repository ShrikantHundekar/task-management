import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

export default function TimeManagementWidget() {
  const { timeLogs } = useTasks();

  const [hoveredDay, setHoveredDay] = useState(null);

  // Default points if API logs loading
  const days = [
    { day: 'Mon', hours: 7.8 },
    { day: 'Tue', hours: 7.2 },
    { day: 'Wed', hours: 8.2 },
    { day: 'Thus', hours: 4.8 },
    { day: 'Fri', hours: 7.6 },
    { day: 'Sat', hours: 7.1 },
    { day: 'Sun', hours: 8.0 },
  ];

  const data = timeLogs.length === 7 ? timeLogs : days;

  // Chart coordinates mapping (Width: 320, Height: 110)
  // X points: [20, 65, 110, 155, 200, 245, 290]
  // Max hours: 10, Min hours: 0 -> Y = 100 - (hours / 10) * 85
  const points = data.map((d, index) => {
    const x = 20 + index * 45;
    const y = 95 - (d.hours / 10) * 75;
    return { x, y, ...d };
  });

  // Generate smooth SVG curve path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},105 L ${points[0].x},105 Z`;

  const sunPoint = points[points.length - 1];

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-card)'
    }}>
      <span style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '6px'
      }}>
        Time Management
      </span>

      {/* Header Metric */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>36</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>h</span>
        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginLeft: '8px' }}>10</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>m</span>
      </div>

      {/* Interactive Wave Chart */}
      <div style={{ position: 'relative', width: '100%', height: '130px' }}>
        {/* Y Axis Grid Lines & Labels */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '9px',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}>
          <span>8h</span>
          <span>6h</span>
          <span>4h</span>
          <span>2h</span>
          <span>0</span>
        </div>

        <svg
          viewBox="0 0 320 120"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#waveGradient)" />

          {/* Smooth Bezier Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Vertical dashed indicator line for Sunday ("Now") */}
          <line
            x1={sunPoint.x}
            y1={sunPoint.y}
            x2={sunPoint.x}
            y2="105"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Now circle dot */}
          <circle
            cx={sunPoint.x}
            cy={sunPoint.y}
            r="4.5"
            fill="#1E293B"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Hover interactive dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill={hoveredDay === i ? '#7059E2' : 'transparent'}
              style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(null)}
            />
          ))}
        </svg>

        {/* "Now" Tooltip Banner */}
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '0px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          Now
        </div>

        {/* X Axis Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '14px',
          paddingRight: '6px',
          marginTop: '4px',
          fontSize: '10px',
          fontWeight: 500,
          color: 'var(--text-muted)'
        }}>
          {data.map((d, idx) => (
            <span
              key={idx}
              style={{
                color: idx === 6 ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: idx === 6 ? 700 : 500
              }}
            >
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
