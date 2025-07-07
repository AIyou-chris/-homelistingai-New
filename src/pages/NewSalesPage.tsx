import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, TrendingUp, Award, Shield, CheckCircle, Rocket, Layers, Code, Users, Mic, Map, Upload, Brain, Share2, Zap, Clock, Mail, SlidersHorizontal, Heart, Lightbulb, Users2, ChevronDown, Home, Sparkles, BarChart2, MessageSquare, Target, Crown } from 'lucide-react';
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
  return (
    <FigmaComponent>
      <FigmaSection background="hero" className="relative overflow-hidden min-h-screen pt-16" id="hero">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${FigmaAssets.heroBackground})` }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-4">
            {/* Left side content */}
            <div className="text-center lg:text-left text-white">
              <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg animate-pulse">
                ✨ TRY FREE RIGHT NOW! ✨
              </span>
              <h1 className={`${FigmaDesignSystem.typography.h1} mb-6`}>
                Build Your AI Agent in 30 Seconds
              </h1>
              
              <p className={`${FigmaDesignSystem.typography.bodyLarge} mb-6 opacity-90`}>
                <span className="text-yellow-300 font-bold">No signup required!</span> See the magic first, then decide. 
                Create your AI listing assistant instantly and watch it work.
              </p>
              
              <div className="mb-8 bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-lg font-bold text-green-300 mb-2">
                  🚀 INSTANT DEMO - NO COMMITMENT
                </div>
                <div className="text-white/90 text-lg">
                  ✅ Build your AI in 30 seconds<br/>
                  ✅ See it chat with prospects<br/>
                  ✅ Experience the magic first-hand<br/>
                  <span className="text-yellow-300 font-bold">✅ Then decide if you want the superpowers!</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <FigmaButton size="lg" variant="primary" onClick={() => navigate('/anonymous-builder')} className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  🎯 Try FREE Now - No Signup!
                </FigmaButton>
                <FigmaButton size="lg" variant="secondary" onClick={() => navigate('/demo')} className="bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30">
                  👀 See Live Demo
                </FigmaButton>
              </div>
              
              {/* Trust indicators */}
              <div className="flex justify-center lg:justify-start mt-6 space-x-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-medium">No signup required</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 font-medium">Takes 30 seconds</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-300 font-medium">See magic first</span>
                </div>
              </div>
              
              <p className="mt-4 text-sm opacity-80 text-center lg:text-left">
                <span className="text-yellow-300">🔥 Try the magic → See what you're missing → Then upgrade for superpowers!</span>
              </p>
            </div>

            {/* Right side content with the cards */}
            {/* Center all content: remove right-side cards and ensure main content is centered */}
          </div>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};



// UNIFIED Features Section - Combines benefits + power features
const UnifiedFeaturesSection: React.FC = () => {
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
      icon: <MessageSquare className="w-6 h-6" />,
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
            Turn Every Listing Into a Lead Magnet
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            Stop chasing leads. Start capturing them automatically with AI that works 24/7.
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
                        <div className="space-y-1">
                          {feature.backContent.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-700">{benefit}</span>
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
      </FigmaSection>
    </FigmaComponent>
  );
};

// Social Proof - Testimonials Section
const TestimonialsSection: React.FC = () => {
  const navigate = useNavigate();
  const testimonials = [
    {
      name: "Sarah Martinez",
      title: "Top Producer, Coldwell Banker",
      location: "Austin, TX",
      image: "/sarah-martinez.png",
      quote: "Working with this team has been incredible. Their digital marketing strategies and online lead generation services helped me triple my business in just 8 months. They really understand real estate marketing.",
      results: "300% Business Growth"
    },
    {
      name: "Mike Thompson",
      title: "RE/MAX Agent",
      location: "Phoenix, AZ", 
      image: "/mike-thompson.png",
      quote: "The team's expertise in online marketing and lead nurturing is unmatched. Their systematic approach to digital presence helped me become a top producer in my office. Highly recommend their services.",
      results: "Top Producer Status"
    },
    {
      name: "Jennifer Chen",
      title: "Keller Williams Team Lead",
      location: "Seattle, WA",
      image: "/jennifer-chen.png",
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
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                />
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
            <div className="text-sm font-semibold text-gray-600">🚀 Launching Soon</div>
            <div className="text-sm font-semibold text-gray-600">🔒 Enterprise Security</div>
            <div className="text-sm font-semibold text-gray-600">💡 AI Innovation</div>
          </div>

          {/* Strategic CTA after social proof */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Join These Successful Agents?</h3>
            <p className="text-blue-100 mb-6">Start generating more qualified leads in the next 10 minutes</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FigmaButton size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => navigate('/anonymous-builder')}>
                <Rocket className="w-5 h-5 mr-2" />
                Start in Minutes
              </FigmaButton>
              <FigmaButton size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/demo')}>
                <MessageSquare className="w-5 h-5 mr-2" />
                See Live Demo
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
      <FigmaSection background="gray">
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            Why Choose HomeListingAI?
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
                      <span className="text-lg font-bold">HomeListingAI</span>
                      <span className="text-sm">(You)</span>
                    </div>
                  </th>
                  <th className="p-6 text-center font-semibold">ChatGPT</th>
                  <th className="p-6 text-center font-semibold">Generic Chatbots</th>
                  <th className="p-6 text-center font-semibold">Other Real Estate AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    feature: "Pre-trained on Real Estate Data",
                    homeListingAI: "✅",
                    chatGPT: "❌",
                    genericChatbots: "❌", 
                    otherRealEstateAI: "⚠️ Limited"
                  },
                  {
                    feature: "24/7 Lead Capture & Qualification", 
                    homeListingAI: "✅",
                    chatGPT: "❌",
                    genericChatbots: "⚠️ Basic",
                    otherRealEstateAI: "⚠️ Basic"
                  },
                  {
                    feature: "Custom Knowledge Upload",
                    homeListingAI: "✅ One-click",
                    chatGPT: "❌",
                    genericChatbots: "❌",
                    otherRealEstateAI: "⚠️ Complex Setup"
                  },
                  {
                    feature: "Real-time Analytics Dashboard",
                    homeListingAI: "✅",
                    chatGPT: "❌",
                    genericChatbots: "❌",
                    otherRealEstateAI: "⚠️ Limited"
                  },
                  {
                    feature: "Automated Follow-up Sequences",
                    homeListingAI: "✅",
                    chatGPT: "❌",
                    genericChatbots: "❌",
                    otherRealEstateAI: "❌"
                  },
                  {
                    feature: "Pricing per Listing",
                    homeListingAI: "$59/mo",
                    chatGPT: "$20/mo + Setup",
                    genericChatbots: "$200+/mo",
                    otherRealEstateAI: "$500+/mo"
                  },
                  {
                    feature: "Setup Time",
                    homeListingAI: "< 10 minutes",
                    chatGPT: "Hours + Technical Skills",
                    genericChatbots: "Days + Developer",
                    otherRealEstateAI: "Weeks + Training"
                  }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="p-6 text-center bg-yellow-50 font-semibold text-green-700">{row.homeListingAI}</td>
                    <td className="p-6 text-center text-gray-600">{row.chatGPT}</td>
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
              chatGPT: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "⚠️ Limited"
            },
            {
              feature: "24/7 Lead Capture & Qualification",
              homeListingAI: "✅",
              chatGPT: "❌",
              genericChatbots: "⚠️ Basic",
              otherRealEstateAI: "⚠️ Basic"
            },
            {
              feature: "Custom Knowledge Upload",
              homeListingAI: "✅ One-click",
              chatGPT: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "⚠️ Complex Setup"
            },
            {
              feature: "Real-time Analytics Dashboard",
              homeListingAI: "✅",
              chatGPT: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "⚠️ Limited"
            },
            {
              feature: "Automated Follow-up Sequences",
              homeListingAI: "✅",
              chatGPT: "❌",
              genericChatbots: "❌",
              otherRealEstateAI: "❌"
            },
            {
              feature: "Pricing per Listing",
              homeListingAI: "$59/mo",
              chatGPT: "$20/mo + Setup",
              genericChatbots: "$200+/mo",
              otherRealEstateAI: "$500+/mo"
            },
            {
              feature: "Setup Time",
              homeListingAI: "< 10 minutes",
              chatGPT: "Hours + Technical Skills",
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
                    <span className="font-bold text-gray-600">ChatGPT:</span>
                    <span>{row.chatGPT}</span>
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
          <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-green-500 to-blue-600" onClick={() => navigate('/anonymous-builder')}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Start With HomeListingAI Today
          </FigmaButton>
          <p className="mt-4 text-gray-600">No setup fees • No contracts • 30-day guarantee</p>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};



// This is the "How It Works" section - updated for the new anonymous flow
const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: "01",
            title: "Try FREE (No Signup!)",
            description: "Click and build your AI agent in 30 seconds. No credit card, no commitment, no BS.",
            icon: <Rocket />,
            color: "from-green-500 to-emerald-600",
            badge: "FREE"
        },
        {
            number: "02",
            title: "See the Magic",
            description: "Experience your AI chatting with prospects. Watch it work in real-time on mobile.",
            icon: <Sparkles />,
            color: "from-blue-500 to-cyan-500",
            badge: "INSTANT"
        },
        {
            number: "03",
            title: "Get Superpowers Reveal", 
            description: "Discover what you're missing. See advanced features that turn visitors into buyers.",
            icon: <Crown />,
            color: "from-purple-500 to-pink-500",
            badge: "MIND-BLOWN"
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
                        <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-xl transform hover:scale-105" onClick={() => window.location.href = '#hero'}>
                            🎯 Try FREE Now - No Signup Required!
                        </FigmaButton>
                        <p className="text-sm text-gray-500 mt-3">Seriously, it takes 30 seconds and you'll be amazed ✨</p>
                    </div>
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
          <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 text-xl font-bold px-10 py-5" onClick={() => navigate('/anonymous-builder')}>
            🚀 Get started—it's built for agents like you
          </FigmaButton>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

// This is your new Pricing section
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
                      $59 a month <span className="text-3xl">per listing</span>
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
                                <span className="line-through mr-1">$99</span> <span className="text-pink-400 font-bold text-xs align-middle">Normally</span>
                              </span>
                            </div>
                            <p className="text-6xl font-bold mb-2 animate-pop-in">
                                $59
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
                        </div>
                        <FigmaButton size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-200 animate-pulse" onClick={() => navigate('/anonymous-builder')}>
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
            answer: "You pay just $59 per listing. No setup fees, no hidden costs. Only pay for the listings you want AI on."
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
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#how" className="hover:text-blue-400">How It Works</a></li>
              <li><a href="#guarantee" className="hover:text-blue-400">Guarantee</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-100">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">About Us</a></li>
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

            <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} context={modalContext} />

            <div className="relative z-10">
                <Navbar />
                <YourFigmaHero />
                <UnifiedFeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <PricingSection />
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
                      <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-xl px-8 py-4" onClick={() => navigate('/anonymous-builder')}>
                        <Zap className="w-6 h-6 mr-2" />
                        Start Generating Leads Now
                      </FigmaButton>
                      <button
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition text-lg"
                        onClick={() => openConsultation('default')}
                      >
                        <MessageSquare className="w-5 h-5 mr-2 inline" />
                        Get Personal Demo
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