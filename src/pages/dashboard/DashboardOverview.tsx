import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  HomeModernIcon, 
  ChartBarIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { sendEmail } from '../../services/mailgunService';

const DashboardOverview: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string>('');
  const [stats, setStats] = useState([
    {
      name: 'Total Leads',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      href: '/dashboard/leads-appointments'
    },
    {
      name: 'Appointments',
      value: '0',
      change: '+0 this week',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'bg-green-500',
      href: '/dashboard/leads-appointments'
    },
    {
      name: 'Active Listings',
      value: '0',
      change: '+0 new',
      changeType: 'increase',
      icon: HomeModernIcon,
      color: 'bg-purple-500',
      href: '/dashboard/listings'
    },
    {
      name: 'AI Interactions',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: CpuChipIcon,
      color: 'bg-orange-500',
      href: '/dashboard/ai'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'lead',
      title: 'No recent activity',
      description: 'Your activity will appear here',
      time: 'Just now',
      icon: UserGroupIcon,
      color: 'bg-gray-100 text-gray-600'
    }
  ]);

  const [quickActions] = useState([
    {
      name: 'Add New Listing',
      description: 'Create a new property listing',
      href: '/dashboard/listings/new',
      icon: HomeModernIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Schedule Appointment',
      description: 'Book a showing or consultation',
      href: '/dashboard/leads-appointments',
      icon: CalendarIcon,
      color: 'bg-green-500'
    },
    {
      name: 'AI Assistant',
      description: 'Chat with your AI assistant',
      href: '/dashboard/ai',
      icon: CpuChipIcon,
      color: 'bg-orange-500'
    },
    {
      name: 'Knowledge Base',
      description: 'Manage your AI training data',
      href: '/dashboard/knowledge-base',
      icon: DocumentTextIcon,
      color: 'bg-purple-500'
    }
  ]);

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email from Dashboard',
        text: 'This is a test email from your HomeListingAI dashboard.',
        html: '<p>This is a test email from your HomeListingAI dashboard.</p>'
      });
      setTestEmailResult('Email sent successfully!');
    } catch (error) {
      setTestEmailResult('Failed to send email: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load real data from the system
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls to load real data
        // const leadsData = await fetchLeads();
        // const appointmentsData = await fetchAppointments();
        // const listingsData = await fetchListings();
        // const aiInteractionsData = await fetchAIInteractions();
        
        // Update stats with real data
        // setStats(prevStats => prevStats.map(stat => {
        //   switch(stat.name) {
        //     case 'Total Leads':
        //       return { ...stat, value: leadsData.count.toString() };
        //     case 'Appointments':
        //       return { ...stat, value: appointmentsData.count.toString() };
        //     case 'Active Listings':
        //       return { ...stat, value: listingsData.count.toString() };
        //     case 'AI Interactions':
        //       return { ...stat, value: aiInteractionsData.count.toString() };
        //     default:
        //       return stat;
        //   }
        // }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your listings.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Test Email'}
          </button>
          {testEmailResult && (
            <span className="text-sm text-gray-600">{testEmailResult}</span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <Link
              to={stat.href}
              className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              View details
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.div
              key={action.name}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <Link to={action.href} className="block">
                <div className={`p-3 rounded-lg ${action.color} w-fit mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h2>
            <p className="text-gray-600">Your AI is ready to help with property inquiries and lead management.</p>
          </div>
          <Link
            to="/dashboard/ai"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 