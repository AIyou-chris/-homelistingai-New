import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BarChart3, Users, Home, MessageSquare, Calendar, TrendingUp, Plus, Settings, Mail, FileText } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  // Sample data - in real app, fetch from API
  const metrics = {
    totalUsers: 1247,
    activeListings: 89,
    monthlyRevenue: 24580,
    supportTickets: 12,
    conversionRate: 3.2,
    growthRate: 15.6
  };

  const recentActivity = [
    { id: 1, action: 'New user registration', user: 'john.doe@email.com', timestamp: '5 minutes ago', type: 'user' },
    { id: 2, action: 'Listing created', user: 'agent@realestate.com', timestamp: '12 minutes ago', type: 'listing' },
    { id: 3, action: 'Support ticket resolved', user: 'support@homelistingai.com', timestamp: '1 hour ago', type: 'support' },
    { id: 4, action: 'Payment processed', user: 'premium@user.com', timestamp: '2 hours ago', type: 'payment' },
    { id: 5, action: 'Knowledge base updated', user: 'admin@homelistingai.com', timestamp: '3 hours ago', type: 'content' }
  ];

  const pendingApprovals = [
    { id: 1, item: 'Premium agent verification', user: 'sarah.wilson@realty.com', priority: 'high' },
    { id: 2, item: 'Listing content review', user: 'mike.johnson@homes.com', priority: 'medium' },
    { id: 3, item: 'Bulk upload request', user: 'team@bigproperties.com', priority: 'low' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'listing': return <Home className="h-4 w-4 text-green-500" />;
      case 'support': return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case 'payment': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'content': return <FileText className="h-4 w-4 text-indigo-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor and manage your HomeListingAI platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +{metrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4" />
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeListings}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Across all agents
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {metrics.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.supportTickets}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              3 urgent, 9 normal
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">98.5%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Uptime this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Users online now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add User</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Home className="h-5 w-5" />
              <span className="text-xs">New Listing</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Mail className="h-5 w-5" />
              <span className="text-xs">Send Broadcast</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-5 w-5" />
              <span className="text-xs">System Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Items requiring admin attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {approval.item}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {approval.user}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(approval.priority)}`}>
                      {approval.priority}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Shortcuts */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Management</CardTitle>
          <CardDescription>
            Access key management areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 justify-start gap-3" asChild>
              <div>
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">User Management</div>
                  <div className="text-xs text-gray-500">Roles & permissions</div>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-16 justify-start gap-3" asChild>
              <div>
                <Home className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Listings</div>
                  <div className="text-xs text-gray-500">Content & moderation</div>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-16 justify-start gap-3" asChild>
              <div>
                <BarChart3 className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Analytics</div>
                  <div className="text-xs text-gray-500">Usage & performance</div>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-16 justify-start gap-3" asChild>
              <div>
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-gray-500">System configuration</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage; 