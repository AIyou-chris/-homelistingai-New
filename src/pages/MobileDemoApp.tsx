import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Home, Phone, Mail, MapPin, DollarSign, Bed, Bath, Square, Bot, User, Mic, MicOff, Volume2, VolumeX, Calendar, Heart, Share, ArrowLeft, MessageSquare, Star, Info } from 'lucide-react';
import { propertyAIService, type ChatSession, type ChatMessage } from '../services/propertyAIService';
import { getAIVoiceResponse, transcribeVoice, VOICE_OPTIONS } from '../services/openaiService';
import { Listing, PropertyType, ListingStatus, DataField } from '../types';
import { 
  ENHANCED_DEMO_PROPERTY, 
  DEMO_AGENT_TEMPLATE,
  getConfidenceColor,
  getConfidenceBadge,
  getDataSourceIcon,
  getDataSourceLabel
} from '../constants';

import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import LeafletMap from '../components/LeafletMap';

// Add the advanced voice animation components at the top of the file
const AnimatedVoiceVisualizer = ({ listening, speaking }: { listening: boolean; speaking: boolean }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  const isActive = listening || speaking;
  
  return (
    <div className="flex items-center justify-center h-40 mb-6 relative">
      {/* Main circular container */}
      <div className="relative w-32 h-32">
        {/* Outer pulsing ring */}
        <div 
          className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
            isActive 
              ? 'border-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-pulse scale-110' 
              : 'border-gray-300 scale-100'
          }`}
          style={{
            background: isActive 
              ? 'conic-gradient(from 0deg, #ec4899, #a855f7, #3b82f6, #ec4899)' 
              : 'transparent',
            padding: '2px',
            animation: isActive ? 'spin 4s linear infinite, pulse 2s ease-in-out infinite' : 'none'
          }}
        >
          {/* Inner circle */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
            {/* Center core */}
            <div 
              className={`w-12 h-12 rounded-full transition-all duration-300 ${
                listening 
                  ? 'bg-gradient-to-br from-red-400 to-pink-500 animate-pulse' 
                  : speaking 
                    ? 'bg-gradient-to-br from-purple-400 to-blue-500 animate-pulse'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'
              }`}
              style={{
                animation: isActive ? 'breathe 1.5s ease-in-out infinite' : 'none'
              }}
            />
            
            {/* Floating particles around the center */}
            {particles.map((particle) => (
              <div
                key={particle}
                className={`absolute w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-300 to-purple-300 opacity-80' 
                    : 'bg-gray-200 opacity-30'
                }`}
                style={{
                  transform: `rotate(${particle * 30}deg) translateX(40px)`,
                  animation: isActive 
                    ? `orbit ${2 + particle * 0.2}s linear infinite, float-particle 3s ease-in-out infinite`
                    : 'none',
                  animationDelay: `${particle * 0.1}s`
                }}
              />
            ))}
            
            {/* Dynamic wave bars inside circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-end gap-1 h-8">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-t from-white/60 via-white/80 to-white/90'
                        : 'bg-gray-400/30'
                    }`}
                    style={{
                      height: isActive 
                        ? `${Math.random() * 20 + 8}px` 
                        : '4px',
                      animation: isActive 
                        ? `inner-wave ${0.8 + Math.random() * 0.4}s ease-in-out infinite alternate`
                        : 'none',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary outer ring */}
        <div 
          className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
            isActive 
              ? 'border-purple-300/50 scale-125 animate-ping' 
              : 'border-transparent scale-100'
          }`}
          style={{
            animationDuration: '3s'
          }}
        />
        
        {/* Tertiary outer ring */}
        <div 
          className={`absolute inset-0 rounded-full border transition-all duration-1000 ${
            isActive 
              ? 'border-blue-200/30 scale-150 animate-ping' 
              : 'border-transparent scale-100'
          }`}
          style={{
            animationDuration: '4s',
            animationDelay: '0.5s'
          }}
        />
      </div>
      
      {/* Corner accent elements */}
      {isActive && (
        <>
          <div className="absolute top-4 left-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-8 right-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-4 right-8 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.8s' }} />
        </>
      )}
    </div>
  );
};

// Use enhanced demo property with data source tracking
const DEMO_PROPERTY = {
  id: ENHANCED_DEMO_PROPERTY.id,
  title: ENHANCED_DEMO_PROPERTY.title.value,
  description: ENHANCED_DEMO_PROPERTY.description.value,
  address: ENHANCED_DEMO_PROPERTY.address.value,
  price: ENHANCED_DEMO_PROPERTY.price.value,
  bedrooms: ENHANCED_DEMO_PROPERTY.bedrooms.value,
  bathrooms: ENHANCED_DEMO_PROPERTY.bathrooms.value,
  square_footage: ENHANCED_DEMO_PROPERTY.square_footage.value,
  image_urls: [
    '/slider1.png',
    '/slider2.png', 
    '/slider3.png',
    '/slider4.png',
    '/slider5.png',
    '/slider6.png',
    '/slider7.png'
  ],
  created_at: ENHANCED_DEMO_PROPERTY.created_at,
  property_type: ENHANCED_DEMO_PROPERTY.property_type.value,
  status: ENHANCED_DEMO_PROPERTY.status.value,
  agent_id: ENHANCED_DEMO_PROPERTY.agent_id
};

// Confidence indicator component
const ConfidenceIndicator: React.FC<{ dataField: DataField<any>; label: string }> = ({ dataField, label }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`ml-2 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center ${
          dataField.confidence >= 90 ? 'bg-green-100 text-green-700' :
          dataField.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        } ${dataField.needsReview ? 'ring-2 ring-orange-400' : ''}`}
        title={`${getConfidenceBadge(dataField.confidence)} confidence`}
      >
        {getDataSourceIcon(dataField.dataSource)}
      </button>
      
      {showDetails && (
        <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-48">
          <div className="text-xs space-y-1">
            <div className="font-semibold text-gray-700">{label}</div>
            <div className={`font-medium ${getConfidenceColor(dataField.confidence)}`}>
              {getConfidenceBadge(dataField.confidence)} Confidence ({dataField.confidence}%)
            </div>
            <div className="text-gray-600">
              Source: {getDataSourceLabel(dataField.dataSource)}
            </div>
            {dataField.needsReview && (
              <div className="text-orange-600 font-medium">⚠️ Needs Review</div>
            )}
            {dataField.fallbackUsed && (
              <div className="text-blue-600">🔄 Fallback Used</div>
            )}
            <div className="text-gray-500 text-xs">
              Updated: {dataField.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileDemoApp: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' });
  const [showChat, setShowChat] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  
  // Popover states
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  
  // Auto-building features
  const [showConfidenceMode, setShowConfidenceMode] = useState(false);
  
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
      const audioUrl = await getAIVoiceResponse(text, voiceOption);
      
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

        {/* Voice Chat Modal */}
        {showVoiceChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setShowVoiceChat(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-home text-blue-600 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Talk With the Home</h3>
                <p className="text-gray-600">Ask me anything about this beautiful Malibu villa!</p>
              </div>

              {/* Voice/Talk Option Notice */}
              <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 mb-4">
                <p className="text-sm text-blue-700 font-medium text-center">
                  💬 You can talk to me or type your message below - both options work!
                </p>
              </div>

              {/* Advanced Voice Animation */}
              <AnimatedVoiceVisualizer listening={isListening} speaking={isSpeaking} />

              {/* Status Text */}
              <div className="text-center mb-6">
                <p className={`text-lg font-medium ${
                  isListening ? 'text-red-600' : isSpeaking ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to start talking'}
                </p>
              </div>

              {/* Voice Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  disabled={isSpeaking}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } disabled:opacity-50`}
                >
                  <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} mr-2`}></i>
                  {isListening ? 'Stop' : 'Start'}
                </button>
                
                <button
                  onClick={() => setShowVoiceChat(false)}
                  className="px-6 py-3 rounded-full font-semibold bg-gray-300 hover:bg-gray-400 text-gray-700 transition"
                >
                  Close
                </button>
              </div>

              {/* Recent conversation */}
              {messages.length > 1 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-600 mb-2">Recent conversation:</p>
                  {messages.slice(-2).map((msg, index) => (
                    <div key={index} className="text-xs text-gray-500 mb-1">
                      <strong>{msg.role === 'user' ? 'You' : 'Home'}:</strong> {msg.content.slice(0, 50)}...
                    </div>
                  ))}
                </div>
              )}
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

        {/* Talk With the Home Button - Floating over images */}
        <div className="absolute bottom-4 left-4 animate-fade-in">
          <button
            onClick={() => setShowVoiceChat(true)}
            className="group relative bg-black/90 backdrop-blur-xl text-white py-2 px-4 rounded-full shadow-lg hover:bg-black/95 transition-all duration-300 flex items-center gap-2 border border-white/10"
          >
            <div className="flex items-center justify-center w-6 h-6">
              <i className="fas fa-microphone text-xs"></i>
            </div>
            <span className="text-sm font-medium">Talk With the Home</span>
            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

      </div>



      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Property Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{DEMO_PROPERTY.title}</h1>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={ENHANCED_DEMO_PROPERTY.title} 
                    label="Property Title" 
                  />
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{DEMO_PROPERTY.address}</span>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={ENHANCED_DEMO_PROPERTY.address} 
                    label="Property Address" 
                  />
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end">
                <p className="text-3xl font-bold text-gray-900">${(DEMO_PROPERTY.price / 1000000).toFixed(2)}M</p>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={ENHANCED_DEMO_PROPERTY.price} 
                    label="Property Price" 
                  />
                )}
              </div>
              <p className="text-sm text-blue-600 font-medium">Luxury Oceanfront</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2">
                <i className="fas fa-bed text-blue-600 text-xl"></i>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-lg font-bold text-blue-600">{DEMO_PROPERTY.bedrooms}</p>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={ENHANCED_DEMO_PROPERTY.bedrooms} 
                    label="Bedrooms Count" 
                  />
                )}
              </div>
              <p className="text-xs text-blue-600">Bedrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2">
                <i className="fas fa-bath text-blue-600 text-xl"></i>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-lg font-bold text-blue-600">{DEMO_PROPERTY.bathrooms}</p>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={ENHANCED_DEMO_PROPERTY.bathrooms} 
                    label="Bathrooms Count" 
                  />
                )}
              </div>
              <p className="text-xs text-blue-600">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2">
                <i className="fas fa-vector-square text-blue-600 text-xl"></i>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-lg font-bold text-blue-600">{DEMO_PROPERTY.square_footage.toLocaleString()}</p>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={ENHANCED_DEMO_PROPERTY.square_footage} 
                    label="Square Footage" 
                  />
                )}
              </div>
              <p className="text-xs text-blue-600">Sq Ft</p>
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

        {/* Property Map */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-map-marker-alt text-blue-600"></i>
            Property Location
          </h3>
          <LeafletMap 
            center={[34.0392, -118.6793]} 
            zoom={16} 
            height="300px" 
            showDirections={true}
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Call Agent</p>
            <p className="text-xs text-gray-600 mt-1">Direct line</p>
          </button>
          
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900">Schedule Tour</p>
            <p className="text-xs text-gray-600 mt-1">Private showing</p>
          </button>

          <button 
            onClick={() => setShowPropertyDetails(true)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <i className="fas fa-home text-blue-600 text-xl"></i>
            </div>
            <p className="font-semibold text-gray-900">Property Details</p>
            <p className="text-xs text-gray-600 mt-1">Full specs</p>
          </button>

          <button 
            onClick={() => setShowNeighborhood(true)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <i className="fas fa-map-marked-alt text-purple-600 text-xl"></i>
            </div>
            <p className="font-semibold text-gray-900">Neighborhood</p>
            <p className="text-xs text-gray-600 mt-1">Local insights</p>
          </button>

          <button 
            onClick={() => setShowSchools(true)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-3">
              <i className="fas fa-graduation-cap text-indigo-600 text-xl"></i>
            </div>
            <p className="font-semibold text-gray-900">Schools</p>
            <p className="text-xs text-gray-600 mt-1">Ratings & info</p>
          </button>

          <button 
            onClick={() => setShowGallery(true)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mx-auto mb-3">
              <i className="fas fa-images text-pink-600 text-xl"></i>
            </div>
            <p className="font-semibold text-gray-900">Gallery</p>
            <p className="text-xs text-gray-600 mt-1">All photos</p>
          </button>
        </div>



        {/* Demo Badge with Auto-Building Controls */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="font-semibold text-yellow-800">Demo Mode</span>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            This is a demo of HomeListingAI's buyer experience. Real listings include live chat, voice AI, and instant lead capture.
          </p>
          
          {/* Auto-Building Features */}
          <div className="border-t border-yellow-300 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">Auto-Building Features</span>
              <button
                onClick={() => setShowConfidenceMode(!showConfidenceMode)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  showConfidenceMode 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                }`}
              >
                {showConfidenceMode ? 'Hide' : 'Show'} Data Sources
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Auto-Scraped ({ENHANCED_DEMO_PROPERTY.confidence_score}%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span>Needs Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Realtor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user-tie text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-gray-900">{DEMO_AGENT_TEMPLATE.name.value}</h3>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={DEMO_AGENT_TEMPLATE.name} 
                    label="Agent Name" 
                  />
                )}
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-600">{DEMO_AGENT_TEMPLATE.title.value}</p>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={DEMO_AGENT_TEMPLATE.title} 
                    label="Agent Title" 
                  />
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  {DEMO_AGENT_TEMPLATE.stats.avgRating.value} • {DEMO_AGENT_TEMPLATE.stats.reviewCount.value} reviews
                </span>
                {showConfidenceMode && (
                  <ConfidenceIndicator 
                    dataField={DEMO_AGENT_TEMPLATE.stats.avgRating} 
                    label="Agent Rating" 
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center">
                  <p className="text-2xl font-bold text-blue-600">{DEMO_AGENT_TEMPLATE.stats.totalSales.value}</p>
                  {showConfidenceMode && (
                    <ConfidenceIndicator 
                      dataField={DEMO_AGENT_TEMPLATE.stats.totalSales} 
                      label="Total Sales" 
                    />
                  )}
                </div>
                <p className="text-xs text-gray-600">Total Sales</p>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <p className="text-2xl font-bold text-green-600">{DEMO_AGENT_TEMPLATE.stats.propertiesSold.value}</p>
                  {showConfidenceMode && (
                    <ConfidenceIndicator 
                      dataField={DEMO_AGENT_TEMPLATE.stats.propertiesSold} 
                      label="Properties Sold" 
                    />
                  )}
                </div>
                <p className="text-xs text-gray-600">Properties Sold</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start">
              <p className="text-sm text-gray-600 leading-relaxed">
                "{DEMO_AGENT_TEMPLATE.bio.value}"
              </p>
              {showConfidenceMode && (
                <ConfidenceIndicator 
                  dataField={DEMO_AGENT_TEMPLATE.bio} 
                  label="Agent Bio" 
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom padding for fixed navigation */}
        <div className="h-24"></div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-[9999]">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100"
            >
              <i className="fas fa-home text-blue-600 text-lg"></i>
              <span className="text-xs font-medium text-gray-700">Home</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
              <i className="fas fa-calendar-alt text-green-600 text-lg"></i>
              <span className="text-xs font-medium text-gray-700">Schedule Tour</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100">
              <i className="fas fa-phone text-purple-600 text-lg"></i>
              <span className="text-xs font-medium text-gray-700">Contact</span>
            </button>

            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Luxury Malibu Villa - $8.95M',
                    text: 'Check out this stunning oceanfront villa in Malibu! 5 bed, 6 bath with infinity pool and private beach access.',
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  // Fallback - copy to clipboard
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Link copied to clipboard!');
                  });
                }
              }}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100"
            >
              <i className="fas fa-share-alt text-orange-600 text-lg"></i>
              <span className="text-xs font-medium text-gray-700">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Popover */}
      {showPropertyDetails && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPropertyDetails(false)}
          />
          
          {/* Popover Content */}
          <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up border border-gray-100">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Property Details</h3>
                <button 
                  onClick={() => setShowPropertyDetails(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times text-gray-600 text-sm"></i>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Year Built</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{ENHANCED_DEMO_PROPERTY.year_built?.value}</span>
                    {showConfidenceMode && ENHANCED_DEMO_PROPERTY.year_built && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.year_built} 
                        label="Year Built" 
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lot Size</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{ENHANCED_DEMO_PROPERTY.lot_size?.value} acres</span>
                    {showConfidenceMode && ENHANCED_DEMO_PROPERTY.lot_size && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.lot_size} 
                        label="Lot Size" 
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Property Type</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{ENHANCED_DEMO_PROPERTY.property_type.value}</span>
                    {showConfidenceMode && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.property_type} 
                        label="Property Type" 
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Architecture</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{ENHANCED_DEMO_PROPERTY.architecture?.value}</span>
                    {showConfidenceMode && ENHANCED_DEMO_PROPERTY.architecture && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.architecture} 
                        label="Architecture Style" 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <h4 className="font-semibold text-gray-900">Financial Information</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Property Taxes</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">${ENHANCED_DEMO_PROPERTY.property_taxes?.value.toLocaleString()}/year</span>
                    {showConfidenceMode && ENHANCED_DEMO_PROPERTY.property_taxes && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.property_taxes} 
                        label="Property Taxes" 
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HOA Fees</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">${ENHANCED_DEMO_PROPERTY.hoa_fees?.value.toLocaleString()}/month</span>
                    {showConfidenceMode && ENHANCED_DEMO_PROPERTY.hoa_fees && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.hoa_fees} 
                        label="HOA Fees" 
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Insurance Est.</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">${ENHANCED_DEMO_PROPERTY.insurance_estimate?.value.toLocaleString()}/year</span>
                    {showConfidenceMode && ENHANCED_DEMO_PROPERTY.insurance_estimate && (
                      <ConfidenceIndicator 
                        dataField={ENHANCED_DEMO_PROPERTY.insurance_estimate} 
                        label="Insurance Estimate" 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Premium Features</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Infinity pool with ocean views",
                    "Smart home automation",
                    "Wine cellar (200+ bottles)",
                    "Home theater with Dolby Atmos",
                    "Chef's kitchen with premium appliances",
                    "Private beach access",
                    "3-car garage with EV charging"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neighborhood Popover */}
      {showNeighborhood && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNeighborhood(false)}
          />
          <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up border border-gray-100">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Neighborhood</h3>
                <button 
                  onClick={() => setShowNeighborhood(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times text-gray-600 text-sm"></i>
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Neighborhood Description */}
              <div className="text-center">
                <p className="text-gray-600 leading-relaxed">Exclusive Malibu beachfront community with world-class amenities, top dining, and pristine beaches.</p>
              </div>

              {/* Walkability Scores */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Walkability & Transit</h4>
                
                {/* Walk Score */}
                <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-walking text-green-600"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Walk Score</p>
                      <p className="text-sm text-gray-600">Very Walkable</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">85</p>
                    <p className="text-xs text-gray-500">out of 100</p>
                  </div>
                </div>

                {/* Transit Score */}
                <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-bus text-blue-600"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Transit Score</p>
                      <p className="text-sm text-gray-600">Good Transit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">65</p>
                    <p className="text-xs text-gray-500">out of 100</p>
                  </div>
                </div>

                {/* Bike Score */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-bicycle text-orange-600"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Bike Score</p>
                      <p className="text-sm text-gray-600">Very Bikeable</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">78</p>
                    <p className="text-xs text-gray-500">out of 100</p>
                  </div>
                </div>
              </div>

              {/* Local Amenities */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Nearby Highlights</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-utensils text-blue-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700 text-sm">Nobu Malibu - 0.3 miles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-shopping-bag text-green-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700 text-sm">Malibu Country Mart - 0.5 miles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-umbrella-beach text-purple-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700 text-sm">Zuma Beach - 0.2 miles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-coffee text-orange-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700 text-sm">Starbucks Reserve - 0.4 miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schools Popover */}
      {showSchools && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSchools(false)}
          />
          <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up border border-gray-100">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Schools & Education</h3>
                <button 
                  onClick={() => setShowSchools(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times text-gray-600 text-sm"></i>
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6 max-h-96 overflow-y-auto">
              <div className="text-center">
                <p className="text-gray-600">Top-rated schools and educational institutions in the Malibu area.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Popover */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowGallery(false)}
          />
          <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up border border-gray-100">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Photo Gallery</h3>
                <button 
                  onClick={() => setShowGallery(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times text-gray-600 text-sm"></i>
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {DEMO_PROPERTY.image_urls.map((imageUrl, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={imageUrl} 
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add advanced animation styles */}
      <style>{`
        @keyframes waveform {
          0% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.3); }
        }
        
        @keyframes inner-wave {
          0% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
          100% { transform: scaleY(0.4); }
        }
        
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MobileDemoApp; 