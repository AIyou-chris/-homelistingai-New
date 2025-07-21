import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Home, 
  Calendar, 
  QrCode, 
  Plus,
  ArrowRight,
  Bell,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Button from '../../components/shared/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Simple gradient definitions
const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
];

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to HomeListingAI! 🎉',
      message: 'Your platform is now live and ready for launch. Start adding listings and capturing leads!',
      date: '2025-07-16',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'update',
      title: 'New Features Coming Soon',
      message: 'We\'re working on advanced AI features and improved lead management. Stay tuned for updates!',
      date: '2025-07-16',
      priority: 'normal'
    }
  ]);

  useEffect(() => {
    // Fetch total visits
    const fetchVisits = async () => {
      const { data, error } = await supabase.rpc('get_total_visits_and_by_listing');
      if (!error && data) {
        setTotalVisits(data.total_visits || 0);
      }
    };
    fetchVisits();
  }, []);

  // Simplified metrics - only the essentials
  const metrics = [
    { label: 'Total Visits', value: totalVisits || 0, icon: Home, gradient: gradients[0] },
    { label: 'Active Listings', value: 0, icon: Home, gradient: gradients[1] },
    { label: 'Appointments', value: 0, icon: Calendar, gradient: gradients[2] },
    { label: 'QR Scans', value: 0, icon: QrCode, gradient: gradients[3] },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-sky-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Agent'}! 🎉</h1>
            <p className="text-sky-100">Your AI-powered real estate business is ready to grow.</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-2xl font-bold">Ready to Launch</div>
              <div className="text-sky-100 text-sm">Your platform is live!</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Message Center */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Message Center</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live Updates</span>
          </div>
        </div>
        <div className="space-y-3">
          {messages.map((message, index) => {
            const getIcon = () => {
              switch (message.type) {
                case 'info': return <Info className="w-4 h-4 text-blue-500" />;
                case 'update': return <CheckCircle className="w-4 h-4 text-green-500" />;
                case 'alert': return <AlertCircle className="w-4 h-4 text-orange-500" />;
                default: return <Info className="w-4 h-4 text-blue-500" />;
              }
            };
            
            const getBgColor = () => {
              switch (message.type) {
                case 'info': return 'bg-blue-50 border-blue-200';
                case 'update': return 'bg-green-50 border-green-200';
                case 'alert': return 'bg-orange-50 border-orange-200';
                default: return 'bg-blue-50 border-blue-200';
              }
            };

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getBgColor()} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  {getIcon()}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{message.title}</h4>
                      <span className="text-xs text-muted-foreground">{message.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Simple Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ background: metric.gradient }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions - Simplified */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Listing', icon: Plus, gradient: gradients[0], href: '/listings' },
            { label: 'View Leads', icon: Users, gradient: gradients[1], href: '/dashboard/leads' },
            { label: 'Schedule', icon: Calendar, gradient: gradients[2], href: '/dashboard/appointments' },
            { label: 'QR Codes', icon: QrCode, gradient: gradients[3], href: '/dashboard/qr-codes' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={action.href}>
                  <Button 
                    variant="secondary" 
                    className="h-16 flex-col gap-2 hover:shadow-md transition-all duration-300 w-full"
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg"
                      style={{ background: action.gradient }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Card>


    </div>
  );
};

export default DashboardOverview; 