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
  FileText
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

  useEffect(() => {
    if (id) {
      fetchListing();
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
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Hero Section with "Talk to the Home" Button */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Talk to the Home</h2>
              <p className="text-gray-600 mb-4">Let your AI assistant help visitors learn about this property</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={openChat}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with AI
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
                    
                    <div>
                      <Label htmlFor="knowledge_base">AI Knowledge Base</Label>
                      <Textarea 
                        id="knowledge_base" 
                        name="knowledge_base" 
                        value={formData?.knowledge_base || ''} 
                        onChange={handleInputChange} 
                        rows={8}
                        placeholder="Add additional information for your AI assistant to know about this property..."
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        This information helps your AI assistant answer questions about the property.
                      </p>
                    </div>

                    {/* Hero Photos Section */}
                    <div>
                      <Label>Hero Photos (Select 3 for slider)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                        {photos.map((photo, index) => (
                          <div 
                            key={index}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                              heroPhotos.includes(photo) 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleHeroPhotoToggle(photo)}
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
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Select up to 3 photos for the hero slider. These will be the first images visitors see.
                      </p>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Gallery Section */}
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer bg-gray-50"
              onClick={() => toggleSection('gallery')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Gallery Photos
                </CardTitle>
                {collapsedSections.gallery ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
            <AnimatePresence>
              {!collapsedSections.gallery && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemovePhoto(photo)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="photo-upload">Upload Additional Photos</Label>
                      <Input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Feature Toggle Card */}
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
                      {[
                        { key: 'gallery', label: 'Gallery', icon: Camera, color: 'blue' },
                        { key: 'map', label: 'Map', icon: MapPin, color: 'red' },
                        { key: 'schoolInfo', label: 'Schools', icon: GraduationCap, color: 'green' },
                        { key: 'comparables', label: 'Comparables', icon: BarChart3, color: 'purple' },
                        { key: 'financing', label: 'Financing', icon: Calculator, color: 'orange' },
                        { key: 'history', label: 'History', icon: Clock, color: 'indigo' },
                        { key: 'virtualTour', label: 'Virtual Tour', icon: Video, color: 'pink' },
                        { key: 'reports', label: 'Reports', icon: FileText, color: 'gray' },
                        { key: 'amenities', label: 'Amenities', icon: Wifi, color: 'yellow' },
                        { key: 'neighborhood', label: 'Neighborhood', icon: Building, color: 'teal' },
                        { key: 'schedule', label: 'Schedule', icon: Calendar, color: 'rose' },
                        { key: 'messaging', label: 'Messaging', icon: MessageCircle, color: 'emerald' }
                      ].map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-${feature.color}-100 rounded-lg flex items-center justify-center`}>
                              <feature.icon className={`w-4 h-4 text-${feature.color}-600`} />
                            </div>
                            <span className="font-medium">{feature.label}</span>
                          </div>
                          <Switch
                            checked={features[feature.key as keyof FeatureSettings] as boolean}
                            onCheckedChange={() => handleFeatureToggle(feature.key as keyof FeatureSettings)}
                          />
                        </div>
                      ))}
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
    </div>
  );
};

export default ListingEditPage; 