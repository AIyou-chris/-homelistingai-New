import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const fakeImages = [
  '/slider1.png',
  '/slider2.png',
  '/slider3.png',
  '/slider4.png',
  '/slider5.png',
  '/slider6.png',
  '/slider7.png',
];

export function MediaSlider({ onTalkToHouse }: { onTalkToHouse: () => void }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? fakeImages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === fakeImages.length - 1 ? 0 : i + 1));

  return (
    <div style={{ position: 'relative', width: '100vw', height: 350, overflow: 'hidden', margin: 0, padding: 0 }}>
      <img
        src={fakeImages[index]}
        alt={`Property ${index + 1}`}
        style={{ width: '100vw', height: 350, objectFit: 'cover', display: 'block' }}
      />
      {/* Prev Button */}
      <button
        onClick={prev}
        style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 24, cursor: 'pointer' }}
      >
        ◀
      </button>
      {/* Next Button */}
      <button
        onClick={next}
        style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 24, cursor: 'pointer' }}
      >
        ▶
      </button>
      {/* Talk to the House Button */}
      <button
        onClick={onTalkToHouse}
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 22px',
          borderRadius: 16,
          background: 'rgba(37,99,235,0.75)',
          color: '#fff',
          border: 'none',
          fontSize: 17,
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          opacity: 0.95,
          backdropFilter: 'blur(2px)',
          transition: 'background 0.2s',
        }}
      >
        <MessageCircle size={22} style={{ opacity: 0.92 }} />
        Talk to the House
      </button>
    </div>
  );
} 