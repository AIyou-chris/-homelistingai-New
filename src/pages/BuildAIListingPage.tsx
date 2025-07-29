import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { 
  Search, 
  Download, 
  Globe, 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Save,
  Eye,
  Settings,
  Zap,
  MessageSquare,
  Phone,
  Mail,
  User,
  Building,
  Car,
  TreePine,
  Star,
  Heart,
  Share2,
  Crown
} from 'lucide-react';

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
  const [urlInput, setUrlInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media' | 'agent' | 'advanced'>('basic');
  const [showTrialSignup, setShowTrialSignup] = useState(false);
  const [trialSignupData, setTrialSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Start scraping process
  const startScraping = async (url: string) => {
    setIsLoading(true);
    setScrapingProgress({
      stage: 'initializing',
      message: 'Initializing scraping engine...',
      progress: 0
    });

    try {
      // Simulate scraping stages
      await simulateScrapingStages(url);
    } catch (error) {
      console.error('Scraping failed:', error);
      setScrapingProgress({
        stage: 'error',
        message: 'Failed to scrape listing. Please try again.',
        progress: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate scraping stages with real-time updates
  const simulateScrapingStages = async (url: string) => {
    // Stage 1: Searching
    setScrapingProgress({
      stage: 'searching',
      message: 'Searching for listing data...',
      progress: 20
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stage 2: Scraping
    setScrapingProgress({
      stage: 'scraping',
      message: 'Extracting property information...',
      progress: 50
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Stage 3: Processing
    setScrapingProgress({
      stage: 'processing',
      message: 'Processing and enriching data...',
      progress: 80
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stage 4: Complete
    const scrapedData = await getMockScrapedData(url);
    setScrapingProgress({
      stage: 'complete',
      message: 'Scraping complete! Data ready for editing.',
      progress: 100,
      data: scrapedData
    });

    // Update listing data with scraped information
    setListingData(prev => ({
      ...prev,
      ...scrapedData
    }));
  };

  // Get mock scraped data (in production, this would be real API calls)
  const getMockScrapedData = async (url: string): Promise<Partial<ListingData>> => {
    // Simulate different scenarios based on URL
    const scenarios = {
      'zillow': {
        title: 'Beautiful Modern Home in Prime Location',
        address: '123 Oak Street, Springfield, IL 62701',
        price: '$450,000',
        bedrooms: 3,
        bathrooms: 2.5,
        squareFootage: 1850,
        description: 'Stunning modern home with open floor plan, updated kitchen, and beautiful backyard. Perfect for families looking for comfort and style.',
        imageUrls: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
        ],
        agentInfo: {
          name: 'Sarah Martinez',
          phone: '(555) 123-4567',
          email: 'sarah.martinez@realestate.com',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200'
        },
        features: ['Open Floor Plan', 'Updated Kitchen', 'Hardwood Floors', 'Fireplace'],
        amenities: ['Central AC', 'Garage', 'Backyard', 'Deck'],
        propertyType: 'Single Family',
        yearBuilt: 2006,
        lotSize: '0.25 acres',
        parking: '2-car garage',
        heating: 'Forced Air',
        cooling: 'Central Air'
      },
      'realtor': {
        title: 'Charming Family Home with Great Curb Appeal',
        address: '456 Elm Avenue, Springfield, IL 62701',
        price: '$425,000',
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 2200,
        description: 'Charming family home with great curb appeal, spacious rooms, and a wonderful neighborhood. Features include a finished basement and large yard.',
        imageUrls: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
        ],
        agentInfo: {
          name: 'Mike Thompson',
          phone: '(555) 987-6543',
          email: 'mike.thompson@realestate.com',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
        },
        features: ['Finished Basement', 'Large Yard', 'Updated Bathrooms', 'New Roof'],
        amenities: ['Central AC', 'Garage', 'Patio', 'Storage'],
        propertyType: 'Single Family',
        yearBuilt: 2004,
        lotSize: '0.3 acres',
        parking: '2-car garage',
        heating: 'Gas',
        cooling: 'Central Air'
      },
      'mls': {
        title: 'Luxury Townhome with Premium Finishes',
        address: '789 Pine Drive, Springfield, IL 62701',
        price: '$375,000',
        bedrooms: 2,
        bathrooms: 2.5,
        squareFootage: 1600,
        description: 'Luxury townhome with premium finishes throughout. Features include granite countertops, stainless steel appliances, and a private balcony.',
        imageUrls: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
        ],
        agentInfo: {
          name: 'Jennifer Chen',
          phone: '(555) 456-7890',
          email: 'jennifer.chen@realestate.com',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
        },
        features: ['Granite Countertops', 'Stainless Appliances', 'Private Balcony', 'Walk-in Closet'],
        amenities: ['Central AC', 'Assigned Parking', 'Pool', 'Gym'],
        propertyType: 'Townhouse',
        yearBuilt: 2010,
        lotSize: 'N/A',
        parking: 'Assigned',
        heating: 'Electric',
        cooling: 'Central Air'
      }
    };

    // Determine scenario based on URL
    let scenario = 'zillow';
    if (url.includes('realtor')) scenario = 'realtor';
    if (url.includes('mls')) scenario = 'mls';

    return scenarios[scenario as keyof typeof scenarios];
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof ListingData, value: any) => {
    setListingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested field changes
  const handleNestedFieldChange = (parent: string, field: string, value: any) => {
    setListingData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ListingData] as any),
        [field]: value
      }
    }));
  };

  // Save listing to dashboard with trial signup
  const saveListing = async () => {
    setIsLoading(true);
    try {
      // Simulate saving to database
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (!isLoggedIn) {
        // Show trial signup modal
        setShowTrialSignup(true);
      } else {
        // Navigate to dashboard with success message
        navigate('/dashboard/listings?trial=success&listing=created');
      }
    } catch (error) {
      console.error('Failed to save listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Preview mobile listing
  const previewListing = () => {
    // Navigate to mobile listing preview
    navigate(`/dashboard/listings/mobile/demo`);
  };

  // Handle trial signup
  const handleTrialSignup = async () => {
    setIsLoading(true);
    try {
      // Simulate user registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save user data to localStorage (simulate login)
      localStorage.setItem('user', JSON.stringify({
        id: 'trial-user-' + Date.now(),
        name: trialSignupData.name,
        email: trialSignupData.email,
        trialStart: new Date().toISOString(),
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      // Close modal
      setShowTrialSignup(false);
      
      // Navigate to dashboard with success message
      navigate('/dashboard/listings?trial=success&listing=created');
    } catch (error) {
      console.error('Trial signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Build AI Listing</h1>
              <Badge variant="secondary" className="ml-3">
                7-Day Trial
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={previewListing}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveListing} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Scraping & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* URL Input & Scraping */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Import Listing Data</h2>
                </div>
                
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Zillow, Realtor.com, or MLS URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => startScraping(urlInput)}
                    disabled={!urlInput || isLoading}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Scrape
                  </Button>
                </div>

                {/* Scraping Progress */}
                {isLoading && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <LoadingSpinner size="sm" />
                      <span className="font-medium">{scrapingProgress.message}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scrapingProgress.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>You can edit while scraping continues...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Edit Listing Details</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {isEditing ? 'View Mode' : 'Edit Mode'}
                  </Button>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: Home },
                    { id: 'details', label: 'Details', icon: Building },
                    { id: 'media', label: 'Media', icon: Camera },
                    { id: 'agent', label: 'Agent', icon: User },
                    { id: 'advanced', label: 'Advanced', icon: Settings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Title
                        </label>
                        <Input
                          value={listingData.title}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          placeholder="Enter property title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <Input
                          value={listingData.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          placeholder="Enter full address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <Input
                          value={listingData.price}
                          onChange={(e) => handleFieldChange('price', e.target.value)}
                          placeholder="$450,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type
                        </label>
                        <Input
                          value={listingData.propertyType}
                          onChange={(e) => handleFieldChange('propertyType', e.target.value)}
                          placeholder="Single Family"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms
                        </label>
                        <Input
                          type="number"
                          value={listingData.bedrooms}
                          onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value))}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <Input
                          type="number"
                          value={listingData.bathrooms}
                          onChange={(e) => handleFieldChange('bathrooms', parseFloat(e.target.value))}
                          placeholder="2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Square Footage
                        </label>
                        <Input
                          type="number"
                          value={listingData.squareFootage}
                          onChange={(e) => handleFieldChange('squareFootage', parseInt(e.target.value))}
                          placeholder="1850"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year Built
                        </label>
                        <Input
                          type="number"
                          value={listingData.yearBuilt}
                          onChange={(e) => handleFieldChange('yearBuilt', parseInt(e.target.value))}
                          placeholder="2006"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <Textarea
                          value={listingData.description}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          placeholder="Enter detailed property description..."
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lot Size
                          </label>
                          <Input
                            value={listingData.lotSize}
                            onChange={(e) => handleFieldChange('lotSize', e.target.value)}
                            placeholder="0.25 acres"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parking
                          </label>
                          <Input
                            value={listingData.parking}
                            onChange={(e) => handleFieldChange('parking', e.target.value)}
                            placeholder="2-car garage"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heating
                          </label>
                          <Input
                            value={listingData.heating}
                            onChange={(e) => handleFieldChange('heating', e.target.value)}
                            placeholder="Forced Air"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cooling
                          </label>
                          <Input
                            value={listingData.cooling}
                            onChange={(e) => handleFieldChange('cooling', e.target.value)}
                            placeholder="Central Air"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URLs (one per line)
                        </label>
                        <Textarea
                          value={listingData.imageUrls.join('\n')}
                          onChange={(e) => handleFieldChange('imageUrls', e.target.value.split('\n').filter(url => url.trim()))}
                          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                          rows={4}
                        />
                      </div>
                      {listingData.imageUrls.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview Images
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {listingData.imageUrls.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Property image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'agent' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agent Name
                        </label>
                        <Input
                          value={listingData.agentInfo.name}
                          onChange={(e) => handleNestedFieldChange('agentInfo', 'name', e.target.value)}
                          placeholder="Sarah Martinez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <Input
                          value={listingData.agentInfo.phone}
                          onChange={(e) => handleNestedFieldChange('agentInfo', 'phone', e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          value={listingData.agentInfo.email}
                          onChange={(e) => handleNestedFieldChange('agentInfo', 'email', e.target.value)}
                          placeholder="sarah@realestate.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agent Photo URL
                        </label>
                        <Input
                          value={listingData.agentInfo.photo}
                          onChange={(e) => handleNestedFieldChange('agentInfo', 'photo', e.target.value)}
                          placeholder="https://example.com/agent-photo.jpg"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'advanced' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Features (comma-separated)
                        </label>
                        <Input
                          value={listingData.features.join(', ')}
                          onChange={(e) => handleFieldChange('features', e.target.value.split(',').map(f => f.trim()))}
                          placeholder="Open Floor Plan, Updated Kitchen, Hardwood Floors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amenities (comma-separated)
                        </label>
                        <Input
                          value={listingData.amenities.join(', ')}
                          onChange={(e) => handleFieldChange('amenities', e.target.value.split(',').map(f => f.trim()))}
                          placeholder="Central AC, Garage, Backyard, Deck"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Quick Preview */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Preview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{listingData.title || 'No title'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{listingData.address || 'No address'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{listingData.price || 'No price'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{listingData.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{listingData.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{listingData.squareFootage} sqft</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">AI Chat Assistant</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Voice Assistant</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Lead Tracking</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Auto Follow-ups</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trial Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Trial Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days Remaining:</span>
                    <span className="text-sm font-medium">6 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Features Active:</span>
                    <span className="text-sm font-medium text-green-600">All</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Leads Generated:</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trial Signup Modal */}
      {showTrialSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Start Your 7-Day Free Trial</h2>
              <p className="text-gray-600 mt-2">Your listing is ready! Sign up to save it to your dashboard.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={trialSignupData.name}
                  onChange={(e) => setTrialSignupData({...trialSignupData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={trialSignupData.email}
                  onChange={(e) => setTrialSignupData({...trialSignupData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={trialSignupData.password}
                  onChange={(e) => setTrialSignupData({...trialSignupData, password: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={trialSignupData.phone}
                  onChange={(e) => setTrialSignupData({...trialSignupData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowTrialSignup(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleTrialSignup}
                disabled={!trialSignupData.name || !trialSignupData.email || !trialSignupData.password}
                className="flex-1"
              >
                <Crown className="w-4 h-4 mr-2" />
                Start Trial
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildAIListingPage; 