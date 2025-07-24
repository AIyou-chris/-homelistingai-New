import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import * as listingService from '../services/listingService';
import * as knowledgeBaseService from '../services/knowledgeBaseService';
import { Listing, PropertyType, ListingStatus } from '../types';
import { 
  Upload, 
  DollarSign, 
  Home, 
  BarChart, 
  BrainCircuit, 
  FileText, 
  Image as ImageIcon, 
  Link2, 
  Save, 
  Globe, 
  Video, 
  Share2, 
  FileUp,
  Lightbulb,
  Sparkles,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Building,
  MapPin,
  FileIcon,
  Building2,
  Car,
  Wifi,
  Shield,
  Camera,
  Star,
  TrendingUp,
  Heart,
  Target,
  Users,
  Clock,
  MessageSquare,
  Calendar,
  Settings,
  Bed,
  Bath,
  Square,
  Plus,
  X
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const UploadListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [showCoreDetails, setShowCoreDetails] = useState(false);
  const [contactHeadshot, setContactHeadshot] = useState<string | null>(null);
  const [isCreatingKnowledgeBase, setIsCreatingKnowledgeBase] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    title: string;
    description: string;
    keyFeatures: string[];
    sellingPoints: string[];
  }>({
    title: '',
    description: '',
    keyFeatures: [],
    sellingPoints: []
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState({
    coreDetails: true,
    mediaMarketing: true,
    contactInfo: true,
    knowledgeBase: true,
    detailedSections: true
  });

  // Form state
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    property_type: PropertyType.SINGLE_FAMILY,
    status: ListingStatus.ACTIVE,
    bedrooms: '',
    bathrooms: '',
    square_footage: '',
    lot_size: '',
    year_built: '',
    title: '',
    description: '',
    // New fields
    scraperUrl: '',
    image_urls: [] as string[],
    videoUrl: '',
    socialMediaLinks: [] as string[],
    knowledge_base: [] as string[],
    // Contact information
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactCompany: '',
    contactWebsite: '',
    contactBio: '',
    // Property Features & Amenities
    interiorFeatures: [] as string[],
    exteriorFeatures: [] as string[],
    utilities: [] as string[],
    parking: [] as string[],
    // Property History & Condition
    lastRenovated: '',
    propertyCondition: '',
    annualTaxes: '',
    hoaFees: '',
    hoaRules: '',
    // Financial & Market Data
    originalPrice: '',
    priceHistory: [] as { date: string; price: string }[],
    daysOnMarket: '',
    rentalPotential: '',
    // Virtual Tours & Media
    virtualTourUrls: [] as string[],
    dronePhotos: [] as string[],
    floorPlanUrl: '',
    neighborhoodPhotos: [] as string[],
    // Property Highlights
    keySellingPoints: [] as string[],
    recentUpdates: [] as string[],
    uniqueFeatures: [] as string[],
    investmentHighlights: [] as string[],
    // Neighborhood Information
    schoolDistrict: '',
    schoolRatings: '',
    transportation: [] as string[],
    localAmenities: [] as string[],
    crimeRating: '',
    // Showing Information
    showingInstructions: '',
    availableTimes: [] as string[],
    specialRequirements: '',
    // Lead Generation
    preferredContact: '',
    responseTime: '',
    languagesSpoken: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate basic title suggestion when core details are filled
    if (['streetAddress', 'price', 'bedrooms', 'bathrooms', 'property_type'].includes(name)) {
      const newData = { ...formData, [name]: value };
      if (newData.streetAddress && newData.price && newData.bedrooms && newData.bathrooms) {
        const autoTitle = generateBasicTitle(newData);
        if (!aiSuggestions.title) {
          setAiSuggestions(prev => ({ ...prev, title: autoTitle }));
        }
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // In a real app, you'd upload these to a storage service
    const urls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ...urls] }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
            setFormData(prev => ({ 
          ...prev, 
          knowledge_base: [...prev.knowledge_base, ...files.map(file => file.name)]
        }));
  };

  const handleHeadshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setContactHeadshot(url);
    }
  };

  const handleSocialMediaAdd = () => {
    const newLink = prompt('Enter social media link:');
    if (newLink) {
      setFormData(prev => ({ ...prev, socialMediaLinks: [...prev.socialMediaLinks, newLink] }));
    }
  };

  const handleScrapeListing = async () => {
    if (!formData.scraperUrl) {
      setError('Please enter a URL to scrape');
      return;
    }
    
    setIsScraping(true);
    setError(null);
    
    try {
      // This would call your scraping service
      const response = await fetch('/api/scrape-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.scraperUrl })
      });
      
      if (response.ok) {
        const scrapedData = await response.json();
        setFormData(prev => ({
          ...prev,
          title: scrapedData.title || prev.title,
          description: scrapedData.description || prev.description,
          price: scrapedData.price || prev.price,
          bedrooms: scrapedData.bedrooms || prev.bedrooms,
          bathrooms: scrapedData.bathrooms || prev.bathrooms,
          square_footage: scrapedData.square_footage || prev.square_footage,
          streetAddress: scrapedData.address?.split(',')[0] || prev.streetAddress,
          city: scrapedData.city || prev.city,
          state: scrapedData.state || prev.state,
          zipCode: scrapedData.zipCode || prev.zipCode,
          image_urls: [...prev.image_urls, ...(scrapedData.images || [])]
        }));
        
        // If we got good data from scraping, show the core details section
        if (scrapedData.title && scrapedData.price) {
          setShowCoreDetails(true);
        }
      } else {
        setError('Failed to scrape listing. Please check the URL and try again.');
      }
    } catch (err) {
      setError('Scraping service is currently unavailable. Please fill in the details manually.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        address: `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        price: parseFloat(formData.price.replace(/[^0-9.]/g, '')),
        property_type: formData.property_type,
        status: formData.status,
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseFloat(formData.bathrooms),
        square_footage: parseInt(formData.square_footage, 10),
        lot_size: parseInt(formData.lot_size, 10) || undefined,
        year_built: parseInt(formData.year_built, 10) || undefined,
        image_urls: formData.image_urls,
        knowledge_base: JSON.stringify(formData.knowledge_base),
      };

      // Create the listing first
      const newListing = await listingService.addListing(listingData, user.id);

      // Show progress for knowledge base creation
      setIsCreatingKnowledgeBase(true);

      // Transform form data for knowledge base
      const knowledgeData: knowledgeBaseService.ListingKnowledgeData = {
        // Core Property Details
        address: listingData.address,
        price: formData.price,
        propertyType: formData.property_type,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        squareFootage: formData.square_footage,
        lotSize: formData.lot_size,
        yearBuilt: formData.year_built,
        
        // Property Features
        interiorFeatures: formData.interiorFeatures,
        exteriorFeatures: formData.exteriorFeatures,
        utilities: formData.utilities,
        parking: formData.parking,
        
        // Property Highlights
        keySellingPoints: formData.keySellingPoints,
        recentUpdates: formData.recentUpdates,
        uniqueFeatures: formData.uniqueFeatures,
        investmentHighlights: formData.investmentHighlights,
        
        // Financial & Market Data
        originalPrice: formData.originalPrice,
        priceHistory: formData.priceHistory,
        daysOnMarket: formData.daysOnMarket,
        rentalPotential: formData.rentalPotential,
        annualTaxes: formData.annualTaxes,
        hoaFees: formData.hoaFees,
        
        // Property History & Condition
        lastRenovated: formData.lastRenovated,
        propertyCondition: formData.propertyCondition,
        hoaRules: formData.hoaRules,
        
        // Neighborhood Information
        schoolDistrict: formData.schoolDistrict,
        schoolRatings: formData.schoolRatings,
        transportation: formData.transportation,
        localAmenities: formData.localAmenities,
        crimeRating: formData.crimeRating,
        
        // Contact Information
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        contactCompany: formData.contactCompany,
        contactWebsite: formData.contactWebsite,
        contactBio: formData.contactBio,
        
        // Showing Information
        showingInstructions: formData.showingInstructions,
        availableTimes: formData.availableTimes,
        specialRequirements: formData.specialRequirements,
        
        // Lead Generation
        preferredContact: formData.preferredContact,
        responseTime: formData.responseTime,
        languagesSpoken: formData.languagesSpoken,
        
        // Media & Marketing
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        socialMediaLinks: formData.socialMediaLinks,
        virtualTourUrls: formData.virtualTourUrls,
        floorPlanUrl: formData.floorPlanUrl,
      };

      // Create comprehensive knowledge base for the listing
      await knowledgeBaseService.createKnowledgeBaseForListing(newListing.id, knowledgeData, user.id);

      navigate('/dashboard/listings');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAISuggestions = async () => {
    if (!formData.streetAddress || !formData.price || !formData.bedrooms || !formData.bathrooms) {
      setError('Please fill in basic property details (address, price, bedrooms, bathrooms) to generate AI suggestions');
      return;
    }

    setIsGeneratingAI(true);
    setError(null);

    try {
      // Simulate AI API call - in real implementation, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate AI suggestions based on form data
      const suggestions = {
        title: generateAITitle(),
        description: generateAIDescription(),
        keyFeatures: generateKeyFeatures(),
        sellingPoints: generateSellingPoints()
      };

      setAiSuggestions(suggestions);
    } catch (err) {
      setError('Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAITitle = (): string => {
    const { streetAddress, price, bedrooms, bathrooms, property_type, square_footage } = formData;
    
    const priceFormatted = price ? `$${parseInt(price).toLocaleString()}` : '';
    const bedBath = `${bedrooms}BR/${bathrooms}BA`;
    const sqft = square_footage ? `, ${square_footage} sqft` : '';
    
    // Extract neighborhood/city from address
    const addressParts = streetAddress.split(',');
    const location = addressParts.length > 1 ? addressParts[1].trim() : 'Beautiful';
    
    const titleTemplates = [
      `Stunning ${property_type} in ${location} - ${bedBath}${sqft}`,
      `${priceFormatted} ${property_type} - ${bedBath} in ${location}`,
      `Charming ${property_type} - ${bedBath}${sqft} in ${location}`,
      `Move-in Ready ${property_type} - ${bedBath} in ${location}`,
      `Beautiful ${property_type} - ${bedBath}${sqft} - ${location}`
    ];

    return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  };

  const generateAIDescription = (): string => {
    const { bedrooms, bathrooms, square_footage, property_type, price, year_built } = formData;
    
    const priceFormatted = price ? `$${parseInt(price).toLocaleString()}` : '';
    const bedBath = `${bedrooms} bedroom${bedrooms !== '1' ? 's' : ''}, ${bathrooms} bathroom${bathrooms !== '1' ? 's' : ''}`;
    const sqft = square_footage ? `${square_footage} square feet` : 'spacious';
    const year = year_built ? `built in ${year_built}` : 'well-maintained';
    
    return `Welcome to this beautiful ${property_type} featuring ${bedBath} and ${sqft} of living space. This ${year} home offers the perfect blend of comfort and style. 

The open floor plan creates an ideal space for entertaining, while the well-appointed kitchen features modern appliances and plenty of counter space. The bedrooms provide comfortable retreats, and the bathrooms have been thoughtfully designed.

Located in a desirable neighborhood, this property offers easy access to shopping, dining, and transportation. Don't miss the opportunity to make this ${priceFormatted} home yours!`;
  };

  const generateKeyFeatures = (): string[] => {
    const { bedrooms, bathrooms, square_footage, property_type, year_built } = formData;
    
    const features = [
      `${bedrooms} Bedrooms`,
      `${bathrooms} Bathrooms`,
      square_footage ? `${square_footage} Square Feet` : 'Spacious Layout',
      year_built ? `Built in ${year_built}` : 'Well-Maintained',
      'Open Floor Plan',
      'Modern Kitchen',
      'Updated Bathrooms',
      'Hardwood Floors',
      'Central Air Conditioning',
      'Attached Garage',
      'Fenced Backyard',
      'Energy Efficient'
    ];

    // Return 6-8 random features
    return features.sort(() => 0.5 - Math.random()).slice(0, 8);
  };

  const generateSellingPoints = (): string[] => {
    const { price, bedrooms, bathrooms, property_type } = formData;
    
    const points = [
      'Prime Location',
      'Excellent Schools',
      'Low Maintenance',
      'Great Investment',
      'Move-in Ready',
      'Updated Throughout',
      'Large Lot',
      'Quiet Neighborhood',
      'Close to Amenities',
      'High Demand Area',
      'Great Curb Appeal',
      'Perfect for Families'
    ];

    // Return 4-6 random selling points
    return points.sort(() => 0.5 - Math.random()).slice(0, 6);
  };

  const applyAISuggestion = (type: 'title' | 'description' | 'features' | 'sellingPoints') => {
    switch (type) {
      case 'title':
        setFormData(prev => ({ ...prev, title: aiSuggestions.title }));
        break;
      case 'description':
        setFormData(prev => ({ ...prev, description: aiSuggestions.description }));
        break;
      case 'features':
        setFormData(prev => ({ ...prev, interiorFeatures: [...prev.interiorFeatures, ...aiSuggestions.keyFeatures] }));
        break;
      case 'sellingPoints':
        setFormData(prev => ({ ...prev, keySellingPoints: [...prev.keySellingPoints, ...aiSuggestions.sellingPoints] }));
        break;
    }
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split('\n').filter(feature => feature.trim() !== '');
    setFormData(prev => ({ ...prev, interiorFeatures: features }));
  };

  const handleSellingPointsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const points = e.target.value.split('\n').filter(point => point.trim() !== '');
    setFormData(prev => ({ ...prev, keySellingPoints: points }));
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formSectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const generateBasicTitle = (data: any): string => {
    const { streetAddress, price, bedrooms, bathrooms, property_type } = data;
    
    if (!streetAddress || !price || !bedrooms || !bathrooms) return '';
    
    const priceFormatted = `$${parseInt(price).toLocaleString()}`;
    const bedBath = `${bedrooms}BR/${bathrooms}BA`;
    
    // Extract neighborhood/city from address
    const addressParts = streetAddress.split(',');
    const location = addressParts.length > 1 ? addressParts[1].trim() : 'Beautiful';
    
    return `${priceFormatted} ${property_type} - ${bedBath} in ${location}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Property Listing</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create a comprehensive AI-powered listing with photos, documents, and detailed information
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-3">Important Legal Notice</h4>
              <div className="space-y-2 text-sm text-amber-800 leading-relaxed">
                <p><strong>Content Responsibility:</strong> By uploading content, you represent that you own or have rights to all uploaded materials including photos, documents, and property information.</p>
                <p><strong>Compliance Requirements:</strong> You are responsible for ensuring all content complies with copyright laws, fair housing regulations, MLS rules, and local real estate laws.</p>
                <p><strong>AI-Generated Content:</strong> AI-generated descriptions and marketing materials should be reviewed by licensed professionals before use. We do not guarantee accuracy or compliance.</p>
                <p><strong>Data Usage:</strong> Uploaded content may be used to improve our AI systems. You retain ownership but grant us license for service improvement.</p>
                <p><strong>Professional Advice:</strong> This tool assists with marketing but does not replace professional legal, financial, or real estate advice.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: URL Scraper */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Globe className="w-6 h-6 text-primary"/>
                <CardTitle>Quick Import from Existing Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        If you have an existing listing on another website (like Zillow, Realtor.com, or your own website), 
                        you can paste the URL here and we'll automatically extract the property details, photos, and description. 
                        This saves you time by not having to manually re-enter information you've already created elsewhere.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="scraperUrl">Listing URL</Label>
                    <Input 
                      id="scraperUrl" 
                      name="scraperUrl" 
                      value={formData.scraperUrl} 
                      onChange={handleInputChange} 
                      placeholder="https://www.zillow.com/homedetails/..." 
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      onClick={handleScrapeListing} 
                      disabled={isScraping || !formData.scraperUrl}
                      className="whitespace-nowrap"
                    >
                      {isScraping ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Import Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: Media & Marketing */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader 
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('mediaMarketing')}
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-primary"/>
                  <CardTitle>Media & Marketing</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  {collapsedSections.mediaMarketing ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardHeader>
              {!collapsedSections.mediaMarketing && (
                <CardContent className="space-y-4">
                  {/* AI Assistant Banner */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BrainCircuit className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-900 mb-2">AI Writing Assistant</h4>
                        <p className="text-sm text-purple-800 leading-relaxed mb-3">
                          Let AI help you create compelling titles and descriptions that attract more buyers. 
                          Fill in the basic property details first, then click "Generate AI Suggestions" below.
                        </p>
                        <Button 
                          onClick={generateAISuggestions} 
                          disabled={isGeneratingAI || !formData.streetAddress || !formData.price}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {isGeneratingAI ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Generating...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <BrainCircuit className="w-4 h-4" />
                              Generate AI Suggestions
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* AI Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <strong>Pro Tip:</strong> For better AI suggestions, fill in the address, price, bedrooms, bathrooms, and property type first. 
                        The more details you provide, the more personalized and compelling the AI-generated content will be.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title">Listing Title / Headline</Label>
                      {aiSuggestions.title && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => applyAISuggestion('title')}
                          className="text-xs"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Apply AI Suggestion
                        </Button>
                      )}
                    </div>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Charming Craftsman with Modern Updates" required />
                    {aiSuggestions.title && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                        <strong>AI Suggestion:</strong> {aiSuggestions.title}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Property Description</Label>
                      {aiSuggestions.description && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => applyAISuggestion('description')}
                          className="text-xs"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Apply AI Suggestion
                        </Button>
                      )}
                    </div>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={6} placeholder="Describe the property's key features and appeal..." />
                    {aiSuggestions.description && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border max-h-32 overflow-y-auto">
                        <strong>AI Suggestion:</strong> {aiSuggestions.description}
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Property Photos</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload high-quality photos of your property</p>
                      <Input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <Label htmlFor="imageUpload" className="cursor-pointer">
                        <Button type="button" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Images
                        </Button>
                      </Label>
                    </div>
                    {formData.image_urls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {formData.image_urls.map((url, index) => (
                          <img key={index} src={url} alt={`Property ${index + 1}`} className="w-full h-20 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Link */}
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video Tour URL</Label>
                    <Input 
                      id="videoUrl" 
                      name="videoUrl" 
                      value={formData.videoUrl} 
                      onChange={handleInputChange} 
                      placeholder="https://www.youtube.com/watch?v=..." 
                    />
                    <p className="text-xs text-muted-foreground">Add a link to a video tour (YouTube, Vimeo, etc.)</p>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-2">
                    <Label>Social Media Links</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={handleSocialMediaAdd}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Add Social Link
                      </Button>
                    </div>
                    {formData.socialMediaLinks.length > 0 && (
                      <div className="space-y-1">
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
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Section 1: Core Property Details */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader 
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('coreDetails')}
              >
                <div className="flex items-center gap-4">
                  <Home className="w-6 h-6 text-primary"/>
                  <CardTitle>Core Property Details</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  {collapsedSections.coreDetails ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardHeader>
              {!collapsedSections.coreDetails && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="$500,000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select value={formData.property_type} onValueChange={(value) => handleSelectChange('property_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PropertyType).map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="2.5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="square_footage">Square Footage</Label>
                      <Input id="square_footage" name="square_footage" value={formData.square_footage} onChange={handleInputChange} placeholder="2,500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lot_size">Lot Size (acres)</Label>
                      <Input id="lot_size" name="lot_size" value={formData.lot_size} onChange={handleInputChange} placeholder="0.25" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year_built">Year Built</Label>
                      <Input id="year_built" name="year_built" value={formData.year_built} onChange={handleInputChange} placeholder="1995" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ListingStatus).map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Section 3: Contact Information */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader 
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('contactInfo')}
              >
                <div className="flex items-center gap-4">
                  <User className="w-6 h-6 text-primary"/>
                  <CardTitle>Contact Information</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  {collapsedSections.contactInfo ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardHeader>
              {!collapsedSections.contactInfo && (
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Professional Contact Details</h4>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          This information will be displayed to potential buyers and integrated into your AI knowledge base 
                          for automated responses about agent contact details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Full Name</Label>
                      <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="John Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactCompany">Company</Label>
                      <Input id="contactCompany" name="contactCompany" value={formData.contactCompany} onChange={handleInputChange} placeholder="ABC Real Estate" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} placeholder="(555) 123-4567" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} placeholder="john@abcrealestate.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactWebsite">Website</Label>
                    <Input id="contactWebsite" name="contactWebsite" value={formData.contactWebsite} onChange={handleInputChange} placeholder="https://www.abcrealestate.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactBio">Professional Bio</Label>
                    <Textarea id="contactBio" name="contactBio" value={formData.contactBio} onChange={handleInputChange} rows={3} placeholder="Brief professional bio about your experience and specialties..." />
                  </div>

                  {/* Headshot Upload */}
                  <div className="space-y-2">
                    <Label>Professional Headshot</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload a professional headshot for your listing</p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleHeadshotUpload}
                        className="hidden"
                        id="headshotUpload"
                      />
                      <Label htmlFor="headshotUpload" className="cursor-pointer">
                        <Button type="button" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Headshot
                        </Button>
                      </Label>
                    </div>
                    {contactHeadshot && (
                      <div className="mt-2">
                        <img src={contactHeadshot} alt="Contact headshot" className="w-24 h-24 object-cover rounded-full mx-auto" />
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Section 4: Knowledge Base */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader 
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('knowledgeBase')}
              >
                <div className="flex items-center gap-4">
                  <BrainCircuit className="w-6 h-6 text-primary"/>
                  <CardTitle>AI Knowledge Base</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  {collapsedSections.knowledgeBase ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardHeader>
              {!collapsedSections.knowledgeBase && (
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BrainCircuit className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-2">What is the AI Knowledge Base?</h4>
                        <p className="text-sm text-green-800 leading-relaxed mb-3">
                          The AI Knowledge Base is like having a smart assistant that knows everything about your property. 
                          When potential buyers visit your listing page, they can ask questions like "What's the HOA fee?" 
                          or "When was the roof last replaced?" and get instant, accurate answers.
                        </p>
                        <p className="text-sm text-green-800 leading-relaxed">
                          Upload documents like inspection reports, HOA rules, utility bills, renovation permits, 
                          appliance manuals, and neighborhood information. Our AI will read and understand these documents, 
                          making your property more attractive to serious buyers who want detailed information.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Property Documents</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload PDFs, Word docs, or text files with property information
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Examples: Inspection reports, HOA documents, utility bills, renovation permits, appliance manuals
                      </p>
                      <Input 
                        type="file" 
                        multiple 
                        accept=".pdf,.doc,.docx,.txt" 
                        onChange={handleDocumentUpload}
                        className="hidden"
                        id="documentUpload"
                      />
                      <Label htmlFor="documentUpload" className="cursor-pointer">
                        <Button type="button" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Documents
                        </Button>
                      </Label>
                    </div>
                                         {formData.knowledge_base.length > 0 && (
                       <div className="space-y-1">
                         {formData.knowledge_base.map((file, index) => (
                           <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                             <FileIcon className="w-4 h-4 text-gray-500" />
                             <span className="text-sm flex-1">{file}</span>
                             <Button 
                               type="button" 
                               variant="ghost" 
                               size="sm"
                               onClick={() => setFormData(prev => ({
                                 ...prev, 
                                 knowledge_base: prev.knowledge_base.filter((_, i) => i !== index)
                               }))}
                             >
                               ×
                             </Button>
                           </div>
                         ))}
                       </div>
                     )}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Collapsible Detailed Sections */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader 
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('detailedSections')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
                  {(aiSuggestions.keyFeatures.length > 0 || aiSuggestions.sellingPoints.length > 0) && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Ready
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  {collapsedSections.detailedSections ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CardHeader>
              {!collapsedSections.detailedSections && (
                <CardContent className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-900 mb-2">Optional but Recommended</h4>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                          These additional details will make your listing more comprehensive and help the AI provide 
                          better answers to potential buyers. You can fill these out now or add them later.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Property Features & Amenities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      Property Features & Amenities
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="interiorFeatures">Interior Features & Amenities</Label>
                        {aiSuggestions.keyFeatures.length > 0 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => applyAISuggestion('features')}
                            className="text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Add AI Suggestions
                          </Button>
                        )}
                      </div>
                      <Textarea id="interiorFeatures" name="interiorFeatures" value={formData.interiorFeatures.join('\n')} onChange={handleFeaturesChange} rows={4} placeholder="List key interior features and amenities..." />
                      {aiSuggestions.keyFeatures.length > 0 && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                          <strong>AI Suggestions:</strong>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {aiSuggestions.keyFeatures.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="keySellingPoints">Key Selling Points</Label>
                        {aiSuggestions.sellingPoints.length > 0 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => applyAISuggestion('sellingPoints')}
                            className="text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Add AI Suggestions
                          </Button>
                        )}
                      </div>
                      <Textarea id="keySellingPoints" name="keySellingPoints" value={formData.keySellingPoints.join('\n')} onChange={handleSellingPointsChange} rows={4} placeholder="List key selling points and unique features..." />
                      {aiSuggestions.sellingPoints.length > 0 && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                          <strong>AI Suggestions:</strong>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {aiSuggestions.sellingPoints.map((point, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Virtual Tours & Advanced Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary" />
                      Virtual Tours & Advanced Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floorPlanUrl">Floor Plan URL</Label>
                        <Input 
                          id="floorPlanUrl" 
                          name="floorPlanUrl" 
                          value={formData.floorPlanUrl} 
                          onChange={handleInputChange} 
                          placeholder="https://matterport.com/..." 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>3D Virtual Tour URLs</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => {
                          const url = prompt('Enter 3D virtual tour URL:');
                          if (url) {
                            setFormData(prev => ({ ...prev, virtualTourUrls: [...prev.virtualTourUrls, url] }));
                          }
                        }}>
                          <Video className="w-4 h-4 mr-2" />
                          Add Virtual Tour
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Property Highlights */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Property Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Key Selling Points</Label>
                          <div className="space-y-2">
                            {['Location', 'Price', 'Size', 'Condition', 'Schools', 'Transportation', 'Investment Potential', 'Lifestyle'].map(point => (
                              <label key={point} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  checked={formData.keySellingPoints.includes(point)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData(prev => ({ ...prev, keySellingPoints: [...prev.keySellingPoints, point] }));
                                    } else {
                                      setFormData(prev => ({ ...prev, keySellingPoints: prev.keySellingPoints.filter(p => p !== point) }));
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm">{point}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Unique Features</Label>
                          <div className="space-y-2">
                            {['Historic Character', 'Modern Design', 'Custom Built', 'Waterfront', 'Mountain Views', 'City Views', 'Large Lot', 'Privacy'].map(feature => (
                              <label key={feature} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  checked={formData.uniqueFeatures.includes(feature)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData(prev => ({ ...prev, uniqueFeatures: [...prev.uniqueFeatures, feature] }));
                                    } else {
                                      setFormData(prev => ({ ...prev, uniqueFeatures: prev.uniqueFeatures.filter(f => f !== feature) }));
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm">{feature}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Neighborhood Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Neighborhood Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schoolDistrict">School District</Label>
                        <Input id="schoolDistrict" name="schoolDistrict" value={formData.schoolDistrict} onChange={handleInputChange} placeholder="e.g., ABC Unified School District" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schoolRatings">School Ratings</Label>
                        <Input id="schoolRatings" name="schoolRatings" value={formData.schoolRatings} onChange={handleInputChange} placeholder="e.g., 9/10, 8/10, 9/10" />
                      </div>
                    </div>
                  </div>

                  {/* Financial & Market Data */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Financial & Market Data
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Purchase Price</Label>
                        <Input id="originalPrice" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="$450,000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rentalPotential">Monthly Rental Potential</Label>
                        <Input id="rentalPotential" name="rentalPotential" value={formData.rentalPotential} onChange={handleInputChange} placeholder="$2,500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualTaxes">Annual Property Taxes</Label>
                        <Input id="annualTaxes" name="annualTaxes" value={formData.annualTaxes} onChange={handleInputChange} placeholder="$4,200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hoaFees">HOA Fees (Monthly)</Label>
                        <Input id="hoaFees" name="hoaFees" value={formData.hoaFees} onChange={handleInputChange} placeholder="$150" />
                      </div>
                    </div>
                  </div>

                  {/* Showing Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Showing Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="showingInstructions">Showing Instructions</Label>
                      <Textarea id="showingInstructions" name="showingInstructions" value={formData.showingInstructions} onChange={handleInputChange} rows={3} placeholder="e.g., Call 24 hours in advance, use lockbox code 1234, remove shoes..." />
                    </div>
                  </div>

                  {/* Lead Generation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Lead Generation & Communication
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                        <Select value={formData.preferredContact} onValueChange={(value) => handleSelectChange('preferredContact', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred contact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Text">Text</SelectItem>
                            <SelectItem value="Any">Any Method</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responseTime">Response Time</Label>
                        <Select value={formData.responseTime} onValueChange={(value) => handleSelectChange('responseTime', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select response time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Within 1 hour">Within 1 hour</SelectItem>
                            <SelectItem value="Within 2 hours">Within 2 hours</SelectItem>
                            <SelectItem value="Same day">Same day</SelectItem>
                            <SelectItem value="Next business day">Next business day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={formSectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {isLoading && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-sm font-medium">
                          {isCreatingKnowledgeBase ? 'Creating AI Knowledge Base...' : 'Creating Listing...'}
                        </span>
                      </div>
                      {isCreatingKnowledgeBase && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <BrainCircuit className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">Setting up AI Assistant</h4>
                              <p className="text-sm text-blue-800">
                                Creating a comprehensive knowledge base so your AI chat and voice bots can answer 
                                detailed questions about this property. This will make your listing much more 
                                engaging for potential buyers!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <Progress value={isCreatingKnowledgeBase ? 75 : 25} className="w-full" />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        {isCreatingKnowledgeBase ? 'Setting up AI Assistant...' : 'Creating Listing...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Create Listing & AI Knowledge Base
                      </div>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Your listing will be saved with a comprehensive AI knowledge base that can answer 
                      detailed questions about the property, neighborhood, and showing information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-red-500 font-medium p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {error}
              </div>
            </motion.div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadListingPage;

