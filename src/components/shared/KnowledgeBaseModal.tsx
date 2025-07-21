import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Listing } from '../../types';
import { updateListing } from '../../services/listingService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  XMarkIcon, 
  DocumentArrowUpIcon, 
  GlobeAltIcon, 
  PlusIcon, 
  TrashIcon,
  BookOpenIcon,
  SparklesIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  onUpdate: (updatedListing: Listing) => void;
}

interface KBItem {
  id: string;
  key: string;
  value: string;
}

const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  listing,
  onUpdate
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'scrape' | 'manual'>('upload');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scraping, setScraping] = useState(false);
  
  // Manual entry state
  const [kbItems, setKbItems] = useState<KBItem[]>([]);
  const [newKbKey, setNewKbKey] = useState('');
  const [newKbValue, setNewKbValue] = useState('');
  const [kbText, setKbText] = useState('');
  
  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Scraping state
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapedContent, setScrapedContent] = useState('');

  // Initialize knowledge base data
  useEffect(() => {
    if (listing && isOpen) {
      if (typeof listing.knowledge_base === 'object' && listing.knowledge_base) {
        const items = Object.entries(listing.knowledge_base).map(([key, value]) => ({
          id: `${key}_${Date.now()}`,
          key,
          value: String(value)
        }));
        setKbItems(items);
      } else if (typeof listing.knowledge_base === 'string') {
        setKbText(listing.knowledge_base);
      }
    }
  }, [listing, isOpen]);

  // Manual entry functions
  const addKbItem = () => {
    if (newKbKey.trim() && newKbValue.trim()) {
      const newItem = {
        id: `${newKbKey}_${Date.now()}`,
        key: newKbKey.trim(),
        value: newKbValue.trim()
      };
      setKbItems([...kbItems, newItem]);
      setNewKbKey('');
      setNewKbValue('');
    }
  };

  const removeKbItem = (id: string) => {
    setKbItems(kbItems.filter(item => item.id !== id));
  };

  const updateKbItem = (id: string, key: string, value: string) => {
    setKbItems(kbItems.map(item => 
      item.id === id ? { ...item, key, value } : item
    ));
  };

  // File upload handling
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
    
    // Process files (in a real app, you'd send to backend for processing)
    setUploading(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add extracted content to knowledge base text
      const fileContent = files.map(file => 
        `Content from ${file.name}: [File processed - content would be extracted here]`
      ).join('\n\n');
      
      setKbText(prev => prev ? `${prev}\n\n${fileContent}` : fileContent);
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Website scraping
  const handleScrapeWebsite = async () => {
    if (!scrapeUrl.trim()) return;
    
    setScraping(true);
    try {
      // Simulate website scraping (in real app, call your scraping service)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockScrapedContent = `Content from ${scrapeUrl}:
      
• Property amenities and features
• Neighborhood information
• School district details
• Local attractions and conveniences
• Transportation options
• Community features

[This would contain the actual scraped content from the website]`;
      
      setScrapedContent(mockScrapedContent);
      setKbText(prev => prev ? `${prev}\n\n${mockScrapedContent}` : mockScrapedContent);
    } catch (error) {
      console.error('Scraping error:', error);
    } finally {
      setScraping(false);
    }
  };

  // Save knowledge base
  const saveKnowledgeBase = async () => {
    if (!listing || !user) return;
    
    setSaving(true);
    try {
      let knowledgeBase: Record<string, string> | string;
      if (kbItems.length > 0) {
        knowledgeBase = {};
        kbItems.forEach(item => {
          (knowledgeBase as Record<string, string>)[item.key] = item.value;
        });
        // Append text content if exists
        if (kbText.trim()) {
          (knowledgeBase as Record<string, string>)['Additional Information'] = kbText.trim();
        }
      } else {
        knowledgeBase = kbText;
      }

      const updatedListing = await updateListing(listing.id, { knowledge_base: knowledgeBase });
      onUpdate({ ...listing, knowledge_base: knowledgeBase });
      
      // Success feedback
      alert('🎉 Knowledge Base updated successfully!\n\nYour AI assistant now has enhanced knowledge about this property. Consider retraining your AI to use the new information.');
      onClose();
    } catch (error) {
      console.error('Failed to save knowledge base:', error);
      alert('Failed to save knowledge base. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Knowledge Base Manager</h2>
                <p className="text-blue-100">Enhance your AI assistant for {listing.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col h-[calc(90vh-120px)]">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {[
                { id: 'upload', label: 'Upload Documents', icon: DocumentArrowUpIcon },
                { id: 'scrape', label: 'Import from Website', icon: GlobeAltIcon },
                { id: 'manual', label: 'Manual Entry', icon: SparklesIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div className="text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Upload Documents</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload PDFs, Word docs, or text files containing property information
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Choose files or drag and drop
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT up to 10MB each
                    </span>
                  </label>
                </div>

                {uploading && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Processing files...
                    </div>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <DocumentArrowUpIcon className="w-5 h-5 text-blue-500" />
                        <span className="flex-1 text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'scrape' && (
              <div className="space-y-6">
                <div className="text-center">
                  <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Import from Website</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Scrape content from property websites, neighborhood guides, or school district pages
                  </p>
                </div>

                <div className="flex gap-3">
                  <Input
                    placeholder="https://example.com/property-info"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleScrapeWebsite}
                    disabled={scraping || !scrapeUrl.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {scraping ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Scraping...
                      </div>
                    ) : (
                      'Import'
                    )}
                  </Button>
                </div>

                {scrapedContent && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Scraped Content:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{scrapedContent}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="space-y-6">
                <div className="text-center">
                  <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Manual Entry</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add specific property details and additional information manually
                  </p>
                </div>

                {/* Key-Value Pairs */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Property Features</h4>
                  
                  {kbItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <Input
                        placeholder="Feature name"
                        value={item.key}
                        onChange={(e) => updateKbItem(item.id, e.target.value, item.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Description"
                        value={item.value}
                        onChange={(e) => updateKbItem(item.id, item.key, e.target.value)}
                        className="flex-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeKbItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-3 items-start">
                    <Input
                      placeholder="New feature name"
                      value={newKbKey}
                      onChange={(e) => setNewKbKey(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Description"
                      value={newKbValue}
                      onChange={(e) => setNewKbValue(e.target.value)}
                      className="flex-2"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addKbItem}
                      className="text-green-600 hover:text-green-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Free Text Area */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Additional Information</h4>
                  <Textarea
                    placeholder="Add detailed information about the property, neighborhood, amenities, schools, commute times, or any other details that would help potential buyers..."
                    value={kbText}
                    onChange={(e) => setKbText(e.target.value)}
                    rows={6}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                💡 Tip: The more details you add, the better your AI assistant can help potential buyers
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={saveKnowledgeBase}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Save & Enhance AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default KnowledgeBaseModal; 