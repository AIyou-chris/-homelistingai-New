import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, MapPin, Home, Star, Calendar, Heart, Share2, ArrowRight } from 'lucide-react';

const DemoAppPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm Sarah's AI assistant. I can help you learn about this beautiful home at 123 Oak Street. What would you like to know?" },
    { id: 2, sender: 'user', text: "How's the neighborhood?" },
    { id: 3, sender: 'ai', text: "Great area! Schools rate 9/10, crime is low, 15 min to downtown. Family-friendly with parks nearby." },
    { id: 4, sender: 'user', text: "What's the HOA fee?" },
    { id: 5, sender: 'ai', text: "HOA is $150/month. Includes pool, gym, and landscaping. Very reasonable for the area!" }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log('DemoAppPage loaded successfully!');
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), sender: 'user', text: newMessage }]);
      setNewMessage('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Thanks for asking! I'd be happy to schedule a showing or answer more questions about this property." }]);
      }, 1000);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      background: 'transparent',
      overflow: 'hidden'
    }}>
      {/* Test Header */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '50px', 
        backgroundColor: 'red', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1000
      }}>
        DEMO APP LOADED SUCCESSFULLY - TEST HEADER
      </div>

      {/* Hero Section - Starts from absolute top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '256px',
        backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
        zIndex: 1
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>123 Oak Street</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>Downtown Area</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', border: 'none' }}>
              <Heart style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
            <button style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', border: 'none' }}>
              <Share2 style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>$499,000</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
              <span>3 bds</span>
              <span>2 ba</span>
              <span>1,850 sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div style={{ padding: '16px', marginTop: '256px', overflowY: 'auto', height: 'calc(100% - 256px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          <span style={{ color: '#6b7280' }}>123 Oak Street, Downtown Area</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: 'currentColor' }} />
          <span style={{ fontSize: '14px', color: '#6b7280' }}>4.9 (23 reviews)</span>
        </div>

        <p style={{ color: '#1f2937', marginBottom: '16px', margin: 0 }}>
          Beautiful 3-bedroom, 2-bathroom home with modern upgrades. Features include updated kitchen, 
          hardwood floors, and a spacious backyard. Perfect for families!
        </p>

        {/* Two Rows of Buttons */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 16px', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}>
              <Phone style={{ width: '16px', height: '16px' }} />
              <span>Call Agent</span>
            </button>
            <button style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 16px', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}>
              <Calendar style={{ width: '16px', height: '16px' }} />
              <span>Schedule Tour</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button style={{ backgroundColor: '#f3f4f6', color: '#1f2937', padding: '12px 16px', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}>
              <MessageCircle style={{ width: '16px', height: '16px' }} />
              <span>Chat with AI</span>
            </button>
            <button style={{ backgroundColor: '#f3f4f6', color: '#1f2937', padding: '12px 16px', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
              <span>Get Details</span>
            </button>
          </div>
        </div>

        {/* Agent Card */}
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                SM
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>Sarah Martinez</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Real Estate Agent</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>HomeListingAI</div>
              </div>
            </div>
            <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '500' }}>
              Contact
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>Chat with AI Assistant</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Ask me anything about this property!</p>
          
          <div style={{ marginBottom: '16px' }}>
            {messages.map((message) => (
              <div key={message.id} style={{ 
                marginBottom: '12px',
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'user' ? '#2563eb' : '#f3f4f6',
                  color: message.sender === 'user' ? 'white' : '#1f2937',
                  fontSize: '14px'
                }}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about the property..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageCircle style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAppPage; 