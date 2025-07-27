import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import InstallAppModal from './shared/InstallAppModal';

const navItems = [
  { label: 'Home', icon: 'logo' },
  { label: 'Search', icon: '🔍' },
  { label: 'Save', icon: 'save' },
  { label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const [installModalOpen, setInstallModalOpen] = useState(false);

  return (
    <>
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
          <div 
            key={item.label} 
            onClick={() => item.label === 'Save' && setInstallModalOpen(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: item.label === 'Home' ? '#FF9900' : '#1A3578',
              fontWeight: 600,
              fontSize: 18,
              cursor: item.label === 'Save' ? 'pointer' : 'default',
            }}
          >
            {item.icon === 'logo' ? (
              <img src="/new hlailogo.png" alt="HomeListingAI" style={{ width: 24, height: 24 }} />
            ) : item.icon === 'save' ? (
              <HeartIcon style={{ width: 24, height: 24 }} />
            ) : (
              <span style={{ fontSize: 24 }}>{item.icon}</span>
            )}
            <span style={{ fontSize: 12 }}>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Install App Modal */}
      <InstallAppModal 
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </>
  );
} 