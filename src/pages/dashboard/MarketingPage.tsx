import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  HomeIcon,
  QrCodeIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  TrendingUpIcon,
  EyeIcon,
  ShareIcon,
  DownloadIcon
} from '@heroicons/react/24/outline';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketingTab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
  badge?: number;
}

const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const marketingTabs: MarketingTab[] = [
    {
      id: 'advanced-followup',
      name: 'Advanced Follow-up',
      icon: ChatBubbleLeftRightIcon,
      description: 'Automated follow-up sequences and lead nurturing',
      href: '/dashboard/advanced-followup',
      badge: 12
    },
    {
      id: 'comparables',
      name: 'Comparables',
      icon: HomeIcon,
      description: 'Market analysis and comparable properties',
      href: '/dashboard/comparables'
    },
    {
      id: 'property-history',
      name: 'Property History',
      icon: Clock,
      description: 'Property sales history and market trends',
      href: '/dashboard/property-history'
    },
    {
      id: 'qr-codes',
      name: 'QR Codes',
      icon: QrCodeIcon,
      description: 'Generate QR codes for listings and marketing',
      href: '/dashboard/qr-codes'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: ChartBarIcon,
      description: 'Performance metrics and insights',
      href: '/dashboard/analytics'
    }
  ];

  const quickStats = [
    { name: 'Active Follow-ups', value: '24', change: '+12%', icon: ChatBubbleLeftRightIcon },
    { name: 'Comparables Found', value: '156', change: '+8%', icon: HomeIcon },
    { name: 'QR Code Scans', value: '89', change: '+23%', icon: QrCodeIcon },
    { name: 'Lead Conversions', value: '12', change: '+15%', icon: TrendingUpIcon }
  ];

  const recentActivities = [
    { type: 'followup', message: 'Follow-up sequence sent to 5 leads', time: '2 min ago' },
    { type: 'comparable', message: 'New comparable found for 123 Oak St', time: '15 min ago' },
    { type: 'qr', message: 'QR code generated for listing #456', time: '1 hour ago' },
    { type: 'analytics', message: 'Weekly report generated', time: '2 hours ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'followup': return ChatBubbleLeftRightIcon;
      case 'comparable': return HomeIcon;
      case 'qr': return QrCodeIcon;
      case 'analytics': return ChartBarIcon;
      default: return EyeIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'followup': return 'text-blue-600 bg-blue-100';
      case 'comparable': return 'text-green-600 bg-green-100';
      case 'qr': return 'text-purple-600 bg-purple-100';
      case 'analytics': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketing Hub</h1>
        <p className="text-gray-600 mt-2">
          Manage all your marketing tools and campaigns in one place
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Marketing Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {marketingTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <Link to={tab.href} className="block">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tab.name}</h3>
                      {tab.badge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowUpIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">{tab.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage; 