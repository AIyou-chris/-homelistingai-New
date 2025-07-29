import React, { useState, useRef, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  DocumentIcon,
  UserIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

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

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
}

interface AIPersonality {
  id: string;
  name: string;
  type: 'agent' | 'listing';
  personality: {
    style: 'professional' | 'friendly' | 'luxury' | 'casual' | 'expert' | 'consultant' | 'neighbor' | 'friend';
    tone: 'formal' | 'warm' | 'enthusiastic' | 'calm' | 'energetic' | 'trustworthy' | 'sophisticated' | 'approachable';
    expertise: 'general' | 'luxury' | 'first-time' | 'investment' | 'commercial' | 'new-construction' | 'historic' | 'modern';
    communication: 'detailed' | 'concise' | 'storytelling' | 'data-driven' | 'emotional' | 'factual' | 'persuasive' | 'educational';
  };
  voice: {
    // ElevenLabs Integration
    elevenlabsVoiceId: string;
    elevenlabsVoiceName: string;
    // Legacy voice settings (for fallback)
    gender: 'male' | 'female' | 'neutral';
    accent: 'american' | 'british' | 'australian' | 'canadian' | 'neutral';
    speed: 'slow' | 'normal' | 'fast';
    pitch: 'low' | 'medium' | 'high';
    emotion: 'calm' | 'enthusiastic' | 'professional' | 'friendly' | 'authoritative' | 'warm';
    // Voice settings for ElevenLabs
    stability: number; // 0-1
    similarity_boost: number; // 0-1
    style: number; // 0-1
    use_speaker_boost: boolean;
  };
  knowledge: {
    agentKnowledge: string[];
    listingKnowledge: string[];
    marketKnowledge: string[];
    customPrompts: string[];
  };
  settings: {
    autoRespond: boolean;
    leadQualification: boolean;
    followUpSequences: boolean;
    marketInsights: boolean;
    competitorAnalysis: boolean;
    personalizedRecommendations: boolean;
  };
}

const KnowledgeBasePage: React.FC = () => {
  const [files, setFiles] = useState<KnowledgeBaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'agent' | 'listing' | 'personality'>('agent');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI Personality State
  const [personalities, setPersonalities] = useState<AIPersonality[]>([
    {
      id: '1',
      name: 'Sarah - Luxury Specialist',
      type: 'agent',
      personality: {
        style: 'luxury',
        tone: 'sophisticated',
        expertise: 'luxury',
        communication: 'detailed'
      },
      voice: {
        // ElevenLabs Integration
        elevenlabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
        elevenlabsVoiceName: 'Rachel',
        // Legacy voice settings
        gender: 'female',
        accent: 'american',
        speed: 'normal',
        pitch: 'medium',
        emotion: 'professional',
        // ElevenLabs settings
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      },
      knowledge: {
        agentKnowledge: ['Company_Policies.pdf', 'Sales_Scripts.docx'],
        listingKnowledge: ['Property_Floor_Plan.pdf'],
        marketKnowledge: ['Market_Research.pdf'],
        customPrompts: ['Focus on luxury amenities and lifestyle benefits']
      },
      settings: {
        autoRespond: true,
        leadQualification: true,
        followUpSequences: true,
        marketInsights: true,
        competitorAnalysis: true,
        personalizedRecommendations: true
      }
    },
    {
      id: '2',
      name: 'Mike - First-Time Buyer Expert',
      type: 'agent',
      personality: {
        style: 'friendly',
        tone: 'warm',
        expertise: 'first-time',
        communication: 'educational'
      },
      voice: {
        // ElevenLabs Integration
        elevenlabsVoiceId: 'AZnzlk1XvdvUeBnXmlld', // Dom voice
        elevenlabsVoiceName: 'Dom',
        // Legacy voice settings
        gender: 'male',
        accent: 'american',
        speed: 'normal',
        pitch: 'medium',
        emotion: 'friendly',
        // ElevenLabs settings
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      },
      knowledge: {
        agentKnowledge: ['Company_Policies.pdf', 'Sales_Scripts.docx'],
        listingKnowledge: ['Neighborhood_Info.docx'],
        marketKnowledge: ['Market_Research.pdf'],
        customPrompts: ['Explain processes clearly, be patient with questions']
      },
      settings: {
        autoRespond: true,
        leadQualification: true,
        followUpSequences: true,
        marketInsights: true,
        competitorAnalysis: false,
        personalizedRecommendations: true
      }
    }
  ]);
  
  const [selectedPersonality, setSelectedPersonality] = useState<string>('1');
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState<AIPersonality | null>(null);
  
  // ElevenLabs Voices State
  const [elevenlabsVoices, setElevenlabsVoices] = useState<ElevenLabsVoice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // Mock data
  const mockFiles: KnowledgeBaseItem[] = [
    // Agent Knowledge Base (permanent)
    {
      id: '1',
      name: 'Company_Policies.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      description: 'Company policies and procedures',
      knowledgeBaseType: 'agent'
    },
    {
      id: '2',
      name: 'Sales_Scripts.docx',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: '2024-01-14',
      description: 'Standard sales scripts and responses',
      knowledgeBaseType: 'agent'
    },
    {
      id: '3',
      name: 'Market_Research.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadedAt: '2024-01-12',
      description: 'Market analysis and trends',
      knowledgeBaseType: 'agent'
    },
    // Listing Knowledge Base (property-specific)
    {
      id: '4',
      name: 'Property_Floor_Plan.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      propertyId: 'prop-1',
      propertyName: '123 Main Street',
      description: 'Detailed floor plan with measurements',
      knowledgeBaseType: 'listing'
    },
    {
      id: '5',
      name: 'Neighborhood_Info.docx',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: '2024-01-14',
      propertyId: 'prop-1',
      propertyName: '123 Main Street',
      description: 'Local amenities and school information',
      knowledgeBaseType: 'listing'
    },
    {
      id: '6',
      name: 'Property_Photos.zip',
      type: 'image',
      size: '15.7 MB',
      uploadedAt: '2024-01-13',
      propertyId: 'prop-2',
      propertyName: '456 Oak Avenue',
      description: 'High-resolution property photos',
      knowledgeBaseType: 'listing'
    }
  ];

  React.useEffect(() => {
    setFiles(mockFiles);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFiles: KnowledgeBaseItem[] = Array.from(selectedFiles).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString().split('T')[0],
        propertyId: activeTab === 'listing' && selectedProperty !== 'all' ? selectedProperty : undefined,
        propertyName: activeTab === 'listing' && selectedProperty !== 'all' ? 'Selected Property' : undefined,
        description: '',
        knowledgeBaseType: activeTab
      }));

      setFiles(prev => [...newFiles, ...prev]);
      setUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const getFileType = (filename: string): KnowledgeBaseItem['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) return 'document';
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
        return <DocumentIcon className="h-8 w-8 text-green-500" />;
      case 'document':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = selectedProperty === 'all' || file.propertyId === selectedProperty;
    const matchesKnowledgeBase = file.knowledgeBaseType === activeTab;
    return matchesSearch && matchesProperty && matchesKnowledgeBase;
  });

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Fetch ElevenLabs voices
  const fetchElevenLabsVoices = async () => {
    setLoadingVoices(true);
    try {
      const { getElevenLabsVoices, POPULAR_VOICES } = await import('../../services/elevenlabsService');
      const voices = await getElevenLabsVoices();
      
      // If API returns voices, use them; otherwise use popular voices
      if (voices && voices.length > 0) {
        setElevenlabsVoices(voices);
      } else {
        setElevenlabsVoices(POPULAR_VOICES);
      }
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      // Use popular voices as fallback
      const { POPULAR_VOICES } = await import('../../services/elevenlabsService');
      setElevenlabsVoices(POPULAR_VOICES);
    } finally {
      setLoadingVoices(false);
    }
  };

  // Fetch voices when personality tab is active
  useEffect(() => {
    if (activeTab === 'personality' && elevenlabsVoices.length === 0) {
      fetchElevenLabsVoices();
    }
  }, [activeTab]);

  // Preview voice function
  const previewVoice = async () => {
    if (!selectedVoice) return;
    
    try {
      const { generateElevenLabsSpeech } = await import('../../services/elevenlabsService');
      const previewText = "Hello! I'm your AI assistant for this property. I can help you learn about this home, answer questions, and guide you through the buying process. What would you like to know?";
      
      const audioUrl = await generateElevenLabsSpeech(previewText, selectedVoice);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error previewing voice:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">🧠 AI Knowledge Base & Personalities</h1>
          <p className="mt-1 text-sm text-gray-300">
            Create unique AI personalities and manage knowledge for agents and listings
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {activeTab === 'personality' && (
            <Button 
              variant="secondary" 
              leftIcon={<UserIcon className="h-4 w-4" />}
              onClick={() => setShowPersonalityModal(true)}
            >
              Create New Personality
            </Button>
          )}
          {activeTab !== 'personality' && (
            <Button 
              variant="primary" 
              leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip"
          />
        </div>
      </div>

      {/* Knowledge Base Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('agent')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'agent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Agent Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('listing')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'listing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Listing Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('personality')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'personality'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            AI Personalities
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'agent' ? (
            <div className="text-center">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Agent Knowledge Base</h3>
              <p className="text-gray-600 mb-4">
                Upload company policies, sales scripts, market research, and other information that stays with your agent permanently.
              </p>
            </div>
          ) : activeTab === 'listing' ? (
            <div className="text-center">
              <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Listing Knowledge Base</h3>
              <p className="text-gray-600 mb-4">
                Upload property-specific documents, photos, and information that goes with each listing.
              </p>
              
              {/* Property Selection for Listing Knowledge Base */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property for Upload:
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Select a property...</option>
                  <option value="prop-1">123 Main Street</option>
                  <option value="prop-2">456 Oak Avenue</option>
                  <option value="prop-3">789 Pine Drive</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Personalities Overview */}
              <div className="text-center mb-8">
                <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">🤖 AI Personalities</h3>
                <p className="text-gray-600 mb-4">
                  Create unique AI personalities with custom voices, knowledge, and communication styles
                </p>
              </div>

              {/* Personality Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Personality:
                </label>
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {personalities.map(personality => (
                    <option key={personality.id} value={personality.id}>
                      {personality.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Personality Details */}
              {selectedPersonality && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  {(() => {
                    const personality = personalities.find(p => p.id === selectedPersonality);
                    if (!personality) return null;
                    
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">{personality.name}</h4>
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setEditingPersonality(personality);
                                setShowPersonalityModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setPersonalities(prev => prev.filter(p => p.id !== personality.id));
                                setSelectedPersonality(personalities[0]?.id || '');
                              }}
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
                                <span className="text-sm text-gray-900 capitalize">{personality.personality.style}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tone:</span>
                                <span className="text-sm text-gray-900 capitalize">{personality.personality.tone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Expertise:</span>
                                <span className="text-sm text-gray-900 capitalize">{personality.personality.expertise.replace('-', ' ')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Communication:</span>
                                <span className="text-sm text-gray-900 capitalize">{personality.personality.communication.replace('-', ' ')}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Voice Settings</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">ElevenLabs Voice:</span>
                                <span className="text-sm text-gray-900 font-medium">{personality.voice.elevenlabsVoiceName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Voice ID:</span>
                                <span className="text-sm text-gray-500 font-mono">{personality.voice.elevenlabsVoiceId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Stability:</span>
                                <span className="text-sm text-gray-900">{personality.voice.stability}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Similarity Boost:</span>
                                <span className="text-sm text-gray-900">{personality.voice.similarity_boost}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Style:</span>
                                <span className="text-sm text-gray-900">{personality.voice.style}</span>
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
                                {personality.knowledge.agentKnowledge.map((item, index) => (
                                  <div key={index} className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h6 className="text-xs font-medium text-gray-600 mb-2">Listing Knowledge</h6>
                              <div className="space-y-1">
                                {personality.knowledge.listingKnowledge.map((item, index) => (
                                  <div key={index} className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h6 className="text-xs font-medium text-gray-600 mb-2">Market Knowledge</h6>
                              <div className="space-y-1">
                                {personality.knowledge.marketKnowledge.map((item, index) => (
                                  <div key={index} className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Settings */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">AI Features</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(personality.settings).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className="text-sm text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload {activeTab === 'agent' ? 'Agent' : 'Property'} Documents
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to browse. Supported formats: PDF, DOC, DOCX, TXT, Images, ZIP
          </p>
          <Button 
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            Choose Files
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Property Filter - Only show for listing knowledge base */}
          {activeTab === 'listing' && (
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Properties</option>
              <option value="prop-1">123 Main Street</option>
              <option value="prop-2">456 Oak Avenue</option>
              <option value="prop-3">789 Pine Drive</option>
            </select>
          )}

          {/* Clear Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setSelectedProperty('all');
            }}
            className="justify-center bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
          <p className="text-sm text-gray-600">
            {filteredFiles.length} of {files.filter(f => f.knowledgeBaseType === activeTab).length} files
          </p>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedProperty !== 'all'
                ? 'Try adjusting your filters'
                : `Upload your first ${activeTab === 'agent' ? 'agent' : 'property'} document to get started`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                      <p className="text-xs text-gray-600">{file.size}</p>
                      {file.propertyName && (
                        <p className="text-xs text-blue-600">{file.propertyName}</p>
                      )}
                      {file.description && (
                        <p className="text-xs text-gray-600 mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-red-600"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Uploaded {file.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            <div className="text-sm text-gray-500">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">22.4 MB</div>
            <div className="text-sm text-gray-500">Total Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">15%</div>
            <div className="text-sm text-gray-500">Storage Used</div>
          </div>
        </div>
      </div>

      {/* Personality Creation/Edit Modal */}
      {showPersonalityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingPersonality ? 'Edit AI Personality' : 'Create New AI Personality'}
              </h2>
              <button
                onClick={() => {
                  setShowPersonalityModal(false);
                  setEditingPersonality(null);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Personality Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., Sarah - Luxury Specialist"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md">
                      <option value="agent">Agent Personality</option>
                      <option value="listing">Listing Personality</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personality Traits */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Personality Traits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                    <select className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md">
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="luxury">Luxury</option>
                      <option value="casual">Casual</option>
                      <option value="expert">Expert</option>
                      <option value="consultant">Consultant</option>
                      <option value="neighbor">Neighbor</option>
                      <option value="friend">Friend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                    <select className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md">
                      <option value="formal">Formal</option>
                      <option value="warm">Warm</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="calm">Calm</option>
                      <option value="energetic">Energetic</option>
                      <option value="trustworthy">Trustworthy</option>
                      <option value="sophisticated">Sophisticated</option>
                      <option value="approachable">Approachable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expertise</label>
                    <select className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md">
                      <option value="general">General</option>
                      <option value="luxury">Luxury</option>
                      <option value="first-time">First-Time Buyers</option>
                      <option value="investment">Investment</option>
                      <option value="commercial">Commercial</option>
                      <option value="new-construction">New Construction</option>
                      <option value="historic">Historic Properties</option>
                      <option value="modern">Modern Properties</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Communication</label>
                    <select className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md">
                      <option value="detailed">Detailed</option>
                      <option value="concise">Concise</option>
                      <option value="storytelling">Storytelling</option>
                      <option value="data-driven">Data-Driven</option>
                      <option value="emotional">Emotional</option>
                      <option value="factual">Factual</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Voice Settings */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Voice Settings</h3>
                
                {/* ElevenLabs Voice Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">ElevenLabs Voice</label>
                  {loadingVoices ? (
                    <div className="text-gray-400 text-sm">Loading voices...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {elevenlabsVoices.map(voice => (
                        <div 
                          key={voice.voice_id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedVoice === voice.voice_id 
                              ? 'border-blue-500 bg-blue-900/20' 
                              : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => setSelectedVoice(voice.voice_id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{voice.name}</h4>
                              <p className="text-gray-400 text-sm">{voice.description}</p>
                              <p className="text-gray-500 text-xs font-mono">{voice.voice_id}</p>
                            </div>
                            <div className={`text-sm ${
                              selectedVoice === voice.voice_id 
                                ? 'text-blue-400 font-medium' 
                                : 'text-gray-400'
                            }`}>
                              {selectedVoice === voice.voice_id ? '✓ Selected' : 'Select'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Voice Preview */}
                  {selectedVoice && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                      <h5 className="text-white font-medium mb-2">Selected Voice Preview</h5>
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={previewVoice}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          🔊 Preview Voice
                        </button>
                        <span className="text-gray-400 text-sm">
                          Click to hear a sample of this voice
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stability (0-1)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      defaultValue="0.5"
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">Higher = more consistent</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Similarity Boost (0-1)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      defaultValue="0.75"
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">Higher = more similar to original</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Style (0-1)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      defaultValue="0.0"
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">Higher = more expressive</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Speaker Boost</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Enable</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Enhances voice clarity</div>
                  </div>
                </div>
              </div>

              {/* Knowledge Sources */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Knowledge Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agent Knowledge Files</label>
                    <select multiple className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md h-32">
                      {files.filter(f => f.knowledgeBaseType === 'agent').map(file => (
                        <option key={file.id} value={file.name}>{file.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Listing Knowledge Files</label>
                    <select multiple className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md h-32">
                      {files.filter(f => f.knowledgeBaseType === 'listing').map(file => (
                        <option key={file.id} value={file.name}>{file.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Features */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">AI Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'autoRespond',
                    'leadQualification', 
                    'followUpSequences',
                    'marketInsights',
                    'competitorAnalysis',
                    'personalizedRecommendations'
                  ].map(feature => (
                    <div key={feature} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={feature}
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={feature} className="text-sm text-white capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Prompts */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Custom Prompts</h3>
                <textarea
                  placeholder="Add custom instructions for this personality..."
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md h-24"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPersonalityModal(false);
                    setEditingPersonality(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Handle save logic here
                    setShowPersonalityModal(false);
                    setEditingPersonality(null);
                  }}
                >
                  {editingPersonality ? 'Update Personality' : 'Create Personality'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage; 