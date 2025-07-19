import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { SunIcon, MoonIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import * as leadService from '../services/leadService';
import { getFollowUpStats } from '../services/followupService';
import { Lead } from '../types';

// Admin Components
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminListingManagement = lazy(() => import('../components/admin/AdminListingManagement'));
const AdminAppointmentOversight = lazy(() => import('../components/admin/AdminAppointmentOversight'));
const AdminMarketing = lazy(() => import('../components/admin/AdminMarketing'));
const AdminMessageCenter = lazy(() => import('../components/admin/AdminMessageCenter'));
const AdminAnalytics = lazy(() => import('../components/admin/AdminAnalytics'));
const AdminAIControlCenter = lazy(() => import('./dashboard/AIControlCenter'));

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followUpStats, setFollowUpStats] = useState<{ [leadId: string]: { status: string; nextDate?: string } }>({});

  useEffect(() => {
    if (activeTab === 'leads') {
      (async () => {
        const data = await leadService.getLeads();
        setLeads(data);
        // Fetch follow-up status for all leads
        const stats: { [leadId: string]: { status: string; nextDate?: string } } = {};
        for (const lead of data) {
          try {
            // Skip follow-up stats for demo leads to prevent errors
            if (lead.id.includes('-demo')) {
              stats[lead.id] = { status: 'none' };
              continue;
            }
            
            const stat = await getFollowUpStats(lead.id);
            let status = 'none';
            let nextDate = undefined;
            if (stat.totalScheduled > 0) {
              status = 'scheduled';
              if (stat.nextFollowUp) nextDate = stat.nextFollowUp.scheduled_date;
            } else if (stat.totalSent > 0) {
              status = 'sent';
            } else if (stat.totalCancelled > 0) {
              status = 'cancelled';
            }
            stats[lead.id] = { status, nextDate };
          } catch (error) {
            console.warn(`Skipping follow-up stats for lead ${lead.id}:`, error);
            stats[lead.id] = { status: 'none' };
          }
        }
        setFollowUpStats(stats);
      })();
    }
  }, [activeTab]);

  const getFollowUpBadge = (leadId: string) => {
    const stat = followUpStats[leadId];
    if (!stat) return <span className="text-gray-400">-</span>;
    if (stat.status === 'scheduled') return <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Scheduled{stat.nextDate ? `: ${new Date(stat.nextDate).toLocaleDateString()}` : ''}</span>;
    if (stat.status === 'sent') return <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">All Sent</span>;
    if (stat.status === 'cancelled') return <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Cancelled</span>;
    return <span className="text-gray-400">-</span>;
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'listings', label: 'Listing Management', icon: '🏠' },
    { id: 'appointments', label: 'Appointment Oversight', icon: '📅' },
    { id: 'marketing', label: 'Marketing & Communications', icon: '📧' },
    { id: 'messages', label: 'Message Center', icon: '💬' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'ai', label: 'AI Control Center', icon: '🤖' },
    { id: 'leads', label: 'Leads', icon: '📝' },
  ];

  // Allow access for admin-test route, otherwise check role
  const isAdminTestRoute = location.pathname === '/admin-test';
  const hasAdminAccess = isAdminTestRoute || (user && user.role === 'admin');

  if (!hasAdminAccess) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>Access Denied</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-sky-400' : 'text-gray-900'}`}>Admin Dashboard</h1>
              <span className={`ml-4 px-3 py-1 ${isDarkMode ? 'bg-red-500' : 'bg-red-600'} text-white text-xs rounded-full`}>
                Admin Mode
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Logged in as: {user?.name || user?.email || 'Admin User'}
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
          {activeTab === 'messages' && <AdminMessageCenter />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'ai' && <AdminAIControlCenter />}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Leads</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-100 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{lead.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getFollowUpBadge(lead.id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </React.Suspense>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 