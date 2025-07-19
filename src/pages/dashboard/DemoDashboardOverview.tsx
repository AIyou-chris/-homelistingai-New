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

const DemoDashboardOverview: React.FC = () => {
  // Demo data for a busy realtor
  const metrics = [
    { label: 'Total Visits', value: 247, change: '+12% this week', icon: TrendingUp, gradient: gradients[0] },
    { label: 'Total Leads', value: 12, change: '+3 this week', icon: Users, gradient: gradients[1] },
    { label: 'Active Listings', value: 8, change: '+1 this week', icon: Home, gradient: gradients[2] },
    { label: 'Appointments', value: 6, change: '+2 this week', icon: Calendar, gradient: gradients[3] },
    { label: 'QR Scans', value: 89, change: '+15 this week', icon: QrCode, gradient: gradients[4] },
    { label: 'Conversion Rate', value: '23%', change: '+5% this week', icon: Percent, gradient: gradients[6] },
  ];

  return (
    <div className="space-y-6">
      {/* Agent Profile Section */}
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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">New lead: Sarah Johnson - Oak Street property</span>
              <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Appointment scheduled: Mike Chen - 3:00 PM</span>
              <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">QR code scanned: Pine Avenue listing</span>
              <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
            </div>
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

      {/* Visits by Listing - Demo Data */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Visits by Listing</h3>
        <ul className="space-y-2">
          <li className="flex justify-between text-sm">
            <span>123 Oak Street</span>
            <span className="font-bold">89 visits</span>
          </li>
          <li className="flex justify-between text-sm">
            <span>456 Pine Avenue</span>
            <span className="font-bold">67 visits</span>
          </li>
          <li className="flex justify-between text-sm">
            <span>789 Maple Drive</span>
            <span className="font-bold">45 visits</span>
          </li>
          <li className="flex justify-between text-sm">
            <span>321 Elm Court</span>
            <span className="font-bold">32 visits</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default DemoDashboardOverview; 