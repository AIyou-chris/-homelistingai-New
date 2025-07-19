import React, { useState } from 'react';
import { Upload, Download, FileText, Home, MapPin, TrendingUp, School, Users, Building, User, Brain, Zap, Copy } from 'lucide-react';
import Button from './Button';
import scrapingService, { ScrapedPropertyData } from '../../services/scrapingService';
import knowledgeBaseService, { AgentData } from '../../services/knowledgeBaseService';

interface ScrapingInterfaceProps {
  onDataScraped?: (data: { listings: ScrapedPropertyData[], agents: AgentData[] }) => void;
}

const ScrapingInterface: React.FC<ScrapingInterfaceProps> = ({ onDataScraped }) => {
  const [urls, setUrls] = useState<string>('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedListings, setScrapedListings] = useState<ScrapedPropertyData[]>([]);
  const [scrapedAgents, setScrapedAgents] = useState<AgentData[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'scrape' | 'results' | 'knowledge'>('scrape');
  const [scrapingProgress, setScrapingProgress] = useState<{ current: number; total: number; currentUrl: string } | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setScrapingProgress({ current: 0, total: 0, currentUrl: '' });
    
    try {
      const urlList = urlInput.split('\n').filter(url => url.trim());
      setScrapingProgress({ current: 0, total: urlList.length, currentUrl: urlList[0] });
      
      const listings: ScrapedPropertyData[] = [];
      const agents: AgentData[] = [];
      
      for (let i = 0; i < urlList.length; i++) {
        const url = urlList[i];
        setScrapingProgress({ current: i + 1, total: urlList.length, currentUrl: url });
        
        try {
          const result = await knowledgeBaseService.processUrl(url);
          
          if (result.type === 'listing') {
            listings.push(result.data);
            await knowledgeBaseService.addToListings(result.data);
          } else {
            agents.push(result.data);
            await knowledgeBaseService.addToAgents(result.data);
          }
        } catch (error) {
          console.error(`Failed to process ${url}:`, error);
        }
        
        // Add delay between requests
        if (i < urlList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      setScrapedListings(listings);
      setScrapedAgents(agents);
      
      if (onDataScraped) {
        onDataScraped({ listings, agents });
      }
      
      setActiveTab('results');
    } catch (error) {
      console.error('Scraping failed:', error);
      alert('Scraping failed. Please check the URLs and try again.');
    } finally {
      setIsLoading(false);
      setScrapingProgress(null);
    }
  };

  const handleExportKnowledgeBase = () => {
    const kb = knowledgeBaseService.generateCombinedKnowledgeBase();
    setKnowledgeBase(kb);
          setActiveTab('knowledge');
  };

  const handleDownloadKnowledgeBase = () => {
    const blob = new Blob([knowledgeBase], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'homelistingai-knowledge-base.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(knowledgeBase);
    alert('Knowledge base copied to clipboard!');
  };

  const getTotalScraped = () => scrapedListings.length + scrapedAgents.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <Upload className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Smart Knowledge Base Scraper</h2>
            <p className="text-blue-100 text-lg">Automatically categorize and scrape property listings and agent profiles to build your AI knowledge base</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('scrape')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'scrape' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Smart Scrape
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'results' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            disabled={getTotalScraped() === 0}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Results ({getTotalScraped()})
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'knowledge' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            disabled={knowledgeBase.length === 0}
          >
            <Brain className="w-5 h-5 inline mr-2" />
            Knowledge Base
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'scrape' && (
            <div className="space-y-6">
              {/* URL Input Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Enter URLs to Scrape</h3>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter URLs (one per line)&#10;https://example.com/listing1&#10;https://example.com/agent-profile&#10;https://example.com/listing2"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleScrape}
                      disabled={isLoading || !urlInput.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Start Smart Scrape
                        </>
                      )}
                    </Button>
                    
                    {getTotalScraped() > 0 && (
                      <div className="text-sm text-gray-600">
                        Found: <span className="font-semibold text-blue-600">{scrapedListings.length} listings</span> + <span className="font-semibold text-green-600">{scrapedAgents.length} agents</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Our AI automatically detects and categorizes content as property listings or agent profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Extracts key information like prices, features, contact details, and descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Builds a comprehensive knowledge base for your AI assistant to reference</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900">{scrapedListings.length}</h3>
                      <p className="text-blue-700">Property Listings</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-900">{scrapedAgents.length}</h3>
                      <p className="text-green-700">Agent Profiles</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Lists */}
              {scrapedListings.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Property Listings ({scrapedListings.length})
                    </h3>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto">
                    {scrapedListings.map((listing, idx) => (
                                             <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-3 last:mb-0 hover:shadow-md transition-shadow">
                         <h4 className="font-semibold text-gray-900">{listing.address}</h4>
                         <p className="text-blue-600 font-bold">{listing.price}</p>
                         <p className="text-gray-600 text-sm">{listing.description}</p>
                       </div>
                    ))}
                  </div>
                </div>
              )}

              {scrapedAgents.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Agent Profiles ({scrapedAgents.length})
                    </h3>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto">
                    {scrapedAgents.map((agent, idx) => (
                                             <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-3 last:mb-0 hover:shadow-md transition-shadow">
                         <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                         <p className="text-green-600">{agent.company}</p>
                         <p className="text-gray-600 text-sm">{agent.contactInfo?.phone} • {agent.contactInfo?.email}</p>
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              {/* Knowledge Base Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-bold">Generated Knowledge Base</h3>
                      <p className="text-purple-100">Ready for AI training</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDownloadKnowledgeBase}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={handleCopyToClipboard}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              {/* Knowledge Base Content */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {knowledgeBase || 'No knowledge base generated yet. Start by scraping some URLs!'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapingInterface; 