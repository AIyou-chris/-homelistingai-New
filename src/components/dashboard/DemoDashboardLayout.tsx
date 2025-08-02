import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  HomeModernIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon, 
  QrCodeIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MicrophoneIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import ChatBot from '../shared/ChatBot';
import VoiceBot from '../shared/VoiceBot';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const DemoDashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const location = useLocation();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/demo-dashboard', icon: HomeIcon },
    { name: 'Leads', href: '/demo-dashboard/leads', icon: UserGroupIcon, badge: 12 },
    { name: 'Listings', href: '/demo-dashboard/listings', icon: HomeModernIcon },
    { name: 'AI Chat & Assist', href: '/demo-dashboard/ai', icon: CpuChipIcon },
    { name: 'Knowledge Base', href: '/demo-dashboard/knowledge-base', icon: DocumentTextIcon },
    { name: 'QR Codes', href: '/demo-dashboard/qr-codes', icon: QrCodeIcon },
    { name: 'Settings', href: '/demo-dashboard/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/newlogo.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* AI Assistant Buttons */}
            <div className="flex items-center space-x-2">
              {/* Chat Bot Button */}
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="p-2 text-gray-300 hover:text-blue-400 transition-colors"
                title="AI Chat Assistant"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </button>
              
              {/* Voice Bot Button */}
              <button
                onClick={() => setVoiceOpen(!voiceOpen)}
                className="p-2 text-gray-300 hover:text-green-400 transition-colors"
                title="AI Voice Assistant"
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {sidebarOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-xl border-b border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
      
      {/* AI Chat Bot */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBot 
            onLeadCapture={(lead) => {
              console.log('Lead captured from demo chat:', lead);
              // TODO: Handle lead capture for demo
            }}
          />
        </div>
      )}
      
      {/* AI Voice Bot */}
      {voiceOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <VoiceBot showFloatingButton={false} />
        </div>
      )}
    </div>
  );
};

export default DemoDashboardLayout; 