import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Globe, 
  Brain, 
  Settings, 
  Play, 
  Pause, 
  Square,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Users,
  BarChart3,
  Database,
  Cpu,
  Shield,
  Activity,
  X
} from 'lucide-react';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Textarea from '../components/shared/Textarea';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import VoiceTrainingManager from '../components/admin/VoiceTrainingManager';

interface TrainingDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'scraped' | 'manual';
  size: string;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  uploadedAt: string;
  processedAt?: string;
  content?: string;
  url?: string;
  source: 'upload' | 'scraping' | 'manual' | 'auto-scan';
  category: 'sales' | 'support' | 'general' | 'product' | 'pricing';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface TrainingSession {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  documents: number;
  processed: number;
  startedAt: string;
  completedAt?: string;
  progress: number;
}

const AdminAITrainingPage: React.FC = () => {
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'sessions' | 'settings' | 'voice'>('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showScrapingModal, setShowScrapingModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAutoScanModal, setShowAutoScanModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockDocuments: TrainingDocument[] = [
      {
        id: '1',
        name: 'Sales_Scripts_2024.pdf',
        type: 'pdf',
        size: '2.4 MB',
        status: 'completed',
        uploadedAt: '2024-01-15',
        processedAt: '2024-01-15',
        source: 'upload',
        category: 'sales',
        priority: 'high',
        tags: ['sales', 'scripts', '2024']
      },
      {
        id: '2',
        name: 'Customer_Support_FAQ.docx',
        type: 'doc',
        size: '1.2 MB',
        status: 'completed',
        uploadedAt: '2024-01-14',
        processedAt: '2024-01-14',
        source: 'upload',
        category: 'support',
        priority: 'medium',
        tags: ['support', 'faq', 'customer']
      },
      {
        id: '3',
        name: 'Website_Content_Scraped',
        type: 'scraped',
        size: '5.6 MB',
        status: 'processing',
        uploadedAt: '2024-01-13',
        source: 'scraping',
        category: 'general',
        priority: 'medium',
        tags: ['website', 'content', 'auto']
      },
      {
        id: '4',
        name: 'Product_Knowledge_Manual.txt',
        type: 'txt',
        size: '0.8 MB',
        status: 'completed',
        uploadedAt: '2024-01-12',
        processedAt: '2024-01-12',
        source: 'manual',
        category: 'product',
        priority: 'high',
        tags: ['product', 'manual', 'knowledge']
      }
    ];

    const mockSessions: TrainingSession[] = [
      {
        id: '1',
        name: 'Sales Training Session',
        status: 'active',
        documents: 15,
        processed: 12,
        startedAt: '2024-01-15T10:00:00Z',
        progress: 80
      },
      {
        id: '2',
        name: 'Support Knowledge Update',
        status: 'completed',
        documents: 8,
        processed: 8,
        startedAt: '2024-01-14T14:00:00Z',
        completedAt: '2024-01-14T16:30:00Z',
        progress: 100
      },
      {
        id: '3',
        name: 'Auto-Scan Weekly Update',
        status: 'paused',
        documents: 25,
        processed: 18,
        startedAt: '2024-01-13T09:00:00Z',
        progress: 72
      }
    ];

    setDocuments(mockDocuments);
    setSessions(mockSessions);
  }, []);

  const handleFileUpload = (files: FileList) => {
    setLoading(true);
    // Simulate file processing
    setTimeout(() => {
      const newDocuments: TrainingDocument[] = Array.from(files).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        type: (file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc' : 'txt') as 'pdf' | 'doc' | 'txt' | 'scraped' | 'manual',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'processing' as const,
        uploadedAt: new Date().toISOString().split('T')[0],
        source: 'upload' as const,
        category: 'general' as const,
        priority: 'medium' as const,
        tags: []
      }));
      setDocuments(prev => [...newDocuments, ...prev]);
      setLoading(false);
      setShowUploadModal(false);
    }, 2000);
  };

  const handleWebsiteScraping = (url: string, category: string) => {
    setLoading(true);
    setTimeout(() => {
      const newDocument: TrainingDocument = {
        id: `scrape-${Date.now()}`,
        name: `Website_Content_${new Date().toISOString().split('T')[0]}`,
        type: 'scraped',
        size: '3.2 MB',
        status: 'processing',
        uploadedAt: new Date().toISOString().split('T')[0],
        source: 'scraping',
        category: category as any,
        priority: 'medium',
        tags: ['website', 'scraped', 'auto'],
        url
      };
      setDocuments(prev => [newDocument, ...prev]);
      setLoading(false);
      setShowScrapingModal(false);
    }, 3000);
  };

  const handleManualInput = (title: string, content: string, category: string) => {
    const newDocument: TrainingDocument = {
      id: `manual-${Date.now()}`,
      name: title,
      type: 'txt',
      size: `${(content.length / 1024).toFixed(1)} KB`,
      status: 'completed',
      uploadedAt: new Date().toISOString().split('T')[0],
      processedAt: new Date().toISOString().split('T')[0],
      source: 'manual',
      category: category as any,
      priority: 'medium',
      tags: ['manual', 'input'],
      content
    };
    setDocuments(prev => [newDocument, ...prev]);
    setShowManualModal(false);
  };

  const handleAutoScan = (sources: string[], frequency: string) => {
    setLoading(true);
    setTimeout(() => {
      const newSession: TrainingSession = {
        id: `auto-${Date.now()}`,
        name: `Auto-Scan ${frequency}`,
        status: 'active',
        documents: 0,
        processed: 0,
        startedAt: new Date().toISOString(),
        progress: 0
      };
      setSessions(prev => [newSession, ...prev]);
      setLoading(false);
      setShowAutoScanModal(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10';
      case 'processing': return 'text-blue-500 bg-blue-500/10';
      case 'failed': return 'text-red-500 bg-red-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'text-purple-500 bg-purple-500/10';
      case 'support': return 'text-blue-500 bg-blue-500/10';
      case 'product': return 'text-green-500 bg-green-500/10';
      case 'pricing': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Training Center</h1>
              <p className="text-gray-400">Train your AI with documents, websites, and knowledge</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                leftIcon={<Brain className="h-4 w-4" />}
                onClick={() => setShowAutoScanModal(true)}
              >
                Auto-Scan Setup
              </Button>
              <Button
                variant="secondary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowUploadModal(true)}
              >
                Add Training Data
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-white">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-white">{sessions.filter(s => s.status === 'active').length}</p>
              </div>
              <Cpu className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Processing</p>
                <p className="text-2xl font-bold text-white">{documents.filter(d => d.status === 'processing').length}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-yellow-500 animate-spin" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{documents.filter(d => d.status === 'completed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 mb-8"
        >
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Training Documents
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Training Sessions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Auto-Scan Settings
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'voice'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Ultravox Voice
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="sales">Sales</option>
                    <option value="support">Support</option>
                    <option value="product">Product</option>
                    <option value="pricing">Pricing</option>
                    <option value="general">General</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white truncate">{doc.name}</h3>
                            <p className="text-sm text-gray-400">{doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Category:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                            {doc.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Priority:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.priority === 'high' ? 'text-red-500 bg-red-500/10' :
                            doc.priority === 'medium' ? 'text-yellow-500 bg-yellow-500/10' :
                            'text-green-500 bg-green-500/10'
                          }`}>
                            {doc.priority}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Source:</span>
                          <span className="text-white capitalize">{doc.source}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Uploaded:</span>
                          <span className="text-white">{doc.uploadedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-6">
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Cpu className="h-6 w-6 text-blue-400" />
                        <div>
                          <h3 className="font-medium text-white">{session.name}</h3>
                          <p className="text-sm text-gray-400">
                            {session.documents} documents • {session.processed} processed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'active' ? 'text-green-500 bg-green-500/10' :
                          session.status === 'paused' ? 'text-yellow-500 bg-yellow-500/10' :
                          session.status === 'completed' ? 'text-blue-500 bg-blue-500/10' :
                          'text-red-500 bg-red-500/10'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress:</span>
                        <span className="text-white">{session.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Started:</span>
                        <span className="text-white">{new Date(session.startedAt).toLocaleDateString()}</span>
                      </div>
                      {session.completedAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Completed:</span>
                          <span className="text-white">{new Date(session.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex space-x-2">
                        {session.status === 'active' && (
                          <Button size="sm" variant="ghost" className="text-yellow-400 hover:text-yellow-300">
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {session.status === 'paused' && (
                          <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">Auto-Scan Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Scan Frequency</label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Scan Sources</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-white">Website Content</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-white">Document Uploads</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-white">Email Attachments</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-white">Chat Transcripts</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">AI Training Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Learning Rate</label>
                      <input 
                        type="range" 
                        min="0.001" 
                        max="0.1" 
                        step="0.001" 
                        defaultValue="0.01"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400 mt-1">0.01 (recommended)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Batch Size</label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="16">16</option>
                        <option value="32">32</option>
                        <option value="64">64</option>
                        <option value="128">128</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <VoiceTrainingManager />
            )}
          </div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Upload Training Documents</h3>
              <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 mb-2">Drag and drop files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="secondary">Choose Files</Button>
                </label>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowScrapingModal(true)}>
                  <Globe className="h-4 w-4 mr-2" />
                  Scrape Website
                </Button>
                <Button variant="primary" onClick={() => setShowManualModal(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Manual Input
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scraping Modal */}
      {showScrapingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Scrape Website Content</h3>
              <Button variant="ghost" onClick={() => setShowScrapingModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="general">General</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="product">Product</option>
                  <option value="pricing">Pricing</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowScrapingModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleWebsiteScraping('https://example.com', 'general')}>
                  <Globe className="h-4 w-4 mr-2" />
                  Start Scraping
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manual Input Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Manual Training Input</h3>
              <Button variant="ghost" onClick={() => setShowManualModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <Input
                  type="text"
                  placeholder="Training document title"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="general">General</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="product">Product</option>
                  <option value="pricing">Pricing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <Textarea
                  placeholder="Enter training content here..."
                  rows={6}
                  value=""
                  onChange={() => {}}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowManualModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleManualInput('Manual Training', 'Sample content', 'general')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Add Training Data
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Auto-Scan Modal */}
      {showAutoScanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Auto-Scan Setup</h3>
              <Button variant="ghost" onClick={() => setShowAutoScanModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scan Frequency</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scan Sources</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-white">Website Content</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-white">Document Uploads</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-white">Email Attachments</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-white">Chat Transcripts</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowAutoScanModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleAutoScan(['website', 'documents'], 'daily')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Auto-Scan
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 border border-white/10">
            <LoadingSpinner />
            <p className="text-white mt-4">Processing training data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAITrainingPage; 