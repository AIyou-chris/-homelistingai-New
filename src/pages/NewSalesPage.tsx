import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedDots from '../components/shared/AnimatedDots';
import { Bot, TrendingUp, Award, Shield, CheckCircle, Rocket, Layers, Code, Users, Mic, Map, Upload, Brain, Share2, Zap, Clock, Mail, SlidersHorizontal, Heart, Lightbulb, Users2, ChevronDown, Home, Sparkles, BarChart2, Target, Crown } from 'lucide-react';
import { 
  FigmaComponent, 
  FigmaButton, 
  FigmaCard, 
  FigmaImage, 
  FigmaSection,
  FigmaDesignSystem,
  FigmaAssets 
} from '../components/figma/FigmaDesignSystem';
import Navbar from '../components/shared/Navbar';
import ConsultationModal from '../components/shared/ConsultationModal';
import VoiceBot from '../components/shared/VoiceBot';
import Modal from '../components/shared/Modal';
import MobileAppDemo from '../components/shared/MobileAppDemo';

// Add custom animation styles
const animationStyles = `
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes dash {
  0% { stroke-dasharray: 0, 1000; }
  50% { stroke-dasharray: 1000, 0; }
  100% { stroke-dasharray: 0, 1000; }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-dash {
  animation: dash 4s linear infinite;
}
.flip-card {
  perspective: 1000px;
}
.flip-card-inner {
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.flip-card-back {
  transform: rotateY(180deg);
}
`;

// Animated Counter Component for live results
const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

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

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translateX(-${(1 - count / target) * 100}%)`;
    }
  }, [count, target]);

  return <span ref={ref}>{count}</span>;
};

// Live Results Card from your Figma design
const LiveResultsCard: React.FC = () => {
    return (
        <FigmaCard variant="glass" className="p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Live Results Today</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm">Live</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                    <div className="text-4xl font-bold"><AnimatedCounter target={847} /></div>
                    <div className="text-sm opacity-80">Conversations</div>
                </div>
                <div>
                    <div className="text-4xl font-bold"><AnimatedCounter target={23} /></div>
                    <div className="text-sm opacity-80">Qualified Leads</div>
                </div>
                <div>
                    <div className="text-4xl font-bold"><AnimatedCounter target={12} /></div>
                    <div className="text-sm opacity-80">Tours Scheduled</div>
                </div>
                <div>
                    <div className="text-4xl font-bold"><AnimatedCounter target={3} /></div>
                    <div className="text-sm opacity-80">Deals Closed</div>
                </div>
            </div>
        </FigmaCard>
    );
};

// Chat Preview Card from your Figma design
const ChatPreviewCard: React.FC = () => {
    return (
        <FigmaCard variant="default" className="p-4 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Oak Street Property AI</h4>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-500">Online now</span>
                    </div>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-start">
                    <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800">How's the neighborhood?</div>
                </div>
                 <div className="flex justify-start">
                    <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800">What's the HOA fee?</div>
                </div>
                 <div className="flex justify-start">
                    <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800">Can I install a pool?</div>
                </div>
            </div>
        </FigmaCard>
    );
};

// This is your new Hero section, using the background you exported!
const YourFigmaHero: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  
  // Background configuration - easily switch between different options
  const backgroundConfig = {
    type: 'dashboard', // Options: 'video', 'image', 'gradient', 'animated', 'dashboard'
    video: '/herobg1.mp4',
    image: '/hero-bg.png',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    animated: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    dashboard: {
      primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      accent: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
      glow: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)'
    }
  };

  const renderBackground = () => {
    switch (backgroundConfig.type) {
      case 'video':
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            >
              <source src={backgroundConfig.video} type="video/mp4" />
              {/* Fallback to original background image */}
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${FigmaAssets.heroBackground})` }}
              />
            </video>
          </div>
        );
      
      case 'image':
        return (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundConfig.image})` }}
          />
        );
      
      case 'gradient':
        return (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ background: backgroundConfig.gradient }}
          />
        );
      
             case 'animated':
         return (
           <div className="absolute inset-0 w-full h-full overflow-hidden">
             {/* Animated gradient background */}
             <div 
               className="absolute inset-0 animate-pulse"
               style={{ background: backgroundConfig.animated.primary }}
             />
             <div 
               className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse"
               style={{ 
                 background: backgroundConfig.animated.secondary,
                 animationDelay: '1s'
               }}
             />
             <div 
               className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse"
               style={{ 
                 background: backgroundConfig.animated.accent,
                 animationDelay: '2s'
               }}
             />
           </div>
         );
       
       case 'dashboard':
         return (
           <div className="absolute inset-0 w-full h-full overflow-hidden">
             {/* Main dashboard background */}
             <div 
               className="absolute inset-0"
               style={{ background: backgroundConfig.dashboard.primary }}
             />
             
             {/* Animated dashboard elements */}
             <div className="absolute inset-0">
               {/* Dashboard Header */}
               <div className="absolute top-8 left-8 right-8 h-16 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '0s' }}>
                 <div className="flex items-center justify-between h-full px-6">
                   <div className="flex items-center gap-4">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                     <div className="text-white font-semibold">Agent Dashboard</div>
                     <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs">Live</div>
                   </div>
                   <div className="flex items-center gap-4 text-white/80 text-sm">
                     <span>📊 Dashboard</span>
                     <span>🎯 Leads</span>
                     <span className="flex items-center gap-1">
                       <img src="/new hlailogo.png" alt="HomeListingAI" className="w-4 h-4" />
                       Listings
                     </span>
                     <span>📅 Appointments</span>
                   </div>
                 </div>
               </div>
               
               {/* Live Stats Cards */}
               <div className="absolute top-32 left-8 w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '0.5s' }}>
                 <div className="p-4">
                   <div className="flex items-center justify-between mb-3">
                     <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>
                     <div className="text-green-300 text-xs">+12%</div>
                   </div>
                   <div className="text-white text-2xl font-bold">847</div>
                   <div className="text-white/60 text-sm">Conversations</div>
                   <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full" style={{ width: '75%' }}></div>
                   </div>
                 </div>
               </div>
               
               <div className="absolute top-32 left-64 w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '1s' }}>
                 <div className="p-4">
                   <div className="flex items-center justify-between mb-3">
                     <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                     <div className="text-purple-300 text-xs">+8%</div>
                   </div>
                   <div className="text-white text-2xl font-bold">23</div>
                   <div className="text-white/60 text-sm">Qualified Leads</div>
                   <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: '60%' }}></div>
                   </div>
                 </div>
               </div>
               
               <div className="absolute top-32 right-8 w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '1.5s' }}>
                 <div className="p-4">
                   <div className="flex items-center justify-between mb-3">
                     <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
                     <div className="text-orange-300 text-xs">+15%</div>
                   </div>
                   <div className="text-white text-2xl font-bold">12</div>
                   <div className="text-white/60 text-sm">Tours Scheduled</div>
                   <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full" style={{ width: '85%' }}></div>
                   </div>
                 </div>
               </div>
               
               {/* AI Chat Interface */}
               <div className="absolute bottom-32 left-8 w-80 h-64 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '2s' }}>
                 <div className="p-4 h-full flex flex-col">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                     <div className="text-white font-semibold">Oak Street AI</div>
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   </div>
                   <div className="flex-1 space-y-3">
                     <div className="flex justify-start">
                       <div className="max-w-xs px-3 py-2 rounded-lg bg-white/20 text-white text-sm">How's the neighborhood?</div>
                     </div>
                     <div className="flex justify-end">
                       <div className="max-w-xs px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">Great area! Schools rated 9/10, low crime, 15 min to downtown.</div>
                     </div>
                     <div className="flex justify-start">
                       <div className="max-w-xs px-3 py-2 rounded-lg bg-white/20 text-white text-sm">What's the HOA fee?</div>
                     </div>
                   </div>
                   <div className="mt-3 h-8 bg-white/20 rounded-lg flex items-center px-3">
                     <div className="text-white/60 text-sm">Type your message...</div>
                   </div>
                 </div>
               </div>
               
               {/* Property Listing Card */}
               <div className="absolute bottom-32 right-8 w-72 h-64 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '2.5s' }}>
                 <div className="p-4 h-full flex flex-col">
                   <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-3 relative overflow-hidden">
                     <img 
                       src="/hero-bg.png" 
                       alt="Beautiful Home" 
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                   </div>
                   <div className="text-white font-semibold mb-2">123 Oak Street</div>
                   <div className="text-white/60 text-sm mb-3">Beautiful 3 bed, 2 bath home with modern upgrades</div>
                   <div className="flex items-center justify-between text-white/80 text-sm mb-3">
                     <span>3 bds</span>
                     <span>2 ba</span>
                     <span>1,850 sqft</span>
                   </div>
                   <div className="text-white text-xl font-bold mb-2">$499,000</div>
                   <div className="flex gap-2">
                     <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs">Active</div>
                     <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs">AI Enhanced</div>
                   </div>
                 </div>
               </div>
               
               {/* Additional Property Cards */}
               <div className="absolute top-64 left-1/4 w-56 h-40 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '3.5s' }}>
                 <div className="p-3 h-full flex flex-col">
                   <div className="h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-2 relative overflow-hidden">
                     <img 
                       src="/circuit-brain.png" 
                       alt="Luxury Condo" 
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                   </div>
                   <div className="text-white font-semibold text-sm mb-1">456 Pine Ave</div>
                   <div className="text-white/60 text-xs mb-2">2 bed, 2 bath luxury condo</div>
                   <div className="text-white text-lg font-bold">$850,000</div>
                 </div>
               </div>
               
               <div className="absolute top-80 right-1/4 w-56 h-40 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '4s' }}>
                 <div className="p-3 h-full flex flex-col">
                   <div className="h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mb-2 relative overflow-hidden">
                     <img 
                       src="/realtor.png" 
                       alt="Family Home" 
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                   </div>
                   <div className="text-white font-semibold text-sm mb-1">789 Maple Dr</div>
                   <div className="text-white/60 text-xs mb-2">4 bed, 3 bath family home</div>
                   <div className="text-white text-lg font-bold">$950,000</div>
                 </div>
               </div>
               
               <div className="absolute bottom-64 left-1/3 w-56 h-40 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '4.5s' }}>
                 <div className="p-3 h-full flex flex-col">
                   <div className="h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mb-2 relative overflow-hidden">
                     <img 
                       src="/hero-background.png" 
                       alt="Modern Townhouse" 
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                   </div>
                   <div className="text-white font-semibold text-sm mb-1">321 Elm St</div>
                   <div className="text-white/60 text-xs mb-2">3 bed, 2.5 bath townhouse</div>
                   <div className="text-white text-lg font-bold">$675,000</div>
                 </div>
               </div>
               
               {/* Live Activity Feed */}
               <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-64 h-48 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-float" style={{ animationDelay: '3s' }}>
                 <div className="p-4">
                   <div className="text-white font-semibold mb-3">Live Activity</div>
                   <div className="space-y-2">
                     <div className="flex items-center gap-2 text-white/80 text-xs">
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                       <span>New lead: Sarah L.</span>
                     </div>
                     <div className="flex items-center gap-2 text-white/80 text-xs">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                       <span>Tour scheduled: 2pm</span>
                     </div>
                     <div className="flex items-center gap-2 text-white/80 text-xs">
                       <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                       <span>AI response sent</span>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Animated data points */}
               <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
               <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
               <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
               
               {/* Glowing orbs */}
               <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
               <div className="absolute bottom-1/3 right-1/6 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
               
               {/* Animated lines/connections */}
               <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
                 <defs>
                   <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                     <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                     <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
                   </linearGradient>
                 </defs>
                 <path d="M 100 200 Q 300 100 500 200" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-dash">
                   <animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur="4s" repeatCount="indefinite" />
                 </path>
                 <path d="M 200 300 Q 400 200 600 300" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-dash" style={{ animationDelay: '1s' }}>
                   <animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur="4s" repeatCount="indefinite" />
                 </path>
               </svg>
               
               {/* Center talking animation - AI voice waves */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                 <div className="relative">
                   {/* Voice wave bars */}
                   <div className="flex items-end space-x-1">
                     <div className="w-1 h-4 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                     <div className="w-1 h-6 bg-gradient-to-t from-purple-400 to-pink-500 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-red-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-1 h-6 bg-gradient-to-t from-red-400 to-orange-500 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                     <div className="w-1 h-4 bg-gradient-to-t from-orange-400 to-yellow-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                   </div>
                   
                   {/* Pulsing chat bubble */}
                   <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                     <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse">
                       <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                       </div>
                     </div>
                   </div>
                   
                   {/* Floating text */}
                   <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-medium animate-float">
                     AI Agent Talking...
                   </div>
                   
                   {/* Ripple effect */}
                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                     <div className="w-16 h-16 border-2 border-white/30 rounded-full animate-ping"></div>
                     <div className="absolute top-0 left-0 w-16 h-16 border-2 border-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                     <div className="absolute top-0 left-0 w-16 h-16 border-2 border-white/10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         );
      
      default:
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            >
              <source src={backgroundConfig.video} type="video/mp4" />
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${FigmaAssets.heroBackground})` }}
              />
            </video>
          </div>
        );
    }
  };

  return (
    <FigmaComponent>
      <FigmaSection background="hero" className="relative overflow-hidden min-h-screen pt-16" id="hero">
        {/* Configurable Background */}
        {renderBackground()}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40" />
        

        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-4">
            {/* Left side content */}
            <div className="text-center lg:text-left text-white">
              <h1 className={`${FigmaDesignSystem.typography.h1} mb-6 drop-shadow-xl`}>Build Your AI Listing Agent in 30 Seconds</h1>
              <p className={`${FigmaDesignSystem.typography.bodyLarge} mb-8 opacity-90`}>See the magic first, then decide. Create your AI listing assistant instantly and watch it work.</p>
              <ul className="mb-8 flex flex-col gap-3 items-start text-lg font-medium">
                <li className="flex items-center gap-3"><i className="fas fa-check-circle text-sky-400 text-xl"></i>Build your AI in 30 seconds</li>
                <li className="flex items-center gap-3"><i className="fas fa-check-circle text-sky-400 text-xl"></i>See it chat with prospects</li>
                <li className="flex items-center gap-3"><i className="fas fa-check-circle text-sky-400 text-xl"></i>Experience the magic first-hand</li>
                <li className="flex items-center gap-3"><i className="fas fa-check-circle text-sky-400 text-xl"></i><span className="text-blue-200 font-bold">Then decide if you want the superpowers</span></li>
              </ul>
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto lg:mx-0">
                <FigmaButton size="lg" variant="primary" onClick={() => setShowDemoModal(true)} className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-xl font-semibold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                  <i className="fas fa-magic text-white text-xl"></i> See the demo
                </FigmaButton>
                <FigmaButton size="lg" variant="secondary" onClick={() => navigate('/build-ai-listing')} className="w-full bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-semibold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform hover:scale-105">
                  <i className="fas fa-magic text-white text-xl"></i> Build AI Listing 4 Free
                </FigmaButton>
              </div>
            </div>
            {/* Right side content with the cards */}
            {/* Center all content: remove right-side cards and ensure main content is centered */}
          </div>
        </div>
        <MobileAppDemo
          isOpen={showDemoModal}
          onClose={() => setShowDemoModal(false)}
          isPreview={false}
        />
      </FigmaSection>
    </FigmaComponent>
  );
};



// UNIFIED Features Section - Combines benefits + power features
const UnifiedFeaturesSection: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const benefits = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Generate 3x More Leads",
      description: "AI responds instantly to every buyer inquiry, capturing leads while you sleep",
      gradient: "from-purple-500 to-indigo-400"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Close Deals Faster", 
      description: "Pre-qualified buyers arrive ready to buy, shortening your sales cycle",
      gradient: "from-pink-500 to-yellow-400"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save 20+ Hours Weekly",
      description: "Eliminate repetitive answering of the same buyer questions",
      gradient: "from-blue-400 to-cyan-400"
    }
  ];

  const powerFeatures = [
    {
      title: "AI Brain",
      icon: <Brain className="w-6 h-6" />,
      frontSubtitle: "Pre-Trained + Customizable",
      backContent: {
        title: "Your AI Real Estate Expert",
        description: "Pre-trained on gigabytes of real estate data—top books, blogs, sales training. Upload your market knowledge, company policies, or unique strategies with just a click. No coding needed.",
        benefits: ["Trained on industry's best practices", "Upload custom info in seconds", "Adapts to your market instantly"]
      },
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "Smart Dashboard",
      icon: <BarChart2 className="w-6 h-6" />,
      frontSubtitle: "Analytics That Matter",
      backContent: {
        title: "Your Command Center",
        description: "Real-time analytics help you make data-driven decisions that close more deals faster. Track lead quality, response times, and conversion rates.",
        benefits: ["Real-time lead analytics", "Property performance tracking", "Conversion optimization"]
      },
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "24/7 AI Assistant",
      icon: <Mic className="w-6 h-6" />,
      frontSubtitle: "Always-On Support",
      backContent: {
        title: "Your Tireless Partner",
        description: "While you sleep, our AI works. Answers questions instantly, qualifies prospects, schedules showings, and captures leads around the clock.",
        benefits: ["24/7 instant responses", "Automatic lead qualification", "Showing scheduling"]
      },
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <FigmaComponent>
      <FigmaSection background="gray" id="features">
        {/* Main Benefits */}
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            Turn Every Listing Into an Installable App
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            Stop chasing leads. Start capturing them automatically with AI that works 24/7. 
            Each property becomes its own branded app with built-in messaging - no SMS costs!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <FigmaCard key={index} className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${benefit.gradient} rounded-full flex items-center justify-center text-white shadow-lg`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="mb-4">{benefit.description}</p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <CheckCircle className="w-5 h-5" /> Proven results for 500+ agents
              </div>
            </FigmaCard>
          ))}
        </div>

        {/* Power Features Flip Cards */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-90 rounded-3xl"></div>
          <div className="relative z-10 py-16 px-8">
            <div className="text-center mb-12">
              <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                The Power Features Behind the Results
              </h2>
              <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
                Hover over each card to discover the technology that makes it all possible
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {powerFeatures.map((feature, index) => (
                <div key={index} className="flip-card group h-80">
                  <div className="flip-card-inner relative w-full h-full">
                    {/* Front */}
                    <div className="flip-card-front absolute inset-0 rounded-xl shadow-lg bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
                      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                        <div className={`w-16 h-16 mb-4 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center text-white shadow-lg`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm font-medium">{feature.frontSubtitle}</p>
                        <div className="mt-6 text-xs text-gray-400 flex items-center gap-1">
                          <span>Hover for details</span>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back */}
                    <div className="flip-card-back absolute inset-0 rounded-xl shadow-xl bg-white border-2 border-gray-200">
                      <div className="p-4 h-full flex flex-col">
                        <div className={`w-full h-2 bg-gradient-to-r ${feature.gradient} rounded-full mb-3`}></div>
                        <h3 className="text-lg font-bold mb-2 text-gray-800">{feature.backContent.title}</h3>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed flex-grow">{feature.backContent.description}</p>
                        <div className="space-y-3">
                          {feature.backContent.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-base text-gray-800 font-medium">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Big Attention-Grabbing Button */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 p-1 rounded-2xl shadow-2xl animate-pulse">
            <button 
              onClick={() => navigate('/build-ai-listing')}
              className="w-full bg-white text-gray-900 px-12 py-6 rounded-xl font-bold text-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                                🔥 BUILD AI LISTING 4 FREE! 🔥
            </button>
          </div>
          <p className="text-gray-600 mt-4 text-lg font-medium">
            ⚡ Create your AI listing assistant in 30 seconds. No signup needed!
          </p>
        </div>
        <MobileAppDemo
          isOpen={showDemoModal}
          onClose={() => setShowDemoModal(false)}
          isPreview={false}
        />
      </FigmaSection>
    </FigmaComponent>
  );
};

// From Curious to Customer in 4 Steps Section
const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
        number: "01",
        title: "Try FREE (No Signup!)",
        description: "Click and build your AI listing in 30 seconds. No credit card, no commitment, no BS.",
        icon: <Rocket className="w-8 h-8" />,
        color: "from-green-500 to-emerald-500",
        badge: "FREE"
    },
    {
        number: "02", 
        title: "See the Magic",
        description: "Experience your AI chatting with prospects. Watch it work in real-time on mobile.",
        icon: <Sparkles className="w-8 h-8" />,
        color: "from-blue-500 to-indigo-500",
        badge: "FREE"
    },
    {
        number: "03",
        title: "Get Superpowers Reveal", 
        description: "Discover what you're missing. See advanced features that turn visitors into buyers.",
        icon: <Crown className="w-8 h-8" />,
        color: "from-purple-500 to-pink-500",
        badge: "INSTANT"
    },
    {
        number: "04",
        title: "Upgrade & Get Full Power",
        description: "Unlock lead capture, analytics, custom branding, and 24/7 automated follow-ups.",
        icon: <TrendingUp />,
        color: "from-orange-500 to-red-500",
        badge: "PROFIT"
    }
];

return (
    <FigmaComponent>
        <FigmaSection background="white" className="id-how-it-works" id="how-it-works">
            <div className="text-center mb-20">
                <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                    From Curious to Customer in 4 Steps
                </h2>
                <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600 max-w-3xl mx-auto`}>
                    <span className="text-green-600 font-bold">No signup required!</span> Try the magic first, 
                    see what you're missing, then decide if you want the superpowers.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="relative">
                        <FigmaCard className="p-8 text-center h-full border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                                {step.icon}
                            </div>
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {step.number}
                            </div>
                            {/* Fun badge */}
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                                {step.badge}
                            </div>
                            <h3 className={`${FigmaDesignSystem.typography.h3} mb-1`}>
                                {step.title}
                            </h3>
                            {index === 0 && (
                                <div className="text-sm text-green-600 font-bold mb-3">✨ Takes 30 seconds</div>
                            )}
                            {index === 1 && (
                                <div className="text-sm text-blue-600 font-bold mb-3">🎯 Real-time preview</div>
                            )}
                            {index === 2 && (
                                <div className="text-sm text-purple-600 font-bold mb-3">🤯 The big reveal</div>
                            )}
                            {index === 3 && (
                                <div className="text-sm text-orange-600 font-bold mb-3">💰 Full features unlocked</div>
                            )}
                            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
                                {step.description}
                            </p>
                        </FigmaCard>
                    </div>
                ))}
            </div>
            
            {/* Big CTA after steps */}
            <div className="text-center mt-16">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-2xl mx-auto border border-green-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to Experience the Magic?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        No signup, no credit card, no commitment. Just 30 seconds to see why 500+ agents are obsessed.
                    </p>
                    <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-xl transform hover:scale-105" onClick={() => navigate('/build-ai-listing')}>
                        🎯 Try FREE Now - No Signup Required!
                    </FigmaButton>
                    <p className="text-sm text-gray-500 mt-3">Seriously, it takes 30 seconds and you'll be amazed ✨</p>
                </div>
            </div>
        </FigmaSection>
    </FigmaComponent>
    );
};

// Pricing Section - Moved right after 4 Steps
const PricingSection: React.FC = () => {
    const navigate = useNavigate();
    // For staggered checkmark animation
    const [showChecks, setShowChecks] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setShowChecks(true), 400);
      return () => clearTimeout(timer);
    }, []);
    return (
        <FigmaComponent>
            <FigmaSection background="white" className="id-pricing" id="pricing">
                {/* Urgent Launch Special Banner */}
                <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
                  <div className="rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 text-white text-2xl font-extrabold py-4 px-6 shadow-lg text-center border-4 border-white relative overflow-hidden">
                    {/* Pulse effect */}
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="text-sm font-bold text-yellow-200 mb-1">⚡ LIMITED TIME OFFER ⚡</div>
                      $79 a month <span className="text-3xl">per listing</span>
                      <div className="text-sm font-bold text-yellow-200 mt-1">Pricing Subject to Change Without Notice!</div>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-16">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                        Limited-Time Launch Pricing
                    </h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600 max-w-2xl mx-auto`}>
                        We're scaling fast and this promotional pricing won't last long. <strong className="text-red-600">Rates can increase without notice</strong> as we onboard more features and reach capacity.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full border border-red-200">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">Act now - pricing changes as we scale</span>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <FigmaCard variant="gradient" className="p-8 text-white shadow-2xl">
                        <div className="text-center">
                            {/* Normal price badge - improved */}
                            <div className="flex flex-col items-center mb-4">
                              <span className="bg-white text-pink-600 text-base font-extrabold px-4 py-1 rounded-full border-2 border-pink-400 shadow-md mb-2 animate-pop-in" style={{letterSpacing: '0.03em'}}>
                                <span className="line-through mr-1">$149</span> <span className="text-pink-400 font-bold text-xs align-middle">Normally</span>
                              </span>
                            </div>
                            <p className="text-6xl font-bold mb-2 animate-pop-in">
                                $79
                                <span className="text-2xl font-medium opacity-80">/mo/listing</span>
                            </p>
                            <p className="mb-4 opacity-90">Billed monthly per active listing. Cancel anytime.</p>

                            {/* Feature list updated */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 mt-6 text-left">
                              {[
                                "Full AI Lead System Included",
                                "24/7 Automated Lead Capture",
                                "Instant Buyer Conversations",
                                "Easy AI Upgrades: Just Upload New Info",
                                "Keep Your App Up to Date in Seconds",
                                "Built-in CRM & Follow-up Tools",
                                "Voice Bot & Live Chat",
                                "Neighborhood & School Data",
                                "Property History & Comps",
                                "Custom AI Training—No Coding Needed"
                              ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 animate-fade-in" style={{animationDelay: `${0.2 + i * 0.07}s`, animationFillMode: 'both'}} />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>

                            {/* AI Training & Voice Features */}
                            <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
                              <h4 className="text-lg font-bold text-white mb-4 text-center">🤖 AI Training & Voice Features</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-300">Custom</div>
                                  <div className="text-white/80">AI Personality</div>
                                  <div className="text-xs text-white/60">Train your own voice</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-300">24/7</div>
                                  <div className="text-white/80">Voice AI</div>
                                  <div className="text-xs text-white/60">All from your phone</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-300">Smart</div>
                                  <div className="text-white/80">Lead Capture</div>
                                  <div className="text-xs text-white/60">Auto-qualify buyers</div>
                                </div>
                              </div>
                              <div className="mt-4 text-center text-xs text-white/70">
                                Train your AI with your voice and personality
                              </div>
                            </div>
                        </div>
                        <FigmaButton size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-200 animate-pulse" onClick={() => navigate('/build-ai-listing')}>
                            <Rocket className="w-6 h-6 mr-2" />
                            Lock In This Rate Before It Increases
                        </FigmaButton>
                        <p className="mt-4 text-center text-sm opacity-80">✅ 30-day money-back guarantee</p>
                    </FigmaCard>
                </div>

                {/* Our Promise Statement */}
                <div className="max-w-2xl mx-auto mt-6">
                  <FigmaCard variant="glass" className="p-4 text-center text-white bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700/80 border-0">
                    <div className="text-lg font-bold mb-1 tracking-wide">Our Promise:</div>
                    <div className="text-base md:text-lg font-medium opacity-90">A tool that actually delivers—and a team that's obsessed with your ROI.</div>
                  </FigmaCard>
                </div>
            </FigmaSection>
        </FigmaComponent>
    );
};

// What You Get Section
const WhatYouGetSection: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: "🤖",
      title: "AI Listing Agent",
      description: "Your own AI assistant that answers buyer questions 24/7",
      benefits: ["Instant responses", "Qualifies leads", "Schedules showings"]
    },
    {
      icon: "📊",
      title: "Live Dashboard & Notifications",
      description: "Track leads, appointments, and messaging in real-time with notification center",
      benefits: ["Live lead tracking", "Notification center", "Mobile-first design"]
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Works perfectly on phones, tablets, and computers",
      benefits: ["Responsive design", "Mobile optimized", "Cross-platform"]
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level security to protect your data and clients",
      benefits: ["SSL encryption", "Data backup", "GDPR compliant"]
    },
    {
      icon: "🎯",
      title: "Lead Generation Engine",
      description: "Automatically capture and nurture qualified leads",
      benefits: ["Auto-capture", "Lead scoring", "Follow-up automation"]
    },
    {
      icon: "💬",
      title: "Built-in Messaging System",
      description: "Email, voice messages, and in-app notifications - no external SMS costs",
      benefits: ["No SMS fees", "Real-time messaging", "Direct agent contact"]
    },
    {
      icon: "📱",
      title: "Installable Property Apps",
      description: "Each listing becomes its own app with custom branding and icons",
      benefits: ["Property-specific apps", "Home screen access", "Custom branding"]
    }
  ];

  return (
    <FigmaComponent>
      <FigmaSection background="white" id="what-you-get">
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            What You Get With Home Listing AI
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            Everything you need to dominate your market and close more deals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <FigmaCard key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </FigmaCard>
          ))}
        </div>
        
        {/* Property Apps Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Each Property is an App</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every listing you create becomes its own installable app with custom branding, 
              property photos as icons, and built-in messaging system.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">🏠</div>
              <h4 className="font-semibold text-gray-900 mb-2">Property-Specific Branding</h4>
              <p className="text-gray-600 text-sm">
                Each app gets the property's name, photos as icons, and custom descriptions
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">📲</div>
              <h4 className="font-semibold text-gray-900 mb-2">Home Screen Access</h4>
              <p className="text-gray-600 text-sm">
                Users can install properties to their phone like native apps
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-semibold text-gray-900 mb-2">Built-in Messaging</h4>
              <p className="text-gray-600 text-sm">
                Direct communication with agents through email, voice, and notifications
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
      </FigmaSection>
    </FigmaComponent>
  );
};

// Social Proof - Testimonials Section
const TestimonialsSection: React.FC<{ setShowDemoModal: (open: boolean) => void }> = ({ setShowDemoModal }) => {
  const navigate = useNavigate();
  const testimonials = [
    {
      name: "Sarah Martinez",
      title: "Top Producer, Coldwell Banker",
      location: "Austin, TX",
      image: "https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=SM",
      quote: "Working with this team has been incredible. Their digital marketing strategies and online lead generation services helped me triple my business in just 8 months. They really understand real estate marketing.",
      results: "300% Business Growth"
    },
    {
      name: "Mike Thompson",
      title: "RE/MAX Agent",
      location: "Phoenix, AZ", 
      image: "https://via.placeholder.com/150x150/DC2626/FFFFFF?text=MT",
      quote: "The team's expertise in online marketing and lead nurturing is unmatched. Their systematic approach to digital presence helped me become a top producer in my office. Highly recommend their services.",
      results: "Top Producer Status"
    },
    {
      name: "Jennifer Chen",
      title: "Keller Williams Team Lead",
      location: "Seattle, WA",
      image: "https://via.placeholder.com/150x150/059669/FFFFFF?text=JC",
      quote: "Their consulting on digital transformation was game-changing. They helped our entire team modernize our approach to client engagement and online marketing. The ROI has been outstanding.",
      results: "Team Transformation"
    }
  ];

  return (
    <FigmaComponent>
      <FigmaSection background="white">
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            Trusted by Real Estate Professionals
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            See how our agency services have helped agents succeed with digital marketing
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FigmaCard key={index} className="p-8 text-center">
              <div className="mb-6">

                <div className="text-2xl font-bold text-green-600 mb-2">{testimonial.results}</div>
              </div>
              <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.title}</div>
                <div className="text-sm text-gray-500">{testimonial.location}</div>
              </div>
            </FigmaCard>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6">From the team behind successful real estate digital marketing</p>
          <div className="flex justify-center items-center gap-8 opacity-60 mb-12">
            {/* <div className="text-sm font-semibold text-gray-600">🚀 Launching Soon</div> */}
            <div className="text-sm font-semibold text-gray-600">🔒 Enterprise Security</div>
            <div className="text-sm font-semibold text-gray-600">💡 AI Innovation</div>
          </div>

          {/* Strategic CTA after social proof */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Join These Successful Agents?</h3>
            <p className="text-blue-100 mb-6">Start generating more qualified leads in the next 10 minutes</p>
            <div className="flex justify-center">
                              <FigmaButton size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => navigate('/build-ai-listing')}>
                <Rocket className="w-5 h-5 mr-2" />
                Start in Minutes
              </FigmaButton>
            </div>
            <p className="text-xs text-blue-200 mt-4">✅ 30-day money-back guarantee • No setup fees</p>
          </div>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

// Comparison Table vs Competitors
const ComparisonSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <FigmaComponent>
      <FigmaSection background="gray" id="why-choose">
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            Why Choose Home Listing AI?
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            See how we compare to other solutions you might be considering
          </p>
        </div>

        {/* Hide table on mobile, show on md+ */}
        <div className="hidden md:block">
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="p-6 text-left font-semibold">Features</th>
                <th className="p-6 text-center font-semibold bg-yellow-400 text-gray-900">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">Home Listing AI</span>
                    <span className="text-sm">(You)</span>
                  </div>
                </th>
                <th className="p-6 text-center font-semibold">Zillow Premier Agent</th>
                <th className="p-6 text-center font-semibold">Generic Chatbots</th>
                <th className="p-6 text-center font-semibold">Other Real Estate AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  feature: "Pre-trained on Real Estate Data",
                  homeListingAI: "✅",
                  zillowPremierAgent: "❌",
                  genericChatbots: "❌", 
                  otherRealEstateAI: "⚠️ Limited"
                },
                {
                  feature: "24/7 Lead Capture & Qualification", 
                  homeListingAI: "✅",
                  zillowPremierAgent: "⚠️ Basic",
                  genericChatbots: "⚠️ Basic",
                  otherRealEstateAI: "⚠️ Basic"
                },
                {
                  feature: "Custom Knowledge Upload",
                  homeListingAI: "✅ One-click",
                  zillowPremierAgent: "❌",
                  genericChatbots: "❌",
                  otherRealEstateAI: "⚠️ Complex Setup"
                },
                {
                  feature: "Real-time Analytics Dashboard",
                  homeListingAI: "✅",
                  zillowPremierAgent: "⚠️ Limited",
                  genericChatbots: "❌",
                  otherRealEstateAI: "⚠️ Limited"
                },
                {
                  feature: "Automated Follow-up Sequences",
                  homeListingAI: "✅",
                  zillowPremierAgent: "❌",
                  genericChatbots: "❌",
                  otherRealEstateAI: "❌"
                },
                {
                  feature: "Pricing per Listing",
                  homeListingAI: "$79/mo",
                  zillowPremierAgent: "$300-1000+/mo",
                  genericChatbots: "$200+/mo",
                  otherRealEstateAI: "$500+/mo"
                },
                {
                  feature: "Setup Time",
                  homeListingAI: "< 10 minutes",
                  zillowPremierAgent: "Days + Training",
                  genericChatbots: "Days + Developer",
                  otherRealEstateAI: "Weeks + Training"
                }
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                  <td className="p-6 text-center bg-yellow-50 font-semibold text-green-700">{row.homeListingAI}</td>
                  <td className="p-6 text-center text-gray-600">{row.zillowPremierAgent}</td>
                  <td className="p-6 text-center text-gray-600">{row.genericChatbots}</td>
                  <td className="p-6 text-center text-gray-600">{row.otherRealEstateAI}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Mobile-only: Card for each feature, HomeListingAI highlighted */}
        <div className="block md:hidden max-w-xl mx-auto space-y-6">
          {[
            {
              feature: "Pre-trained on Real Estate Data",
              homeListingAI: "✅",
              zillowPremierAgent: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "⚠️ Limited"
            },
            {
              feature: "24/7 Lead Capture & Qualification",
              homeListingAI: "✅",
              zillowPremierAgent: "⚠️ Basic",
              genericChatbots: "⚠️ Basic",
              otherRealEstateAI: "⚠️ Basic"
            },
            {
              feature: "Custom Knowledge Upload",
              homeListingAI: "✅ One-click",
              zillowPremierAgent: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "⚠️ Complex Setup"
            },
            {
              feature: "Real-time Analytics Dashboard",
              homeListingAI: "✅",
              zillowPremierAgent: "⚠️ Limited",
              genericChatbots: "❌",
              otherRealEstateAI: "⚠️ Limited"
            },
            {
              feature: "Automated Follow-up Sequences",
              homeListingAI: "✅",
              zillowPremierAgent: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "❌"
            },
            {
              feature: "Pricing per Listing",
              homeListingAI: "$79/mo",
              zillowPremierAgent: "$300-1000+/mo",
              genericChatbots: "$200+/mo",
              otherRealEstateAI: "$500+/mo"
            },
            {
              feature: "Setup Time",
              homeListingAI: "< 10 minutes",
              zillowPremierAgent: "Days + Training",
              genericChatbots: "Days + Developer",
              otherRealEstateAI: "Weeks + Training"
            }
          ].map((row, index) => (
            <div key={index} className="rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-blue-100 p-5 flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                <span className="font-semibold text-gray-900 text-base">{row.feature}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col items-center p-2 rounded-xl bg-gradient-to-r from-yellow-200 to-yellow-50 border-2 border-yellow-400 shadow-md">
                  <span className="font-bold text-green-700 text-lg flex items-center gap-1">
                    {row.homeListingAI.includes('✅') && <span>✅</span>}
                    {row.homeListingAI.replace('✅', '').trim()}
                  </span>
                  <span className="text-xs text-gray-700 font-semibold mt-1">HomeListingAI</span>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold shadow-sm">Winner</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-600">Zillow Premier Agent:</span>
                    <span>{row.zillowPremierAgent}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-600">Generic:</span>
                    <span>{row.genericChatbots}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-600">Other AI:</span>
                    <span>{row.otherRealEstateAI}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
                          <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-green-500 to-blue-600" onClick={() => navigate('/build-ai-listing')}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Start With Home Listing AI Today
          </FigmaButton>
          <p className="mt-4 text-gray-600">No setup fees • No contracts • 30-day guarantee</p>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};







// New ROI Section
const ROISection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <FigmaComponent>
      <FigmaSection background="gradient" className="relative overflow-hidden bg-gradient-to-br from-[#1a237e] via-[#6a1b9a] to-[#d500f9]" id="guarantee">
        <div className="text-center max-w-3xl mx-auto py-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Built to Help You Close More Deals.
          </h2>
          <h3 className="text-2xl text-purple-100 font-semibold mb-6">
            Simple tools. Real support. Designed for real estate pros.
          </h3>
          <div className="text-lg sm:text-xl text-gray-100 mb-8 leading-relaxed font-medium">
            <p>We focus on one thing: helping agents like you connect with more buyers and sellers.</p>
            <p className="mt-2">No fluff. Just features that save time and help you win more clients.</p>
            <p className="mt-2">Let's make your next deal easier.</p>
          </div>
          <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 text-xl font-bold px-10 py-5" onClick={() => navigate('/build-ai-listing')}>
            🚀 Get started—it's built for agents like you
          </FigmaButton>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};



// Add White Label & Services Section after PricingSection
const ServicesSection: React.FC<{ onConsultation?: () => void }> = ({ onConsultation }) => (
  <FigmaComponent>
    <FigmaSection background="gray" className="py-16" id="white-label">
      <div className="max-w-6xl mx-auto">
        <FigmaCard variant="glass" className="p-10 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            White Label & Custom Services
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Want your own brand? We offer full white labeling, custom web design, design systems, automation, and digital marketing for real estate pros, teams, and brokerages. Get a seamless, premium experience—your brand, your way.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <img src="/new hlailogo.png" alt="HomeListingAI" className="w-12 h-12 mb-2" />
              <div className="font-semibold text-gray-800 mb-1">White Label Solutions</div>
              <div className="text-gray-600 text-sm">Your logo, your domain, your colors—powered by our AI. Launch a fully branded platform for your team or brokerage, with all the features of HomeListingAI under your own identity.</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">💻</span>
              <div className="font-semibold text-gray-800 mb-1">Web & System Design</div>
              <div className="text-gray-600 text-sm">Modern, responsive websites and design systems tailored for real estate. We build beautiful, high-converting sites and robust design systems that scale with your business.</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">⚡</span>
              <div className="font-semibold text-gray-800 mb-1">Automation & AI</div>
              <div className="text-gray-600 text-sm">Streamline your workflow with custom automations, AI chat, lead routing, and integrations. Free up your team to focus on what matters most—closing deals.</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">📈</span>
              <div className="font-semibold text-gray-800 mb-1">Digital Marketing</div>
              <div className="text-gray-600 text-sm">Lead generation, SEO, paid ads, and digital campaigns that get results. We help you attract, nurture, and convert more clients with proven digital strategies.</div>
            </div>
          </div>
          <div className="mt-8">
            <button
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-700 transition-all text-lg"
              onClick={onConsultation || (() => window.dispatchEvent(new CustomEvent('open-consultation-modal')))}
            >
              📅 Set Up a Free Consultation
            </button>
            <div className="text-sm text-gray-500 mt-2">No obligation. See how we can help your business grow.</div>
          </div>
        </FigmaCard>
      </div>
    </FigmaSection>
  </FigmaComponent>
);


// Company About Us Section
const CompanyAboutUsSection: React.FC = () => {
    const values = [
        {
            icon: <Heart />,
            title: "Our Mission",
            description: "We believe every real estate agent deserves technology that actually works for them. Our mission is to eliminate the complexity of lead generation and put powerful AI tools in the hands of every agent, regardless of their tech background."
        },
        {
            icon: <Users />,
            title: "Our Story",
            description: "Founded by real estate professionals who got tired of overpromising tech solutions, we built HomeListingAI from the ground up to solve real problems. Every feature comes from actual agent feedback and real-world testing."
        },
        {
            icon: <Award />,
            title: "Our Values",
            description: "Transparency, results, and genuine partnership with our clients. We don't just sell software - we provide ongoing support, training, and a commitment to your success. Your ROI is our success metric."
        }
    ];

    return (
        <FigmaComponent>
            <div className="relative py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden" id="company-about">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`${FigmaDesignSystem.typography.h2} mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>About Us</h2>
                        <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-700 max-w-3xl mx-auto`}>
                            Built by real estate professionals, for real estate professionals. We understand your challenges because we've lived them.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => {
                            const gradients = [
                                'from-rose-500 to-pink-500',
                                'from-blue-500 to-indigo-500', 
                                'from-purple-500 to-violet-500'
                            ];
                            const backgrounds = [
                                'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200',
                                'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
                                'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
                            ];
                            return (
                                <div key={value.title} className={`p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 rounded-2xl border-2 ${backgrounds[index]}`}>
                                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${gradients[index]} rounded-full flex items-center justify-center text-white shadow-lg`}>
                                        {React.cloneElement(value.icon, { className: 'w-8 h-8' })}
                                    </div>
                                    <h3 className={`${FigmaDesignSystem.typography.h3} mb-4 text-gray-800`}>{value.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Company Stats */}
                    <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">10 Min</div>
                            <div className="text-gray-600">Setup Time</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">24/7</div>
                            <div className="text-gray-600">AI Availability</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">30-Day</div>
                            <div className="text-gray-600">Money-Back Guarantee</div>
                        </div>
                    </div>
                </div>
            </div>
        </FigmaComponent>
    );
};

// New FAQ Section
const FAQSection: React.FC = () => {
    const faqs = [
        {
            question: "How does the AI property assistant work?",
            answer: "Our AI is trained on real estate data and your specific listing details. It can answer questions about amenities, features, pricing, HOAs, schools, and more, 24/7."
        },
        {
            question: "How quickly can I get started?",
            answer: "In under 10 minutes. Upload your listing, our AI learns instantly, and you get a smart link to share across all your marketing channels."
        },
        {
            question: "How is pricing structured?",
            answer: "You pay just $79 per listing. No setup fees, no hidden costs. Only pay for the listings you want AI on."
        },
        {
            question: "Why is the pricing so affordable right now?",
            answer: "We're in our rapid growth phase and offering this limited-time pricing to build our community. This promotional rate won't last long - pricing can change without notice as we scale."
        },
        {
            question: "When will pricing increase?",
            answer: "We don't announce price increases in advance. As we add more features, reach capacity limits, or hit growth milestones, rates will adjust upward without warning. The best time to start is now at this introductory rate."
        },
        {
            question: "What if the AI gives wrong information?",
            answer: "You have full control to review and customize AI responses. The system learns from corrections and directs complex questions to you."
        },
        {
            question: "How do I know if leads are qualified?",
            answer: "Our AI asks intelligent questions about budget, timeline, and needs, then scores each lead and sends you detailed summaries of hot prospects."
        },
        {
            question: "Can I integrate this with my existing CRM or website?",
            answer: "Yes, we offer API access and can embed the AI chat on your existing website. We help with setup for a seamless workflow."
        },
        {
            question: "What makes this different from other lead tools?",
            answer: "Unlike generic chatbots, every property gets its own specialized AI that knows specific details, creating engaging conversations that build trust."
        },
        {
            question: "Is there really a 30-day money-back guarantee?",
            answer: "Absolutely. We're so confident this will transform your business that we offer a full 30-day money-back guarantee, no questions asked."
        },
        {
            question: "Do you offer enterprise or white-label solutions?",
            answer: "Yes. We work with large brokerages and teams to provide custom solutions, including white-labeling, custom integrations, and dedicated support."
        }
    ];

    return (
        <FigmaComponent>
            <FigmaSection background="white">
                <div className="text-center mb-16">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>Frequently Asked Questions</h2>
                     <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600 max-w-3xl mx-auto`}>
                        Your top questions answered. Everything you need to know to get started.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FigmaCard key={index} className="p-0 overflow-hidden" variant='glass'>
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer p-6 list-none">
                                    <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-open:bg-gradient-to-r group-open:from-blue-600 group-open:to-sky-400 group-open:bg-clip-text group-open:text-transparent">
                                        {faq.question}
                                    </h3>
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 group-open:bg-blue-100 flex items-center justify-center">
                                        <ChevronDown className="w-5 h-5 text-gray-500 group-open:text-blue-600 group-open:rotate-180 transition-transform duration-300" />
                                    </div>
                                </summary>
                                <div className="px-6 pb-6 border-t border-gray-200/50">
                                    <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                                </div>
                            </details>
                        </FigmaCard>
                    ))}
                </div>
            </FigmaSection>
        </FigmaComponent>
    );
};

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 relative z-20" id="contact">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
        <div className="mb-8 md:mb-0 flex-1 min-w-[200px]">
          <div className="flex items-center mb-4">
            <img src="/new hlailogo.png" alt="HomeListingAI Logo" className="h-8 mr-2" />
            <span className="font-bold text-lg tracking-tight">AI</span>
          </div>
          <p className="text-gray-400 mb-4 text-sm max-w-xs">Transform your real estate business with AI-powered listings and automated lead generation.</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-green-400 text-green-400 bg-gray-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
            30-Day Money-Back Guarantee
          </div>
        </div>
        <div className="flex flex-1 justify-between gap-12">
          <div>
            <h4 className="font-semibold mb-3 text-gray-100">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#what-you-get" className="hover:text-blue-400">Features</a></li>
              <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400">How It Works</a></li>
              <li><a href="#guarantee" className="hover:text-blue-400">Guarantee</a></li>
            </ul>
          </div>
          <div>
                          <h4 className="font-semibold mb-3 text-gray-100">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/terms" className="hover:text-blue-400">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="/compliance" className="hover:text-blue-400">Compliance Policy</a></li>
                <li><a href="/dmca" className="hover:text-blue-400">DMCA Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-100">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about-us" className="hover:text-blue-400">About Us</a></li>
              </ul>
            </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-100">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@homelistingai.com" className="hover:text-blue-400">support@homelistingai.com</a></li>
              <li><span className="text-gray-400">Seattle, WA</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        © 2024 HomeListingAI. All rights reserved.
      </div>
    </div>
  </footer>
);

const ParallaxBackground: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const images = [
        { src: '/circuit-brain.png', top: '5%', right: '5%', width: '20vw', speed: 0.1 },
        { src: '/circuit-lines.png', top: '15%', left: '2%', width: '15vw', speed: 0.3 },
        { src: '/circuit-brain.png', top: '50%', left: '10%', width: '25vw', speed: 0.45 },
        { src: '/circuit-lines.png', top: '70%', right: '-5%', width: '20vw', speed: 0.2, transform: 'rotate(180deg)' },
        { src: '/circuit-brain.png', top: '90%', right: '15%', width: '15vw', speed: 0.4 },
        { src: '/circuit-lines.png', top: '120%', left: '5%', width: '18vw', speed: 0.35 },
        { src: '/circuit-brain.png', top: '150%', right: '10%', width: '22vw', speed: 0.25 },
        { src: '/circuit-lines.png', top: '180%', left: '-2%', width: '15vw', speed: 0.5 },
    ];

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img.src}
                    alt=""
                    className="absolute"
                    style={{
                        top: img.top,
                        left: img.left,
                        right: img.right,
                        width: img.width,
                        opacity: 0.10,
                        filter: 'grayscale(1) brightness(1.2)',
                        border: '1px solid red',
                        transform: `translateY(${scrollY * img.speed}px) ${img.transform || ''}`,
                        transition: 'transform 0.2s ease-out',
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
            ))}
        </div>
    );
};

// This is your new main sales page, completely rebuilt with your Figma design!
const NewSalesPage: React.FC = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState<'default' | 'white-label'>('default');
    const [showDemoModal, setShowDemoModal] = useState(false);

    // Helper to open modal with context
    const openConsultation = (context: 'default' | 'white-label' = 'default') => {
      setModalContext(context);
      setModalOpen(true);
    };

    // Listen for custom event from Navbar
    useEffect(() => {
      const handler = (e: any) => {
        openConsultation(e.detail?.context || 'default');
      };
      window.addEventListener('open-consultation-modal', handler);
      return () => window.removeEventListener('open-consultation-modal', handler);
    }, []);

    return (
        <div className="relative bg-gray-50 overflow-x-clip">
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
            <ParallaxBackground />
            
            {/* Animated Dots - DISABLED to remove top gap */}
            <AnimatedDots enabled={false} count={12} size="md" animationSpeed="normal" />

            <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} context={modalContext} />

            <div className="relative z-10">
                <Navbar />
                <YourFigmaHero />
                <HowItWorksSection />
                <PricingSection />
                <UnifiedFeaturesSection />
                <WhatYouGetSection />
                <TestimonialsSection setShowDemoModal={setShowDemoModal} />
                <ServicesSection />
                <ComparisonSection />
                <ROISection />
                <CompanyAboutUsSection />
                <FAQSection />
                
                {/* Final CTA Section */}
                <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      Don't Let Another Lead Slip Away
                    </h2>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                      While you're thinking about it, your competitors are capturing leads 24/7. 
                      Start your HomeListingAI journey today and see results within hours.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                      <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-xl px-8 py-4" onClick={() => navigate('/build-ai-listing')}>
                        <Zap className="w-6 h-6 mr-2" />
                        Start Generating Leads Now
                      </FigmaButton>
                      <button
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition text-lg shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/demo')}
                      >
                        <Mic className="w-5 h-5 mr-2 inline" />
                        Try the Demo App! 🔥
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>Setup in under 10 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>Cancel anytime</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Footer />
            </div>
            <VoiceBot />
        </div>
    );
};

export default NewSalesPage;