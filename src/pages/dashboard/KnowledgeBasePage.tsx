import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/shared/Button';
import * as knowledgeBaseService from '../../services/knowledgeBaseService';
import { supabase } from '../../lib/supabase';
import { 
  BookOpenIcon,
  DocumentArrowUpIcon, 
  GlobeAltIcon, 
  SparklesIcon,
  CloudArrowUpIcon,
  UserIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const BRAINS = [
  { id: 'agent', label: 'Agent Knowledge Base', icon: UserIcon, color: 'from-blue-600 to-purple-600' },
];

const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const [scrapeUrl, setScrapeUrl] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [scraping, setScraping] = useState<{ [key: string]: boolean }>({});
  const [entries, setEntries] = useState<{ [key: string]: knowledgeBaseService.KnowledgeBaseEntry[] }>({});
  const [loadingEntries, setLoadingEntries] = useState<{ [key: string]: boolean }>({});
  const [showExplanation, setShowExplanation] = useState(true);

  // Fetch entries for a brain
  const fetchEntries = async (brain: string) => {
    if (!user?.id) return;
    setLoadingEntries(le => ({ ...le, [brain]: true }));
    try {
      // Find or create the knowledge base for this brain
      const { data: kb, error: kbError } = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('type', 'brain')
        .eq('personality', brain)
        .eq('created_by', user.id)
        .single();
      let knowledgeBaseId = kb?.id;
      if (!knowledgeBaseId) {
        setEntries(e => ({ ...e, [brain]: [] }));
        setLoadingEntries(le => ({ ...le, [brain]: false }));
        return;
      }
      const { data: kbEntries, error: entriesError } = await supabase
        .from('knowledge_base_entries')
        .select('*')
        .eq('knowledge_base_id', knowledgeBaseId)
        .eq('is_current', true)
        .order('created_at', { ascending: false });
      setEntries(e => ({ ...e, [brain]: kbEntries || [] }));
    } catch (err) {
      setEntries(e => ({ ...e, [brain]: [] }));
    }
    setLoadingEntries(le => ({ ...le, [brain]: false }));
  };

  // Real upload handler
  const handleUpload = async (brain: string, files: FileList | null) => {
    if (!files || !user?.id) return;
    setUploading(u => ({ ...u, [brain]: true }));
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
    setUploading(u => ({ ...u, [brain]: false }));
  };

  // Real scrape handler
  const handleScrape = async (brain: string) => {
    if (!scrapeUrl[brain] || !user?.id) return;
    setScraping(s => ({ ...s, [brain]: true }));
    try {
      await knowledgeBaseService.scrapeUrlToKnowledgeBase({
        brain,
        url: scrapeUrl[brain],
        userId: user.id,
      });
      await fetchEntries(brain);
    } catch (err) {
      alert('Scrape failed.');
    }
    setScraping(s => ({ ...s, [brain]: false }));
  };

  React.useEffect(() => {
    if (!user?.id) return;
    BRAINS.forEach(brain => {
      fetchEntries(brain.id);
    });
    // eslint-disable-next-line
  }, [user?.id]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <BookOpenIcon className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base Management</h1>
            <p className="text-blue-100 text-lg">Build powerful AI assistants with custom knowledge</p>
          </div>
        </div>
      </div>

      {/* AI Knowledge Base Explanation */}
      {showExplanation && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-900 mb-3">🤖 How Our AI Knowledge Base Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-purple-800">
                <div>
                  <h4 className="font-semibold mb-2">📚 Agent Knowledge Base</h4>
                  <p className="text-sm leading-relaxed">
                    Train your AI with your expertise, market knowledge, and personal touch. Upload your documents, 
                    scrape websites, or add custom content to make your AI sound exactly like you.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏠 Listing Knowledge Base</h4>
                  <p className="text-sm leading-relaxed">
                    Each property gets its own AI brain that knows everything about that specific listing. 
                    Photos, features, neighborhood info, and market data - all automatically organized and ready to answer questions.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-2">🧠 Continuous Learning AI</h4>
                  <p className="text-sm leading-relaxed">
                    Our AI doesn't just store information - it learns and improves over time. Every conversation, 
                    every question, every interaction makes your AI smarter and more helpful. It's like having a 
                    highly trained assistant that never forgets and always gets better.
                  </p>
                  <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                    <p className="text-xs font-medium text-purple-700">
                      💡 <strong>Pro Tip:</strong> Most agents struggle with AI training. We make it simple - 
                      just upload your documents and our AI learns your style instantly. No technical knowledge required!
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowExplanation(false)}
                className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Got it! Hide this explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Sections */}
      <div className="grid gap-8">
        {BRAINS.map(brain => (
          <div key={brain.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300" style={{ backdropFilter: 'blur(20px)' }}>
            {/* Brain Header */}
            <div className={`bg-gradient-to-r ${brain.color} text-white p-6`}>
              <div className="flex items-center gap-3">
                <brain.icon className="w-8 h-8" />
                <h2 className="text-2xl font-bold">{brain.label}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentArrowUpIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
                </div>
                <p className="text-gray-600 mb-4">Upload PDFs, Word docs, or text files to enhance your AI's knowledge</p>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-white/50">
                    <CloudArrowUpIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={e => handleUpload(brain.id, e.target.files)}
                        disabled={uploading[brain.id]}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <span className="text-blue-600 font-medium hover:text-blue-700">
                        Choose files or drag and drop
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, TXT up to 10MB each</p>
                  </div>
                  {uploading[brain.id] && (
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
                    <GlobeAltIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Import from Website</h3>
                </div>
                <p className="text-gray-600 mb-4">Scrape content from any website to add to your knowledge base</p>
                
                <div className="flex gap-3">
                  <input
                    type="url"
                    placeholder="https://example.com/page-to-scrape"
                    value={scrapeUrl[brain.id] || ''}
                    onChange={e => setScrapeUrl(u => ({ ...u, [brain.id]: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <Button
                    onClick={() => handleScrape(brain.id)}
                    disabled={scraping[brain.id] || !scrapeUrl[brain.id]}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    {scraping[brain.id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Scraping...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Existing Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Knowledge Base Entries</h3>
                  <Button 
                    onClick={() => fetchEntries(brain.id)}
                    variant="secondary"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Refresh
                  </Button>
                </div>

                {loadingEntries[brain.id] ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : entries[brain.id] && entries[brain.id].length > 0 ? (
                  <div className="grid gap-3">
                    {entries[brain.id].map(entry => (
                      <div key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1 bg-blue-100 rounded">
                                {entry.entry_type === 'document' && <DocumentArrowUpIcon className="w-4 h-4 text-blue-600" />}
                                {entry.entry_type === 'note' && <SparklesIcon className="w-4 h-4 text-purple-600" />}
                                {entry.entry_type === 'faq' && <BookOpenIcon className="w-4 h-4 text-green-600" />}
                                {entry.entry_type === 'file' && <CloudArrowUpIcon className="w-4 h-4 text-orange-600" />}
                              </div>
                              <h4 className="font-semibold text-gray-900">{entry.title}</h4>
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
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                    <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-1">No entries yet</h4>
                    <p className="text-gray-600">Upload documents or scrape websites to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBasePage; 