import React, { useState, lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Admin Components
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminListingManagement = lazy(() => import('../components/admin/AdminListingManagement'));
const AdminAppointmentOversight = lazy(() => import('../components/admin/AdminAppointmentOversight'));
const AdminMarketing = lazy(() => import('../components/admin/AdminMarketing'));
const AdminAnalytics = lazy(() => import('../components/admin/AdminAnalytics'));

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'listings', label: 'Listing Management', icon: '🏠' },
    { id: 'appointments', label: 'Appointment Oversight', icon: '📅' },
    { id: 'marketing', label: 'Marketing & Communications', icon: '📧' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-sky-400">Admin Dashboard</h1>
              <span className="ml-4 px-3 py-1 bg-red-500 text-white text-xs rounded-full">
                Admin Mode
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Logged in as: {user.name || user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
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
        </React.Suspense>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 