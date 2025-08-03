import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Heart, 
  Share2, 
  Calendar,
  Save,
  Video,
  Home,
  TreePine,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  TrendingUp,
  DollarSign,
  Clock,
  Eye,
  FileText,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Camera,
  X,
  Star,
  Building,
  Car,
  Bus,
  Train,
  Coffee,
  ShoppingBag,
  Utensils,
  School,
  Wifi,
  Zap,
  Shield,
  Navigation,
  Bus,
  Train,
  Clock,
  ExternalLink,
  Calculator,
  Percent,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Home,
  CalendarDays,
  FileText,
  Info,
  Wifi,
  Car,
  Coffee,
  ShoppingBag,
  Utensils,
  School,
  Zap,
  Shield,
  Star,
  CheckCircle,
  Sparkles,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Zap,
  User,
  Users,
  Bot,
  Mic
} from 'lucide-react';
import MediaPlayer from './MediaPlayer';
import VoiceBot from './VoiceBot';
import HamburgerMenu from './HamburgerMenu';
import VideoGallery from './VideoGallery';
import VideoPlayer from './VideoPlayer';
import SaveConfirmationModal from './SaveConfirmationModal';
import { generateAllPropertyData, type SchoolData, type PropertyHistory, type AmenityData, type NeighborhoodData, type FinancingData, type ComparableProperty, type PropertyReport } from '../../services/propertyDataService';

// Types for the listing app
interface PropertyDetails {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  description: string;
  images: string[];
  agent: {
    name: string;
    title: string;
    photo: string;
    phone: string;
    email: string;
  };
  mediaLinks?: {
    virtualTour?: string;
    propertyVideo?: string;
    droneFootage?: string;
    neighborhoodVideo?: string;
  };
}

interface FeatureButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  action: () => void;
  visible: boolean;
}

interface MobileListingAppProps {
  property: PropertyDetails;
  onChatOpen: () => void;
  onScheduleShowing: () => void;
  onSaveListing: () => void;
  onContactAgent: () => void;
  onShareListing: () => void;
  onFeatureClick: (featureId: string) => void;
  isDemo?: boolean;
  isPreview?: boolean;
}

const MobileListingApp: React.FC<MobileListingAppProps> = ({
  property,
  onChatOpen,
  onScheduleShowing,
  onSaveListing,
  onContactAgent,
  onShareListing,
  onFeatureClick,
  isDemo = false,
  isPreview = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, title: string} | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFinancing, setShowFinancing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showComparables, setShowComparables] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showVoiceBot, setShowVoiceBot] = useState(false);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [showVideoTour, setShowVideoTour] = useState(false);
  const [showDroneFootage, setShowDroneFootage] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Demo data for Schools and Reports
  const demoSchools = [
    {
      id: '1',
      name: 'Springfield Elementary School',
      rating: 9.2,
      distance: '0.3 miles',
      type: 'Public',
      grades: 'K-5',
      address: '123 School St, Springfield, IL'
    },
    {
      id: '2', 
      name: 'Lincoln Middle School',
      rating: 8.7,
      distance: '0.8 miles',
      type: 'Public',
      grades: '6-8',
      address: '456 Education Ave, Springfield, IL'
    },
    {
      id: '3',
      name: 'Springfield High School',
      rating: 9.0,
      distance: '1.2 miles',
      type: 'Public',
      grades: '9-12',
      address: '789 Learning Blvd, Springfield, IL'
    },
    {
      id: '4',
      name: 'St. Mary\'s Academy',
      rating: 9.5,
      distance: '0.5 miles',
      type: 'Private',
      grades: 'K-12',
      address: '321 Faith Dr, Springfield, IL'
    }
  ];


  
  // Demo videos
  const demoVideos = [
    {
      id: 'video-tour',
      title: 'Property Video Tour',
      description: 'Complete walkthrough of this beautiful home',
      videoUrl: '/videos/video_tour.mp4',
      duration: '2:45',
      category: 'tour'
    },
    {
      id: 'drone-footage',
      title: 'Drone Aerial View',
      description: 'Stunning aerial footage of the property and neighborhood',
      videoUrl: '/videos/drone_footage.mp4',
      duration: '1:30',
      category: 'aerial'
    }
  ];
  
  // AI-generated data state
  const [propertyData, setPropertyData] = useState<{
    schools: SchoolData[];
    history: PropertyHistory[];
    amenities: AmenityData[];
    neighborhood: NeighborhoodData;
    financing: FinancingData;
    comparables: ComparableProperty[];
    report: PropertyReport;
  } | null>(null);
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  
  const imageSliderRef = useRef<HTMLDivElement>(null);

  // Auto-play image slider
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, property.images.length]);



  // Handle keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showGallery) return;
      
      if (e.key === 'ArrowLeft') {
        setGalleryImageIndex(prev => 
          prev === 0 ? property.images.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setGalleryImageIndex(prev => 
          prev === property.images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'Escape') {
        setShowGallery(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGallery, property.images.length]);

  // Generate AI property data when needed
  const generatePropertyData = async () => {
    if (propertyData || isGeneratingData) return;
    
    setIsGeneratingData(true);
    try {
      const data = await generateAllPropertyData(
        property.address,
        property.price,
        property.bedrooms,
        property.bathrooms,
        'Single Family Home',
        property.description
      );
      setPropertyData(data);
    } catch (error) {
      console.error('Error generating property data:', error);
    } finally {
      setIsGeneratingData(false);
    }
  };

  // Feature buttons configuration
  const featureButtons: FeatureButton[] = [
    {
      id: 'gallery',
      icon: <Camera className="w-6 h-6" />,
      label: 'Gallery',
      color: 'bg-indigo-500',
      action: () => {
        if (property.images && property.images.length > 0) {
          setShowGallery(true);
        } else {
          onFeatureClick('gallery');
        }
      },
      visible: true
    },
    {
      id: 'video-tour',
      icon: <Video className="w-6 h-6" />,
      label: 'Video Tour',
      color: 'bg-purple-500',
      action: () => setShowVideoTour(true),
      visible: true
    },
    {
      id: 'drone-footage',
      icon: <Navigation className="w-6 h-6" />,
      label: 'Drone Footage',
      color: 'bg-blue-500',
      action: () => setShowDroneFootage(true),
      visible: true
    },
    {
      id: 'amenities',
      icon: <Home className="w-6 h-6" />,
      label: 'Amenities',
      color: 'bg-orange-500',
      action: async () => {
        await generatePropertyData();
        setShowAmenities(true);
      },
      visible: true
    },
    {
      id: 'neighborhood',
      icon: <TreePine className="w-6 h-6" />,
      label: 'Neighborhood',
      color: 'bg-green-500',
      action: async () => {
        await generatePropertyData();
        setShowNeighborhood(true);
      },
      visible: true
    },
    {
      id: 'schedule',
      icon: <CalendarIcon className="w-6 h-6" />,
      label: 'Schedule',
      color: 'bg-red-500',
      action: () => setShowSchedule(true),
      visible: true
    },
    {
      id: 'map',
      icon: <MapPinIcon className="w-6 h-6" />,
      label: 'Map',
      color: 'bg-blue-500',
      action: async () => {
        await generatePropertyData();
        setShowMap(true);
      },
      visible: true
    },
    {
      id: 'comparables',
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Comparables',
      color: 'bg-teal-500',
      action: async () => {
        await generatePropertyData();
        setShowComparables(true);
      },
      visible: true
    },
    {
      id: 'financing',
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Financing',
      color: 'bg-green-600',
      action: async () => {
        await generatePropertyData();
        setShowFinancing(true);
      },
      visible: true
    },
    {
      id: 'history',
      icon: <Clock className="w-6 h-6" />,
      label: 'History',
      color: 'bg-yellow-500',
      action: async () => {
        await generatePropertyData();
        setShowHistory(true);
      },
      visible: true
    },
    {
      id: 'schools',
      icon: <School className="w-6 h-6" />,
      label: 'Schools',
      color: 'bg-blue-600',
      action: async () => {
        await generatePropertyData();
        setShowSchools(true);
      },
      visible: true
    },

    {
      id: 'virtual-tour',
      icon: <Eye className="w-6 h-6" />,
      label: 'Virtual Tour',
      color: 'bg-purple-600',
      action: () => {
        if (property.mediaLinks?.virtualTour) {
          setSelectedMedia({ url: property.mediaLinks.virtualTour, title: 'Virtual Tour' });
          setShowMediaPlayer(true);
        } else {
          onFeatureClick('virtual-tour');
        }
      },
      visible: true
    },


  ];

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div 
        ref={imageSliderRef}
        className="relative h-80 bg-gray-900 overflow-hidden"
        style={{ borderRadius: '0 0 2rem 2rem' }}
      >
        {/* Image Slider */}
        <div className="relative w-full h-full">
          {property.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`${property.title} - Image ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => {
                  setGalleryImageIndex(index);
                  setShowGallery(true);
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>

        {/* Image Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>


      </div>

      {/* Mobile Menu */}
      <HamburgerMenu 
        onShow={() => {
          // This would show the listing preview
          console.log('Show listing preview');
        }}
        onSave={() => {
          // This would save the listing
          onSaveListing();
          setShowSaveConfirmation(true);
        }}
        onShare={() => {
          // This would share the listing
          onShareListing();
        }}
      />



      {/* Content */}
      <div className="px-4 pb-24">
        {/* Property Information */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.address}</span>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-6">
            {formatPrice(property.price)}
          </div>

          {/* Property Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <div className="text-xl font-bold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-3 h-3 border-2 border-white rounded-sm" />
                </div>
                <div className="text-xl font-bold text-gray-900">{property.squareFootage.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
            </div>
          </div>
        </div>

        {/* Talk to the Home Button - Moved under header */}
        <div className="mb-6">
          <button
            onClick={() => setShowVoiceBot(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <Mic className="w-5 h-5" />
            Talk to the Home Now
          </button>
        </div>

        {/* Property Description */}
        {property.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Property</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div 
                className={`text-gray-700 leading-relaxed ${
                  !showFullDescription ? 'max-h-[200px] overflow-hidden' : ''
                }`}
              >
                {property.description}
              </div>
              {property.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 font-medium mt-2 hover:text-blue-700 transition-colors"
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feature Buttons Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {featureButtons.filter(button => button.visible).map((button) => (
              <button
                key={button.id}
                onClick={button.action}
                className="bg-white rounded-xl shadow-sm p-6 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <div className={`${button.color.replace('bg-', 'text-')}`}>
                    {button.icon}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">{button.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Agent Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{property.agent.name}</div>
                <div className="text-sm text-gray-600">{property.agent.title}</div>
                <div className="text-xs text-gray-500 mt-1">Response time: Usually responds within 2 hours</div>
              </div>
            </div>
            
            {/* Contact Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={onContactAgent}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Call Me
              </button>
              <button
                onClick={onChatOpen}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Email Me
              </button>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-3 justify-center mt-4">
              <button className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-pink-600 flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={onScheduleShowing}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs">Showings</span>
            </button>
            <button
              onClick={() => {
                onSaveListing();
                setShowSaveConfirmation(true);
              }}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Save className="w-6 h-6" />
              <span className="text-xs">Save</span>
            </button>
            <button
              onClick={onContactAgent}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">Contact</span>
            </button>
            <button
              onClick={onShareListing}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-6 h-6" />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowSchedule(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Schedule Showing</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSchedule(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* AI Assistant Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      AI-Powered Scheduling
                    </p>
                    <p className="text-sm text-blue-700">
                      Our AI will help optimize your showing times and manage follow-ups automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Schedule Options */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  Quick Schedule
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="text-sm font-medium text-red-900">Today</div>
                    <div className="text-xs text-red-700">2:00 PM - 4:00 PM</div>
                  </button>
                  <button className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="text-sm font-medium text-red-900">Tomorrow</div>
                    <div className="text-xs text-red-700">10:00 AM - 12:00 PM</div>
                  </button>
                  <button className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="text-sm font-medium text-red-900">This Weekend</div>
                    <div className="text-xs text-red-700">Saturday 1:00 PM</div>
                  </button>
                  <button className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="text-sm font-medium text-red-900">Custom Time</div>
                    <div className="text-xs text-red-700">Choose your own</div>
                  </button>
                </div>
              </div>

              {/* Contact Agent */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Need Immediate Assistance?</h4>
                <p className="text-sm text-red-700 mb-3">
                  Contact the agent directly for urgent scheduling or special arrangements.
                </p>
                <button 
                  onClick={onContactAgent}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Contact Agent Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparables Modal */}
      {showComparables && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowComparables(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Market Comparables</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowComparables(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Market Analysis Disclaimer
                    </p>
                    <p className="text-sm text-red-700">
                      This information is for educational purposes only. Market data may be incomplete or outdated. 
                      Always consult with a licensed real estate professional for accurate market analysis and pricing guidance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Overview */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  Market Overview
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">${formatPrice(property.price)}</div>
                    <div className="text-xs text-teal-700">Subject Property</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">$485,000</div>
                    <div className="text-xs text-teal-700">Avg Sale Price</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">12 days</div>
                    <div className="text-xs text-teal-700">Avg Days on Market</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">+5.2%</div>
                    <div className="text-xs text-teal-700">Price Trend</div>
                  </div>
                </div>
              </div>

              {/* Comparable Properties */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Recent Sales (Comparables)
                </h4>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">123 Oak Street</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Sold</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sale Price:</span>
                        <span className="text-sm font-medium text-gray-900">$495,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Size:</span>
                        <span className="text-sm font-medium text-gray-900">1,200 sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Beds/Baths:</span>
                        <span className="text-sm font-medium text-gray-900">3/2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sold Date:</span>
                        <span className="text-sm font-medium text-gray-900">Feb 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days on Market:</span>
                        <span className="text-sm font-medium text-gray-900">8 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">456 Pine Avenue</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Sold</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sale Price:</span>
                        <span className="text-sm font-medium text-gray-900">$485,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Size:</span>
                        <span className="text-sm font-medium text-gray-900">1,100 sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Beds/Baths:</span>
                        <span className="text-sm font-medium text-gray-900">3/2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sold Date:</span>
                        <span className="text-sm font-medium text-gray-900">Jan 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days on Market:</span>
                        <span className="text-sm font-medium text-gray-900">12 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">789 Elm Drive</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Sold</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sale Price:</span>
                        <span className="text-sm font-medium text-gray-900">$475,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Size:</span>
                        <span className="text-sm font-medium text-gray-900">1,150 sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Beds/Baths:</span>
                        <span className="text-sm font-medium text-gray-900">3/2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sold Date:</span>
                        <span className="text-sm font-medium text-gray-900">Dec 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days on Market:</span>
                        <span className="text-sm font-medium text-gray-900">15 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Market Analysis
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Price per Sq Ft</div>
                      <div className="text-sm text-gray-600">Current market rate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${Math.round(property.price / property.squareFootage)}</div>
                      <div className="text-xs text-green-600">+2.1% vs avg</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Market Trend</div>
                      <div className="text-sm text-gray-600">Last 6 months</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">↗️ Rising</div>
                      <div className="text-xs text-green-600">+5.2% appreciation</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Inventory Level</div>
                      <div className="text-sm text-gray-600">Available properties</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">Low</div>
                      <div className="text-xs text-orange-600">2.1 months supply</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Important Notice
                    </p>
                    <p className="text-sm text-yellow-700">
                      Comparable sales data is provided for informational purposes only. 
                      Market conditions change rapidly. For accurate pricing and market analysis, 
                      consult with a licensed real estate professional.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact for Professional Analysis */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h4 className="font-semibold text-teal-800 mb-2">Need Professional Analysis?</h4>
                <p className="text-sm text-teal-700 mb-3">
                  Get a comprehensive market analysis and pricing strategy from a licensed real estate professional.
                </p>
                <button 
                  onClick={onContactAgent}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Contact Agent for Market Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amenities Modal */}
      {showAmenities && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowAmenities(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Property Amenities</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAmenities(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Property Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  Property Features
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-lg font-bold text-orange-900">{property.bedrooms}</div>
                    <div className="text-xs text-orange-700">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-lg font-bold text-orange-900">{property.bathrooms}</div>
                    <div className="text-xs text-orange-700">Bathrooms</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-lg font-bold text-orange-900">{property.squareFootage.toLocaleString()}</div>
                    <div className="text-xs text-orange-700">Sq Ft</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-lg font-bold text-orange-900">1995</div>
                    <div className="text-xs text-orange-700">Year Built</div>
                  </div>
                </div>
              </div>

              {/* AI-Generated Amenities */}
              {isGeneratingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating property amenities...</p>
                </div>
              ) : propertyData?.amenities ? (
                propertyData.amenities.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {category.category}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No amenities data available</p>
                </div>
              )}

              {/* Exterior Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Exterior Features
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">2-Car Garage</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <TreePine className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Landscaped Yard</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Deck/Patio</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Fenced Backyard</span>
                  </div>
                </div>
              </div>

              {/* Nearby Amenities */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-purple-600" />
                  Nearby Amenities
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Coffee className="w-5 h-5 text-brown-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Coffee Shops</div>
                      <div className="text-xs text-gray-600">3 within 0.5 miles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Shopping Centers</div>
                      <div className="text-xs text-gray-600">2 within 1 mile</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Utensils className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Restaurants</div>
                      <div className="text-xs text-gray-600">15+ within 1 mile</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <School className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Schools</div>
                      <div className="text-xs text-gray-600">3 within 0.8 miles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Public Transit</div>
                      <div className="text-xs text-gray-600">Bus stop 0.2 miles</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy & Utilities */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Energy & Utilities
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Central Air Conditioning</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-900">Forced Air Heating</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Energy Efficient Windows</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Insulated Attic</span>
                  </div>
                </div>
              </div>

              {/* Contact for More Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Need more details?</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Contact the agent for complete property features and amenities list.
                </p>
                <button 
                  onClick={onContactAgent}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Contact Agent for Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowHistory(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Property History</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Home className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Current Status</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Listed:</span>
                    <span className="text-sm font-medium text-blue-800">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Days on Market:</span>
                    <span className="text-sm font-medium text-blue-800">12 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Price Changes:</span>
                    <span className="text-sm font-medium text-blue-800">1 time</span>
                  </div>
                </div>
              </div>

              {/* Sales History */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Sales History
                </h4>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">March 2024</span>
                      </div>
                      <span className="text-xs text-gray-500">Current</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Listed Price:</span>
                        <span className="text-sm font-medium text-gray-900">${formatPrice(property.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className="text-sm font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">January 2022</span>
                      </div>
                      <span className="text-xs text-gray-500">Sold</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sold Price:</span>
                        <span className="text-sm font-medium text-gray-900">$485,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days on Market:</span>
                        <span className="text-sm font-medium text-gray-900">8 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price per Sq Ft:</span>
                        <span className="text-sm font-medium text-gray-900">$485</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">June 2019</span>
                      </div>
                      <span className="text-xs text-gray-500">Sold</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sold Price:</span>
                        <span className="text-sm font-medium text-gray-900">$420,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days on Market:</span>
                        <span className="text-sm font-medium text-gray-900">15 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price per Sq Ft:</span>
                        <span className="text-sm font-medium text-gray-900">$420</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price History Chart */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Price History
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Price:</span>
                      <span className="text-sm font-bold text-green-600">${formatPrice(property.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Sold (2022):</span>
                      <span className="text-sm font-medium text-gray-900">$485,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Previous Sale (2019):</span>
                      <span className="text-sm font-medium text-gray-900">$420,000</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Total Appreciation:</span>
                        <span className="text-sm font-bold text-green-600">+19.0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-gray-600" />
                  Property Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-xs text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-xs text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{property.squareFootage.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">1995</div>
                    <div className="text-xs text-gray-600">Year Built</div>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Market Analysis
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Price per Sq Ft</div>
                      <div className="text-sm text-gray-600">Current market rate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${Math.round(property.price / property.squareFootage)}</div>
                      <div className="text-xs text-green-600">+5.2% vs 2022</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Days on Market</div>
                      <div className="text-sm text-gray-600">Average in area</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">12 days</div>
                      <div className="text-xs text-green-600">-3 days vs avg</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Price Trend</div>
                      <div className="text-sm text-gray-600">Last 3 years</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">↗️ Rising</div>
                      <div className="text-xs text-green-600">+19% appreciation</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact for More Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Need more details?</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Contact the agent for complete property history and market analysis.
                </p>
                <button 
                  onClick={onContactAgent}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Contact Agent for Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financing Modal */}
      {showFinancing && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowFinancing(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mortgage Calculator</h3>
                    <p className="text-sm text-gray-600">Estimate your monthly payments</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFinancing(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      This is an estimate tool
                    </p>
                    <p className="text-sm text-blue-700">
                      Enter your own rates and terms. This calculator is for estimation purposes only and does not constitute a loan offer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculator Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="500,000"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      defaultValue={property.price}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="100,000"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      defaultValue={Math.round(property.price * 0.2)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="6.5"
                      className="w-full pl-3 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      defaultValue="6.5"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (Years)
                  </label>
                  <select className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="30">30 Years</option>
                    <option value="20">20 Years</option>
                    <option value="15">15 Years</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Monthly Payment Estimate</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Principal & Interest:</span>
                    <span className="text-sm font-medium text-gray-900">$2,528</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Property Tax (est.):</span>
                    <span className="text-sm font-medium text-gray-900">$417</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Insurance (est.):</span>
                    <span className="text-sm font-medium text-gray-900">$125</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Total Monthly Payment:</span>
                      <span className="font-bold text-green-600">$3,070</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Payment Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">$400,000</div>
                    <div className="text-xs text-gray-600">Loan Amount</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">$910,080</div>
                    <div className="text-xs text-gray-600">Total Interest</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">$1,310,080</div>
                    <div className="text-xs text-gray-600">Total Cost</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">$100,000</div>
                    <div className="text-xs text-gray-600">Down Payment</div>
                  </div>
                </div>
              </div>

              {/* Contact Lender */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Ready to get pre-approved?</h4>
                <p className="text-sm text-green-700 mb-3">
                  Contact a local lender to get your actual rates and terms.
                </p>
                <button 
                  onClick={onContactAgent}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Contact Agent for Lender Referrals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowMap(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location & Directions</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMap(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Map Embed */}
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.address)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location"
                  />
                </div>
                <button 
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(property.address);
                    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
                  }}
                  className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </button>
              </div>

              {/* Quick Directions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Quick Directions
                </h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      const encodedAddress = encodeURIComponent(property.address);
                      window.open(`https://maps.google.com/maps?daddr=${encodedAddress}&dirflg=d`, '_blank');
                    }}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Driving</div>
                        <div className="text-sm text-gray-600">Get turn-by-turn directions</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => {
                      const encodedAddress = encodeURIComponent(property.address);
                      window.open(`https://maps.google.com/maps?daddr=${encodedAddress}&dirflg=w`, '_blank');
                    }}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bus className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Transit</div>
                        <div className="text-sm text-gray-600">Public transportation routes</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => {
                      const encodedAddress = encodeURIComponent(property.address);
                      window.open(`https://maps.google.com/maps?daddr=${encodedAddress}&dirflg=b`, '_blank');
                    }}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Train className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Walking</div>
                        <div className="text-sm text-gray-600">Pedestrian directions</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Nearby Points of Interest */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-red-600" />
                  Nearby Points of Interest
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Coffee className="w-4 h-4 text-brown-600" />
                      <div>
                        <div className="font-medium text-gray-900">Starbucks</div>
                        <div className="text-sm text-gray-600">0.2 miles away</div>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Target</div>
                        <div className="text-sm text-gray-600">0.8 miles away</div>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <School className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Lincoln Elementary</div>
                        <div className="text-sm text-gray-600">0.3 miles away</div>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-600" />
                  Location Details
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">City:</span>
                    <span className="text-sm font-medium text-gray-900">Seattle</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">County:</span>
                    <span className="text-sm font-medium text-gray-900">King County</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ZIP Code:</span>
                    <span className="text-sm font-medium text-gray-900">98101</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Neighborhood:</span>
                    <span className="text-sm font-medium text-gray-900">Downtown</span>
                  </div>
                </div>
              </div>

              {/* Share Location */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  Share Location
                </h4>
                <button 
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(property.address);
                    const shareText = `Check out this property: ${property.address}`;
                    const shareUrl = `https://maps.google.com/?q=${encodedAddress}`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'Property Location',
                        text: shareText,
                        url: shareUrl
                      });
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                      alert('Location copied to clipboard!');
                    }
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neighborhood Modal */}
      {showNeighborhood && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowNeighborhood(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Neighborhood</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNeighborhood(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Walk Score */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Walk Score</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">85</div>
                </div>
                <p className="text-sm text-gray-600">Very Walkable - Most errands can be accomplished on foot</p>
              </div>

              {/* Transit Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Transit Score</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">72</div>
                </div>
                <p className="text-sm text-gray-600">Good Transit - Many nearby public transportation options</p>
              </div>

              {/* Bike Score */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Bike Score</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">78</div>
                </div>
                <p className="text-sm text-gray-600">Very Bikeable - Flat terrain and bike lanes</p>
              </div>

              {/* Schools */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  Nearby Schools
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Lincoln Elementary</div>
                      <div className="text-sm text-gray-600">0.3 miles away</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">8.5/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Central Middle School</div>
                      <div className="text-sm text-gray-600">0.8 miles away</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">7.8/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  Local Amenities
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Coffee className="w-4 h-4 text-brown-600" />
                    <span className="text-sm">Coffee Shops</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Utensils className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Restaurants</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Shopping</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Parks</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Building className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Healthcare</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Wifi className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Internet</span>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-600" />
                  Area Demographics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">32,450</div>
                    <div className="text-xs text-gray-600">Population</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">$78,500</div>
                    <div className="text-xs text-gray-600">Median Income</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">34.2</div>
                    <div className="text-xs text-gray-600">Median Age</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">68%</div>
                    <div className="text-xs text-gray-600">Homeowners</div>
                  </div>
                </div>
              </div>

              {/* Safety */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Safety Rating
                </h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Very Safe</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-green-700">Crime rate is 23% below the national average</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && property.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 text-white">
                <Camera className="w-5 h-5" />
                <span className="font-semibold">Photo Gallery</span>
                <span className="text-sm opacity-75">
                  {galleryImageIndex + 1} of {property.images.length}
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
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={property.images[galleryImageIndex]} 
                alt={`Gallery ${galleryImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setGalleryImageIndex(prev => 
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setGalleryImageIndex(prev => 
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2 justify-center">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setGalleryImageIndex(index)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        index === galleryImageIndex 
                          ? 'border-white' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Navigation Info */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs">
              Use ← → keys or tap arrows to navigate
            </div>
          </div>
        </div>
      )}

      {/* Media Player */}
      {showMediaPlayer && selectedMedia && (
        <MediaPlayer
          url={selectedMedia.url}
          isOpen={showMediaPlayer}
          onClose={() => {
            setShowMediaPlayer(false);
            setSelectedMedia(null);
          }}
          title={selectedMedia.title}
        />
      )}

      {/* VoiceBot */}
      {showVoiceBot && (
        <VoiceBot 
          showFloatingButton={false}
          onOpen={() => setShowVoiceBot(true)}
        />
      )}

      {/* Video Gallery */}
      {showVideoGallery && (
        <VideoGallery
          videos={demoVideos}
          onClose={() => setShowVideoGallery(false)}
        />
      )}

      {/* Video Tour Player */}
      {showVideoTour && (
        <VideoPlayer
          videoUrl="/videos/video_tour.mp4"
          title="Property Video Tour"
          onClose={() => setShowVideoTour(false)}
        />
      )}

      {/* Drone Footage Player */}
      {showDroneFootage && (
        <VideoPlayer
          videoUrl="/videos/drone_footage.mp4"
          title="Drone Aerial Footage"
          onClose={() => setShowDroneFootage(false)}
        />
      )}

      {/* Schools Modal */}
      {showSchools && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Nearby Schools</h2>
                  <p className="text-blue-100">Top-rated schools in the area</p>
                </div>
                <button
                  onClick={() => setShowSchools(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {demoSchools.map((school) => (
                  <div key={school.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{school.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{school.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{school.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{school.type} • {school.grades}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {school.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      <SaveConfirmationModal
        isOpen={showSaveConfirmation}
        onClose={() => setShowSaveConfirmation(false)}
        propertyTitle={property.title}
      />

    </div>
  );
};

export default MobileListingApp; // Force cache bust Thu Jul 31 12:54:14 PDT 2025
