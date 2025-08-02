import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, 
  X, 
  Upload, 
  Trash2, 
  Settings, 
  MessageCircle, 
  MessageSquare,
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
  Loader2,
  Home
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
import HamburgerMenu from '../components/shared/HamburgerMenu';
import NewLogo from '../components/shared/NewLogo';
import MobilePhonePreview from '../components/shared/MobilePhonePreview';

import MobileListingApp from '../components/shared/MobileListingApp';
import MobileAppDemo from '../components/shared/MobileAppDemo';
import { createListing } from '../services/listingService';

import { getElevenLabsVoices, generateElevenLabsSpeech } from '../services/elevenlabsService';
import { generateAmenitiesData } from '../services/propertyDataService';

// Knowledge Base interfaces
interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text' | 'document';
  size: string;
  uploadedAt: string;
  propertyId?: string;
  propertyName?: string;
  description?: string;
  knowledgeBaseType: 'agent' | 'listing' | 'personality';
}

interface KnowledgeBaseText {
  id: string;
  title: string;
  content: string;
  knowledgeBaseType: 'agent' | 'listing';
  createdAt: string;
}

interface KnowledgeBaseURLScraper {
  id: string;
  url: string;
  title: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  lastScraped?: string;
  status: 'active' | 'paused' | 'error';
  knowledgeBaseType: 'agent' | 'listing';
  createdAt: string;
}

// AI Personality interfaces
interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
}

interface AIPersonality {
  id: string;
  name: string;
  type: 'agent' | 'listing';
  personality: {
    style: 'professional' | 'friendly' | 'luxury' | 'casual' | 'expert' | 'consultant' | 'neighbor' | 'friend';
    tone: 'formal' | 'warm' | 'enthusiastic' | 'calm' | 'energetic' | 'trustworthy' | 'sophisticated' | 'approachable';
    expertise: 'general' | 'luxury' | 'first-time' | 'investment' | 'commercial' | 'new-construction' | 'historic' | 'modern';
    communication: 'detailed' | 'concise' | 'storytelling' | 'data-driven' | 'emotional' | 'factual' | 'persuasive' | 'educational';
  };
  voice: {
    // ElevenLabs Integration
    elevenlabsVoiceId: string;
    elevenlabsVoiceName: string;
    // Legacy voice settings (for fallback)
    gender: 'male' | 'female' | 'neutral';
    accent: 'american' | 'british' | 'australian' | 'canadian' | 'neutral';
    speed: 'slow' | 'normal' | 'fast';
    pitch: 'low' | 'medium' | 'high';
    emotion: 'calm' | 'enthusiastic' | 'professional' | 'friendly' | 'authoritative' | 'warm';
    // Voice settings for ElevenLabs
    stability: number; // 0-1
    similarity_boost: number; // 0-1
    style: number; // 0-1
    use_speaker_boost: boolean;
  };
  knowledge: {
    agentKnowledge: string[];
    listingKnowledge: string[];
    marketKnowledge: string[];
    customPrompts: string[];
  };
  settings: {
    autoRespond: boolean;
    leadQualification: boolean;
    followUpSequences: boolean;
    marketInsights: boolean;
    competitorAnalysis: boolean;
    personalizedRecommendations: boolean;
  };
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
  amenities?: string; // Raw amenities text from agent
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    photoManagement: true,
    agentInfo: true,
    features: true,
    knowledgeBase: true,
    aiPersonality: true,
    voiceSettings: true,
    importData: true,
    mediaLinks: true,
    amenities: true
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [showPWAInstall, setShowPWAInstall] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

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
  const [showAIChat, setShowAIChat] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionTone, setDescriptionTone] = useState<'professional' | 'friendly' | 'luxury' | 'casual' | 'enthusiastic'>('professional');
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // AI Knowledge Base state
  const [activeTab, setActiveTab] = useState<'agent' | 'listing' | 'personality'>('agent');
  const [files, setFiles] = useState<KnowledgeBaseItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [aiPersonalities, setAiPersonalities] = useState<AIPersonality[]>([
    {
      id: '1',
      name: 'Professional Agent',
      type: 'agent',
      personality: {
        style: 'professional',
        tone: 'formal',
        expertise: 'general',
        communication: 'detailed'
      },
      voice: {
        // ElevenLabs Integration
        elevenlabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
        elevenlabsVoiceName: 'Rachel',
        // Legacy voice settings (for fallback)
        gender: 'female',
        accent: 'american',
        speed: 'normal',
        pitch: 'medium',
        emotion: 'professional',
        // Voice settings for ElevenLabs
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      },
      knowledge: {
        agentKnowledge: ['Company_Policies.pdf', 'Sales_Scripts.docx'],
        listingKnowledge: ['Property_Floor_Plan.pdf'],
        marketKnowledge: ['Market_Research.pdf'],
        customPrompts: ['Focus on professional service and expertise']
      },
      settings: {
        autoRespond: true,
        leadQualification: true,
        followUpSequences: true,
        marketInsights: true,
        competitorAnalysis: true,
        personalizedRecommendations: true
      }
    }
  ]);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('1');
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState<AIPersonality | null>(null);
  
  // Voice-related state
  const [elevenlabsVoices, setElevenlabsVoices] = useState<ElevenLabsVoice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(null);
  
  // Knowledge Base Text and URL Scraper state
  const [knowledgeTexts, setKnowledgeTexts] = useState<KnowledgeBaseText[]>([]);
  const [urlScrapers, setUrlScrapers] = useState<KnowledgeBaseURLScraper[]>([]);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [editingText, setEditingText] = useState<KnowledgeBaseText | null>(null);
  const [editingScraper, setEditingScraper] = useState<KnowledgeBaseURLScraper | null>(null);
  
  // Amenities Editor
  const [showAmenitiesEditor, setShowAmenitiesEditor] = useState(false);
  const [rawAmenitiesText, setRawAmenitiesText] = useState('');
  const [processedAmenities, setProcessedAmenities] = useState<any[]>([]);
  const [isProcessingAmenities, setIsProcessingAmenities] = useState(false);

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
    // Trigger VoiceBot to open immediately
    console.log('🎤 Dispatching open-voicebot event');
    const event = new CustomEvent('open-voicebot');
    window.dispatchEvent(event);
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

  // Mobile App Preview Handlers
  const handlePreviewChatOpen = () => {
    alert('Preview: Chat functionality would open here');
  };

  const handlePreviewScheduleShowing = () => {
    alert('Preview: Schedule showing would open here');
  };

  const handlePreviewSaveListing = () => {
    alert('Preview: Save listing instructions would appear here');
  };

  const handlePreviewContactAgent = () => {
    alert('Preview: Contact agent would open here');
  };

  const handlePreviewShareListing = () => {
    alert('Preview: Share listing modal would open here');
  };

  const handlePreviewFeatureClick = (featureId: string) => {
    // Handle virtual tour specifically
    if (featureId === 'virtual-tour' && mediaLinks.virtualTour) {
      window.open(mediaLinks.virtualTour, '_blank');
      return;
    }
    
    const featureMessages = {
      'video-tour': 'Preview: Video tour would play here',
      'amenities': 'Preview: Amenities list would show here',
      'neighborhood': 'Preview: Neighborhood information would display here',
      'schedule': 'Preview: Schedule showing would open here',
      'map': 'Preview: Interactive map would load here',
      'financing': 'Preview: Financing options would display here',
      'history': 'Preview: Property history would show here',
      'virtual-tour': mediaLinks.virtualTour ? 'Opening virtual tour...' : 'Preview: Virtual tour would start here (add URL in Media Links)',
      'reports': 'Preview: Property reports would display here'
    };
    
    alert(featureMessages[featureId as keyof typeof featureMessages] || 'Preview: Feature coming soon');
  };

  // Transform form data to property format for MobileListingApp
  const getPropertyForPreview = () => {
    // Ensure we have valid images
    const validImages = photos.filter(photo => photo && photo.trim() !== '');
    const fallbackImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ];

    return {
      id: listing?.id || 'preview-123',
      title: formData?.title || 'Beautiful Home',
      address: formData?.address || 'Address TBD',
      price: formData?.price || 0,
      bedrooms: formData?.bedrooms || 0,
      bathrooms: formData?.bathrooms || 0,
      squareFootage: formData?.square_footage || 0,
      description: formData?.description || 'Beautiful home with modern amenities.',
      images: validImages.length > 0 ? validImages : fallbackImages,
      agent: {
        name: agentInfo.name || 'HomeListingAI Agent',
        title: 'HomeListingAI Agent',
        photo: agentInfo.headshot || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        phone: agentInfo.phone || '+1 (555) 123-4567',
        email: agentInfo.email || 'agent@homelistingai.com'
      },
      mediaLinks: {
        virtualTour: mediaLinks.virtualTour || undefined,
        propertyVideo: mediaLinks.propertyVideo || undefined,
        droneFootage: mediaLinks.droneFootage || undefined,
        neighborhoodVideo: mediaLinks.neighborhoodVideo || undefined
      }
    };
  };

  // AI Generation Functions
  const generateAIDescription = async (tone: 'professional' | 'friendly' | 'luxury' | 'casual' | 'enthusiastic' = 'professional') => {
    if (!formData) return;
    
    try {
      // AIO-Optimized Keywords and Structured Data
      const aioKeywords = [
        `${formData.bedrooms} bedroom home for sale`,
        `${formData.bathrooms} bathroom property`,
        `${formData.square_footage} square foot house`,
        `${formData.address?.split(',')[0]} real estate`,
        'property details',
        'home features',
        'buying guide'
      ];
      
      // AIO Structured Data for AI Understanding
      const aioStructuredData = {
        propertyType: 'residential',
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        squareFootage: formData.square_footage,
        price: formData.price,
        location: formData.address,
        keyFeatures: [
          'Modern amenities',
          'Updated kitchen',
          'Spacious layout',
          'Desirable neighborhood'
        ]
      };
      
      // Tone-specific templates
      const toneTemplates = {
        professional: {
          intro: `Presenting an exceptional ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom residence`,
          style: 'formal and sophisticated',
          callToAction: 'Contact us today to schedule your private viewing.'
        },
        friendly: {
          intro: `Welcome to this charming ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom home`,
          style: 'warm and inviting',
          callToAction: 'Come see why this could be your perfect home!'
        },
        luxury: {
          intro: `Experience luxury living in this exquisite ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom estate`,
          style: 'premium and elegant',
          callToAction: 'Don\'t miss this rare opportunity for luxury living.'
        },
        casual: {
          intro: `Check out this awesome ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom place`,
          style: 'relaxed and approachable',
          callToAction: 'This could be your new home - come take a look!'
        },
        enthusiastic: {
          intro: `AMAZING opportunity! This stunning ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom gem`,
          style: 'energetic and exciting',
          callToAction: 'This won\'t last long - call now!'
        }
      };
      
      const template = toneTemplates[tone];
      
            // Generate AIO-optimized description with structured content for AI understanding
      const aiDescription = `${template.intro} at ${formData.address}. 

PROPERTY DETAILS:
• ${formData.bedrooms} Bedrooms
• ${formData.bathrooms} Bathrooms  
• ${formData.square_footage} Square Feet
• Price: $${formData.price?.toLocaleString()}

${tone === 'luxury' ? 'Featuring premium finishes and designer touches throughout, ' : ''}The thoughtfully designed floor plan creates an ideal flow for both daily living and entertaining. The kitchen boasts ${tone === 'luxury' ? 'gourmet appliances and custom cabinetry' : 'updated appliances and ample counter space'}, while the spacious bedrooms provide comfortable retreats. The ${formData.bathrooms} well-appointed bathrooms offer ${tone === 'luxury' ? 'spa-like luxury' : 'convenience and style'}.

LOCATION & AMENITIES:
• Desirable neighborhood location
• Easy access to shopping and dining
• Convenient transportation options
• ${aioKeywords.join(', ')}

${template.callToAction}

${tone === 'enthusiastic' ? '🔥 HOT PROPERTY! 🔥 ' : ''}Don't miss this exceptional opportunity!`;
      
      setFormData(prev => ({
        ...prev!,
        description: aiDescription
      }));
      
      // Close modal after generation
      setShowDescriptionModal(false);
      
    } catch (error) {
      console.error('Error generating AI description:', error);
    }
  };

  const generateAIMarketingCopy = async () => {
    if (!formData) return;
    
    try {
      // Generate marketing copy for social media, ads, etc.
      const marketingCopy = `🏠 JUST LISTED! ${formData.bedrooms}BR/${formData.bathrooms}BA home at ${formData.address}
💰 Priced at $${formData.price?.toLocaleString()}
📏 ${formData.square_footage} sq ft of beautiful living space
✨ Don't miss this opportunity! Contact us today!`;
      
      // In production, this would be displayed in a modal or copied to clipboard
      console.log('Marketing Copy Generated:', marketingCopy);
      
    } catch (error) {
      console.error('Error generating marketing copy:', error);
    }
  };

  const generateAIMarketInsights = async () => {
    if (!formData) return;
    
    try {
      // Generate market analysis and insights
      const marketInsights = `Market Analysis for ${formData.address}:
• Price per sq ft: $${Math.round((formData.price || 0) / (formData.square_footage || 1))}
• Comparable properties in area: 3-5 similar homes
• Market trend: Stable with slight appreciation
• Days on market average: 45 days
• Buyer interest: High for this price range`;
      
      // In production, this would be displayed in a modal
      console.log('Market Insights Generated:', marketInsights);
      
    } catch (error) {
      console.error('Error generating market insights:', error);
    }
  };

  // Process raw amenities text into categorized format
  const processAmenities = async () => {
    if (!rawAmenitiesText.trim()) {
      alert('Please enter some amenities text first.');
      return;
    }

    setIsProcessingAmenities(true);
    try {
      // For now, use mock processing - in the future, this could use AI
      const mockProcessed = [
        {
          category: "Interior Features",
          items: rawAmenitiesText.split('\n').filter(item => 
            item.toLowerCase().includes('floor') || 
            item.toLowerCase().includes('counter') || 
            item.toLowerCase().includes('closet') ||
            item.toLowerCase().includes('fireplace')
          ).slice(0, 5),
          description: "Key interior features and finishes."
        },
        {
          category: "Exterior Features", 
          items: rawAmenitiesText.split('\n').filter(item =>
            item.toLowerCase().includes('yard') ||
            item.toLowerCase().includes('patio') ||
            item.toLowerCase().includes('garage') ||
            item.toLowerCase().includes('garden')
          ).slice(0, 5),
          description: "Outdoor features and landscaping."
        },
        {
          category: "Appliances",
          items: rawAmenitiesText.split('\n').filter(item =>
            item.toLowerCase().includes('refrigerator') ||
            item.toLowerCase().includes('dishwasher') ||
            item.toLowerCase().includes('washer') ||
            item.toLowerCase().includes('dryer')
          ).slice(0, 5),
          description: "Included appliances and systems."
        }
      ];

      setProcessedAmenities(mockProcessed);
    } catch (error) {
      console.error('Error processing amenities:', error);
      alert('Error processing amenities. Please try again.');
    } finally {
      setIsProcessingAmenities(false);
    }
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

  const handleAddPhotoFromUrl = () => {
    if (!photoUrlInput.trim()) return;
    
    // Basic URL validation
    try {
      new URL(photoUrlInput);
      setPhotos(prev => [...prev, photoUrlInput]);
      setPhotoUrlInput('');
    } catch (error) {
      alert('Please enter a valid URL');
    }
  };

  const handleMediaLinkChange = (field: keyof typeof mediaLinks, value: string) => {
    setMediaLinks(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Knowledge Base functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploading(true);
    
    files.forEach((file) => {
      const newFile: KnowledgeBaseItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString(),
        knowledgeBaseType: activeTab
      };
      
      setFiles(prev => [...prev, newFile]);
    });
    
    setTimeout(() => setUploading(false), 1000);
  };

  const getFileType = (filename: string): KnowledgeBaseItem['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['txt', 'md'].includes(ext || '')) return 'text';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: KnowledgeBaseItem['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'text':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Voice-related functions
  const fetchElevenLabsVoices = async () => {
    try {
      setLoadingVoices(true);
      const voices = await getElevenLabsVoices();
      setElevenlabsVoices(voices);
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Fallback to popular voices
      setElevenlabsVoices([
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel',
          category: 'Professional',
          description: 'Clear, professional female voice',
          preview_url: ''
        },
        {
          voice_id: 'AZnzlk1XvdvUeBnXmlld',
          name: 'Dom',
          category: 'Professional',
          description: 'Confident male voice',
          preview_url: ''
        },
        {
          voice_id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Bella',
          category: 'Friendly',
          description: 'Warm, approachable female voice',
          preview_url: ''
        },
        {
          voice_id: 'VR6AewLTigWG4xSOukaG',
          name: 'Josh',
          category: 'Casual',
          description: 'Relaxed, friendly male voice',
          preview_url: ''
        },
        {
          voice_id: 'pNInz6obpgDQGcFmaJgB',
          name: 'Adam',
          category: 'Professional',
          description: 'Clear, authoritative male voice',
          preview_url: ''
        },
        {
          voice_id: 'yoZ06aMxZJJ28mfd3POQ',
          name: 'Sam',
          category: 'Casual',
          description: 'Natural, conversational male voice',
          preview_url: ''
        },
        {
          voice_id: 'VR6AewLTigWG4xSOukaG',
          name: 'Serena',
          category: 'Luxury',
          description: 'Sophisticated female voice',
          preview_url: ''
        },
        {
          voice_id: 'pNInz6obpgDQGcFmaJgB',
          name: 'Marcus',
          category: 'Expert',
          description: 'Knowledgeable, trustworthy male voice',
          preview_url: ''
        }
      ]);
    } finally {
      setLoadingVoices(false);
    }
  };

  const previewVoice = async (voice: ElevenLabsVoice) => {
    try {
      const sampleText = "Hello! I'm your AI assistant for this property. I can help you learn about this home, answer questions, and guide you through the buying process. What would you like to know?";
      const audioUrl = await generateElevenLabsSpeech(sampleText, voice.voice_id);
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error previewing voice:', error);
    }
  };

  // Load voices when personality tab is active
  useEffect(() => {
    if (activeTab === 'personality' && elevenlabsVoices.length === 0) {
      fetchElevenLabsVoices();
    }
  }, [activeTab, elevenlabsVoices.length]);

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
              <h1 className="text-xl font-semibold text-gray-900">Build AI Listing</h1>
              <Badge variant="secondary" className="ml-2">
                {listing?.title}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {/* Hamburger menu handles all actions now */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          
          {/* Build AI Listing Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Build AI Listing</h1>
              <p className="text-gray-600">Create your AI-powered property listing</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowMobilePreview(true)}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview App
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* AI Encouragement Banner */}
          <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Let AI guide you through every step of creating your listing. From writing compelling descriptions to optimizing your content, AI is here to make your property shine.
                  </p>
                </div>
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
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="description">Description</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDescriptionModal(true)}
                            className="text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Generate Description
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={formData?.description || ''} 
                        onChange={handleInputChange} 
                        rows={6}
                        placeholder="Describe the property's features, amenities, and unique selling points..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Use AI to generate professional descriptions that highlight key features and attract buyers</p>
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

                    {/* URL Import Section */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Import from URL
                      </h5>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://zillow.com/photo1.jpg or https://realtor.com/image.jpg"
                          value={photoUrlInput}
                          onChange={(e) => setPhotoUrlInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleAddPhotoFromUrl}
                          disabled={!photoUrlInput.trim()}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Paste photo URLs from Zillow, Realtor.com, or other listing sites
                      </p>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h6 className="font-medium text-yellow-900 mb-2 flex items-center gap-1">
                          💡 How to copy image URLs:
                        </h6>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• <strong>Right-click</strong> on any image and select "Copy image address"</li>
                          <li>• Or <strong>right-click</strong> → "Inspect" → find the image URL in the code</li>
                          <li>• Works on Zillow, Realtor.com, MLS sites, and most listing platforms</li>
                        </ul>
                      </div>
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

          {/* Amenities Editor Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('amenities')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Amenities Editor
                </CardTitle>
                {collapsedSections.amenities ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.amenities && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">How to Use Amenities Editor</h4>
                        <p className="text-sm text-blue-800 mb-3">
                          Paste raw amenities text from any website (Zillow, Realtor.com, etc.) and we'll automatically 
                          organize it into beautiful, categorized sections for your mobile app.
                        </p>
                        <div className="text-xs text-blue-700 space-y-1">
                          <p>• Copy amenities from any listing website</p>
                          <p>• Paste the raw text below</p>
                          <p>• Click "Process Amenities" to organize them</p>
                          <p>• Preview how they'll look in your app</p>
                        </div>
                      </div>

                      {/* Raw Amenities Input */}
                      <div>
                        <Label htmlFor="rawAmenities" className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-green-500" />
                          Paste Raw Amenities Text
                        </Label>
                        <Textarea
                          id="rawAmenities"
                          value={rawAmenitiesText}
                          onChange={(e) => setRawAmenitiesText(e.target.value)}
                          placeholder="Paste amenities text here from Zillow, Realtor.com, or any other listing site..."
                          className="w-full h-32"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Example: "Hardwood floors, Granite countertops, Stainless steel appliances, Fenced backyard..."
                        </p>
                      </div>

                      {/* Process Button */}
                      <div className="flex gap-3">
                        <Button
                          onClick={processAmenities}
                          disabled={!rawAmenitiesText.trim() || isProcessingAmenities}
                          className="flex-1"
                        >
                          {isProcessingAmenities ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Process Amenities
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAmenitiesEditor(true)}
                          disabled={processedAmenities.length === 0}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>

                      {/* Processed Amenities Preview */}
                      {processedAmenities.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-3">Processed Amenities Preview</h5>
                          <div className="space-y-3">
                            {processedAmenities.map((category, index) => (
                              <div key={index} className="bg-white rounded-lg p-3 border">
                                <h6 className="font-medium text-gray-900 mb-2">{category.category}</h6>
                                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {category.items.map((item: string, itemIndex: number) => (
                                    <Badge key={itemIndex} variant="secondary" className="text-xs">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

          {/* AI Knowledge Base Card */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('aiKnowledge')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Knowledge Base & Personality
                </CardTitle>
                {collapsedSections.aiKnowledge ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.aiKnowledge && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">🧠 AI Knowledge Base & Personalities</h3>
                      <p className="text-gray-600 mb-4">
                        Upload files and configure your AI assistant's personality, voice, and knowledge
                      </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-8 border-b border-gray-200 mb-6">
                      {[
                        { id: 'agent', name: 'Agent Knowledge Base', icon: User },
                        { id: 'listing', name: 'Listing Knowledge Base', icon: Building },
                        { id: 'personality', name: 'AI Personalities', icon: Sparkles }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'agent' | 'listing' | 'personality')}
                          className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.name}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'agent' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">📚 Agent Knowledge Base</h4>
                          <p className="text-sm text-blue-700">
                            Upload documents, scripts, and materials that will help your AI understand your expertise and approach.
                          </p>
                        </div>

                        {/* File Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Agent Files</h3>
                          <p className="text-gray-600 mb-4">
                            Drag and drop files here, or click to browse
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                          >
                            Choose Files
                          </Button>
                        </div>

                        {/* File List */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
                          {files.filter(file => file.knowledgeBaseType === 'agent').map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {getFileIcon(file.type)}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Text Input Section */}
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">📝 Add Text Knowledge</h4>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingText({
                                  id: Date.now().toString(),
                                  title: '',
                                  content: '',
                                  knowledgeBaseType: 'agent',
                                  createdAt: new Date().toISOString()
                                });
                                setShowTextModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Text
                            </Button>
                          </div>
                          
                          {/* Text List */}
                          <div className="space-y-3">
                            {knowledgeTexts.filter(text => text.knowledgeBaseType === 'agent').map((text) => (
                              <div key={text.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-4 h-4 text-green-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{text.title}</p>
                                    <p className="text-xs text-gray-500">{text.content.substring(0, 50)}...</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingText(text);
                                      setShowTextModal(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setKnowledgeTexts(prev => prev.filter(t => t.id !== text.id))}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* URL Scraper Section */}
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">🌐 URL Scraper</h4>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingScraper({
                                  id: Date.now().toString(),
                                  url: '',
                                  title: '',
                                  frequency: 'once',
                                  status: 'active',
                                  knowledgeBaseType: 'agent',
                                  createdAt: new Date().toISOString()
                                });
                                setShowScraperModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Scraper
                            </Button>
                          </div>
                          
                          {/* Scraper List */}
                          <div className="space-y-3">
                            {urlScrapers.filter(scraper => scraper.knowledgeBaseType === 'agent').map((scraper) => (
                              <div key={scraper.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-3">
                                  <Globe className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{scraper.title}</p>
                                    <p className="text-xs text-gray-500">{scraper.url}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant={scraper.status === 'active' ? 'default' : 'secondary'}>
                                        {scraper.status}
                                      </Badge>
                                      <Badge variant="outline">{scraper.frequency}</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingScraper(scraper);
                                      setShowScraperModal(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setUrlScrapers(prev => prev.filter(s => s.id !== scraper.id))}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'listing' && (
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-900 mb-2">🏠 Listing Knowledge Base</h4>
                          <p className="text-sm text-green-700">
                            Upload property-specific documents, floor plans, and materials for this listing.
                          </p>
                        </div>

                        {/* File Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Listing Files</h3>
                          <p className="text-gray-600 mb-4">
                            Drag and drop files here, or click to browse
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                          >
                            Choose Files
                          </Button>
                        </div>

                        {/* File List */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
                          {files.filter(file => file.knowledgeBaseType === 'listing').map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {getFileIcon(file.type)}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Text Input Section */}
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">📝 Add Text Knowledge</h4>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingText({
                                  id: Date.now().toString(),
                                  title: '',
                                  content: '',
                                  knowledgeBaseType: 'listing',
                                  createdAt: new Date().toISOString()
                                });
                                setShowTextModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Text
                            </Button>
                          </div>
                          
                          {/* Text List */}
                          <div className="space-y-3">
                            {knowledgeTexts.filter(text => text.knowledgeBaseType === 'listing').map((text) => (
                              <div key={text.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-4 h-4 text-green-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{text.title}</p>
                                    <p className="text-xs text-gray-500">{text.content.substring(0, 50)}...</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingText(text);
                                      setShowTextModal(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setKnowledgeTexts(prev => prev.filter(t => t.id !== text.id))}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* URL Scraper Section */}
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">🌐 URL Scraper</h4>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingScraper({
                                  id: Date.now().toString(),
                                  url: '',
                                  title: '',
                                  frequency: 'once',
                                  status: 'active',
                                  knowledgeBaseType: 'listing',
                                  createdAt: new Date().toISOString()
                                });
                                setShowScraperModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Scraper
                            </Button>
                          </div>
                          
                          {/* Scraper List */}
                          <div className="space-y-3">
                            {urlScrapers.filter(scraper => scraper.knowledgeBaseType === 'listing').map((scraper) => (
                              <div key={scraper.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-3">
                                  <Globe className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{scraper.title}</p>
                                    <p className="text-xs text-gray-500">{scraper.url}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant={scraper.status === 'active' ? 'default' : 'secondary'}>
                                        {scraper.status}
                                      </Badge>
                                      <Badge variant="outline">{scraper.frequency}</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingScraper(scraper);
                                      setShowScraperModal(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setUrlScrapers(prev => prev.filter(s => s.id !== scraper.id))}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'personality' && (
                      <div className="space-y-6">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-purple-900 mb-2">🤖 AI Personality Setup</h4>
                          <p className="text-sm text-purple-700">
                            Configure your AI assistant's personality, voice, and behavior for this listing.
                          </p>
                        </div>

                        {/* Personality Selection */}
                        <div className="mb-6">
                          <Label className="block text-sm font-medium text-gray-700 mb-2">
                            Active AI Personality:
                          </Label>
                          <Select
                            value={selectedPersonality}
                            onValueChange={setSelectedPersonality}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select AI personality" />
                            </SelectTrigger>
                            <SelectContent>
                              {aiPersonalities.map(personality => (
                                <SelectItem key={personality.id} value={personality.id}>
                                  {personality.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Selected Personality Details */}
                        {selectedPersonality && (
                          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            {(() => {
                              const personality = aiPersonalities.find(p => p.id === selectedPersonality);
                              if (!personality) return null;
                              
                              return (
                                <div className="space-y-6">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-gray-900">{personality.name}</h4>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingPersonality(personality);
                                          setShowPersonalityModal(true);
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setAiPersonalities(prev => prev.filter(p => p.id !== personality.id));
                                          setSelectedPersonality(aiPersonalities[0]?.id || '');
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Personality Traits */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Personality Traits</h5>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Style:</span>
                                          <span className="text-sm text-gray-900 capitalize">{personality.personality.style}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Tone:</span>
                                          <span className="text-sm text-gray-900 capitalize">{personality.personality.tone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Expertise:</span>
                                          <span className="text-sm text-gray-900 capitalize">{personality.personality.expertise.replace('-', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Communication:</span>
                                          <span className="text-sm text-gray-900 capitalize">{personality.personality.communication.replace('-', ' ')}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Voice Settings</h5>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Voice Name:</span>
                                          <span className="text-sm text-gray-900">{personality.voice.elevenlabsVoiceName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Voice ID:</span>
                                          <span className="text-sm text-gray-900 font-mono text-xs">{personality.voice.elevenlabsVoiceId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Stability:</span>
                                          <span className="text-sm text-gray-900">{personality.voice.stability}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Similarity Boost:</span>
                                          <span className="text-sm text-gray-900">{personality.voice.similarity_boost}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Style:</span>
                                          <span className="text-sm text-gray-900">{personality.voice.style}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600">Speaker Boost:</span>
                                          <span className="text-sm text-gray-900">{personality.voice.use_speaker_boost ? 'Yes' : 'No'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Knowledge Sources */}
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Knowledge Sources</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <h6 className="text-xs font-medium text-gray-600 mb-2">Agent Knowledge</h6>
                                        <div className="space-y-1">
                                          {personality.knowledge.agentKnowledge.map((item, index) => (
                                            <div key={index} className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                              {item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <h6 className="text-xs font-medium text-gray-600 mb-2">Listing Knowledge</h6>
                                        <div className="space-y-1">
                                          {personality.knowledge.listingKnowledge.map((item, index) => (
                                            <div key={index} className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                              {item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <h6 className="text-xs font-medium text-gray-600 mb-2">Market Knowledge</h6>
                                        <div className="space-y-1">
                                          {personality.knowledge.marketKnowledge.map((item, index) => (
                                            <div key={index} className="text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                              {item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* AI Settings */}
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">AI Settings</h4>
                                    
                                    {/* Knowledge Priority Dropdown */}
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                      <Label className="block text-sm font-medium text-blue-900 mb-2">
                                        🎯 Knowledge Priority - Which knowledge base should the AI listen to most?
                                      </Label>
                                      <select className="w-full px-3 py-2 border border-blue-300 bg-white text-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="agent">Agent Knowledge Base (Company policies, scripts, expertise)</option>
                                        <option value="listing">Listing Knowledge Base (Property details, floor plans, features)</option>
                                        <option value="market">Market Knowledge Base (Market data, comps, trends)</option>
                                        <option value="balanced">Balanced (Equal weight to all knowledge bases)</option>
                                        <option value="dynamic">Dynamic (Adapts based on conversation context)</option>
                                      </select>
                                      <p className="text-xs text-blue-700 mt-2">
                                        This determines which knowledge base the AI prioritizes when responding to questions.
                                      </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">Auto Respond</h6>
                                            <p className="text-xs text-gray-600">Automatically respond to common questions and inquiries</p>
                                          </div>
                                        </div>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">Lead Qualification</h6>
                                            <p className="text-xs text-gray-600">Automatically qualify leads based on criteria and responses</p>
                                          </div>
                                        </div>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">Follow Up Sequences</h6>
                                            <p className="text-xs text-gray-600">Send automated follow-up messages to nurture leads</p>
                                          </div>
                                        </div>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">Market Insights</h6>
                                            <p className="text-xs text-gray-600">Provide real-time market data and property insights</p>
                                          </div>
                                        </div>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">Competitor Analysis</h6>
                                            <p className="text-xs text-gray-600">Analyze and compare with similar properties in the area</p>
                                          </div>
                                        </div>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">Personalized Recommendations</h6>
                                            <p className="text-xs text-gray-600">Suggest properties and services based on user preferences</p>
                                          </div>
                                        </div>
                                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex justify-end space-x-3 pt-6 border-t">
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowPersonalityModal(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        if (editingPersonality) {
                                          // Update the personality in the list
                                          setAiPersonalities(prev => prev.map(p => 
                                            p.id === editingPersonality.id ? editingPersonality : p
                                          ));
                                        }
                                        setShowPersonalityModal(false);
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Voice Selection System */}
                        <div className="mt-8">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">🎤 Voice Selection</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Choose from our collection of professional voices for your AI assistant
                          </p>
                          
                          {loadingVoices ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                              <p className="text-sm text-gray-600">Loading voices...</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {elevenlabsVoices.map((voice) => (
                                <div
                                  key={voice.voice_id}
                                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedVoice?.voice_id === voice.voice_id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedVoice(voice)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-900">{voice.name}</h5>
                                    {selectedVoice?.voice_id === voice.voice_id && (
                                      <div className="text-blue-600">
                                        <Check className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">{voice.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{voice.category}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        previewVoice(voice);
                                      }}
                                      className="text-xs"
                                    >
                                      🔊 Preview
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {selectedVoice && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-blue-900">Selected Voice: {selectedVoice.name}</h5>
                                  <p className="text-sm text-blue-700">{selectedVoice.description}</p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => previewVoice(selectedVoice)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  🔊 Preview Voice
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Create New Personality Button */}
                        <div className="text-center">
                          <Button
                            onClick={() => {
                              const newPersonality: AIPersonality = {
                                id: Date.now().toString(),
                                name: 'New Personality',
                                type: 'agent',
                                personality: {
                                  style: 'professional',
                                  tone: 'formal',
                                  expertise: 'general',
                                  communication: 'detailed'
                                },
                                voice: {
                                  // ElevenLabs Integration
                                  elevenlabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
                                  elevenlabsVoiceName: 'Rachel',
                                  // Legacy voice settings (for fallback)
                                  gender: 'female',
                                  accent: 'american',
                                  speed: 'normal',
                                  pitch: 'medium',
                                  emotion: 'professional',
                                  // Voice settings for ElevenLabs
                                  stability: 0.5,
                                  similarity_boost: 0.75,
                                  style: 0.0,
                                  use_speaker_boost: true
                                },
                                knowledge: {
                                  agentKnowledge: [],
                                  listingKnowledge: [],
                                  marketKnowledge: [],
                                  customPrompts: []
                                },
                                settings: {
                                  autoRespond: true,
                                  leadQualification: true,
                                  followUpSequences: false,
                                  marketInsights: true,
                                  competitorAnalysis: false,
                                  personalizedRecommendations: true
                                }
                              };
                              setAiPersonalities(prev => [...prev, newPersonality]);
                              setSelectedPersonality(newPersonality.id);
                              setEditingPersonality(newPersonality);
                              setShowPersonalityModal(true);
                            }}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New AI Personality
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>


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

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Hamburger Menu */}
      <HamburgerMenu
        onSave={handleSave}
        onShare={handleShare}
      />

      {/* VoiceBot */}
      <VoiceBot />



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

      {/* Personality Edit Modal */}
      {showPersonalityModal && editingPersonality && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit AI Personality</h3>
              <button 
                onClick={() => setShowPersonalityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personality-name">Name</Label>
                    <Input
                      id="personality-name"
                      value={editingPersonality.name}
                      onChange={(e) => setEditingPersonality(prev => prev ? {
                        ...prev,
                        name: e.target.value
                      } : null)}
                      placeholder="Enter personality name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personality-type">Type</Label>
                    <Select
                      value={editingPersonality.type}
                      onValueChange={(value: 'agent' | 'listing') => setEditingPersonality(prev => prev ? {
                        ...prev,
                        type: value
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="listing">Listing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Personality Traits */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Personality Traits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personality-style">Style</Label>
                    <Select
                      value={editingPersonality.personality.style}
                      onValueChange={(value: any) => setEditingPersonality(prev => prev ? {
                        ...prev,
                        personality: {
                          ...prev.personality,
                          style: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                        <SelectItem value="neighbor">Neighbor</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="personality-tone">Tone</Label>
                    <Select
                      value={editingPersonality.personality.tone}
                      onValueChange={(value: any) => setEditingPersonality(prev => prev ? {
                        ...prev,
                        personality: {
                          ...prev.personality,
                          tone: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="calm">Calm</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="trustworthy">Trustworthy</SelectItem>
                        <SelectItem value="sophisticated">Sophisticated</SelectItem>
                        <SelectItem value="approachable">Approachable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="personality-expertise">Expertise</Label>
                    <Select
                      value={editingPersonality.personality.expertise}
                      onValueChange={(value: any) => setEditingPersonality(prev => prev ? {
                        ...prev,
                        personality: {
                          ...prev.personality,
                          expertise: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="first-time">First Time</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="new-construction">New Construction</SelectItem>
                        <SelectItem value="historic">Historic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="personality-communication">Communication</Label>
                    <Select
                      value={editingPersonality.personality.communication}
                      onValueChange={(value: any) => setEditingPersonality(prev => prev ? {
                        ...prev,
                        personality: {
                          ...prev.personality,
                          communication: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="storytelling">Storytelling</SelectItem>
                        <SelectItem value="data-driven">Data Driven</SelectItem>
                        <SelectItem value="emotional">Emotional</SelectItem>
                        <SelectItem value="factual">Factual</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>



                                {/* AI Settings */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">AI Settings</h4>
                    
                    {/* Knowledge Priority Dropdown */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Label className="block text-sm font-medium text-blue-900 mb-2">
                        🎯 Knowledge Priority - Which knowledge base should the AI listen to most?
                      </Label>
                      <select className="w-full px-3 py-2 border border-blue-300 bg-white text-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="agent">Agent Knowledge Base (Company policies, scripts, expertise)</option>
                        <option value="listing">Listing Knowledge Base (Property details, floor plans, features)</option>
                        <option value="market">Market Knowledge Base (Market data, comps, trends)</option>
                        <option value="balanced">Balanced (Equal weight to all knowledge bases)</option>
                        <option value="dynamic">Dynamic (Adapts based on conversation context)</option>
                      </select>
                      <p className="text-xs text-blue-700 mt-2">
                        This determines which knowledge base the AI prioritizes when responding to questions.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Auto Respond</h6>
                            <p className="text-xs text-gray-600">Automatically respond to common questions and inquiries</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Lead Qualification</h6>
                            <p className="text-xs text-gray-600">Automatically qualify leads based on criteria and responses</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Follow Up Sequences</h6>
                            <p className="text-xs text-gray-600">Send automated follow-up messages to nurture leads</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Market Insights</h6>
                            <p className="text-xs text-gray-600">Provide real-time market data and property insights</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Competitor Analysis</h6>
                            <p className="text-xs text-gray-600">Analyze and compare with similar properties in the area</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Personalized Recommendations</h6>
                            <p className="text-xs text-gray-600">Suggest properties and services based on user preferences</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPersonalityModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Update the personality in the list
                    setAiPersonalities(prev => prev.map(p => 
                      p.id === editingPersonality.id ? editingPersonality : p
                    ));
                    setShowPersonalityModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Edit Modal */}
      {showTextModal && editingText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Text Knowledge</h3>
              <button 
                onClick={() => setShowTextModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="text-title">Title</Label>
                <Input
                  id="text-title"
                  value={editingText.title}
                  onChange={(e) => setEditingText(prev => prev ? {
                    ...prev,
                    title: e.target.value
                  } : null)}
                  placeholder="Enter title for this knowledge"
                />
              </div>
              
              <div>
                <Label htmlFor="text-content">Content</Label>
                <Textarea
                  id="text-content"
                  value={editingText.content}
                  onChange={(e) => setEditingText(prev => prev ? {
                    ...prev,
                    content: e.target.value
                  } : null)}
                  rows={10}
                  placeholder="Enter the knowledge content here..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowTextModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingText.id) {
                      // Update existing text
                      setKnowledgeTexts(prev => prev.map(t => 
                        t.id === editingText.id ? editingText : t
                      ));
                    } else {
                      // Add new text
                      setKnowledgeTexts(prev => [...prev, editingText]);
                    }
                    setShowTextModal(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Text
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* URL Scraper Modal */}
      {showScraperModal && editingScraper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit URL Scraper</h3>
              <button 
                onClick={() => setShowScraperModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="scraper-title">Title</Label>
                <Input
                  id="scraper-title"
                  value={editingScraper.title}
                  onChange={(e) => setEditingScraper(prev => prev ? {
                    ...prev,
                    title: e.target.value
                  } : null)}
                  placeholder="Enter a name for this scraper"
                />
              </div>
              
              <div>
                <Label htmlFor="scraper-url">URL</Label>
                <Input
                  id="scraper-url"
                  value={editingScraper.url}
                  onChange={(e) => setEditingScraper(prev => prev ? {
                    ...prev,
                    url: e.target.value
                  } : null)}
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="scraper-frequency">Scraping Frequency</Label>
                <Select
                  value={editingScraper.frequency}
                  onValueChange={(value: 'once' | 'daily' | 'weekly' | 'monthly') => setEditingScraper(prev => prev ? {
                    ...prev,
                    frequency: value
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="scraper-status">Status</Label>
                <Select
                  value={editingScraper.status}
                  onValueChange={(value: 'active' | 'paused' | 'error') => setEditingScraper(prev => prev ? {
                    ...prev,
                    status: value
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowScraperModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingScraper.id) {
                      // Update existing scraper
                      setUrlScrapers(prev => prev.map(s => 
                        s.id === editingScraper.id ? editingScraper : s
                      ));
                    } else {
                      // Add new scraper
                      setUrlScrapers(prev => [...prev, editingScraper]);
                    }
                    setShowScraperModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Scraper
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">🤖 AI Assistant</h3>
              <button 
                onClick={() => setShowAIChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How can I help you with your listing?</h4>
                <p className="text-sm text-blue-700">
                  I can help you optimize your listing, suggest improvements, answer questions about features, and guide you through the setup process.
                </p>
              </div>
              
              <ChatBot 
                listing={listing || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Description Generator Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">✨ AI Description Generator</h3>
              <button 
                onClick={() => setShowDescriptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">🎯 AIO-Optimized Description</h4>
                <p className="text-sm text-blue-700">
                  Generate descriptions optimized for AI systems, search engines, and zero-click searches. Includes structured data for better AI understanding.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description-tone" className="text-sm font-medium text-gray-700">
                    Choose Your Tone
                  </Label>
                  <Select value={descriptionTone} onValueChange={(value: any) => setDescriptionTone(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="professional" className="hover:bg-gray-50">🏢 Professional - Formal & Sophisticated</SelectItem>
                      <SelectItem value="friendly" className="hover:bg-gray-50">😊 Friendly - Warm & Inviting</SelectItem>
                      <SelectItem value="luxury" className="hover:bg-gray-50">💎 Luxury - Premium & Elegant</SelectItem>
                      <SelectItem value="casual" className="hover:bg-gray-50">😎 Casual - Relaxed & Approachable</SelectItem>
                      <SelectItem value="enthusiastic" className="hover:bg-gray-50">🔥 Enthusiastic - Energetic & Exciting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">✅ AIO Features:</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Structured data for AI understanding</li>
                    <li>• Zero-click search optimization</li>
                    <li>• AI-friendly content structure</li>
                    <li>• Topic authority building</li>
                    <li>• Clear, concise answers for AI systems</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => generateAIDescription(descriptionTone)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Description
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDescriptionModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile App Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-[50px]">
          <div className="w-full max-w-6xl">
            <MobileAppDemo
              listing={{
                id: 'preview-listing',
                title: formData.title || 'Beautiful 3-Bedroom Home in Prime Location',
                address: formData.address || '123 Oak Street, Springfield, IL 62701',
                price: formData.price || 475000,
                bedrooms: formData.bedrooms || 3,
                bathrooms: formData.bathrooms || 2.5,
                square_footage: formData.square_footage || 1850,
                property_type: 'Single Family',
                description: formData.description || 'Stunning 3-bedroom, 2.5-bathroom home featuring modern updates, hardwood floors, granite countertops, and a spacious backyard. Located in a highly sought-after neighborhood with excellent schools and amenities.',
                image_urls: photos.length > 0 ? photos : ['/home1.jpg', '/home2.jpg', '/home3.jpg', '/home4.jpg', '/home5.jpg'],
                agent_id: 'agent-1',
                status: 'active',
                created_at: '2024-01-15T10:00:00Z',
                mobile_config: {
                  activeButtons: {
                    gallery: true,
                    schools: true,
                    video: true,
                    amenities: true,
                    neighborhood: true,
                    schedule: true,
                    map: true,
                    financing: true,
                    history: true,
                    virtual: true,
                    reports: true
                  },
                  lastUpdated: new Date().toISOString()
                }
              }}
              isPreview={true}
              onClose={() => setShowMobilePreview(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildAIListingPage; 