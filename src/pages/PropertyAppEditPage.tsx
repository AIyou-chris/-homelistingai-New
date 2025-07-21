import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import VoiceBot from '@/components/shared/VoiceBot';
import { smartyService } from '@/services/smartyService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  X, 
  Plus, 
  GripVertical,
  Image as ImageIcon,
  User,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  FileText,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<SectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const PropertyAppEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Form states
  const [propertyData, setPropertyData] = useState({
    title: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    square_footage: 0,
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [agentData, setAgentData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    bio: '',
    headshot: null as File | null,
    logo: null as File | null,
    socialMedia: [
      { platform: 'facebook', url: '' },
      { platform: 'instagram', url: '' },
      { platform: 'twitter', url: '' },
      { platform: 'linkedin', url: '' },
      { platform: 'youtube', url: '' },
      { platform: 'tiktok', url: '' }
    ]
  });

  const [appSections, setAppSections] = useState([
    { id: 'gallery', title: 'Gallery', description: 'All photos', enabled: true, icon: 'fas fa-images', color: 'pink' },
    { id: 'neighborhood', title: 'Neighborhood', description: 'Local insights', enabled: true, icon: 'fas fa-map-marked-alt', color: 'purple' },
    { id: 'schools', title: 'Schools', description: 'Ratings & info', enabled: true, icon: 'fas fa-graduation-cap', color: 'blue' },
    { id: 'contact', title: 'Contact Agent', description: 'Direct line', enabled: true, icon: 'fas fa-phone', color: 'green' },
    { id: 'schedule', title: 'Schedule Tour', description: 'Private showing', enabled: true, icon: 'fas fa-calendar', color: 'orange' },
    { id: 'mortgage', title: 'Mortgage Calculator', description: 'Estimate payments', enabled: true, icon: 'fas fa-calculator', color: 'yellow' },
    { id: 'directions', title: 'Directions', description: 'Get directions', enabled: true, icon: 'fas fa-map-pin', color: 'blue' },
    { id: 'share', title: 'Share Listing', description: 'Share with friends', enabled: true, icon: 'fas fa-share', color: 'gray' },
    { id: 'property-data', title: 'Property Data', description: 'Get detailed property info', enabled: true, icon: 'fas fa-database', color: 'indigo' }
  ]);

  const [photos, setPhotos] = useState<string[]>([]);
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [showVoiceBot, setShowVoiceBot] = useState(false);
  
  // Modal states for different actions
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [showSchoolsModal, setShowSchoolsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMortgageModal, setShowMortgageModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPropertyDataModal, setShowPropertyDataModal] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
        setPropertyData({
          title: data?.title || '',
          price: data?.price || 0,
          bedrooms: data?.bedrooms || 0,
          bathrooms: data?.bathrooms || 0,
          square_footage: data?.square_footage || 0,
          description: data?.description || '',
          address: data?.address || '',
          city: data?.city || '',
          state: data?.state || '',
          zipCode: data?.zip_code || ''
        });
        setPhotos(data?.image_urls || []);
        
        // Load agent data if it exists (using type assertion for dynamic data)
        const listingData = data as any;
        if (listingData?.agent_data) {
          setAgentData({
            name: listingData.agent_data.name || '',
            phone: listingData.agent_data.phone || '',
            email: listingData.agent_data.email || '',
            website: listingData.agent_data.website || '',
            bio: listingData.agent_data.bio || '',
            headshot: null,
            logo: null,
            socialMedia: listingData.agent_data.social_media || [
              { platform: 'facebook', url: '' },
              { platform: 'instagram', url: '' },
              { platform: 'twitter', url: '' },
              { platform: 'linkedin', url: '' },
              { platform: 'youtube', url: '' },
              { platform: 'tiktok', url: '' }
            ]
          });
        }
      } catch (err) {
        console.error('Failed to fetch listing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handlePhotoDelete = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handlePhotoReorder = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, removed);
    setPhotos(newPhotos);
  };

  const handleSectionToggle = (sectionId: string) => {
    console.log('Toggling section:', sectionId);
    setAppSections(sections => {
      const updatedSections = sections.map(section =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      );
      console.log('Updated sections:', updatedSections);
      return updatedSections;
    });
  };

  // Debug effect to log appSections changes
  useEffect(() => {
    console.log('App sections changed:', appSections);
    console.log('Enabled sections:', appSections.filter(section => section.enabled));
    console.log('Total sections:', appSections.length);
    console.log('Enabled count:', appSections.filter(section => section.enabled).length);
  }, [appSections]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAppSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getSocialMediaIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'tiktok': return <Globe className="w-4 h-4" />; // Using Globe icon for TikTok
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getSocialMediaColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-600';
      case 'instagram': return 'bg-pink-600';
      case 'twitter': return 'bg-blue-400';
      case 'linkedin': return 'bg-blue-700';
      case 'youtube': return 'bg-red-600';
      case 'tiktok': return 'bg-black';
      default: return 'bg-gray-600';
    }
  };

  const handlePropertyDataClick = async () => {
    try {
      const address = `${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zipCode}`;
      alert(`Fetching property data for: ${address}`);
      
      const propertyDataResult = await smartyService.getPropertyData(address);
      
      const message = `
🏠 Property Data for ${propertyDataResult.address}:

📍 Location: ${propertyDataResult.city}, ${propertyDataResult.state} ${propertyDataResult.zipCode}
🏘️ Type: ${propertyDataResult.propertyType || 'N/A'}
📏 Size: ${propertyDataResult.squareFootage?.toLocaleString() || 'N/A'} sq ft
🏠 Built: ${propertyDataResult.yearBuilt || 'N/A'}
🛏️ Beds: ${propertyDataResult.bedrooms || 'N/A'}
🚿 Baths: ${propertyDataResult.bathrooms || 'N/A'}
💰 Estimated Value: $${propertyDataResult.estimatedValue?.toLocaleString() || 'N/A'}
📊 Last Sold: ${propertyDataResult.lastSoldDate || 'N/A'} for $${propertyDataResult.lastSoldPrice?.toLocaleString() || 'N/A'}
🏫 School District: ${propertyDataResult.schoolDistrict || 'N/A'}
🚶 Walk Score: ${propertyDataResult.walkScore || 'N/A'}
🚌 Transit Score: ${propertyDataResult.transitScore || 'N/A'}
      `.trim();
      
      alert(message);
    } catch (error) {
      console.error('Error fetching property data:', error);
      alert('Error fetching property data. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!id || !listing) return;
    
    try {
      setSaving(true);
      
      // Prepare the updated listing data
      const updatedListing = {
        ...listing,
        title: propertyData.title,
        price: propertyData.price,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        square_footage: propertyData.square_footage,
        description: propertyData.description,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip_code: propertyData.zipCode,
        image_urls: photos,
        // Add agent data and app configuration
        agent_data: {
          name: agentData.name,
          phone: agentData.phone,
          email: agentData.email,
          website: agentData.website,
          bio: agentData.bio,
          social_media: agentData.socialMedia
        },
        app_configuration: {
          sections: appSections,
          knowledge_base_files: knowledgeBaseFiles.map(file => file.name)
        }
      };
      
      await updateListing(id, updatedListing);
      
      // Show success message
      alert('Property updated successfully!');
      
      // Refresh the listing data
      const refreshedListing = await getListingById(id);
      setListing(refreshedListing);
      
    } catch (error) {
      console.error('Failed to save listing:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard/listings')}
          >
            ← Back to Listings
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('edit')}
            >
              Edit
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Panel */}
            <div className="space-y-6">
              {/* Hero Section */}
              <CollapsibleSection title="Hero Section (Photos & Gallery)" defaultOpen={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-800">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                    </div>
                  </div>

                  {/* Slider Controls */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slider Photos (First 3 shown in slider)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {photos.slice(0, 3).map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Slider Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-blue-500"
                          />
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Slider {index + 1}
                          </div>
                          <button
                            onClick={() => handlePhotoDelete(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {photos.length < 3 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Add photo for slider</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Photos (Showing first 20)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {photos.slice(0, 20).map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Gallery Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handlePhotoDelete(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {photos.length > 20 && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>{photos.length - 20} more photos</strong> available. 
                          Users can see all photos by contacting the agent.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* Property Information */}
              <CollapsibleSection title="Property Information" defaultOpen={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={propertyData.title}
                      onChange={(e) => setPropertyData({...propertyData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        value={propertyData.price}
                        onChange={(e) => setPropertyData({...propertyData, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
                      <input
                        type="number"
                        value={propertyData.square_footage}
                        onChange={(e) => setPropertyData({...propertyData, square_footage: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={propertyData.bedrooms}
                        onChange={(e) => setPropertyData({...propertyData, bedrooms: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={propertyData.bathrooms}
                        onChange={(e) => setPropertyData({...propertyData, bathrooms: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={propertyData.description}
                      onChange={(e) => setPropertyData({...propertyData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* App Section Configuration */}
              <CollapsibleSection title="App Section Configuration" defaultOpen={true}>
                <div className="space-y-3">
                  {appSections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${section.color}-100`}>
                          <i className={`${section.icon} text-${section.color}-600`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{section.title}</p>
                          <p className="text-sm text-gray-600">{section.description}</p>
                          <p className={`text-xs ${section.enabled ? 'text-green-600' : 'text-red-600'}`}>
                            {section.enabled ? '✓ Enabled' : '✗ Disabled'} (ID: {section.id})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            console.log('Toggle button clicked for:', section.id);
                            handleSectionToggle(section.id);
                          }}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            section.enabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            section.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Agent/Realtor Card */}
              <CollapsibleSection title="Agent/Realtor Card" defaultOpen={true}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={agentData.name}
                        onChange={(e) => setAgentData({...agentData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={agentData.phone}
                        onChange={(e) => setAgentData({...agentData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={agentData.email}
                        onChange={(e) => setAgentData({...agentData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={agentData.website}
                        onChange={(e) => setAgentData({...agentData, website: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={agentData.bio}
                      onChange={(e) => setAgentData({...agentData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headshot</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setAgentData({...agentData, headshot: e.target.files?.[0] || null})}
                          className="hidden"
                          id="headshot-upload"
                        />
                        <label htmlFor="headshot-upload" className="cursor-pointer">
                          <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-blue-600 hover:text-blue-800">Upload Headshot</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setAgentData({...agentData, logo: e.target.files?.[0] || null})}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-blue-600 hover:text-blue-800">Upload Logo</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                    <div className="space-y-2">
                      {agentData.socialMedia.map((social, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSocialMediaColor(social.platform)} text-white`}>
                            {getSocialMediaIcon(social.platform)}
                          </div>
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => {
                              const newSocial = [...agentData.socialMedia];
                              newSocial[index].url = e.target.value;
                              setAgentData({...agentData, socialMedia: newSocial});
                            }}
                            placeholder={`${social.platform} URL`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Knowledge Base Upload */}
              <CollapsibleSection title="Knowledge Base Upload" defaultOpen={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agent Knowledge Base</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setKnowledgeBaseFiles([...knowledgeBaseFiles, ...files]);
                        }}
                        className="hidden"
                        id="agent-kb-upload"
                      />
                      <label htmlFor="agent-kb-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-800">Upload Agent Files</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Knowledge Base</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setKnowledgeBaseFiles([...knowledgeBaseFiles, ...files]);
                        }}
                        className="hidden"
                        id="listing-kb-upload"
                      />
                      <label htmlFor="listing-kb-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-800">Upload Listing Files</span>
                      </label>
                    </div>
                  </div>

                  {knowledgeBaseFiles.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Files</label>
                      <div className="space-y-2">
                        {knowledgeBaseFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => setKnowledgeBaseFiles(files => files.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                </div>
                
                {/* Mobile App Preview */}
                <div className="max-w-sm mx-auto bg-white shadow-2xl rounded-t-3xl overflow-hidden">
                  {/* Hero Image */}
                  <div className="relative h-64 bg-gray-900">
                    {photos.length > 0 ? (
                      <img 
                        src={photos[0]} 
                        alt="Property" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Slider Indicators */}
                    {photos.length > 1 && (
                      <div className="absolute bottom-16 left-4 flex gap-1">
                        {photos.slice(0, 3).map((_, index) => (
                          <div key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                        ))}
                      </div>
                    )}
                    
                    {/* Talk With the Home Button */}
                    <div className="absolute bottom-4 left-4">
                      <button className="bg-black/90 backdrop-blur-xl text-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
                        <i className="fas fa-microphone text-xs"></i>
                        <span className="text-sm font-medium">Talk With the Home</span>
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{propertyData.title || 'Property Title'}</h2>
                      <p className="text-gray-600 flex items-center gap-1">
                        <i className="fas fa-map-marker-alt w-4 h-4"></i>
                        {propertyData.address || 'Property Address'}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        ${propertyData.price?.toLocaleString() || '0'}
                      </p>
                    </div>

                    {/* Property Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{propertyData.bedrooms}</p>
                        <p className="text-xs text-gray-600">Bedrooms</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{propertyData.bathrooms}</p>
                        <p className="text-xs text-gray-600">Bathrooms</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{propertyData.square_footage?.toLocaleString() || 'N/A'}</p>
                        <p className="text-xs text-gray-600">Sq Ft</p>
                      </div>
                    </div>

                    {/* Interactive Buttons Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {appSections.filter(section => section.enabled).map((section, index) => {
                        console.log(`Rendering button: ${section.id}, enabled: ${section.enabled}`);
                        return (
                          <button 
                            key={section.id}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(`Button clicked: ${section.id}`);
                              // Handle different button actions
                              switch(section.id) {
                                case 'gallery':
                                  setShowGalleryModal(true);
                                  break;
                                case 'neighborhood':
                                  setShowNeighborhoodModal(true);
                                  break;
                                case 'schools':
                                  setShowSchoolsModal(true);
                                  break;
                                case 'contact':
                                  setShowContactModal(true);
                                  break;
                                case 'schedule':
                                  setShowScheduleModal(true);
                                  break;
                                case 'mortgage':
                                  setShowMortgageModal(true);
                                  break;
                                case 'directions':
                                  setShowDirectionsModal(true);
                                  break;
                                case 'share':
                                  setShowShareModal(true);
                                  break;
                                case 'property-data':
                                  setShowPropertyDataModal(true);
                                  break;
                                default:
                                  alert(`Opening ${section.title}`);
                              }
                            }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                            style={{ pointerEvents: 'auto' }}
                          >
                                                      <div className={`flex items-center justify-center w-12 h-12 bg-${section.color}-100 rounded-lg mx-auto mb-3`}>
                              <i className={`${section.icon} text-${section.color}-600 text-xl`}></i>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {section.title === 'Gallery' ? `Gallery (${Math.min(photos.length, 10)})` : section.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {section.title === 'Gallery' && photos.length > 10 
                                ? `${Math.min(photos.length, 10)} photos • Contact agent for more`
                                : section.description
                              }
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Agent Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Listing Agent</h3>
                        <button 
                          onClick={() => setShowContactModal(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                        >
                          Contact
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{agentData.name || 'Agent Name'}</p>
                          <p className="text-sm text-gray-600">Real Estate Agent</p>
                          <div className="flex items-center gap-4 mt-1">
                            <button 
                              onClick={() => setShowContactModal(true)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              {agentData.phone || '(555) 123-4567'}
                            </button>
                            <button 
                              onClick={() => setShowContactModal(true)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                            >
                              <Mail className="w-3 h-3" />
                              Email
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="border-t border-gray-200 bg-white">
                    <div className="flex justify-around py-4">
                      <button 
                        onClick={() => alert('Navigating to Home')}
                        className="flex flex-col items-center text-blue-600 cursor-pointer"
                      >
                        <i className="fas fa-home w-5 h-5 mb-1"></i>
                        <span className="text-xs">Home</span>
                      </button>
                                              <button 
                          onClick={() => setShowContactModal(true)}
                          className="flex flex-col items-center text-gray-400 cursor-pointer"
                        >
                          <Phone className="w-5 h-5 mb-1" />
                          <span className="text-xs">Contact</span>
                        </button>
                        <button 
                          onClick={() => setShowScheduleModal(true)}
                          className="flex flex-col items-center text-gray-400 cursor-pointer"
                        >
                          <i className="fas fa-calendar w-5 h-5 mb-1"></i>
                          <span className="text-xs">Schedule</span>
                        </button>
                        <button 
                          onClick={() => setShowDirectionsModal(true)}
                          className="flex flex-col items-center text-gray-400 cursor-pointer"
                        >
                          <i className="fas fa-map-pin w-5 h-5 mb-1"></i>
                          <span className="text-xs">Directions</span>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-center">
              {/* Phone Frame */}
              <div className="relative">
                {/* Phone Body - iPhone 15 Pro Max dimensions */}
                <div className="w-[430px] h-[932px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20"></div>
                  {/* Phone Screen - 2868x1320 equivalent scaled down */}
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar - iPhone 15 Pro Max style */}
                    <div className="h-8 bg-black text-white text-xs flex items-center justify-between px-8 rounded-t-[2.5rem]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-3 bg-white rounded-sm"></div>
                        <div className="w-1 h-2 bg-white rounded-sm"></div>
                        <div className="w-1 h-2 bg-white rounded-sm"></div>
                        <div className="w-1 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="h-[calc(100%-32px)] overflow-y-auto pb-24">
                      {/* Sticky Header/Hero */}
                      <div className="sticky top-0 z-10">
                        <div className="relative h-56 bg-gray-900">
                          {photos.length > 0 ? (
                            <img 
                              src={photos[0]} 
                              alt="Property" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          
                          {/* Slider Indicators */}
                          {photos.length > 1 && (
                            <div className="absolute bottom-16 left-4 flex gap-1">
                              {photos.slice(0, 3).map((_, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                              ))}
                            </div>
                          )}
                          
                          {/* Talk With the Home Button */}
                          <div className="absolute bottom-4 left-4">
                            <button 
                              onClick={() => {
                                alert('Opening Voice Chat with the Home!');
                                setShowVoiceBot(true);
                              }}
                              className="bg-black/90 backdrop-blur-xl text-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-black/80 transition-colors"
                            >
                              <i className="fas fa-microphone text-xs"></i>
                              <span className="text-sm font-medium">Talk With the Home</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{propertyData.title || 'Property Title'}</h2>
                          <p className="text-gray-600 flex items-center gap-1">
                            <i className="fas fa-map-marker-alt w-4 h-4"></i>
                            {propertyData.address || 'Property Address'}
                          </p>
                          <p className="text-2xl font-bold text-green-600 mt-2">
                            ${propertyData.price?.toLocaleString() || '0'}
                          </p>
                        </div>

                        {/* Property Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-gray-900">{propertyData.bedrooms || 0}</p>
                            <p className="text-xs text-gray-600">Bedrooms</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">{propertyData.bathrooms}</p>
                            <p className="text-xs text-gray-600">Bathrooms</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">{propertyData.square_footage?.toLocaleString() || 'N/A'}</p>
                            <p className="text-xs text-gray-600">Sq Ft</p>
                          </div>
                        </div>

                        {/* Interactive Buttons Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          {appSections.filter(section => section.enabled).map((section, index) => {
                            console.log(`Phone preview rendering button: ${section.id}, enabled: ${section.enabled}`);
                            return (
                              <button 
                                key={section.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log(`Phone button clicked: ${section.id}`);
                                  // Handle different button actions
                                  switch(section.id) {
                                    case 'gallery':
                                      setShowGalleryModal(true);
                                      break;
                                    case 'neighborhood':
                                      setShowNeighborhoodModal(true);
                                      break;
                                    case 'schools':
                                      setShowSchoolsModal(true);
                                      break;
                                    case 'contact':
                                      setShowContactModal(true);
                                      break;
                                    case 'schedule':
                                      setShowScheduleModal(true);
                                      break;
                                    case 'mortgage':
                                      setShowMortgageModal(true);
                                      break;
                                    case 'directions':
                                      setShowDirectionsModal(true);
                                      break;
                                    case 'share':
                                      setShowShareModal(true);
                                      break;
                                                                      case 'property-data':
                                    setShowPropertyDataModal(true);
                                    break;
                                    default:
                                      alert(`Opening ${section.title}`);
                                  }
                                }}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md active:scale-95 transition-all duration-300 cursor-pointer select-none"
                                style={{ pointerEvents: 'auto' }}
                              >
                              <div className={`flex items-center justify-center w-12 h-12 bg-${section.color}-100 rounded-lg mx-auto mb-3`}>
                                <i className={`${section.icon} text-${section.color}-600 text-xl`}></i>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {section.title === 'Gallery' ? `Gallery (${Math.min(photos.length, 20)})` : section.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {section.title === 'Gallery' && photos.length > 20 
                                  ? `${Math.min(photos.length, 20)} photos • Contact agent for more`
                                  : section.description
                                }
                              </p>
                            </button>
                            );
                          })}
                        </div>

                        {/* Agent Card - Moved below buttons */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Listing Agent</h3>
                            <button 
                              onClick={() => setShowContactModal(true)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                            >
                              Contact
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{agentData.name || 'Agent Name'}</p>
                              <p className="text-sm text-gray-600">Real Estate Agent</p>
                              <div className="flex items-center gap-4 mt-1">
                                <button 
                                  onClick={() => setShowContactModal(true)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                                >
                                  <Phone className="w-3 h-3" />
                                  {agentData.phone || '(555) 123-4567'}
                                </button>
                                <button 
                                  onClick={() => setShowContactModal(true)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                                >
                                  <Mail className="w-3 h-3" />
                                  Email
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Chat Window - Embedded in content */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 pb-20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <i className="fas fa-robot text-white text-sm"></i>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">AI Assistant</p>
                                <p className="text-xs text-gray-500">Online</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                alert('Opening AI Voice Chat!');
                                setShowVoiceBot(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <i className="fas fa-comments text-lg"></i>
                            </button>
                          </div>
                          
                          {/* Chat Messages Area */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 min-h-[60px] max-h-[120px] overflow-y-auto">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-robot text-white text-xs"></i>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">Hi! I'm your AI assistant. Ask me anything about this property!</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Chat Input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.target as HTMLInputElement;
                                  if (target.value.trim()) {
                                    alert(`Sending message: "${target.value}"`);
                                    target.value = '';
                                  }
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  alert(`Sending message: "${input.value}"`);
                                  input.value = '';
                                }
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-colors"
                            >
                              <i className="fas fa-paper-plane text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                      <div className="flex justify-around py-4">
                        <button 
                          onClick={() => alert('Navigating to Home')}
                          className="flex flex-col items-center text-blue-600 cursor-pointer"
                        >
                          <i className="fas fa-home w-5 h-5 mb-1"></i>
                          <span className="text-xs">Home</span>
                        </button>
                        <button 
                          onClick={() => setShowContactModal(true)}
                          className="flex flex-col items-center text-gray-400 cursor-pointer"
                        >
                          <Phone className="w-5 h-5 mb-1" />
                          <span className="text-xs">Contact</span>
                        </button>
                        <button 
                          onClick={() => setShowScheduleModal(true)}
                          className="flex flex-col items-center text-gray-400 cursor-pointer"
                        >
                          <i className="fas fa-calendar w-5 h-5 mb-1"></i>
                          <span className="text-xs">Schedule</span>
                        </button>
                        <button 
                          onClick={() => setShowDirectionsModal(true)}
                          className="flex flex-col items-center text-gray-400 cursor-pointer"
                        >
                          <i className="fas fa-map-pin w-5 h-5 mb-1"></i>
                          <span className="text-xs">Directions</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Save Button for Mobile */}
      {activeTab === 'edit' && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-full w-14 h-14 p-0"
          >
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="w-6 h-6" />
            )}
          </Button>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Property Gallery</h3>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={photo} 
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Photo {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            {photos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No photos available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Neighborhood Modal */}
      {showNeighborhoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Neighborhood Insights</h3>
              <button
                onClick={() => setShowNeighborhoodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Walk Score</h4>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">85</span>
                  </div>
                  <div>
                    <p className="font-medium">Very Walkable</p>
                    <p className="text-sm text-gray-600">Most errands can be accomplished on foot</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Nearby Amenities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-utensils text-green-600"></i>
                    <span className="text-sm">Restaurants (12)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-shopping-bag text-green-600"></i>
                    <span className="text-sm">Shopping (8)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-green-600"></i>
                    <span className="text-sm">Schools (3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-park text-green-600"></i>
                    <span className="text-sm">Parks (2)</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Crime Rate</h4>
                <p className="text-sm text-gray-600">Low crime rate in this neighborhood</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schools Modal */}
      {showSchoolsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">School Information</h3>
              <button
                onClick={() => setShowSchoolsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Elementary School</h4>
                <p className="text-sm text-gray-600 mb-2">Washington Elementary School</p>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Rating: 8/10</span>
                  <span className="text-sm text-gray-500">0.3 miles away</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Middle School</h4>
                <p className="text-sm text-gray-600 mb-2">Lincoln Middle School</p>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Rating: 7/10</span>
                  <span className="text-sm text-gray-500">0.8 miles away</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">High School</h4>
                <p className="text-sm text-gray-600 mb-2">Wenatchee High School</p>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Rating: 8/10</span>
                  <span className="text-sm text-gray-500">1.2 miles away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact Agent</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{agentData.name || 'Agent Name'}</p>
                  <p className="text-sm text-gray-600">Real Estate Agent</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>{agentData.phone || '(555) 123-4567'}</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{agentData.email || 'agent@example.com'}</span>
                </button>
                {agentData.website && (
                  <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>{agentData.website}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule a Tour</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Schedule a private showing of this property with {agentData.name || 'your agent'}.</p>
              <div className="space-y-3">
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Select date"
                />
                <select className="w-full p-3 border rounded-lg">
                  <option>Select time</option>
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Schedule Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mortgage Modal */}
      {showMortgageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mortgage Calculator</h3>
              <button
                onClick={() => setShowMortgageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Home Price</label>
                  <input
                    type="number"
                    value={propertyData.price}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$879,900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Down Payment</label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="20%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Interest Rate</label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="6.5%"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Estimated Monthly Payment</h4>
                  <p className="text-2xl font-bold text-green-600">$4,250</p>
                  <p className="text-sm text-gray-600">Principal & Interest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Get Directions</h3>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Get directions to this property.</p>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <i className="fas fa-map text-blue-600"></i>
                  <span>Open in Google Maps</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <i className="fas fa-apple text-blue-600"></i>
                  <span>Open in Apple Maps</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <i className="fas fa-car text-blue-600"></i>
                  <span>Get Driving Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Data Modal */}
      {showPropertyDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Property Data</h3>
                <p className="text-gray-600">{propertyData.address || 'Property Address'}</p>
              </div>
              <button
                onClick={() => setShowPropertyDataModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Overview */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Property Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium">Single Family Home</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium">1995</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lot Size</span>
                      <span className="font-medium">0.25 acres</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Square Footage</span>
                      <span className="font-medium">{propertyData.square_footage?.toLocaleString() || '2,700'} sq ft</span>
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Property Features</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-bed text-green-600"></i>
                      <span className="text-sm">{propertyData.bedrooms || 4} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-bath text-green-600"></i>
                      <span className="text-sm">{propertyData.bathrooms || 3} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-car text-green-600"></i>
                      <span className="text-sm">2 Car Garage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-fire text-green-600"></i>
                      <span className="text-sm">Fireplace</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-tree text-green-600"></i>
                      <span className="text-sm">Mature Trees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-utensils text-green-600"></i>
                      <span className="text-sm">Updated Kitchen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Data */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">Market Data</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Value</span>
                      <span className="font-bold text-green-600">${propertyData.price?.toLocaleString() || '879,900'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price per Sq Ft</span>
                      <span className="font-medium">$326</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Sold</span>
                      <span className="font-medium">2018</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Days on Market</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>

                {/* Neighborhood Stats */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">Neighborhood Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">85</span>
                      </div>
                      <div>
                        <p className="font-medium">Walk Score</p>
                        <p className="text-xs text-gray-600">Very Walkable</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">78</span>
                      </div>
                      <div>
                        <p className="font-medium">Transit Score</p>
                        <p className="text-xs text-gray-600">Good Transit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">92</span>
                      </div>
                      <div>
                        <p className="font-medium">Bike Score</p>
                        <p className="text-xs text-gray-600">Biker's Paradise</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property History */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">Property History</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-red-400 pl-3">
                      <p className="font-medium">2018 - Sold</p>
                      <p className="text-sm text-gray-600">$650,000</p>
                    </div>
                    <div className="border-l-4 border-red-400 pl-3">
                      <p className="font-medium">2015 - Sold</p>
                      <p className="text-sm text-gray-600">$580,000</p>
                    </div>
                    <div className="border-l-4 border-red-400 pl-3">
                      <p className="font-medium">2012 - Sold</p>
                      <p className="text-sm text-gray-600">$520,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <i className="fas fa-download mr-2"></i>
                Download Report
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                <i className="fas fa-share mr-2"></i>
                Share Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Listing</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Share this property with friends and family.</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span>Facebook</span>
                </button>
                <button className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span>Twitter</span>
                </button>
                <button className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span>Email</span>
                </button>
                <button className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <i className="fas fa-link w-5 h-5 text-gray-600"></i>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Bot Modal */}
      {showVoiceBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Talk With the Home</h3>
              <button
                onClick={() => setShowVoiceBot(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VoiceBot open={showVoiceBot} setOpen={setShowVoiceBot} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyAppEditPage; 