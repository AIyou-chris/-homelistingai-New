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
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/shared/Button';

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
    let startTime: number | undefined;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const DashboardOverview: React.FC = () => {
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'New lead from Oak Street listing', time: '5 minutes ago', type: 'lead' },
    { id: 2, action: 'Appointment scheduled for Pine Ave', time: '1 hour ago', type: 'appointment' },
    { id: 3, action: 'QR code scanned on Maple Drive', time: '2 hours ago', type: 'scan' },
    { id: 4, action: 'Email campaign sent to 45 leads', time: '3 hours ago', type: 'email' },
  ]);

  const metrics = [
    { label: 'Total Leads', value: 142, change: '+12%', icon: Users, gradient: gradients[0] },
    { label: 'Active Listings', value: 8, change: '+2', icon: Home, gradient: gradients[1] },
    { label: 'Appointments', value: 15, change: '+5', icon: Calendar, gradient: gradients[2] },
    { label: 'QR Scans', value: 384, change: '+48%', icon: QrCode, gradient: gradients[3] },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Profile Picture */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 flex items-center space-x-6">
          <div className="relative">
            <img 
              src="/sarah-martinez.png" 
              alt="Sarah Martinez" 
              className="w-16 h-16 rounded-full border-4 border-white/20 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-3xl font-bold text-white">Good morning, Sarah! 👋</h2>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-gray-300 text-lg mb-6">Here's what's happening with your business today.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter target={3} />
                </div>
                <div className="text-sm text-gray-300">New Leads</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter target={5} />
                </div>
                <div className="text-sm text-gray-300">Appointments</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter target={12} />
                </div>
                <div className="text-sm text-gray-300">QR Scans</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter target={2340} prefix="$" />
                </div>
                <div className="text-sm text-gray-300">Today's Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Cards with Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Lead Conversion Trend</h3>
              <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Integration with charts library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ background: gradients[activity.id % gradients.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-white/20 text-white">
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Add Lead', icon: UserPlus, gradient: gradients[0] },
              { label: 'New Listing', icon: Plus, gradient: gradients[1] },
              { label: 'Schedule Viewing', icon: Calendar, gradient: gradients[2] },
              { label: 'Generate QR', icon: QrCode, gradient: gradients[3] },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button 
                    variant="secondary" 
                    className="h-20 flex-col gap-2 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 w-full"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg"
                      style={{ background: action.gradient }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Notifications */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Live Updates</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <motion.div
              className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bell className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">New qualified lead: Oak Street</span>
              <Badge className="bg-green-500/20 text-green-300 text-xs ml-auto border-green-500/30">HOT</Badge>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Tour scheduled: Pine Ave</span>
              <Badge className="bg-blue-500/20 text-blue-300 text-xs ml-auto border-blue-500/30">NEW</Badge>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview; 