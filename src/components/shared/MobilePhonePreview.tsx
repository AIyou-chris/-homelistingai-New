import React from 'react';
import { ArrowLeft, Home, School, MapPin, Calculator, Calendar, Star, Phone, Mail, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobilePhonePreviewProps {
  listingData: {
    title?: string;
    address?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    description?: string;
    agentName?: string;
    agentPhone?: string;
    agentEmail?: string;
    agentPhoto?: string;
  };
  onClose: () => void;
}

const MobilePhonePreview: React.FC<MobilePhonePreviewProps> = ({ listingData, onClose }) => {
  const formatPrice = (price?: number) => {
    if (!price) return '$450,000';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Background with gradient woodwork and faint chart */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(251, 191, 36, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)
          `
        }}
      >
        {/* Faint growth chart background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1000 600">
            {/* Growth line */}
            <path
              d="M50,550 Q200,400 400,300 T750,150 T950,100"
              stroke="url(#growthGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Rocket icon */}
            <g transform="translate(950, 100)">
              <path
                d="M0,-20 L-5,0 L5,0 Z M-3,0 L3,0 L0,15 Z"
                fill="url(#rocketGradient)"
                opacity="0.3"
              />
            </g>
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Phone frame */}
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* iPhone Max Pro frame */}
        <div className="relative w-[440px] h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            {/* App content */}
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">HomeListingAI</span>
                  </div>
                  <Share2 className="w-5 h-5" />
                </div>
              </div>

              {/* Hero image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-2xl font-bold">{formatPrice(listingData.price)}</div>
                  <div className="text-sm opacity-90">{listingData.address || '123 Main Street, City, State'}</div>
                </div>
              </div>

              {/* Property details */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{listingData.bedrooms || 3} beds</span>
                  <span>{listingData.bathrooms || 2} baths</span>
                  <span>{listingData.squareFootage || 1500} sqft</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {listingData.description || 'Beautiful property with modern amenities and great location. Perfect for families or investors.'}
                </p>

                {/* App buttons grid */}
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <School className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-xs font-medium text-blue-700">Schools</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <MapPin className="w-6 h-6 text-green-600 mb-1" />
                    <span className="text-xs font-medium text-green-700">Neighborhood</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Calculator className="w-6 h-6 text-purple-600 mb-1" />
                    <span className="text-xs font-medium text-purple-700">Financing</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <Calendar className="w-6 h-6 text-orange-600 mb-1" />
                    <span className="text-xs font-medium text-orange-700">Schedule</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                    <Star className="w-6 h-6 text-pink-600 mb-1" />
                    <span className="text-xs font-medium text-pink-700">Amenities</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                    <Phone className="w-6 h-6 text-indigo-600 mb-1" />
                    <span className="text-xs font-medium text-indigo-700">Contact</span>
                  </button>
                </div>

                {/* Agent card */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {listingData.agentName ? listingData.agentName.charAt(0) : 'A'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {listingData.agentName || 'Agent Name'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {listingData.agentPhone || '(555) 123-4567'}
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white p-2 rounded-full">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobilePhonePreview; 