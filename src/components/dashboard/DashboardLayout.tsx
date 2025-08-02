import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  HomeModernIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  QrCodeIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  HeartIcon,
  MicrophoneIcon,
  PhoneIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';
import { Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../shared/NotificationCenter';
import InstallAppModal from '../shared/InstallAppModal';
import ChatBot from '../shared/ChatBot';
import VoiceBot from '../shared/VoiceBot';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isDemoRoute = location.pathname.includes('demo-dashboard');

  const navigation: NavItem[] = [
    { name: 'Overview', href: isDemoRoute ? '/demo-dashboard' : '/dashboard', icon: HomeIcon },
    { name: 'Leads & Appointments', href: isDemoRoute ? '/demo-dashboard/leads-appointments' : '/dashboard/leads-appointments', icon: UserGroupIcon, badge: 15 },
    { name: 'Listings', href: isDemoRoute ? '/demo-dashboard/listings' : '/dashboard/listings', icon: HomeModernIcon },
    { name: 'AI Chat & Assist', href: isDemoRoute ? '/demo-dashboard/ai' : '/dashboard/ai', icon: CpuChipIcon },
    { name: 'Knowledge Base', href: isDemoRoute ? '/demo-dashboard/knowledge-base' : '/dashboard/knowledge-base', icon: DocumentTextIcon },
    { name: 'Marketing', href: isDemoRoute ? '/demo-dashboard/marketing' : '/dashboard/marketing', icon: MegaphoneIcon },
    { name: 'Settings', href: isDemoRoute ? '/demo-dashboard/settings' : '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img 
                  src="/newlogo.png" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">HomeListingAI</h1>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'sarah@homelistingai.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Chat Bot Button */}
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                title="AI Chat Assistant"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
              </button>
              
              {/* Voice Bot Button */}
              <button
                onClick={() => setVoiceOpen(!voiceOpen)}
                className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                title="AI Voice Assistant"
              >
                <MicrophoneIcon className="w-6 h-6" />
              </button>
              
              {/* Notification Center */}
              <NotificationCenter />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`mr-3 h-6 w-6 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lower Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'S'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Sarah Martinez'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'sarah@homelistingai.com'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Install App Button */}
              <button
                onClick={() => setInstallModalOpen(true)}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                title="Install App"
              >
                <HeartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </div>

      {/* Install App Modal */}
      <InstallAppModal 
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
      
      {/* AI Chat Bot */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBot 
            onLeadCapture={(lead) => {
              console.log('Lead captured from chat:', lead);
              // TODO: Handle lead capture
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

export default DashboardLayout; 