import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Calendar, User, Clock, Search } from 'lucide-react';

const CommunicationsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('messages');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Hi! I\'m interested in the Oak Street property. Can you tell me more about it?',
      time: '2 min ago',
      unread: true,
      avatar: 'JS',
      status: 'online'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'What\'s the HOA fee for the Pine Avenue listing?',
      time: '1 hour ago',
      unread: false,
      avatar: 'SJ',
      status: 'offline'
    },
    {
      id: 3,
      name: 'Mike Davis',
      lastMessage: 'I\'d like to schedule a showing for this weekend.',
      time: '3 hours ago',
      unread: false,
      avatar: 'MD',
      status: 'online'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'John Smith',
      content: 'Hi! I\'m interested in the Oak Street property. Can you tell me more about it?',
      time: '2:30 PM',
      type: 'received'
    },
    {
      id: 2,
      sender: 'AI Assistant',
      content: 'Hi John! I\'d be happy to help you learn more about the Oak Street property. It\'s a beautiful 3-bedroom, 2-bathroom home with 1,850 sqft. The neighborhood is excellent with great schools and it\'s just 15 minutes from downtown. Would you like to know about specific features or schedule a showing?',
      time: '2:31 PM',
      type: 'sent'
    },
    {
      id: 3,
      sender: 'John Smith',
      content: 'What\'s the price and are there any recent upgrades?',
      time: '2:32 PM',
      type: 'received'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage your conversations and messages</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', name: 'Messages', icon: MessageCircle },
            { id: 'calls', name: 'Calls', icon: Phone },
            { id: 'emails', name: 'Emails', icon: Mail },
            { id: 'appointments', name: 'Appointments', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Content */}
      {selectedTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        conversation.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </p>
                        <p className="text-xs text-gray-500">{conversation.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JS
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">John Smith</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'sent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'calls' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Call History</h3>
          <p className="text-gray-600">Call history will be displayed here.</p>
        </div>
      )}

      {selectedTab === 'emails' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Communications</h3>
          <p className="text-gray-600">Email communications will be displayed here.</p>
        </div>
      )}

      {selectedTab === 'appointments' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Appointments</h3>
          <p className="text-gray-600">Scheduled appointments will be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default CommunicationsPage; 