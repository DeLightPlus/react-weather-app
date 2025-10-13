// Sidebar.jsx
import React from 'react';
import './Sidebar.css';

export default function Sidebar({ isDark, active, onNavClick }) {
  const bgColor = isDark ? 'transparent' : 'transparent';
  return (
    <aside className={`sidebar ${isDark ? 'dark' : ''}`} style={{ background: bgColor }}>
      <button className="nav-btn" onClick={() => onNavClick('time')}>
        <span role="img" aria-label="Time">🕙</span>
        <span className="label">Time</span>
      </button>
      <button className="nav-btn" onClick={() => onNavClick('weather')}>
        <span role="img" aria-label="Weather">⛅</span>
        <span className="label">Weather</span>
      </button>
      <button className="nav-btn" onClick={() => onNavClick('news')}>
        <span role="img" aria-label="News">📰</span>
        <span className="label">News</span>
      </button>
    </aside>
  );
}
