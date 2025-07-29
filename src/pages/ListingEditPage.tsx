import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Image as ImageIcon
} from 'lucide-react';
import { getListingById, updateListing } from '../services/listingService';
import { Listing } from '../types';
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

const ListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    name: 'John Smith',
    email: 'john@homelistingai.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced real estate agent with over 10 years in the market.',
    logo: '',
    headshot: '',
    website: '',
    socialMedia: {},
    mediaLinks: {}
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [heroPhotos, setHeroPhotos] = useState<string[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPWAInstall, setShowPWAInstall] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState({
    stage: 'idle',
    message: '',
    progress: 0,
    percentage: 0
  });

  // Feature settings
  const [features, setFeatures] = useState<FeatureSettings>({
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
    responseSpeed: 'fast',
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

  // Add new state for drag and drop
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Media links state
  const [mediaLinks, setMediaLinks] = useState({
    virtualTour: '',
    propertyVideo: '',
    droneFootage: '',
    neighborhoodVideo: '',
    agentInterview: '',
    additionalMedia: ''
  });

  // Media player modal state
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{type: string, url: string} | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchListing();
    } else if (id === 'new') {
      // For new listings, initialize with empty data
      setLoading(false);
      setFormData({
        title: '',
        address: '',
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        square_footage: 0,
        description: '',
        knowledge_base: ''
      });
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await getListingById(id!);
      if (!data) {
        throw new Error('Listing not found');
      }
      setListing(data);
      setFormData({
        title: data.title,
        address: data.address,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        square_footage: data.square_footage,
        description: data.description,
        knowledge_base: typeof data.knowledge_base === 'string' ? data.knowledge_base : ''
      });
      setPhotos(data.image_urls || []);
      setHeroPhotos(data.image_urls?.slice(0, 3) || []);
      setGalleryPhotos(data.image_urls || []);
    } catch (error) {
      setError('Failed to load listing');
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleAgentInfoChange = (field: keyof AgentInfo, value: any) => {
    setAgentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature: keyof FeatureSettings) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleContactMethodToggle = (method: keyof FeatureSettings['contactMethods']) => {
    setFeatures(prev => ({
      ...prev,
      contactMethods: {
        ...prev.contactMethods,
        [method]: !prev.contactMethods[method]
      }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
    setGalleryPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (urlToRemove: string) => {
    setPhotos(prev => prev.filter(url => url !== urlToRemove));
    setGalleryPhotos(prev => prev.filter(url => url !== urlToRemove));
    setHeroPhotos(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleHeroPhotoToggle = (photoUrl: string) => {
    if (heroPhotos.includes(photoUrl)) {
      setHeroPhotos(prev => prev.filter(url => url !== photoUrl));
    } else if (heroPhotos.length < 3) {
      setHeroPhotos(prev => [...prev, photoUrl]);
    }
  };

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handleSave = async () => {
    if (!listing || !formData) return;
    
    setSaving(true);
    try {
      const updatedListing = {
        ...listing,
        ...formData,
        image_urls: photos,
        mobile_config: {
          activeButtons: features as unknown as Record<string, boolean>,
          lastUpdated: new Date().toISOString()
        }
      };
      
      await updateListing(listing.id, updatedListing);
      navigate('/dashboard/listings');
    } catch (error) {
      setError('Failed to save listing');
      console.error('Error saving listing:', error);
    } finally {
      setSaving(false);
    }
  };

  const openChat = () => {
    setShowChat(true);
    setShowVoice(false);
  };

  const openVoice = () => {
    setShowVoice(true);
    setShowChat(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handlePWAInstall = () => {
    setShowPWAInstall(true);
  };

  const handleScheduleShowing = () => {
    // Navigate to scheduling page or open scheduling modal
    console.log('Schedule showing');
  };

  // Scraping functions
  const startScraping = async (url: string) => {
    setIsScraping(true);
    setScrapingProgress({
      stage: 'initializing',
      message: 'Initializing scraping engine...',
      progress: 0,
      percentage: 0
    });

    try {
      // Simulate scraping stages
      await simulateScrapingStages(url);
    } catch (error) {
      console.error('Scraping failed:', error);
      setScrapingProgress({
        stage: 'error',
        message: 'Failed to scrape listing. Please try again.',
        progress: 0,
        percentage: 0
      });
    } finally {
      setIsScraping(false);
    }
  };

  const simulateScrapingStages = async (url: string) => {
    const stages = [
      { stage: 'connecting', message: 'Connecting to listing source...', progress: 20 },
      { stage: 'extracting', message: 'Extracting property data...', progress: 40 },
      { stage: 'processing', message: 'Processing images and details...', progress: 60 },
      { stage: 'analyzing', message: 'Analyzing property features...', progress: 80 },
      { stage: 'completing', message: 'Finalizing data extraction...', progress: 100 }
    ];

    for (const stage of stages) {
      setScrapingProgress({
        ...stage,
        percentage: stage.progress
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Auto-fill with scraped data
    const scrapedData = getMockScrapedData(url);
    if (formData) {
      setFormData({
        ...formData,
        title: scrapedData.title || '',
        address: scrapedData.address || '',
        price: scrapedData.price || 0,
        bedrooms: scrapedData.bedrooms || 0,
        bathrooms: scrapedData.bathrooms || 0,
        square_footage: scrapedData.squareFootage || 0,
        description: scrapedData.description || ''
      });
    }
    setPhotos(scrapedData.imageUrls || []);
    setHeroPhotos(scrapedData.imageUrls?.slice(0, 3) || []);
    setGalleryPhotos(scrapedData.imageUrls || []);

    setScrapingProgress({
      stage: 'completed',
      message: 'Data extracted successfully!',
      progress: 100,
      percentage: 100
    });
  };

  const getMockScrapedData = (url: string) => {
    // Generate unique data based on URL hash
    const urlHash = url.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Property types
    const propertyTypes = [
      'Modern Single-Family Home',
      'Luxury Estate',
      'Charming Cottage',
      'Contemporary Townhouse',
      'Spacious Ranch',
      'Elegant Colonial',
      'Cozy Bungalow',
      'Stunning Villa'
    ];
    
    // Addresses
    const addresses = [
      '123 Oak Street, Springfield, IL 62701',
      '456 Pine Avenue, Chicago, IL 60601',
      '789 Maple Drive, Boston, MA 02101',
      '321 Elm Road, Austin, TX 73301',
      '654 Cedar Lane, Seattle, WA 98101',
      '987 Birch Court, Miami, FL 33101',
      '147 Willow Way, Denver, CO 80201',
      '258 Spruce Street, Portland, OR 97201'
    ];
    
    // Descriptions
    const descriptions = [
      'Stunning single-family home with modern amenities, updated kitchen, and spacious backyard. Perfect for families looking for comfort and convenience.',
      'Exquisite luxury home featuring high-end finishes, gourmet kitchen, master suite with spa bathroom, and resort-style pool. A true entertainer\'s dream.',
      'Adorable cottage with character, updated systems, and beautiful landscaping. Ideal for first-time buyers or investors.',
      'Contemporary townhouse with open floor plan, high ceilings, and urban convenience. Perfect for professionals and small families.',
      'Spacious ranch-style home with one-level living, large lot, and plenty of room to grow. Ideal for families and entertaining.',
      'Elegant colonial with classic architecture, hardwood floors, and timeless appeal. A true family home with character.',
      'Cozy bungalow with charm, updated kitchen, and perfect size for first-time buyers or downsizers.',
      'Stunning villa with Mediterranean influence, courtyard, and luxury finishes throughout. A one-of-a-kind property.'
    ];
    
    // Image sets
    const imageSets = [
      [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
      ],
      [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
      ]
    ];
    
    // Use URL hash to generate consistent but unique data
    const index = Math.abs(urlHash) % 8;
    const priceBase = Math.abs(urlHash) % 500000 + 200000; // $200k - $700k
    const bedrooms = (Math.abs(urlHash) % 4) + 2; // 2-5 bedrooms
    const bathrooms = (Math.abs(urlHash) % 3) + 1; // 1-3 bathrooms
    const squareFootage = (Math.abs(urlHash) % 2000) + 1000; // 1000-3000 sq ft
    
    return {
      title: propertyTypes[index],
      address: addresses[index],
      price: priceBase,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      squareFootage: squareFootage,
      description: descriptions[index],
      imageUrls: imageSets[index]
    };
  };

  const previewListing = () => {
    // Navigate to mobile listing preview
    navigate(`/dashboard/listings/mobile/demo`);
  };

  // Add drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedPhotos(prev => [...prev, result]);
        setPhotos(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedPhotos(prev => [...prev, result]);
        setPhotos(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoToRemove: string) => {
    setPhotos(prev => prev.filter(photo => photo !== photoToRemove));
    setUploadedPhotos(prev => prev.filter(photo => photo !== photoToRemove));
    setHeroPhotos(prev => prev.filter(photo => photo !== photoToRemove));
  };

  const handleMediaLinkChange = (field: keyof typeof mediaLinks, value: string) => {
    setMediaLinks(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Listing</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard/listings')}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/listings')}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Edit Listing</h1>
              <Badge variant="secondary" className="ml-2">
                {listing?.title}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={previewListing}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          
          {/* URL Scraper Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Search className="w-5 h-5" />
                Import Listing Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url-input">Enter listing URL to auto-fill data</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://zillow.com/... or https://realtor.com/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => startScraping(urlInput)}
                      disabled={!urlInput || isScraping}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isScraping ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Scraping...
                        </div>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Scrape
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {isScraping && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{scrapingProgress.stage}</span>
                      <span>{scrapingProgress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scrapingProgress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {scrapingProgress.stage === 'Complete!' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Data imported successfully!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('basicInfo')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                {collapsedSections.basicInfo ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.basicInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title">Property Title</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          value={formData?.title || ''} 
                          onChange={handleInputChange}
                          placeholder="Beautiful 3-Bedroom Home"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData?.address || ''} 
                          onChange={handleInputChange}
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input 
                          id="price" 
                          name="price" 
                          type="number"
                          value={formData?.price || ''} 
                          onChange={handleInputChange}
                          placeholder="500000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input 
                          id="bedrooms" 
                          name="bedrooms" 
                          type="number"
                          value={formData?.bedrooms || ''} 
                          onChange={handleInputChange}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input 
                          id="bathrooms" 
                          name="bathrooms" 
                          type="number"
                          value={formData?.bathrooms || ''} 
                          onChange={handleInputChange}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="square_footage">Square Footage</Label>
                        <Input 
                          id="square_footage" 
                          name="square_footage" 
                          type="number"
                          value={formData?.square_footage || ''} 
                          onChange={handleInputChange}
                          placeholder="1500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={formData?.description || ''} 
                        onChange={handleInputChange} 
                        rows={6}
                        placeholder="Describe the property's features, amenities, and unique selling points..."
                      />
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Combined Photo Management Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('photoManagement')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photo Management
                </CardTitle>
                {collapsedSections.photoManagement ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.photoManagement && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    {/* Hero Photos Section */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Hero Photos (Select 3 for slider)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {[0, 1, 2].map((slot) => (
                          <div key={slot} className="relative">
                            <Label className="block mb-2">Hero Photo {slot + 1}</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors min-h-[120px] flex items-center justify-center">
                              {heroPhotos[slot] ? (
                                <div className="relative w-full">
                                  <img 
                                    src={heroPhotos[slot]} 
                                    alt={`Hero ${slot + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => {
                                      const newHeroPhotos = [...heroPhotos];
                                      newHeroPhotos.splice(slot, 1);
                                      setHeroPhotos(newHeroPhotos);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                  <Camera className="w-8 h-8 mb-2" />
                                  <span className="text-sm">Empty slot</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Select up to 3 photos for the hero slider. These will be the first images visitors see.</p>
                    </div>

                    {/* Drag & Drop Upload Section */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-500" />
                        Upload Photos
                      </h4>
                      
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                          isDragOver 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h5 className="text-lg font-medium text-gray-900 mb-2">
                          Drag & drop photos here
                        </h5>
                        <p className="text-gray-500 mb-4">
                          or click to browse files
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </label>
                      </div>
                    </div>

                    {/* Gallery Photos Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-green-500" />
                        Gallery Photos ({photos.length} total)
                      </h4>
                      
                      {photos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No photos uploaded yet. Drag and drop or click "Choose Files" above to add photos.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {photos.map((photo, index) => (
                            <div 
                              key={index}
                              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                heroPhotos.includes(photo) 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img 
                                src={photo} 
                                alt={`Photo ${index + 1}`}
                                className="w-full h-24 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {heroPhotos.includes(photo) ? (
                                  <Check className="w-6 h-6 text-white" />
                                ) : (
                                  <Plus className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div className="absolute top-1 right-1">
                                <Badge variant={heroPhotos.includes(photo) ? "default" : "secondary"}>
                                  {heroPhotos.indexOf(photo) + 1}
                                </Badge>
                              </div>
                              <button
                                onClick={() => removePhoto(photo)}
                                className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-1 left-1">
                                <button
                                  onClick={() => handleHeroPhotoToggle(photo)}
                                  className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-white transition-colors"
                                >
                                  {heroPhotos.includes(photo) ? 'Remove from Hero' : 'Add to Hero'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Media Links Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('mediaLinks')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Media Links
                </CardTitle>
                {collapsedSections.mediaLinks ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.mediaLinks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Virtual Tour */}
                      <div>
                        <Label htmlFor="virtualTour" className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-blue-500" />
                          Virtual Tour URL
                        </Label>
                                               <Input 
                         id="virtualTour" 
                         name="virtualTour" 
                         value={mediaLinks.virtualTour}
                         onChange={(e) => handleMediaLinkChange('virtualTour', e.target.value)}
                         placeholder="https://matterport.com/... or https://youtube.com/..."
                         className="w-full"
                       />
                        <p className="text-xs text-gray-500 mt-1">Add a 3D virtual tour or video walkthrough</p>
                      </div>

                      {/* Property Video */}
                      <div>
                        <Label htmlFor="propertyVideo" className="flex items-center gap-2 mb-2">
                          <Play className="w-4 h-4 text-red-500" />
                          Property Video URL
                        </Label>
                                               <Input 
                         id="propertyVideo" 
                         name="propertyVideo" 
                         value={mediaLinks.propertyVideo}
                         onChange={(e) => handleMediaLinkChange('propertyVideo', e.target.value)}
                         placeholder="https://youtube.com/... or https://vimeo.com/..."
                         className="w-full"
                       />
                        <p className="text-xs text-gray-500 mt-1">Add a property showcase video</p>
                      </div>

                      {/* Drone Footage */}
                      <div>
                        <Label htmlFor="droneFootage" className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-green-500" />
                          Drone Footage URL
                        </Label>
                                               <Input 
                         id="droneFootage" 
                         name="droneFootage" 
                         value={mediaLinks.droneFootage}
                         onChange={(e) => handleMediaLinkChange('droneFootage', e.target.value)}
                         placeholder="https://youtube.com/... or https://vimeo.com/..."
                         className="w-full"
                       />
                        <p className="text-xs text-gray-500 mt-1">Add aerial drone footage of the property</p>
                      </div>

                      {/* Neighborhood Video */}
                      <div>
                        <Label htmlFor="neighborhoodVideo" className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4 text-purple-500" />
                          Neighborhood Video URL
                        </Label>
                                               <Input 
                         id="neighborhoodVideo" 
                         name="neighborhoodVideo" 
                         value={mediaLinks.neighborhoodVideo}
                         onChange={(e) => handleMediaLinkChange('neighborhoodVideo', e.target.value)}
                         placeholder="https://youtube.com/... or https://vimeo.com/..."
                         className="w-full"
                       />
                        <p className="text-xs text-gray-500 mt-1">Add a neighborhood overview video</p>
                      </div>

                      {/* Agent Interview */}
                      <div>
                        <Label htmlFor="agentInterview" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-orange-500" />
                          Agent Interview URL
                        </Label>
                                               <Input 
                         id="agentInterview" 
                         name="agentInterview" 
                         value={mediaLinks.agentInterview}
                         onChange={(e) => handleMediaLinkChange('agentInterview', e.target.value)}
                         placeholder="https://youtube.com/... or https://vimeo.com/..."
                         className="w-full"
                       />
                        <p className="text-xs text-gray-500 mt-1">Add a personal agent interview about the property</p>
                      </div>

                      {/* Additional Media */}
                      <div>
                        <Label htmlFor="additionalMedia" className="flex items-center gap-2 mb-2">
                          <Link className="w-4 h-4 text-indigo-500" />
                          Additional Media URL
                        </Label>
                                               <Input 
                         id="additionalMedia" 
                         name="additionalMedia" 
                         value={mediaLinks.additionalMedia}
                         onChange={(e) => handleMediaLinkChange('additionalMedia', e.target.value)}
                         placeholder="https://..."
                         className="w-full"
                       />
                        <p className="text-xs text-gray-500 mt-1">Add any other media content (floor plans, documents, etc.)</p>
                      </div>

                                          {/* Media Preview Section */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Media Preview
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className="text-center p-4 bg-white rounded-lg border cursor-pointer hover:border-blue-300 transition-colors"
                          onClick={() => {
                            if (mediaLinks.virtualTour) {
                              setSelectedMedia({type: 'Virtual Tour', url: mediaLinks.virtualTour});
                              setShowMediaPlayer(true);
                            }
                          }}
                        >
                          <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Virtual Tour</p>
                          <p className="text-xs text-gray-500">3D walkthrough</p>
                          {mediaLinks.virtualTour && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">Ready</Badge>
                            </div>
                          )}
                        </div>
                        <div 
                          className="text-center p-4 bg-white rounded-lg border cursor-pointer hover:border-red-300 transition-colors"
                          onClick={() => {
                            if (mediaLinks.propertyVideo) {
                              setSelectedMedia({type: 'Property Video', url: mediaLinks.propertyVideo});
                              setShowMediaPlayer(true);
                            }
                          }}
                        >
                          <Play className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Property Video</p>
                          <p className="text-xs text-gray-500">Showcase video</p>
                          {mediaLinks.propertyVideo && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">Ready</Badge>
                            </div>
                          )}
                        </div>
                        <div 
                          className="text-center p-4 bg-white rounded-lg border cursor-pointer hover:border-green-300 transition-colors"
                          onClick={() => {
                            if (mediaLinks.droneFootage) {
                              setSelectedMedia({type: 'Drone Footage', url: mediaLinks.droneFootage});
                              setShowMediaPlayer(true);
                            }
                          }}
                        >
                          <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Drone Footage</p>
                          <p className="text-xs text-gray-500">Aerial view</p>
                          {mediaLinks.droneFootage && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">Ready</Badge>
                            </div>
                          )}
                        </div>
                        <div 
                          className="text-center p-4 bg-white rounded-lg border cursor-pointer hover:border-purple-300 transition-colors"
                          onClick={() => {
                            if (mediaLinks.neighborhoodVideo) {
                              setSelectedMedia({type: 'Neighborhood Video', url: mediaLinks.neighborhoodVideo});
                              setShowMediaPlayer(true);
                            }
                          }}
                        >
                          <Building className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Neighborhood</p>
                          <p className="text-xs text-gray-500">Area overview</p>
                          {mediaLinks.neighborhoodVideo && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">Ready</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* App Features & Buttons Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('features')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  App Features & Buttons
                </CardTitle>
                {collapsedSections.features ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.features && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gallery */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.gallery 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('gallery')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.gallery 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Camera className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Gallery</h4>
                        <p className="text-xs text-gray-500 mb-3">Photo showcase</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.gallery ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.gallery ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Schools */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.schoolInfo 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('schoolInfo')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.schoolInfo 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Schools</h4>
                        <p className="text-xs text-gray-500 mb-3">Local education</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.schoolInfo ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.schoolInfo ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Financing */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.financing 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('financing')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.financing 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Financing</h4>
                        <p className="text-xs text-gray-500 mb-3">Mortgage calculator</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.financing ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.financing ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Virtual Tour */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.virtualTour 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('virtualTour')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.virtualTour 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Video className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Virtual Tour</h4>
                        <p className="text-xs text-gray-500 mb-3">3D walkthrough</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.virtualTour ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.virtualTour ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Amenities */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.amenities 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('amenities')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.amenities 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Wifi className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Amenities</h4>
                        <p className="text-xs text-gray-500 mb-3">Property features</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.amenities ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.amenities ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Schedule */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.schedule 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('schedule')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.schedule 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Schedule</h4>
                        <p className="text-xs text-gray-500 mb-3">Book showings</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.schedule ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.schedule ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Map */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.map 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('map')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.map 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <MapPin className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Map</h4>
                        <p className="text-xs text-gray-500 mb-3">Location view</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.map ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.map ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Comparables */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.comparables 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('comparables')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.comparables 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <BarChart3 className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Comparables</h4>
                        <p className="text-xs text-gray-500 mb-3">Market analysis</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.comparables ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.comparables ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* History */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.history 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('history')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.history 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">History</h4>
                        <p className="text-xs text-gray-500 mb-3">Property timeline</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.history ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.history ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Reports */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.reports 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('reports')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.reports 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Reports</h4>
                        <p className="text-xs text-gray-500 mb-3">Property reports</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.reports ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.reports ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Neighborhood */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.neighborhood 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('neighborhood')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.neighborhood 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Building className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Neighborhood</h4>
                        <p className="text-xs text-gray-500 mb-3">Area info</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.neighborhood ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.neighborhood ? 'ON' : 'OFF'}
                        </p>
                      </div>

                      {/* Messaging */}
                      <div 
                        className={`text-center p-4 rounded-lg border cursor-pointer transition-all ${
                          features?.messaging 
                            ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle('messaging')}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          features?.messaging 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Messaging</h4>
                        <p className="text-xs text-gray-500 mb-3">Contact forms</p>
                        <div className={`w-full h-2 rounded-full ${
                          features?.messaging ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-xs mt-2 font-medium">
                          {features?.messaging ? 'ON' : 'OFF'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Agent Info Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('agentInfo')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Agent Information
                </CardTitle>
                {collapsedSections.agentInfo ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.agentInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input 
                          id="agent-name" 
                          value={agentInfo.name} 
                          onChange={(e) => handleAgentInfoChange('name', e.target.value)}
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agent-email">Email</Label>
                        <Input 
                          id="agent-email" 
                          type="email"
                          value={agentInfo.email} 
                          onChange={(e) => handleAgentInfoChange('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agent-phone">Phone</Label>
                        <Input 
                          id="agent-phone" 
                          type="tel"
                          value={agentInfo.phone} 
                          onChange={(e) => handleAgentInfoChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agent-website">Website</Label>
                        <Input 
                          id="agent-website" 
                          value={agentInfo.website} 
                          onChange={(e) => handleAgentInfoChange('website', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="agent-bio">Bio</Label>
                      <Textarea 
                        id="agent-bio" 
                        value={agentInfo.bio} 
                        onChange={(e) => handleAgentInfoChange('bio', e.target.value)}
                        rows={4}
                        placeholder="Tell visitors about your experience and expertise..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Logo</Label>
                        <div className="mt-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleAgentInfoChange('logo', URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Headshot</Label>
                        <div className="mt-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleAgentInfoChange('headshot', URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Social Media Links</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {[
                          { key: 'facebook', label: 'Facebook', icon: Facebook },
                          { key: 'twitter', label: 'Twitter', icon: Twitter },
                          { key: 'instagram', label: 'Instagram', icon: Instagram },
                          { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                          { key: 'youtube', label: 'YouTube', icon: Youtube }
                        ].map((social) => (
                          <div key={social.key}>
                            <Label className="flex items-center gap-2">
                              <social.icon className="w-4 h-4" />
                              {social.label}
                            </Label>
                            <Input 
                              value={agentInfo.socialMedia[social.key as keyof typeof agentInfo.socialMedia] || ''} 
                              onChange={(e) => handleAgentInfoChange('socialMedia', {
                                ...agentInfo.socialMedia,
                                [social.key]: e.target.value
                              })}
                              placeholder={`https://${social.key}.com/username`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Media Links (Videos, Interviews)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label>Video 1</Label>
                          <Input 
                            value={agentInfo.mediaLinks.video1 || ''} 
                            onChange={(e) => handleAgentInfoChange('mediaLinks', {
                              ...agentInfo.mediaLinks,
                              video1: e.target.value
                            })}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                        <div>
                          <Label>Video 2</Label>
                          <Input 
                            value={agentInfo.mediaLinks.video2 || ''} 
                            onChange={(e) => handleAgentInfoChange('mediaLinks', {
                              ...agentInfo.mediaLinks,
                              video2: e.target.value
                            })}
                            placeholder="https://vimeo.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Final CTA Button */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Got Questions?</h3>
            <p className="text-gray-600 mb-4">Let your AI assistant help visitors learn more about this property</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={openChat}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to the Home
              </Button>
              <Button 
                onClick={openVoice}
                variant="outline"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Voice Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Menu */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
          
          <AnimatePresence>
            {showMobileMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col gap-2"
                >
                  <Button
                    onClick={handleScheduleShowing}
                    className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
                    title="Schedule Showing"
                  >
                    <Calendar className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={handlePWAInstall}
                    className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
                    title="Save to Home Screen"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg"
                    title="Share Listing"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowChat(false)}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
                             <ChatBot listing={listing || undefined} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Modal */}
      <AnimatePresence>
        {showVoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowVoice(false)}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <VoiceBot />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Listing</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full" onClick={() => {
                  navigator.share?.({
                    title: listing?.title,
                    text: listing?.description,
                    url: window.location.href
                  });
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share via Native Share
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => {
                  window.open(`mailto:?subject=${listing?.title}&body=Check out this property: ${window.location.href}`);
                }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Share via Email
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Modal */}
      <AnimatePresence>
        {showPWAInstall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowPWAInstall(false)}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Save to Home Screen</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPWAInstall(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <Mobile className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Install as App</h4>
                  <p className="text-gray-600 text-sm">
                    Save this listing to your home screen for quick access. It will work like a native app!
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">How to install:</h5>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Tap the share button in your browser</li>
                    <li>2. Select "Add to Home Screen"</li>
                    <li>3. Tap "Add" to install</li>
                  </ol>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    // Trigger PWA install prompt if available
                    if ('serviceWorker' in navigator) {
                      // This would typically trigger the browser's install prompt
                      alert('Use your browser\'s share menu to add to home screen');
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Player Modal */}
      {showMediaPlayer && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedMedia.type}</h3>
              <button 
                onClick={() => setShowMediaPlayer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {selectedMedia.url.includes('youtube.com') || selectedMedia.url.includes('youtu.be') ? (
                <iframe
                  src={selectedMedia.url.replace('watch?v=', 'embed/')}
                  title={selectedMedia.type}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedMedia.url.includes('vimeo.com') ? (
                <iframe
                  src={selectedMedia.url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  title={selectedMedia.type}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedMedia.url.includes('matterport.com') ? (
                <iframe
                  src={selectedMedia.url}
                  title={selectedMedia.type}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">External Media</p>
                    <a 
                      href={selectedMedia.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {selectedMedia.url}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingEditPage; 