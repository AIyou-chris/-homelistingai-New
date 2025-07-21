import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AnalyticsData {
  totalUsers: number;
  totalListings: number;
  totalAppointments: number;
  activeUsers: number;
  publishedListings: number;
  recentSignups: number;
  recentListings: number;
  recentAppointments: number;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

      // Fetch user statistics
      const { data: userProfiles, error: userError } = await supabase
        .from('user_profiles')
        .select('created_at, role')
        .gte('created_at', startDate.toISOString());

      if (userError) throw userError;

      // Fetch listing statistics
      const { data: listings, error: listingError } = await supabase
        .from('listings')
        .select('created_at, status')
        .gte('created_at', startDate.toISOString());

      if (listingError) throw listingError;

      // Fetch appointment statistics
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('created_at, status')
        .gte('created_at', startDate.toISOString());

      if (appointmentError) throw appointmentError;

      // Calculate analytics
      const analyticsData: AnalyticsData = {
        totalUsers: userProfiles?.length || 0,
        totalListings: listings?.length || 0,
        totalAppointments: appointments?.length || 0,
        activeUsers: userProfiles?.filter(u => u.role === 'agent').length || 0,
        publishedListings: listings?.filter(l => l.status === 'published').length || 0,
        recentSignups: userProfiles?.filter(u => {
          const created = new Date(u.created_at);
          return created > new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        }).length || 0,
        recentListings: listings?.filter(l => {
          const created = new Date(l.created_at);
          return created > new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        }).length || 0,
        recentAppointments: appointments?.filter(a => {
          const created = new Date(a.created_at);
          return created > new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        }).length || 0,
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!analytics) return <div className="text-white">No analytics data available</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
          <p className="text-gray-400">Monitor platform performance and user activity</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-white">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">
              +{analytics.recentSignups} this week
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏠</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-white">{analytics.totalListings}</div>
              <div className="text-sm text-gray-400">Total Listings</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">
              {analytics.publishedListings} published
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-white">{analytics.totalAppointments}</div>
              <div className="text-sm text-gray-400">Total Appointments</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">
              +{analytics.recentAppointments} this week
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚡</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-white">{analytics.activeUsers}</div>
              <div className="text-sm text-gray-400">Active Agents</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">
              {Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Signups</span>
              <span className="text-white font-semibold">{analytics.recentSignups}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Listings</span>
              <span className="text-white font-semibold">{analytics.recentListings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Appointments</span>
              <span className="text-white font-semibold">{analytics.recentAppointments}</span>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Published Listings</span>
                <span className="text-white font-semibold">
                  {analytics.publishedListings}/{analytics.totalListings}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(analytics.publishedListings / analytics.totalListings) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Active Users</span>
                <span className="text-white font-semibold">
                  {analytics.activeUsers}/{analytics.totalUsers}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full" 
                  style={{ width: `${(analytics.activeUsers / analytics.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
            View All Users
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Manage Listings
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
            Review Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 