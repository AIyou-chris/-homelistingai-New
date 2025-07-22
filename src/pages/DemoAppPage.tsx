import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, MapPin, Home, Star, Calendar, Heart, Share2, ArrowRight, Send, User, Bot } from 'lucide-react';

const DemoAppPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your AI listing assistant. I can help you learn about this beautiful home at 123 Oak Street. What would you like to know?" },
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderTopLeftRadius: '2.5rem',
      borderTopRightRadius: '2.5rem'
    }}>
      {/* Hero Section - Full Top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
        zIndex: 1
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
        
        {/* Top buttons */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', marginTop: '4px' }}>
              <span>3 bds</span>
              <span>2 ba</span>
              <span>1,850 sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '16px', 
        marginTop: '300px', 
        overflowY: 'auto', 
        height: 'calc(100% - 300px)',
        background: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          <span style={{ color: '#6b7280' }}>123 Oak Street, Downtown Area</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: 'currentColor' }} />
          <span style={{ fontSize: '14px', color: '#6b7280' }}>4.9 (23 reviews)</span>
        </div>

        <p style={{ color: '#1f2937', marginBottom: '16px', margin: 0, lineHeight: '1.5' }}>
          Beautiful 3-bedroom, 2-bathroom home with modern upgrades. Features include updated kitchen, 
          hardwood floors, and a spacious backyard. Perfect for families!
        </p>

        {/* Two Rows of Buttons - Like Real App */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <button style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              <Phone style={{ width: '16px', height: '16px' }} />
              <span>Call Agent</span>
            </button>
            <button style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              border: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Calendar style={{ width: '16px', height: '16px' }} />
              <span>Schedule Tour</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button style={{ 
              background: '#f3f4f6', 
              color: '#1f2937', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              border: 'none'
            }}>
              <MessageCircle style={{ width: '16px', height: '16px' }} />
              <span>Chat with AI</span>
            </button>
            <button style={{ 
              background: '#f3f4f6', 
              color: '#1f2937', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              border: 'none'
            }}>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
              <span>Get Details</span>
            </button>
          </div>
        </div>

        {/* Property Information Buttons */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>Property Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <button style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
              color: '#92400e', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              border: 'none',
              fontSize: '13px'
            }}>
              <MapPin style={{ width: '14px', height: '14px' }} />
              <span>Neighborhood</span>
            </button>
            <button style={{ 
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
              color: '#1e40af', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              border: 'none',
              fontSize: '13px'
            }}>
              <Home style={{ width: '14px', height: '14px' }} />
              <span>Schools</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button style={{ 
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
              color: '#166534', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              border: 'none',
              fontSize: '13px'
            }}>
              <Star style={{ width: '14px', height: '14px' }} />
              <span>Home Data</span>
            </button>
            <button style={{ 
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', 
              color: '#7c3aed', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              border: 'none',
              fontSize: '13px'
            }}>
              <Calendar style={{ width: '14px', height: '14px' }} />
              <span>Market Info</span>
            </button>
          </div>
        </div>

        {/* Agent Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          padding: '16px', 
          borderRadius: '16px', 
          marginBottom: '16px',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                SM
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>Sarah Martinez</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Real Estate Agent</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>HomeListingAI</div>
              </div>
            </div>
            <button style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}>
              Contact
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
          borderRadius: '16px', 
          padding: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Chat with AI Assistant</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Ask me anything about this property!</p>
          
          <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
            {messages.map((message) => (
              <div key={message.id} style={{ 
                marginBottom: '12px',
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  maxWidth: '80%'
                }}>
                  {message.sender === 'ai' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Bot style={{ width: '12px', height: '12px', color: 'white' }} />
                    </div>
                  )}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: message.sender === 'user' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : '#f3f4f6',
                    color: message.sender === 'user' ? 'white' : '#1f2937',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    boxShadow: message.sender === 'user' 
                      ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
                      : 'none'
                  }}>
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User style={{ width: '12px', height: '12px', color: 'white' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about the property..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '24px',
                fontSize: '14px',
                background: 'white',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Send style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAppPage; 