import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  FileText, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Zap,
  Globe,
  Cloud,
  Key,
  Eye,
  UserPlus,
  LogIn,
  LogOut,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AdminActivityPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading activity...</p>
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

  const recentActivity = [
    { 
      type: 'user', 
      action: 'New user registered', 
      user: 'john.doe@example.com', 
      time: '2 minutes ago', 
      icon: UserPlus,
      status: 'success'
    },
    { 
      type: 'ai', 
      action: 'AI training completed', 
      user: 'System', 
      time: '5 minutes ago', 
      icon: Zap,
      status: 'success'
    },
    { 
      type: 'security', 
      action: 'Failed login attempt', 
      user: 'unknown@example.com', 
      time: '10 minutes ago', 
      icon: AlertTriangle,
      status: 'warning'
    },
    { 
      type: 'data', 
      action: 'Document uploaded', 
      user: 'sarah.agent@example.com', 
      time: '15 minutes ago', 
      icon: Upload,
      status: 'info'
    },
    { 
      type: 'system', 
      action: 'Database backup', 
      user: 'System', 
      time: '1 hour ago', 
      icon: Database,
      status: 'success'
    },
    { 
      type: 'chat', 
      action: 'AI chat session started', 
      user: 'mike.buyer@example.com', 
      time: '2 hours ago', 
      icon: MessageSquare,
      status: 'info'
    },
    { 
      type: 'user', 
      action: 'User logged in', 
      user: 'admin@homelistingai.com', 
      time: '3 hours ago', 
      icon: LogIn,
      status: 'info'
    },
    { 
      type: 'system', 
      action: 'System maintenance', 
      user: 'System', 
      time: '5 hours ago', 
      icon: Settings,
      status: 'success'
    }
  ];

  const activityStats = [
    { name: 'Active Users', value: '247', change: '+12%', icon: Users },
    { name: 'AI Conversations', value: '1,234', change: '+8%', icon: MessageSquare },
    { name: 'Documents Processed', value: '456', change: '+15%', icon: FileText },
    { name: 'System Events', value: '89', change: '+3%', icon: Activity }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'ai': return Zap;
      case 'security': return Shield;
      case 'data': return FileText;
      case 'system': return Database;
      case 'chat': return MessageSquare;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      case 'info': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Activity Monitor</h1>
          <p className="text-gray-300 text-lg">Track system activity, user actions, and system events</p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">{stat.name}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-green-400 font-medium flex items-center mt-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        {stat.change}
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
          {/* Recent Activity */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Icon className={`w-5 h-5 ${
                      activity.status === 'success' ? 'text-green-500' :
                      activity.status === 'warning' ? 'text-yellow-500' :
                      activity.status === 'error' ? 'text-red-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm font-medium">{activity.action}</p>
                      <p className="text-gray-500 text-xs">{activity.user} • {activity.time}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Activity Filters */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Activity Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-gray-300">User Actions</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-gray-300">AI Activity</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-gray-300">Security Events</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-gray-300">System Events</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300">Data Processing</span>
                </label>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-medium mb-2">Time Range</h4>
                <select className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg">
                  <option value="1h">Last Hour</option>
                  <option value="24h" selected>Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityPage; 