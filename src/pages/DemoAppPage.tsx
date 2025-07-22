import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Home, Users, Calendar, DollarSign, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-800">Sarah's AI Assistant</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <MessageCircle className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Property Card */}
        <div className="bg-white rounded-2xl shadow-lg m-4 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">$499,000</span>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold">123 Oak Street</h2>
              <p className="text-white/90">Beautiful 3 bed, 2 bath home</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">3</div>
                <div className="text-xs text-gray-500">Beds</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">2</div>
                <div className="text-xs text-gray-500">Baths</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">1,850</div>
                <div className="text-xs text-gray-500">Sqft</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span>Downtown Area • 2 car garage</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">4.9 (23 reviews)</span>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium">
                Schedule Tour
              </button>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-lg m-4 h-96 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Chat with AI Assistant</h3>
            <p className="text-sm text-gray-500">Ask me anything about this property!</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lead Capture */}
        <div className="bg-white rounded-2xl shadow-lg m-4 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Get More Info</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Your phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium">
              Get Property Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAppPage; 