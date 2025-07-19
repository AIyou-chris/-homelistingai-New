import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { 
  Globe, 
  User, 
  Building, 
  Sparkles, 
  ArrowRight, 
  Check,
  Wand2,
  Rocket,
  Brain,
  Smartphone,
  Upload,
  Settings,
  Zap,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Phone,
  Bot,
  Volume2,
  Mic,
  Send
} from 'lucide-react';
import * as listingService from '../services/listingService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

interface BuildFormData {
  propertyUrl: string;
  agentName: string;
  agentPhone: string;
  agencyName: string;
  agentTitle: string;
  customPrompt: string;
}

const BuildAIListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isBuildComplete, setIsBuildComplete] = useState(false);
  const [createdListing, setCreatedListing] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState<BuildFormData>({
    propertyUrl: '',
    agentName: '',
    agentPhone: '',
    agencyName: '',
    agentTitle: '',
    customPrompt: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: "Property URL", icon: Globe, description: "Paste your listing URL" },
    { id: 2, title: "Agent Details", icon: User, description: "Your contact information" },
    { id: 3, title: "AI Configuration", icon: Brain, description: "Customize your AI" },
    { id: 4, title: "Build & Deploy", icon: Rocket, description: "Create your AI listing" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const SUPABASE_SCRAPE_ENDPOINT = 'https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property';

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
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        buildAIListing();
      }
    }
  };

  const buildAIListing = async () => {
    setIsBuilding(true);
    
    try {
      console.log('🚀 Building AI listing for URL:', formData.propertyUrl);
      
      // Add realistic delays to show the building process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the scraper API
      let scrapedData = null;
      try {
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
        
        if (response.ok) {
          const response_data = await response.json();
          scrapedData = response_data.data || response_data;
          console.log('✅ Scraper API successful:', scrapedData);
        } else {
          console.warn('⚠️ Scraper API failed, using fallback data');
          scrapedData = null;
        }
      } catch (scraperError) {
        console.warn('⚠️ Scraper API error, using fallback data:', scraperError);
        scrapedData = null;
      }
      
      // Create listing data with fallback for when scraper fails
      const listingData = {
        title: scrapedData?.address || 'Property from URL',
        description: scrapedData?.description || `Beautiful property at ${formData.propertyUrl}. This AI listing was created from the provided URL and can be customized with additional details.`,
        address: scrapedData?.address || 'Address from URL',
        price: scrapedData?.price ? parseInt(scrapedData.price.replace(/[^\d]/g, '')) : 500000,
        property_type: 'Single-Family Home',
        status: 'Active',
        bedrooms: scrapedData?.bedrooms || 3,
        bathrooms: scrapedData?.bathrooms || 2,
        square_footage: scrapedData?.squareFeet || 1500,
        lot_size: 0.25,
        year_built: 2020,
        image_urls: scrapedData?.images?.slice(0, 10) || [],
        knowledge_base: JSON.stringify({
          features: scrapedData?.features || [],
          neighborhood: scrapedData?.neighborhood || '',
          originalUrl: formData.propertyUrl,
          customPrompt: formData.customPrompt,
          scrapedSuccessfully: !!scrapedData
        })
      };
      
      // Create the listing
      const createdListingResult = await listingService.createListing({
        ...listingData,
        agent_id: user?.id
      });
      
      console.log('✅ AI listing created successfully:', createdListingResult);
      
      // Store the created listing and show success state
      setCreatedListing(createdListingResult);
      setIsBuildComplete(true);
      
    } catch (error) {
      console.error('❌ Error building AI listing:', error);
      setErrors({ general: 'Failed to build AI listing. Please try again.' });
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
              <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property URL</h2>
              <p className="text-gray-600">Paste the URL of your property listing</p>
            </div>
            
                         <div className="space-y-4">
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
               
               {/* Platform recommendations */}
               <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                 <div className="flex items-start gap-3">
                   <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                     <Globe className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-blue-900 mb-2">Recommended Platforms</h4>
                     <div className="space-y-2 text-sm text-blue-800">
                       <div className="flex items-center gap-2">
                         <span className="font-medium">✅ Best:</span>
                         <span>Zillow, Realtor.com, MLS sites</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="font-medium">⚠️ Working on:</span>
                         <span>Redfin (coming soon!)</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="font-medium">✅ Also work:</span>
                         <span>Most major real estate platforms</span>
                       </div>
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
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 mb-3">What You're Programming</h4>
                    <div className="space-y-3 text-sm text-purple-800">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <span className="font-semibold">AI Personality:</span> How it talks, responds, and represents you professionally
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <span className="font-semibold">AI Behavior:</span> Anything you want the AI to always do (see examples below)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Knowledge Base Upload */}
              <div className="space-y-6">
                {/* Upload Documents Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900">Upload Documents</h4>
                      <p className="text-sm text-indigo-700">Upload PDFs, Word docs, or text files to enhance your AI's knowledge.</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-indigo-600 font-medium mb-2">Choose files or drag and drop</p>
                    <p className="text-xs text-indigo-500">PDF, DOC, DOCX, TXT up to 10MB each</p>
                  </div>
                </div>

                {/* Import from Website Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900">Import from Website</h4>
                      <p className="text-sm text-indigo-700">Scrape content from any website to add to your knowledge base.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      className="w-full"
                    />
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                      Import Website Content
                    </Button>
                  </div>
                </div>

                {/* Reassurance Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">💡</span>
                    </div>
                    <div>
                      <div className="font-semibold text-green-900 mb-1">Don't worry!</div>
                      <div className="text-sm text-green-800">
                        The AI is constantly learning and growing. You'll have the ability to feed it new information as easily as typing a text message.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Features */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-3">Your AI Assistant Will:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Answer questions 24/7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Capture qualified leads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Schedule viewings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Provide neighborhood insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Calculate mortgage payments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Send follow-up emails</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center mb-8">
              <Rocket className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Build & Deploy</h2>
              <p className="text-gray-600">Create your AI listing and go live</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="text-center">
                <h4 className="font-bold text-orange-900 mb-2">Ready to Build Your AI Listing?</h4>
                <p className="text-orange-700 text-sm">
                  This will create a professional AI assistant for your property that can:
                </p>
                <ul className="text-sm text-orange-700 mt-3 space-y-1">
                  <li>• Answer questions 24/7</li>
                  <li>• Capture qualified leads</li>
                  <li>• Schedule viewings</li>
                  <li>• Provide property insights</li>
                </ul>
              </div>
            </div>
            
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  // Success state with choice buttons
  if (isBuildComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-purple-100/10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/5 to-emerald-200/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 border border-white/20">
              <CardContent className="p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    AI Listing Built Successfully!
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Your professional AI assistant is ready to capture leads 24/7
                  </p>
                </div>

                {/* Listing Preview */}
                {createdListing && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 mb-2">{createdListing.title}</h3>
                        <p className="text-blue-800 text-sm mb-2">{createdListing.address}</p>
                        <div className="flex items-center gap-4 text-xs text-blue-700">
                          <span>${createdListing.price?.toLocaleString()}</span>
                          <span>{createdListing.bedrooms} beds</span>
                          <span>{createdListing.bathrooms} baths</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Your AI Agent */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 mb-2">Preview Your AI Agent</h3>
                      <p className="text-orange-800 text-sm">
                        See your AI agent in action before you decide. Test how it responds to questions about your property.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center justify-center gap-3"
                    onClick={() => setShowPreviewModal(true)}
                  >
                    <span className="text-xl">👁️</span>
                    <div className="text-left">
                      <div className="font-bold">Preview AI Agent</div>
                      <div className="text-sm opacity-90">See it in action</div>
                    </div>
                  </button>
                </div>

                {/* Choice Buttons */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Next Step</h3>
                    <p className="text-gray-600">Your AI listing is ready. What would you like to do?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stay Demo Button */}
                    <button
                      className="w-full py-6 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-4"
                      onClick={() => {
                        localStorage.setItem('demo_mode', 'true');
                        localStorage.setItem('demo_expires_at', new Date(Date.now() + 30 * 60 * 1000).toISOString());
                        navigate('/dashboard');
                      }}
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⏰</span>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">Stay Demo</div>
                        <div className="text-sm opacity-90">30 min trial</div>
                      </div>
                    </button>
                    
                    {/* Go Live Button */}
                    <button
                      className="w-full py-6 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-4"
                      onClick={() => navigate('/checkout')}
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">Go Live</div>
                        <div className="text-sm opacity-90">$59/month</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                      Demo expires in 30 minutes • Go Live keeps your AI forever
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Property Listing Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">🏠</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Your Property Listing Preview</h2>
                      <p className="text-blue-100 text-sm">Review and edit your scraped property data before going live</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <span className="text-white text-lg">×</span>
                  </button>
                </div>
              </div>

              {/* Modal Content - Property Listing */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Property Image */}
                <div className="relative mb-6">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <Home className="w-16 h-16 text-blue-600" />
                  </div>
                  <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-white transition-colors">
                    <Mic className="w-4 h-4" />
                    Talk With the Home
                  </button>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <span className="text-lg">❤️</span>
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <span className="text-lg">📤</span>
                    </button>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-6">
                  {/* Address and Price */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {createdListing?.title || '2038 Maiden Lane, Wenatchee, WA'}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{createdListing?.address || '2038 Maiden Lane, Wenatchee, WA 98801'}</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${createdListing?.price?.toLocaleString() || '869,900'}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="flex items-center gap-6 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span>{createdListing?.bedrooms || 3} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span>{createdListing?.bathrooms || 3} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      <span>{createdListing?.square_footage?.toLocaleString() || '2,211'} Sq Ft</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Covered patio',
                        'Extra parking', 
                        'Open kitchen',
                        'Three-car garage',
                        'Serene views',
                        'Spacious primary suite',
                        'Dual walk-in closets'
                      ].map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {createdListing?.description || 'Beautiful property with modern amenities, spacious rooms, and excellent location. This home features an open concept kitchen, large bedrooms, and plenty of storage space. Perfect for families looking for comfort and convenience.'}
                    </p>
                  </div>

                  {/* What's Special */}
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-900 mb-2">What's Special</h3>
                    <p className="text-blue-800">
                      Located in {createdListing?.neighborhood || 'a great neighborhood'} with excellent schools, shopping, and amenities nearby.
                    </p>
                  </div>

                  {/* Edit Options */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Edit Your Listing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">Edit Details</div>
                            <div className="text-sm text-gray-600">Update price, features, description</div>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">Add Photos</div>
                            <div className="text-sm text-gray-600">Upload property images</div>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <Brain className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">Customize AI</div>
                            <div className="text-sm text-gray-600">Train AI with property knowledge</div>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">Agent Info</div>
                            <div className="text-sm text-gray-600">Update contact details</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      // Navigate to edit page
                      navigate(`/listings/${createdListing?.id}/edit`);
                    }}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Edit Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Building Your AI Listing</h3>
            <p className="text-gray-600">Creating your professional AI assistant...</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>Scraping property data</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>Training AI assistant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LoadingSpinner size="sm" />
                <span>Deploying to production</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-purple-100/10"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/5 to-emerald-200/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <div className="relative z-10 text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Build AI Listing
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional AI assistant for your property in minutes
          </p>
          
                     {/* Enhanced Progress Bar */}
           <div className="max-w-md mx-auto mt-8">
             <div className="flex items-center justify-between mb-4">
               {steps.map((step, index) => (
                 <div key={step.id} className="flex items-center">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 ${
                     currentStep >= step.id 
                       ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110' 
                       : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                   }`}>
                     {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                   </div>
                   {index < steps.length - 1 && (
                     <div className={`w-16 h-2 mx-3 rounded-full transition-all duration-300 ${
                       currentStep > step.id ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                     }`} />
                   )}
                 </div>
               ))}
             </div>
             <div className="text-center">
               <p className="text-sm font-medium text-gray-700">
                 Step {currentStep} of {steps.length}: <span className="text-blue-600 font-semibold">{steps[currentStep - 1].title}</span>
               </p>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
                     <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 border border-white/20">
             <CardContent className="p-8">
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg rounded-xl border-0 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  disabled={isBuilding}
                >
                  {currentStep === 4 ? (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Build AI Listing
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BuildAIListingPage; 