import React, { useState, useEffect, useRef } from 'react';
import { Bot, TrendingUp, Award, Shield, CheckCircle, Rocket, Layers, Code, Users, Mic, Map, Upload, Brain, Share2, Zap, Clock, Mail, SlidersHorizontal, Heart, Lightbulb, Users2, ChevronDown, Home } from 'lucide-react';
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
  return (
    <FigmaComponent>
      <FigmaSection background="hero" className="relative overflow-hidden min-h-screen pt-16">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${FigmaAssets.heroBackground})` }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-4">
            {/* Left side content */}
            <div className="text-center lg:text-left text-white">
              <span className="inline-block bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">AI-Powered Real Estate Platform</span>
              <h1 className={`${FigmaDesignSystem.typography.h1} mb-6`}>
                Talk to the House
              </h1>
              
              <p className={`${FigmaDesignSystem.typography.bodyLarge} mb-8 opacity-90`}>
                Every listing comes with its own AI assistant. Buyers get instant answers 24/7. Agents get qualified leads on autopilot. $59/month.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <FigmaButton size="lg" variant="primary">
                  Start in minutes
                </FigmaButton>
                <FigmaButton size="lg" variant="secondary">
                  Try Demo Chat
                </FigmaButton>
              </div>
              <p className="mt-4 text-sm opacity-80">✅ 15-day money-back guarantee • No setup fees • Cancel anytime</p>
            </div>

            {/* Right side content with the cards */}
            <div className="space-y-6">
                <LiveResultsCard />
                <ChatPreviewCard />
            </div>
          </div>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

// This is your new Features section
const YourFigmaFeatures: React.FC = () => {
  return (
    <FigmaComponent>
      <FigmaSection background="gray">
        <div className="text-center mb-16">
          <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
            Turn Every Listing Into a Lead Magnet
          </h2>
          <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
            Stop chasing leads. Start capturing them automatically with AI that works 24/7.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FigmaCard className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-lg">
                <Rocket className="w-8 h-8" />
            </div>
            <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
              Generate 3x More Leads
            </h3>
            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
              AI responds instantly to every buyer inquiry, capturing leads while you sleep.
            </p>
          </FigmaCard>
          
          <FigmaCard className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-white shadow-lg">
                <Zap className="w-8 h-8" />
            </div>
            <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
              Close Deals Faster
            </h3>
            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
              Pre-qualified buyers arrive ready to buy, shortening your sales cycle.
            </p>
          </FigmaCard>
          
          <FigmaCard className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Clock className="w-8 h-8" />
            </div>
            <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
              Save 20+ Hours Weekly
            </h3>
            <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
              Automated responses handle repetitive Q&A, freeing you up for what matters.
            </p>
          </FigmaCard>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

// The new "Future Action Benefits" section you requested!
const FutureActionBenefits: React.FC = () => {
    return (
        <FigmaComponent>
            <FigmaSection background="white">
                <div className="text-center mb-16">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                        Unlock Your Future Potential
                    </h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
                        Take action today and secure long-term benefits for your real estate business.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <FigmaCard className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
                            Build a Self-Sustaining Pipeline
                        </h3>
                        <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
                            Our AI works 24/7 to create a continuous flow of qualified leads, so your business grows even when you're not working.
                        </p>
                    </FigmaCard>

                    <FigmaCard className="p-8 text-center">
                         <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
                            Become a Market Authority
                        </h3>
                        <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
                            Provide instant, valuable information on every listing to build trust and establish yourself as the go-to agent in your area.
                        </p>
                    </FigmaCard>
                    
                    <FigmaCard className="p-8 text-center">
                         <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
                            Future-Proof Your Career
                        </h3>
                        <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
                            Embrace the next wave of real estate technology today and stay ahead of the competition for years to come.
                        </p>
                    </FigmaCard>
                </div>
            </FigmaSection>
        </FigmaComponent>
    );
};

// This is the "How It Works" section you requested
const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: "01",
            title: "Upload Your Listing",
            description: "Add photos, details, and key selling points in minutes.",
            icon: <Upload />,
            color: "from-purple-500 to-indigo-600"
        },
        {
            number: "02",
            title: "AI Learns Everything",
            description: "Our AI instantly understands your property's unique features and neighborhood.",
            icon: <Brain />,
            color: "from-pink-500 to-rose-500"
        },
        {
            number: "03",
            title: "Share Your Smart Listing",
            description: "Get a special link with built-in AI chat for all your marketing.",
            icon: <Share2 />,
            color: "from-sky-400 to-cyan-400"
        },
        {
            number: "04",
            title: "Watch Leads Pour In",
            description: "AI qualifies buyers 24/7 and sends you hot leads instantly.",
            icon: <TrendingUp />,
            color: "from-teal-400 to-emerald-500"
        }
    ];

    return (
        <FigmaComponent>
            <FigmaSection background="white" className="id-how-it-works">
                <div className="text-center mb-20">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                        From Setup to Sales in 4 Simple Steps
                    </h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
                        Be generating qualified leads in under 10 minutes.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <FigmaCard className="p-8 text-center h-full">
                                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                                    {step.icon}
                                </div>
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {step.number}
                                </div>
                                <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>
                                    {step.title}
                                </h3>
                                <p className={`${FigmaDesignSystem.typography.body} text-gray-600`}>
                                    {step.description}
                                </p>
                            </FigmaCard>
                        </div>
                    ))}
                </div>
            </FigmaSection>
        </FigmaComponent>
    );
};

// New ROI Section
const ROISection: React.FC = () => {
  return (
    <FigmaComponent>
      <FigmaSection background="gradient" className="relative overflow-hidden bg-gradient-to-br from-[#1a237e] via-[#6a1b9a] to-[#d500f9]">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 flex items-center justify-center gap-3">
            <span role="img" aria-label="explosion">💥</span> 465% ROI From ONE Close? Believe It.
          </h2>

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl animate-pulse bg-gradient-to-br from-pink-500 to-purple-400">
              <SlidersHorizontal className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-lg sm:text-xl text-gray-100 mb-8 leading-relaxed font-medium">
            <p>One deal. One client. One win.<br />
            And boom—465% return on investment.<br />
            That's not a fluke. That's the floor.</p>
            <p className="mt-4">Most tools promise ROI. This one delivers it—again and again.</p>
            <p className="mt-4">Even if you only close one deal a year, you're already up 465%.<br />
            Worst-case scenario? You still win.<br />
            Best-case? You're printing profit on repeat.</p>
          </div>

          <FigmaButton size="lg" variant="primary" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 text-xl font-bold px-10 py-5">
            👉 No guesswork. No gimmicks. Just ROI you can bank on.
          </FigmaButton>
        </div>
      </FigmaSection>
    </FigmaComponent>
  );
};

// This is your new Pricing section
const PricingSection: React.FC = () => {
    return (
        <FigmaComponent>
            <FigmaSection background="white" className="id-pricing">
                {/* Launch Special Banner */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-2xl font-extrabold py-4 px-6 shadow-lg text-center border-4 border-white">
                    Launch Special: <span className="text-3xl">$59</span> Per Listing — <span className="underline">Forever</span>.
                  </div>
                </div>
                <div className="text-center mb-16">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                        Simple, Transparent Pricing
                    </h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>
                        One plan, unlimited potential. Lock in your lifetime rate today.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <FigmaCard variant="gradient" className="p-8 text-white shadow-2xl">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                            <p className="text-xl opacity-90 mb-6">Simple Per-Listing Pricing</p>
                            {/* Normal price badge */}
                            <div className="inline-block mb-2">
                              <span className="bg-gray-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full border border-pink-300 line-through mr-2">$99</span>
                              <span className="text-xs text-gray-300">Normally</span>
                            </div>
                            <p className="text-6xl font-bold mb-2">
                                $59
                                <span className="text-2xl font-medium opacity-80">/listing</span>
                            </p>
                            <p className="mb-8 opacity-90">Billed per active listing. Cancel anytime.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                            {[
                                "AI Assistant for Every Listing",
                                "24/7 Automated Lead Capture",
                                "Instant Buyer Conversations",
                                "Lead Qualification Reports",
                                "Built-in CRM & Follow-up Tools",
                                "Voice Bot & Live Chat",
                                "Neighborhood & School Data",
                                "Property History & Comps",
                                "HOA & Utility Information",
                                "Custom AI Training"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <FigmaButton size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-200">
                            <Rocket className="w-6 h-6 mr-2" />
                            Get Started Now
                        </FigmaButton>
                        <p className="mt-4 text-center text-sm opacity-80">✅ 15-day money-back guarantee</p>
                    </FigmaCard>
                </div>

                {/* Launch Price Info Card */}
                <div className="max-w-2xl mx-auto mt-8">
                  <FigmaCard variant="glass" className="p-6 md:p-8 text-white bg-gradient-to-br from-pink-600 via-purple-700 to-blue-900/90 border-0">
                    <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <span role="img" aria-label="fire">🔥</span> Launch Price: <span className="text-yellow-300">$59/listing</span> — Unlimited Leads.
                    </div>
                    <div className="text-base md:text-lg mb-4 opacity-90">
                      <span className="font-semibold text-yellow-200">And here's the kicker:</span> You're <span className="font-bold text-green-300">grandfathered in</span>.<br />
                      Stay with us, and your price will never go up. Not in 3 months. Not in 3 years.
                    </div>
                    <div className="border-t border-white/20 my-4"></div>
                    <div className="font-semibold mb-3 text-lg">Why this is the smartest move you'll make:</div>
                    <ul className="space-y-3 text-base md:text-lg">
                      <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1" /><span><span className="font-bold text-green-200">Locked-In Forever:</span> $59 is your permanent rate. No surprises. No tier jumps. Just ROI that compounds.</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1" /><span><span className="font-bold text-green-200">Unlimited Leads:</span> No cap. No gimmicks. Post your listing, and let the leads roll in—no pay-per-click, no per-contact fees.</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1" /><span><span className="font-bold text-green-200">Human Eyes on Every Setup:</span> Our team reviews every new listing to make sure everything's perfect. Broken buttons? Off-brand content? We catch it before it costs you leads.</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1" /><span><span className="font-bold text-green-200">Real-Time Fixes:</span> If something's not right, we'll tell you—and fix it fast. No waiting days for support.</span></li>
                      <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1" /><span><span className="font-bold text-green-200">Zero Learning Curve. Max Pipeline Impact:</span> No bloated dashboards. No long tutorials. Just a sleek tool that works instantly—and keeps your pipeline hot.</span></li>
                    </ul>
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

// New White Label Section
const WhiteLabelSection: React.FC = () => {
    const services = [
        {
            title: "Your Brand, Your App",
            description: "Present our AI as a seamless part of your existing brand and technology stack.",
            icon: <Layers />,
            color: "from-blue-500 to-sky-500"
        },
        {
            title: "Full API Access",
            description: "Integrate our AI capabilities directly into your own applications and workflows.",
            icon: <Code />,
            color: "from-slate-600 to-gray-700"
        },
        {
            title: "Team & Brokerage Accounts",
            description: "Manage all your agents and listings from a single, centralized dashboard.",
            icon: <Users />,
            color: "from-emerald-500 to-green-500"
        },
        {
            title: "Dedicated Support",
            description: "Receive priority support and dedicated engineering hours for your custom needs.",
            icon: <Shield />,
            color: "from-red-500 to-orange-500"
        },
        {
            title: "Email Marketing Integration",
            description: "Automatically sync qualified leads with your email platform and trigger smart campaigns.",
            icon: <Mail />,
            color: "from-yellow-500 to-amber-500"
        },
        {
            title: "AI System Integration",
            description: "Embed our AI directly into your existing CRM or internal software.",
            icon: <SlidersHorizontal />,
            color: "from-rose-500 to-fuchsia-500"
        },
        {
            title: "Advanced Analytics",
            description: "Get deep insights into user behavior, lead quality, and agent performance.",
            icon: <TrendingUp />,
            color: "from-purple-500 to-violet-500"
        },
        {
            title: "Custom AI Training",
            description: "We'll train our models on your specific market data and business rules.",
            icon: <Brain />,
            color: "from-cyan-500 to-blue-400"
        }
    ];

    return (
        <FigmaComponent>
            <FigmaSection background="white">
                <div className="text-center mb-16">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>
                        Enterprise & White Label Solutions
                    </h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600 max-w-3xl mx-auto`}>
                        Power your brokerage, team, or platform with our underlying AI technology. We offer custom solutions for businesses ready to scale.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {services.map(service => (
                         <FigmaCard key={service.title} className="p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                                <div className="text-3xl">{service.icon}</div>
                            </div>
                            <h3 className={`${FigmaDesignSystem.typography.h4} mb-2`}>
                                {service.title}
                            </h3>
                            <p className={`${FigmaDesignSystem.typography.bodySmall} text-gray-600`}>
                                {service.description}
                            </p>
                        </FigmaCard>
                     ))}
                </div>
            </FigmaSection>
        </FigmaComponent>
    );
};

// New About Us Section
const AboutUsSection: React.FC = () => {
    const journey = [
        { year: 1997, title: "First Website", description: "Started our digital journey with our first website launch." },
        { year: 2002, title: "Agency Started", description: "Founded our real estate agency and began helping clients." },
        { year: 2007, title: "First Mobile App", description: "Pioneered mobile real estate technology with our first app." },
        { year: 2, title: "100 lb Labradors", description: "Our beloved office companions who keep us grounded." }
    ];

    const differentiators = [
        {
            icon: <Home />,
            title: "Real Estate DNA",
            description: "Built by agents, for agents. Every feature is designed with deep real estate industry knowledge and tested by practicing professionals."
        },
        {
            icon: <Map />,
            title: "Hyper-Local Intelligence",
            description: "Our AI understands neighborhoods, school districts, local amenities, and market trends to provide contextually relevant answers."
        },
        {
            icon: <Brain />,
            title: "Continuous Learning",
            description: "Every conversation makes our AI smarter. We constantly improve based on real buyer interactions and agent feedback."
        }
    ];

    return (
        <FigmaComponent>
            <FigmaSection background="gray">
                {/* Meet the Founder Section */}
                <div className="max-w-5xl mx-auto mb-24">
                    <div className="rounded-2xl" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                        <FigmaCard className="p-8 lg:p-12 relative overflow-hidden bg-transparent border-none shadow-none" variant="default">
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <h3 className="text-3xl font-bold mb-4">Meet Chris Potter</h3>
                                    <p className="text-lg font-medium text-gray-700 mb-6">Founder & CEO, HomeListingAI</p>
                                    <div className="space-y-4 text-gray-800">
                                        <p>"After 15 years in real estate technology and watching countless agents struggle with lead generation, I knew there had to be a better way. I spent countless nights talking to top producers, understanding their pain points."</p>
                                        <p>"The breakthrough came when I realized we weren't just building software—we were creating digital real estate experts. Each AI assistant becomes an extension of the agent, available 24/7 to help buyers while qualifying serious prospects."</p>
                                        <p className="font-semibold">"Technology should amplify human expertise, not replace it. HomeListingAI makes every agent a superhero."</p>
                                    </div>
                                </div>
                                <div className="relative flex justify-center">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-50"></div>
                                    <FigmaImage src={FigmaAssets.headshot} alt="Chris Potter" className="relative w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-white" />
                                </div>
                            </div>
                        </FigmaCard>
                    </div>
                </div>

                {/* Journey in Numbers Section */}
                <div className="text-center mb-24">
                    <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>Our Journey in Numbers</h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600`}>The milestones that shaped our story</p>
                    <div className="grid md:grid-cols-4 gap-8 mt-12">
                        {journey.map((item, index) => {
                            const colors = [
                                'from-blue-500 to-sky-400',
                                'from-purple-500 to-indigo-400',
                                'from-green-500 to-teal-400',
                                'from-pink-500 to-rose-400',
                            ];
                            return (
                                <FigmaCard key={item.title} className="p-6">
                                   <div className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br ${colors[index % colors.length]}`}>
                                        <AnimatedCounter target={item.year} />
                                    </div>
                                    <h4 className="font-semibold mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </FigmaCard>
                            )
                        })}
                    </div>
                </div>

                {/* Why We're Different Section */}
                <div className="text-center">
                     <h2 className={`${FigmaDesignSystem.typography.h2} mb-4`}>Why We're Different</h2>
                    <p className={`${FigmaDesignSystem.typography.bodyLarge} text-gray-600 max-w-3xl mx-auto mb-12`}>
                        While others build generic chatbots, we create specialized AI real estate experts that understand properties, neighborhoods, and buyer psychology.
                    </p>
                     <div className="grid md:grid-cols-3 gap-8">
                        {differentiators.map(item => (
                            <FigmaCard key={item.title} className="p-8 bg-blue-50/50">
                                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                    {React.cloneElement(item.icon, { className: 'w-8 h-8' })}
                                </div>
                                <h3 className={`${FigmaDesignSystem.typography.h3} mb-4`}>{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </FigmaCard>
                        ))}
                    </div>
                </div>
            </FigmaSection>
        </FigmaComponent>
    )
}

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
            question: "Do I really get to keep the $59 price forever?",
            answer: "Yes! As an early adopter, you lock in the $59/listing rate for life, as long as you remain an active subscriber for that listing."
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
            question: "Is there really a 15-day money-back guarantee?",
            answer: "Absolutely. We're so confident this will transform your business that we offer a full 15-day money-back guarantee, no questions asked."
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
  <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 mt-24 relative z-20" id="contact">
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
            15-Day Money-Back Guarantee
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
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img.src}
                    alt=""
                    className="absolute opacity-[0.05]"
                    style={{
                        top: img.top,
                        left: img.left,
                        right: img.right,
                        width: img.width,
                        transform: `translateY(${scrollY * img.speed}px) ${img.transform || ''}`,
                        transition: 'transform 0.2s ease-out',
                    }}
                />
            ))}
        </div>
    );
};

// This is your new main sales page, completely rebuilt with your Figma design!
const NewSalesPage: React.FC = () => {
    return (
        <div className="relative bg-gray-50 overflow-x-clip">
            <ParallaxBackground />

            <div className="relative z-10">
                <Navbar />
                <YourFigmaHero />
                <YourFigmaFeatures />
                <FutureActionBenefits />
                <HowItWorksSection />
                <ROISection />
                <PricingSection />
                <WhiteLabelSection />
                <AboutUsSection />
                <FAQSection />
                <Footer />
            </div>
        </div>
    );
};

export default NewSalesPage;