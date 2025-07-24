import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  Shield, 
  Lock, 
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
  UserX, 
  LogIn, 
  LogOut, 
  Database,
  Server,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AdminSecurityPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading security...</p>
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

  const securityMetrics = [
    { name: 'Active Sessions', value: '156', status: 'healthy', icon: LogIn },
    { name: 'Failed Logins', value: '23', status: 'warning', icon: UserX },
    { name: 'Blocked IPs', value: '5', status: 'healthy', icon: Shield },
    { name: 'Security Score', value: '92%', status: 'excellent', icon: CheckCircle },
    { name: 'SSL Certificate', value: 'Valid', status: 'healthy', icon: Lock },
    { name: 'Firewall Status', value: 'Active', status: 'healthy', icon: Shield },
    { name: 'Data Encryption', value: 'AES-256', status: 'excellent', icon: Key },
    { name: 'Last Scan', value: '2 hours ago', status: 'healthy', icon: Activity }
  ];

  const securityEvents = [
    { 
      type: 'warning', 
      event: 'Multiple failed login attempts', 
      ip: '192.168.1.100', 
      time: '5 minutes ago', 
      icon: AlertTriangle,
      action: 'IP temporarily blocked'
    },
    { 
      type: 'success', 
      event: 'Security scan completed', 
      ip: 'System', 
      time: '1 hour ago', 
      icon: CheckCircle,
      action: 'No threats detected'
    },
    { 
      type: 'info', 
      event: 'New admin login', 
      ip: '10.0.0.50', 
      time: '2 hours ago', 
      icon: LogIn,
      action: 'Location: New York'
    },
    { 
      type: 'warning', 
      event: 'Suspicious activity detected', 
      ip: '203.0.113.45', 
      time: '3 hours ago', 
      icon: AlertTriangle,
      action: 'Under investigation'
    },
    { 
      type: 'success', 
      event: 'Database backup encrypted', 
      ip: 'System', 
      time: '6 hours ago', 
      icon: CheckCircle,
      action: 'Backup completed'
    },
    { 
      type: 'info', 
      event: 'SSL certificate renewed', 
      ip: 'System', 
      time: '1 day ago', 
      icon: Lock,
      action: 'Certificate valid for 90 days'
    }
  ];

  const securitySettings = [
    { name: 'Two-Factor Authentication', status: 'enabled', icon: Shield },
    { name: 'Password Policy', status: 'enabled', icon: Lock },
    { name: 'Session Timeout', status: 'enabled', icon: Clock },
    { name: 'IP Whitelist', status: 'disabled', icon: Globe },
    { name: 'Rate Limiting', status: 'enabled', icon: Activity },
    { name: 'Data Encryption', status: 'enabled', icon: Key }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      case 'excellent': return 'text-blue-500 bg-blue-500/10';
      case 'enabled': return 'text-green-500 bg-green-500/10';
      case 'disabled': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Security Center</h1>
          <p className="text-gray-300 text-lg">Monitor security events, threats, and system protection</p>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.name} className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">{metric.name}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                      <Badge className={`mt-2 ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </Badge>
                    </div>
                    <Icon className="h-8 w-8 text-blue-400" />
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
                    <Icon className={`w-5 h-5 ${getEventColor(event.type)}`} />
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm font-medium">{event.event}</p>
                      <p className="text-gray-500 text-xs">{event.ip} • {event.time}</p>
                      <p className="text-gray-400 text-xs">{event.action}</p>
                    </div>
                    <Badge className={getStatusColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {securitySettings.map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 font-medium">{setting.name}</span>
                    </div>
                    <Badge className={getStatusColor(setting.status)}>
                      {setting.status}
                    </Badge>
                  </div>
                );
              })}
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                    Run Security Scan
                  </button>
                  <button className="w-full px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors">
                    Block Suspicious IP
                  </button>
                  <button className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                    Update Security Policy
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

export default AdminSecurityPage; 