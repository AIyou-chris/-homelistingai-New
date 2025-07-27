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
  Phone
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

interface FeatureSettings {
  // Core Features
  messaging: boolean;
  schoolInfo: boolean;
  mortgageCalculator: boolean;
  directions: boolean;
  virtualTour: boolean;
  contactForms: boolean;
  socialMedia: boolean;
  
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [heroPhotos, setHeroPhotos] = useState<string[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'features' | 'photos' | 'messaging' | 'preview'>('content');
  const [showPreview, setShowPreview] = useState(false);

  // Feature settings with all the switches
  const [features, setFeatures] = useState<FeatureSettings>({
    messaging: true,
    schoolInfo: true,
    mortgageCalculator: true,
    directions: true,
    virtualTour: false,
    contactForms: true,
    socialMedia: true,
    aiPersonality: 'professional',
    responseSpeed: 'fast',
    leadCapture: 'both',
    analytics: true,
    seoSettings: false,
    socialSharing: true,
    autoReply: true,
    messageTemplates: true,
    contactMethods: {
      email: true,
      phone: true,
      inApp: true,
    }
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
        if (data) {
          setFormData({
            title: data.title,
            address: data.address,
            price: data.price,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            square_footage: data.square_footage,
            description: data.description,
            knowledge_base: typeof data.knowledge_base === 'string' ? data.knowledge_base : JSON.stringify(data.knowledge_base || {}, null, 2),
          });
          setPhotos(data.image_urls || []);
          setHeroPhotos(data.image_urls?.slice(0, 5) || []);
          setGalleryPhotos(data.image_urls || []);
        }
      } catch (err) {
        setError('Failed to fetch listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { 
      ...prev, 
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'square_footage' ? parseFloat(value) : value 
    } : null);
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
    if (e.target.files) {
      const newPhotoUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotoUrls]);
      setGalleryPhotos(prev => [...prev, ...newPhotoUrls]);
    }
  };

  const handleRemovePhoto = (urlToRemove: string) => {
    setPhotos(prev => prev.filter(url => url !== urlToRemove));
    setGalleryPhotos(prev => prev.filter(url => url !== urlToRemove));
    setHeroPhotos(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleHeroPhotoToggle = (photoUrl: string) => {
    if (heroPhotos.includes(photoUrl)) {
      setHeroPhotos(prev => prev.filter(url => url !== photoUrl));
    } else if (heroPhotos.length < 5) {
      setHeroPhotos(prev => [...prev, photoUrl]);
    }
  };

  const handleSave = async () => {
    if (!id || !formData || !listing) return;
    setSaving(true);
    try {
      const updatedData: Partial<Listing> = { 
        ...formData,
        image_urls: photos,
        features: features // Save feature settings
      };
      
      try {
        updatedData.knowledge_base = JSON.parse(formData.knowledge_base);
      } catch (e) {
        updatedData.knowledge_base = formData.knowledge_base;
      }

      await updateListing(id, updatedData);
      navigate(`/dashboard/listings`);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 mt-10">
      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
      {error}
    </div>
  );

  if (!listing || !formData) return (
    <div className="text-center mt-10">
      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      Listing not found.
    </div>
  );

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
                {listing.title}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'content', label: 'Content', icon: Palette },
                  { id: 'features', label: 'Features', icon: Settings },
                  { id: 'photos', label: 'Photos', icon: Camera },
                  { id: 'messaging', label: 'Messaging', icon: MessageCircle },
                  { id: 'preview', label: 'Preview', icon: Eye }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'content' && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="title">Property Title</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleInputChange}
                            placeholder="Beautiful 3-Bedroom Home"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange}
                            placeholder="123 Main St, City, State"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input 
                            id="price" 
                            name="price" 
                            type="number" 
                            value={formData.price.toString()} 
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
                            value={formData.bedrooms.toString()} 
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
                            value={formData.bathrooms.toString()} 
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
                            value={formData.square_footage.toString()} 
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
                          value={formData.description} 
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
                          value={formData.knowledge_base} 
                          onChange={handleInputChange} 
                          rows={8}
                          placeholder="Add additional information for your AI assistant to know about this property..."
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          This information helps your AI assistant answer questions about the property.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Core Features */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Core Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'messaging', label: 'Messaging System', icon: MessageCircle, color: 'blue' },
                            { key: 'schoolInfo', label: 'School Information', icon: GraduationCap, color: 'green' },
                            { key: 'mortgageCalculator', label: 'Mortgage Calculator', icon: Calculator, color: 'purple' },
                            { key: 'directions', label: 'Directions & Map', icon: MapPin, color: 'red' },
                            { key: 'virtualTour', label: 'Virtual Tour', icon: Globe, color: 'indigo' },
                            { key: 'contactForms', label: 'Contact Forms', icon: Users, color: 'orange' },
                            { key: 'socialMedia', label: 'Social Media', icon: Share2, color: 'pink' }
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
                      </div>

                      {/* AI Settings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">AI Assistant Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Label>AI Personality</Label>
                            <Select 
                              value={features.aiPersonality} 
                              onValueChange={(value) => setFeatures(prev => ({ ...prev, aiPersonality: value as any }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Response Speed</Label>
                            <Select 
                              value={features.responseSpeed} 
                              onValueChange={(value) => setFeatures(prev => ({ ...prev, responseSpeed: value as any }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">Instant</SelectItem>
                                <SelectItem value="fast">Fast</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'analytics', label: 'Analytics Tracking', icon: BarChart3 },
                            { key: 'seoSettings', label: 'SEO Optimization', icon: Globe },
                            { key: 'socialSharing', label: 'Social Sharing', icon: Share2 },
                            { key: 'autoReply', label: 'Auto-Reply Messages', icon: Zap }
                          ].map((feature) => (
                            <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <feature.icon className="w-4 h-4 text-gray-600" />
                                <span className="font-medium">{feature.label}</span>
                              </div>
                              <Switch
                                checked={features[feature.key as keyof FeatureSettings] as boolean}
                                onCheckedChange={() => handleFeatureToggle(feature.key as keyof FeatureSettings)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'photos' && (
                    <motion.div
                      key="photos"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Hero Photos */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Hero Slider Photos (Max 5)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {photos.map((url, index) => (
                            <div key={url} className="relative group">
                              <img 
                                src={url} 
                                alt={`Photo ${index + 1}`} 
                                className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${
                                  heroPhotos.includes(url) 
                                    ? 'border-blue-500 ring-2 ring-blue-200' 
                                    : 'border-gray-200'
                                }`}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  {heroPhotos.includes(url) ? (
                                    <Check className="w-6 h-6 text-white" />
                                  ) : (
                                    <Eye className="w-6 h-6 text-white" />
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleHeroPhotoToggle(url)}
                                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                              >
                                {heroPhotos.includes(url) ? (
                                  <Check className="w-3 h-3 text-blue-600" />
                                ) : (
                                  <Plus className="w-3 h-3 text-gray-600" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gallery Photos */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Gallery Photos (Max 20)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {photos.map((url, index) => (
                            <div key={url} className="relative group">
                              <img 
                                src={url} 
                                alt={`Photo ${index + 1}`} 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                                <button
                                  onClick={() => handleRemovePhoto(url)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <Label htmlFor="photos" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-700">Upload Photos</span>
                          </Label>
                          <Input 
                            id="photos" 
                            type="file" 
                            multiple 
                            onChange={handlePhotoUpload}
                            className="hidden"
                            accept="image/*"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Drag and drop or click to upload photos
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'messaging' && (
                    <motion.div
                      key="messaging"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Messaging Settings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Messaging Configuration</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Enable Messaging</span>
                            </div>
                            <Switch
                              checked={features.messaging}
                              onCheckedChange={() => handleFeatureToggle('messaging')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Zap className="w-5 h-5 text-green-600" />
                              <span className="font-medium">Auto-Reply Messages</span>
                            </div>
                            <Switch
                              checked={features.autoReply}
                              onCheckedChange={() => handleFeatureToggle('autoReply')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">Message Templates</span>
                            </div>
                            <Switch
                              checked={features.messageTemplates}
                              onCheckedChange={() => handleFeatureToggle('messageTemplates')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Methods */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Methods</h3>
                        <div className="space-y-3">
                          {[
                            { key: 'email', label: 'Email', icon: Mail },
                            { key: 'phone', label: 'Phone', icon: Phone },
                            { key: 'inApp', label: 'In-App Messages', icon: MessageCircle }
                          ].map((method) => (
                            <div key={method.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <method.icon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium">{method.label}</span>
                              </div>
                              <Switch
                                checked={features.contactMethods[method.key as keyof typeof features.contactMethods]}
                                onCheckedChange={() => handleContactMethodToggle(method.key as keyof typeof features.contactMethods)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lead Capture */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Lead Capture</h3>
                        <Select 
                          value={features.leadCapture} 
                          onValueChange={(value) => setFeatures(prev => ({ ...prev, leadCapture: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email Only</SelectItem>
                            <SelectItem value="phone">Phone Only</SelectItem>
                            <SelectItem value="both">Email & Phone</SelectItem>
                            <SelectItem value="none">No Lead Capture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'preview' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">Mobile Preview</h3>
                        <div className="max-w-sm mx-auto">
                          <div className="bg-gray-900 rounded-t-3xl p-2">
                            <div className="bg-white rounded-t-2xl p-4">
                              {/* Hero Image */}
                              <div className="relative h-48 bg-gray-200 rounded-lg mb-4">
                                {heroPhotos[0] && (
                                  <img 
                                    src={heroPhotos[0]} 
                                    alt="Property" 
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                )}
                              </div>
                              
                              {/* Property Info */}
                              <div className="space-y-2">
                                <h4 className="font-bold text-lg">{formData.title}</h4>
                                <p className="text-gray-600 text-sm">{formData.address}</p>
                                <p className="text-2xl font-bold text-blue-600">${formData.price.toLocaleString()}</p>
                                
                                {/* Property Stats */}
                                <div className="flex gap-4 text-sm">
                                  <span>{formData.bedrooms} beds</span>
                                  <span>{formData.bathrooms} baths</span>
                                  <span>{formData.square_footage} sqft</span>
                                </div>
                              </div>
                              
                              {/* Feature Indicators */}
                              <div className="mt-4 flex flex-wrap gap-2">
                                {features.messaging && <Badge variant="secondary">💬 Chat</Badge>}
                                {features.schoolInfo && <Badge variant="secondary">🏫 Schools</Badge>}
                                {features.mortgageCalculator && <Badge variant="secondary">💰 Calculator</Badge>}
                                {features.directions && <Badge variant="secondary">🗺️ Map</Badge>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Photos</span>
                  <span className="font-medium">{photos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hero Photos</span>
                  <span className="font-medium">{heroPhotos.length}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Features</span>
                  <span className="font-medium">
                    {Object.values(features).filter(v => typeof v === 'boolean' && v).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Save Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Auto-save enabled</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Changes are automatically saved as you edit
                </p>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">
                  • Use high-quality photos for better engagement
                </p>
                <p className="text-sm text-gray-600">
                  • Enable messaging to capture more leads
                </p>
                <p className="text-sm text-gray-600">
                  • Customize AI personality for your target audience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingEditPage; 