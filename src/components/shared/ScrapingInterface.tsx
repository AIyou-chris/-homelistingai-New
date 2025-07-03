import React, { useState } from 'react';
import { Upload, Download, FileText, Home, MapPin, TrendingUp, School, Users, Building, User } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'scrape' | 'results' | 'export'>('scrape');
  const [scrapingProgress, setScrapingProgress] = useState<{ current: number; total: number; currentUrl: string } | null>(null);

  const handleScrape = async () => {
    if (!urls.trim()) return;

    setIsScraping(true);
    setScrapingProgress({ current: 0, total: 0, currentUrl: '' });
    
    try {
      const urlList = urls.split('\n').filter(url => url.trim());
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
      setIsScraping(false);
      setScrapingProgress(null);
    }
  };

  const handleExportKnowledgeBase = () => {
    const kb = knowledgeBaseService.generateCombinedKnowledgeBase();
    setKnowledgeBase(kb);
    setActiveTab('export');
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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Smart Knowledge Base Scraper</h2>
        <p className="text-gray-600">Automatically categorize and scrape property listings and agent profiles to build your AI knowledge base</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('scrape')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'scrape' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Smart Scrape
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'results' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled={getTotalScraped() === 0}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Results ({getTotalScraped()})
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'export' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled={knowledgeBase === ''}
        >
          <Download className="w-4 h-4 inline mr-2" />
          Export
        </button>
      </div>

      {/* Scrape Tab */}
      {activeTab === 'scrape' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs (one per line) - Automatically categorized as listings or agent profiles
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://www.zillow.com/homedetails/123-example-street...
https://www.realtor.com/realestateagent/john-doe...
https://www.linkedin.com/in/jane-smith...
https://www.facebook.com/realestateagent..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supports: Property listings (Zillow, Realtor.com) and Agent profiles (LinkedIn, Facebook, personal websites)
            </p>
          </div>

          {/* Scraping Progress */}
          {scrapingProgress && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Processing {scrapingProgress.current} of {scrapingProgress.total}
                </span>
                <span className="text-sm text-blue-600">
                  {Math.round((scrapingProgress.current / scrapingProgress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(scrapingProgress.current / scrapingProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-1 truncate">
                Current: {scrapingProgress.currentUrl}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleScrape}
              disabled={!urls.trim() || isScraping}
              isLoading={isScraping}
              variant="primary"
              size="lg"
            >
              {isScraping ? 'Smart Scraping...' : 'Start Smart Scrape'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2 flex items-center">
                <Home className="w-4 h-4 mr-2" />
                Property Listings
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Zillow, Realtor.com, Redfin</div>
                <div>• Property details & features</div>
                <div>• Pricing & neighborhood info</div>
                <div>• Images & descriptions</div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Agent Profiles
              </h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• LinkedIn, Facebook, Instagram</div>
                <div>• Personal websites & bios</div>
                <div>• Specialties & experience</div>
                <div>• Contact information</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Scraped Data</h3>
            <Button onClick={handleExportKnowledgeBase} variant="secondary">
              Generate Combined Knowledge Base
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Properties</h4>
                  <p className="text-2xl font-bold text-green-600">{scrapedListings.length}</p>
                </div>
                <Home className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-purple-800">Agents</h4>
                  <p className="text-2xl font-bold text-purple-600">{scrapedAgents.length}</p>
                </div>
                <User className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Properties Section */}
          {scrapedListings.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Properties ({scrapedListings.length})
              </h4>
              <div className="grid gap-4">
                {scrapedListings.map((property, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{property.address}</h5>
                      <span className="text-lg font-bold text-green-600">{property.price}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{property.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {property.bedrooms && (
                        <div>
                          <span className="text-gray-500">Bedrooms:</span>
                          <span className="ml-1 font-medium">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div>
                          <span className="text-gray-500">Bathrooms:</span>
                          <span className="ml-1 font-medium">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.squareFeet && (
                        <div>
                          <span className="text-gray-500">Square Feet:</span>
                          <span className="ml-1 font-medium">{property.squareFeet.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Source: <a href={property.listingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {property.listingUrl}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agents Section */}
          {scrapedAgents.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Agents ({scrapedAgents.length})
              </h4>
              <div className="grid gap-4">
                {scrapedAgents.map((agent, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-800">{agent.name}</h5>
                        {agent.company && (
                          <p className="text-sm text-gray-600">{agent.company}</p>
                        )}
                      </div>
                      {agent.title && (
                        <span className="text-sm text-purple-600 font-medium">{agent.title}</span>
                      )}
                    </div>
                    
                    {agent.bio && (
                      <p className="text-gray-600 text-sm mb-3">{agent.bio}</p>
                    )}
                    
                    {agent.specialties && agent.specialties.length > 0 && (
                      <div className="mb-3">
                        <span className="text-gray-500 text-sm">Specialties:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.specialties.map((specialty, i) => (
                            <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Profile: <a href={agent.profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {agent.profileUrl}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Combined Knowledge Base Export</h3>
            <div className="flex gap-2">
              <Button onClick={handleCopyToClipboard} variant="secondary" size="sm">
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownloadKnowledgeBase} variant="primary" size="sm">
                Download File
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <textarea
              value={knowledgeBase}
              readOnly
              className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border-0 rounded-lg resize-none"
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Ready for AI Training!</h4>
            <p className="text-green-700 text-sm">
              This comprehensive knowledge base includes both property listings and agent information. 
              Your AI assistant can now answer questions about specific properties, neighborhoods, 
              and real estate professionals with detailed, accurate information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapingInterface; 