import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  Phone, 
  Calendar, 
  MapPin, 
  Heart, 
  Share,
  ArrowLeft,
  Settings,
  Edit
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
              onClick={() => navigate(`/listings/app-edit/${id}`)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit App
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/listings/edit/${id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
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
            <button className="group relative bg-black/90 backdrop-blur-xl text-white py-2 px-4 rounded-full shadow-lg hover:bg-black/95 transition-all duration-300 flex items-center gap-2 border border-white/10">
              <div className="flex items-center justify-center w-6 h-6">
                <i className="fas fa-microphone text-xs"></i>
              </div>
              <span className="text-sm font-medium">Talk With the Home</span>
              <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Property Details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {listing.address}
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${listing.price?.toLocaleString() || '0'}
              </p>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-600">{listing.bedrooms}</p>
                <p className="text-xs text-blue-600">Bedrooms</p>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <i className="fas fa-bath text-green-600 text-xl"></i>
                </div>
                <p className="text-lg font-bold text-green-600">{listing.bathrooms}</p>
                <p className="text-xs text-green-600">Bathrooms</p>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <i className="fas fa-vector-square text-purple-600 text-xl"></i>
                </div>
                <p className="text-lg font-bold text-purple-600">{listing.square_footage?.toLocaleString() || 'N/A'}</p>
                <p className="text-xs text-purple-600">Sq Ft</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription ? listing.description : `${listing.description.slice(0, 150)}...`}
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 ml-2 font-medium"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Call Agent</p>
              <p className="text-xs text-gray-600 mt-1">Direct line</p>
            </button>
            
            <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-900">Schedule Tour</p>
              <p className="text-xs text-gray-600 mt-1">Private showing</p>
            </button>

            <button 
              onClick={() => setShowPropertyDetails(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <i className="fas fa-home text-blue-600 text-xl"></i>
              </div>
              <p className="font-semibold text-gray-900">Property Details</p>
              <p className="text-xs text-gray-600 mt-1">Full specs</p>
            </button>

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
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-[9999]">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
                <i className="fas fa-home text-blue-600 text-lg"></i>
                <span className="text-xs font-medium text-gray-700">Home</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
                <i className="fas fa-calendar-alt text-green-600 text-lg"></i>
                <span className="text-xs font-medium text-gray-700">Schedule Tour</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
                <i className="fas fa-phone text-purple-600 text-lg"></i>
                <span className="text-xs font-medium text-gray-700">Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
                  onClick={() => setShowGallery(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times text-gray-600 text-sm"></i>
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {(listing.image_urls || []).map((imageUrl, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={imageUrl} 
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/200x200/777/fff?text=Photo+${index + 1}`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other modals can be added here */}
    </div>
  );
};

export default PropertyAppViewPage; 