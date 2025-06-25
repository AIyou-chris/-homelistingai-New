import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Menu, Calendar, MapPin, MessageCircle, Phone, X, ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react';
import { MediaSlider } from '../components/MediaSlider';
import { PropertyInfo, NeighborhoodInfo } from '../components/PropertyInfo';
import { RealtorCard } from '../components/RealtorCard';
import { StickyButtons } from '../components/StickyButtons';
import { MobileMenu } from '../components/MobileMenu';
import { ChatInterface } from '../components/ChatInterface';
import { toast } from "sonner";
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function MobileDemoApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ type: 'image' | 'video'; index?: number } | null>(null);
  const navigate = useNavigate();

  const galleryImages = [1,2,3,4,5,6,7].map(num => `/slider${num}.png`);

  const handleTalkToHouse = () => {
    setIsChatOpen(true);
    toast.success('AI Assistant is ready to help!');
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleMenuItemClick = (item: string) => {
    setIsMobileMenuOpen(false);
    switch (item) {
      case 'home':
        toast.info('Returning to property overview...');
        break;
      case 'gallery':
        toast.info('Opening photo gallery...');
        break;
      case 'map-view':
        navigate('/map-search');
        break;
      case 'price-history':
        toast.info('Loading price history and market trends...');
        break;
      case 'neighborhood':
        toast.info('Loading neighborhood information...');
        break;
      case 'schools':
        toast.info('Loading school information...');
        break;
      case 'transportation':
        toast.info('Loading transportation options...');
        break;
      case 'amenities':
        toast.info('Loading local amenities...');
        break;
      case 'contact':
        toast.info('Opening agent contact options...');
        break;
      case 'showing':
        toast.info('Opening booking calendar...');
        break;
      case 'chat-ai':
        setIsChatOpen(true);
        toast.success('AI Assistant is ready to help!');
        break;
      case 'save':
        toast.success('Property saved to favorites!');
        break;
      case 'share':
        toast.info('Opening share options...');
        break;
      case 'search':
        toast.info('Opening property search...');
        break;
      case 'profile':
        toast.info('Opening user profile...');
        break;
      default:
        toast.info(`Opening ${item}...`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Lightbox Modal */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button
            className="absolute top-4 right-4 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-70"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          {lightbox.type === 'image' && typeof lightbox.index === 'number' && (
            <div className="flex flex-col items-center w-full h-full justify-center">
              <div className="flex items-center w-full justify-center">
                <button
                  className="p-2 text-white disabled:opacity-30"
                  onClick={() => setLightbox({ type: 'image', index: (lightbox.index ?? 0) - 1 })}
                  disabled={lightbox.index === 0}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={36} />
                </button>
                <img
                  src={galleryImages[lightbox.index!]} 
                  alt={`Gallery ${lightbox.index! + 1}`}
                  className="w-full h-full object-contain select-none cursor-pointer"
                  style={{ maxWidth: '100vw', maxHeight: '100vh', background: 'rgba(0,0,0,0.01)' }}
                  onClick={() => {
                    if (lightbox.index! < galleryImages.length - 1) {
                      setLightbox({ type: 'image', index: lightbox.index! + 1 });
                    } else {
                      setLightbox(null);
                    }
                  }}
                />
                <button
                  className="p-2 text-white disabled:opacity-30"
                  onClick={() => setLightbox({ type: 'image', index: (lightbox.index ?? 0) + 1 })}
                  disabled={lightbox.index === galleryImages.length - 1}
                  aria-label="Next image"
                >
                  <ChevronRight size={36} />
                </button>
              </div>
              <div className="text-white mt-2 text-sm absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 px-4 py-1 rounded-full">
                {lightbox.index! + 1} / {galleryImages.length}
              </div>
            </div>
          )}
          {lightbox.type === 'video' && (
            <div className="w-[90vw] max-w-2xl aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/LZG8smD-h7w?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ display: 'block', width: '100%', height: '100%' }}
              ></iframe>
            </div>
          )}
        </div>
      )}
      {/* Header - Mobile Optimized */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center sm:w-8 sm:h-8">
              <span className="text-white font-bold text-xs sm:text-sm">H</span>
            </div>
            <h1 className="font-semibold text-gray-900 text-sm sm:text-base">HomeListingAI</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </header>
      {/* Hero Media Slider */}
      <MediaSlider onTalkToHouse={handleTalkToHouse} />
      {/* Main Content */}
      <main className="pb-32 sm:pb-24">
        <PropertyInfo />
        
        {/* Quick Actions */}
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
          
          {/* Primary AI Actions */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={handleTalkToHouse}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Talk to House AI</div>
                  <div className="text-sm opacity-90">Ask questions about this property</div>
                </div>
              </div>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button 
              onClick={handleOpenChat}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Voice Chat</div>
                  <div className="text-sm opacity-90">Speak with AI assistant</div>
                </div>
              </div>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* AI Prompt Suggestions */}
          <div className="px-4 pb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Try asking AI about:</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleTalkToHouse}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                "What's the neighborhood like?"
              </button>
              <button 
                onClick={handleTalkToHouse}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                "Tell me about schools nearby"
              </button>
              <button 
                onClick={handleTalkToHouse}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                "What are the property taxes?"
              </button>
              <button 
                onClick={handleTalkToHouse}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                "Compare to similar homes"
              </button>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <Calendar className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Schedule Tour</span>
            </button>
            <button 
              onClick={() => navigate('/map-search')}
              className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <MapPin className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Map Search</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group relative">
              <Heart className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Save</span>
              <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-white border border-gray-200 rounded shadow px-3 py-1 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Save to Home & get AI reminders
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Share2 className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Share</span>
            </button>
          </div>
        </div>
        
        {/* Gallery Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base sm:mb-4">Gallery</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Gallery ${idx + 1}`}
                className="w-32 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80"
                onClick={() => setLightbox({ type: 'image', index: idx })}
              />
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base sm:mb-4">Property Video Tour</h3>
          <div
            className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80"
            onClick={() => setLightbox({ type: 'video' })}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/LZG8smD-h7w"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </div>
        
        <RealtorCard />
        
        {/* Additional Content Sections */}
        <div className="mx-3 mt-4 space-y-4 sm:mx-4 sm:mt-6">
          {/* Property Highlights */}
          <div className="bg-white rounded-2xl p-4 shadow-sm sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base sm:mb-4">Property Highlights</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm sm:text-base">Recently renovated kitchen</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm sm:text-base">Private backyard with garden</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm sm:text-base">Walking distance to trendy cafes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm sm:text-base">2-car garage with storage</span>
              </div>
            </div>
          </div>

          {/* Neighborhood Information */}
          <NeighborhoodInfo />
        </div>
      </main>
      {/* Sticky Floating Buttons */}
      <StickyButtons 
        onOpenChat={handleOpenChat}
        onTalkToHouse={handleTalkToHouse}
      />
      {/* Floating AI Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={handleTalkToHouse}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* Chat Interface */}
      {isChatOpen && (
        <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onMenuItemClick={handleMenuItemClick} />
      )}
      {/* Bottom Navigation */}
      <BottomNav 
        onHomeClick={() => {
          // Scroll to top of property info
          window.scrollTo({ top: 0, behavior: 'smooth' });
          toast.info('Returning to property overview...');
        }}
        onBookShowingClick={() => {
          toast.info('Opening booking calendar...');
          // You could open the consultation modal here
        }}
        onContactClick={() => {
          toast.info('Opening agent contact options...');
          // You could open contact modal or show contact info
        }}
        onShareClick={() => {
          toast.info('Opening share options...');
          // You could implement native sharing or show share modal
        }}
      />
    </div>
  );
} 