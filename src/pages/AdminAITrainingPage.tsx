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
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  getTrainingDocuments, 
  createTrainingDocument, 
  updateTrainingDocument, 
  deleteTrainingDocument,
  getTrainingStats,
  uploadTrainingFile,
  getUrlScrapers,
  createUrlScraper,
  updateUrlScraper,
  deleteUrlScraper,
  scrapeWebsite,
  getPersonalities,
  createPersonality,
  updatePersonality,
  deletePersonality,
  getSystemPrompts,
  createSystemPrompt,
  updateSystemPrompt,
  deleteSystemPrompt,
  BRAIN_TYPES,
  PERSONALITY_TONES,
  VOICE_STYLES,
  RESPONSE_LENGTHS,
  EXPERTISE_LEVELS,
  type TrainingDocument,
  type TrainingSession,
  type UrlScraper,
  type Personality,
  type SystemPrompt
} from '../services/aiTrainingService';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminAITrainingPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // State for UI
  const [activeTab, setActiveTab] = useState<'documents' | 'sessions' | 'settings' | 'voice' | 'personalities' | 'prompts'>('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showScrapingModal, setShowScrapingModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAutoScanModal, setShowAutoScanModal] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for brain selection
  const [selectedBrain, setSelectedBrain] = useState<'god' | 'sales' | 'service' | 'help'>('god');
  const [selectedBrainFilter, setSelectedBrainFilter] = useState<string>('all');
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Real data from Supabase
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    documentsByBrain: { god: 0, sales: 0, service: 0, help: 0 },
    documentsByType: { document: 0, note: 0, faq: 0, file: 0 }
  });

  // URL Scraper state
  const [newUrl, setNewUrl] = useState('');
  const [newUrlBrain, setNewUrlBrain] = useState<'god' | 'sales' | 'service' | 'help'>('god');
  const [newUrlFrequency, setNewUrlFrequency] = useState('once');
  const [urlScrapers, setUrlScrapers] = useState<UrlScraper[]>([]);
  const [totalScrapedPages, setTotalScrapedPages] = useState(0);
  const [lastScrapeTime, setLastScrapeTime] = useState<string | null>(null);

  // Load data from Supabase
  useEffect(() => {
    loadTrainingData();
  }, [selectedBrainFilter]);

  const loadTrainingData = async () => {
    setLoading(true);
    try {
      const [docs, trainingStats, scrapers, personalitiesData, promptsData] = await Promise.all([
        getTrainingDocuments(selectedBrainFilter),
        getTrainingStats(),
        getUrlScrapers(),
        getPersonalities(selectedBrainFilter),
        getSystemPrompts(selectedBrainFilter)
      ]);
      
      setDocuments(docs);
      setStats(trainingStats);
      setUrlScrapers(scrapers);
      setPersonalities(personalitiesData);
      setSystemPrompts(promptsData);
      
      // Calculate scraping stats
      const totalPages = scrapers.reduce((sum, scraper) => sum + (scraper.lastScan ? 1 : 0), 0);
      setTotalScrapedPages(totalPages);
      
      const lastScrape = scrapers
        .filter(s => s.lastScan)
        .sort((a, b) => new Date(b.lastScan!).getTime() - new Date(a.lastScan!).getTime())[0];
      
      setLastScrapeTime(lastScrape?.lastScan || null);
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setLoading(true);
    try {
      for (const file of Array.from(files)) {
        // Upload file to Supabase storage
        const fileUrl = await uploadTrainingFile(file);
        
        // Create training document
        const newDoc = await createTrainingDocument(
          file.name,
          `Content from ${file.name}`, // You might want to extract text from the file
          'file',
          selectedBrain,
          fileUrl || undefined
        );
        
        if (newDoc) {
          setDocuments(prev => [newDoc, ...prev]);
        }
      }
      
      // Reload stats
      const trainingStats = await getTrainingStats();
      setStats(trainingStats);
      
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteScraping = async (url: string, category: string) => {
    setLoading(true);
    try {
      const newDoc = await createTrainingDocument(
        `Website Content from ${url}`,
        `Scraped content from ${url}`, // You would implement actual scraping
        'document',
        selectedBrain
      );
      
      if (newDoc) {
        setDocuments(prev => [newDoc, ...prev]);
        const trainingStats = await getTrainingStats();
        setStats(trainingStats);
      }
      
      setShowScrapingModal(false);
    } catch (error) {
      console.error('Error scraping website:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualInput = async (title: string, content: string, category: string) => {
    setLoading(true);
    try {
      const newDoc = await createTrainingDocument(
        title,
        content,
        'note',
        selectedBrain
      );
      
      if (newDoc) {
        setDocuments(prev => [newDoc, ...prev]);
        const trainingStats = await getTrainingStats();
        setStats(trainingStats);
      }
      
      setShowManualModal(false);
    } catch (error) {
      console.error('Error creating manual document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoScan = async (sources: string[], frequency: string) => {
    setLoading(true);
    try {
      // This would implement actual auto-scanning logic
      console.log('Auto-scan configured:', { sources, frequency });
      setShowAutoScanModal(false);
    } catch (error) {
      console.error('Error configuring auto-scan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const success = await deleteTrainingDocument(id);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        const trainingStats = await getTrainingStats();
        setStats(trainingStats);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // URL Scraper handlers
  const handleAddUrl = async () => {
    if (!newUrl) return;
    
    setLoading(true);
    try {
      const newScraper = await createUrlScraper({
        url: newUrl,
        brain: newUrlBrain,
        frequency: newUrlFrequency as 'once' | 'daily' | 'weekly' | 'monthly',
        status: 'active'
      });
      
      if (newScraper) {
        setUrlScrapers(prev => [newScraper, ...prev]);
        
        // If it's a one-time scrape, do it immediately
        if (newUrlFrequency === 'once') {
          await scrapeWebsite(newUrl, newUrlBrain);
        }
      }
      
      // Clear the form
      setNewUrl('');
      setNewUrlBrain('god');
      setNewUrlFrequency('once');
      
    } catch (error) {
      console.error('Error adding URL scraper:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleScraper = async (id: string) => {
    try {
      const scraper = urlScrapers.find(s => s.id === id);
      if (!scraper) return;
      
      const newStatus = scraper.status === 'active' ? 'paused' : 'active';
      const updatedScraper = await updateUrlScraper(id, { status: newStatus });
      
      if (updatedScraper) {
        setUrlScrapers(prev => prev.map(s => 
          s.id === id ? updatedScraper : s
        ));
      }
    } catch (error) {
      console.error('Error toggling scraper:', error);
    }
  };

  const handleDeleteScraper = async (id: string) => {
    try {
      const success = await deleteUrlScraper(id);
      if (success) {
        setUrlScrapers(prev => prev.filter(scraper => scraper.id !== id));
      }
    } catch (error) {
      console.error('Error deleting scraper:', error);
    }
  };

  // Personality Management
  const handleCreatePersonality = async (
    name: string,
    description: string,
    brainType: 'god' | 'sales' | 'service' | 'help',
    systemPrompt: string,
    tone: 'professional' | 'friendly' | 'enthusiastic' | 'calm' | 'casual' | 'formal',
    voiceStyle: 'male' | 'female' | 'neutral',
    responseLength: 'short' | 'medium' | 'long',
    expertiseLevel: 'beginner' | 'intermediate' | 'expert'
  ) => {
    setLoading(true);
    try {
      const newPersonality = await createPersonality(
        name,
        description,
        brainType,
        systemPrompt,
        tone,
        voiceStyle,
        responseLength,
        expertiseLevel
      );
      
      if (newPersonality) {
        setPersonalities(prev => [newPersonality, ...prev]);
        setShowPersonalityModal(false);
      }
    } catch (error) {
      console.error('Error creating personality:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonality = async (id: string, updates: Partial<Personality>) => {
    setLoading(true);
    try {
      const updatedPersonality = await updatePersonality(id, updates);
      if (updatedPersonality) {
        setPersonalities(prev => prev.map(p => p.id === id ? updatedPersonality : p));
      }
    } catch (error) {
      console.error('Error updating personality:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePersonality = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this personality?')) {
      setLoading(true);
      try {
        const success = await deletePersonality(id);
        if (success) {
          setPersonalities(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deleting personality:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // System Prompt Management
  const handleCreateSystemPrompt = async (
    name: string,
    description: string,
    brainType: 'god' | 'sales' | 'service' | 'help',
    promptContent: string,
    variables: string[],
    isDefault: boolean = false
  ) => {
    setLoading(true);
    try {
      const newPrompt = await createSystemPrompt(
        name,
        description,
        brainType,
        promptContent,
        variables,
        isDefault
      );
      
      if (newPrompt) {
        setSystemPrompts(prev => [newPrompt, ...prev]);
        setShowPromptModal(false);
      }
    } catch (error) {
      console.error('Error creating system prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSystemPrompt = async (id: string, updates: Partial<SystemPrompt>) => {
    setLoading(true);
    try {
      const updatedPrompt = await updateSystemPrompt(id, updates);
      if (updatedPrompt) {
        setSystemPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p));
      }
    } catch (error) {
      console.error('Error updating system prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSystemPrompt = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this system prompt?')) {
      setLoading(true);
      try {
        const success = await deleteSystemPrompt(id);
        if (success) {
          setSystemPrompts(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deleting system prompt:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return RefreshCw;
      case 'failed': return XCircle;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      case 'pending': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-blue-500/20 text-blue-400';
      case 'support': return 'bg-green-500/20 text-green-400';
      case 'product': return 'bg-purple-500/20 text-purple-400';
      case 'pricing': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    const matchesBrain = selectedBrainFilter === 'all' || doc.brain === selectedBrainFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesBrain;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Loading AI training...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Training Center</h1>
          <p className="text-gray-300 text-lg">Train your AI with documents, websites, and knowledge base content</p>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-600/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-200 mb-3">AI Training Legal Notice</h4>
              <div className="space-y-2 text-sm text-amber-100 leading-relaxed">
                <p><strong>Content Responsibility:</strong> You are responsible for ensuring all uploaded content complies with copyright laws, fair housing regulations, MLS rules, and local real estate laws.</p>
                <p><strong>AI Training Disclaimers:</strong> AI-generated responses are based on training data and may not always be accurate or compliant. Users must review and verify all AI outputs before use.</p>
                <p><strong>Data Usage:</strong> Uploaded content may be used to improve our AI systems. You retain ownership but grant us license for service improvement.</p>
                <p><strong>Compliance Requirements:</strong> Ensure all training content adheres to fair housing laws, MLS rules, and professional real estate standards.</p>
                <p><strong>Professional Review:</strong> AI-generated content should be reviewed by licensed professionals before use in marketing materials.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-white">{stats.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">God Brain</p>
                <p className="text-2xl font-bold text-white">{stats.documentsByBrain.god}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sales Brain</p>
                <p className="text-2xl font-bold text-white">{stats.documentsByBrain.sales}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Service Brain</p>
                <p className="text-2xl font-bold text-white">{stats.documentsByBrain.service}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* AI Brain Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">AI Brain Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRAIN_TYPES.map((brain) => (
              <div
                key={brain.id}
                onClick={() => setSelectedBrain(brain.id as 'god' | 'sales' | 'service' | 'help')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedBrain === brain.id
                    ? 'border-blue-400 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{brain.icon}</div>
                <h3 className="text-white font-medium mb-1">{brain.name}</h3>
                <p className="text-gray-400 text-sm">{brain.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white font-medium">Selected Brain: {BRAIN_TYPES.find(b => b.id === selectedBrain)?.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {BRAIN_TYPES.find(b => b.id === selectedBrain)?.description}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 mb-8 overflow-hidden"
        >
          <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeTab === 'documents'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              Training Documents
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeTab === 'sessions'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              Training Sessions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeTab === 'settings'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              Auto-Scan Settings
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeTab === 'voice'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              ElevenLabs Voice
            </button>
            <button
              onClick={() => setActiveTab('personalities')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeTab === 'personalities'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              AI Personalities
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeTab === 'prompts'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              System Prompts
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
                    <option value="all">All Types</option>
                    <option value="document">Document</option>
                    <option value="note">Note</option>
                    <option value="faq">FAQ</option>
                    <option value="file">File</option>
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
                  <select
                    value={selectedBrainFilter}
                    onChange={(e) => setSelectedBrainFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Brains</option>
                    <option value="god">God Brain</option>
                    <option value="sales">Sales Brain</option>
                    <option value="service">Service Brain</option>
                    <option value="help">Help Brain</option>
                  </select>
                </div>

                {/* Documents List */}
                <div className="space-y-4">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No training documents found</p>
                      <p className="text-gray-500 text-sm mt-2">Upload some documents to start training your AI</p>
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => {
                      const StatusIcon = getStatusIcon(doc.status);
                      return (
                        <div key={doc.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <FileText className="h-8 w-8 text-blue-400" />
                              <div>
                                <h3 className="text-white font-medium">{doc.title}</h3>
                                <p className="text-gray-400 text-sm">
                                  {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(doc.type)}`}>
                                    {doc.type}
                                  </span>
                                  <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                                    {doc.brain} Brain
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`h-5 w-5 ${getStatusColor(doc.status)}`} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* AI Personalities Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">AI Personalities</h3>
                      <p className="text-gray-400 text-sm">Manage AI personalities for different brain types</p>
                    </div>
                    <Button
                      variant="primary"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => setShowPersonalityModal(true)}
                    >
                      Create Personality
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {personalities.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No personalities found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {personalities.slice(0, 4).map((personality) => (
                          <div key={personality.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{personality.name}</h4>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdatePersonality(personality.id, { is_active: !personality.is_active })}
                                  className={personality.is_active ? "text-green-400" : "text-gray-400"}
                                >
                                  {personality.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePersonality(personality.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs mb-2">{personality.description}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400`}>
                                {personality.brain_type}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400`}>
                                {personality.tone}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs bg-green-500/20 text-green-400`}>
                                {personality.voice_style}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* System Prompts Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">System Prompts</h3>
                      <p className="text-gray-400 text-sm">Manage system prompts for different AI brain types</p>
                    </div>
                    <Button
                      variant="primary"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => setShowPromptModal(true)}
                    >
                      Create Prompt
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {systemPrompts.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No system prompts found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {systemPrompts.slice(0, 4).map((prompt) => (
                          <div key={prompt.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{prompt.name}</h4>
                              <div className="flex items-center space-x-1">
                                {prompt.is_default && (
                                  <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                                    Default
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateSystemPrompt(prompt.id, { is_active: !prompt.is_active })}
                                  className={prompt.is_active ? "text-green-400" : "text-gray-400"}
                                >
                                  {prompt.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSystemPrompt(prompt.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs mb-2">{prompt.description}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400`}>
                                {prompt.brain_type}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {prompt.variables?.length || 0} variables
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                              {prompt.prompt_content.substring(0, 80)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <Cpu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Training sessions coming soon</p>
                  <p className="text-gray-500 text-sm mt-2">Track AI training progress and performance</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* URL Scraper Configuration */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">URL Scraper Configuration</h3>
                  
                  {/* Add New URL */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="w-48">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Brain</label>
                        <select
                          value={newUrlBrain}
                          onChange={(e) => setNewUrlBrain(e.target.value as 'god' | 'sales' | 'service' | 'help')}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="god">God Brain</option>
                          <option value="sales">Sales Brain</option>
                          <option value="service">Service Brain</option>
                          <option value="help">Help Brain</option>
                        </select>
                      </div>
                      <div className="w-48">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Scan Frequency</label>
                        <select
                          value={newUrlFrequency}
                          onChange={(e) => setNewUrlFrequency(e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="once">One Time</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="pt-6">
                        <Button
                          variant="primary"
                          onClick={handleAddUrl}
                          disabled={!newUrl || loading}
                          className="whitespace-nowrap"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Add URL
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Active URL Scrapers */}
                  <div>
                    <h4 className="text-md font-medium text-white mb-4">Active URL Scrapers</h4>
                    {urlScrapers.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No active URL scrapers</p>
                        <p className="text-gray-500 text-sm mt-2">Add URLs above to start automated scraping</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {urlScrapers.map((scraper) => (
                          <div key={scraper.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <Globe className="h-5 w-5 text-blue-400" />
                                  <div>
                                    <h5 className="text-white font-medium">{scraper.url}</h5>
                                    <p className="text-gray-400 text-sm">
                                      {scraper.brain} Brain • {scraper.frequency} • Last scan: {scraper.lastScan || 'Never'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  scraper.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  scraper.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {scraper.status}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleScraper(scraper.id)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  {scraper.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteScraper(scraper.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Scraping Statistics */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">Scraping Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{urlScrapers.length}</p>
                      <p className="text-gray-400 text-sm">Active Scrapers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{totalScrapedPages}</p>
                      <p className="text-gray-400 text-sm">Pages Scraped</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{lastScrapeTime || 'Never'}</p>
                      <p className="text-gray-400 text-sm">Last Scrape</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <VoiceTrainingManager />
            )}

            {activeTab === 'personalities' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">AI Personalities</h3>
                    <p className="text-gray-400 text-sm">Create and manage AI personalities for different brain types</p>
                  </div>
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setShowPersonalityModal(true)}
                  >
                    Create Personality
                  </Button>
                </div>

                {/* Personalities List */}
                <div className="space-y-4">
                  {personalities.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No personalities found</p>
                      <p className="text-gray-500 text-sm mt-2">Create your first AI personality</p>
                    </div>
                  ) : (
                    personalities.map((personality) => (
                      <div key={personality.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{personality.name}</h3>
                              <p className="text-gray-400 text-sm">{personality.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400`}>
                                  {personality.brain_type} Brain
                                </span>
                                <span className={`px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400`}>
                                  {personality.tone}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs bg-green-500/20 text-green-400`}>
                                  {personality.voice_style}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdatePersonality(personality.id, { is_active: !personality.is_active })}
                              className={personality.is_active ? "text-green-400" : "text-gray-400"}
                            >
                              {personality.is_active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePersonality(personality.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">System Prompts</h3>
                    <p className="text-gray-400 text-sm">Manage system prompts for different AI brain types</p>
                  </div>
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setShowPromptModal(true)}
                  >
                    Create Prompt
                  </Button>
                </div>

                {/* Prompts List */}
                <div className="space-y-4">
                  {systemPrompts.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No system prompts found</p>
                      <p className="text-gray-500 text-sm mt-2">Create your first system prompt</p>
                    </div>
                  ) : (
                    systemPrompts.map((prompt) => (
                      <div key={prompt.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium">{prompt.name}</h3>
                              <p className="text-gray-400 text-sm">{prompt.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400`}>
                                  {prompt.brain_type} Brain
                                </span>
                                {prompt.is_default && (
                                  <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                                    Default
                                  </span>
                                )}
                                <span className="text-gray-400 text-xs">
                                  {prompt.variables?.length || 0} variables
                                </span>
                              </div>
                              <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                                {prompt.prompt_content.substring(0, 100)}...
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateSystemPrompt(prompt.id, { is_active: !prompt.is_active })}
                              className={prompt.is_active ? "text-green-400" : "text-gray-400"}
                            >
                              {prompt.is_active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSystemPrompt(prompt.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
                  placeholder="Enter document title..."
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
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

      {/* Personality Modal */}
      {showPersonalityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Create AI Personality</h3>
              <Button variant="ghost" onClick={() => setShowPersonalityModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Professional Sarah"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brain Type</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="god">God Brain</option>
                    <option value="sales">Sales Brain</option>
                    <option value="service">Service Brain</option>
                    <option value="help">Help Brain</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <Input
                  type="text"
                  placeholder="Brief description of the personality"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt</label>
                <Textarea
                  placeholder="Enter the system prompt for this personality..."
                  rows={4}
                  value=""
                  onChange={() => {}}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {PERSONALITY_TONES.map(tone => (
                      <option key={tone.value} value={tone.value}>{tone.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Voice Style</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {VOICE_STYLES.map(style => (
                      <option key={style.value} value={style.value}>{style.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Response Length</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {RESPONSE_LENGTHS.map(length => (
                      <option key={length.value} value={length.value}>{length.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expertise Level</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {EXPERTISE_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowPersonalityModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleCreatePersonality(
                  'New Personality',
                  'Description',
                  'sales',
                  'System prompt content',
                  'professional',
                  'female',
                  'medium',
                  'intermediate'
                )}>
                  <Users className="h-4 w-4 mr-2" />
                  Create Personality
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* System Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Create System Prompt</h3>
              <Button variant="ghost" onClick={() => setShowPromptModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Sales Assistant Prompt"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brain Type</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="god">God Brain</option>
                    <option value="sales">Sales Brain</option>
                    <option value="service">Service Brain</option>
                    <option value="help">Help Brain</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <Input
                  type="text"
                  placeholder="Brief description of the prompt"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prompt Content</label>
                <Textarea
                  placeholder="Enter the system prompt content... Use variables like {property_name}, {agent_name}, etc."
                  rows={6}
                  value=""
                  onChange={() => {}}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Variables (comma-separated)</label>
                <Input
                  type="text"
                  placeholder="e.g., {property_name}, {agent_name}, {company_name}"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is-default" className="rounded" />
                <label htmlFor="is-default" className="text-sm text-gray-300">Set as default for this brain type</label>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowPromptModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleCreateSystemPrompt(
                  'New System Prompt',
                  'Description',
                  'sales',
                  'System prompt content with variables',
                  ['{property_name}', '{agent_name}'],
                  false
                )}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Prompt
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