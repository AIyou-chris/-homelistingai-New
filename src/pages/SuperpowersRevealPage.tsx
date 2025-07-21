import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Brain, 
  Smartphone, 
  TrendingUp,
  Heart,
  Target,
  Rocket,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  Mail,
  Calendar,
  Settings,
  Globe,
  Shield,
  Clock,
  Star
} from 'lucide-react';

interface SuperpowerFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  category: 'ai' | 'leads' | 'analytics' | 'mobile';
  preview: string;
}

const SuperpowersRevealPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const superpowers: SuperpowerFeature[] = [
    {
      icon: Brain,
      title: "Custom AI Personality",
      description: "Train your AI to sound exactly like you - your tone, your expertise, your style",
      category: 'ai',
      preview: "Instead of generic responses, your AI becomes YOUR digital twin"
    },
    {
      icon: Users,
      title: "Intelligent Lead Capture", 
      description: "Automatically collect visitor info and qualify leads while they chat",
      category: 'leads',
      preview: "Turn every conversation into a potential client"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "See who's viewing, what they're asking, and when they're most interested",
      category: 'analytics', 
      preview: "Know exactly when to follow up for maximum conversion"
    },
    {
      icon: Smartphone,
      title: "Professional Mobile App",
      description: "Your own branded mobile app with QR codes and custom domain",
      category: 'mobile',
      preview: "Stand out from competitors with your own app store presence"
    },
    {
      icon: Mail,
      title: "CRM Integration",
      description: "Automatically sync leads to your existing CRM and email campaigns",
      category: 'leads',
      preview: "Seamless workflow integration with your current tools"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI automatically schedules showings based on your calendar availability",
      category: 'ai',
      preview: "Never miss a showing opportunity again"
    }
  ];

  const basicFeatures = [
    "Generic AI responses",
    "No lead capture",
    "No analytics",
    "Basic mobile view",
    "No customization"
  ];

  const superpowerFeatures = [
    "Custom AI personality trained on YOUR expertise",
    "Intelligent lead capture & qualification",
    "Real-time visitor analytics & engagement tracking",
    "Professional branded mobile app + QR codes",
    "Full CRM integration & automated follow-ups",
    "Smart scheduling & appointment booking",
    "Custom domain & white-label branding",
    "Advanced market insights & competitor analysis"
  ];

  useEffect(() => {
    // Auto-cycle through features
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % superpowers.length);
    }, 3000);

    // Show comparison after 10 seconds
    const comparisonTimer = setTimeout(() => {
      setShowComparison(true);
    }, 10000);

    // Show CTA after 15 seconds
    const ctaTimer = setTimeout(() => {
      setShowCTA(true);
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(comparisonTimer);
      clearTimeout(ctaTimer);
    };
  }, []);

  const handleGetSuperpowers = () => {
    navigate('/signup');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6 } 
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 text-center pt-16 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Superpowers
          </span>
          <br />
          <span className="text-white">Unlocked</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          You just built a basic AI agent in 30 seconds.<br />
          <span className="text-yellow-400 font-semibold">Want to see what happens when we give it superpowers?</span>
        </motion.p>
      </motion.div>

      {/* Feature Showcase */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-4 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Display */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  {React.createElement(superpowers[currentFeature].icon, { 
                    className: "w-10 h-10 text-white" 
                  })}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {superpowers[currentFeature].title}
                </h3>
                <p className="text-blue-200 text-lg mb-4 leading-relaxed">
                  {superpowers[currentFeature].description}
                </p>
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30">
                  <p className="text-yellow-200 font-medium">
                    {superpowers[currentFeature].preview}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-4"
          >
            {superpowers.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  index === currentFeature
                    ? 'bg-white/20 border-yellow-400 shadow-lg shadow-yellow-400/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setCurrentFeature(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    index === currentFeature 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-white/20'
                  }`}>
                    {React.createElement(feature.icon, { 
                      className: "w-6 h-6 text-white" 
                    })}
                  </div>
                  <h4 className="text-white font-semibold text-sm">
                    {feature.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Comparison Section */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-6xl mx-auto px-4 mb-16"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Basic vs Superpowers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Version */}
                <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">What You Just Built</h3>
                  </div>
                  <ul className="space-y-3">
                    {basicFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-red-200">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Superpowers Version */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">With Superpowers</h3>
                  </div>
                  <ul className="space-y-3">
                    {superpowerFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-purple-100">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <AnimatePresence>
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative z-10 max-w-4xl mx-auto px-4 mb-16"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <Sparkles className="absolute top-4 left-4 w-6 h-6 text-white/30 animate-pulse" />
                <Star className="absolute top-8 right-8 w-8 h-8 text-white/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Rocket className="absolute bottom-4 left-8 w-6 h-6 text-white/30 animate-pulse" style={{ animationDelay: '1s' }} />
                <Zap className="absolute bottom-8 right-4 w-6 h-6 text-white/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>

              <div className="relative z-10">
                <Crown className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready to Unlock Your Superpowers?
                </h2>
                <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                  Join thousands of top realtors who've already transformed their business with AI superpowers
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleGetSuperpowers}
                    className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                  >
                    <Rocket className="w-6 h-6" />
                    Unlock My Superpowers
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  
                  <div className="flex items-center gap-2 text-white/80">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">30-day money-back guarantee</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Setup in 2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Join 10k+ realtors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Action */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <button
          onClick={handleGetSuperpowers}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
        >
          <Crown className="w-5 h-5" />
          Get Superpowers Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default SuperpowersRevealPage; 