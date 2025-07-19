import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  DocumentArrowUpIcon, 
  GlobeAltIcon, 
  SparklesIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

const KnowledgeBaseUploader: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      console.log('Files uploaded:', Array.from(files).map(f => f.name));
    }, 2000);
  };

  const handleScrapeUrl = () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    // Simulate scraping
    setTimeout(() => {
      setScraping(false);
      console.log('URL scraped:', scrapeUrl);
      setScrapeUrl('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <BookOpenIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Knowledge Base Uploader</h2>
            <p className="text-blue-100">Enhance your AI with custom knowledge</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ backdropFilter: 'blur(20px)' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center gap-3">
              <DocumentArrowUpIcon className="w-6 h-6" />
              <h3 className="text-lg font-bold">Upload Documents</h3>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">Upload PDFs, Word docs, or text files to enhance your AI's knowledge</p>
            
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50">
              <CloudArrowUpIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={e => handleFileUpload(e.target.files)}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <span className="text-blue-600 font-semibold text-lg hover:text-blue-700">
                  {uploading ? 'Uploading...' : 'Choose files or drag and drop'}
                </span>
              </label>
              <p className="text-gray-500 mt-2">PDF, DOC, DOCX, TXT up to 10MB each</p>
              
              {uploading && (
                <div className="flex items-center justify-center gap-2 text-blue-600 mt-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="font-medium">Processing files...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scraping Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ backdropFilter: 'blur(20px)' }}>
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
            <div className="flex items-center gap-3">
              <GlobeAltIcon className="w-6 h-6" />
              <h3 className="text-lg font-bold">Import from Website</h3>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">Scrape content from any website to add to your knowledge base</p>
            
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://example.com/page-to-scrape"
                value={scrapeUrl}
                onChange={e => setScrapeUrl(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <Button
                onClick={handleScrapeUrl}
                disabled={scraping || !scrapeUrl.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
              >
                {scraping ? (
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
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ backdropFilter: 'blur(20px)' }}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-6 h-6" />
              <h3 className="text-lg font-bold">Advanced Features</h3>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <SparklesIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">More Features Coming Soon</h4>
              <p className="text-gray-600">
                Advanced document processing, AI-powered content extraction, and intelligent categorization features are in development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseUploader; 