import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Clock
} from 'lucide-react';

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
    try {
      // Call the live Supabase scraping API with ScraperAPI integration
      const res = await fetch(SUPABASE_SCRAPE_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
        },
        body: JSON.stringify({ url: formData.propertyUrl })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to scrape property');
      }
      
      const scraped = data.data;
      
      // Enhanced data handling with fallbacks
      const session: any = {
        id: generateSessionId(),
        propertyUrl: formData.propertyUrl,
        agentName: formData.agentName,
        agentPhone: formData.agentPhone,
        agencyName: formData.agencyName,
        propertyData: {
          title: scraped.address || 'Beautiful Property',
          price: scraped.price || 'Contact for pricing',
          bedrooms: scraped.bedrooms || 3,
          bathrooms: scraped.bathrooms || 2,
          sqft: scraped.squareFeet || 1500,
          description: scraped.description && scraped.description !== 'No description available'
            ? scraped.description
            : 'This stunning property offers modern amenities and a prime location. Contact us for more details and to schedule a viewing.',
          images: scraped.images && scraped.images.length > 0 ? scraped.images : ["/slider1.png", "/slider2.png", "/slider3.png"]
        },
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('anonymousSession', JSON.stringify(session));
      navigate('/card-trick-preview');
    } catch (err: any) {
      console.error('Scraping error:', err);
      // More user-friendly error handling
      const errorMessage = err.message.includes('Failed to scrape') 
        ? 'Unable to access this property listing. Please try a different URL or check if the listing is still available.'
        : 'Something went wrong. Please try again.';
      
      alert(errorMessage);
      setIsBuilding(false);
    }
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
          <motion.div 
            variants={buildingVariants}
            className="space-y-6 text-center"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Building Your AI Agent</h2>
              <p className="text-gray-600 text-lg">Analyzing your property and creating intelligent responses...</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Scraping property data...</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Training AI responses...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-700">Generating mobile app...</span>
                </div>
              </div>
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
            <h1 className="text-4xl font-bold text-gray-900">Build Your AI Agent</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional AI assistant for your listing in just 30 seconds
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
              
              {/* Actions */}
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
                    {currentStep === 3 ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Build My AI
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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