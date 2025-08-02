import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Network, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Zap,
  Globe,
  Cloud,
  Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AdminSystemPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading system...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const systemMetrics = [
    { name: 'CPU Usage', value: '23%', status: 'healthy', icon: Cpu },
    { name: 'Memory Usage', value: '67%', status: 'warning', icon: HardDrive },
    { name: 'Disk Space', value: '45%', status: 'healthy', icon: Database },
    { name: 'Network', value: '1.2 Gbps', status: 'healthy', icon: Network },
    { name: 'Active Connections', value: '1,247', status: 'healthy', icon: Globe },
    { name: 'Database Queries', value: '2.3k/sec', status: 'healthy', icon: Database },
    { name: 'API Response Time', value: '45ms', status: 'excellent', icon: Zap },
    { name: 'Uptime', value: '99.9%', status: 'excellent', icon: CheckCircle }
  ];

  const services = [
    { name: 'Web Server', status: 'online', uptime: '99.9%', icon: Server },
    { name: 'Database', status: 'online', uptime: '99.8%', icon: Database },
    { name: 'AI Processing', status: 'online', uptime: '99.7%', icon: Cpu },
    { name: 'File Storage', status: 'online', uptime: '99.9%', icon: Cloud },
    { name: 'Email Service', status: 'online', uptime: '99.6%', icon: Globe },
    { name: 'Security Layer', status: 'online', uptime: '100%', icon: Shield }
  ];

  const recentAlerts = [
    { type: 'warning', message: 'Memory usage approaching threshold', time: '2 minutes ago', icon: AlertTriangle },
    { type: 'info', message: 'Database backup completed successfully', time: '1 hour ago', icon: CheckCircle },
    { type: 'success', message: 'New AI model deployed successfully', time: '3 hours ago', icon: CheckCircle },
    { type: 'info', message: 'System maintenance scheduled for tonight', time: '5 hours ago', icon: Clock }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500 bg-green-500/10';
      case 'offline': return 'text-red-500 bg-red-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'healthy': return 'text-green-500 bg-green-500/10';
      case 'excellent': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">System Management</h1>
          <p className="text-gray-300 text-lg">Monitor system performance, services, and infrastructure</p>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => {
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
          {/* Services Status */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="w-5 h-5 mr-2" />
                Services Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-gray-300 font-medium">{service.name}</span>
                        <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Icon className={`w-5 h-5 ${
                      alert.type === 'warning' ? 'text-yellow-500' :
                      alert.type === 'success' ? 'text-green-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{alert.message}</p>
                      <p className="text-gray-500 text-xs">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemPage; 