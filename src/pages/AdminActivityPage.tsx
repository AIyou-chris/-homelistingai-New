import React, { useState } from 'react';
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
  Upload,
  Cpu,
  Server,
  TrendingUp,
  AlertCircle,
  Lock,
  Unlock,
  EyeOff,
  Network,
  HardDrive,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AdminActivityPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'activity' | 'system' | 'security' | 'analytics'>('activity');
  
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

  const systemStats = [
    { name: 'CPU Usage', value: '68%', change: '+5%', icon: Cpu, status: 'warning' },
    { name: 'Memory Usage', value: '72%', change: '+8%', icon: HardDrive, status: 'warning' },
    { name: 'Disk Space', value: '45%', change: '+2%', icon: Database, status: 'success' },
    { name: 'Network', value: '1.2 GB/s', change: '+15%', icon: Network, status: 'success' }
  ];

  const securityStats = [
    { name: 'Failed Logins', value: '23', change: '-5%', icon: AlertTriangle, status: 'success' },
    { name: 'Blocked IPs', value: '7', change: '+2', icon: Shield, status: 'warning' },
    { name: 'Active Sessions', value: '156', change: '+12%', icon: Users, status: 'info' },
    { name: 'Security Score', value: '92/100', change: '+3', icon: CheckCircle, status: 'success' }
  ];

  const analyticsStats = [
    { name: 'Page Views', value: '12.4K', change: '+18%', icon: Eye, status: 'success' },
    { name: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: TrendingUp, status: 'success' },
    { name: 'Avg Session', value: '4m 32s', change: '+12%', icon: Clock, status: 'success' },
    { name: 'Bounce Rate', value: '23%', change: '-2%', icon: BarChart3, status: 'success' }
  ];

  const systemEvents = [
    { type: 'cpu', action: 'High CPU usage detected', time: '2 minutes ago', icon: Cpu, status: 'warning' },
    { type: 'memory', action: 'Memory usage at 85%', time: '5 minutes ago', icon: HardDrive, status: 'warning' },
    { type: 'backup', action: 'Database backup completed', time: '1 hour ago', icon: Database, status: 'success' },
    { type: 'update', action: 'System update available', time: '2 hours ago', icon: Settings, status: 'info' },
    { type: 'maintenance', action: 'Scheduled maintenance', time: '4 hours ago', icon: Server, status: 'info' }
  ];

  const securityEvents = [
    { type: 'login', action: 'Failed login attempt', user: 'unknown@example.com', time: '1 minute ago', icon: AlertTriangle, status: 'error' },
    { type: 'block', action: 'IP address blocked', user: '192.168.1.100', time: '5 minutes ago', icon: Shield, status: 'warning' },
    { type: 'session', action: 'New admin session', user: 'admin@homelistingai.com', time: '10 minutes ago', icon: LogIn, status: 'success' },
    { type: 'scan', action: 'Security scan completed', user: 'System', time: '1 hour ago', icon: CheckCircle, status: 'success' },
    { type: 'alert', action: 'Suspicious activity detected', user: 'System', time: '2 hours ago', icon: AlertCircle, status: 'warning' }
  ];

  const analyticsData = [
    { name: 'User Growth', value: '1,247', change: '+12%', trend: 'up' },
    { name: 'AI Interactions', value: '5,234', change: '+18%', trend: 'up' },
    { name: 'Document Uploads', value: '892', change: '+8%', trend: 'up' },
    { name: 'Support Tickets', value: '156', change: '-5%', trend: 'down' }
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
          <h1 className="text-4xl font-bold text-white mb-2">Activity & System Monitor</h1>
          <p className="text-gray-300 text-lg">Track system activity, security events, and analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto mb-8">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'system'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-4 h-4 mr-2" />
            System
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'activity' && (
          <>
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
          </>
        )}

        {activeTab === 'system' && (
          <>
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {systemStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.name} className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{stat.name}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className={`text-sm font-medium flex items-center mt-1 ${
                            stat.status === 'success' ? 'text-green-400' :
                            stat.status === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {stat.change}
                          </p>
                        </div>
                        <Icon className={`h-8 w-8 ${
                          stat.status === 'success' ? 'text-green-400' :
                          stat.status === 'warning' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* System Events */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    System Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemEvents.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Icon className={`w-5 h-5 ${
                          event.status === 'success' ? 'text-green-500' :
                          event.status === 'warning' ? 'text-yellow-500' :
                          event.status === 'error' ? 'text-red-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm font-medium">{event.action}</p>
                          <p className="text-gray-500 text-xs">{event.time}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gauge className="w-5 h-5 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">CPU Usage</span>
                        <span className="text-white">68%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Memory Usage</span>
                        <span className="text-white">72%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Disk Space</span>
                        <span className="text-white">45%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Network</span>
                        <span className="text-white">1.2 GB/s</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <>
            {/* Security Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {securityStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.name} className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{stat.name}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className={`text-sm font-medium flex items-center mt-1 ${
                            stat.status === 'success' ? 'text-green-400' :
                            stat.status === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {stat.change}
                          </p>
                        </div>
                        <Icon className={`h-8 w-8 ${
                          stat.status === 'success' ? 'text-green-400' :
                          stat.status === 'warning' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Security Events */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityEvents.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Icon className={`w-5 h-5 ${
                          event.status === 'success' ? 'text-green-500' :
                          event.status === 'warning' ? 'text-yellow-500' :
                          event.status === 'error' ? 'text-red-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm font-medium">{event.action}</p>
                          <p className="text-gray-500 text-xs">{event.user} • {event.time}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-300">Firewall Active</span>
                      </div>
                      <Badge className="text-green-500 bg-green-500/10">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-300">SSL Certificate</span>
                      </div>
                      <Badge className="text-green-500 bg-green-500/10">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-gray-300">Failed Logins</span>
                      </div>
                      <Badge className="text-yellow-500 bg-yellow-500/10">23</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-gray-300">Security Score</span>
                      </div>
                      <Badge className="text-blue-500 bg-blue-500/10">92/100</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            {/* Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {analyticsStats.map((stat, index) => {
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
              {/* Analytics Data */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analytics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-gray-300 text-sm font-medium">{data.name}</p>
                        <p className="text-white text-lg font-bold">{data.value}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          data.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {data.change}
                        </span>
                        <TrendingUp className={`w-4 h-4 ml-2 ${
                          data.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Analytics Chart Placeholder */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Traffic Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Chart visualization would go here</p>
                      <p className="text-gray-500 text-sm">Page views, sessions, conversions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminActivityPage; 