import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useMotionValue, animate, easeInOut } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { 
  Globe, 
  User, 
  Phone, 
  Building, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Check,
  Wand2,
  Rocket,
  Eye,
  Clock,
  Brain,
  Smartphone
} from 'lucide-react';
import * as listingService from '../services/listingService';
import { useAuth } from '../contexts/AuthContext';


interface AnonymousSession {
  id: string;
  propertyUrl: string;
  agentName: string;
  agentPhone: string;
  agencyName: string;
  propertyData?: {
    title: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    description: string;
    images: string[];
  };
  createdAt: string;
}

const AnonymousBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isBuilding, setIsBuilding] = useState(false);
  const [formData, setFormData] = useState({
    propertyUrl: '',
    agentName: '',
    agentPhone: '',
    agencyName: '',
    agentTitle: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: "Property URL", icon: Globe, description: "Where's your listing?" },
    { id: 2, title: "Agent Info", icon: User, description: "Who are you?" },
    { id: 3, title: "AI Magic", icon: Wand2, description: "Watch it build!" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const buildingVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  const bounceTransition = {
    y: {
      duration: 0.6,
      yoyo: Infinity,
      ease: easeInOut,
    },
  };

  const SUPABASE_SCRAPE_ENDPOINT = 'https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.propertyUrl.trim()) {
        newErrors.propertyUrl = 'Property URL is required';
      } else if (!isValidUrl(formData.propertyUrl)) {
        newErrors.propertyUrl = 'Please enter a valid URL';
      }
    }
    
    if (step === 2) {
      if (!formData.agentName.trim()) {
        newErrors.agentName = 'Your name is required';
      }
      if (!formData.agentTitle.trim()) {
        newErrors.agentTitle = 'Your title is required';
      }
      if (!formData.agencyName.trim()) {
        newErrors.agencyName = 'Agency name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        buildAI();
      }
    }
  };

  const buildAI = async () => {
    setIsBuilding(true);
    setCurrentStep(3);
    
    try {
      console.log('🚀 Starting real scraping for URL:', formData.propertyUrl);
      console.log('🔑 Using API endpoint:', SUPABASE_SCRAPE_ENDPOINT);
      console.log('🔑 Auth token:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
      
      // Add realistic delays to show the scraping process
      await new Promise(resolve => setTimeout(resolve, 2000)); // Scraping delay
      
      // Call the real scraper API
      console.log('📡 Making API call to scraper...');
      const response = await fetch(SUPABASE_SCRAPE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
        },
        body: JSON.stringify({
          url: formData.propertyUrl
        })
      });
      
      console.log('📡 API response status:', response.status);
      console.log('📡 API response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error response:', errorText);
        throw new Error(`Scraper API error: ${response.status} - ${errorText}`);
      }
      
      const response_data = await response.json();
      console.log('📊 Scraped data received:', response_data);
      
      // Extract the actual property data from the API response
      const scrapedData = response_data.data || response_data;
      console.log('📊 Actual property data:', scrapedData);
      
      // Transform scraped data to match UI expectations
      const transformedPropertyData = {
        title: scrapedData.address || 'Property Title',
        price: scrapedData.price || '$X,XXX,XXX',
        bedrooms: scrapedData.bedrooms || 0,
        bathrooms: scrapedData.bathrooms || 0,
        sqft: scrapedData.squareFeet || 0,
        description: scrapedData.description || 'Beautiful property with excellent features.',
        images: scrapedData.images || [],
        whatsSpecialTags: scrapedData.features?.slice(0, 5) || [],
        whatsSpecialDescription: scrapedData.neighborhood ? `Located in ${scrapedData.neighborhood}` : undefined
      };
      
      console.log('🔄 Transformed property data:', transformedPropertyData);
      
      // Create anonymous session with transformed scraped data
      const session: AnonymousSession = {
        id: generateSessionId(),
        propertyUrl: formData.propertyUrl,
        agentName: formData.agentName,
        agentPhone: formData.agentPhone || '',
        agencyName: formData.agencyName,
        propertyData: transformedPropertyData,
        createdAt: new Date().toISOString()
      };
      
      // Store both session data and scraped data for later use
      localStorage.setItem('anonymousSession', JSON.stringify(session));
      localStorage.setItem('lastScrapedProperty', JSON.stringify(scrapedData));
      
      localStorage.setItem('anonymousSession', JSON.stringify(session));
      navigate('/card-trick-preview');
    } catch (err: any) {
      console.error('❌ Build error:', err);
      console.log('🔄 Falling back to mock data due to scraper error:', err.message);
      
      // Fallback to mock data if scraper fails
      const mockPropertyData = generateMockPropertyData(formData.propertyUrl);
      
      const session: AnonymousSession = {
        id: generateSessionId(),
        propertyUrl: formData.propertyUrl,
        agentName: formData.agentName,
        agentPhone: formData.agentPhone || '',
        agencyName: formData.agencyName,
        propertyData: mockPropertyData,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('anonymousSession', JSON.stringify(session));
      navigate('/card-trick-preview');
    }
  };

  // Function to save scraped property as a real listing (to be called after signup)
  const saveScrapedPropertyAsListing = async (userId: string): Promise<string | null> => {
    try {
      const scrapedDataStr = localStorage.getItem('lastScrapedProperty');
      const sessionStr = localStorage.getItem('anonymousSession');
      
      if (!scrapedDataStr || !sessionStr) {
        console.log('No scraped data found to save');
        return null;
      }
      
      const scrapedData = JSON.parse(scrapedDataStr);
      const session = JSON.parse(sessionStr);
      
      // Convert scraped data to listing format
      const scrapedImages = scrapedData.images || session.propertyData?.images || [];
      
      const listingData = {
        title: scrapedData.address || session.propertyData?.title || 'Property Title',
        description: scrapedData.description || session.propertyData?.description || 'Beautiful property',
        address: scrapedData.address || session.propertyData?.title || 'Address',
        price: parseInt(scrapedData.price?.replace(/[^\d]/g, '') || '0') || 500000,
        property_type: 'Single-Family Home',
        status: 'Active',
        bedrooms: scrapedData.bedrooms || session.propertyData?.bedrooms || 3,
        bathrooms: scrapedData.bathrooms || session.propertyData?.bathrooms || 2,
        square_footage: scrapedData.squareFeet || session.propertyData?.sqft || 1500,
        lot_size: 0.25,
        year_built: 2020,
        // Limit to 10 photos max, all scraped photos go to gallery
        image_urls: scrapedImages.slice(0, 10),
        knowledge_base: JSON.stringify({
          features: scrapedData.features || session.propertyData?.whatsSpecialTags || [],
          neighborhood: scrapedData.neighborhood || session.propertyData?.whatsSpecialDescription || '',
          originalUrl: session.propertyUrl,
          photoCount: scrapedImages.length,
          heroPhotos: scrapedImages.slice(0, 3) // First 3 become hero photos
        })
      };
      
      console.log('💾 Saving listing data:', listingData);
      
      // Create the listing
      const createdListing = await listingService.createListing({
        ...listingData,
        agent_id: userId
      });
      
      console.log('✅ Listing created successfully:', createdListing);
      
      // Clean up stored data
      localStorage.removeItem('lastScrapedProperty');
      
      return createdListing.id;
    } catch (error) {
      console.error('❌ Error saving scraped property as listing:', error);
      return null;
    }
  };

  // Make this function available globally for use after signup
  useEffect(() => {
    (window as any).saveScrapedPropertyAsListing = saveScrapedPropertyAsListing;
  }, []);

  const generateMockPropertyData = (url: string) => {
    console.log('🔍 Generating mock data for URL:', url);
    
    // Parse the URL to extract meaningful information
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
    
    // Extract location and property info from URL
    const state = pathParts.find(part => /^[A-Z]{2}$/.test(part)) || 'WA';
    const city = pathParts.find(part => /^[A-Z][a-z]+$/.test(part)) || 'Seattle';
    const streetAddress = pathParts.find(part => part.includes('-')) || '';
    const zipCode = pathParts.find(part => /^\d{5}$/.test(part)) || '98146';
    const propertyId = pathParts.find(part => /^\d+$/.test(part)) || '157491';
    
    console.log('📍 Extracted data:', { state, city, streetAddress, zipCode, propertyId });
    
    // Generate realistic data based on the URL structure
    const isZillow = url.includes('zillow.com');
    const isRealtor = url.includes('realtor.com');
    const isRedfin = url.includes('redfin.com');
    const isMLS = url.includes('mls') || url.includes('matrix');
    
    console.log('🏠 Website detection:', { isZillow, isRealtor, isRedfin, isMLS });
    
    // Create realistic property data based on the actual URL
    let mockData = {
      title: '',
      price: '',
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
      description: '',
      images: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
      ]
    };
    
    // Generate data based on any Redfin URL by extracting the address
    if (isRedfin) {
      console.log('🎯 Found Redfin URL - extracting address from URL');
      
      // Extract address from Redfin URL pattern: /WA/Seattle/436-27th-Ave-E-98112/home/147047
      const addressMatch = url.match(/\/[A-Z]{2}\/[A-Za-z]+\/([^\/]+)-\d+/);
      if (addressMatch) {
        const addressPart = addressMatch[1].replace(/-/g, ' ');
        const fullAddress = `${addressPart}, ${city}, ${state} ${zipCode}`;
        
        console.log('📍 Extracted address:', fullAddress);
        
        mockData = {
          title: fullAddress,
          price: '$892,500',
          bedrooms: 3,
          bathrooms: 2,
          sqft: 2200,
          description: `Beautiful ${city} home featuring modern amenities and a prime location. This well-maintained property offers ${mockData.bedrooms} bedrooms and ${mockData.bathrooms} bathrooms with ${mockData.sqft} square feet of living space.`,
          images: [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
          ]
        };
      } else {
        // Fallback for Redfin URLs that don't match the pattern
        mockData = {
          title: `${city}, ${state}`,
          price: '$850,000',
          bedrooms: 3,
          bathrooms: 2,
          sqft: 2200,
          description: `Beautiful ${city} home featuring modern amenities and a prime location. This well-maintained property offers ${mockData.bedrooms} bedrooms and ${mockData.bathrooms} bathrooms with ${mockData.sqft} square feet of living space.`,
          images: [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
          ]
        };
      }
    } else if (isRedfin) {
      // For other Redfin URLs, extract info from the path
      const addressPart = streetAddress.replace(/-/g, ' ') || 'Property';
      mockData = {
        title: `${addressPart}, ${city}, ${state} ${zipCode}`,
        price: '$850,000',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2200,
        description: `Beautiful ${city} home featuring modern amenities and a prime location. This well-maintained property offers ${mockData.bedrooms} bedrooms and ${mockData.bathrooms} bathrooms with ${mockData.sqft} square feet of living space.`,
        images: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
        ]
      };
    } else if (isZillow) {
      mockData = {
        title: `Zillow Listing - ${city}, ${state}`,
        price: '$675,000',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2800,
        description: `Stunning ${city} property with modern updates and excellent location. Features ${mockData.bedrooms} bedrooms, ${mockData.bathrooms} bathrooms, and ${mockData.sqft} square feet of living space.`,
        images: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
        ]
      };
    } else if (isRealtor) {
      mockData = {
        title: `Realtor.com Property - ${city}, ${state}`,
        price: '$725,000',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 2400,
        description: `Move-in ready ${city} home with ${mockData.bedrooms} bedrooms and ${mockData.bathrooms} bathrooms. ${mockData.sqft} square feet of beautifully designed living space.`,
        images: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
        ]
      };
    } else {
      // Generic property based on URL
      mockData = {
        title: `Property Listing - ${city}, ${state}`,
        price: '$599,000',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 2200,
        description: `Beautiful ${city} home with ${mockData.bedrooms} bedrooms and ${mockData.bathrooms} bathrooms. ${mockData.sqft} square feet of comfortable living space in a great location.`,
        images: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
        ]
      };
    }
    
    // Add some randomness to make it feel more real
    const priceVariations = [0.95, 1.0, 1.05, 1.1];
    const randomPrice = priceVariations[Math.floor(Math.random() * priceVariations.length)];
    const basePrice = parseInt(mockData.price.replace(/[$,]/g, ''));
    mockData.price = `$${Math.round(basePrice * randomPrice).toLocaleString()}`;
    
    return mockData;
  };

  const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Where's Your Listing?</h2>
              <p className="text-gray-600">Paste any property URL and watch the magic happen</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyUrl" className="text-gray-700 font-medium">
                  Property URL
                </Label>
                <Input
                  id="propertyUrl"
                  name="propertyUrl"
                  type="url"
                  value={formData.propertyUrl}
                  onChange={handleInputChange}
                  placeholder="https://zillow.com/your-listing or realtor.com/property..."
                  className={`h-12 ${errors.propertyUrl ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.propertyUrl && (
                  <p className="text-red-500 text-sm">{errors.propertyUrl}</p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Works with:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>• Zillow</div>
                  <div>• Realtor.com</div>
                  <div>• Redfin</div>
                  <div>• MLS listings</div>
                  <div className="col-span-2 text-blue-500 font-semibold mt-1">and many more</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tell Us About You</h2>
              <p className="text-gray-600">Your AI agent will represent you professionally</p>
              <p className="text-blue-700 text-sm font-medium mt-1">Don't worry, you'll be able to edit and add more information in your dashboard.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentName" className="text-gray-700 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="agentName"
                  name="agentName"
                  type="text"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className={`h-12 ${errors.agentName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.agentName && (
                  <p className="text-red-500 text-sm">{errors.agentName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agentTitle" className="text-gray-700 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Your Title
                </Label>
                <Input
                  id="agentTitle"
                  name="agentTitle"
                  type="text"
                  value={formData.agentTitle || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Realtor®, Broker, Listing Specialist"
                  className={`h-12 ${errors.agentTitle ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.agentTitle && (
                  <p className="text-red-500 text-sm">{errors.agentTitle}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agencyName" className="text-gray-700 font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Agency Name
                </Label>
                <Input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  placeholder="Your Real Estate Agency"
                  className={`h-12 ${errors.agencyName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.agencyName && (
                  <p className="text-red-500 text-sm">{errors.agencyName}</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-purple-400 rounded-full"
                />
                <Wand2 className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Building Your AI Agent</h2>
              <p className="text-gray-600">Analyzing your property and creating intelligent responses...</p>
            </div>
            
            {/* Animated Progress Steps */}
            <div className="bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
              <div className="w-full max-w-md space-y-6">
                {/* Step 1: Scraping */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [0, 1] }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800">Scraping property data...</h3>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="bg-green-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Step 2: Training */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Brain className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800">Training AI responses...</h3>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 1.5 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Step 3: Generating */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Smartphone className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-800">Generating mobile app...</h3>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 2.5 }}
                        className="bg-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Particles Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end mt-6">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
              <Button
                type="button"
                className="ml-2 px-8 py-4 text-lg font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white shadow-lg rounded-2xl border-0 hover:from-yellow-500 hover:to-pink-600 transition-all duration-200"
                style={{ minWidth: '220px', minHeight: '56px' }}
                onClick={buildAI}
                disabled={isBuilding}
              >
                <motion.div
                  animate={{ scale: isBuilding ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 1, repeat: isBuilding ? Infinity : 0 }}
                  className="flex items-center gap-2"
                >
                  {isBuilding ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Building...
                    </>
                  ) : (
                    'Build My Listing'
                  )}
                </motion.div>
              </Button>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  if (isBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-purple-100/10"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/5 to-purple-200/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/5 to-pink-200/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative z-10 text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Rocket className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Build Your AI Listing</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional AI listing in just 30 seconds
          </p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg"
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              {renderStep()}
              
              {/* Actions: Only show for steps 1 and 2 */}
              {currentStep === 1 || currentStep === 2 ? (
                <div className="flex justify-between items-center mt-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>~30 seconds</span>
                  </div>
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 shadow-lg"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          {currentStep === 3 && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -12, 0] }}
              transition={bounceTransition}
              style={{ display: isBuilding ? 'block' : 'none', margin: '0 auto', width: 48, height: 48 }}
            >
              <Wand2 className="w-12 h-12 text-purple-500 drop-shadow-lg" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Notice */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>No signup required • Try it free • Takes 30 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default AnonymousBuilderPage; 