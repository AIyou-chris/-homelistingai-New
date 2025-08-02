import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  UserIcon,
  BoltIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  TrashIcon,
  PencilIcon,
  MicrophoneIcon,
  PlayIcon,
  PauseIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface Conversation {
  id: string;
  customerName: string;
  property: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'waiting';
  messageCount: number;
}

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'document' | 'faq' | 'property' | 'policy';
  content: string;
  lastUpdated: string;
  usage: number;
}

interface AIRecording {
  id: string;
  type: 'chat' | 'voice';
  title: string;
  duration?: string;
  timestamp: Date;
  agent: string;
  prospect: string;
  status: 'completed' | 'in-progress' | 'failed';
  summary?: string;
  transcript?: string;
  audioUrl?: string;
}

const AIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge' | 'recordings'>('chat');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<AIRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const conversations: Conversation[] = [
    {
      id: '1',
      customerName: 'Alex Rodriguez',
      property: '123 Oak Street',
      lastMessage: 'What are the school ratings in this area?',
      timestamp: '2 min ago',
      status: 'active',
      messageCount: 8
    },
    {
      id: '2',
      customerName: 'Maria Garcia',
      property: '456 Pine Avenue',
      lastMessage: 'Can I schedule a showing for this weekend?',
      timestamp: '15 min ago',
      status: 'waiting',
      messageCount: 3
    },
    {
      id: '3',
      customerName: 'John Smith',
      property: '789 Maple Drive',
      lastMessage: 'Thank you for the information!',
      timestamp: '1 hour ago',
      status: 'resolved',
      messageCount: 12
    },
    {
      id: '4',
      customerName: 'Sarah Chen',
      property: '321 Elm Street',
      lastMessage: 'What is the HOA fee for this property?',
      timestamp: '2 hours ago',
      status: 'active',
      messageCount: 5
    }
  ];

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'Property Showing Guidelines',
      type: 'policy',
      content: 'Standard procedures for conducting property showings including safety protocols...',
      lastUpdated: '2024-01-15',
      usage: 45
    },
    {
      id: '2',
      title: 'Financing Options FAQ',
      type: 'faq',
      content: 'Common questions about mortgage types, down payments, and loan approval process...',
      lastUpdated: '2024-01-14',
      usage: 78
    },
    {
      id: '3',
      title: 'School District Information',
      type: 'document',
      content: 'Comprehensive guide to local school districts, ratings, and enrollment information...',
      lastUpdated: '2024-01-13',
      usage: 32
    },
    {
      id: '4',
      title: '123 Oak Street Details',
      type: 'property',
      content: 'Detailed property information including features, neighborhood, and pricing history...',
      lastUpdated: '2024-01-12',
      usage: 23
    }
  ];

  const recordings: AIRecording[] = [
    {
      id: '1',
      type: 'chat',
      title: 'Property Inquiry - 123 Main St',
      timestamp: new Date('2024-01-15T10:30:00'),
      agent: 'Sarah Martinez',
      prospect: 'John Smith',
      status: 'completed',
      summary: 'Prospect inquired about 3-bedroom home, interested in viewing this weekend.',
      transcript: 'Prospect: Hi, I saw your listing for 123 Main St. Is it still available?\nAI: Yes, it is! Would you like to schedule a viewing?\nProspect: That would be great. How about this Saturday?\nAI: Perfect! I have availability at 2 PM. Would that work for you?'
    },
    {
      id: '2',
      type: 'voice',
      title: 'Voice Call - Downtown Condo',
      duration: '5:23',
      timestamp: new Date('2024-01-14T15:45:00'),
      agent: 'Sarah Martinez',
      prospect: 'Emily Johnson',
      status: 'completed',
      summary: 'Prospect called about downtown condo, discussed financing options.',
      audioUrl: '/sample-audio.mp3'
    },
    {
      id: '3',
      type: 'chat',
      title: 'Quick Question - School District',
      timestamp: new Date('2024-01-13T09:15:00'),
      agent: 'Sarah Martinez',
      prospect: 'Mike Wilson',
      status: 'completed',
      summary: 'Prospect asked about school district ratings and walkability score.',
      transcript: 'Prospect: What\'s the school district like in this area?\nAI: The area is served by the highly-rated Oakwood School District...'
    },
    {
      id: '4',
      type: 'voice',
      title: 'Follow-up Call - Investment Property',
      duration: '8:12',
      timestamp: new Date('2024-01-12T14:20:00'),
      agent: 'Sarah Martinez',
      prospect: 'Lisa Chen',
      status: 'completed',
      summary: 'Follow-up call about investment property, discussed rental potential.',
      audioUrl: '/sample-audio.mp3'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return DocumentTextIcon;
      case 'faq':
        return ChatBubbleLeftRightIcon;
      case 'property':
        return BoltIcon;
      case 'policy':
        return ChartBarIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-800';
      case 'faq':
        return 'bg-purple-100 text-purple-800';
      case 'property':
        return 'bg-green-100 text-green-800';
      case 'policy':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecordingStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecordingTypeIcon = (type: string) => {
    return type === 'chat' ? (
      <ChatBubbleLeftRightIcon className="w-5 h-5" />
    ) : (
      <MicrophoneIcon className="w-5 h-5" />
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKnowledge = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.prospect.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recording.summary && recording.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Chat & Assist</h1>
          <p className="text-gray-600 mt-2">Manage AI conversations, knowledge base, and recordings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Knowledge
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
            <CpuChipIcon className="w-4 h-4 mr-2" />
            Train AI
          </button>
        </div>
      </div>

      {/* AI Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">284</p>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{knowledgeItems.length}</p>
              <p className="text-sm text-gray-600">Knowledge Items</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <BoltIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">97%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-600">Availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-8 text-sm font-medium border-b-2 flex-1 ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 inline mr-2" />
              AI Conversations ({conversations.length})
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`py-4 px-8 text-sm font-medium border-b-2 flex-1 ${
                activeTab === 'knowledge'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5 inline mr-2" />
              Knowledge Base ({knowledgeItems.length})
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`py-4 px-8 text-sm font-medium border-b-2 flex-1 ${
                activeTab === 'recordings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5 inline mr-2" />
              Recordings ({recordings.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'chat' ? 'conversations' : activeTab === 'knowledge' ? 'knowledge base' : 'recordings'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center">
                          <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">{conversation.customerName}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                          {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">{conversation.messageCount} messages</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 font-medium">Property: {conversation.property}</p>
                        <p className="text-sm text-gray-700">"{conversation.lastMessage}"</p>
                        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                        View Chat
                      </button>
                      {conversation.status === 'waiting' && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                          Respond
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick Response Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick AI Response</h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message for the AI to send..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-4">
              {filteredKnowledge.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <TypeIcon className="w-5 h-5 text-gray-500" />
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Updated: {item.lastUpdated}</span>
                          <span>Used {item.usage} times</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Knowledge Upload Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Knowledge</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <CloudArrowUpIcon className="w-6 h-6 mr-2" />
                    Upload Document
                  </button>
                  <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <PlusIcon className="w-6 h-6 mr-2" />
                    Create FAQ
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recordings' && (
            <div className="space-y-4">
              {filteredRecordings.map((recording, index) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        recording.type === 'chat' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {getRecordingTypeIcon(recording.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{recording.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordingStatusColor(recording.status)}`}>
                            {recording.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{recording.prospect}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(recording.timestamp)}</span>
                          </div>
                          {recording.duration && (
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>{recording.duration}</span>
                            </div>
                          )}
                        </div>
                        
                        {recording.summary && (
                          <p className="mt-2 text-gray-700">{recording.summary}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRecording(recording)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      {recording.type === 'voice' && recording.audioUrl && (
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <PauseIcon className="w-5 h-5" />
                          ) : (
                            <PlayIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Training Status */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Training Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">97%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">284</div>
            <div className="text-sm text-gray-600">Conversations Handled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2.3s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">AI Training Progress: 85% complete</p>
        </div>
      </div>

      {/* Recording Details Modal */}
      {selectedRecording && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedRecording.title}</h2>
                <button
                  onClick={() => setSelectedRecording(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 capitalize">{selectedRecording.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRecordingStatusColor(selectedRecording.status)}`}>
                      {selectedRecording.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Prospect:</span>
                    <span className="ml-2">{selectedRecording.prospect}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2">{formatDate(selectedRecording.timestamp)}</span>
                  </div>
                </div>
                
                {selectedRecording.summary && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
                    <p className="text-gray-600">{selectedRecording.summary}</p>
                  </div>
                )}
                
                {selectedRecording.transcript && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Transcript</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRecording.transcript}</pre>
                    </div>
                  </div>
                )}
                
                {selectedRecording.type === 'voice' && selectedRecording.audioUrl && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Audio Recording</h3>
                    <audio controls className="w-full">
                      <source src={selectedRecording.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage; 