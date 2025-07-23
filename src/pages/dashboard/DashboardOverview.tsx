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
  Brain,
  Target,
  Zap,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Rocket
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

// AI-Powered Lead Scoring Interface
interface LeadScore {
  id: number;
  name: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  lastActivity: string;
  predictedCloseDate: string;
  budget: string;
  preferredProperties: string[];
}

// Smart Recommendations Interface
interface SmartRecommendation {
  id: number;
  type: 'action' | 'opportunity' | 'alert' | 'insight';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<{ className?: string }>;
  action?: string;
}

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

  // 🚀 SUPER BADASS: AI-Powered Lead Scoring
  const [topLeads, setTopLeads] = useState<LeadScore[]>([
    { id: 1, name: 'John Smith', score: 95, status: 'hot', lastActivity: '2 hours ago', predictedCloseDate: 'Next week', budget: '$450,000', preferredProperties: ['Oak Street', 'Pine Avenue'] },
    { id: 2, name: 'Sarah Johnson', score: 87, status: 'hot', lastActivity: '1 day ago', predictedCloseDate: '2 weeks', budget: '$380,000', preferredProperties: ['Maple Drive'] },
    { id: 3, name: 'Mike Davis', score: 72, status: 'warm', lastActivity: '3 days ago', predictedCloseDate: '1 month', budget: '$520,000', preferredProperties: ['Elm Street'] },
  ]);

  // 🚀 SUPER BADASS: Smart AI Recommendations
  const [aiRecommendations, setAiRecommendations] = useState<SmartRecommendation[]>([
    { id: 1, type: 'action', title: 'Follow up with John Smith', description: 'High-value lead showing strong interest in Oak Street property', priority: 'high', icon: Phone, action: 'Call Now' },
    { id: 2, type: 'opportunity', title: 'Price optimization opportunity', description: 'Maple Drive listing could be priced 5% higher based on market analysis', priority: 'medium', icon: TrendingUp, action: 'Review Pricing' },
    { id: 3, type: 'insight', title: 'Market trend detected', description: 'Properties in your area are selling 15% faster than last month', priority: 'low', icon: BarChart3, action: 'View Report' },
    { id: 4, type: 'alert', title: 'Competitor activity', description: 'New listing posted nearby at $25K below your price', priority: 'high', icon: AlertTriangle, action: 'Analyze' },
  ]);

  const metrics = [
    { label: 'Total Leads', value: 142, change: '+12%', icon: Users, gradient: gradients[0] },
    { label: 'Active Listings', value: 8, change: '+2', icon: Home, gradient: gradients[1] },
    { label: 'Appointments', value: 15, change: '+5', icon: Calendar, gradient: gradients[2] },
    { label: 'QR Scans', value: 384, change: '+48%', icon: QrCode, gradient: gradients[3] },
  ];

  // 🚀 SUPER BADASS: AI-Powered Performance Metrics
  const aiMetrics = [
    { label: 'Lead Conversion Rate', value: 23, suffix: '%', change: '+5%', icon: Target, gradient: gradients[4] },
    { label: 'Avg Response Time', value: 2.3, suffix: 'min', change: '-0.5min', icon: Clock, gradient: gradients[5] },
    { label: 'Revenue Forecast', value: 125000, prefix: '$', suffix: '', change: '+18%', icon: DollarSign, gradient: gradients[6] },
    { label: 'AI Engagement Score', value: 94, suffix: '/100', change: '+7pts', icon: Brain, gradient: gradients[7] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

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
              src="/sarah-martinez-real.png" 
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

      {/* 🚀 SUPER BADASS: AI-Powered Smart Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">AI-Powered Recommendations</h3>
              <Badge className="bg-purple-500 text-white">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${getPriorityColor(rec.priority)} backdrop-blur-sm`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-1 ${
                        rec.priority === 'high' ? 'text-red-400' : 
                        rec.priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-300 mb-3">{rec.description}</p>
                        {rec.action && (
                          <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                            {rec.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics Cards with Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 🚀 SUPER BADASS: AI-Powered Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 4) * 0.1 }}
            >
              <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                      <p className="text-2xl font-bold text-white">
                        <AnimatedCounter target={metric.value} prefix={metric.prefix || ''} suffix={metric.suffix || ''} />
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

      {/* 🚀 SUPER BADASS: AI-Powered Top Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">AI-Scored Top Leads</h3>
              <Badge className="bg-green-500 text-white">High Priority</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(lead.status)} flex items-center justify-center`}>
                        <span className="text-white font-bold">{lead.score}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-800">{lead.status === 'hot' ? '🔥' : lead.status === 'warm' ? '🌤️' : '❄️'}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{lead.name}</h4>
                      <p className="text-sm text-gray-300">Budget: {lead.budget}</p>
                      <p className="text-xs text-gray-400">Last activity: {lead.lastActivity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-400 font-medium">Close: {lead.predictedCloseDate}</p>
                    <div className="flex space-x-1 mt-2">
                      {lead.preferredProperties.slice(0, 2).map((prop, i) => (
                        <Badge key={i} className="bg-blue-500/20 text-blue-300 text-xs">
                          {prop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'lead' ? 'bg-green-400' :
                    activity.type === 'appointment' ? 'bg-blue-400' :
                    activity.type === 'scan' ? 'bg-purple-400' : 'bg-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview; 