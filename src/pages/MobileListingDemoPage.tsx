import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import MobileListingDetailPage from './MobileListingDetailPage';
import {
  ArrowLeft,
  Play,
  Settings,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const MobileListingDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showFeatures, setShowFeatures] = useState(false);

  // Sample listing data for demo
  const demoListing: Listing = {
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

  const getViewportClass = () => {
    switch (selectedView) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-md mx-auto';
      case 'desktop':
        return 'max-w-lg mx-auto';
      default:
        return 'max-w-sm mx-auto';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mobile Listing Demo</h1>
              <p className="text-sm text-gray-600">Experience the mobile listing page</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowFeatures(!showFeatures)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Features
          </Button>
        </div>
      </div>

      {/* Device Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setSelectedView('mobile')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
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
          className="bg-white border-b border-gray-200 px-4 py-6"
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

      {/* Demo Content */}
      <div className="p-4">
        <div className={`${getViewportClass()} bg-white rounded-xl shadow-lg overflow-hidden`}>
          <div className="relative">
            {/* Device Frame */}
            <div className="relative">
              <MobileListingDetailPage listing={demoListing} />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="px-4 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Instructions</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p><strong>Gallery:</strong> Click the Gallery button to see the enhanced photo viewer with swipe gestures and thumbnails</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p><strong>Schools:</strong> View detailed school information with ratings, enrollment, and programs</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p><strong>Map:</strong> See property location with Google Maps integration</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p><strong>Comparables:</strong> View market analysis and recent sales data</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p><strong>Financing:</strong> Calculate payments and explore financing options</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p><strong>Chat:</strong> Click "Talk to the Home" buttons to test the AI chat integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Integration Info */}
      <div className="px-4 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Integration Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Google Maps API</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">School Data API</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Ready to Integrate</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">ATTOM Data API</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active (Real Data)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Walk Score API</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Chat/Voice Integration</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-xs text-green-800">
                <strong>✅ APIs Active:</strong> Google Maps, Walk Score, and ATTOM Data APIs are now integrated and using real data! All property information, comparables, schools, and neighborhood data are live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileListingDemoPage; 