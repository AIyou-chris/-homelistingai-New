import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText, 
  Database, 
  Shield, 
  Activity,
  CheckCircle,
  Clock,
  Settings,
  Zap,
  Globe,
  Cloud,
  Key,
  Eye,
  DollarSign,
  Target,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AdminAnalyticsPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const analyticsMetrics = [
    { name: 'Total Users', value: '2,847', change: '+12%', icon: Users },
    { name: 'Active Sessions', value: '1,234', change: '+8%', icon: Activity },
    { name: 'AI Conversations', value: '5,678', change: '+15%', icon: MessageSquare },
    { name: 'Revenue', value: '$45,230', change: '+23%', icon: DollarSign },
    { name: 'Conversion Rate', value: '3.2%', change: '+5%', icon: Target },
    { name: 'Avg Session Time', value: '4m 32s', change: '+2%', icon: Clock },
    { name: 'Documents Processed', value: '12,456', change: '+18%', icon: FileText },
    { name: 'System Uptime', value: '99.9%', change: '+0.1%', icon: CheckCircle }
  ];

  const topMetrics = [
    { name: 'User Growth', value: '23%', trend: 'up', period: 'vs last month' },
    { name: 'Revenue Growth', value: '18%', trend: 'up', period: 'vs last month' },
    { name: 'AI Accuracy', value: '94.2%', trend: 'up', period: 'vs last week' },
    { name: 'Customer Satisfaction', value: '4.8/5', trend: 'up', period: 'vs last month' }
  ];

  const recentTrends = [
    { name: 'User Registrations', value: '156', change: '+12%', trend: 'up' },
    { name: 'AI Conversations', value: '2,847', change: '+8%', trend: 'up' },
    { name: 'Document Uploads', value: '1,234', change: '+15%', trend: 'up' },
    { name: 'Support Tickets', value: '89', change: '-5%', trend: 'down' },
    { name: 'System Errors', value: '12', change: '-25%', trend: 'down' },
    { name: 'Security Alerts', value: '3', change: '-40%', trend: 'down' }
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300 text-lg">Comprehensive insights into system performance and user behavior</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {topMetrics.map((metric, index) => (
            <Card key={metric.name} className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{metric.name}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className={`text-sm font-medium flex items-center mt-1 ${getTrendColor(metric.trend)}`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.period}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <TrendingUp className={`w-6 h-6 ${getTrendColor(metric.trend)}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.name} className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">{metric.name}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                      <p className={`text-sm font-medium flex items-center mt-1 ${getChangeColor(metric.change)}`}>
                        <BarChart3 className="w-3 h-3 mr-1" />
                        {metric.change}
                      </p>
                    </div>
                    <Icon className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trends */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Recent Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getTrendColor(trend.trend)}`} />
                    <div>
                      <span className="text-gray-300 font-medium">{trend.name}</span>
                      <p className="text-gray-500 text-xs">{trend.value} total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getChangeColor(trend.change)}`}>
                      {trend.change}
                    </p>
                    <p className="text-gray-500 text-xs">vs last period</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analytics Filters */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Analytics Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Time Range</h4>
                <select className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg">
                  <option value="7d">Last 7 Days</option>
                  <option value="30d" selected>Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Metrics</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-gray-300">User Metrics</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-gray-300">Revenue Metrics</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-gray-300">AI Performance</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-gray-300">System Metrics</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-medium mb-2">Export Options</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                    Export CSV Report
                  </button>
                  <button className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                    Generate PDF Report
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                    Schedule Auto Reports
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 