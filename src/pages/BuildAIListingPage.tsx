import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, 
  X, 
  Upload, 
  Trash2, 
  Settings, 
  MessageCircle, 
  Camera, 
  Palette,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  AlertCircle,
  Sparkles,
  Users,
  BarChart3,
  Share2,
  Globe,
  MapPin,
  Calculator,
  GraduationCap,
  Car,
  Wifi,
  Shield,
  Zap,
  Plus,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Calendar,
  Bookmark,
  Heart,
  Video,
  Image,
  User,
  Building,
  Link,
  ExternalLink,
  Play,
  Mic,
  Smartphone as Mobile,
  Download,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  FileText,
  Search,
  Download as DownloadIcon,
  Star,
  Image as ImageIcon,
  Crown,
  ArrowRight,
  CheckCircle,
  Home,
  DollarSign,
  Bed,
  Bath,
  Square,
  MessageSquare
} from 'lucide-react';
import { createListing } from '../services/listingService';
import scrapingService from '../services/scrapingService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import ChatBot from '../components/shared/ChatBot';
import VoiceBot from '../components/shared/VoiceBot';

interface ScrapingProgress {
  stage: 'initializing' | 'searching' | 'scraping' | 'processing' | 'complete' | 'error';
  message: string;
  progress: number;
  data?: any;
}

interface ListingData {
  title: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  description: string;
  imageUrls: string[];
  agentInfo: {
    name: string;
    phone: string;
    email: string;
    photo: string;
  };
  features: string[];
  amenities: string[];
  schools: any[];
  comparables: any[];
  walkScore: number;
  propertyType: string;
  yearBuilt: number;
  lotSize: string;
  parking: string;
  heating: string;
  cooling: string;
}

interface FormData {
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  description: string;
  knowledge_base: string;
}

interface AgentInfo {
  name: string;
  email: string;
  phone: string;
  bio: string;
  logo: string;
  headshot: string;
  website: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  mediaLinks: {
    video1?: string;
    video2?: string;
  };
}

interface FeatureSettings {
  // Core Features
  messaging: boolean;
  schoolInfo: boolean;
  mortgageCalculator: boolean;
  directions: boolean;
  virtualTour: boolean;
  contactForms: boolean;
  socialMedia: boolean;
  gallery: boolean;
  map: boolean;
  comparables: boolean;
  financing: boolean;
  history: boolean;
  reports: boolean;
  amenities: boolean;
  neighborhood: boolean;
  schedule: boolean;
  
  // Enhanced Features
  aiPersonality: 'professional' | 'friendly' | 'luxury' | 'casual';
  responseSpeed: 'instant' | 'fast' | 'normal';
  leadCapture: 'email' | 'phone' | 'both' | 'none';
  analytics: boolean;
  seoSettings: boolean;
  socialSharing: boolean;
  
  // Messaging Features
  autoReply: boolean;
  messageTemplates: boolean;
  contactMethods: {
    email: boolean;
    phone: boolean;
    inApp: boolean;
  };
}

const BuildAIListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState<ScrapingProgress>({
    stage: 'initializing',
    message: 'Initializing AI listing builder...',
    progress: 0
  });
  const [listingData, setListingData] = useState<ListingData>({
    title: '',
    address: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    description: '',
    imageUrls: [],
    agentInfo: {
      name: '',
      phone: '',
      email: '',
      photo: ''
    },
    features: [],
    amenities: [],
    schools: [],
    comparables: [],
    walkScore: 0,
    propertyType: '',
    yearBuilt: 0,
    lotSize: '',
    parking: '',
    heating: '',
    cooling: ''
  });

  // Modern state management
  const [formData, setFormData] = useState<FormData>({
    title: '',
    address: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    square_footage: 0,
    description: '',
    knowledge_base: ''
  });

  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    logo: '',
    headshot: '',
    website: '',
    socialMedia: {},
    mediaLinks: {}
  });

  const [featureSettings, setFeatureSettings] = useState<FeatureSettings>({
    messaging: true,
    schoolInfo: true,
    mortgageCalculator: true,
    directions: true,
    virtualTour: true,
    contactForms: true,
    socialMedia: true,
    gallery: true,
    map: true,
    comparables: true,
    financing: true,
    history: true,
    reports: true,
    amenities: true,
    neighborhood: true,
    schedule: true,
    aiPersonality: 'professional',
    responseSpeed: 'instant',
    leadCapture: 'both',
    analytics: true,
    seoSettings: true,
    socialSharing: true,
    autoReply: true,
    messageTemplates: true,
    contactMethods: {
      email: true,
      phone: true,
      inApp: true
    }
  });

  // URL Scraper state
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // Modal states
  const [showAIChat, setShowAIChat] = useState(false);
  const [showTrialSignup, setShowTrialSignup] = useState(false);

  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    urlScraper: false,
    gallery: false,
    features: false,
    agentInfo: false
  });

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgentInfoChange = (field: keyof AgentInfo, value: any) => {
    setAgentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature: keyof FeatureSettings) => {
    setFeatureSettings(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // URL Scraping functions
  const startScraping = async (url: string) => {
    if (!url.trim()) return;
    
    setIsScraping(true);
    setScrapingProgress({
      stage: 'initializing',
      message: 'Initializing scraping...',
      progress: 0
    });

    try {
      await simulateScrapingStages(url);
    } catch (error) {
      console.error('Scraping error:', error);
      setScrapingProgress({
        stage: 'error',
        message: 'Error scraping data. Please try again.',
        progress: 0
      });
    } finally {
      setIsScraping(false);
    }
  };

  const simulateScrapingStages = async (url: string) => {
    const stages = [
      { stage: 'searching', message: 'Searching for property data...', progress: 20 },
      { stage: 'scraping', message: 'Extracting property information...', progress: 40 },
      { stage: 'processing', message: 'Processing and organizing data...', progress: 70 },
      { stage: 'complete', message: 'Data extraction complete!', progress: 100 }
    ];

    for (const stage of stages) {
      setScrapingProgress(stage);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get mock data based on URL
    const mockData = getMockScrapedData(url);
    setListingData(mockData);
    setFormData({
      title: mockData.title,
      address: mockData.address,
      price: parseInt(mockData.price.replace(/[^0-9]/g, '')),
      bedrooms: mockData.bedrooms,
      bathrooms: mockData.bathrooms,
      square_footage: mockData.squareFootage,
      description: mockData.description,
      knowledge_base: ''
    });
  };

  const getMockScrapedData = (url: string): ListingData => {
    // Generate unique data based on URL hash
    const hash = url.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const mockData = {
      title: `Beautiful ${['Modern', 'Luxury', 'Cozy', 'Spacious'][Math.abs(hash) % 4]} Home`,
      address: `${Math.abs(hash) % 9999} ${['Oak', 'Maple', 'Pine', 'Cedar'][Math.abs(hash) % 4]} St, City, State ${Math.abs(hash) % 99999}`,
      price: `$${(Math.abs(hash) % 500000) + 200000}`,
      bedrooms: (Math.abs(hash) % 5) + 2,
      bathrooms: (Math.abs(hash) % 4) + 1,
      squareFootage: ((Math.abs(hash) % 2000) + 1000),
      description: 'This stunning property features modern amenities, beautiful finishes, and a prime location. Perfect for families looking for comfort and style.',
      imageUrls: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
      ],
      agentInfo: {
        name: 'Sarah Martinez',
        phone: '(555) 123-4567',
        email: 'sarah@realestate.com',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200'
      },
      features: ['Hardwood Floors', 'Updated Kitchen', 'Large Backyard', 'Garage'],
      amenities: ['Pool', 'Gym', 'Parking', 'Security'],
      schools: [],
      comparables: [],
      walkScore: 85,
      propertyType: 'Single Family',
      yearBuilt: 2015,
      lotSize: '0.25 acres',
      parking: '2-car garage',
      heating: 'Central',
      cooling: 'Central'
    };

    return mockData;
  };

  const saveListing = async () => {
    setIsLoading(true);
    try {
      // Check if user is logged in (mock check)
      const isLoggedIn = localStorage.getItem('mock_user');
      
      if (!isLoggedIn) {
        setShowTrialSignup(true);
        return;
      }

      // Create the listing
      const newListing = {
        ...formData,
        image_urls: listingData.imageUrls,
        agent_id: 'mock-agent-id',
        status: 'active',
        created_at: new Date().toISOString()
      };

      await createListing(newListing);
      
      // Navigate to dashboard with success
      navigate('/dashboard/listings?trial=success&listing=created');
    } catch (error) {
      console.error('Error saving listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrialSignup = async () => {
    // Simulate trial signup
    const trialUser = {
      id: 'trial-user-' + Date.now(),
      name: 'Trial User',
      email: 'trial@example.com',
      role: 'agent',
      trial: true,
      trialExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem('mock_user', JSON.stringify(trialUser));
    setShowTrialSignup(false);
    
    // Save the listing after signup
    await saveListing();
  };

  const openChat = () => {
    setShowAIChat(true);
  };

  const openVoice = () => {
    // Voice functionality
  };

  const previewListing = () => {
    navigate('/dashboard/listings/mobile/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Build AI Listing</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  7-Day Trial
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={openChat}
                className="flex items-center space-x-2"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">AI Chat</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={previewListing}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              
              <Button
                onClick={saveListing}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Dashboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* URL Scraper Section */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Import Listing Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Enter Zillow, Realtor.com, or MLS URL"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => startScraping(urlInput)}
                      disabled={isScraping || !urlInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isScraping ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Scrape
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isScraping && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-800">{scrapingProgress.message}</span>
                      </div>
                      <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scrapingProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span>Basic Information</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('basicInfo')}
                  >
                    {collapsedSections.basicInfo ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {!collapsedSections.basicInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Property Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter property title"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter full address"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single-family">Single Family</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="multi-family">Multi-Family</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            name="bedrooms"
                            type="number"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                            placeholder="Number of bedrooms"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            name="bathrooms"
                            type="number"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            placeholder="Number of bathrooms"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="square_footage">Square Footage</Label>
                          <Input
                            id="square_footage"
                            name="square_footage"
                            type="number"
                            value={formData.square_footage}
                            onChange={handleInputChange}
                            placeholder="Square footage"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            name="yearBuilt"
                            type="number"
                            placeholder="Year built"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter property description"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* AI Features */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>AI Features</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('features')}
                  >
                    {collapsedSections.features ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {!collapsedSections.features && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium">AI Chat Assistant</p>
                              <p className="text-sm text-gray-500">24/7 automated responses</p>
                            </div>
                          </div>
                          <Switch
                            checked={featureSettings.messaging}
                            onCheckedChange={() => handleFeatureToggle('messaging')}
                            className={`${featureSettings.messaging ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium">Voice Assistant</p>
                              <p className="text-sm text-gray-500">Phone-based AI support</p>
                            </div>
                          </div>
                          <Switch
                            checked={featureSettings.autoReply}
                            onCheckedChange={() => handleFeatureToggle('autoReply')}
                            className={`${featureSettings.autoReply ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Eye className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium">Lead Tracking</p>
                              <p className="text-sm text-gray-500">Monitor visitor activity</p>
                            </div>
                          </div>
                          <Switch
                            checked={featureSettings.analytics}
                            onCheckedChange={() => handleFeatureToggle('analytics')}
                            className={`${featureSettings.analytics ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            <div>
                              <p className="font-medium">Auto Follow-ups</p>
                              <p className="text-sm text-gray-500">Automated lead nurturing</p>
                            </div>
                          </div>
                          <Switch
                            checked={featureSettings.messageTemplates}
                            onCheckedChange={() => handleFeatureToggle('messageTemplates')}
                            className={`${featureSettings.messageTemplates ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Trial Status */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span>Trial Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">6</p>
                      <p className="text-sm text-gray-600">Days Remaining</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">All</p>
                      <p className="text-sm text-gray-600">Features Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">3</p>
                      <p className="text-sm text-gray-600">Leads Generated</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Preview */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Quick Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold">{formData.title || 'No title'}</h3>
                    <p className="text-sm text-gray-600">{formData.address || 'No address'}</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formData.price ? `$${formData.price.toLocaleString()}` : 'No price'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.bedrooms} 🛏️ {formData.bathrooms} 🛁 {formData.square_footage} sqft
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIChat(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ChatBot onClose={() => setShowAIChat(false)} />
          </div>
        </div>
      )}

      {/* Trial Signup Modal */}
      {showTrialSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your 7-Day Free Trial</h3>
              <p className="text-gray-600 mb-6">
                Create your first AI listing and experience the power of automated lead generation.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={handleTrialSignup}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Free Trial
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowTrialSignup(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildAIListingPage; 