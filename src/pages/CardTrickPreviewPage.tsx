import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Home, 
  Phone, 
  Calendar, 
  Send, 
  Bot, 
  User,
  ArrowLeft,
  Sparkles,
  Lock,
  Crown,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Heart,
  Share2,
  Mic,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Home as HomeIcon,
  Info,
  Map,
  GraduationCap,
  Image as GalleryIcon,
  Calculator
} from 'lucide-react';
import VoiceBot from '../components/shared/VoiceBot';
import { PropertyInfo } from '../services/openaiService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PropertyRealtorCard from '../components/PropertyRealtorCard';

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
    whatsSpecialTags?: string[];
    whatsSpecialDescription?: string;
  };
  createdAt: string;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const CardTrickPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AnonymousSession | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSuperpowersTeaser, setShowSuperpowersTeaser] = useState(false);
  const [showVoiceBot, setShowVoiceBot] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [saveTab, setSaveTab] = useState<'ios' | 'android'>('ios');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load anonymous session
    const storedSession = localStorage.getItem('anonymousSession');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      // Redirect to builder if no session
              window.open('https://your-ai-builder-url.com', '_blank');
    }
  }, [navigate]);

  useEffect(() => {
    // Auto-rotate images
    if (session?.propertyData?.images && !showChat) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev + 1 >= (session.propertyData?.images.length || 0) ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [session, showChat]);

  useEffect(() => {
    // Show superpowers teaser after 10 seconds of interaction
    const timer = setTimeout(() => {
      setShowSuperpowersTeaser(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Images for Swiper:', session?.propertyData?.images);
  }, [session]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowSavePopover(false);
      }
    }
    if (showSavePopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSavePopover]);

  const initializeChat = () => {
    setShowChat(true);
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hi! I'm your AI assistant for this ${session?.propertyData?.title}. I can answer basic questions about the property. Try asking me about the price, bedrooms, or location!`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  };

  const getBasicResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const property = session?.propertyData;
    
    if (input.includes('price') || input.includes('cost') || input.includes('$')) {
      return `This beautiful property is listed at ${property?.price}. It's a great value for the area!`;
    }
    
    if (input.includes('bedroom') || input.includes('bed')) {
      return `This home has ${property?.bedrooms} bedrooms, perfect for comfortable living.`;
    }
    
    if (input.includes('bathroom') || input.includes('bath')) {
      return `There are ${property?.bathrooms} bathrooms in this property.`;
    }
    
    if (input.includes('size') || input.includes('sqft') || input.includes('square')) {
      return `The property is ${property?.sqft?.toLocaleString()} square feet of beautifully designed space.`;
    }
    
    if (input.includes('location') || input.includes('where') || input.includes('address')) {
      return `This property is located in a prime area. For the exact address and neighborhood details, please contact ${session?.agentName} at ${session?.agentPhone}.`;
    }
    
    if (input.includes('tour') || input.includes('visit') || input.includes('see')) {
      return `I'd love to arrange a showing for you! Please contact ${session?.agentName} at ${session?.agentPhone} to schedule a tour.`;
    }
    
    if (input.includes('agent') || input.includes('realtor')) {
      return `Your agent is ${session?.agentName} from ${session?.agencyName}. You can reach them at ${session?.agentPhone}.`;
    }
    
    // Default response
    return `That's a great question! For detailed information, please contact ${session?.agentName} at ${session?.agentPhone}. They'll be happy to help you with all the specifics about this property.`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: getBasicResponse(input),
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSuperpowersReveal = () => {
    navigate('/superpowers-reveal');
  };

  const getPropertyInfo = (): PropertyInfo | undefined => {
    if (!session?.propertyData) return undefined;
    return {
      address: session.propertyData.title || '',
      price: session.propertyData.price || '',
      bedrooms: session.propertyData.bedrooms || 0,
      bathrooms: session.propertyData.bathrooms || 0,
      squareFeet: session.propertyData.sqft || 0,
      description: session.propertyData.description || '',
      features: [],
      neighborhood: '',
      schoolDistrict: '',
    };
  };

  const getSwiperImages = () => {
    const imgs = session?.propertyData?.images || [];
    if (imgs.length > 1) return imgs;
    // Fallback: add demo images from public directory
    return [
      ...(imgs.length ? imgs : []),
      '/slider1.png',
      '/slider2.png',
      '/slider3.png'
    ].slice(0, 3);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your AI agent...</p>
        </div>
      </div>
    );
  }

  if (showChat) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button 
            onClick={() => setShowChat(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Property AI Assistant</h2>
            <p className="text-sm text-gray-600">Basic responses • Upgrade for superpowers!</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Limited Features Notice */}
        <div className="bg-yellow-50 border-t border-yellow-200 p-3">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <Lock className="w-4 h-4" />
            <span>Basic mode active • Missing lead capture, analytics, custom personality</span>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about price, bedrooms, location..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Superpowers Teaser */}
        {showSuperpowersTeaser && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 left-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-2xl">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8" />
                <div className="flex-1">
                  <h3 className="font-bold">Ready for Superpowers?</h3>
                  <p className="text-sm opacity-90">You just built a basic AI agent in 30 seconds. Want to see what happens when we give it superpowers?</p>
                </div>
                <button
                  onClick={handleSuperpowersReveal}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Show Me!
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Go Live CTA Button */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <button
            className="w-full py-5 px-8 bg-gradient-to-r from-blue-700 via-purple-800 to-gray-900 animate-pulse text-white text-xl font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.03] transition-all duration-200 border-2 border-white/30"
            style={{ boxShadow: '0 8px 32px 0 rgba(80,0,120,0.18)' }}
            onClick={() => navigate('/new-signup')}
          >
            <span className="text-2xl">🚀</span>
            Go Live & Start Attracting Warm Leads Instantly!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-50 w-full">
        <button 
          className="w-full px-5 py-4 text-white flex items-center justify-center gap-2" 
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => window.dispatchEvent(new Event('open-voice-chat'))}
        >
          <Mic className="w-6 h-6 text-white" />
          <span>Talk With the Home</span>
        </button>
      </div>
      <div className="flex flex-col items-center">
        {/* Image Carousel */}
        {getSwiperImages().length > 0 && (
          <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-2" style={{ maxWidth: '100vw' }}>
            <div className="overflow-hidden shadow-2xl bg-white/10">
              <Swiper
                modules={[EffectFade, Navigation, Pagination, Autoplay]}
                effect="fade"
                navigation={false}
                pagination={{ clickable: true, el: '.custom-swiper-pagination' }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="w-full h-64"
                style={{ borderRadius: 0 }}
              >
                {getSwiperImages().map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-64">
                      <img
                        src={img}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-64 object-cover"
                        style={{ borderRadius: 0, transition: 'box-shadow 0.3s' }}
                      />
                      {/* Top right icons */}
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <div className="relative">
                          <button
                            className="bg-white/80 hover:bg-white rounded-full p-2 shadow"
                            onClick={() => setShowSavePopover(v => !v)}
                            aria-label="Save to Home Screen"
                          >
                            <Heart className="w-5 h-5 text-gray-700" />
                          </button>
                          {showSavePopover && (
                            <div
                              ref={popoverRef}
                              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-fade-in"
                              onClick={e => e.stopPropagation()}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex gap-2">
                                  <button
                                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${saveTab === 'ios' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                                    onClick={e => { e.stopPropagation(); setSaveTab('ios'); }}
                                  >
                                    iOS
                                  </button>
                                  <button
                                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${saveTab === 'android' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                    onClick={e => { e.stopPropagation(); setSaveTab('android'); }}
                                  >
                                    Android
                                  </button>
                                </div>
                                <button
                                  className="text-gray-400 hover:text-gray-700 text-lg font-bold ml-2"
                                  onClick={() => setShowSavePopover(false)}
                                  aria-label="Close"
                                >
                                  ×
                                </button>
                              </div>
                              {saveTab === 'ios' ? (
                                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                                  <li>Tap the <span className="inline-block align-middle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline"><path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg></span> Share icon.</li>
                                  <li>Scroll down and tap <b>"Add to Home Screen"</b>.</li>
                                  <li>Tap <b>Add</b> in the top right.</li>
                                </ol>
                              ) : (
                                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                                  <li>Tap the <b>three-dot menu</b> (top right).</li>
                                  <li>Tap <b>"Add to Home screen"</b>.</li>
                                  <li>Tap <b>Add</b>.</li>
                                </ol>
                              )}
                              <div className="mt-3 text-xs text-gray-400 text-center">This lets you launch HomeListingAI like an app from your home screen.</div>
                            </div>
                          )}
                        </div>
                        <button 
                          className="bg-white/80 hover:bg-white rounded-full p-2 shadow"
                          onClick={async () => {
                            const shareData = {
                              title: session?.propertyData?.title || 'Check out this property!',
                              text: session?.propertyData?.description || 'Found this amazing property on HomeListingAI!',
                              url: session?.propertyUrl || window.location.href,
                            };
                            if (navigator.share) {
                              try {
                                await navigator.share(shareData);
                              } catch (err) {
                                // User cancelled or error
                              }
                            } else {
                              navigator.clipboard.writeText(shareData.url);
                              alert('Property link copied!');
                            }
                          }}
                          aria-label="Share Property"
                        >
                          <Share2 className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom pagination dots */}
              <div className="custom-swiper-pagination flex justify-center gap-2 py-2 absolute bottom-2 left-0 right-0 z-20"></div>
            </div>
          </div>
        )}

        {/* Property Info Card */}
        <div className="w-full max-w-2xl mx-auto px-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-2 mb-4 border border-gray-100">
            {/* Title and Price */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {typeof session?.propertyData?.title === 'object' ? JSON.stringify(session.propertyData.title) : session?.propertyData?.title || 'Property Title'}
              </h1>
              <div className="flex flex-col sm:items-end">
                <span className="text-2xl sm:text-3xl font-bold text-blue-700">
                  {typeof session?.propertyData?.price === 'object' ? JSON.stringify(session.propertyData.price) : session?.propertyData?.price || '$X,XXX,XXX'}
                </span>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="truncate">{session?.propertyData?.title || '123 Main St, City, State'}</span>
            </div>
            {/* Icons Row */}
            <div className="flex justify-between text-center mb-4">
              <div className="flex-1">
                <BedDouble className="w-6 h-6 mx-auto text-blue-600" />
                <div className="text-lg font-bold text-blue-700">{session?.propertyData?.bedrooms ?? '--'}</div>
                <div className="text-xs text-blue-600">Bedrooms</div>
              </div>
              <div className="flex-1">
                <Bath className="w-6 h-6 mx-auto text-blue-600" />
                <div className="text-lg font-bold text-blue-700">{session?.propertyData?.bathrooms ?? '--'}</div>
                <div className="text-xs text-blue-600">Bathrooms</div>
              </div>
              <div className="flex-1">
                <Ruler className="w-6 h-6 mx-auto text-blue-600" />
                <div className="text-lg font-bold text-blue-700">{session?.propertyData?.sqft?.toLocaleString() ?? '--'}</div>
                <div className="text-xs text-blue-600">Sq Ft</div>
              </div>
            </div>
            {/* Description */}
            {session?.propertyData?.description && (
              <div className="text-gray-700 leading-relaxed text-sm">
                {session.propertyData.description.length > 160 ? (
                  <>
                    {session.propertyData.description.slice(0, 160)}...
                    <button className="text-blue-600 font-semibold ml-1 hover:underline text-xs">Read More</button>
                  </>
                ) : (
                  session.propertyData.description
                )}
              </div>
            )}
            {/* What's Special Tags */}
            {Array.isArray(session?.propertyData?.whatsSpecialTags) && session.propertyData.whatsSpecialTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {session.propertyData.whatsSpecialTags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{tag}</span>
                ))}
              </div>
            )}
            {/* What's Special Description */}
            {session?.propertyData?.whatsSpecialDescription && (
              <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-900 rounded">
                <strong>What’s Special:</strong> {session.propertyData.whatsSpecialDescription}
              </div>
            )}
          </div>
        </div>

        {/* Talk to the Home Button */}
        {showVoiceBot && (
          <VoiceBot open={showVoiceBot} setOpen={setShowVoiceBot} propertyInfo={getPropertyInfo()} />
        )}

        {/* Directions Button (replaces map) */}
        <div className="w-full max-w-2xl mx-auto grid grid-cols-2 gap-4 px-2 mb-4">
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-blue-50 transition col-span-2">
            <span className="bg-blue-100 rounded-full p-3 mb-2"><MapPin className="w-6 h-6 text-blue-600" /></span>
            <span className="font-semibold text-blue-700 text-lg">Directions to the Home</span>
          </button>
        </div>
        {/* Feature Grid */}
        <div className="w-full max-w-2xl mx-auto grid grid-cols-2 gap-4 px-2 mb-8">
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-blue-50 transition" onClick={() => setShowFeatureModal(true)}>
            <span className="bg-green-100 rounded-full p-3 mb-2"><Phone className="w-6 h-6 text-green-600" /></span>
            <span className="font-semibold text-gray-900">Call Agent</span>
            <span className="text-xs text-gray-500 mt-1">Direct line</span>
          </button>
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-orange-50 transition" onClick={() => setShowFeatureModal(true)}>
            <span className="bg-orange-100 rounded-full p-3 mb-2"><Calendar className="w-6 h-6 text-orange-600" /></span>
            <span className="font-semibold text-gray-900">Schedule Tour</span>
            <span className="text-xs text-gray-500 mt-1">Private showing</span>
          </button>
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-blue-50 transition" onClick={() => setShowFeatureModal(true)}>
            <span className="bg-blue-100 rounded-full p-3 mb-2"><Info className="w-6 h-6 text-blue-600" /></span>
            <span className="font-semibold text-gray-900">Property Details</span>
            <span className="text-xs text-gray-500 mt-1">Full specs</span>
          </button>
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-purple-50 transition" onClick={() => setShowFeatureModal(true)}>
            <span className="bg-purple-100 rounded-full p-3 mb-2"><Map className="w-6 h-6 text-purple-600" /></span>
            <span className="font-semibold text-gray-900">Neighborhood</span>
            <span className="text-xs text-gray-500 mt-1">Local insights</span>
          </button>
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-pink-50 transition" onClick={() => setShowFeatureModal(true)}>
            <span className="bg-pink-100 rounded-full p-3 mb-2"><GalleryIcon className="w-6 h-6 text-pink-600" /></span>
            <span className="font-semibold text-gray-900">Gallery</span>
            <span className="text-xs text-gray-500 mt-1">All photos</span>
          </button>
          <button className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-yellow-50 transition" onClick={() => setShowFeatureModal(true)}>
            <span className="bg-yellow-100 rounded-full p-3 mb-2"><Calculator className="w-6 h-6 text-yellow-600" /></span>
            <span className="font-semibold text-gray-900">Mortgage Calculator</span>
            <span className="text-xs text-gray-500 mt-1">Estimate payments</span>
          </button>
        </div>

        {/* Feature Modal Popover */}
        {showFeatureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border-2 border-blue-700 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl font-bold focus:outline-none"
                onClick={() => setShowFeatureModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <Sparkles className="w-12 h-12 text-blue-700 mb-4" />
              <div className="text-2xl font-extrabold text-blue-900 mb-2 text-center">Coming Soon!</div>
              <div className="text-lg text-blue-700 text-center mb-4">This feature will be available in your live app!</div>
              <button
                className="mt-2 px-6 py-2 bg-blue-700 text-white rounded-2xl font-semibold shadow hover:bg-blue-800 transition"
                onClick={() => setShowFeatureModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="w-full max-w-2xl mx-auto grid grid-cols-2 gap-4 px-2 mb-4">
          <button
            className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-5 hover:bg-blue-50 transition col-span-2"
            onClick={() => {
              navigator.clipboard.writeText(session.propertyUrl);
              alert('Property link copied!');
            }}
          >
            <span className="bg-blue-100 rounded-full p-3 mb-2"><Send className="w-6 h-6 text-blue-600" /></span>
            <span className="font-semibold text-blue-700 text-lg">Share Listing</span>
          </button>
        </div>

        {/* Realtor Card - New Design */}
        <div className="mb-4 w-full max-w-2xl mx-auto">
          <PropertyRealtorCard
            name={session.agentName || 'Agent Name'}
            subtitle={session.agencyName || 'REALTOR®'}
            phone={session.agentPhone || '(555) 123-4567'}
            email={"agent@example.com"}
            website={"www.agentwebsite.com"}
            tagline={"Helping you find your dream home."}
            imageUrl={"/realtor.png"}
            socials={{
              facebook: "https://facebook.com/agent",
              instagram: "https://instagram.com/agent",
              twitter: "https://twitter.com/agent"
            }}
          />
        </div>
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="rounded-2xl shadow-2xl p-0 overflow-hidden border border-blue-900 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
            <div className="px-6 py-4 border-b border-blue-800 flex items-center gap-3">
              <span className="bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-lg">AI</span>
              <span className="text-white font-semibold text-lg">Chat with our AI Agent</span>
            </div>
            <div className="h-64 overflow-y-auto px-6 py-4 space-y-3">
              <div className="flex justify-start">
                <div className="bg-blue-800 text-white px-4 py-2 rounded-2xl max-w-xs">
                  Hi! 👋 I'm your AI real estate assistant. Ask me anything about this property or the area!
                </div>
              </div>
              {/* Example user message */}
              <div className="flex justify-end">
                <div className="bg-blue-300 text-blue-900 px-4 py-2 rounded-2xl max-w-xs">
                  What are the schools like nearby?
                </div>
              </div>
              {/* Example AI response */}
              <div className="flex justify-start">
                <div className="bg-blue-800 text-white px-4 py-2 rounded-2xl max-w-xs">
                  The local schools are highly rated, with Cashmere High School scoring 8/10. Would you like more details?
                </div>
              </div>
            </div>
            <div className="border-t border-blue-800 bg-blue-800 px-6 py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-900 text-white placeholder-blue-300"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-2xl transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Listing Build Complete - Choice Buttons */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Listing Built Successfully!</h3>
              <p className="text-gray-600">Your AI listing is ready. Choose your next step:</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stay Demo Button */}
              <button
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3"
                onClick={() => {
                  // Set demo mode and navigate to dashboard
                  localStorage.setItem('demo_mode', 'true');
                  localStorage.setItem('demo_expires_at', new Date(Date.now() + 30 * 60 * 1000).toISOString());
                  navigate('/dashboard');
                }}
              >
                <span className="text-xl">⏰</span>
                <div className="text-left">
                  <div className="font-bold">Stay Demo</div>
                  <div className="text-xs opacity-90">30 min trial</div>
                </div>
              </button>
              
              {/* Go Live Button */}
              <button
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-3"
                onClick={() => navigate('/checkout')}
              >
                <span className="text-xl">🚀</span>
                <div className="text-left">
                  <div className="font-bold">Go Live</div>
                  <div className="text-xs opacity-90">$59/month</div>
                </div>
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Demo expires in 30 minutes • Go Live keeps your AI forever
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
              <Home className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Preview</span>
            </button>
            
            <button 
              onClick={initializeChat}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100"
            >
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Chat AI</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Tour</span>
            </button>
            
            <button 
              onClick={() => navigate('/new-signup')}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100 bg-gradient-to-r from-purple-50 to-pink-50"
            >
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Upgrade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTrickPreviewPage; 