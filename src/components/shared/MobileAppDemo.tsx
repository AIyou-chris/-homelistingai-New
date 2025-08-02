import React, { useState } from 'react';
import { Listing } from '../../types';
import MobileListingApp from './MobileListingApp';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  Star,
  Zap,
  Eye,
  Settings,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileAppDemoProps {
  listing?: Listing;
  isPreview?: boolean;
  onClose?: () => void;
}

const MobileAppDemo: React.FC<MobileAppDemoProps> = ({ 
  listing,
  isPreview = false,
  onClose
}) => {
  const [selectedView, setSelectedView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showFeatures, setShowFeatures] = useState(false);

  // Use provided listing or demo listing
  const demoListing: Listing = listing || {
    id: 'demo-1',
    title: 'Beautiful 3-Bedroom Home in Prime Location',
    address: '123 Oak Street, Springfield, IL 62701',
    price: 475000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_footage: 1850,
    property_type: 'Single Family',
    description: 'Stunning 3-bedroom, 2.5-bathroom home featuring modern updates, hardwood floors, granite countertops, and a spacious backyard. Located in a highly sought-after neighborhood with excellent schools and amenities.',
    image_urls: [
      '/home1.jpg',
      '/home2.jpg',
      '/home3.jpg',
      '/home4.jpg',
      '/home5.jpg'
    ],
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
        comparables: true,
        financing: true,
        history: true,
        virtual: true,
        reports: true
      },
      lastUpdated: new Date().toISOString()
    }
  };

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobile-First Design',
      description: 'Optimized for mobile devices with touch-friendly interface'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Interactive Gallery',
      description: 'Swipe gestures, thumbnails, and smooth navigation'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Customizable Buttons',
      description: '12 different action buttons that can be toggled on/off'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Rich Modals',
      description: 'Detailed information for each feature with professional design'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smooth Animations',
      description: 'Framer Motion animations for premium user experience'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Production Ready',
      description: 'Ready for real estate agents and property listings'
    }
  ];

  const getPhoneFrameClass = () => {
    switch (selectedView) {
      case 'mobile':
        return 'w-[440px] h-[800px]';
      case 'tablet':
        return 'w-[500px] h-[900px]';
      case 'desktop':
        return 'w-[600px] h-[1000px]';
      default:
        return 'w-[440px] h-[800px]';
    }
  };

  const getPhoneFrameStyle = () => {
    switch (selectedView) {
      case 'mobile':
        return {
          borderRadius: '20px',
          padding: '0px',
          background: 'white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        };
      case 'tablet':
        return {
          borderRadius: '16px',
          padding: '0px',
          background: 'white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        };
      case 'desktop':
        return {
          borderRadius: '12px',
          padding: '0px',
          background: 'white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        };
      default:
        return {
          borderRadius: '20px',
          padding: '0px',
          background: 'white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mobile App Demo</h2>
            <p className="text-blue-100">Experience the mobile listing page</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Features Dropdown */}
              <AnimatePresence>
                {showFeatures && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">App Features</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                            <div className="text-blue-600 mt-1">
                              {feature.icon}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">{feature.title}</h5>
                              <p className="text-xs text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Device Selector */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setSelectedView('mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedView === 'mobile'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Mobile</span>
          </button>
          
          <button
            onClick={() => setSelectedView('tablet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedView === 'tablet'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="text-sm font-medium">Tablet</span>
          </button>
          
          <button
            onClick={() => setSelectedView('desktop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedView === 'desktop'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">Desktop</span>
          </button>
        </div>
      </div>

      {/* Features Panel */}
      {showFeatures && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-gray-200 px-6 py-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-blue-600 mt-1">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-center">
            {/* App Container */}
            <div 
              className={`${getPhoneFrameClass()} relative`}
              style={getPhoneFrameStyle()}
            >
              {/* Floating Close Button */}
              {isPreview && onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-full p-3 shadow-lg transition-all duration-200 border-2 border-gray-200"
                  aria-label="Close Preview"
                >
                  <X className="w-7 h-7" />
                </button>
              )}
              {/* App Screen */}
              <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <MobileListingApp 
                    property={{
                      id: demoListing.id,
                      title: demoListing.title,
                      address: demoListing.address,
                      price: demoListing.price,
                      bedrooms: demoListing.bedrooms,
                      bathrooms: demoListing.bathrooms,
                      squareFootage: demoListing.square_footage,
                      description: demoListing.description,
                      images: demoListing.image_urls,
                      agent: {
                        name: 'Sarah Johnson',
                        title: 'HomeListingAI Agent',
                        photo: '/realtor.png',
                        phone: '(555) 123-4567',
                        email: 'sarah@homelistingai.com'
                      },
                      mediaLinks: {
                        virtualTour: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        propertyVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        droneFootage: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        neighborhoodVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                      }
                    }}
                    onChatOpen={() => {}}
                    onScheduleShowing={() => {}}
                    onSaveListing={() => {}}
                    onContactAgent={() => {}}
                    onShareListing={() => {}}
                    onFeatureClick={() => {}}
                    isDemo={true}
                    isPreview={true}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Demo Instructions */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Instructions</h3>
            <div className="max-w-2xl mx-auto text-sm text-gray-600 space-y-2">
              <p>• <strong>Scroll</strong> through the listing to see all features</p>
              <p>• <strong>Tap</strong> on images to view the gallery</p>
              <p>• <strong>Click</strong> "Talk to the Home Now" to see AI chat</p>
              <p>• <strong>Explore</strong> property details, schools, and neighborhood info</p>
              <p>• <strong>Switch</strong> between Mobile, Tablet, and Desktop views above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDemo; 