import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, MapPin, Home, Star, Calendar, Heart, Share2, ArrowRight, Send, User, Bot } from 'lucide-react';
import MobileListingApp from '../components/shared/MobileListingApp';

// Demo property data
const demoProperty = {
  id: 'demo-123',
  title: 'Beautiful 3-Bedroom Home in Prime Location',
  address: '123 Oak Street, Springfield, IL 62701',
  price: 475000,
  bedrooms: 3,
  bathrooms: 2.5,
  squareFootage: 1850,
  description: 'Stunning 3-bedroom home in a prime location with modern amenities and beautiful landscaping. This property features an open floor plan, updated kitchen, and a spacious backyard perfect for entertaining.',
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ],
  agent: {
    name: 'Sarah Johnson',
    title: 'HomeListingAI Agent',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@homelistingai.com'
  }
};

const DemoAppPage: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
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

  const handleChatOpen = () => {
    setShowChat(true);
  };

  const handleScheduleShowing = () => {
    alert('Demo: Schedule showing functionality would open here');
  };

  const handleSaveListing = () => {
    alert('Demo: Save listing instructions would appear here');
  };

  const handleContactAgent = () => {
    alert('Demo: Contact agent functionality would open here');
  };

  const handleShareListing = () => {
    alert('Demo: Share listing modal would open here');
  };

  const handleFeatureClick = (featureId: string) => {
    const featureMessages = {
      'video-tour': 'Demo: Video tour would play here',
      'amenities': 'Demo: Amenities list would show here',
      'neighborhood': 'Demo: Neighborhood information would display here',
      'schedule': 'Demo: Schedule showing would open here',
      'map': 'Demo: Interactive map would load here',
      'comparables': 'Demo: Comparable properties would show here',
      'financing': 'Demo: Financing options would display here',
      'history': 'Demo: Property history would show here',
      'virtual-tour': 'Demo: Virtual tour would start here',
      'reports': 'Demo: Property reports would display here'
    };
    
    alert(featureMessages[featureId as keyof typeof featureMessages] || 'Demo: Feature coming soon');
  };

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
      {/* Mobile App Frame */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Phone Frame */}
        <div className="absolute inset-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
          <MobileListingApp
            property={demoProperty}
            onChatOpen={handleChatOpen}
            onScheduleShowing={handleScheduleShowing}
            onSaveListing={handleSaveListing}
            onContactAgent={handleContactAgent}
            onShareListing={handleShareListing}
            onFeatureClick={handleFeatureClick}
            isDemo={true}
          />
        </div>

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full h-2/3 rounded-t-3xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">AI Assistant</div>
                    <div className="text-sm text-gray-500">Online now</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <span className="text-gray-600">×</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoAppPage; 