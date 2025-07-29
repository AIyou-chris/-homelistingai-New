import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing } from '../services/listingService';
import { Listing } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { 
  Camera,
  School,
  Video,
  Home,
  TreePine,
  Calendar,
  Settings,
  Eye,
  Save,
  ArrowLeft,
  Check,
  X,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { motion } from 'framer-motion';
import MobileListingDetailPage from './MobileListingDetailPage';

interface ButtonConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const BUTTON_CONFIGS: ButtonConfig[] = [
  {
    id: 'gallery',
    name: 'Gallery',
    icon: Camera,
    color: 'text-blue-600',
    description: 'Show all property photos in a lightbox gallery'
  },
  {
    id: 'schools',
    name: 'Schools',
    icon: School,
    color: 'text-green-600',
    description: 'Display local school information and ratings'
  },
  {
    id: 'video',
    name: 'Video Tour',
    icon: Video,
    color: 'text-purple-600',
    description: 'Show virtual walkthrough or video content'
  },
  {
    id: 'amenities',
    name: 'Amenities',
    icon: Home,
    color: 'text-orange-600',
    description: 'List property features and amenities'
  },
  {
    id: 'neighborhood',
    name: 'Neighborhood',
    icon: TreePine,
    color: 'text-green-600',
    description: 'Show local area information and attractions'
  },
  {
    id: 'schedule',
    name: 'Schedule',
    icon: Calendar,
    color: 'text-red-600',
    description: 'Book showings and appointments'
  },
  {
    id: 'map',
    name: 'Map',
    icon: MapPin,
    color: 'text-indigo-600',
    description: 'View property location and nearby amenities'
  },
  {
    id: 'comparables',
    name: 'Comparables',
    icon: TrendingUp,
    color: 'text-cyan-600',
    description: 'See similar properties and market analysis'
  },
  {
    id: 'financing',
    name: 'Financing',
    icon: DollarSign,
    color: 'text-emerald-600',
    description: 'Calculate payments and explore financing options'
  },
  {
    id: 'history',
    name: 'History',
    icon: Clock,
    color: 'text-amber-600',
    description: 'View property history and price changes'
  },
  {
    id: 'virtual',
    name: 'Virtual Tour',
    icon: Eye,
    color: 'text-violet-600',
    description: 'Interactive 3D virtual tour experience'
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: FileText,
    color: 'text-slate-600',
    description: 'Property reports and documentation'
  }
];

const MobileListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Button configuration state
  const [activeButtons, setActiveButtons] = useState({
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
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
        
        // Load saved button configuration if it exists
        if (data?.mobile_config) {
          try {
            const config = typeof data.mobile_config === 'string' 
              ? JSON.parse(data.mobile_config) 
              : data.mobile_config;
            setActiveButtons(config.activeButtons || activeButtons);
          } catch (e) {
            console.log('Using default button configuration');
          }
        }
      } catch (err) {
        console.error('Failed to fetch listing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleButtonToggle = (buttonId: string) => {
    setActiveButtons(prev => ({
      ...prev,
      [buttonId]: !prev[buttonId as keyof typeof prev]
    }));
  };

  const handleSave = async () => {
    if (!listing || !id) return;
    
    setSaving(true);
    try {
      const mobileConfig = {
        activeButtons,
        lastUpdated: new Date().toISOString()
      };

      await updateListing(id, {
        ...listing,
        mobile_config: mobileConfig
      });

      console.log('✅ Mobile configuration saved!');
      
      // Show success feedback
      setTimeout(() => {
        navigate(`/listings/${id}`);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Failed to save mobile configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const getActiveButtonCount = () => {
    return Object.values(activeButtons).filter(Boolean).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600">This listing doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`/listings/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mobile Layout Editor</h1>
              <p className="text-sm text-gray-600">Customize your mobile listing page</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide' : 'Preview'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Mode */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Mobile Preview</h2>
            <button 
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-full overflow-auto">
            <MobileListingDetailPage listing={listing} />
          </div>
        </div>
      )}

      {/* Edit Content */}
      <div className="p-4 space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Button Configuration</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{getActiveButtonCount()}</div>
              <div className="text-sm text-gray-600">Active Buttons</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{listing.title}</div>
              <div className="text-sm text-gray-600">Property</div>
            </div>
          </div>
        </div>

        {/* Button Configuration */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Action Buttons</h3>
            <p className="text-sm text-gray-600">
              Choose which buttons to display on your mobile listing page. You can have up to 6 buttons.
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {BUTTON_CONFIGS.map((config) => {
              const Icon = config.icon;
              const isActive = activeButtons[config.id as keyof typeof activeButtons];
              
              return (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white' : 'bg-gray-200'}`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{config.name}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => handleButtonToggle(config.id)}
                      className="ml-4"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Additional Settings</h3>
            <p className="text-sm text-gray-600">
              Configure additional mobile layout options
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Auto-play Image Slider</h4>
                <p className="text-sm text-gray-600">Automatically cycle through property photos</p>
              </div>
              <Switch checked={false} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Show Price History</h4>
                <p className="text-sm text-gray-600">Display property price changes over time</p>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Enable Voice Chat</h4>
                <p className="text-sm text-gray-600">Allow voice interactions with AI assistant</p>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Save Changes</h3>
              <p className="text-sm text-gray-600">
                Your mobile layout will be updated immediately
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Layout
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileListingEditPage; 