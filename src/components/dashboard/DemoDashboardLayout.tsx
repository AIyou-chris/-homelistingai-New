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
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const DemoDashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/demo-dashboard', icon: HomeIcon },
    { name: 'Leads', href: '/demo-dashboard/leads', icon: UserGroupIcon, badge: 12 },
    { name: 'Communications', href: '/demo-dashboard/communications', icon: UserGroupIcon, badge: 25 },
    { name: 'Listings', href: '/demo-dashboard/listings', icon: HomeModernIcon, badge: 8 },
    { name: 'Appointments', href: '/demo-dashboard/appointments', icon: CalendarIcon, badge: 3 },
    { name: 'Knowledge Base', href: '/demo-dashboard/knowledge-base', icon: DocumentTextIcon },
    { name: 'QR Codes', href: '/demo-dashboard/qr-codes', icon: QrCodeIcon, badge: 5 },
    { name: 'Settings', href: '/demo-dashboard/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>
                Demo Agent Dashboard
              </h1>
              <span className={`ml-4 px-3 py-1 ${isDarkMode ? 'bg-blue-500' : 'bg-sky-500'} text-white text-xs rounded-full`}>
                Demo Mode
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Demo User
              </span>
              {/* Back to Home Button */}
              <Link
                to="/sales"
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl'
                } transform hover:scale-105`}
              >
                🏠 Back to Home
              </Link>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                title="Toggle theme"
              >
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive(item.href)
                      ? `${isDarkMode ? 'border-sky-500 text-sky-400' : 'border-sky-500 text-sky-600'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`
                  }`}
                >
                  <span className="mr-2">
                    {item.name === 'Dashboard' && '📊'}
                    {item.name === 'Leads' && '🎯'}
                    {item.name === 'Communications' && '💬'}
                    {item.name === 'Listings' && '🏠'}
                    {item.name === 'Appointments' && '📅'}
                    {item.name === 'Knowledge Base' && '📚'}
                    {item.name === 'QR Codes' && '📱'}
                    {item.name === 'Settings' && '⚙️'}
                  </span>
                  {item.name}
                  {item.badge && (
                    <span className={`ml-2 ${isDarkMode ? 'bg-red-500' : 'bg-red-100'} ${isDarkMode ? 'text-white' : 'text-red-800'} text-xs font-medium px-2 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden">
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`flex items-center justify-between w-full py-4 px-3 text-left font-medium text-sm transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    {(() => {
                      const activeItem = navigation.find(item => isActive(item.href));
                      if (activeItem) {
                                              if (activeItem.name === 'Dashboard') return '📊';
                      if (activeItem.name === 'Leads') return '🎯';
                      if (activeItem.name === 'Communications') return '💬';
                      if (activeItem.name === 'Listings') return '🏠';
                      if (activeItem.name === 'Appointments') return '📅';
                      if (activeItem.name === 'Knowledge Base') return '📚';
                      if (activeItem.name === 'QR Codes') return '📱';
                      if (activeItem.name === 'Settings') return '⚙️';
                      }
                      return '📊';
                    })()}
                  </span>
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {mobileMenuOpen && (
                <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-slate-700 border border-slate-600' : 'bg-white border border-gray-200'
                }`}>
                  <div className="py-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm transition-colors ${
                          isActive(item.href)
                            ? `${isDarkMode ? 'bg-slate-600 text-sky-400' : 'bg-sky-50 text-sky-600'}`
                            : `${isDarkMode ? 'text-gray-300 hover:bg-slate-600 hover:text-gray-100' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`
                        }`}
                      >
                        <span className="mr-3">
                          {item.name === 'Dashboard' && '📊'}
                          {item.name === 'Leads' && '🎯'}
                          {item.name === 'Communications' && '💬'}
                          {item.name === 'Listings' && '🏠'}
                          {item.name === 'Appointments' && '📅'}
                          {item.name === 'Knowledge Base' && '📚'}
                          {item.name === 'QR Codes' && '📱'}
                          {item.name === 'Settings' && '⚙️'}
                        </span>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className={`ml-2 ${isDarkMode ? 'bg-red-500' : 'bg-red-100'} ${isDarkMode ? 'text-white' : 'text-red-800'} text-xs font-medium px-2 py-0.5 rounded-full`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DemoDashboardLayout; 