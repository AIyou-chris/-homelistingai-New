import React, { useState, useEffect, useRef } from 'react';
import { Send, Home, Phone, Mail, MapPin, DollarSign, Bed, Bath, Square, Bot, User, Mic, MicOff, Volume2, VolumeX, Calendar, Heart, Share, ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { propertyAIService, type ChatSession, type ChatMessage } from '../services/propertyAIService';
import { getAIVoiceResponse, transcribeVoice, VOICE_OPTIONS } from '../services/openaiService';
import { Listing, PropertyType, ListingStatus } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';

// Demo property data
const DEMO_PROPERTY: Listing = {
  id: 'demo-luxury-villa',
  agent_id: 'agent-demo',
  title: 'Stunning Modern Villa with Ocean Views',
  description: 'A breathtaking contemporary masterpiece perched on the bluffs of Malibu, this extraordinary 4-bedroom, 5-bathroom villa offers unparalleled luxury living with panoramic Pacific Ocean views. Featuring floor-to-ceiling windows, an infinity pool, chef\'s kitchen, and smart home technology throughout.',
  address: '1247 Pacific Coast Highway, Malibu, CA 90265',
  price: 8950000,
  property_type: PropertyType.SINGLE_FAMILY,
  status: ListingStatus.ACTIVE,
  bedrooms: 4,
  bathrooms: 5,
  square_footage: 5200,
  image_urls: [
    '/slider1.png',
    '/slider2.png', 
    '/slider3.png',
    '/slider4.png',
    '/slider5.png',
    '/slider6.png',
    '/slider7.png'
  ],
  created_at: new Date().toISOString(),
  knowledge_base: `
    Property Features:
    - Infinity pool overlooking the Pacific Ocean
    - Floor-to-ceiling windows throughout
    - Gourmet chef's kitchen with premium appliances
    - Master suite with private balcony and ocean views
    - Home theater with Dolby Atmos surround sound
    - Wine cellar with temperature control
    - Smart home automation (lighting, climate, security)
    - Private beach access
    - 3-car garage with EV charging stations
    - Outdoor kitchen and entertaining areas
    
    Neighborhood:
    - Exclusive Malibu beachfront community
    - 5 minutes to Zuma Beach
    - Top-rated schools nearby
    - Close to upscale shopping and dining
    - Gated community with 24/7 security
    
    Recent Updates:
    - Completely renovated in 2023
    - New smart home system installed
    - Updated kitchen with Italian marble countertops
    - Fresh paint and landscaping
    
    Market Information:
    - Similar properties selling for $9M+
    - Strong appreciation in this area
    - Low inventory, high demand
    - Excellent investment opportunity
  `
};

const MobileDemoApp: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' });
  const [showChat, setShowChat] = useState(false);
  
  // Voice-related state
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Professional Female');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize chat session
  useEffect(() => {
    initializeChat();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-rotate images
  useEffect(() => {
    if (!showChat) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % DEMO_PROPERTY.image_urls.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showChat]);

  const initializeChat = async () => {
    try {
      const session = await propertyAIService.createChatSession(DEMO_PROPERTY.id);
      setChatSession(session);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hi! I'm your AI assistant for this beautiful Malibu villa. I know everything about this property, the neighborhood, pricing, and can help you schedule a viewing. What would you like to know?`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Fallback to demo mode
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hi! I'm your AI assistant for this beautiful Malibu villa. I know everything about this property, the neighborhood, pricing, and can help you schedule a viewing. What would you like to know?`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      let responseMessage: string;
      let leadScore: number | undefined;
      
      if (chatSession) {
        const response = await propertyAIService.sendMessage(chatSession.id, input);
        responseMessage = response.content;
        leadScore = undefined; // propertyAIService handles lead scoring differently
      } else {
        // Fallback demo responses
        const response = await getDemoResponse(input);
        responseMessage = response.message;
        leadScore = response.leadScore;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseMessage,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle voice response if enabled
      if (voiceMode && !isSpeaking) {
        await playVoiceResponse(responseMessage);
      }

      // Check for lead generation trigger
      if (leadScore && leadScore >= 70) {
        setTimeout(() => setShowLeadForm(true), 2000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const getDemoResponse = async (message: string): Promise<{ message: string; leadScore?: number }> => {
    // Simple demo responses based on keywords
    const msg = message.toLowerCase();
    
    if (msg.includes('price') || msg.includes('cost')) {
      return {
        message: "This stunning villa is priced at $8.95 million. Given the premium Malibu location, ocean views, and recent renovations, it's competitively priced. Similar properties in this area have been selling for over $9M. Would you like me to schedule a private showing?",
        leadScore: 60
      };
    }
    
    if (msg.includes('schedule') || msg.includes('viewing') || msg.includes('tour') || msg.includes('see')) {
      return {
        message: "I'd be happy to arrange a private viewing! This property shows beautifully, especially during sunset when you can see the full ocean views. I can connect you with the listing agent right now. May I get your contact information?",
        leadScore: 85
      };
    }
    
    if (msg.includes('features') || msg.includes('amenities')) {
      return {
        message: "This villa has incredible features! The infinity pool seems to blend right into the ocean, there's a state-of-the-art home theater, wine cellar, and the smart home system controls everything from your phone. The master suite has a private balcony with unobstructed ocean views. What specific feature interests you most?",
        leadScore: 40
      };
    }
    
    if (msg.includes('neighborhood') || msg.includes('area') || msg.includes('location')) {
      return {
        message: "The location is absolutely premium - you're in an exclusive gated community with private beach access, just 5 minutes from Zuma Beach. Top-rated schools nearby, and you're close to Malibu's best shopping and dining. It's the perfect blend of privacy and convenience. Are you familiar with the Malibu area?",
        leadScore: 30
      };
    }
    
    return {
      message: "That's a great question! This property truly offers the best of Malibu living. Between the ocean views, luxury amenities, and prime location, it's a rare find. Would you like to know more about any specific aspect - the home's features, the neighborhood, or perhaps schedule a viewing?",
      leadScore: 20
    };
  };

  const playVoiceResponse = async (text: string) => {
    if (!voiceMode || isSpeaking) return;

    try {
      setIsSpeaking(true);
      const voiceOption = VOICE_OPTIONS[selectedVoice as keyof typeof VOICE_OPTIONS];
      const audioBlob = await getAIVoiceResponse(text, voiceOption);
      const audioUrl = audioBlob instanceof Blob ? URL.createObjectURL(audioBlob) : '';
      
      if (audioRef.current) {
        audioRef.current.setAttribute('src', audioUrl);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing voice response:', error);
      setIsSpeaking(false);
    }
  };

  const startVoiceInput = async () => {
    if (isListening || isSpeaking) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        try {
          const transcript = await transcribeVoice(audioBlob);
          setInput(transcript);
          await sendMessage();
        } catch (error) {
          console.error('Transcription error:', error);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      setIsListening(true);
      mediaRecorderRef.current.start();

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (isListening && mediaRecorderRef.current) {
          stopVoiceInput();
        }
      }, 10000);

    } catch (error) {
      console.error('Error starting voice input:', error);
    }
  };

  const stopVoiceInput = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Demo lead capture
      console.log('Demo lead captured:', leadInfo);
      alert(`Demo: Thank you ${leadInfo.name}! We'll contact you shortly at ${leadInfo.email} to schedule your private viewing.`);
      setShowLeadForm(false);
      setLeadInfo({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
  };

  if (showChat) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button 
            onClick={() => setShowChat(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            voiceMode ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Property AI Assistant</h2>
            <p className="text-sm text-gray-600">
              {voiceMode ? '🎤 Voice mode enabled' : 'Ask me anything about this villa!'}
            </p>
          </div>
          
          {/* Voice Toggle */}
          <button
            onClick={() => setVoiceMode(!voiceMode)}
            className={`p-2 rounded-lg transition-all ${
              voiceMode 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {voiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-xs flex gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSpeaking && (
            <div className="flex justify-start">
              <div className="max-w-xs flex gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="bg-purple-100 text-purple-900 border border-purple-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">🎤 Speaking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {voiceMode && (
            <div className="mb-3 text-center">
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                disabled={isSending || isSpeaking}
                className={`px-6 py-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 inline mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 inline mr-2" />
                    Press to Speak
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={voiceMode ? "Voice transcription will appear here..." : "Ask about the property..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isSending || isListening}
            />
            
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={isSending || isSpeaking}
              className={`px-3 py-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending || isListening}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} style={{ display: 'none' }} />

        {/* Lead Capture Modal */}
        {showLeadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interested in a Private Viewing?</h3>
                <p className="text-gray-600">Let's schedule your personal tour of this stunning villa!</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your full name"
                  value={leadInfo.name}
                  onChange={(e) => setLeadInfo({...leadInfo, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={leadInfo.email}
                  onChange={(e) => setLeadInfo({...leadInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={leadInfo.phone}
                  onChange={(e) => setLeadInfo({...leadInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(false)}
                    className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Schedule Tour
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Image Carousel */}
      <div className="relative h-64 bg-gray-900">
        <img 
          src={DEMO_PROPERTY.image_urls[currentImageIndex]} 
          alt="Property" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {DEMO_PROPERTY.image_urls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition">
            <Share className="w-5 h-5" />
          </button>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white text-2xl font-bold">${(DEMO_PROPERTY.price / 1000000).toFixed(2)}M</p>
            <p className="text-white/80 text-sm">Luxury Oceanfront</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Property Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{DEMO_PROPERTY.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{DEMO_PROPERTY.address}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{DEMO_PROPERTY.bedrooms}</p>
              <p className="text-xs text-gray-600">Bedrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <Bath className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-bold">{DEMO_PROPERTY.bathrooms}</p>
              <p className="text-xs text-gray-600">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <Square className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-lg font-bold">{DEMO_PROPERTY.square_footage.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Sq Ft</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-700 leading-relaxed">
              {showFullDescription ? DEMO_PROPERTY.description : `${DEMO_PROPERTY.description.slice(0, 150)}...`}
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 ml-2 font-medium"
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </div>
        </div>

        {/* AI Chat Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Ask Me Anything!</h3>
              <p className="text-sm text-gray-600">I know everything about this property</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
            <p className="text-gray-700 text-sm leading-relaxed">
              "Hi! I'm your AI assistant for this beautiful Malibu villa. I can answer questions about the features, neighborhood, pricing, schools, and help you schedule a viewing. What would you like to know?"
            </p>
          </div>

          <button 
            onClick={() => setShowChat(true)}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Start Chatting with AI
          </button>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">✨ Voice chat available • Instant responses • Lead capture</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Call Agent</p>
            <p className="text-xs text-gray-600 mt-1">Direct line</p>
          </button>
          
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900">Schedule Tour</p>
            <p className="text-xs text-gray-600 mt-1">Private showing</p>
          </button>
        </div>

        {/* Demo Badge */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="font-semibold text-yellow-800">Demo Mode</span>
          </div>
          <p className="text-sm text-yellow-700">
            This is a demo of HomeListingAI's buyer experience. Real listings include live chat, voice AI, and instant lead capture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileDemoApp; 