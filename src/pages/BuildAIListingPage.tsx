import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  User, 
  Brain, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Phone,
  Mail,
  Mic,
  MapPin,
  AlertCircle,
  Upload,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import * as listingService from '../services/listingService';
import * as agentService from '../services/agentService';
import { scrapeZillowWorking } from '../services/workingZillowScraper';
import { scrapeUniversalListing } from '../services/universalRealEstateScraper';

interface BuildFormData {
  propertyUrl: string;
  agentName: string;
  agentPhone: string;
  agencyName: string;
  agentTitle: string;
  customPrompt: string;
  terms: boolean; // Added terms checkbox state
}

const BuildAIListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isBuilding, setIsBuilding] = useState(false);
  const [createdListing, setCreatedListing] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  
  const [formData, setFormData] = useState<BuildFormData>({
    propertyUrl: '',
    agentName: '',
    agentPhone: '',
    agencyName: '',
    agentTitle: '',
    customPrompt: '',
    terms: false // Initialize terms to false
  });

  const SUPABASE_SCRAPE_ENDPOINT = 'https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property';

  // Only check authentication when trying to save the listing (step 5)
  // Allow demo users to go through the build process

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    console.log('🔍 TEST - handleNext called, currentStep:', currentStep);
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        console.log('🔍 TEST - Moving to next step');
        setCurrentStep(currentStep + 1);
      } else if (currentStep === 4) {
        console.log('🔍 TEST - Starting buildAIListing');
        buildAIListing();
      }
      // For step 5 (preview), handleNext is not called - user clicks buttons instead
    }
  };

  const buildAIListing = async () => {
    setIsBuilding(true);
    
    try {
      console.log('🚀 TEST LOG - Building AI listing for URL:', formData.propertyUrl);
      console.log('🚀 TEST LOG - This should appear in console');
      
      // Add realistic delays to show the building process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
              // Use Supabase scraping function for better results
        let scrapedData = null;
        try {
          console.log('🔍 Using Supabase scraper for URL:', formData.propertyUrl);
          
                  // Try universal scraper first (handles multiple sites)
        console.log('🌐 Trying universal scraper...');
        scrapedData = await scrapeUniversalListing(formData.propertyUrl);
        
        if (!scrapedData) {
          console.log('❌ Universal scraper failed, trying Supabase...');
          
          // Fallback to Supabase scraping function
          const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
            },
            body: JSON.stringify({
              url: formData.propertyUrl
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Supabase scraper response:', result);
            
            if (result.data) {
              scrapedData = {
                address: result.data.address || 'Address not available',
                price: result.data.price || 'Price not available', 
                bedrooms: result.data.bedrooms || 0,
                bathrooms: result.data.bathrooms || 0,
                squareFeet: result.data.squareFeet || result.data.square_feet || 0,
                description: result.data.description || 'No description available',
                features: result.data.features || [],
                neighborhood: result.data.neighborhood || 'Neighborhood not specified',
                images: result.data.images || [],
                listingUrl: formData.propertyUrl,
                yearBuilt: result.data.yearBuilt || result.data.year_built,
                lotSize: result.data.lotSize || result.data.lot_size,
                propertyType: result.data.propertyType || result.data.property_type,
                agentName: result.data.agentName || result.data.agent_name,
                agentCompany: result.data.agentCompany || result.data.agent_company
              };
            }
          } else {
            console.log('❌ Supabase scraper failed, trying Zillow fallback...');
            scrapedData = await scrapeZillowWorking(formData.propertyUrl);
          }
        }
        
        console.log('✅ Apify scraping successful:', scrapedData);
        console.log('✅ Address:', scrapedData?.address);
        console.log('✅ Price:', scrapedData?.price);
        console.log('✅ Bedrooms:', scrapedData?.bedrooms);
        console.log('✅ Bathrooms:', scrapedData?.bathrooms);
        console.log('✅ Square Feet:', scrapedData?.squareFeet);
        console.log('✅ Images found:', scrapedData?.images?.length || 0);
        console.log('📸 Photo debug - scrapedData.images:', scrapedData?.images);
        console.log('✅ Features:', scrapedData?.features);
        console.log('✅ Description:', scrapedData?.description);
      } catch (scraperError) {
        console.warn('⚠️ Apify scraping failed, using fallback data:', scraperError);
        console.error('❌ Full error details:', scraperError);
        scrapedData = null;
      }
      
      // Create listing data with fallback for when scraper fails
      const listingData = {
        title: scrapedData?.address || 'Property from URL',
        description: scrapedData?.description || `Beautiful property at ${formData.propertyUrl}. This AI listing was created from the provided URL and can be customized with additional details.`,
        address: scrapedData?.address || 'Address from URL',
        city: scrapedData?.address?.split(', ')[1]?.split(' ')[0] || scrapedData?.address?.split(', ')[1] || 'Unknown',
        price: scrapedData?.price && typeof scrapedData.price === 'string' && scrapedData.price !== 'Price not available' ? parseInt(scrapedData.price.replace(/[^\d]/g, '')) : 500000,
        property_type: 'Single-Family Home',
        status: 'Active',
        bedrooms: scrapedData?.bedrooms || 3,
        bathrooms: scrapedData?.bathrooms || 2,
        square_footage: scrapedData?.squareFeet || 1500,
        lot_size: typeof scrapedData?.lotSize === 'string' ? parseFloat(scrapedData.lotSize) : (scrapedData?.lotSize || 0.25),
        year_built: scrapedData?.yearBuilt || 2020,
        image_urls: (() => {
          console.log('📸 Photo debug - scrapedData.images before filter:', scrapedData?.images);
          const filteredImages = (scrapedData?.images || []).filter((url: string) => 
            url.includes('photos.zillowstatic.com') && 
            !url.includes('badge') && 
            !url.includes('footer') &&
            !url.includes('app-store') &&
            !url.includes('google-play')
          ).slice(0, 10);
          console.log('📸 Photo debug - filtered images:', filteredImages);
          return filteredImages;
        })(),
        knowledge_base: JSON.stringify({
          features: scrapedData?.features || [],
          neighborhood: scrapedData?.neighborhood || '',
          originalUrl: formData.propertyUrl,
          agentInfo: {
            name: formData.agentName,
            phone: formData.agentPhone,
            agency: formData.agencyName,
            title: formData.agentTitle
          },
          customPrompt: formData.customPrompt,
          scrapedSuccessfully: !!scrapedData,
          scrapedPrice: scrapedData?.price || 'Price not available',
          scrapedAddress: scrapedData?.address || 'Address not available',
          scrapedDescription: scrapedData?.description || 'No description available',
          scrapedAgent: '',
          scrapedCompany: ''
        })
      };
      
      // Create the listing - handle demo users
      let createdListingResult;
      if (isAuthenticated && user?.id) {
        // Real user - create actual listing
        createdListingResult = await listingService.createListing({
          ...listingData,
          agent_id: user.id
        });
        
        // Save agent information to user profile
        try {
          const agentProfileData = {
            first_name: formData.agentName.split(' ')[0] || formData.agentName,
            last_name: formData.agentName.split(' ').slice(1).join(' ') || '',
            phone: formData.agentPhone,
            company_name: formData.agencyName,
            bio: `${formData.agentTitle} at ${formData.agencyName}`,
            website: ''
          };
          
          // Save agent information to user profile
          await agentService.updateAgentProfile(user.id, agentProfileData);
          console.log('✅ Agent profile updated with build data');
        } catch (profileError) {
          console.warn('⚠️ Could not update agent profile:', profileError);
          // Don't fail the listing creation if profile update fails
        }
      } else {
        // Demo user - create temporary listing for preview
        createdListingResult = {
          id: `demo-${Date.now()}`,
          ...listingData,
          agent_id: 'demo',
          is_demo: true
        };
      }
      
      console.log('✅ AI listing created successfully:', createdListingResult);
      
      // Store the created listing and show preview
      setCreatedListing(createdListingResult);
      setCurrentStep(5); // Show preview step
      
    } catch (error) {
      console.error('❌ Error building AI listing:', error);
      setErrors({ general: 'Failed to build AI listing. Please try again.' });
      // Error handling without toast
    } finally {
      setIsBuilding(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property URL</h2>
              <p className="text-gray-600">Paste the URL of an existing listing to get started</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="propertyUrl" className="text-sm font-medium text-gray-700">
                  Property Listing URL
                </Label>
                <Input
                  id="propertyUrl"
                  name="propertyUrl"
                  type="url"
                  placeholder="https://www.zillow.com/homedetails/..."
                  value={formData.propertyUrl}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.propertyUrl ? 'border-red-500' : ''}`}
                />
                {errors.propertyUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.propertyUrl}</p>
                )}
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Legal Disclaimer */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-3">Important Legal Notice</h4>
                    <div className="space-y-2 text-sm text-amber-800 leading-relaxed">
                      <p><strong>AI-Generated Content:</strong> AI-generated descriptions and marketing materials should be reviewed by licensed professionals before use. We do not guarantee accuracy, completeness, or compliance with real estate regulations.</p>
                      <p><strong>Content Responsibility:</strong> You are responsible for ensuring all scraped content complies with copyright laws, fair housing regulations, MLS rules, and local real estate laws.</p>
                      <p><strong>Professional Advice:</strong> This tool assists with marketing but does not replace professional legal, financial, or real estate advice.</p>
                      <p><strong>Data Usage:</strong> Scraped content may be used to improve our AI systems. You retain ownership but grant us license for service improvement.</p>
                      <p><strong>Compliance Requirements:</strong> Users must ensure compliance with local MLS rules, fair housing laws, and agent licensing requirements.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* What happens when you paste the URL */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">What happens when you paste the URL?</h4>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>AI scrapes property details, photos, and features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Creates a professional listing with your agent info</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Trains an AI assistant that knows everything about this property</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Deploys a 24/7 lead-capturing AI agent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reassuring message */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Don't worry about perfection!</h4>
                    <p className="text-sm text-orange-800 leading-relaxed">
                      We do all the heavy lifting to get your AI listing started. Even though we try our best, 
                      sometimes we might miss a detail or two. But don't worry - you can add, delete, and edit 
                      absolutely everything in your dashboard later. This is just the beginning!
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer">
                      I agree to the Terms and Conditions
                    </label>
                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                      <p>• I understand that AI-generated content requires professional review</p>
                      <p>• I am responsible for compliance with real estate laws and regulations</p>
                      <p>• I have rights to use the content from the provided URL</p>
                      <p>• I understand this tool does not replace professional advice</p>
                      <p>• I agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Details</h2>
              <p className="text-gray-600">Your contact information for the AI listing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agentName" className="text-sm font-medium text-gray-700">
                  Your Name
                </Label>
                <Input
                  id="agentName"
                  name="agentName"
                  placeholder="John Smith"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.agentName ? 'border-red-500' : ''}`}
                />
                {errors.agentName && (
                  <p className="text-red-500 text-sm mt-1">{errors.agentName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="agentTitle" className="text-sm font-medium text-gray-700">
                  Your Title
                </Label>
                <Input
                  id="agentTitle"
                  name="agentTitle"
                  placeholder="Senior Real Estate Agent"
                  value={formData.agentTitle}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.agentTitle ? 'border-red-500' : ''}`}
                />
                {errors.agentTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.agentTitle}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="agencyName" className="text-sm font-medium text-gray-700">
                  Agency Name
                </Label>
                <Input
                  id="agencyName"
                  name="agencyName"
                  placeholder="Smith Real Estate Group"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.agencyName ? 'border-red-500' : ''}`}
                />
                {errors.agencyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.agencyName}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="agentPhone" className="text-sm font-medium text-gray-700">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="agentPhone"
                  name="agentPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.agentPhone}
                  onChange={(e) => {
                    // Format phone number as user types
                    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                    if (value.length > 0) {
                      if (value.length <= 3) {
                        value = `(${value}`;
                      } else if (value.length <= 6) {
                        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                      } else {
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                      }
                    }
                    // Update the form data directly
                    setFormData(prev => ({ ...prev, agentPhone: value }));
                  }}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: (555) 123-4567
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Program Your AI Assistant
              </h2>
              <p className="text-gray-600">Teach your AI how to represent you and your property</p>
            </div>
            
            <div className="space-y-6">
              {/* What you're programming */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-3">What You're Programming</h4>
                    <div className="space-y-3 text-sm text-purple-800">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <span className="font-semibold">AI Personality:</span>
                          <span> How it talks, responds, and represents you professionally</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <span className="font-semibold">AI Behavior:</span>
                          <span> Anything you want the AI to always do (see examples below)</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pro Tip */}
                    <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="text-purple-600 text-sm">💡</div>
                        <div className="text-xs text-purple-700">
                          <span className="font-medium">Pro tip:</span> You can also edit AI personality and upload documents in your dashboard anytime!
                        </div>
                      </div>
                    </div>
                    
                    {/* Example */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="text-blue-600 text-sm">✨</div>
                        <div className="text-xs text-blue-700">
                          <span className="font-medium">Easy Personality Example:</span>
                          <br />
                          "Always be warm and professional, mention your 10+ years of experience, emphasize luxury properties"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Upload Documents */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Upload Documents</h4>
                    <p className="text-sm text-blue-800 mb-4">
                      Upload PDFs, Word docs, or text files to enhance your AI's knowledge.
                    </p>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                      <div className="text-blue-600 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-blue-600">Drag and drop files here, or click to browse</p>
                      <p className="text-xs text-blue-500 mt-1">Supports PDF, DOC, DOCX, TXT</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Custom AI Instructions */}
              <div>
                <Label htmlFor="customPrompt" className="text-sm font-medium text-gray-700">
                  Custom AI Instructions (Optional)
                </Label>
                <Textarea
                  id="customPrompt"
                  name="customPrompt"
                  placeholder="Example: Always mention the mountain views, emphasize the chef's kitchen, mention the wine cellar as a unique feature..."
                  value={formData.customPrompt}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tell your AI how to talk about this property. What should it emphasize?
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Build & Deploy
              </h2>
              <p className="text-gray-600">Create your AI listing and go live</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900 mb-3">Ready to Build Your AI Listing?</h4>
                  <p className="text-sm text-orange-800 mb-4">
                    This will create a professional AI assistant for your property that can:
                  </p>
                  <div className="space-y-2 text-sm text-orange-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Answer questions 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Capture qualified leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Schedule viewings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Provide property insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900 mb-2">Build Failed</h4>
                  <p className="text-red-800 text-sm mb-4">{errors.general}</p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      setErrors({});
                      buildAIListing();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-red-50 text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/upload-listing')}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-gray-400"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Manual Build
                  </Button>
                  
                  <p className="text-xs text-gray-600 text-center mt-3">
                    Manual build lets you enter all details yourself and upload photos
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );
      
      case 5:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Preview Your AI Listing
              </h2>
              <p className="text-gray-600">See how your AI listing will look to potential buyers</p>
            </div>
            
            {createdListing && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Mobile App Preview */}
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="mx-auto w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="h-8 bg-gray-100 flex items-center justify-between px-6 text-xs">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* App Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                        <div className="flex items-center justify-between text-white">
                          <div>
                            <h3 className="font-bold text-lg">HomeListingAI</h3>
                            <p className="text-sm opacity-90">AI Property Assistant</p>
                          </div>
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Brain className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Property Images */}
                      <div className="relative h-48 bg-gray-200">
                        {createdListing.image_urls && createdListing.image_urls.length > 0 ? (
                          <img 
                            src={createdListing.image_urls[0]} 
                            alt="Property"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                <MapPin className="w-6 h-6" />
                              </div>
                              <p className="text-sm">Property Image</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-sm font-bold text-gray-900">
                            {createdListing.price ? `$${createdListing.price.toLocaleString()}` : '$500,000'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Property Details */}
                      <div className="p-4 space-y-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-1">
                            {createdListing.title || 'Beautiful Property'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {createdListing.address || 'Address from listing'}
                          </p>
                        </div>
                        
                        {/* Property Stats */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">🛏️</span>
                            </div>
                            <span className="text-gray-700">{createdListing.bedrooms || 3} beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-green-600">🚿</span>
                            </div>
                            <span className="text-gray-700">{createdListing.bathrooms || 2} baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-600">📏</span>
                            </div>
                            <span className="text-gray-700">{createdListing.square_footage || 1500} sqft</span>
                          </div>
                        </div>
                        
                        {/* AI Chat Preview */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <Brain className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">AI Assistant</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            "Hi! I'm your AI assistant for this property. I can answer questions about features, schedule viewings, and help you learn more about this beautiful home. What would you like to know?"
                          </p>
                        </div>
                        
                        {/* Agent Info */}
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Your Agent</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <p className="font-medium text-gray-900">{formData.agentName || 'Agent Name'}</p>
                            <p className="text-gray-600">{formData.agentTitle || 'Real Estate Agent'}</p>
                            <p className="text-gray-600">{formData.agencyName || 'Real Estate Agency'}</p>
                            <p className="text-blue-600 font-medium">{formData.agentPhone || '(555) 123-4567'}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg">
                            Chat with AI
                          </button>
                          <button className="flex-1 bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg">
                            Schedule Viewing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Preview Actions */}
                <div className="p-6 bg-gray-50">
                  <div className="flex gap-3 mb-3">
                    <Button 
                      onClick={() => {
                        if (createdListing.is_demo) {
                          navigate(`/listings/${createdListing.id}/demo`);
                        } else {
                          navigate(`/listings/${createdListing.id}/demo`);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try Demo Mode
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        navigate('/demo-dashboard');
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Edit in Dashboard
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Preview shows how your AI listing will appear to potential buyers.<br/>
                    Edit in your dashboard to customize, then click "Go Live" to start collecting leads!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (isBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-12 text-center">
            {/* Animated Magic Circle */}
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 w-20 h-20 border-2 border-purple-400 border-b-transparent rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🪄 Building Your AI Listing
              </h3>
              <p className="text-lg text-gray-600 mb-2">
                Creating your professional AI assistant...
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This can take up to 60 seconds
              </p>
            </motion.div>

            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 text-sm text-gray-600 justify-center"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span>Scraping property data</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-3 text-sm text-gray-600 justify-center"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span>Training AI with property details</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-3 text-sm text-gray-600 justify-center"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span>Setting up your agent profile</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
                className="flex items-center gap-3 text-sm text-gray-600 justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span>Preparing your listing preview...</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="mt-8 p-4 bg-blue-50 rounded-lg"
            >
              <p className="text-xs text-blue-700 font-medium">
                💡 Pro Tip: Your AI assistant will be able to answer questions about the property, schedule viewings, and capture leads 24/7!
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Build AI Listing</h1>
          </div>
          <p className="text-lg text-gray-600">
            Create a professional AI assistant for your property in minutes
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Step {currentStep} of 5: {
                currentStep === 1 ? 'Property URL' :
                currentStep === 2 ? 'Agent Details' :
                currentStep === 3 ? 'AI Configuration' :
                currentStep === 4 ? 'Build & Deploy' :
                'Preview'
              }
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        {currentStep !== 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-between items-center mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isBuilding}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep === 4 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Build AI Listing
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuildAIListingPage; 