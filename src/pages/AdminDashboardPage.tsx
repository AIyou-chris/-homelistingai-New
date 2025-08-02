import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Home, 
  Calendar, 
  QrCode, 
  UserPlus,
  Plus,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Bell,
  Phone,
  Sparkles,
  Settings,
  Shield,
  Database,
  Cpu,
  Activity,
  DollarSign,
  MessageSquare,
  FileText,
  Zap,
  Globe,
  Server,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Button from '../components/shared/Button';
import AdminNavbar from '../components/shared/AdminNavbar';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Modern gradient definitions
const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
];

// Animated Counter Component
interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  console.log('AdminDashboardPage render:', { isAuthenticated, user, isLoading });
  
  // Show loading while checking authentication
  if (isLoading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user is admin (for demo purposes, allow any authenticated user)
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  console.log('Admin check:', { isAdmin, userEmail: user?.email, userRole: user?.role });
  
  if (!isAdmin) {
    console.log('Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('Rendering admin dashboard');
  const [systemStatus, setSystemStatus] = useState({
    api: 'healthy',
    database: 'healthy',
    ai: 'healthy',
    email: 'healthy'
  });
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'New user registration: john@example.com', time: '2 minutes ago', type: 'user', severity: 'info' },
    { id: 2, action: 'AI model training completed', time: '15 minutes ago', type: 'ai', severity: 'success' },
    { id: 3, action: 'Database backup completed', time: '1 hour ago', type: 'system', severity: 'success' },
    { id: 4, action: 'High CPU usage detected', time: '2 hours ago', type: 'warning', severity: 'warning' },
    { id: 5, action: 'New listing uploaded: 123 Main St', time: '3 hours ago', type: 'listing', severity: 'info' },
  ]);

  const metrics = [
    { label: 'Total Users', value: 1247, change: '+23%', icon: Users, gradient: gradients[0] },
    { label: 'Active Listings', value: 892, change: '+12%', icon: Home, gradient: gradients[1] },
    { label: 'AI Interactions', value: 15420, change: '+45%', icon: Cpu, gradient: gradients[2] },
    { label: 'Revenue', value: 45680, change: '+18%', icon: DollarSign, gradient: gradients[3] },
  ];

  const systemMetrics = [
    { label: 'API Response Time', value: '142ms', status: 'good', icon: Zap },
    { label: 'Database Connections', value: '24/50', status: 'good', icon: Database },
    { label: 'AI Model Accuracy', value: '94.2%', status: 'excellent', icon: Cpu },
    { label: 'Email Delivery Rate', value: '99.1%', status: 'good', icon: MessageSquare },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="p-6">
        {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-300 text-lg">System overview and management controls</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="primary" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

      {/* System Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {Object.entries(systemStatus).map(([service, status], index) => (
          <Card key={service} className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2 capitalize">{service}</p>
                  <p className={`text-lg font-semibold ${getStatusColor(status)}`}>
                    {status === 'healthy' ? 'Online' : status}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status).replace('text-', 'bg-')}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                      <p className="text-2xl font-bold text-white">
                        {typeof metric.value === 'string' ? metric.value : <AnimatedCounter target={metric.value} />}
                      </p>
                      <p className="text-sm text-green-400 font-medium flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {metric.change}
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ background: metric.gradient }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* System Performance & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="w-5 h-5 mr-2" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{metric.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{metric.value}</span>
                      <Badge variant={metric.status === 'excellent' ? 'default' : 'secondary'}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  {getSeverityIcon(activity.severity)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <UserPlus className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-400 text-sm">Add, edit, and manage user accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Database className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">System Settings</h3>
            <p className="text-gray-400 text-sm">Configure system parameters and APIs</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">AI Training</h3>
            <p className="text-gray-400 text-sm">Monitor and manage AI model training</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Security</h3>
            <p className="text-gray-400 text-sm">Security settings and access controls</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Voice Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Voice Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Voice Statistics */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Voice Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Voices</span>
                    <span className="text-white font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Voices</span>
                    <span className="text-green-400 font-semibold">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Custom Voices</span>
                    <span className="text-blue-400 font-semibold">2</span>
                  </div>
                </div>
              </div>

              {/* Popular Voices */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Popular Voices</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rachel</span>
                    <Badge variant="default" className="bg-green-500">Most Used</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Dom</span>
                    <Badge variant="secondary">Professional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Bella</span>
                    <Badge variant="secondary">Friendly</Badge>
                  </div>
                </div>
              </div>

              {/* Voice Actions */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Voice
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full bg-green-600/20 border-green-500/50 text-green-400 hover:bg-green-600/30"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Voice Settings
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full bg-purple-600/20 border-purple-500/50 text-purple-400 hover:bg-purple-600/30"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Voice Analytics
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 