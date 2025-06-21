import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, MessageCircle, TrendingUp, Clock, Shield, ArrowRight, Menu, X, Mic, Brain, Users, DollarSign, CheckCircle, Phone, Bell, HelpCircle, Plus, Minus, User, Send, Mail, Star, Link, Sparkles, Target, Home, Calendar, ChevronLeft, CreditCard, Building2, Globe, Download, Trash2, Lock, Database, Eye, FileCheck, UserPlus, Check, ArrowLeft, LogIn, KeyRound, Loader2, Settings, BarChart3, FileText, LogOut, RefreshCw, AlertTriangle, CheckCircle2, Gift, Crown, Palette, Layers, Code, Smartphone, Calculator, Edit3, Copy, ExternalLink, PieChart, LineChart, Activity, Upload, Save, ChevronRight, Search, Share2, Megaphone, Filter, MoreHorizontal, QrCode, MapPin, DollarSign as DollarIcon, Percent, ChevronDown, FileImage, Video, File, Bookmark, Archive, Grid, List, SortAsc, SortDesc, Calendar as CalendarIcon, ChevronUp, Folder, FolderOpen, Image, FileVideo, FilePdf, RotateCcw, Pause, Play, Square, Rocket, ThumbsUp, HandshakeIcon, Heart, Award, Lightbulb, Users2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";

const logoImage = '/homelistingai-logo.png';
const heroBackgroundImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop';
const aboutLogoImage = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1992&auto=format&fit=crop';
const headshotImage = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop';

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

// FAQ Border Colors - vibrant array for each question
const faqBorderColors = [
  "#667eea", // Blue-purple
  "#f093fb", // Pink-purple  
  "#4facfe", // Blue-cyan
  "#ff9a9e", // Pink-coral
  "#a18cd1", // Purple
  "#fad0c4", // Peach
  "#ffecd2", // Light orange
  "#a8edea"  // Teal
];

// Animated Counter Component
const AnimatedCounter = ({ target, prefix = '', suffix = '', duration = 2000, useCommas = true }: { target: number, prefix?: string, suffix?: string, duration?: number, useCommas?: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{prefix}{useCommas ? count.toLocaleString() : count}{suffix}</span>;
};

// Money-back Guarantee Badge Component
const MoneyBackBadge = ({ className = "", variant = "default" }: { className?: string, variant?: "default" | "white" | "outline" }) => {
  const variants = {
    default: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    white: "bg-white text-green-600 border border-green-200",
    outline: "border-2 border-green-500 text-green-600 bg-green-50"
  };

  return (
    <motion.div
      className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Shield className="w-4 h-4 mr-2" />
      15-Day Money-Back Guarantee
    </motion.div>
  );
};

// Consultation Booking Modal Component
const ConsultationModal = ({ children, onOpenChange }: { children: React.ReactNode, onOpenChange?: (open: boolean) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    timePreference: '',
    goals: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      timePreference: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Consultation booking submitted:', formData);
    setFormData({ name: '', email: '', phone: '', company: '', timePreference: '', goals: '' });
    alert('Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours to schedule your free AI consultation.');
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div 
            className="px-6 py-8 text-white relative"
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Book Your Free AI Consultation
                </DialogTitle>
                <DialogDescription className="text-white/90">
                  Discover how HomeListingAI can transform your real estate business
                </DialogDescription>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">30min</div>
                  <div className="text-sm opacity-90">Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Free</div>
                  <div className="text-sm opacity-90">No Cost</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">AI Demo</div>
                  <div className="text-sm opacity-90">Live Preview</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(555) 123-4567"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Real Estate Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your brokerage or company"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timePreference">Preferred Time *</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9AM - 12PM PST)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM PST)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 8PM PST)</SelectItem>
                    <SelectItem value="flexible">I'm flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goals">What are your main goals? *</Label>
                <Textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about your current challenges and what you'd like to achieve with AI..."
                  className="w-full min-h-[100px] resize-none"
                />
              </div>

              <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>What to expect:</strong> We'll show you a live demo of HomeListingAI, discuss your specific needs, and create a custom implementation plan for your business. No sales pressure - just valuable insights.
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 text-lg border-0"
              >
                <Calendar className="w-5 h-5" />
                Book My Free Consultation
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                We'll contact you within 24 hours to schedule your consultation
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Landing Page Component
const NewSalesPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "How's the neighborhood?", isUser: true, id: 1 }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Simulate live chat activity
  useEffect(() => {
    const responses = [
      "Great for families! Roosevelt Elementary (9/10 rating) is 0.3 miles away, and Maple Park is just 2 blocks over.",
      "What's the HOA fee?",
      "HOA is $150/month and includes landscaping, pool maintenance, and gym access.",
      "Can I install a pool?",
      "Yes! The backyard is perfect for a pool. No restrictions and utilities are already stubbed.",
      "I'm interested in scheduling a tour",
      "Perfect! I've notified Agent Sarah Martinez. She'll call you within 30 minutes."
    ];

    let messageIndex = 1;
    const interval = setInterval(() => {
      if (messageIndex < responses.length) {
        setIsTyping(true);
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            text: responses[messageIndex],
            isUser: messageIndex % 2 === 1,
            id: messageIndex + 1
          }]);
          setIsTyping(false);
          messageIndex++;
        }, 1500);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const floatingBubbles = [
    { id: 'bubble-neighborhood', text: "How's the neighborhood?" },
    { id: 'bubble-pool', text: "Can I add a pool?" },
    { id: 'bubble-hoa', text: "What's the HOA fee?" },
    { id: 'bubble-renovations', text: "Any recent renovations?" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Light Teal/Pink Gradient */}
      <header 
        className="fixed top-0 w-full backdrop-blur-sm z-50 border-b border-white/20 shadow-lg"
        style={{ 
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="HomeListingAI Logo" 
                className="h-8 w-auto filter brightness-0"
              />
              <span className="ml-2 text-xl font-bold text-slate-800">AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Pricing</a>
              <a href="#how-it-works" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">How It Works</a>
              <a href="#guarantee" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Guarantee</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth')}
                className="text-slate-700 hover:text-slate-900 transition-colors font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg font-semibold"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white/20 backdrop-blur-md border-t border-white/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-4 py-2 space-y-1">
              <a href="#features" className="block px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors font-medium">Features</a>
              <a href="#pricing" className="block px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors font-medium">Pricing</a>
              <a href="#how-it-works" className="block px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors font-medium">How It Works</a>
              <a href="#guarantee" className="block px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors font-medium">Guarantee</a>
              <div className="border-t border-white/30 pt-2 mt-2">
                <button 
                  onClick={() => navigate('/auth')}
                  className="block w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 transition-colors font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="block w-full text-left px-3 py-2 bg-slate-800 text-white rounded-lg mt-2 shadow-lg font-semibold"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-16"
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Gradient Overlay at 60% opacity */}
        <div 
          className="absolute inset-0" 
          style={{
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)"
          }}
        ></div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Main Message */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Bot className="w-4 h-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">AI-Powered Real Estate Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Talk to the
                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  House
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Every listing comes with its own AI assistant. Buyers get instant answers 24/7. 
                Agents get qualified leads on autopilot. <strong>$59/month.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={() => navigate('/signup')}
                  className="text-slate-800 px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: '#a8edea',
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 237, 234, 0.9)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start in minutes
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/chat-demo')}
                  className="text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  style={{ border: '2px solid #a8edea' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Try Demo Chat
                </motion.button>
              </div>

              <div className="space-y-3">
                <div className="text-white/80 text-sm">
                  ✅ 15-day money-back guarantee • No setup fees • Cancel anytime
                </div>
                
                <motion.div 
                  className="flex justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <MoneyBackBadge variant="white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Live Demo */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                
                {/* Live Results Dashboard */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold text-lg">Live Results Today</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/80 text-sm">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        <AnimatedCounter target={847} />
                      </div>
                      <div className="text-white/70 text-sm">Conversations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        <AnimatedCounter target={23} />
                      </div>
                      <div className="text-white/70 text-sm">Qualified Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        <AnimatedCounter target={12} />
                      </div>
                      <div className="text-white/70 text-sm">Tours Scheduled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        <AnimatedCounter target={3} />
                      </div>
                      <div className="text-white/70 text-sm">Deals Closed</div>
                    </div>
                  </div>

                  {/* Pulsing Notifications */}
                  <div className="mt-4 space-y-2">
                    <motion.div
                      className="flex items-center gap-3 bg-green-500/20 rounded-lg p-3"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bell className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">New qualified lead: Oak Street</span>
                      <span className="text-xs bg-green-400 text-green-900 px-2 py-1 rounded ml-auto">HOT</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-3 bg-blue-500/20 rounded-lg p-3"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">Tour scheduled: Pine Ave</span>
                      <span className="text-xs bg-blue-400 text-blue-900 px-2 py-1 rounded ml-auto">NEW</span>
                    </motion.div>
                  </div>
                </div>

                {/* Live Chat Preview */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Oak Street Property AI</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">Online now</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    <AnimatePresence>
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-start' : 'justify-end'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                            message.isUser 
                              ? 'bg-muted text-foreground rounded-bl-md' 
                              : 'bg-primary text-primary-foreground rounded-br-md'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isTyping && (
                      <motion.div
                        key="typing-indicator"
                        className="flex justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-md max-w-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Chat Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingBubbles.map((bubble, i) => (
            <motion.div
              key={bubble.id}
              className="absolute bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-white text-sm"
              style={{
                left: `${10 + i * 15}%`,
                top: `${15 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {bubble.text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Turn Every Listing Into a Lead Magnet</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stop chasing leads. Start capturing them automatically with AI that works 24/7.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Generate 3x More Leads",
                description: "AI responds instantly to every buyer inquiry, capturing leads while you sleep",
                benefit: "Increase lead volume without increasing work hours",
                gradient: gradients[0]
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Close Deals Faster",
                description: "Pre-qualified buyers arrive ready to buy, shortening your sales cycle",
                benefit: "Turn conversations into contracts in weeks, not months",
                gradient: gradients[1]
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Save 20+ Hours Weekly",
                description: "Eliminate repetitive answering of the same buyer questions",
                benefit: "Focus on high-value activities like showings and negotiations",
                gradient: gradients[2]
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Boost Listing Visibility",
                description: "Interactive AI chat increases engagement and time on listing pages",
                benefit: "Properties get more exposure and interest from serious buyers",
                gradient: gradients[3]
              },
              {
                icon: <ThumbsUp className="w-8 h-8" />,
                title: "Improve Client Satisfaction",
                description: "Buyers get instant answers and feel heard, even outside business hours",
                benefit: "Happy buyers become loyal clients and referral sources",
                gradient: gradients[4]
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Increase Commission Value",
                description: "More qualified leads and faster closings mean more deals and higher income",
                benefit: "Multiply your earning potential without multiplying your effort",
                gradient: gradients[5]
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4"
                    style={{ background: feature.gradient }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-primary">✓ {feature.benefit}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">From Setup to Sales in 4 Simple Steps</h2>
              <p className="text-xl text-muted-foreground">Be generating qualified leads in under 10 minutes</p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-0.5 bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Your Listing",
                  description: "Add photos, details, and key selling points in minutes",
                  icon: <Upload className="w-8 h-8" />,
                  gradient: gradients[0]
                },
                {
                  step: "02", 
                  title: "AI Learns Everything",
                  description: "Our AI instantly understands your property's unique features and neighborhood",
                  icon: <Brain className="w-8 h-8" />,
                  gradient: gradients[1]
                },
                {
                  step: "03",
                  title: "Share Your Smart Listing",
                  description: "Get a special link with built-in AI chat for all your marketing", 
                  icon: <Share2 className="w-8 h-8" />,
                  gradient: gradients[2]
                },
                {
                  step: "04",
                  title: "Watch Leads Pour In",
                  description: "AI qualifies buyers 24/7 and sends you hot leads instantly",
                  icon: <TrendingUp className="w-8 h-8" />,
                  gradient: gradients[3]
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className="relative mb-6">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative z-10"
                      style={{ background: step.gradient }}
                    >
                      {step.icon}
                    </div>
                    <div 
                      className="absolute top-2 left-2 text-6xl font-bold opacity-20 text-foreground"
                    >
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg text-white"
              style={{ background: "linear-gradient(135deg, #5ba8a0 0%, #d89bb8 100%)" }}
            >
              Get Started in 2 Minutes
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Start creating AI listings today
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" style={{ background: gradients[0] }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" style={{ background: gradients[1] }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Simple Pricing. Massive Results.</h2>
              <p className="text-xl text-muted-foreground mb-6">
                One low price. Unlimited potential. No hidden fees.
              </p>
              <MoneyBackBadge />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="relative overflow-hidden shadow-2xl border-2 border-transparent" style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", borderImage: "linear-gradient(135deg, #a8edea, #fed6e3) 1" }}>
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              </div>

              <CardContent className="p-8 md:p-12 text-center relative z-10">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-4 text-slate-800">Professional Plan</h3>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.span 
                      className="text-7xl font-bold text-slate-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      $59
                    </motion.span>
                    <div className="text-left">
                      <div className="text-slate-600">/month</div>
                      <div className="text-sm text-slate-600">Lifetime rate</div>
                    </div>
                  </div>
                  <motion.p 
                    className="text-lg text-slate-700 mb-6"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚀 <strong>Lock in this price forever</strong> - Early adopter special
                  </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    {[
                      "Up to 10 active listings",
                      "AI-powered property chat",
                      "24/7 lead capture",
                      "Automated follow-up",
                      "Built-in CRM system"
                    ].map((feature, index) => (
                      <motion.div 
                        key={feature} 
                        className="flex items-center gap-3 text-slate-800"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle 
                          className="w-5 h-5 text-green-600 flex-shrink-0" 
                        />
                        <span className="text-left font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      "QR code generation",
                      "Advanced analytics",
                      "Email marketing tools",
                      "Mobile app access",
                      "Priority support"
                    ].map((feature, index) => (
                      <motion.div 
                        key={feature} 
                        className="flex items-center gap-3 text-slate-800"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: (index + 5) * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle 
                          className="w-5 h-5 text-green-600 flex-shrink-0" 
                        />
                        <span className="text-left font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => navigate('/signup')}
                    className="w-full py-6 text-xl mb-6 bg-slate-800 hover:bg-slate-700 text-white shadow-2xl border-0"
                  >
                    <Rocket className="w-6 h-6 mr-2" />
                    Start in Minutes Your AI Listing
                  </Button>
                </motion.div>

                <div className="space-y-2 text-slate-700">
                  <p className="font-semibold">✅ No setup fees • Cancel anytime • 15-day guarantee</p>
                  <p className="text-sm">Join 2,000+ agents already using HomeListingAI</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-muted-foreground mb-4">
              🔥 <strong>That's less than $2 per day</strong> to transform your business
            </p>
            <p className="text-muted-foreground">
              Compare: Most agents spend $200+ monthly on lead generation with poor results
            </p>
          </motion.div>
        </div>
      </section>

      {/* Money-back Guarantee Section */}
      <section id="guarantee" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-10 right-10 w-32 h-32 rounded-full bg-green-200/30"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-emerald-200/40"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 text-green-900">Your Success is 100% Guaranteed</h2>
              <p className="text-xl text-green-700 max-w-3xl mx-auto">
                We're so confident HomeListingAI will transform your business, we'll put our money where our mouth is.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Shield className="w-12 h-12" />,
                title: "15-Day Money-Back Guarantee",
                description: "Not satisfied? Get every penny back, no questions asked. We believe in our product that much.",
                color: "text-green-600"
              },
              {
                icon: <X className="w-12 h-12" />,
                title: "Cancel Anytime",
                description: "No contracts. No commitments. No cancellation fees. Leave whenever you want with one click.",
                color: "text-blue-600"
              },
              {
                icon: <HandshakeIcon className="w-12 h-12" />,
                title: "Your Satisfaction Promise",
                description: "We succeed only when you succeed. Our support team works tirelessly to ensure your success.",
                color: "text-purple-600"
              }
            ].map((guarantee, index) => (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 border-green-100">
                  <div className={`${guarantee.color} mb-4 flex justify-center`}>
                    {guarantee.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-green-900">{guarantee.title}</h3>
                  <p className="text-green-700 leading-relaxed">{guarantee.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200"
          >
            <div className="text-center">
              <div className="text-4xl text-green-600 mb-4">"</div>
              <blockquote className="text-xl text-green-800 mb-6 italic">
                "I was skeptical at first, but HomeListingAI tripled my leads in the first month. 
                The guarantee gave me confidence to try it, and now I can't imagine working without it."
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-green-900">Sarah Martinez</div>
                <div className="text-sm text-green-600">Top Producer, Coldwell Banker</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <h3 className="text-2xl font-bold mb-4 text-green-900">Ready to Transform Your Real Estate Business?</h3>
            <p className="text-green-700 mb-8 text-lg">
              Join thousands of agents already generating more leads with zero risk.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Risk-Free Today
              </Button>
              <p className="text-sm text-green-600">
                15-day guarantee • No contracts • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise & White Label Solutions Section */}
      <section id="enterprise" className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5"
            style={{ background: gradients[2] }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-5"
            style={{ background: gradients[5] }}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Enterprise & White Label Solutions</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Partner with us to deliver AI-powered real estate solutions to your clients and teams
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-800">Scale AI Across Your Organization</h3>
                  <p className="text-lg text-slate-600 mb-6">
                    Whether you're a large brokerage, franchise network, or technology partner, 
                    we provide enterprise-grade AI solutions that scale with your business.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Building2 className="w-6 h-6" />,
                      title: "Multi-Tenant Architecture",
                      description: "Dedicated environments for each of your clients or locations",
                      gradient: gradients[0]
                    },
                    {
                      icon: <Palette className="w-6 h-6" />,
                      title: "Complete White Labeling",
                      description: "Your brand, your colors, your domain - seamless integration",
                      gradient: gradients[1]
                    },
                    {
                      icon: <Code className="w-6 h-6" />,
                      title: "API & Integration Suite",
                      description: "Connect with existing CRMs, MLS systems, and workflows",
                      gradient: gradients[2]
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Team Management",
                      description: "Advanced user roles, permissions, and analytics",
                      gradient: gradients[3]
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3"
                        style={{ background: feature.gradient }}
                      >
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold mb-2 text-slate-800">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full" style={{ background: "linear-gradient(135deg, #5ba8a0 0%, #d89bb8 100%)" }}>
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-6">Why Partner With Us?</h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        icon: <Rocket className="w-8 h-8" />,
                        title: "Revenue Growth",
                        description: "Generate new recurring revenue streams while adding value for your clients"
                      },
                      {
                        icon: <Layers className="w-8 h-8" />,
                        title: "Competitive Advantage",
                        description: "Stay ahead of the market with cutting-edge AI technology your competitors don't have"
                      },
                      {
                        icon: <Smartphone className="w-8 h-8" />,
                        title: "Rapid Deployment",
                        description: "Get to market quickly with our proven platform and dedicated support team"
                      },
                      {
                        icon: <Globe className="w-8 h-8" />,
                        title: "Global Scale",
                        description: "Deploy across multiple markets and regions with multi-language support"
                      }
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{benefit.title}</h4>
                          <p className="text-white/90 text-sm">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Building2 className="w-12 h-12" />,
                title: "Real Estate Brokerages",
                description: "Empower your agents with AI assistants for every listing. Increase productivity and lead generation across your entire team.",
                features: ["Agent onboarding", "Performance analytics", "Lead distribution", "Custom branding"],
                gradient: gradients[0]
              },
              {
                icon: <Globe className="w-12 h-12" />,
                title: "Franchise Networks",
                description: "Roll out AI-powered listing technology across all your locations. Maintain brand consistency while providing local flexibility.",
                features: ["Multi-location management", "Franchisee training", "Corporate reporting", "Brand compliance"],
                gradient: gradients[2]
              },
              {
                icon: <Code className="w-12 h-12" />,
                title: "Technology Partners",
                description: "Integrate our AI capabilities into your existing platform. Offer AI chat as a premium feature to your customers.",
                features: ["API access", "White-label UI", "Revenue sharing", "Technical support"],
                gradient: gradients[4]
              }
            ].map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-slate-200">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6"
                    style={{ background: solution.gradient }}
                  >
                    {solution.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800">{solution.title}</h3>
                  <p className="text-slate-600 mb-6">{solution.description}</p>
                  
                  <div className="space-y-2">
                    {solution.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Ready to Explore Partnership Opportunities?</h3>
              <p className="text-lg text-slate-600 mb-8">
                Let's discuss how we can customize our AI solutions for your specific needs. 
                Our team will work with you to create a tailored implementation plan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <ConsultationModal>
                  <Button 
                    className="px-8 py-4 text-lg bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-700 hover:to-slate-500 text-white shadow-lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Free AI Consultation
                  </Button>
                </ConsultationModal>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>30-minute strategy session</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Custom solution design</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Rocket className="w-4 h-4 text-purple-600" />
                  <span>Implementation roadmap</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-5"
            style={{ background: gradients[1] }}
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-32 h-32 rounded-full opacity-5"
            style={{ background: gradients[3] }}
            animate={{ scale: [1.2, 1, 1.2], rotate: [180, 270, 180] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center bg-gradient-to-r from-teal-50 to-pink-50 rounded-full px-6 py-2 mb-6">
                <HelpCircle className="w-5 h-5 text-slate-600 mr-2" />
                <span className="text-slate-600 font-medium">Frequently Asked Questions</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Everything You Need to Know</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Get answers to the most common questions about HomeListingAI and how it can transform your real estate business.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How does the AI property assistant work?",
                  answer: "Our AI is trained on real estate data and learns about each specific property you list. It can answer questions about neighborhood amenities, property features, pricing, HOA fees, local schools, and more. The AI operates 24/7, engaging with potential buyers instantly and qualifying leads before they reach you."
                },
                {
                  question: "How quickly can I get started?",
                  answer: "You can be up and running in under 10 minutes! Simply upload your listing details and photos, and our AI will instantly learn about your property. You'll get a smart listing link that you can share across all your marketing channels immediately. No technical setup or IT support required."
                },
                {
                  question: "What's included in the $59/month plan?",
                  answer: "Everything you need: up to 10 active listings with AI assistants, 24/7 lead capture and qualification, built-in CRM system, QR code generation, advanced analytics, email marketing tools, mobile app access, and priority customer support. No hidden fees or additional costs."
                },
                {
                  question: "Do I really get to keep the $59 price forever?",
                  answer: "Yes! As an early adopter, you lock in the $59/month rate for life. This special pricing won't increase as long as you remain an active subscriber. It's our way of rewarding agents who trust us early in our journey."
                },
                {
                  question: "What if the AI gives wrong information about my listing?",
                  answer: "Our AI is highly accurate, but you have full control. You can review and customize all responses during setup, and the AI learns from corrections. Plus, our system includes safeguards that direct complex questions to you directly. We also provide easy editing tools to update property information anytime."
                },
                {
                  question: "How do I know if leads are qualified?",
                  answer: "Our AI asks intelligent qualifying questions about budget, timeline, financing, and specific needs. It scores each lead and provides you with detailed summaries. You'll receive instant notifications for hot leads and regular reports on all prospect interactions, so you can prioritize your follow-up efforts."
                },
                {
                  question: "Can I integrate this with my existing CRM or website?",
                  answer: "Yes! We offer API integrations with popular CRM systems, and you can embed our AI chat widget on your existing website. For enterprise clients, we provide custom integrations and white-label solutions. Our team helps with setup to ensure seamless workflow integration."
                },
                {
                  question: "What makes this different from other lead generation tools?",
                  answer: "Unlike generic lead forms or chatbots, every property gets its own specialized AI assistant that knows specific details about that listing and neighborhood. This creates engaging, helpful conversations that build trust with buyers while automatically qualifying and nurturing leads around the clock."
                },
                {
                  question: "Is there really a 15-day money-back guarantee?",
                  answer: "Absolutely! We're so confident HomeListingAI will transform your business that we offer a full 15-day money-back guarantee. If you're not completely satisfied for any reason, just contact us and we'll refund every penny. No questions asked, no fine print."
                },
                {
                  question: "Do you offer enterprise or white-label solutions?",
                  answer: "Yes! We work with large brokerages, franchise networks, and technology partners to provide custom enterprise solutions. This includes white-labeling, multi-tenant architecture, custom integrations, and dedicated support. Contact us to discuss your specific enterprise needs."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-opacity-50 hover:shadow-md transition-all duration-300"
                    style={{ '--border-color': faqBorderColors[index % faqBorderColors.length] } as React.CSSProperties}
                  >
                    <AccordionTrigger 
                      className="px-6 py-4 text-left hover:no-underline"
                      style={{
                        borderLeft: `4px solid ${faqBorderColors[index % faqBorderColors.length]}`
                      }}
                    >
                      <span className="font-semibold text-slate-800 pr-4">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-slate-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA at bottom of FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-teal-50 to-pink-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                We're here to help! Get personalized answers and see HomeListingAI in action with a free consultation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ConsultationModal>
                  <Button 
                    className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-700 hover:to-slate-500 text-white shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book Free Consultation
                  </Button>
                </ConsultationModal>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-5"
            style={{ background: gradients[3] }}
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-56 h-56 rounded-full opacity-5"
            style={{ background: gradients[0] }}
            animate={{ rotate: [360, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-teal-50 rounded-full px-6 py-2 mb-6">
                <Heart className="w-5 h-5 text-slate-600 mr-2" />
                <span className="text-slate-600 font-medium">About HomeListingAI</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Revolutionizing Real Estate with AI</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Born from a vision to solve real estate's biggest challenge: connecting the right buyers with the right properties at the right time.
              </p>
            </motion.div>
          </div>

          {/* Company Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Our Mission</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    We believe every property has a story to tell, and every buyer has questions that deserve instant, accurate answers. 
                    Traditional real estate marketing leaves buyers frustrated and agents overwhelmed with repetitive inquiries.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    That's why we created HomeListingAI—to give every listing its own intelligent assistant that never sleeps, 
                    never takes a day off, and always provides helpful, accurate information to potential buyers.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                      {
                        icon: <Lightbulb className="w-8 h-8" />,
                        title: "Innovation First",
                        description: "Cutting-edge AI technology designed specifically for real estate",
                        gradient: gradients[0]
                      },
                      {
                        icon: <Users2 className="w-8 h-8" />,
                        title: "Agent Focused",
                        description: "Built by real estate professionals who understand the industry",
                        gradient: gradients[1]
                      },
                      {
                        icon: <Heart className="w-8 h-8" />,
                        title: "Customer Success",
                        description: "We succeed only when our agents succeed and grow their business",
                        gradient: gradients[2]
                      },
                      {
                        icon: <Award className="w-8 h-8" />,
                        title: "Quality Driven",
                        description: "Every feature is tested and refined to deliver exceptional results",
                        gradient: gradients[4]
                      }
                    ].map((value, index) => (
                      <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="p-4 bg-white rounded-lg shadow-sm border border-slate-200"
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3"
                          style={{ background: value.gradient }}
                        >
                          {value.icon}
                        </div>
                        <h4 className="font-semibold mb-2 text-slate-800">{value.title}</h4>
                        <p className="text-sm text-slate-600">{value.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <ImageWithFallback 
                  src={aboutLogoImage} 
                  alt="HomeListingAI Company" 
                  className="w-full max-w-lg rounded-2xl shadow-2xl"
                  fallbackSrc="https://via.placeholder.com/800x600"
                />

              </div>
            </motion.div>
          </div>

          {/* Founder Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}>
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Text Content */}
                  <div className="p-8 lg:p-12">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl font-bold mb-4 text-slate-900">Meet Chris Potter</h3>
                        <p className="text-lg text-slate-700 font-medium">Founder & CEO, HomeListingAI</p>
                      </div>
                      
                      <div className="space-y-4 text-slate-800">
                        <p className="leading-relaxed">
                          "After 15 years in real estate technology and watching countless agents struggle with lead generation, 
                          I knew there had to be a better way. I spent countless nights talking to top producers, understanding their pain points."
                        </p>
                        <p className="leading-relaxed">
                          "The breakthrough came when I realized we weren't just building software—we were creating digital real estate experts. 
                          Each AI assistant becomes an extension of the agent, available 24/7 to help buyers while qualifying serious prospects."
                        </p>
                        <p className="leading-relaxed">
                          "Today, HomeListingAI powers thousands of listings and has generated over $2B in real estate transactions. 
                          But we're just getting started. Our mission is to transform how every property is marketed and sold."
                        </p>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <p className="text-slate-800 font-semibold italic">
                          "Technology should amplify human expertise, not replace it. HomeListingAI makes every agent a superhero."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="relative flex items-center justify-center p-8">
                    <ImageWithFallback 
                      src={headshotImage} 
                      alt="Chris Potter, Founder of HomeListingAI" 
                      className="w-64 h-64 object-cover rounded-full shadow-xl border-4 border-white/30"
                      fallbackSrc="https://via.placeholder.com/256x256"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Journey in Numbers</h3>
              <p className="text-lg text-slate-600">The milestones that shaped our story</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  number: "1997",
                  label: "First Website",
                  description: "Started our digital journey with our first website launch",
                  icon: <Globe className="w-8 h-8" />,
                  gradient: gradients[0]
                },
                {
                  number: "2002",
                  label: "Agency Started",
                  description: "Founded our real estate agency and began helping clients",
                  icon: <Building2 className="w-8 h-8" />,
                  gradient: gradients[1]
                },
                {
                  number: "2007",
                  label: "First Mobile App",
                  description: "Pioneered mobile real estate technology with our first app",
                  icon: <Smartphone className="w-8 h-8" />,
                  gradient: gradients[2]
                },
                {
                  number: "2",
                  label: "100 lb Labradors",
                  description: "Our beloved office companions who keep us grounded",
                  icon: <Heart className="w-8 h-8" />,
                  gradient: gradients[3]
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4"
                      style={{ background: stat.gradient }}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {stat.number === "2" ? "2" : <AnimatedCounter target={parseInt(stat.number)} useCommas={false} />}
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">{stat.label}</h4>
                    <p className="text-sm text-slate-600">{stat.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why We're Different */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Why We're Different</h3>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                While others build generic chatbots, we create specialized AI real estate experts that understand properties, neighborhoods, and buyer psychology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real Estate DNA",
                  description: "Built by agents, for agents. Every feature is designed with deep real estate industry knowledge and tested by practicing professionals.",
                  icon: <Home className="w-12 h-12" />,
                  gradient: gradients[0]
                },
                {
                  title: "Hyper-Local Intelligence", 
                  description: "Our AI understands neighborhoods, school districts, local amenities, and market trends to provide contextually relevant answers.",
                  icon: <MapPin className="w-12 h-12" />,
                  gradient: gradients[1]
                },
                {
                  title: "Continuous Learning",
                  description: "Every conversation makes our AI smarter. We constantly improve based on real buyer interactions and agent feedback.",
                  icon: <Brain className="w-12 h-12" />,
                  gradient: gradients[2]
                }
              ].map((differentiator, index) => (
                <motion.div
                  key={differentiator.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-slate-200">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6"
                      style={{ background: differentiator.gradient }}
                    >
                      {differentiator.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-slate-900">{differentiator.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{differentiator.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-8 md:p-12" style={{ background: "linear-gradient(135deg, #5ba8a0 0%, #d89bb8 100%)" }}>
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Real Estate Business?</h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of agents who have discovered the power of AI-driven listing marketing. 
                  Your success is our mission.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    onClick={() => navigate('/signup')}
                    className="px-8 py-4 text-lg bg-white text-slate-800 hover:bg-gray-100 shadow-lg"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Your AI Journey Today
                  </Button>
                  
                  <ConsultationModal>
                    <Button 
                      variant="outline"
                      className="px-8 py-4 text-lg border-white text-white hover:bg-white/10 bg-[rgba(255,255,255,0.12)]"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Talk to Our Team
                    </Button>
                  </ConsultationModal>
                </div>

                <div className="mt-8 flex justify-center items-center gap-8 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>15-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>24/7 support</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={logoImage} 
                  alt="HomeListingAI Logo" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
                <span className="ml-2 text-xl font-bold">AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your real estate business with AI-powered listings and automated lead generation.
              </p>
              <MoneyBackBadge variant="white" className="bg-gray-800 text-green-400" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#guarantee" className="hover:text-white">Guarantee</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@homelistingai.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Seattle, WA</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HomeListingAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewSalesPage; 