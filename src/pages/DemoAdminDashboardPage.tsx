import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Home, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Plus,
  Settings,
  Mail,
  FileText,
  Database,
  Shield
} from 'lucide-react';

const DemoAdminDashboardPage: React.FC = () => {
  // Demo data for showcase
  const demoMetrics = {
    totalUsers: 1247,
    activeListings: 89,
    monthlyRevenue: 24580,
    supportTickets: 12,
    conversionRate: 3.2,
    growthRate: 15.6,
    systemUptime: 98.5,
    activeSessions: 234
  };

  const recentActivity = [
    { 
      id: 1, 
      action: 'New user registration', 
      user: 'john.doe@email.com', 
      timestamp: '5 minutes ago', 
      type: 'user',
      status: 'success'
    },
    { 
      id: 2, 
      action: 'Listing created', 
      user: 'agent@realestate.com', 
      timestamp: '12 minutes ago', 
      type: 'listing',
      status: 'success'
    },
    { 
      id: 3, 
      action: 'Support ticket resolved', 
      user: 'support@homelistingai.com', 
      timestamp: '1 hour ago', 
      type: 'support',
      status: 'resolved'
    },
    { 
      id: 4, 
      action: 'Payment processed', 
      user: 'premium@user.com', 
      timestamp: '2 hours ago', 
      type: 'payment',
      status: 'success'
    },
    { 
      id: 5, 
      action: 'Knowledge base updated', 
      user: 'admin@homelistingai.com', 
      timestamp: '3 hours ago', 
      type: 'content',
      status: 'updated'
    }
  ];

  const systemStatus = [
    { service: 'API Gateway', status: 'operational', uptime: '99.9%' },
    { service: 'Database', status: 'operational', uptime: '99.8%' },
    { service: 'AI Services', status: 'operational', uptime: '99.5%' },
    { service: 'Email Service', status: 'degraded', uptime: '98.2%' },
    { service: 'File Storage', status: 'operational', uptime: '99.9%' }
  ];

  const getActivityIcon = (type: string) => {
    const iconProps = "h-4 w-4";
    switch (type) {
      case 'user': return <Users className={`${iconProps} text-blue-500`} />;
      case 'listing': return <Home className={`${iconProps} text-green-500`} />;
      case 'support': return <MessageSquare className={`${iconProps} text-orange-500`} />;
      case 'payment': return <TrendingUp className={`${iconProps} text-purple-500`} />;
      case 'content': return <FileText className={`${iconProps} text-indigo-500`} />;
      default: return <Activity className={`${iconProps} text-gray-400`} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'outage': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 dark:text-green-400';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
      case 'outage': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Demo Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Experience the power of HomeListingAI's admin interface
        </p>
        <div className="mt-3">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Demo Mode - Showcasing Admin Features
          </Badge>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +{demoMetrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-green-500" />
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoMetrics.activeListings}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Across all agents
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${demoMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {demoMetrics.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-500" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoMetrics.supportTickets}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              3 urgent, 9 normal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Plus className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Add User</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20">
              <Home className="h-5 w-5 text-green-500" />
              <span className="text-xs">New Listing</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <Mail className="h-5 w-5 text-purple-500" />
              <span className="text-xs">Send Broadcast</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
              <Database className="h-5 w-5 text-indigo-500" />
              <span className="text-xs">Backup</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Shield className="h-5 w-5 text-red-500" />
              <span className="text-xs">Security</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time platform activity monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.user}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 dark:text-gray-500 block">
                      {activity.timestamp}
                    </span>
                    <Badge 
                      className={`text-xs mt-1 ${
                        activity.status === 'success' || activity.status === 'resolved' || activity.status === 'updated'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Monitor all system components and uptime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.service}
                      </p>
                      <p className={`text-xs ${getStatusColor(service.status)} capitalize`}>
                        {service.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.uptime}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      uptime
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Overall System Health: {demoMetrics.systemUptime}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoMetrics.activeSessions}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Users online now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              API Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Requests today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847 GB</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              85% of 1TB plan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demo Notice */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                This is a Demo Dashboard
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Experience the full power of HomeListingAI's admin interface. All data shown is simulated to demonstrate capabilities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoAdminDashboardPage; 