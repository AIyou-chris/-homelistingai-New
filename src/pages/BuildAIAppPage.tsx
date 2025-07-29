import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as listingService from '../services/listingService';
import * as workingZillowScraper from '../services/workingZillowScraper';
import { initializeTrialMessaging } from '../services/trialMessagingService';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { 
  Sparkles, 
  Eye, 
  Settings, 
  Brain, 
  MessageSquare, 
  Upload,
  Play,
  Zap,
  Target,
  Users,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Home,
  FileUp,
  Share2,
  Link2,
  Lightbulb,
  ImageIcon,
  Phone,
  Calendar,
  ArrowRight,
  MapPin,
  BarChart3
} from 'lucide-react';

interface BuildAIAppData {
  propertyUrl: string;
  agentName: string;
  agentPhone: string;
  agencyName: string;
  agentTitle: string;
  customPrompt: string;
  // Scraping toggles
  scrapePhotos: boolean;
  scrapePrice: boolean;
  scrapeDetails: boolean;
  scrapeDescription: boolean;
  scrapeSchools: boolean;
  scrapeNeighborhood: boolean;
  scrapeDirections: boolean;
  scrapePropertyInfo: boolean;
  scrapeAmenities: boolean;
  scrapeHistory: boolean;
  // AI training
  aiPersonality: string;
  knowledgeBase: string;
  // Photo management
  heroPhotos: string[];
  galleryPhotos: string[];
  // Additional details
  interiorFeatures: string[];
  keySellingPoints: string[];
  videoUrl: string;
  socialMediaLinks: string[];
  // Basic property info
  price: string;
  squareFootage: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  // App buttons (up to 6)
  appButtons: Array<{
    id: string;
    title: string;
    icon: string;
    color: string;
    enabled: boolean;
  }>;
  // Realtor info
  realtorPhoto: string;
  realtorSocialMedia: string[];
}

const BuildAIAppPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    photoManagement: false,
    additionalDetails: false,
    aiTraining: false
  });

  // Interactive phone pop-out state
  const [activePhonePreview, setActivePhonePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BuildAIAppData>({
    propertyUrl: '',
    agentName: '',
    agentPhone: '',
    agencyName: '',
    agentTitle: '',
    customPrompt: '',
    scrapePhotos: true,
    scrapePrice: true,
    scrapeDetails: true,
    scrapeDescription: true,
    scrapeSchools: true,
    scrapeNeighborhood: true,
    scrapeDirections: true,
    scrapePropertyInfo: true,
    scrapeAmenities: true,
    scrapeHistory: true,
    aiPersonality: 'Professional and friendly real estate agent',
    knowledgeBase: '',
    // Photo management
    heroPhotos: [],
    galleryPhotos: [],
    // Additional details
    interiorFeatures: [],
    keySellingPoints: [],
    videoUrl: '',
    socialMediaLinks: [],
    // Basic property info
    price: '',
    squareFootage: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    // App buttons (up to 6)
    appButtons: [
      { id: '1', title: 'Schools', icon: '🏫', color: 'blue', enabled: true },
      { id: '2', title: 'Neighborhood', icon: '🏘️', color: 'orange', enabled: true },
      { id: '3', title: 'Directions', icon: '🧭', color: 'green', enabled: true },
      { id: '4', title: 'Property Info', icon: '🏠', color: 'purple', enabled: true },
      { id: '5', title: 'Amenities', icon: '⭐', color: 'pink', enabled: true },
      { id: '6', title: 'History', icon: '📜', color: 'yellow', enabled: true }
    ],
    // Realtor info
    realtorPhoto: '',
    realtorSocialMedia: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'gallery') => {
    const files = Array.from(e.target.files || []);
    const newPhotoUrls = files.map(file => URL.createObjectURL(file));
    
    if (type === 'hero') {
      setFormData(prev => ({
        ...prev,
        heroPhotos: [...prev.heroPhotos, ...newPhotoUrls]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        galleryPhotos: [...prev.galleryPhotos, ...newPhotoUrls]
      }));
    }
  };

  const handleRemovePhoto = (urlToRemove: string, type: 'hero' | 'gallery') => {
    if (type === 'hero') {
      setFormData(prev => ({
        ...prev,
        heroPhotos: prev.heroPhotos.filter(url => url !== urlToRemove)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        galleryPhotos: prev.galleryPhotos.filter(url => url !== urlToRemove)
      }));
    }
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSocialMediaAdd = () => {
    const newLink = prompt('Enter social media URL:');
    if (newLink) {
      setFormData(prev => ({
        ...prev,
        socialMediaLinks: [...prev.socialMediaLinks, newLink]
      }));
    }
  };

  const handleScrape = async () => {
    if (!formData.propertyUrl) return;
    
    setIsLoading(true);
    try {
      console.log('🔍 Starting live scraping...');
      const scraped = await workingZillowScraper.scrapeZillowWorking(formData.propertyUrl);
      
      if (scraped) {
        setScrapedData(scraped);
        
        // Apply scraping toggles
        const filteredData = {
          ...scraped,
          images: formData.scrapePhotos ? scraped.images : [],
          price: formData.scrapePrice ? scraped.price : '$450,000',
          bedrooms: formData.scrapeDetails ? scraped.bedrooms : 3,
          bathrooms: formData.scrapeDetails ? scraped.bathrooms : 2,
          squareFeet: formData.scrapeDetails ? scraped.squareFeet : 1500,
          description: formData.scrapeDescription ? scraped.description : 'Beautiful property with modern amenities.'
        };
        
        setPreviewData(filteredData);
        console.log('✅ Scraping completed with toggles applied');
      }
    } catch (error) {
      console.error('❌ Scraping failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoLive = async () => {
    if (!previewData) return;
    
    setIsLoading(true);
    try {
      // Create trial listing
      const trialListing = {
        ...previewData,
        agent_id: user?.id || 'trial-user',
        is_trial: true,
        trial_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        status: 'active'
      };
      
      const created = await listingService.createListing(trialListing);
      
      if (created) {
        setIsLive(true);
        console.log('🚀 Trial listing created!');
        
        // Start messaging system
        startTrialMessaging(created.id);
        
        // Navigate to live app
        navigate(`/trial-app/${created.id}`);
      }
    } catch (error) {
      console.error('❌ Failed to go live:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTrialMessaging = async (listingId: string) => {
    // Initialize trial messaging system
    console.log('📧 Starting trial messaging for listing:', listingId);
    
    try {
      await initializeTrialMessaging(listingId);
      console.log('✅ Trial messaging initialized');
    } catch (error) {
      console.error('❌ Failed to initialize trial messaging:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Build Your AI App
          </h1>
          <p className="text-gray-600 text-lg">
            Create your AI-powered property assistant in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Edit Interface */}
          <div className="space-y-6">
            {/* Property URL & Scraping */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Property Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="propertyUrl">Zillow URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="propertyUrl"
                        name="propertyUrl"
                        value={formData.propertyUrl}
                        onChange={handleInputChange}
                        placeholder="https://www.zillow.com/homedetails/..."
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleScrape}
                        disabled={isLoading || !formData.propertyUrl}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isLoading ? 'Scraping...' : 'Scrape'}
                      </Button>
                    </div>
                  </div>

                  {/* Scraping Toggles */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">What to Scrape:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Switch
                          id="scrapePhotos"
                          checked={formData.scrapePhotos}
                          onCheckedChange={(checked) => handleToggleChange('scrapePhotos', checked)}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                        />
                        <Label htmlFor="scrapePhotos" className={`font-medium ${formData.scrapePhotos ? 'text-green-700' : 'text-gray-600'}`}>
                          Photos
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Switch
                          id="scrapePrice"
                          checked={formData.scrapePrice}
                          onCheckedChange={(checked) => handleToggleChange('scrapePrice', checked)}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                        />
                        <Label htmlFor="scrapePrice" className={`font-medium ${formData.scrapePrice ? 'text-green-700' : 'text-gray-600'}`}>
                          Price
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Switch
                          id="scrapeDetails"
                          checked={formData.scrapeDetails}
                          onCheckedChange={(checked) => handleToggleChange('scrapeDetails', checked)}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                        />
                        <Label htmlFor="scrapeDetails" className={`font-medium ${formData.scrapeDetails ? 'text-green-700' : 'text-gray-600'}`}>
                          Details
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Switch
                          id="scrapeDescription"
                          checked={formData.scrapeDescription}
                          onCheckedChange={(checked) => handleToggleChange('scrapeDescription', checked)}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                        />
                        <Label htmlFor="scrapeDescription" className={`font-medium ${formData.scrapeDescription ? 'text-green-700' : 'text-gray-600'}`}>
                          Description
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Additional Scraping Options - Double Row Buttons */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Additional Data to Scrape:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePhonePreview('schools')}
                        className={`h-12 ${formData.scrapeSchools ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg">🏫</div>
                          <div className="text-xs">Schools</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePhonePreview('neighborhood')}
                        className={`h-12 ${formData.scrapeNeighborhood ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg">🏘️</div>
                          <div className="text-xs">Neighborhood</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePhonePreview('directions')}
                        className={`h-12 ${formData.scrapeDirections ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg">🧭</div>
                          <div className="text-xs">Directions</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePhonePreview('property')}
                        className={`h-12 ${formData.scrapePropertyInfo ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg">🏠</div>
                          <div className="text-xs">Property Info</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePhonePreview('amenities')}
                        className={`h-12 ${formData.scrapeAmenities ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg">⭐</div>
                          <div className="text-xs">Amenities</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePhonePreview('history')}
                        className={`h-12 ${formData.scrapeHistory ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-lg">📜</div>
                          <div className="text-xs">History</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-semibold">Agent Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentName">Agent Name</Label>
                    <Input
                      id="agentName"
                      name="agentName"
                      value={formData.agentName}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentPhone">Phone</Label>
                    <Input
                      id="agentPhone"
                      name="agentPhone"
                      value={formData.agentPhone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agencyName">Agency</Label>
                    <Input
                      id="agencyName"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      placeholder="Premier Real Estate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentTitle">Title</Label>
                    <Input
                      id="agentTitle"
                      name="agentTitle"
                      value={formData.agentTitle}
                      onChange={handleInputChange}
                      placeholder="Real Estate Agent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Training */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-semibold">AI Training</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={() => toggleSection('aiTraining')}
                  >
                    {collapsedSections.aiTraining ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {!collapsedSections.aiTraining && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aiPersonality">AI Personality</Label>
                      <Textarea
                        id="aiPersonality"
                        name="aiPersonality"
                        value={formData.aiPersonality}
                        onChange={handleInputChange}
                        placeholder="Describe how your AI should behave..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="knowledgeBase">Knowledge Base</Label>
                      <Textarea
                        id="knowledgeBase"
                        name="knowledgeBase"
                        value={formData.knowledgeBase}
                        onChange={handleInputChange}
                        placeholder="Add specific information about the property, neighborhood, etc..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo Management */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold">Photo Management</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={() => toggleSection('photoManagement')}
                  >
                    {collapsedSections.photoManagement ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {!collapsedSections.photoManagement && (
                  <div className="space-y-6">
                    {/* Hero Photos (3 main sliders) */}
                    <div>
                      <Label className="text-sm font-medium">Hero Photos (Main Sliders)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload 3 main photos for the slider</p>
                        <Input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={(e) => handlePhotoUpload(e, 'hero')}
                          className="hidden"
                          id="heroPhotoUpload"
                        />
                        <Label htmlFor="heroPhotoUpload" className="cursor-pointer">
                          <Button type="button" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Hero Photos
                          </Button>
                        </Label>
                      </div>
                      {formData.heroPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {formData.heroPhotos.map((url, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={url} 
                                alt={`Hero ${index + 1}`} 
                                className="w-full h-20 object-cover rounded"
                              />
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="absolute top-1 right-1 h-6 w-6 p-0 text-xs"
                                onClick={() => handleRemovePhoto(url, 'hero')}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Gallery Photos (20+ additional) */}
                    <div>
                      <Label className="text-sm font-medium">Gallery Photos (Additional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload additional photos for the gallery</p>
                        <Input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={(e) => handlePhotoUpload(e, 'gallery')}
                          className="hidden"
                          id="galleryPhotoUpload"
                        />
                        <Label htmlFor="galleryPhotoUpload" className="cursor-pointer">
                          <Button type="button" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Gallery Photos
                          </Button>
                        </Label>
                      </div>
                      {formData.galleryPhotos.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {formData.galleryPhotos.map((url, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={url} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-full h-16 object-cover rounded"
                              />
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="absolute top-1 right-1 h-5 w-5 p-0 text-xs"
                                onClick={() => handleRemovePhoto(url, 'gallery')}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-green-600" />
                    <h3 className="text-xl font-semibold">Additional Details</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={() => toggleSection('additionalDetails')}
                  >
                    {collapsedSections.additionalDetails ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {!collapsedSections.additionalDetails && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-900 mb-2">Optional but Recommended</h4>
                          <p className="text-sm text-yellow-800 leading-relaxed">
                            These additional details will make your listing more comprehensive and help the AI provide 
                            better answers to potential buyers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="interiorFeatures">Interior Features & Amenities</Label>
                      <Textarea
                        id="interiorFeatures"
                        name="interiorFeatures"
                        value={formData.interiorFeatures.join('\n')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          interiorFeatures: e.target.value.split('\n').filter(line => line.trim())
                        }))}
                        placeholder="List key interior features and amenities..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="keySellingPoints">Key Selling Points</Label>
                      <Textarea
                        id="keySellingPoints"
                        name="keySellingPoints"
                        value={formData.keySellingPoints.join('\n')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          keySellingPoints: e.target.value.split('\n').filter(line => line.trim())
                        }))}
                        placeholder="List key selling points and unique features..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="videoUrl">Video Tour URL</Label>
                      <Input
                        id="videoUrl"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <Label>Social Media Links</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleSocialMediaAdd}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Add Social Link
                        </Button>
                      </div>
                      {formData.socialMediaLinks.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {formData.socialMediaLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Link2 className="w-4 h-4 text-gray-500" />
                              <span className="text-sm flex-1 truncate">{link}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setFormData(prev => ({
                                  ...prev, 
                                  socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index)
                                }))}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Go Live Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleGoLive}
                  disabled={isLoading || !previewData}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Going Live...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Go Live - Start 48-Hour Trial
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Your AI app will be live for 48 hours, then you can upgrade to keep it
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-semibold">Live Preview</h3>
                </div>
                
                {previewData ? (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Property Listing Modal Preview */}
                    <div className="max-w-md mx-auto">
                      {/* Property Header */}
                      <div className="relative">
                        {/* Property Image */}
                        <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
                          {previewData.images && previewData.images.length > 0 ? (
                            <img 
                              src={previewData.images[0]} 
                              alt="Property"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-6xl mb-2">🏠</div>
                                <div className="text-sm text-gray-500">Property Photo</div>
                              </div>
                            </div>
                          )}
                          
                          {/* Heart and Share Icons */}
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <span className="text-lg">❤️</span>
                            </button>
                            <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Property Info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">123 Oak Street</h3>
                              <p className="text-sm text-gray-600">Downtown Area</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">$499,000</div>
                              <div className="text-sm text-gray-600">3 bds • 2 ba • 1,850 sqft</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-600">123 Oak Street, Downtown Area</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                              <span className="text-sm text-gray-600">4.9 (23 reviews)</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-4">
                            Beautiful 3-bedroom, 2-bathroom home with modern upgrades. Features include updated kitchen, hardwood floors, and a spacious backyard. Perfect for families!
                          </p>
                          
                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <button className="flex-1 bg-purple-600 text-white text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4" />
                                Call Agent
                              </button>
                              <button className="flex-1 bg-green-600 text-white text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule Tour
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Chat with AI
                              </button>
                              <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                <ArrowRight className="w-4 h-4" />
                                Get Details
                              </button>
                            </div>
                          </div>
                          
                          {/* Property Information Section */}
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Property Information</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium">Neighborhood</span>
                                </div>
                                <Switch
                                  checked={formData.scrapeNeighborhood}
                                  onCheckedChange={(checked) => handleToggleChange('scrapeNeighborhood', checked)}
                                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🏫</span>
                                  <span className="text-sm font-medium">Schools</span>
                                </div>
                                <Switch
                                  checked={formData.scrapeSchools}
                                  onCheckedChange={(checked) => handleToggleChange('scrapeSchools', checked)}
                                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">⭐</span>
                                  <span className="text-sm font-medium">Home Data</span>
                                </div>
                                <Switch
                                  checked={formData.scrapePropertyInfo}
                                  onCheckedChange={(checked) => handleToggleChange('scrapePropertyInfo', checked)}
                                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium">Market Info</span>
                                </div>
                                <Switch
                                  checked={formData.scrapeHistory}
                                  onCheckedChange={(checked) => handleToggleChange('scrapeHistory', checked)}
                                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Agent Information */}
                          <div className="mt-6 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              SM
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">Sarah Martinez</p>
                              <p className="text-sm text-gray-600">Real Estate Agent</p>
                              <p className="text-sm text-gray-600">HomeListingAI</p>
                            </div>
                            <button className="bg-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg">
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Enter a Zillow URL and click "Scrape" to see your AI app preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trial Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-semibold">48-Hour Trial</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live AI assistant for 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time lead generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Automated follow-up messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Performance analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Upgrade to keep your app and leads</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

                        {/* Interactive Phone Pop-out */}
                {activePhonePreview && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {activePhonePreview === 'schools' && '🏫 Schools Nearby'}
                          {activePhonePreview === 'neighborhood' && '🏘️ Neighborhood Info'}
                          {activePhonePreview === 'directions' && '🧭 Directions & Commute'}
                          {activePhonePreview === 'property' && '🏠 Property Details'}
                          {activePhonePreview === 'amenities' && '⭐ Amenities & Features'}
                          {activePhonePreview === 'history' && '📜 Property History'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivePhonePreview(null)}
                          className="p-1"
                        >
                          ×
                        </Button>
                      </div>

                      {/* Floating Phone Preview */}
                      <div className="mx-auto w-64 h-[400px] bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="h-6 bg-gray-100 flex items-center justify-between px-4 text-xs">
                            <span>9:41</span>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-1 bg-gray-400 rounded-sm"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* App Header */}
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                            <div className="flex items-center justify-between text-white">
                              <div>
                                <h3 className="font-bold text-sm">HomeListingAI</h3>
                                <p className="text-xs opacity-90">AI Property Assistant</p>
                              </div>
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Content based on active preview */}
                          <div className="p-3 space-y-3">
                            {activePhonePreview === 'schools' && (
                              <div className="space-y-2">
                                <div className="bg-blue-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">🏫</span>
                                    <span className="text-xs font-medium">Nearby Schools</span>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Elementary School</span>
                                      <span className="text-green-600">0.5 mi</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Middle School</span>
                                      <span className="text-green-600">1.2 mi</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>High School</span>
                                      <span className="text-green-600">2.1 mi</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-2">
                                  <div className="text-xs">
                                    <span className="font-medium">School Ratings:</span>
                                    <div className="flex gap-1 mt-1">
                                      <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                      <span className="text-xs text-gray-600">(4.8/5)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activePhonePreview === 'neighborhood' && (
                              <div className="space-y-2">
                                <div className="bg-purple-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">🏘️</span>
                                    <span className="text-xs font-medium">Neighborhood</span>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Walk Score</span>
                                      <span className="text-green-600">85</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Transit Score</span>
                                      <span className="text-green-600">78</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bike Score</span>
                                      <span className="text-green-600">92</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-2">
                                  <div className="text-xs">
                                    <span className="font-medium">Nearby:</span>
                                    <div className="mt-1 space-y-1">
                                      <div>🛒 Grocery Store (0.3 mi)</div>
                                      <div>☕ Coffee Shop (0.2 mi)</div>
                                      <div>🏥 Hospital (1.5 mi)</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activePhonePreview === 'directions' && (
                              <div className="space-y-2">
                                <div className="bg-orange-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">🧭</span>
                                    <span className="text-xs font-medium">Commute Times</span>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Downtown</span>
                                      <span className="text-green-600">15 min</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Airport</span>
                                      <span className="text-green-600">25 min</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Major Highway</span>
                                      <span className="text-green-600">5 min</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-2">
                                  <div className="text-xs">
                                    <span className="font-medium">Transportation:</span>
                                    <div className="mt-1 space-y-1">
                                      <div>🚇 Metro Station (0.8 mi)</div>
                                      <div>🚌 Bus Stop (0.2 mi)</div>
                                      <div>🚗 Freeway Access (2 min)</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activePhonePreview === 'property' && (
                              <div className="space-y-2">
                                <div className="bg-blue-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">🏠</span>
                                    <span className="text-xs font-medium">Property Details</span>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Year Built</span>
                                      <span>1995</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Lot Size</span>
                                      <span>0.25 acres</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Style</span>
                                      <span>Colonial</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Parking</span>
                                      <span>2-car garage</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-2">
                                  <div className="text-xs">
                                    <span className="font-medium">Recent Updates:</span>
                                    <div className="mt-1 space-y-1">
                                      <div>🏠 Kitchen Renovation (2022)</div>
                                      <div>🛁 Bathroom Update (2021)</div>
                                      <div>🖼️ New Windows (2020)</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activePhonePreview === 'amenities' && (
                              <div className="space-y-2">
                                <div className="bg-purple-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">⭐</span>
                                    <span className="text-xs font-medium">Amenities</span>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div>🏊‍♂️ Community Pool</div>
                                    <div>🏋️‍♀️ Fitness Center</div>
                                    <div>🎾 Tennis Courts</div>
                                    <div>🚶‍♀️ Walking Trails</div>
                                    <div>🅿️ Guest Parking</div>
                                  </div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-2">
                                  <div className="text-xs">
                                    <span className="font-medium">Home Features:</span>
                                    <div className="mt-1 space-y-1">
                                      <div>🔥 Fireplace</div>
                                      <div>🏠 Hardwood Floors</div>
                                      <div>🌞 Solar Panels</div>
                                      <div>🔒 Smart Security</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activePhonePreview === 'history' && (
                              <div className="space-y-2">
                                <div className="bg-yellow-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">📜</span>
                                    <span className="text-xs font-medium">Property History</span>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Last Sold</span>
                                      <span>2020</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Price History</span>
                                      <span className="text-green-600">+15%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Days on Market</span>
                                      <span>12</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-2">
                                  <div className="text-xs">
                                    <span className="font-medium">Market Trends:</span>
                                    <div className="mt-1 space-y-1">
                                      <div>📈 Area Appreciation: +8%</div>
                                      <div>🏘️ Similar Homes: 3 active</div>
                                      <div>💰 Price per sqft: $245</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Button */}
                            <button className="w-full bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg">
                              Learn More
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="text-sm text-gray-600">Scrape this data:</span>
                        <Switch
                          checked={
                            (activePhonePreview === 'schools' && formData.scrapeSchools) ||
                            (activePhonePreview === 'neighborhood' && formData.scrapeNeighborhood) ||
                            (activePhonePreview === 'directions' && formData.scrapeDirections) ||
                            (activePhonePreview === 'property' && formData.scrapePropertyInfo) ||
                            (activePhonePreview === 'amenities' && formData.scrapeAmenities) ||
                            (activePhonePreview === 'history' && formData.scrapeHistory)
                          }
                          onCheckedChange={(checked) => {
                            const fieldMap: Record<string, keyof BuildAIAppData> = {
                              schools: 'scrapeSchools',
                              neighborhood: 'scrapeNeighborhood',
                              directions: 'scrapeDirections',
                              property: 'scrapePropertyInfo',
                              amenities: 'scrapeAmenities',
                              history: 'scrapeHistory'
                            };
                            const field = fieldMap[activePhonePreview];
                            if (field) {
                              handleToggleChange(field, checked);
                            }
                          }}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
      </div>
    </div>
  );
};

export default BuildAIAppPage; 