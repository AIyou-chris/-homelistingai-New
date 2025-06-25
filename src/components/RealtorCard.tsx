import React from 'react';
import { Instagram, Linkedin, Facebook, Phone, MessageCircle } from 'lucide-react';

export function RealtorCard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%)',
      padding: '48px 20px 20px 20px',
      borderRadius: 28,
      margin: '32px auto',
      boxShadow: '0 8px 32px rgba(37,99,235,0.13)',
      maxWidth: 650,
      width: '94%',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      border: '1.5px solid #c7d2fe',
    }}>
      {/* Centered, Larger Headshot */}
      <div style={{
        position: 'absolute',
        top: -52,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 104,
        height: 104,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '5px solid #fff',
        boxShadow: '0 4px 24px rgba(37,99,235,0.13)',
        background: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img 
          src="/realtor.png" 
          alt="Agent Headshot"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
      <div style={{ marginTop: 64, textAlign: 'center', minHeight: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 6 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold',
          }}>
            HL
          </div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>Sarah Johnson</div>
        </div>
        <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 4 }}>Senior Real Estate Agent</div>
        <div style={{ color: '#2563eb', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>HomeListingAI Realty</div>
        <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 14 }}>
          123 Main Street, Suite 200, Los Angeles, CA 90012
        </div>
        {/* Social Media Links as Pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <a href="#" style={{
            color: '#e4405f',
            fontSize: 15,
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: 999,
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
          }}>
            <Instagram size={17} />
            Instagram
          </a>
          <a href="#" style={{
            color: '#0077b5',
            fontSize: 15,
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: 999,
            background: '#f0f9ff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
          }}>
            <Linkedin size={17} />
            LinkedIn
          </a>
          <a href="#" style={{
            color: '#1877f2',
            fontSize: 15,
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: 999,
            background: '#f0f9ff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
          }}>
            <Facebook size={17} />
            Facebook
          </a>
        </div>
        {/* Call/Message Buttons as Pills */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, width: '100%', marginTop: 2 }}>
          <button style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.13)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}>
            <Phone size={17} />
            Call
          </button>
          <button style={{
            background: 'transparent',
            color: '#2563eb',
            border: '2px solid #2563eb',
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}>
            <MessageCircle size={17} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
} 