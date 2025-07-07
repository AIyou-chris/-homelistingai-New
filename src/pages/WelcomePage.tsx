import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Upload, 
  Bot, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: "Build Your Agent",
      description: "Add your first property and watch our AI transform it into a professional listing with stunning descriptions and optimized content.",
      duration: "2-3 minutes"
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      title: "Review Your AI Agent",
      description: "See your completed AI assistant, review its capabilities, and make any final adjustments before going live.",
      duration: "1-2 minutes"
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      title: "Secure Your Plan",
      description: "Complete your subscription to activate your AI agent and unlock all premium features.",
      duration: "1 minute"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: "Full Dashboard Access",
      description: "Manage leads, track performance, and scale your business with powerful analytics and automation tools.",
      duration: "Ongoing"
    }
  ];

  const benefits = [
    "24/7 automated lead generation",
    "AI-powered property descriptions",
    "Instant buyer qualification",
    "Smart lead scoring and prioritization",
    "Mobile-optimized property chat",
    "Comprehensive analytics dashboard"
  ];

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
      transition: {
        duration: 0.5
      }
    }
  };

  const handleGetStarted = () => {
    navigate('/upload');
  };

  const handleSkipToDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        
        <motion.div 
          className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Welcome to Your AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Real Estate Empire
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Here's exactly what's going to happen next. In just a few minutes, you'll have a fully operational AI agent generating leads for your properties 24/7.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={itemVariants}
            >
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Building Your AI Agent
              </Button>
              
              <Button 
                onClick={handleSkipToDemo}
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
              >
                <Target className="w-5 h-5 mr-2" />
                See Demo First
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Process Steps */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            What's Going to Go Down
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Your journey to automated real estate success in 4 simple steps
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Step {index + 1}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="text-xs text-gray-500 font-medium">
                    ⏱️ {step.duration}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              What You'll Get Today
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Every feature you need to transform your real estate business
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={itemVariants}
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Join thousands of agents who are already generating leads automatically with HomeListingAI
            </motion.p>
            <motion.div
              variants={itemVariants}
            >
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your AI Journey Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 