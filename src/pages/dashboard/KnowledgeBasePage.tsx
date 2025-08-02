import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  SparklesIcon,
  UserIcon,
  HomeIcon,
  GlobeAltIcon,
  EyeIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Clock } from 'lucide-react';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { getMarketData, getMarketInsights } from '../../services/marketDataService';

// Knowledge Base interfaces
interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text' | 'document';
  size: string;
  uploadedAt: string;
  propertyId?: string;
  propertyName?: string;
  description?: string;
  knowledgeBaseType: 'agent' | 'listing' | 'personality';
}

interface KnowledgeBaseText {
  id: string;
  title: string;
  content: string;
  knowledgeBaseType: 'agent' | 'listing';
  createdAt: string;
}

interface KnowledgeBaseURLScraper {
  id: string;
  url: string;
  title: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  lastScraped?: string;
  status: 'active' | 'paused' | 'error';
  knowledgeBaseType: 'agent' | 'listing';
  createdAt: string;
}

// Chat Conversation interface
interface ChatConversation {
  id: string;
  title: string;
  participant: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'completed' | 'archived';
  messageCount: number;
  duration: string;
}

// Voice Recording interface
interface VoiceRecording {
  id: string;
  title: string;
  duration: string;
  fileSize: string;
  recordedAt: string;
  status: 'processing' | 'completed' | 'error';
  transcript?: string;
  quality: 'high' | 'medium' | 'low';
}

const KnowledgeBasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agent' | 'listing' | 'personality' | 'chats' | 'recordings' | 'market'>('agent');
  const [files, setFiles] = useState<KnowledgeBaseItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [knowledgeTexts, setKnowledgeTexts] = useState<KnowledgeBaseText[]>([]);
  const [urlScrapers, setUrlScrapers] = useState<KnowledgeBaseURLScraper[]>([]);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [editingText, setEditingText] = useState<KnowledgeBaseText | null>(null);
  const [editingScraper, setEditingScraper] = useState<KnowledgeBaseURLScraper | null>(null);
  
  // Market Knowledge Base state
  const [marketAddress, setMarketAddress] = useState('');
  const [marketData, setMarketData] = useState<any>(null);
  const [loadingMarketData, setLoadingMarketData] = useState(false);

  // Chat conversations data
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([
    {
      id: '1',
      title: 'Property Inquiry - 123 Main St',
      participant: 'John Smith',
      lastMessage: 'I\'m interested in scheduling a viewing',
      timestamp: '2 hours ago',
      status: 'active',
      messageCount: 15,
      duration: '45 min'
    },
    {
      id: '2',
      title: 'Financing Questions - 456 Oak Ave',
      participant: 'Sarah Johnson',
      lastMessage: 'What are the current mortgage rates?',
      timestamp: '1 day ago',
      status: 'completed',
      messageCount: 8,
      duration: '20 min'
    },
    {
      id: '3',
      title: 'Neighborhood Info - 789 Pine St',
      participant: 'Mike Davis',
      lastMessage: 'Tell me about the local schools',
      timestamp: '3 days ago',
      status: 'archived',
      messageCount: 12,
      duration: '35 min'
    }
  ]);

  // Voice recordings data
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([
    {
      id: '1',
      title: 'Property Overview - 123 Main St',
      duration: '3:45',
      fileSize: '2.3 MB',
      recordedAt: '2 hours ago',
      status: 'completed',
      transcript: 'Welcome to 123 Main Street. This beautiful 3-bedroom home features...',
      quality: 'high'
    },
    {
      id: '2',
      title: 'Neighborhood Tour - Downtown Area',
      duration: '5:20',
      fileSize: '3.1 MB',
      recordedAt: '1 day ago',
      status: 'completed',
      transcript: 'Let me take you on a tour of the downtown area...',
      quality: 'high'
    },
    {
      id: '3',
      title: 'Financing Options Discussion',
      duration: '4:15',
      fileSize: '2.8 MB',
      recordedAt: '3 days ago',
      status: 'completed',
      transcript: 'Today we\'ll discuss various financing options...',
      quality: 'medium'
    }
  ]);

  // Knowledge Base functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploading(true);
    
    files.forEach((file) => {
      const newFile: KnowledgeBaseItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString(),
        knowledgeBaseType: activeTab as 'agent' | 'listing' | 'personality'
      };
      
      setFiles(prev => [...prev, newFile]);
    });
    
    setTimeout(() => setUploading(false), 1000);
  };

  const getFileType = (filename: string): KnowledgeBaseItem['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['txt', 'md'].includes(ext || '')) return 'text';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: KnowledgeBaseItem['type']) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
      case 'image':
        return <EyeIcon className="h-8 w-8 text-green-500" />;
      case 'text':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch market data for a property
  const fetchMarketData = async () => {
    if (!marketAddress.trim()) return;
    
    setLoadingMarketData(true);
    try {
      const data = await getMarketData(marketAddress);
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoadingMarketData(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base & AI Training</h1>
          <p className="text-gray-600">Manage your AI assistant's knowledge, conversations, and voice recordings.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex space-x-8 border-b border-gray-200 px-6">
          {[
            { id: 'agent', name: 'Agent Knowledge Base', icon: UserIcon },
            { id: 'listing', name: 'Listing Knowledge Base', icon: HomeIcon },
            { id: 'personality', name: 'AI Personalities', icon: SparklesIcon },
            { id: 'chats', name: 'Chat Conversations', icon: ChatBubbleLeftRightIcon },
            { id: 'recordings', name: 'Voice Recordings', icon: MicrophoneIcon },
            { id: 'market', name: 'Market Knowledge Base', icon: ChartBarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab Content */}
          {activeTab === 'agent' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">📚 Agent Knowledge Base</h4>
                <p className="text-sm text-blue-700">
                  Upload documents, scripts, and materials that will help your AI understand your expertise and approach.
          </p>
        </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Agent Files</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
            <Button 
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                >
                  {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
              </div>

              {/* File List */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Uploaded Files</h4>
                <div className="space-y-3">
                  {files.filter(file => file.knowledgeBaseType === 'agent').map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {files.filter(file => file.knowledgeBaseType === 'agent').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No files uploaded yet. Upload documents to train your AI assistant.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Input Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">📝 Add Text Knowledge</h4>
            <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingText({
                        id: Date.now().toString(),
                        title: '',
                        content: '',
                        knowledgeBaseType: 'agent',
                        createdAt: new Date().toISOString()
                      });
                      setShowTextModal(true);
                    }}
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                  >
                    Add Text
            </Button>
                </div>
                
                <div className="space-y-3">
                  {knowledgeTexts.filter(text => text.knowledgeBaseType === 'agent').map((text) => (
                    <div key={text.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{text.title}</p>
                          <p className="text-xs text-gray-500">{text.content.substring(0, 50)}...</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingText(text);
                            setShowTextModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setKnowledgeTexts(prev => prev.filter(t => t.id !== text.id))}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Scraper Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">🌐 URL Scraper</h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingScraper({
                        id: Date.now().toString(),
                        url: '',
                        title: '',
                        frequency: 'once',
                        status: 'active',
                        knowledgeBaseType: 'agent',
                        createdAt: new Date().toISOString()
                      });
                      setShowScraperModal(true);
                    }}
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                  >
                    Add Scraper
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {urlScrapers.filter(scraper => scraper.knowledgeBaseType === 'agent').map((scraper) => (
                    <div key={scraper.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{scraper.title}</p>
                          <p className="text-xs text-gray-500">{scraper.url}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scraper.status)}`}>
                              {scraper.status}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {scraper.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingScraper(scraper);
                            setShowScraperModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUrlScrapers(prev => prev.filter(s => s.id !== scraper.id))}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listing' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">🏠 Listing Knowledge Base</h4>
                <p className="text-sm text-green-700">
                  Upload property-specific documents, floor plans, and materials for this listing.
                </p>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
                />
                <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Listing Files</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                >
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </Button>
      </div>

              {/* File List */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Uploaded Files</h4>
                <div className="space-y-3">
                  {files.filter(file => file.knowledgeBaseType === 'listing').map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                        </div>
                      </div>
          <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
          </button>
                    </div>
                  ))}
                  {files.filter(file => file.knowledgeBaseType === 'listing').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No files uploaded yet. Upload property documents to train your AI assistant.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Input Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">📝 Add Text Knowledge</h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingText({
                        id: Date.now().toString(),
                        title: '',
                        content: '',
                        knowledgeBaseType: 'listing',
                        createdAt: new Date().toISOString()
                      });
                      setShowTextModal(true);
                    }}
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                  >
                    Add Text
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {knowledgeTexts.filter(text => text.knowledgeBaseType === 'listing').map((text) => (
                    <div key={text.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{text.title}</p>
                          <p className="text-xs text-gray-500">{text.content.substring(0, 50)}...</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingText(text);
                            setShowTextModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setKnowledgeTexts(prev => prev.filter(t => t.id !== text.id))}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
        </div>

              {/* URL Scraper Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">🌐 URL Scraper</h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingScraper({
                        id: Date.now().toString(),
                        url: '',
                        title: '',
                        frequency: 'once',
                        status: 'active',
                        knowledgeBaseType: 'listing',
                        createdAt: new Date().toISOString()
                      });
                      setShowScraperModal(true);
                    }}
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                  >
                    Add Scraper
                  </Button>
            </div>
                
                <div className="space-y-3">
                  {urlScrapers.filter(scraper => scraper.knowledgeBaseType === 'listing').map((scraper) => (
                    <div key={scraper.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{scraper.title}</p>
                          <p className="text-xs text-gray-500">{scraper.url}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scraper.status)}`}>
                              {scraper.status}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {scraper.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingScraper(scraper);
                            setShowScraperModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUrlScrapers(prev => prev.filter(s => s.id !== scraper.id))}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
              </div>
            </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personality' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-900 mb-2">🤖 AI Personality Setup</h4>
                <p className="text-sm text-purple-700">
                  Configure your AI assistant's personality, voice, and behavior for this listing.
                </p>
              </div>

              {/* Personality Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active AI Personality:
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="professional">Professional Agent</option>
                  <option value="friendly">Friendly Agent</option>
                  <option value="luxury">Luxury Specialist</option>
                  <option value="casual">Casual Agent</option>
                </select>
              </div>

              {/* Selected Personality Details */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Professional Agent</h4>
                          <div className="flex space-x-2">
                            <Button
                        variant="ghost"
                              size="sm"
                        onClick={() => {}}
                            >
                              Edit
                            </Button>
                            <Button
                        variant="ghost"
                              size="sm"
                        onClick={() => {}}
                        className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Personality Traits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Personality Traits</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Style:</span>
                          <span className="text-sm text-gray-900 capitalize">Professional</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tone:</span>
                          <span className="text-sm text-gray-900 capitalize">Formal</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Expertise:</span>
                          <span className="text-sm text-gray-900 capitalize">General</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Communication:</span>
                          <span className="text-sm text-gray-900 capitalize">Detailed</span>
                              </div>
                            </div>
                          </div>


                  </div>

                  {/* Knowledge Sources */}
                          <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Knowledge Sources</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h6 className="text-xs font-medium text-gray-600 mb-2">Agent Knowledge</h6>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">Company_Policies.pdf</div>
                          <div className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">Sales_Scripts.docx</div>
                              </div>
                              </div>
                      <div>
                        <h6 className="text-xs font-medium text-gray-600 mb-2">Listing Knowledge</h6>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">Property_Floor_Plan.pdf</div>
                              </div>
                              </div>
                      <div>
                        <h6 className="text-xs font-medium text-gray-600 mb-2">Market Knowledge</h6>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">Market_Research.pdf</div>
                              </div>
                            </div>
                          </div>
                        </div>

                  {/* AI Features */}
                        <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">AI Features</h5>
                    
                    {/* Knowledge Priority Dropdown */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        🎯 Knowledge Priority - Which knowledge base should the AI listen to most?
                      </label>
                      <select className="w-full px-3 py-2 border border-blue-300 bg-white text-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="agent">Agent Knowledge Base (Company policies, scripts, expertise)</option>
                        <option value="listing">Listing Knowledge Base (Property details, floor plans, features)</option>
                        <option value="market">Market Knowledge Base (Market data, comps, trends)</option>
                        <option value="balanced">Balanced (Equal weight to all knowledge bases)</option>
                        <option value="dynamic">Dynamic (Adapts based on conversation context)</option>
                      </select>
                      <p className="text-xs text-blue-700 mt-2">
                        This determines which knowledge base the AI prioritizes when responding to questions.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <div>
                            <h6 className="text-sm font-medium text-gray-900">Auto Respond</h6>
                            <p className="text-xs text-gray-600">Automatically respond to common questions and inquiries</p>
                                  </div>
                              </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                            </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <div>
                            <h6 className="text-sm font-medium text-gray-900">Lead Qualification</h6>
                            <p className="text-xs text-gray-600">Automatically qualify leads based on criteria and responses</p>
                                  </div>
                              </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                            </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <div>
                            <h6 className="text-sm font-medium text-gray-900">Follow Up Sequences</h6>
                            <p className="text-xs text-gray-600">Send automated follow-up messages to nurture leads</p>
                                  </div>
                              </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                            </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Market Insights</h6>
                            <p className="text-xs text-gray-600">Provide real-time market data and property insights</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                          </div>
                        </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <div>
                            <h6 className="text-sm font-medium text-gray-900">Competitor Analysis</h6>
                            <p className="text-xs text-gray-600">Analyze and compare with similar properties in the area</p>
                              </div>
                          </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Personalized Recommendations</h6>
                            <p className="text-xs text-gray-600">Suggest properties and services based on user preferences</p>
                </div>
            </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
        </div>
      </div>

              {/* Voice Selection System */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">🎤 Voice Selection</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Choose from our collection of professional voices for your AI assistant
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: '1', name: 'Rachel', description: 'Professional and clear', selected: true },
                    { id: '2', name: 'Adam', description: 'Warm and friendly', selected: false },
                    { id: '3', name: 'Sarah', description: 'Enthusiastic and energetic', selected: false },
                    { id: '4', name: 'Michael', description: 'Authoritative and trustworthy', selected: false }
                  ].map((voice) => (
                    <div
                      key={voice.id}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        voice.selected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{voice.name}</h5>
                        {voice.selected && (
                          <div className="text-blue-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
        </div>
                        )}
      </div>
                      <p className="text-xs text-gray-600">{voice.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💬 Chat Conversations</h4>
                <p className="text-sm text-blue-700">
                  Review and manage your AI assistant's chat conversations with potential buyers.
                </p>
          </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
                  <select className="px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
            </select>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {chatConversations.map((conversation) => (
                      <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{conversation.title}</h4>
                            <p className="text-sm text-gray-600">{conversation.participant}</p>
                            <p className="text-sm text-gray-500">{conversation.lastMessage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                              {conversation.status}
                            </span>
                            <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{conversation.messageCount} messages</p>
                            <p>{conversation.duration} duration</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recordings' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">🎤 Voice Recordings</h4>
                <p className="text-sm text-green-700">
                  Manage your AI assistant's voice recordings and transcripts.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Voice Recordings</h3>
                  <div className="flex items-center space-x-3">
                    <select className="px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All</option>
                      <option value="high">High Quality</option>
                      <option value="medium">Medium Quality</option>
                      <option value="low">Low Quality</option>
                    </select>
          <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<MicrophoneIcon className="h-4 w-4" />}
                    >
                      New Recording
          </Button>
        </div>
      </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {voiceRecordings.map((recording) => (
                      <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <MicrophoneIcon className="w-5 h-5 text-green-600" />
        </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{recording.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{recording.duration}</span>
                              <span>{recording.fileSize}</span>
                              <span>{recording.recordedAt}</span>
          </div>
                            {recording.transcript && (
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {recording.transcript}
                              </p>
                      )}
                    </div>
                  </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(recording.status)}`}>
                              {recording.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(recording.quality)}`}>
                              {recording.quality}
                            </span>
                  </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <PlayIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <DocumentTextIcon className="w-4 h-4" />
                            </Button>
                </div>
                </div>
              </div>
            ))}
          </div>
      </div>
          </div>
          </div>
          )}

          {activeTab === 'market' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-orange-900 mb-2">📊 Market Knowledge Base</h4>
                <p className="text-sm text-orange-700">
                  Get real-time market data, comparable sales, and market insights for any property.
                </p>
      </div>

              {/* Market Data Input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">🏠 Property Market Analysis</h4>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                    <Input
                      value={marketAddress}
                      onChange={(e) => setMarketAddress(e.target.value)}
                      placeholder="Enter property address (e.g., 123 Main St, City, State)"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="primary"
                      onClick={fetchMarketData}
                      disabled={loadingMarketData || !marketAddress.trim()}
                    >
                      {loadingMarketData ? 'Loading...' : 'Get Market Data'}
                    </Button>
                  </div>
            </div>

                {/* Market Data Display */}
                {marketData && (
            <div className="space-y-6">
                    {/* Market Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                      <h5 className="text-lg font-medium text-gray-900 mb-4">📈 Market Overview</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <ChartBarIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Market Trend</span>
                  </div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            marketData.marketTrend === 'rising' ? 'bg-green-100 text-green-800' :
                            marketData.marketTrend === 'declining' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {marketData.marketTrend.charAt(0).toUpperCase() + marketData.marketTrend.slice(1)}
                  </div>
                </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPinIcon className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Avg Price/Sq Ft</span>
              </div>
                          <p className="text-2xl font-bold text-gray-900">${marketData.averagePricePerSqFt.toFixed(2)}</p>
                  </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Days on Market</span>
                  </div>
                          <p className="text-2xl font-bold text-gray-900">{marketData.daysOnMarket}</p>
                  </div>
                  </div>
                </div>

                    {/* Market Insights */}
                    <div className="space-y-4">
                      <h5 className="text-lg font-medium text-gray-900">💡 Market Insights</h5>
                      {marketData.insights.map((insight: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <h6 className="text-sm font-medium text-gray-900">{insight.title}</h6>
              </div>
                          <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                          
                          {/* Display insight data based on type */}
                          {insight.type === 'comparable' && insight.data && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-700">Recent Sales:</p>
                              {insight.data.slice(0, 3).map((comp: any, compIndex: number) => (
                                <div key={compIndex} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                  {comp.address.oneLine} - ${comp.sale.amount.toLocaleString()}
                            </div>
                              ))}
                            </div>
                          )}
                          
                          {insight.type === 'trend' && insight.data && (
                            <div className="text-xs text-gray-600">
                              <p>Trend: {insight.data.trend}</p>
                              <p>Avg Price/Sq Ft: ${insight.data.avgPricePerSqFt.toFixed(2)}</p>
                              <p>Days on Market: {insight.data.daysOnMarket}</p>
                          </div>
                          )}
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                  
                {/* Instructions */}
                {!marketData && (
                  <div className="text-center py-8">
                    <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Get Market Intelligence</h3>
                    <p className="text-gray-600 mb-4">
                      Enter a property address to get real-time market data, comparable sales, and market insights.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• Comparable property sales</p>
                      <p>• Market trend analysis</p>
                      <p>• Neighborhood data</p>
                      <p>• Property history</p>
                      </div>
                    </div>
                  )}
                </div>
                  </div>
          )}
                  </div>
      </div>

      {/* Text Modal */}
      {showTextModal && editingText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Text Knowledge</h3>
            <div className="space-y-4">
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={editingText.title}
                  onChange={(e) => setEditingText(prev => prev ? {...prev, title: e.target.value} : null)}
                  placeholder="Enter title..."
                />
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={editingText.content}
                  onChange={(e) => setEditingText(prev => prev ? {...prev, content: e.target.value} : null)}
                  placeholder="Enter content..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                    </div>
                  </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowTextModal(false);
                  setEditingText(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (editingText) {
                    setKnowledgeTexts(prev => [...prev, editingText]);
                    setShowTextModal(false);
                    setEditingText(null);
                  }
                }}
              >
                Save
              </Button>
                </div>
              </div>
                  </div>
      )}

      {/* Scraper Modal */}
      {showScraperModal && editingScraper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add URL Scraper</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={editingScraper.title}
                  onChange={(e) => setEditingScraper(prev => prev ? {...prev, title: e.target.value} : null)}
                  placeholder="Enter title..."
                />
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <Input
                  value={editingScraper.url}
                  onChange={(e) => setEditingScraper(prev => prev ? {...prev, url: e.target.value} : null)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select 
                  value={editingScraper.frequency}
                  onChange={(e) => setEditingScraper(prev => prev ? {...prev, frequency: e.target.value as any} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                  setShowScraperModal(false);
                  setEditingScraper(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                  if (editingScraper) {
                    setUrlScrapers(prev => [...prev, editingScraper]);
                    setShowScraperModal(false);
                    setEditingScraper(null);
                  }
                }}
              >
                Save
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage; 