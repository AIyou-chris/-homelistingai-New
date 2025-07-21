import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { SunIcon, MoonIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Admin Components - Restoring all the original components you built
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminListingManagement = lazy(() => import('../components/admin/AdminListingManagement'));
const AdminAppointmentOversight = lazy(() => import('../components/admin/AdminAppointmentOversight'));
const AdminMarketing = lazy(() => import('../components/admin/AdminMarketing'));
const AdminAnalytics = lazy(() => import('../components/admin/AdminAnalytics'));
const AdminAIControlCenter = lazy(() => import('./dashboard/AIControlCenter'));

const DemoAdminDashboardPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'listings', label: 'Listing Management', icon: '🏠' },
    { id: 'appointments', label: 'Appointment Oversight', icon: '📅' },
    { id: 'marketing', label: 'Marketing & Communications', icon: '📧' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'ai', label: 'AI Control Center', icon: '🤖' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>Admin Dashboard</h1>
              <span className={`ml-4 px-3 py-1 ${isDarkMode ? 'bg-green-500' : 'bg-green-600'} text-white text-xs rounded-full`}>
                Demo Mode
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Demo Admin: support@homelistingai.com
              </span>
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? `${isDarkMode ? 'border-sky-500 text-sky-400' : 'border-sky-500 text-sky-600'}`
                    : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
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
                    {tabs.find(tab => tab.id === activeTab)?.icon || '👥'}
                  </span>
                  {tabs.find(tab => tab.id === activeTab)?.label || 'User Management'}
                </span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {mobileMenuOpen && (
                <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-slate-700 border border-slate-600' : 'bg-white border border-gray-200'
                }`}>
                  <div className="py-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                          activeTab === tab.id
                            ? `${isDarkMode ? 'bg-slate-600 text-sky-400' : 'bg-sky-50 text-sky-600'}`
                            : `${isDarkMode ? 'text-gray-300 hover:bg-slate-600 hover:text-gray-100' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        <span className="flex-1 text-left">{tab.label}</span>
                      </button>
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
        <React.Suspense fallback={<LoadingSpinner size="lg" />}>
          {activeTab === 'users' && <AdminUserManagement />}
          {activeTab === 'listings' && <AdminListingManagement />}
          {activeTab === 'appointments' && <AdminAppointmentOversight />}
          {activeTab === 'marketing' && <AdminMarketing />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'ai' && <AdminAIControlCenter />}
        </React.Suspense>
      </div>
    </div>
  );
};

export default DemoAdminDashboardPage; 