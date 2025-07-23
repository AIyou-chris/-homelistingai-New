import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square,
  Volume2,
  Phone,
  MessageSquare,
  Globe,
  Database,
  Settings,
  Plus,
  Trash2,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  RefreshCw,
  Zap,
  Brain,
  Users,
  Target,
  FileText,
  Upload,
  X,
  Sparkles,
  Copy,
  Download
} from 'lucide-react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';

interface VoiceAgent {
  id: string;
  name: string;
  description: string;
  voice: string;
  language: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  voiceEngine: 'PlayHT' | 'PlayDialog' | 'Neural';
  voiceId: string;
  callCount: number;
  avgCallDuration: number;
  lastActive: string;
  createdAt: string;
}

interface VoiceSample {
  id: string;
  name: string;
  text: string;
  audioUrl: string;
  duration: number;
  status: 'generated' | 'processing' | 'failed';
  createdAt: string;
}

const VoiceTrainingManager: React.FC = () => {
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [samples, setSamples] = useState<VoiceSample[]>([]);
  const [activeTab, setActiveTab] = useState<'agents' | 'samples' | 'training'>('agents');
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(null);
  const [trainingText, setTrainingText] = useState('');

  // Mock data
  useEffect(() => {
    const mockAgents: VoiceAgent[] = [
      {
        id: '1',
        name: 'Sarah - Sales Agent',
        description: 'AI-powered sales agent for property inquiries',
        voice: 'Sarah (Cloned)',
        language: 'English',
        status: 'active',
        voiceEngine: 'PlayHT',
        voiceId: 's3://voice-cloning-zero-shot/sarah-sales-agent',
        callCount: 47,
        avgCallDuration: 4.2,
        lastActive: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-10T09:00:00Z'
      },
      {
        id: '2',
        name: 'Mike - Support Agent',
        description: 'Customer support for technical issues',
        voice: 'Mike (Professional)',
        language: 'English',
        status: 'active',
        voiceEngine: 'PlayDialog',
        voiceId: 's3://voice-cloning-zero-shot/mike-support-agent',
        callCount: 23,
        avgCallDuration: 6.8,
        lastActive: '2024-01-15T11:15:00Z',
        createdAt: '2024-01-12T14:00:00Z'
      }
    ];

    const mockSamples: VoiceSample[] = [
      {
        id: '1',
        name: 'Property Welcome Message',
        text: 'Welcome to our beautiful 3-bedroom home in downtown. This stunning property features an open floor plan, modern kitchen, and spacious backyard perfect for entertaining.',
        audioUrl: '/audio/sample-1.mp3',
        duration: 12.5,
        status: 'generated',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Neighborhood Overview',
        text: 'This home is located in the heart of the city, just minutes from shopping, restaurants, and public transportation. The neighborhood is known for its excellent schools and family-friendly atmosphere.',
        audioUrl: '/audio/sample-2.mp3',
        duration: 15.2,
        status: 'generated',
        createdAt: '2024-01-15T11:15:00Z'
      }
    ];

    setAgents(mockAgents);
    setSamples(mockSamples);
  }, []);

  const handleCreateAgent = (agentData: Partial<VoiceAgent>) => {
    const newAgent: VoiceAgent = {
      id: `agent-${Date.now()}`,
      name: agentData.name || 'New Agent',
      description: agentData.description || '',
      voice: agentData.voice || 'Default Voice',
      language: agentData.language || 'English',
      status: 'training',
      voiceEngine: agentData.voiceEngine || 'PlayHT',
      voiceId: agentData.voiceId || '',
      callCount: 0,
      avgCallDuration: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [newAgent, ...prev]);
    setShowCreateAgent(false);
  };

  const handleGenerateAudio = async (text: string, voiceId: string) => {
    // Simulate PlayHT API call
    const newSample: VoiceSample = {
      id: `sample-${Date.now()}`,
      name: `Generated Audio ${new Date().toLocaleTimeString()}`,
      text: text,
      audioUrl: '/audio/generated-sample.mp3',
      duration: Math.random() * 20 + 5,
      status: 'processing',
      createdAt: new Date().toISOString()
    };
    
    setSamples(prev => [newSample, ...prev]);
    
    // Simulate processing
    setTimeout(() => {
      setSamples(prev => prev.map(sample => 
        sample.id === newSample.id 
          ? { ...sample, status: 'generated' as const }
          : sample
      ));
    }, 2000);
  };

  const handleVoiceCloning = async (audioFile: File) => {
    // Simulate PlayHT voice cloning
    const newAgent: VoiceAgent = {
      id: `cloned-${Date.now()}`,
      name: `Cloned Voice ${new Date().toLocaleTimeString()}`,
      description: 'Voice cloned from uploaded audio sample',
      voice: 'Custom Cloned Voice',
      language: 'English',
      status: 'training',
      voiceEngine: 'PlayHT',
      voiceId: `s3://voice-cloning-zero-shot/cloned-${Date.now()}`,
      callCount: 0,
      avgCallDuration: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    setAgents(prev => [newAgent, ...prev]);
    
    // Simulate training
    setTimeout(() => {
      setAgents(prev => prev.map(agent => 
        agent.id === newAgent.id 
          ? { ...agent, status: 'active' as const }
          : agent
      ));
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'inactive': return 'text-gray-500 bg-gray-500/10';
      case 'training': return 'text-yellow-500 bg-yellow-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getEngineColor = (engine: string) => {
    switch (engine) {
      case 'PlayHT': return 'text-blue-500 bg-blue-500/10';
      case 'PlayDialog': return 'text-purple-500 bg-purple-500/10';
      case 'Neural': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">PlayHT Voice Training</h2>
          <p className="text-gray-400">Create AI voices for chat with state-of-the-art TTS</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateAgent(true)}
          >
            Create Voice Agent
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Settings className="h-4 w-4" />}
            onClick={() => setShowVoiceSettings(true)}
          >
            Voice Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Voices</p>
              <p className="text-2xl font-bold text-white">{agents.filter(a => a.status === 'active').length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Audio Samples</p>
              <p className="text-2xl font-bold text-white">{samples.length}</p>
            </div>
            <Volume2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Duration</p>
              <p className="text-2xl font-bold text-white">2.3 hrs</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">98%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'agents'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Voice Agents
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'samples'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Audio Samples
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'training'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Voice Training
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'agents' && (
            <div className="space-y-6">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Mic className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{agent.name}</h3>
                        <p className="text-sm text-gray-400">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEngineColor(agent.voiceEngine)}`}>
                        {agent.voiceEngine}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Voice:</span>
                      <span className="text-white ml-2">{agent.voice}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Language:</span>
                      <span className="text-white ml-2">{agent.language}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Chats:</span>
                      <span className="text-white ml-2">{agent.callCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-4">
              {samples.map((sample) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="h-5 w-5 text-green-400" />
                      <div>
                        <h4 className="font-medium text-white">{sample.name}</h4>
                        <p className="text-sm text-gray-400">{Math.floor(sample.duration)}s</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sample.status === 'generated' ? 'text-green-500 bg-green-500/10' :
                        sample.status === 'processing' ? 'text-yellow-500 bg-yellow-500/10' :
                        'text-red-500 bg-red-500/10'
                      }`}>
                        {sample.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{sample.text.substring(0, 100)}...</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(sample.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">PlayHT Voice Training</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Voice Engines</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-300">PlayHT - State-of-the-art TTS</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-300">PlayDialog - Conversational AI</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-green-500" />
                        <span className="text-gray-300">Neural - High-quality synthesis</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-3">Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-300">Instant voice cloning (30s)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-gray-300">Multi-language support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-300">Real-time streaming</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-300">Chat integration ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Generate Audio Sample</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Voice</label>
                    <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a voice...</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Text to Convert</label>
                    <Textarea
                      placeholder="Enter text to convert to speech..."
                      rows={4}
                      value={trainingText}
                      onChange={(e) => setTrainingText(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="primary" 
                      leftIcon={<Mic className="h-4 w-4" />}
                      onClick={() => handleGenerateAudio(trainingText, 'voice-1')}
                    >
                      Generate Audio
                    </Button>
                    <Button variant="secondary" leftIcon={<Upload className="h-4 w-4" />}>
                      Clone Voice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Create Voice Agent</h3>
              <Button variant="ghost" onClick={() => setShowCreateAgent(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                <Input
                  type="text"
                  placeholder="Enter agent name"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <Textarea
                  placeholder="Describe the agent's purpose..."
                  rows={3}
                  value=""
                  onChange={() => {}}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Voice Engine</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="PlayHT">PlayHT (Recommended)</option>
                  <option value="PlayDialog">PlayDialog (Conversational)</option>
                  <option value="Neural">Neural (High Quality)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => setShowCreateAgent(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleCreateAgent({ name: 'New Agent' })}>
                  <Mic className="h-4 w-4 mr-2" />
                  Create Agent
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VoiceTrainingManager; 