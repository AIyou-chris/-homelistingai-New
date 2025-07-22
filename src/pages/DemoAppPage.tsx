import React, { useState } from 'react';
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
    <div className="bg-transparent min-h-screen" style={{ margin: '-20px -20px 0 -20px', padding: 0 }}>
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-br from-blue-400 to-purple-500" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: '-30px',
        left: 0,
        right: 0,
        zIndex: 1,
        height: '320px'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="text-white">
            <h1 className="text-2xl font-bold">123 Oak Street</h1>
            <p className="text-white/90">Downtown Area</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-white/20 rounded-full">
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 bg-white/20 rounded-full">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white">
            <div className="text-3xl font-bold">$499,000</div>
            <div className="flex items-center space-x-4 text-sm">
              <span>3 bds</span>
              <span>2 ba</span>
              <span>1,850 sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">123 Oak Street, Downtown Area</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">4.9 (23 reviews)</span>
        </div>

        <p className="text-gray-800 mb-4">
          Beautiful 3-bedroom, 2-bathroom home with modern upgrades. Features include updated kitchen, 
          hardwood floors, and a spacious backyard. Perfect for families!
        </p>

        {/* Two Rows of Buttons */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call Agent</span>
            </button>
            <button className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Tour</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat with AI</span>
            </button>
            <button className="bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
              <ArrowRight className="w-4 h-4" />
              <span>Get Details</span>
            </button>
          </div>
        </div>

        {/* Agent Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">SM</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Sarah Martinez</h3>
              <p className="text-sm text-gray-600">Real Estate Agent</p>
              <p className="text-sm text-gray-600">HomeListingAI</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Contact
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Chat with AI Assistant</h3>
            <p className="text-sm text-gray-500">Ask me anything about this property!</p>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about the property..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAppPage; 