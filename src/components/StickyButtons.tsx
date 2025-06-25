import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface StickyButtonsProps {
  onOpenChat: () => void;
  onTalkToHouse: () => void;
}

export function StickyButtons({ onOpenChat, onTalkToHouse }: StickyButtonsProps) {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 sm:hidden">
      <button
        onClick={onTalkToHouse}
        className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        style={{
          background: 'rgba(37, 99, 235, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="Talk to the House"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
} 