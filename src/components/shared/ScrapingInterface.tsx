import React, { useState } from 'react';
import { Upload, Download, FileText, Home, MapPin, TrendingUp, School, Users, Building, User, Brain, Zap, Copy, Camera, Bug, Eye, EyeOff } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'scrape' | 'results' | 'knowledge' | 'debug' | 'moon'>('scrape');
  const [scrapingProgress, setScrapingProgress] = useState<{ current: number; total: number; currentUrl: string } | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ScrapedPropertyData | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  
  // Moon features - new state for advanced features
  const [marketData, setMarketData] = useState<any>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [socialContent, setSocialContent] = useState<any>(null);
  const [isGeneratingMoonFeatures, setIsGeneratingMoonFeatures] = useState(false);
  
  // Debug features
  const [showDebugMode, setShowDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [scrapingMetrics, setScrapingMetrics] = useState<{
    totalUrls: number;
    successfulScrapes: number;
    failedScrapes: number;
    totalPhotos: number;
    averagePhotosPerListing: number;
    scrapingTime: number;
    dataQuality: {
      addressesFound: number;
      pricesFound: number;
      descriptionsFound: number;
      featuresFound: number;
    };
  }>({
    totalUrls: 0,
    successfulScrapes: 0,
    failedScrapes: 0,
    totalPhotos: 0,
    averagePhotosPerListing: 0,
    scrapingTime: 0,
    dataQuality: {
      addressesFound: 0,
      pricesFound: 0,
      descriptionsFound: 0,
      featuresFound: 0,
    }
  });

  const addDebugLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setDebugLogs(prev => [...prev, logEntry]);
    console.log(`🔍 SCRAPER DEBUG [${type.toUpperCase()}]:`, message);
  };

  const clearDebugLogs = () => {
    setDebugLogs([]);
  };

  const handleScrape = async () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setScrapingProgress({ current: 0, total: 0, currentUrl: '' });
    clearDebugLogs();
    
    const startTime = Date.now();
    addDebugLog('🚀 Starting scraping session');
    addDebugLog(`📋 URLs to process: ${urlInput.split('\n').filter(url => url.trim()).length}`);
    
    try {
      const urlList = urlInput.split('\n').filter(url => url.trim());
      setScrapingProgress({ current: 0, total: urlList.length, currentUrl: urlList[0] });
      
      const listings: ScrapedPropertyData[] = [];
      const agents: AgentData[] = [];
      let successfulScrapes = 0;
      let failedScrapes = 0;
      
      addDebugLog(`🔍 Processing ${urlList.length} URLs`);
      
      for (let i = 0; i < urlList.length; i++) {
        const url = urlList[i];
        setScrapingProgress({ current: i + 1, total: urlList.length, currentUrl: url });
        
        addDebugLog(`📡 Processing URL ${i + 1}/${urlList.length}: ${url}`);
        
        try {
          const urlStartTime = Date.now();
          addDebugLog(`🔍 Detecting URL type for: ${url}`);
          
          const result = await knowledgeBaseService.processUrl(url);
          
          const urlEndTime = Date.now();
          const urlProcessingTime = urlEndTime - urlStartTime;
          
          addDebugLog(`✅ URL processed in ${urlProcessingTime}ms`, 'success');
          addDebugLog(`📊 Result type: ${result.type}`);
          
          if (result.type === 'listing') {
            const listing = result.data;
            addDebugLog(`🏠 Property scraped: ${listing.address}`);
            addDebugLog(`💰 Price: ${listing.price}`);
            addDebugLog(`🛏️ Beds: ${listing.bedrooms}, Baths: ${listing.bathrooms}`);
            addDebugLog(`📸 Photos found: ${listing.images?.length || 0}`);
            addDebugLog(`✨ Features found: ${listing.features?.length || 0}`);
            
            listings.push(listing);
            await knowledgeBaseService.addToListings(listing);
            successfulScrapes++;
          } else {
            const agent = result.data;
            addDebugLog(`👤 Agent scraped: ${agent.name}`);
            addDebugLog(`🏢 Company: ${agent.company}`);
            addDebugLog(`📞 Contact: ${agent.contactInfo?.phone || 'N/A'}`);
            
            agents.push(agent);
            await knowledgeBaseService.addToAgents(agent);
            successfulScrapes++;
          }
        } catch (error) {
          addDebugLog(`❌ Failed to process ${url}: ${error}`, 'error');
          failedScrapes++;
        }
        
        // Add delay between requests
        if (i < urlList.length - 1) {
          addDebugLog(`⏳ Waiting 2 seconds before next request...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Calculate metrics
      const totalPhotos = listings.reduce((sum, listing) => sum + (listing.images?.length || 0), 0);
      const averagePhotosPerListing = listings.length > 0 ? totalPhotos / listings.length : 0;
      
      const dataQuality = {
        addressesFound: listings.filter(l => l.address && l.address !== 'Address not found').length,
        pricesFound: listings.filter(l => l.price && l.price !== 'Price not available').length,
        descriptionsFound: listings.filter(l => l.description && l.description !== 'No description available').length,
        featuresFound: listings.reduce((sum, l) => sum + (l.features?.length || 0), 0),
      };
      
      setScrapingMetrics({
        totalUrls: urlList.length,
        successfulScrapes,
        failedScrapes,
        totalPhotos,
        averagePhotosPerListing,
        scrapingTime: totalTime,
        dataQuality
      });
      
      setScrapedListings(listings);
      setScrapedAgents(agents);
      
      addDebugLog(`🎉 Scraping session completed!`, 'success');
      addDebugLog(`📊 Final Results:`);
      addDebugLog(`   ✅ Successful scrapes: ${successfulScrapes}`);
      addDebugLog(`   ❌ Failed scrapes: ${failedScrapes}`);
      addDebugLog(`   🏠 Properties found: ${listings.length}`);
      addDebugLog(`   👤 Agents found: ${agents.length}`);
      addDebugLog(`   📸 Total photos: ${totalPhotos}`);
      addDebugLog(`   ⏱️ Total time: ${totalTime}ms`);
      
      if (onDataScraped) {
        onDataScraped({ listings, agents });
      }
      
      setActiveTab('results');
    } catch (error) {
      addDebugLog(`💥 Scraping failed: ${error}`, 'error');
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

  // Moon feature functions
  const generateMarketData = async () => {
    setIsGeneratingMoonFeatures(true);
    try {
      // Simulate market data generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockMarketData = {
        medianPrice: '$450,000',
        priceTrend: '+5.2% YoY',
        daysOnMarket: '23 days',
        inventoryLevel: 'Low (2.1 months)',
        pricePerSqFt: '$245',
        marketType: 'Seller\'s Market'
      };
      
      setMarketData(mockMarketData);
      addDebugLog('📊 Market data generated successfully', 'success');
    } catch (error) {
      addDebugLog(`❌ Market data generation failed: ${error}`, 'error');
    } finally {
      setIsGeneratingMoonFeatures(false);
    }
  };

  const generateCompetitiveAnalysis = async () => {
    setIsGeneratingMoonFeatures(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCompetitiveData = {
        pricePosition: 'Competitive (-2% vs market)',
        featureAdvantage: 'Above average (8.5/10)',
        photoQuality: 'Excellent (12 high-res photos)',
        improvementTips: 'Add virtual tour, highlight recent updates'
      };
      
      setCompetitiveAnalysis(mockCompetitiveData);
      addDebugLog('🏆 Competitive analysis completed', 'success');
    } catch (error) {
      addDebugLog(`❌ Competitive analysis failed: ${error}`, 'error');
    } finally {
      setIsGeneratingMoonFeatures(false);
    }
  };

  const generateAiInsights = async () => {
    setIsGeneratingMoonFeatures(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAiData = {
        targetAudience: 'Young professionals, families',
        pricingStrategy: 'Competitive pricing with room for negotiation',
        marketingCopy: 'Stunning 3BR home in sought-after neighborhood',
        growthPotential: 'High - area appreciating 6% annually'
      };
      
      setAiInsights(mockAiData);
      addDebugLog('🤖 AI insights generated', 'success');
    } catch (error) {
      addDebugLog(`❌ AI insights failed: ${error}`, 'error');
    } finally {
      setIsGeneratingMoonFeatures(false);
    }
  };

  const generateSocialContent = async () => {
    setIsGeneratingMoonFeatures(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSocialData = {
        instagram: '🏠 New listing alert! Stunning 3BR home in the heart of [neighborhood]. Perfect for families! #realestate #newlisting',
        twitter: 'Just listed: Beautiful 3BR home in [area] - $450K. Great schools, amazing location! #realestate #newlisting',
        facebook: 'Check out this amazing property! 3 bedrooms, 2 baths, in a fantastic neighborhood. Perfect for your growing family!'
      };
      
      setSocialContent(mockSocialData);
      addDebugLog('📱 Social content generated', 'success');
    } catch (error) {
      addDebugLog(`❌ Social content failed: ${error}`, 'error');
    } finally {
      setIsGeneratingMoonFeatures(false);
    }
  };

  const generateAllMoonFeatures = async () => {
    setIsGeneratingMoonFeatures(true);
    try {
      addDebugLog('🚀 Generating all Moon features...');
      
      // Generate all features in parallel
      await Promise.all([
        generateMarketData(),
        generateCompetitiveAnalysis(),
        generateAiInsights(),
        generateSocialContent()
      ]);
      
      addDebugLog('🎉 All Moon features generated successfully!', 'success');
    } catch (error) {
      addDebugLog(`❌ Moon features generation failed: ${error}`, 'error');
    } finally {
      setIsGeneratingMoonFeatures(false);
    }
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
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'debug' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bug className="w-5 h-5 inline mr-2" />
            Debug
          </button>
          <button
            onClick={() => setActiveTab('moon')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'moon' 
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            🚀 TO THE MOON
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
                    
                    <Button
                      onClick={() => {
                        setUrlInput('https://www.realtor.com/realestateandhomes-detail/5110-Regan-Rd_Cashmere_WA_98815_M20231-50152?from=ML_similar_homes');
                        addDebugLog('🧪 Test URL loaded for Realtor.com property');
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                    >
                      <Bug className="w-4 h-4" />
                      Load Test URL
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-900">
                        {scrapedListings.reduce((total, listing) => total + (listing.images?.length || 0), 0)}
                      </h3>
                      <p className="text-purple-700">Photos Scraped</p>
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
                        <div className="flex gap-4">
                                                      {/* Property Photos */}
                            {listing.images && listing.images.length > 0 && (
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                     onClick={() => {
                                       setSelectedListing(listing);
                                       setShowPhotoGallery(true);
                                     }}>
                                  <img 
                                    src={listing.images[0]} 
                                    alt={listing.address}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <span>{listing.images.length} photos</span>
                                  {listing.images.length > 1 && (
                                    <button 
                                      onClick={() => {
                                        setSelectedListing(listing);
                                        setShowPhotoGallery(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      View all
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          
                          {/* Property Details */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{listing.address}</h4>
                            <p className="text-blue-600 font-bold">{listing.price}</p>
                            <div className="flex gap-4 text-sm text-gray-600 mb-2">
                              {listing.bedrooms && <span>🛏️ {listing.bedrooms} beds</span>}
                              {listing.bathrooms && <span>🚿 {listing.bathrooms} baths</span>}
                              {listing.squareFeet && <span>📐 {listing.squareFeet} sqft</span>}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                            {listing.features && listing.features.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">Features:</div>
                                <div className="flex flex-wrap gap-1">
                                  {listing.features.slice(0, 3).map((feature, fIdx) => (
                                    <span key={fIdx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      {feature}
                                    </span>
                                  ))}
                                  {listing.features.length > 3 && (
                                    <span className="text-xs text-gray-500">+{listing.features.length - 3} more</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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

          {activeTab === 'moon' && (
            <div className="space-y-6">
              {/* Moon Features Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-12 h-12" />
                  <div>
                    <h2 className="text-3xl font-bold">🚀 TO THE MOON Features</h2>
                    <p className="text-purple-100 text-lg">Advanced AI-powered market analysis and competitive intelligence</p>
                  </div>
                </div>
              </div>

              {/* Moon Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Market Data Analysis */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">📊 Market Data Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Get comprehensive market insights for your scraped properties</p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => generateMarketData()}
                      disabled={isGeneratingMoonFeatures || scrapedListings.length === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                      {isGeneratingMoonFeatures ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing Market...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Generate Market Analysis
                        </>
                      )}
                    </Button>
                    
                    {marketData && (
                      <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Market Insights:</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div>🏠 Median Price: {marketData.medianPrice}</div>
                          <div>📈 Price Trend: {marketData.priceTrend}</div>
                          <div>⏱️ Days on Market: {marketData.daysOnMarket}</div>
                          <div>📊 Inventory Level: {marketData.inventoryLevel}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Competitive Analysis */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">🏆 Competitive Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Compare your properties with similar listings in the area</p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => generateCompetitiveAnalysis()}
                      disabled={isGeneratingMoonFeatures || scrapedListings.length === 0}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      {isGeneratingMoonFeatures ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing Competition...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Generate Competitive Analysis
                        </>
                      )}
                    </Button>
                    
                    {competitiveAnalysis && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Competitive Insights:</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div>🎯 Price Position: {competitiveAnalysis.pricePosition}</div>
                          <div>⭐ Feature Advantage: {competitiveAnalysis.featureAdvantage}</div>
                          <div>📸 Photo Quality: {competitiveAnalysis.photoQuality}</div>
                          <div>💡 Improvement Tips: {competitiveAnalysis.improvementTips}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">🤖 AI-Powered Insights</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Get AI-generated recommendations for your properties</p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => generateAiInsights()}
                      disabled={isGeneratingMoonFeatures || scrapedListings.length === 0}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                    >
                      {isGeneratingMoonFeatures ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating AI Insights...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Generate AI Insights
                        </>
                      )}
                    </Button>
                    
                    {aiInsights && (
                      <div className="bg-white p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-2">AI Recommendations:</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div>🎯 Target Audience: {aiInsights.targetAudience}</div>
                          <div>💰 Pricing Strategy: {aiInsights.pricingStrategy}</div>
                          <div>📝 Marketing Copy: {aiInsights.marketingCopy}</div>
                          <div>🚀 Growth Potential: {aiInsights.growthPotential}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media Content */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Camera className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">📱 Social Media Content</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Generate viral social media posts for your properties</p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => generateSocialContent()}
                      disabled={isGeneratingMoonFeatures || scrapedListings.length === 0}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      {isGeneratingMoonFeatures ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Content...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Generate Social Content
                        </>
                      )}
                    </Button>
                    
                    {socialContent && (
                      <div className="bg-white p-4 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Social Media Posts:</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>
                            <strong>Instagram:</strong> {socialContent.instagram}
                          </div>
                          <div>
                            <strong>Twitter:</strong> {socialContent.twitter}
                          </div>
                          <div>
                            <strong>Facebook:</strong> {socialContent.facebook}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Generate All Moon Features */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">🚀 Generate All Moon Features</h3>
                    <p className="text-purple-100">Create comprehensive market analysis and content in one click</p>
                  </div>
                  <Button
                    onClick={() => generateAllMoonFeatures()}
                    disabled={isGeneratingMoonFeatures || scrapedListings.length === 0}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  >
                    {isGeneratingMoonFeatures ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating All Features...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Generate Everything
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Scraping Debug Console</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearDebugLogs}
                      className="bg-white/20 hover:bg-white/30 text-gray-700 border border-gray-300"
                    >
                      <EyeOff className="w-4 h-4" />
                      Clear Logs
                    </Button>
                    <Button
                      onClick={() => setShowDebugMode(prev => !prev)}
                      className="bg-white/20 hover:bg-white/30 text-gray-700 border border-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                      {showDebugMode ? 'Hide' : 'Show'} Debug
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                  {showDebugMode ? (
                    debugLogs.map((log, idx) => (
                      <div key={idx} className={`text-sm p-2 rounded-md ${
                        log.includes('SUCCESS') ? 'bg-green-100 text-green-800' :
                        log.includes('ERROR') ? 'bg-red-100 text-red-800' :
                        log.includes('WARNING') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm">
                      Debug console hidden. Click "Show Debug" to view logs.
                    </div>
                  )}
                </div>
              </div>

              {/* Scraping Metrics */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Scraping Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Total URLs</h4>
                    <p className="text-2xl font-bold text-blue-600">{scrapingMetrics.totalUrls}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Successful Scrapes</h4>
                    <p className="text-2xl font-bold text-green-600">{scrapingMetrics.successfulScrapes}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Failed Scrapes</h4>
                    <p className="text-2xl font-bold text-red-600">{scrapingMetrics.failedScrapes}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Total Photos</h4>
                    <p className="text-2xl font-bold text-purple-600">{scrapingMetrics.totalPhotos}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Average Photos/Listing</h4>
                    <p className="text-2xl font-bold text-purple-600">{scrapingMetrics.averagePhotosPerListing.toFixed(1)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Scraping Time</h4>
                    <p className="text-2xl font-bold text-blue-600">{scrapingMetrics.scrapingTime}ms</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Data Quality</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm text-gray-600">Addresses Found</p>
                      <p className="text-sm font-semibold text-gray-900">{scrapingMetrics.dataQuality.addressesFound}</p>
                      <p className="text-sm text-gray-600">Prices Found</p>
                      <p className="text-sm font-semibold text-gray-900">{scrapingMetrics.dataQuality.pricesFound}</p>
                      <p className="text-sm text-gray-600">Descriptions Found</p>
                      <p className="text-sm font-semibold text-gray-900">{scrapingMetrics.dataQuality.descriptionsFound}</p>
                      <p className="text-sm text-gray-600">Features Found</p>
                      <p className="text-sm font-semibold text-gray-900">{scrapingMetrics.dataQuality.featuresFound}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showPhotoGallery && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedListing.address}</h3>
                <p className="text-blue-600 font-semibold">{selectedListing.price}</p>
              </div>
              <button
                onClick={() => setShowPhotoGallery(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {selectedListing.images.map((image, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${selectedListing.address} photo ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                {selectedListing.images.length} photos scraped from {new URL(selectedListing.listingUrl).hostname}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapingInterface; 