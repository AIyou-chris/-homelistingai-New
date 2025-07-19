import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Mic, 
  MessageSquare, 
  Upload, 
  Settings, 
  Users, 
  FileText, 
  Volume2, 
  Bot, 
  Zap,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { aiControlService, type AIPersonality, type DocumentUpload, type VoiceConfig, type BrainStatus } from '../../services/aiControlService';
import * as knowledgeBaseService from '../../services/knowledgeBaseService';
import { supabase } from '../../lib/supabase';
import { Switch } from '../../components/ui/switch';

const BRAINS = [
  { id: 'sales', label: 'Sales Knowledge Base' },
  { id: 'support', label: 'Support Knowledge Base' },
  { id: 'god', label: 'God Knowledge Base' },
];

const AIControlCenter: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // AI Personalities
  const [personalities, setPersonalities] = useState<AIPersonality[]>([]);

  // Document Uploads
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  // Voice Configurations
  const [voiceConfigs, setVoiceConfigs] = useState<VoiceConfig[]>([]);

  // AI Brain Status (now fetched from backend)
  const [brainStatus, setBrainStatus] = useState<Record<string, BrainStatus>>({});

  // Add state for three-brain KB UI
  const [kbScrapeUrl, kbSetScrapeUrl] = useState<{ [key: string]: string }>({});
  const [kbUploading, kbSetUploading] = useState<{ [key: string]: boolean }>({});
  const [kbScraping, kbSetScraping] = useState<{ [key: string]: boolean }>({});
  const [kbEntries, kbSetEntries] = useState<{ [key: string]: knowledgeBaseService.KnowledgeBaseEntry[] }>({});
  const [kbLoadingEntries, kbSetLoadingEntries] = useState<{ [key: string]: boolean }>({});

  // Edit state for AI Personalities
  const [editingPersonality, setEditingPersonality] = useState<AIPersonality | null>(null);
  const [editForm, setEditForm] = useState<Partial<AIPersonality>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch brain status from backend
  useEffect(() => {
    const fetchBrainStatus = async () => {
      try {
        setLoading(true);
        const status = await aiControlService.getBrainStatus();
        setBrainStatus(status);
      } catch (error) {
        console.error('Error loading AI control data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrainStatus();
  }, []);

  // Fetch entries for a brain
  const fetchEntries = async (brain: string) => {
    if (!user?.id) return;
    kbSetLoadingEntries(le => ({ ...le, [brain]: true }));
    try {
      const { data: kb } = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('type', 'brain')
        .eq('personality', brain)
        .eq('created_by', user.id)
        .single();
      let knowledgeBaseId = kb?.id;
      if (!knowledgeBaseId) {
        kbSetEntries(e => ({ ...e, [brain]: [] }));
        kbSetLoadingEntries(le => ({ ...le, [brain]: false }));
        return;
      }
      const { data: kbEntriesData } = await supabase
        .from('knowledge_base_entries')
        .select('*')
        .eq('knowledge_base_id', knowledgeBaseId)
        .eq('is_current', true)
        .order('created_at', { ascending: false });
      kbSetEntries(e => ({ ...e, [brain]: kbEntriesData || [] }));
    } catch (err) {
      kbSetEntries(e => ({ ...e, [brain]: [] }));
    }
    kbSetLoadingEntries(le => ({ ...le, [brain]: false }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        aiControlService.uploadDocument(file, 'knowledge', 'god')
      );
      const uploadedDocs = await Promise.all(uploadPromises);
      setDocuments(prev => [...prev, ...uploadedDocs]);
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (brain: string, files: FileList | null) => {
    if (!files || !user?.id) return;
    kbSetUploading(u => ({ ...u, [brain]: true }));
    try {
      for (const file of Array.from(files)) {
        await knowledgeBaseService.uploadDocumentToKnowledgeBase({
          brain,
          file,
          userId: user.id,
        });
      }
      await fetchEntries(brain);
    } catch (err) {
      alert('Upload failed.');
    }
    kbSetUploading(u => ({ ...u, [brain]: false }));
  };

  const handleScrape = async (brain: string) => {
    if (!kbScrapeUrl[brain] || !user?.id) return;
    kbSetScraping(s => ({ ...s, [brain]: true }));
    try {
      await knowledgeBaseService.scrapeUrlToKnowledgeBase({
        brain,
        url: kbScrapeUrl[brain],
        userId: user.id,
      });
      await fetchEntries(brain);
    } catch (err) {
      alert('Scrape failed.');
    }
    kbSetScraping(s => ({ ...s, [brain]: false }));
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [personalitiesData, voiceConfigsData] = await Promise.all([
          aiControlService.getPersonalities(),
          aiControlService.getVoiceConfigs()
        ]);
        setPersonalities(personalitiesData);
        setVoiceConfigs(voiceConfigsData);
      } catch (error) {
        console.error('Error loading AI control data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addPersonality = async () => {
    try {
      const newPersonality: Omit<AIPersonality, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'New Personality',
        type: 'sales',
        description: 'Custom AI personality',
        prompt: 'You are a custom AI personality...',
        isActive: false
      };
      const created = await aiControlService.createPersonality(newPersonality);
      setPersonalities(prev => [...prev, created]);
    } catch (error) {
      console.error('Error creating personality:', error);
    }
  };

  const toggleBrain = (brain: keyof typeof brainStatus) => {
    setBrainStatus(prev => ({
      ...prev,
      [brain]: { ...prev[brain], active: !prev[brain].active }
    }));
  };

  const openEditModal = (personality: AIPersonality) => {
    setEditingPersonality(personality);
    setEditForm({ ...personality });
  };

  const closeEditModal = () => {
    setEditingPersonality(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof AIPersonality, value: any) => {
    setEditForm(f => ({ ...f, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editingPersonality) return;
    setSavingEdit(true);
    try {
      const updated = await aiControlService.updatePersonality(editingPersonality.id, editForm);
      setPersonalities(prev => prev.map(p => p.id === updated.id ? updated : p));
      closeEditModal();
    } catch (err) {
      alert('Failed to update personality.');
    }
    setSavingEdit(false);
  };

  const handleToggleActive = async (personality: AIPersonality) => {
    try {
      const updated = await aiControlService.updatePersonality(personality.id, { isActive: !personality.isActive });
      setPersonalities(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  React.useEffect(() => {
    if (!user?.id) return;
    BRAINS.forEach(brain => {
      fetchEntries(brain.id);
    });
    // eslint-disable-next-line
  }, [user?.id]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'} mb-2`}>AI Control Center</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Manage all AI brains, voices, and knowledge bases</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: Brain },
              { id: 'personalities', name: 'AI Personalities', icon: Bot },
              { id: 'documents', name: 'Knowledge Base', icon: FileText },
              { id: 'voice', name: 'Voice Settings', icon: Mic },
              { id: 'analytics', name: 'AI Analytics', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `${isDarkMode ? 'border-sky-500 text-sky-400 bg-slate-800' : 'border-sky-500 text-sky-600 bg-sky-50'}`
                    : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-sky-300 hover:bg-slate-800' : 'border-transparent text-gray-600 hover:text-sky-600 hover:bg-gray-100'}`
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Brain Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(brainStatus).map(([brain, status]) => (
                <div key={brain} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold capitalize ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>{brain} Brain</h3>
                    <button
                      onClick={() => toggleBrain(brain as keyof typeof brainStatus)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status.active
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {status.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Accuracy</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{status.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Last Training</span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{status.lastTraining}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="primary" size="md" className={`w-full ${isDarkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'} text-white border-none`}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button variant="secondary" size="md" className={`w-full ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-900'} border-none`}>
                  <Bot className="w-4 h-4 mr-2" />
                  Add Personality
                </Button>
                <Button variant="secondary" size="md" className={`w-full ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-900'} border-none`}>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Settings
                </Button>
                <Button variant="secondary" size="md" className={`w-full ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-900'} border-none`}>
                  <Zap className="w-4 h-4 mr-2" />
                  Train AI
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Personalities Tab */}
        {activeTab === 'personalities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>AI Personalities</h2>
              <Button onClick={addPersonality} variant="primary" size="md" className={`${isDarkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'} text-white border-none`}>
                <Plus className="w-4 h-4 mr-2" />
                Add Personality
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {personalities.map((personality) => (
                <div key={personality.id} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>{personality.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Switch checked={personality.isActive} onCheckedChange={() => handleToggleActive(personality)} />
                      <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-sky-400' : 'text-gray-500 hover:text-sky-600'}`} onClick={() => openEditModal(personality)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}> {/* Delete will be added next */}
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type:</span>
                      <span className={`ml-2 px-2 py-1 ${isDarkMode ? 'bg-sky-900 text-sky-300' : 'bg-sky-100 text-sky-700'} rounded-full text-xs`}>
                        {personality.type}
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{personality.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${personality.isActive ? 'bg-green-600 text-white' : isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                        {personality.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Edit Modal */}
            {editingPersonality && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl max-w-lg w-full border border-slate-700">
                  <h3 className="font-bold mb-2 text-white">Edit Personality</h3>
                  <form onSubmit={e => { e.preventDefault(); saveEdit(); }}>
                    <label className="block mb-2 text-white">Name
                      <input className="w-full bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" value={editForm.name || ''} onChange={e => handleEditChange('name', e.target.value)} required />
                    </label>
                    <label className="block mb-2 text-white">Type
                      <select className="w-full bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" value={editForm.type || ''} onChange={e => handleEditChange('type', e.target.value)}>
                        <option value="sales">Sales</option>
                        <option value="support">Support</option>
                        <option value="god">God</option>
                        <option value="voice">Voice</option>
                      </select>
                    </label>
                    <label className="block mb-2 text-white">Description
                      <textarea className="w-full bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" value={editForm.description || ''} onChange={e => handleEditChange('description', e.target.value)} />
                    </label>
                    <label className="block mb-2 text-white">Prompt
                      <textarea className="w-full bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" value={editForm.prompt || ''} onChange={e => handleEditChange('prompt', e.target.value)} />
                    </label>
                    {/* Voice Settings */}
                    <label className="block mb-2 text-white">Voice Settings
                      <input className="w-full mb-1 bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" placeholder="Voice" value={editForm.voiceSettings?.voice || ''} onChange={e => handleEditChange('voiceSettings', { ...editForm.voiceSettings, voice: e.target.value })} />
                      <input className="w-full mb-1 bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" placeholder="Speed" type="number" value={editForm.voiceSettings?.speed || ''} onChange={e => handleEditChange('voiceSettings', { ...editForm.voiceSettings, speed: Number(e.target.value) })} />
                      <input className="w-full bg-slate-800 text-white border border-slate-700 rounded px-2 py-1" placeholder="Tone" value={editForm.voiceSettings?.tone || ''} onChange={e => handleEditChange('voiceSettings', { ...editForm.voiceSettings, tone: e.target.value })} />
                    </label>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit" disabled={savingEdit}>{savingEdit ? 'Saving...' : 'Save'}</Button>
                      <Button variant="secondary" onClick={closeEditModal}>Cancel</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          (user?.role === 'admin' || user?.email === 'support@homelistingai.com') ? (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Admin Knowledge Base</h2>
                    <p className="text-purple-100">Manage knowledge bases for all AI assistants</p>
                  </div>
                </div>
              </div>

              {BRAINS.map(brain => (
                <div key={brain.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300" style={{ backdropFilter: 'blur(20px)' }}>
                  {/* Brain Header */}
                  <div className={`bg-gradient-to-r ${brain.id === 'sales' ? 'from-green-600 to-blue-600' : brain.id === 'support' ? 'from-blue-600 to-purple-600' : 'from-purple-600 to-pink-600'} text-white p-6`}>
                    <div className="flex items-center gap-3">
                      <Brain className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">{brain.label}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Upload Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Upload Documents</h4>
                      </div>
                      <p className="text-gray-600 mb-4">Upload documents to enhance this AI brain's knowledge</p>
                      
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-white/50">
                          <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              multiple
                              onChange={e => handleUpload(brain.id, e.target.files)}
                              disabled={kbUploading[brain.id]}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt"
                            />
                            <span className="text-blue-600 font-medium hover:text-blue-700">
                              Choose files or drag and drop
                            </span>
                          </label>
                          <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, TXT up to 10MB each</p>
                        </div>
                        {kbUploading[brain.id] && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="font-medium">Uploading and processing...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scraping Section */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Import from Website</h4>
                      </div>
                      <p className="text-gray-600 mb-4">Scrape content from any website to add to this brain</p>
                      
                      <div className="flex gap-3">
                        <input
                          type="url"
                          placeholder="https://example.com/page-to-scrape"
                          value={kbScrapeUrl[brain.id] || ''}
                          onChange={e => kbSetScrapeUrl(u => ({ ...u, [brain.id]: e.target.value }))}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                        <Button
                          onClick={() => handleScrape(brain.id)}
                          disabled={kbScraping[brain.id] || !kbScrapeUrl[brain.id]}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                        >
                          {kbScraping[brain.id] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Scraping...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Import
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Existing Documents */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Knowledge Base Entries</h4>

                      {kbLoadingEntries[brain.id] ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : kbEntries[brain.id] && kbEntries[brain.id].length > 0 ? (
                        <div className="grid gap-3">
                          {kbEntries[brain.id].map(entry => (
                            <div key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 bg-blue-100 rounded">
                                      {entry.entry_type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                                      {entry.entry_type === 'note' && <Edit className="w-4 h-4 text-purple-600" />}
                                      {entry.entry_type === 'faq' && <Users className="w-4 h-4 text-green-600" />}
                                      {entry.entry_type === 'file' && <Upload className="w-4 h-4 text-orange-600" />}
                                    </div>
                                    <h5 className="font-semibold text-gray-900">{entry.title}</h5>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full capitalize">
                                      {entry.entry_type}
                                    </span>
                                    <span className="text-xs text-gray-500">v{entry.version}</span>
                                  </div>
                                  {entry.content && (
                                    <p className="text-gray-600 text-sm line-clamp-2">{entry.content.substring(0, 120)}...</p>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2 ml-4">
                                  {entry.file_url && (
                                    <a 
                                      href={entry.file_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                                    >
                                      View File
                                    </a>
                                  )}
                                  {entry.content && (
                                    <Button 
                                      size="sm" 
                                      variant="secondary" 
                                      onClick={() => window.alert(entry.content)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                                    >
                                      Preview
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <h5 className="text-lg font-medium text-gray-900 mb-1">No entries yet</h5>
                          <p className="text-gray-600">Upload documents or scrape websites to get started</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h3>
              <p className="text-gray-600">Knowledge Base management is only available for administrators.</p>
            </div>
          )
        )}

        {/* Voice Settings Tab */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>Voice Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {voiceConfigs.map((config) => (
                <div key={config.id} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>{config.name}</h3>
                    <div className="flex items-center space-x-2">
                      {config.isDefault && (
                        <span className={`px-2 py-1 ${isDarkMode ? 'bg-sky-900 text-sky-300' : 'bg-sky-100 text-sky-700'} rounded-full text-xs`}>
                          Default
                        </span>
                      )}
                      <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-sky-400' : 'text-gray-500 hover:text-sky-600'}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Voice:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{config.voice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Speed:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{config.speed}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Tone:</span>
                      <span className={`font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{config.tone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Analytics Tab */}
        {activeTab === 'analytics' && (
          // Removed analytics section as requested
          <div className="text-center text-gray-400 py-12">
            Analytics are not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIControlCenter; 