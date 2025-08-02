import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getListingById } from '../services/listingService';
import { Listing } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { 
  getPropertyDetails, 
  getComparableProperties, 
  getNearbySchools, 
  getPointsOfInterest, 
  getNeighborhoodData, 
  getPropertyHistory,
  getMockAttomData,
  type AttomPropertyData,
  type AttomComparable,
  type AttomSchool,
  type AttomPOI
} from '../services/attomDataService';
import { 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Share2,
  Eye,
  School,
  Car,
  ShoppingBag,
  Coffee,
  TreePine,
  Building,
  Home,
  Camera,
  Video,
  Star,
  Users,
  Clock,
  DollarSign,
  ArrowLeft,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from '../components/shared/ContactForm';

interface MobileListingDetailPageProps {
  listing?: Listing;
}

const MobileListingDetailPage: React.FC<MobileListingDetailPageProps> = ({ listing: propListing }) => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(propListing || null);
  const [loading, setLoading] = useState(!propListing);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showComparables, setShowComparables] = useState(false);
  const [showFinancing, setShowFinancing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVirtual, setShowVirtual] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [walkScore, setWalkScore] = useState<number | null>(null);
  const [transitScore, setTransitScore] = useState<number | null>(null);
  const [bikeScore, setBikeScore] = useState<number | null>(null);
  
  // ATTOM Data state
  const [attomPropertyData, setAttomPropertyData] = useState<AttomPropertyData | null>(null);
  const [attomComparables, setAttomComparables] = useState<AttomComparable[]>([]);
  const [attomSchools, setAttomSchools] = useState<AttomSchool[]>([]);
  const [attomPOI, setAttomPOI] = useState<AttomPOI[]>([]);
  const [attomNeighborhood, setAttomNeighborhood] = useState<any>(null);
  const [attomHistory, setAttomHistory] = useState<any[]>([]);

  // Button configuration - these can be toggled in edit mode
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
      if (!id || propListing) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        setError('Failed to fetch listing details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, propListing]);

  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!listing?.image_urls) return;
    const totalImages = listing.image_urls.length;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const openChat = () => {
    setShowChat(true);
    // Dispatch custom event to open chat/voice
    window.dispatchEvent(new CustomEvent('open-voicebot'));
  };

  // Swipe gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleImageChange('next');
    }
    if (isRightSwipe) {
      handleImageChange('prev');
    }
  };

  // Fetch Walk Score data
  const fetchWalkScore = async (address: string) => {
    try {
      // First, geocode the address to get coordinates
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDCDBKcNpeADCzf0j8ag7TRXGZIryL3Jjw`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.results && geocodeData.results.length > 0) {
        const location = geocodeData.results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        
        // Now fetch Walk Score with coordinates
        const walkScoreResponse = await fetch(
          `https://api.walkscore.com/score?format=json&lat=${lat}&lon=${lng}&wsapikey=72bc1d2dc76c691240ed998833f507d5`
        );
        const walkScoreData = await walkScoreResponse.json();
        
        console.log('Walk Score API response:', walkScoreData);
        
        if (walkScoreData.status === 1) {
          setWalkScore(walkScoreData.walkscore);
          setTransitScore(walkScoreData.transit?.score || null);
          setBikeScore(walkScoreData.bike?.score || null);
        } else {
          console.log('Walk Score API error:', walkScoreData.status, walkScoreData.error);
          // Set mock data for demo purposes
          setWalkScore(85);
          setTransitScore(75);
          setBikeScore(80);
        }
      } else {
        console.log('Geocoding failed for address:', address);
        // Set mock data for demo purposes
        setWalkScore(85);
        setTransitScore(75);
        setBikeScore(80);
      }
    } catch (error) {
      console.error('Error fetching Walk Score:', error);
      // Set mock data for demo purposes
      setWalkScore(85);
      setTransitScore(75);
      setBikeScore(80);
    }
  };

  // Fetch Walk Score when map modal opens
  useEffect(() => {
    if (showMap && listing?.address && !walkScore) {
      fetchWalkScore(listing.address);
    }
  }, [showMap, listing?.address, walkScore]);

  // Fetch ATTOM Data when needed
  const fetchAttomData = async (address: string) => {
    try {
      // Use real ATTOM API calls
      const [propertyData, comparables, schools, poi, neighborhood, history] = await Promise.all([
        getPropertyDetails(address),
        getComparableProperties(address),
        getNearbySchools(address),
        getPointsOfInterest(address),
        getNeighborhoodData(address),
        getPropertyHistory(address)
      ]);
      
      setAttomPropertyData(propertyData);
      setAttomComparables(comparables);
      setAttomSchools(schools);
      setAttomPOI(poi);
      setAttomNeighborhood(neighborhood);
      setAttomHistory(history);
      
      console.log('Real ATTOM Data loaded:', {
        propertyData,
        comparables: comparables.length,
        schools: schools.length,
        poi: poi.length,
        neighborhood,
        history: history.length
      });
    } catch (error) {
      console.error('Error fetching ATTOM data:', error);
      // Fallback to mock data if API fails
      const mockData = getMockAttomData();
      setAttomPropertyData(mockData.propertyDetails);
      setAttomComparables(mockData.comparables);
      setAttomSchools(mockData.schools);
      setAttomPOI(mockData.poi);
      setAttomNeighborhood(mockData.neighborhood);
      setAttomHistory(mockData.history);
      
      console.log('Using mock data due to API failure:', mockData);
    }
  };

  // Load ATTOM data when listing loads
  useEffect(() => {
    if (listing?.address && !attomPropertyData) {
      fetchAttomData(listing.address);
    }
  }, [listing?.address, attomPropertyData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600">{error || 'This listing doesn\'t exist.'}</p>
        </div>
      </div>
    );
  }

  const currentImage = listing.image_urls?.[currentImageIndex] || '/home1.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Slider */}
      <div className="relative h-80 bg-gray-900">
        {/* Image Slider */}
        <div className="relative h-full overflow-hidden">
          <img 
            src={currentImage} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/50 text-white hover:bg-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isSaved 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-black/50 text-white hover:bg-blue-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Image Navigation */}
          {listing.image_urls && listing.image_urls.length > 1 && (
            <>
              <button 
                onClick={() => handleImageChange('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleImageChange('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {listing.image_urls.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky Chat Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <Button 
          onClick={openChat}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 text-lg rounded-xl shadow-lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Talk to the Home Now
        </Button>
      </div>

      {/* Property Details */}
      <div className="px-4 py-6 space-y-4">
        {/* Address and Price */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{listing.address}</span>
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${listing.price?.toLocaleString() || 'Contact for price'}
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 bg-white rounded-xl shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Bed className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{listing.bedrooms || 0}</div>
            <div className="text-sm text-gray-600">Bedrooms</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Bath className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{listing.bathrooms || 0}</div>
            <div className="text-sm text-gray-600">Bathrooms</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Square className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {listing.square_footage?.toLocaleString() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Sq Ft</div>
          </div>
        </div>

        {/* Property Summary */}
        {listing.description && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Property Summary</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {listing.description}
            </p>
          </div>
        )}
      </div>

            {/* Action Buttons Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {activeButtons.gallery && (
            <Button 
              onClick={() => setShowGallery(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Camera className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Gallery</span>
            </Button>
          )}
          
          {activeButtons.schools && (
            <Button 
              onClick={() => setShowSchools(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <School className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Schools</span>
            </Button>
          )}
          
          {activeButtons.video && (
            <Button 
              onClick={() => setShowVideo(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Video className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Video Tour</span>
            </Button>
          )}
          
          {activeButtons.amenities && (
            <Button 
              onClick={() => setShowAmenities(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Home className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">Amenities</span>
            </Button>
          )}
          
          {activeButtons.neighborhood && (
            <Button 
              onClick={() => setShowNeighborhood(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <TreePine className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Neighborhood</span>
            </Button>
          )}
          
          {activeButtons.schedule && (
            <Button 
              onClick={() => setShowSchedule(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Calendar className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium">Schedule</span>
            </Button>
          )}
          
          {activeButtons.map && (
            <Button 
              onClick={() => setShowMap(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium">Map</span>
            </Button>
          )}
          
          {activeButtons.comparables && (
            <Button 
              onClick={() => setShowComparables(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-medium">Comparables</span>
            </Button>
          )}
          
          {activeButtons.financing && (
            <Button 
              onClick={() => setShowFinancing(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium">Financing</span>
            </Button>
          )}
          
          {activeButtons.history && (
            <Button 
              onClick={() => setShowHistory(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium">History</span>
            </Button>
          )}
          
          {activeButtons.virtual && (
            <Button 
              onClick={() => setShowVirtual(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <Eye className="w-5 h-5 text-violet-600" />
              <span className="text-sm font-medium">Virtual Tour</span>
            </Button>
          )}
          
          {activeButtons.reports && (
            <Button 
              onClick={() => setShowReports(true)}
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2 bg-white shadow-sm"
            >
              <FileText className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium">Reports</span>
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Agent Card */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Agent</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-600">HomeListingAI Agent</div>
              <div className="text-xs text-green-600 font-medium">Available Now</div>
            </div>
            <div className="flex flex-col gap-1">
              <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <button className="text-blue-600 text-sm font-medium">Call Now</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MessageCircle className="w-4 h-4" />
                <span>sarah@homelistingai.com</span>
              </div>
              <button className="text-blue-600 text-sm font-medium">Email</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Response time: 15 min</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
              Schedule Showing
            </button>
            <button className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
              Get Pre-approved
            </button>
          </div>
          
          {/* Social Media Links */}
          <div className="flex gap-3">
            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <span className="text-xs font-bold">FB</span>
            </button>
            <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
              <span className="text-xs font-bold">TW</span>
            </button>
            <button className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
              <span className="text-xs font-bold">IG</span>
            </button>
            <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors">
              <span className="text-xs font-bold">LI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Second Chat Button */}
      <div className="px-4 pb-6">
        <Button 
          onClick={openChat}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 text-lg rounded-xl shadow-lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Still Questions? Talk to the Home
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <button className="flex flex-col items-center gap-1 py-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Showings</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <Bookmark className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Save</span>
          </button>
          <button 
            onClick={() => setShowContactForm(true)}
            className="flex flex-col items-center gap-1 py-2"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Contact</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2">
            <Share2 className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Share</span>
          </button>
        </div>
      </div>

      {/* Enhanced Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setShowGallery(false)}
          >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center p-4">
              {/* Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3 text-white">
                  <Camera className="w-5 h-5" />
                  <span className="font-semibold">Photo Gallery</span>
                  <span className="text-sm opacity-75">
                    {currentImageIndex + 1} of {listing.image_urls?.length || 0}
                  </span>
                </div>
                <button 
                  onClick={() => setShowGallery(false)}
                  className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Main Image */}
              <div 
                className="relative w-full h-full flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img 
                  src={currentImage} 
                  alt="Gallery" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                
                {/* Navigation Arrows */}
                {listing.image_urls && listing.image_urls.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleImageChange('prev'); }}
                      className="absolute left-4 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleImageChange('next'); }}
                      className="absolute right-4 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {listing.image_urls && listing.image_urls.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 justify-center">
                    {listing.image_urls.map((url, index) => (
                      <button
                        key={index}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setCurrentImageIndex(index); 
                        }}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-white' 
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Keyboard Navigation Info */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                Use ← → keys or swipe to navigate
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Enhanced Schools Modal with Real Data */}
      <AnimatePresence>
        {showSchools && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowSchools(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Local Schools</h3>
                  <button onClick={() => setShowSchools(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* School District Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <School className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">School District</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Springfield Unified School District</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">District Rating</p>
                        <p className="font-semibold text-gray-900">A+</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Student-Teacher Ratio</p>
                        <p className="font-semibold text-gray-900">15:1</p>
                      </div>
                    </div>
                  </div>

                  {/* Elementary Schools */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Elementary Schools</h4>
                    <div className="space-y-3">
                      {attomSchools.filter(school => school.type === 'Elementary').length > 0 ? (
                        attomSchools.filter(school => school.type === 'Elementary').map((school, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">{school.name}</h5>
                                <p className="text-sm text-gray-600">Grades K-5 • {school.distance} miles away</p>
                              </div>
                              <div className="text-right">
                                {school.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-semibold">{school.rating}/10</span>
                                  </div>
                                )}
                                <p className="text-xs text-green-600">Excellent</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              {school.enrollment && <div>Enrollment: {school.enrollment} students</div>}
                              <div>Distance: {school.distance} miles</div>
                              <div>Type: {school.type}</div>
                              <div>Rating: {school.rating || 'N/A'}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500 text-sm">School information loading...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Schools */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Middle Schools</h4>
                    <div className="space-y-3">
                      {attomSchools.filter(school => school.type === 'Middle').length > 0 ? (
                        attomSchools.filter(school => school.type === 'Middle').map((school, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">{school.name}</h5>
                                <p className="text-sm text-gray-600">Grades 6-8 • {school.distance} miles away</p>
                              </div>
                              <div className="text-right">
                                {school.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-semibold">{school.rating}/10</span>
                                  </div>
                                )}
                                <p className="text-xs text-green-600">Excellent</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              {school.enrollment && <div>Enrollment: {school.enrollment} students</div>}
                              <div>Distance: {school.distance} miles</div>
                              <div>Type: {school.type}</div>
                              <div>Rating: {school.rating || 'N/A'}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500 text-sm">School information loading...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* High Schools */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">High Schools</h4>
                    <div className="space-y-3">
                      {attomSchools.filter(school => school.type === 'High').length > 0 ? (
                        attomSchools.filter(school => school.type === 'High').map((school, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">{school.name}</h5>
                                <p className="text-sm text-gray-600">Grades 9-12 • {school.distance} miles away</p>
                              </div>
                              <div className="text-right">
                                {school.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-semibold">{school.rating}/10</span>
                                  </div>
                                )}
                                <p className="text-xs text-green-600">Excellent</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              {school.enrollment && <div>Enrollment: {school.enrollment} students</div>}
                              <div>Distance: {school.distance} miles</div>
                              <div>Type: {school.type}</div>
                              <div>Rating: {school.rating || 'N/A'}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500 text-sm">School information loading...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* School Map */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">School Locations</h4>
                    <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                      <div className="text-center">
                        <School className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">Interactive school map coming soon!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setShowVideo(false)}
          >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center p-4">
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Video Tour</h3>
                  <p className="text-gray-400 mb-4">Virtual walkthrough coming soon!</p>
                  <Button 
                    onClick={() => setShowVideo(false)}
                    className="bg-blue-600 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Map Modal with Google Maps */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowMap(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Property Location</h3>
                  <button onClick={() => setShowMap(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Google Maps Embed */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="200"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDCDBKcNpeADCzf0j8ag7TRXGZIryL3Jjw&q=${encodeURIComponent(listing.address)}`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-gray-900">Address</h4>
                    </div>
                    <p className="text-gray-700">{listing.address}</p>
                    <button 
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(listing.address)}`, '_blank')}
                      className="mt-2 text-blue-600 text-sm font-medium"
                    >
                      Open in Google Maps →
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Nearby Amenities</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Schools</span>
                        <span className="text-sm font-medium">0.5 miles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Shopping</span>
                        <span className="text-sm font-medium">0.8 miles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Public Transit</span>
                        <span className="text-sm font-medium">0.3 miles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Parks</span>
                        <span className="text-sm font-medium">0.2 miles</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Walk Score</h4>
                    {walkScore ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            walkScore >= 90 ? 'bg-green-500' :
                            walkScore >= 70 ? 'bg-green-400' :
                            walkScore >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}>
                            {walkScore}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {walkScore >= 90 ? 'Walker\'s Paradise' :
                               walkScore >= 70 ? 'Very Walkable' :
                               walkScore >= 50 ? 'Somewhat Walkable' :
                               'Car-Dependent'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {walkScore >= 90 ? 'Daily errands do not require a car' :
                               walkScore >= 70 ? 'Most errands can be accomplished on foot' :
                               walkScore >= 50 ? 'Some errands can be accomplished on foot' :
                               'Almost all errands require a car'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Transit Score */}
                        {transitScore && (
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-gray-600">Transit Score</span>
                            <span className="font-semibold text-blue-600">{transitScore}</span>
                          </div>
                        )}
                        
                        {/* Bike Score */}
                        {bikeScore && (
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-gray-600">Bike Score</span>
                            <span className="font-semibold text-green-600">{bikeScore}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                          --
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Loading...</p>
                          <p className="text-sm text-gray-600">Fetching walkability data</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparables Modal */}
      <AnimatePresence>
        {showComparables && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowComparables(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Comparable Properties</h3>
                  <button onClick={() => setShowComparables(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-cyan-600" />
                      <h4 className="font-semibold text-gray-900">Market Analysis</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Avg Price/Sq Ft</p>
                        <p className="font-semibold text-gray-900">$245</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Days on Market</p>
                        <p className="font-semibold text-gray-900">12</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price Range</p>
                        <p className="font-semibold text-gray-900">$420k - $480k</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Inventory</p>
                        <p className="font-semibold text-gray-900">Low</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Recent Sales</h4>
                    <div className="space-y-3">
                      {attomComparables.map((comparable, index) => (
                        <div key={index} className="bg-white border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{comparable.address.line1}</p>
                              <p className="text-sm text-gray-600">
                                {comparable.building.rooms.beds} bed, {comparable.building.rooms.bathstotal} bath, {comparable.building.size.livingsize?.toLocaleString()} sqft
                              </p>
                            </div>
                            <p className="font-bold text-green-600">
                              ${comparable.sale.amount?.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Sold {new Date(comparable.sale.date).toLocaleDateString()} • Built {comparable.summary.yearbuilt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Financing Modal */}
      <AnimatePresence>
        {showFinancing && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowFinancing(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Financing Calculator</h3>
                  <button onClick={() => setShowFinancing(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-semibold text-gray-900">Payment Calculator</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Purchase Price</label>
                        <div className="text-2xl font-bold text-gray-900">${listing.price?.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-gray-600">Down Payment (20%)</label>
                          <div className="text-lg font-semibold text-gray-900">
                            ${Math.round((listing.price || 0) * 0.2).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Loan Amount</label>
                          <div className="text-lg font-semibold text-gray-900">
                            ${Math.round((listing.price || 0) * 0.8).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Monthly Payment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Principal & Interest</span>
                        <span className="font-semibold">$1,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Property Tax</span>
                        <span className="font-semibold">$458</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Insurance</span>
                        <span className="font-semibold">$125</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total Monthly</span>
                          <span className="font-bold text-lg text-gray-900">$2,430</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Financing Options</h4>
                    <div className="space-y-2">
                      <button className="w-full p-3 bg-green-600 text-white rounded-lg font-medium">
                        Get Pre-approved
                      </button>
                      <button className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium">
                        Apply for Loan
                      </button>
                      <button className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg font-medium">
                        Compare Lenders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowHistory(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Property History</h3>
                  <button onClick={() => setShowHistory(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-gray-900">Price History</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">Current Price</p>
                          <p className="text-sm text-gray-600">Listed 2 weeks ago</p>
                        </div>
                        <p className="font-bold text-green-600">${listing.price?.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">Previous Price</p>
                          <p className="text-sm text-gray-600">1 month ago</p>
                        </div>
                        <p className="font-bold text-gray-600">$465,000</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">Original Price</p>
                          <p className="text-sm text-gray-600">3 months ago</p>
                        </div>
                        <p className="font-bold text-gray-600">$485,000</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Property Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Listed for Sale</p>
                          <p className="text-sm text-gray-600">March 15, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Price Reduced</p>
                          <p className="text-sm text-gray-600">February 28, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-gray-900">First Listed</p>
                          <p className="text-sm text-gray-600">January 10, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Market Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days on Market</span>
                        <span className="font-semibold">45 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price per Sq Ft</span>
                        <span className="font-semibold">$245</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Market Status</span>
                        <span className="font-semibold text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {showVirtual && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowVirtual(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Virtual Tour</h3>
                  <button onClick={() => setShowVirtual(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-violet-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="w-5 h-5 text-violet-600" />
                      <h4 className="font-semibold text-gray-900">3D Virtual Tour</h4>
                    </div>
                    <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Virtual tour coming soon!</p>
                        <p className="text-sm text-gray-500">Interactive 3D experience</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Tour Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">360° Room Views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Floor Plan Navigation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Property Measurements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Interactive Hotspots</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full p-3 bg-violet-600 text-white rounded-lg font-medium">
                    Schedule Virtual Showing
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports Modal */}
      <AnimatePresence>
        {showReports && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowReports(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Property Reports</h3>
                  <button onClick={() => setShowReports(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <h4 className="font-semibold text-gray-900">Available Reports</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-semibold text-gray-900">Property Disclosure</p>
                          <p className="text-sm text-gray-600">Seller's property condition report</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium">View</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-semibold text-gray-900">Home Inspection</p>
                          <p className="text-sm text-gray-600">Professional inspection report</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium">View</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-semibold text-gray-900">Title Report</p>
                          <p className="text-sm text-gray-600">Property ownership and liens</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium">View</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-semibold text-gray-900">Appraisal Report</p>
                          <p className="text-sm text-gray-600">Professional property valuation</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium">View</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Request Reports</h4>
                    <button className="w-full p-3 bg-green-600 text-white rounded-lg font-medium">
                      Request Additional Reports
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amenities Modal */}
      <AnimatePresence>
        {showAmenities && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowAmenities(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Property Amenities</h3>
                  <button onClick={() => setShowAmenities(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Home className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Interior Features</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Hardwood Floors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Granite Countertops</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Stainless Appliances</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Walk-in Closet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Fireplace</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Central AC</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Exterior Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">2-Car Garage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Deck/Patio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Fenced Yard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Sprinkler System</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neighborhood Modal */}
      <AnimatePresence>
        {showNeighborhood && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowNeighborhood(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Neighborhood</h3>
                  <button onClick={() => setShowNeighborhood(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <TreePine className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Local Attractions</h4>
                    </div>
                    <div className="space-y-2">
                      {attomPOI.map((poi, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{poi.name}</span>
                          <span className="text-sm font-medium">{poi.distance} miles</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Transportation</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bus Stop</span>
                        <span className="text-sm font-medium">0.1 miles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Train Station</span>
                        <span className="text-sm font-medium">1.2 miles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Highway Access</span>
                        <span className="text-sm font-medium">0.5 miles</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Community Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Population</p>
                        <p className="font-semibold text-gray-900">12,450</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Median Age</p>
                        <p className="font-semibold text-gray-900">34</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Median Income</p>
                        <p className="font-semibold text-gray-900">$78,500</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Crime Rate</p>
                        <p className="font-semibold text-green-600">Low</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowSchedule(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Schedule Showing</h3>
                  <button onClick={() => setShowSchedule(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-gray-900">Available Times</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm text-gray-700">Today</span>
                        <span className="text-sm font-medium text-green-600">2:00 PM, 4:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm text-gray-700">Tomorrow</span>
                        <span className="text-sm font-medium text-green-600">10:00 AM, 1:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm text-gray-700">Saturday</span>
                        <span className="text-sm font-medium text-green-600">9:00 AM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Book Appointment</h4>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Your Name"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Select Preferred Time</option>
                        <option>Today 2:00 PM</option>
                        <option>Today 4:00 PM</option>
                        <option>Tomorrow 10:00 AM</option>
                        <option>Tomorrow 1:00 PM</option>
                        <option>Saturday 9:00 AM</option>
                      </select>
                      <button className="w-full p-3 bg-red-600 text-white rounded-lg font-medium">
                        Schedule Showing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div 
              className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Contact Agent</h3>
                  <button onClick={() => setShowContactForm(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <ContactForm 
                  listing={listing}
                  onLeadCapture={(leadData) => {
                    console.log('Lead captured from contact form:', leadData);
                    setShowContactForm(false);
                    // You can add lead service call here
                  }}
                  className="border-0 shadow-none"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileListingDetailPage; 