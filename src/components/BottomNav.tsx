import React from 'react';
import { Home, Calendar, Phone, Share2 } from 'lucide-react';

interface BottomNavProps {
  onHomeClick?: () => void;
  onBookShowingClick?: () => void;
  onContactClick?: () => void;
  onShareClick?: () => void;
}

export default function BottomNav({ 
  onHomeClick, 
  onBookShowingClick, 
  onContactClick, 
  onShareClick 
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 sm:hidden">
      <div className="flex items-center justify-around py-2">
        <button 
          onClick={onHomeClick}
          className="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700"
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={onBookShowingClick}
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">Book Showing</span>
        </button>
        <button 
          onClick={onContactClick}
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <Phone size={20} />
          <span className="text-xs mt-1">Contact</span>
        </button>
        <button 
          onClick={onShareClick}
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <Share2 size={20} />
          <span className="text-xs mt-1">Share</span>
        </button>
      </div>
    </div>
  );
} 