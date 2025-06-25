import React from 'react';
import { X, Image, MapPin, Calendar, Phone, MessageCircle, Info, Home, Search, Heart, User, Map, DollarSign, School, Bus, ShoppingBag, Share2, Brain } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick: (item: string) => void;
}

export function MobileMenu({ isOpen, onClose, onMenuItemClick }: MobileMenuProps) {
  if (!isOpen) return null;

  const propertyActions = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'gallery', label: 'Photo Gallery', icon: <Image size={20} /> },
    { id: 'map-view', label: 'Map View', icon: <Map size={20} /> },
    { id: 'price-history', label: 'Price History', icon: <DollarSign size={20} /> },
  ];

  const neighborhoodInfo = [
    { id: 'neighborhood', label: 'Neighborhood', icon: <MapPin size={20} /> },
    { id: 'schools', label: 'Schools', icon: <School size={20} /> },
    { id: 'transportation', label: 'Transportation', icon: <Bus size={20} /> },
    { id: 'amenities', label: 'Local Amenities', icon: <ShoppingBag size={20} /> },
  ];

  const agentActions = [
    { id: 'contact', label: 'Contact Agent', icon: <Phone size={20} /> },
    { id: 'showing', label: 'Schedule Showing', icon: <Calendar size={20} /> },
    { id: 'chat-ai', label: 'Chat with AI', icon: <Brain size={20} /> },
  ];

  const userActions = [
    { id: 'save', label: 'Save Property', icon: <Heart size={20} /> },
    { id: 'share', label: 'Share', icon: <Share2 size={20} /> },
    { id: 'search', label: 'Search Properties', icon: <Search size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto h-full">
          {/* Property Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Property</h3>
            <div className="space-y-2">
              {propertyActions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onMenuItemClick(item.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-gray-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhood Information */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Neighborhood</h3>
            <div className="space-y-2">
              {neighborhoodInfo.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onMenuItemClick(item.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-gray-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Agent Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Get in Touch</h3>
            <div className="space-y-2">
              {agentActions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onMenuItemClick(item.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-gray-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">My Account</h3>
            <div className="space-y-2">
              {userActions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onMenuItemClick(item.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-gray-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 