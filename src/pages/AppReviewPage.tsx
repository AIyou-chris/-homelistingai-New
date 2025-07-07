import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Eye, 
  Edit3, 
  CheckCircle, 
  ArrowRight,
  Bot,
  MessageSquare,
  BarChart3,
  Users,
  Zap,
  Play,
  Settings,
  RefreshCw,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const AppReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Simulate AI analysis of the built agent
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for the built agent/app
  const agentData = {
    name: "Your AI Real Estate Assistant",
    status: "Ready to Deploy",
    confidence: 94,
    features: [
      { name: "Property Chat AI", status: "active", score: 98 },
      { name: "Lead Qualification", status: "active", score: 91 },
      { name: "24/7 Availability", status: "active", score: 100 },
      { name: "Mobile Optimized", status: "active", score: 96 },
      { name: "Smart Responses", status: "active", score: 89 }
    ],
    stats: {
      estimatedLeads: "15-25",
      responseTime: "< 2 seconds",
      accuracy: "94%",
      coverage: "24/7"
    },
    listing: {
      title: "Luxury Malibu Villa with Ocean Views",
      price: "$2,850,000",
      features: ["5 Bedrooms", "5.5 Bathrooms", "6,000 sq ft", "Ocean View"],
      aiDescription: "This stunning oceanfront villa represents the pinnacle of luxury living..."
    }
  };

  const handleContinueToPayment = () => {
    navigate('/checkout');
  };

  const handleMakeChanges = () => {
    navigate('/upload');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <RefreshCw className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Building Your AI Agent
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Our AI is analyzing your property details and creating your personalized assistant...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={itemVariants}
            >
              Your AI Agent is Ready!
            </motion.h1>
            
            <motion.p 
              className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Review your personalized AI assistant and see how it will represent your properties
            </motion.p>

            <motion.div 
              className="flex items-center justify-center gap-6 text-center"
              variants={itemVariants}
            >
              <div>
                <div className="text-3xl font-bold">{agentData.confidence}%</div>
                <div className="text-sm text-blue-100">Confidence Score</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <div className="text-3xl font-bold">{agentData.stats.estimatedLeads}</div>
                <div className="text-sm text-blue-100">Weekly Leads</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <div className="text-3xl font-bold">{agentData.stats.responseTime}</div>
                <div className="text-sm text-blue-100">Response Time</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Column - Agent Features */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Bot className="w-6 h-6 text-blue-600" />
                    AI Agent Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {feature.score}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{agentData.stats.accuracy}</div>
                    <div className="text-sm text-gray-600">AI Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{agentData.stats.coverage}</div>
                    <div className="text-sm text-gray-600">Availability</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{agentData.stats.estimatedLeads}</div>
                    <div className="text-sm text-gray-600">Weekly Leads</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{agentData.stats.responseTime}</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Listing Preview */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-indigo-600" />
                    Your Listing Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Eye className="w-12 h-12 mx-auto mb-2" />
                        <p>Property Image Preview</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {agentData.listing.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        {agentData.listing.price}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {agentData.listing.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {agentData.listing.aiDescription}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Ready for Action!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your AI agent is trained and ready to start conversations with potential buyers 24/7
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleContinueToPayment}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Secure Your AI Agent
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleMakeChanges}
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Make Changes
            </Button>
          </motion.div>
        </motion.div>

        {/* What's Next Preview */}
        <motion.div 
          className="mt-16 bg-white rounded-2xl shadow-xl p-8"
          variants={itemVariants}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Happens Next?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure your subscription and get instant access to your full AI-powered dashboard
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <Zap className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">Secure Checkout</h3>
              <p className="text-gray-600 text-sm">Complete your subscription to activate your AI agent and unlock all features</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">Full Dashboard Access</h3>
              <p className="text-gray-600 text-sm">Instant access to CRM, lead management, AI training, and all premium features</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppReviewPage; 