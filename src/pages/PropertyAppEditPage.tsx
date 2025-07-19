import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  Phone, 
  Calendar, 
  MapPin, 
  Image, 
  School, 
  Calculator,
  Settings,
  Eye,
  Save,
  ArrowLeft
} from 'lucide-react';

interface AppSection {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  color: string;
  description: string;
}

const PropertyAppEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  
  // App sections configuration
  const [sections, setSections] = useState<AppSection[]>([
    {
      id: 'gallery',
      name: 'Gallery',
      icon: 'fas fa-images',
      enabled: true,
      color: 'pink',
      description: 'All photos'
    },
    {
      id: 'neighborhood',
      name: 'Neighborhood',
      icon: 'fas fa-map-marked-alt',
      enabled: true,
      color: 'purple',
      description: 'Local insights'
    },
    {
      id: 'schools',
      name: 'Schools',
      icon: 'fas fa-graduation-cap',
      enabled: true,
      color: 'indigo',
      description: 'Ratings & info'
    },
    {
      id: 'contact',
      name: 'Contact Agent',
      icon: 'fas fa-phone',
      enabled: true,
      color: 'green',
      description: 'Direct line'
    },
    {
      id: 'schedule',
      name: 'Schedule Tour',
      icon: 'fas fa-calendar-alt',
      enabled: true,
      color: 'orange',
      description: 'Private showing'
    },
    {
      id: 'mortgage',
      name: 'Mortgage Calculator',
      icon: 'fas fa-calculator',
      enabled: false,
      color: 'yellow',
      description: 'Estimate payments'
    },
    {
      id: 'directions',
      name: 'Directions',
      icon: 'fas fa-map-marker-alt',
      enabled: true,
      color: 'blue',
      description: 'Get directions'
    },
    {
      id: 'share',
      name: 'Share Listing',
      icon: 'fas fa-share',
      enabled: true,
      color: 'gray',
      description: 'Share with friends'
    }
  ]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    ));
  };

  const saveConfiguration = async () => {
    try {
      // Save the app configuration to the listing
      const config = {
        sections: sections,
        lastUpdated: new Date().toISOString()
      };
      
      // Store in localStorage for now (in real app, save to database)
      localStorage.setItem(`app-config-${id}`, JSON.stringify(config));
      
      alert('App configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (!listing) {
    return <div className="text-center text-red-500 mt-10">Listing not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/listings/${id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listing
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Property App</h1>
              <p className="text-sm text-gray-600">{listing.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button onClick={saveConfiguration}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  App Sections Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Customize which sections appear in your property app. Drag to reorder or toggle sections on/off.
                </p>
                
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${section.color}-100 flex items-center justify-center`}>
                        <i className={`${section.icon} text-${section.color}-600`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{section.name}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={section.enabled}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">App Title</label>
                  <Input 
                    defaultValue="Property App" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Primary Color</label>
                  <div className="flex gap-2 mt-1">
                    {['blue', 'green', 'purple', 'orange', 'pink'].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full bg-${color}-500 border-2 border-white shadow`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="sticky top-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-900 text-white">
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-50 h-[600px] overflow-y-auto">
                  {/* Property Header */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-200 to-purple-200">
                    <img 
                      src={listing.image_urls?.[0] || `https://via.placeholder.com/400x200/777/fff?text=${listing.title.split(' ').join('+')}`}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x200/777/fff?text=${listing.title.split(' ').join('+')}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Talk With the Home Button */}
                    <div className="absolute bottom-4 left-4">
                      <button className="bg-black/90 backdrop-blur-xl text-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
                        <i className="fas fa-microphone text-xs"></i>
                        <span className="text-sm font-medium">Talk With the Home</span>
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {listing.address}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        ${listing.price?.toLocaleString() || '0'}
                      </p>
                    </div>

                    {/* Property Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{listing.bedrooms}</p>
                        <p className="text-xs text-gray-600">Bedrooms</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{listing.bathrooms}</p>
                        <p className="text-xs text-gray-600">Bathrooms</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{listing.square_footage?.toLocaleString() || 'N/A'}</p>
                        <p className="text-xs text-gray-600">Sq Ft</p>
                      </div>
                    </div>

                    {/* Interactive Buttons Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {sections.filter(s => s.enabled).map((section) => (
                        <button
                          key={section.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className={`flex items-center justify-center w-12 h-12 bg-${section.color}-100 rounded-lg mx-auto mb-3`}>
                            <i className={`${section.icon} text-${section.color}-600 text-xl`}></i>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{section.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAppEditPage; 