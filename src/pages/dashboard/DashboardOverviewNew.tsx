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
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { sendEmail } from '../../services/mailgunService';

const recentAIMessage = {
  sender: 'Alex Rodriguez',
  time: '2 min ago',
  message: 'What are the school ratings in this area?'
};

const DashboardOverviewNew: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string>('');

  const stats = [
    {
      name: 'Total Leads',
      value: '47',
      change: '+12%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      href: '/dashboard/leads-appointments'
    },
    {
      name: 'Appointments',
      value: '8',
      change: '+2 this week',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'bg-green-500',
      href: '/dashboard/leads-appointments'
    },
    {
      name: 'Active Listings',
      value: '12',
      change: '+3 new',
      changeType: 'increase',
      icon: HomeModernIcon,
      color: 'bg-purple-500',
      href: '/dashboard/listings'
    },
    {
      name: 'AI Interactions',
      value: '284',
      change: '+18%',
      changeType: 'increase',
      icon: CpuChipIcon,
      color: 'bg-orange-500',
      href: '/dashboard/ai'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'lead',
      title: 'New lead inquiry',
      description: 'Sarah Johnson interested in 123 Oak Street',
      time: '2 minutes ago',
      icon: UserGroupIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Appointment scheduled',
      description: 'Showing at 456 Pine Ave - Tomorrow 2:00 PM',
      time: '1 hour ago',
      icon: CalendarIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'ai',
      title: 'AI Assistant active',
      description: '15 property questions answered automatically',
      time: '3 hours ago',
      icon: CpuChipIcon,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 4,
      type: 'contact',
      title: 'Phone consultation',
      description: 'Mike Thompson - First-time buyer consultation',
      time: '5 hours ago',
      icon: PhoneIcon,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const quickActions = [
    {
      name: 'Add New Listing',
      description: 'Create a new property listing',
      href: '/demo-dashboard/create-listing',
      icon: HomeModernIcon,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Schedule Appointment',
      description: 'Book a new showing or meeting',
      href: '/dashboard/leads-appointments',
      icon: CalendarIcon,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'View AI Analytics',
      description: 'See AI performance insights',
      href: '/dashboard/ai',
      icon: CpuChipIcon,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      name: 'Contact Lead',
      description: 'Follow up with prospects',
      href: '/dashboard/leads-appointments',
      icon: EnvelopeIcon,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const handleTestEmail = async () => {
    setIsLoading(true);
    setTestEmailResult('');
    
    try {
      const result = await sendEmail({
        to: 'homelistingai@gmail.com',
        from: 'noreply@homelistingai.com',
        subject: 'Test Email from HomeListingAI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Test Email</h2>
            <p>This is a test email to verify your Mailgun integration is working correctly.</p>
            <p>If you received this email, your email notifications are set up properly!</p>
            <p>Best regards,<br>HomeListingAI Team</p>
          </div>
        `
      });

      if (result.success) {
        setTestEmailResult('✅ Test email sent successfully!');
      } else {
        setTestEmailResult(`❌ Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      setTestEmailResult(`❌ Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Recent AI Chat/Voice Message */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-blue-700">Recent AI Chat</span>
            <span className="text-xs text-gray-400">{recentAIMessage.time}</span>
          </div>
          <div className="text-gray-900 text-base font-medium truncate">{recentAIMessage.sender}</div>
          <div className="text-gray-600 text-sm mt-1 truncate">"{recentAIMessage.message}"</div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">AI Voice</span>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <Link to={stat.href} className="block">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600">Latest updates from your business</p>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 bg-gray-50 rounded-b-xl">
              <Link to="/dashboard/analytics" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    to={action.href}
                    className={`flex items-center p-3 rounded-lg text-white transition-colors ${action.color}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">{action.name}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Leads Generated</span>
                <span className="font-semibold text-blue-600">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Appointments Booked</span>
                <span className="font-semibold text-green-600">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Properties Shown</span>
                <span className="font-semibold text-purple-600">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Responses</span>
                <span className="font-semibold text-orange-600">284</span>
              </div>
            </div>
            <Link
              to="/dashboard/analytics"
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              View Detailed Analytics
              <ChartBarIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Test Email Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Email Integration Test</h3>
          <EnvelopeIcon className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Test your Resend email integration to ensure notifications are working properly.
          </p>
          
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <EnvelopeIcon className="w-4 h-4" />
                Send Test Email
              </>
            )}
          </button>
          
          {testEmailResult && (
            <div className={`p-3 rounded-lg text-sm ${
              testEmailResult.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {testEmailResult}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverviewNew; 