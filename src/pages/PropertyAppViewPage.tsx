import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NeighborhoodModal from '@/components/shared/NeighborhoodModal';
import SchoolsModal from '@/components/shared/SchoolsModal';
import ContactAgentModal from '@/components/shared/ContactAgentModal';
import { 
  Home, 
  Phone, 
  Calendar, 
  MapPin, 
  Heart, 
  Share,
  ArrowLeft,
  Settings,
  Edit,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Download,
  User,
  Mail
} from 'lucide-react';

const PropertyAppViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // App sections state
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Enhanced gallery state
  const [fullscreenGallery, setFullscreenGallery] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [galleryLoading, setGalleryLoading] = useState(false);

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

  // Enhanced gallery functions
  const openFullscreenGallery = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenGallery(true);
  };

  const closeFullscreenGallery = () => {
    setFullscreenGallery(false);
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    if (!listing?.image_urls) return;
    
    if (direction === 'prev') {
      setFullscreenIndex(prev => 
        prev === 0 ? listing.image_urls.length - 1 : prev - 1
      );
    } else {
      setFullscreenIndex(prev => 
        prev === listing.image_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!fullscreenGallery) return;
    
    switch (e.key) {
      case 'Escape':
        closeFullscreenGallery();
        break;
      case 'ArrowLeft':
        navigateGallery('prev');
        break;
      case 'ArrowRight':
        navigateGallery('next');
        break;
    }
  };

  useEffect(() => {
    if (fullscreenGallery) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [fullscreenGallery]);

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
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/listings/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listing
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/listings/app-edit/${id}`)}
            >
              <Settings className="w-4 h-4 mr-2" />
              App Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-white shadow-2xl rounded-t-3xl overflow-hidden">
        {/* Image Carousel */}
        <div className="relative h-64 bg-gray-900">
          <img 
            src={listing.image_urls?.[currentImageIndex] || `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`} 
            alt="Property" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {(listing.image_urls || []).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition">
              <Share className="w-5 h-5" />
            </button>
          </div>

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

          {/* Agent Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Listing Agent</h3>
              <button 
                onClick={() => setShowLeadForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Real Estate Agent</p>
                <div className="flex items-center gap-4 mt-1">
                  <button 
                    onClick={() => window.location.href = 'tel:+15551234567'}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Phone className="w-3 h-3" />
                    (555) 123-4567
                  </button>
                  <button 
                    onClick={() => window.location.href = 'mailto:sarah.johnson@realty.com'}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Mail className="w-3 h-3" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowNeighborhood(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <i className="fas fa-map-marked-alt text-purple-600 text-xl"></i>
              </div>
              <p className="font-semibold text-gray-900">Neighborhood</p>
              <p className="text-xs text-gray-600 mt-1">Local insights</p>
            </button>

            <button 
              onClick={() => setShowSchools(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-3">
                <i className="fas fa-graduation-cap text-indigo-600 text-xl"></i>
              </div>
              <p className="font-semibold text-gray-900">Schools</p>
              <p className="text-xs text-gray-600 mt-1">Ratings & info</p>
            </button>

            <button 
              onClick={() => setShowGallery(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mx-auto mb-3">
                <i className="fas fa-images text-pink-600 text-xl"></i>
              </div>
              <p className="font-semibold text-gray-900">Gallery</p>
              <p className="text-xs text-gray-600 mt-1">All photos</p>
            </button>

            <button 
              onClick={() => setShowLeadForm(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <i className="fas fa-phone text-green-600 text-xl"></i>
              </div>
              <p className="font-semibold text-gray-900">Contact</p>
              <p className="text-xs text-gray-600 mt-1">Get in touch</p>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white">
          <div className="flex justify-around py-4">
            <button className="flex flex-col items-center text-blue-600">
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center text-gray-400">
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-xs">Contact</span>
            </button>
            <button className="flex flex-col items-center text-gray-400">
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Schedule</span>
            </button>
            <button className="flex flex-col items-center text-gray-400">
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-xs">Directions</span>
            </button>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowEditModal(true)}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
          >
            <Edit className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Enhanced Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowGallery(false)}
          />
          <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up border border-gray-100">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Photo Gallery</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGallery(false);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center z-10 relative"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {(listing.image_urls || []).map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                    onClick={() => openFullscreenGallery(index)}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/200x200/777/fff?text=Photo+${index + 1}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Gallery Actions */}
              <div className="flex justify-center pt-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    // Download all photos functionality
                    console.log('Download gallery feature coming soon!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Gallery */}
      {fullscreenGallery && (
        <div className="fixed inset-0 z-[60] bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeFullscreenGallery();
              }}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition flex items-center justify-center z-10 relative"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-white text-sm">
              {fullscreenIndex + 1} of {listing.image_urls?.length || 0}
            </div>
            <button 
              onClick={() => {
                // Download current photo functionality
                console.log('Download photo feature coming soon!');
              }}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition flex items-center justify-center"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image */}
          <div className="flex items-center justify-center h-full">
            <img 
              src={listing.image_urls?.[fullscreenIndex]} 
              alt={`Property view ${fullscreenIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/800x600/777/fff?text=Photo+${fullscreenIndex + 1}`;
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={() => navigateGallery('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => navigateGallery('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex justify-center space-x-2 overflow-x-auto">
              {(listing.image_urls || []).map((url, index) => (
                <button
                  key={index}
                  onClick={() => setFullscreenIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === fullscreenIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={url} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/64x64/777/fff?text=${index + 1}`;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Neighborhood Modal */}
      <NeighborhoodModal
        isOpen={showNeighborhood}
        onClose={() => setShowNeighborhood(false)}
        address={listing.address}
        latitude={34.0522} // Default LA coordinates - in real app, would get from listing
        longitude={-118.2437} // Default LA coordinates - in real app, would get from listing
        city={listing.city || 'Los Angeles'}
        state={listing.state || 'CA'}
      />

      <SchoolsModal
        isOpen={showSchools}
        onClose={() => setShowSchools(false)}
        address={listing.address}
      />

      <ContactAgentModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        address={listing.address}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Property</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    defaultValue={listing.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    defaultValue={listing.price}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      defaultValue={listing.bedrooms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      defaultValue={listing.bathrooms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
                  <input
                    type="number"
                    defaultValue={listing.square_footage}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    defaultValue={listing.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save changes functionality
                      console.log('Save changes feature coming soon!');
                      setShowEditModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles are handled by Tailwind CSS classes */}
    </div>
  );
};

export default PropertyAppViewPage; 