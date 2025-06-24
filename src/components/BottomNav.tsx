import React from 'react';

const navItems = [
  { label: 'Home', icon: '🏠' },
  { label: 'Search', icon: '🔍' },
  { label: 'Favorites', icon: '❤️' },
  { label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '2px solid #f5f5f5',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 64,
      zIndex: 100,
    }}>
      {navItems.map((item) => (
        <div key={item.label} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: item.label === 'Home' ? '#FF9900' : '#1A3578',
          fontWeight: 600,
          fontSize: 18,
        }}>
          <span style={{ fontSize: 24 }}>{item.icon}</span>
          <span style={{ fontSize: 12 }}>{item.label}</span>
        </div>
      ))}
    </nav>
  );
} 