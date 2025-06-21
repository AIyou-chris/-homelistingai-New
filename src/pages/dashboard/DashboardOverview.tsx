import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Home, 
  Calendar, 
  QrCode, 
  DollarSign, 
  Percent,
  UserPlus,
  Plus,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Bell,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/shared/Button';

// Gradient definitions from Figma design
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
    { label: 'Revenue', value: '$24,680', change: '+15%', icon: DollarSign, gradient: gradients[4] },
    { label: 'Conversion Rate', value: '24%', change: '+3%', icon: Percent, gradient: gradients[5] },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section with Gradient */}
      <Card className="p-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #5ba8a0 0%, #d89bb8 100%)" }}>
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Good morning, Sarah! 👋</h2>
          <p className="text-white/90 mb-4">Here's what's happening with your business today.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">
                <AnimatedCounter target={3} />
              </div>
              <div className="text-sm opacity-90">New Leads</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                <AnimatedCounter target={5} />
              </div>
              <div className="text-sm opacity-90">Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                <AnimatedCounter target={12} />
              </div>
              <div className="text-sm opacity-90">QR Scans</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                <AnimatedCounter target={2340} prefix="$" />
              </div>
              <div className="text-sm opacity-90">Today's Revenue</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Cards with Animations */}
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
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">
                      {typeof metric.value === 'string' ? metric.value : <AnimatedCounter target={metric.value} />}
                    </p>
                    <p className="text-sm text-green-600 font-medium">{metric.change}</p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ background: metric.gradient }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Lead Conversion Trend</h3>
            <Button variant="secondary" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">Integration with charts library needed</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button variant="secondary" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: gradients[activity.id % gradients.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
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
                  className="h-20 flex-col gap-2 hover:shadow-md transition-all duration-300 hover:scale-105 w-full"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
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
      </Card>

      {/* Live Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Live Updates</h3>
        <div className="space-y-3">
          <motion.div
            className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bell className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">New qualified lead: Oak Street</span>
            <Badge className="bg-green-100 text-green-800 text-xs ml-auto">HOT</Badge>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Tour scheduled: Pine Ave</span>
            <Badge className="bg-blue-100 text-blue-800 text-xs ml-auto">NEW</Badge>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview; 