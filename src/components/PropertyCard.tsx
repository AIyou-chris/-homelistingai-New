import React from 'react';

export default function PropertyCard() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 4px 24px rgba(26,53,120,0.08)',
      padding: 24,
      margin: '32px auto 96px',
      maxWidth: 400,
      position: 'relative',
    }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Home" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        <div style={{
          position: 'absolute',
          top: 32,
          left: 32,
          background: '#FF9900',
          color: '#fff',
          borderRadius: 8,
          padding: '4px 12px',
          fontWeight: 700,
          fontSize: 16,
        }}>FOR SALE</div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#1A3578' }}>$650,000</div>
      <div style={{ fontSize: 18, fontWeight: 500, margin: '8px 0 2px', color: '#1A3578' }}>1280 Camino Alto</div>
      <div style={{ fontSize: 15, color: '#888', marginBottom: 12 }}>San Francisco, CA</div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <span>🛏 3 Beds</span>
        <span>🛁 2 Baths</span>
        <span>📐 1,800 sqft</span>
      </div>
      <button style={{
        background: '#FF9900',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '12px 32px',
        fontWeight: 700,
        fontSize: 18,
        margin: '16px 0',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(255,153,0,0.10)'
      }}>Book a Tour</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div>
          <span style={{ marginRight: 8 }}>📅</span>
          <span style={{ marginRight: 8 }}>🔗</span>
          <span style={{ marginRight: 8 }}>📱</span>
        </div>
        <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 24 }}>🤖</span>
        </div>
      </div>
    </div>
  );
} 