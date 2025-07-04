import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Home, Phone, Mail, MapPin, DollarSign, Bed, Bath, Square, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { propertyAIService, type ChatSession, type ChatMessage } from '../services/propertyAIService';
import { getListingById } from '../services/listingService';
import { getAIVoiceResponse, transcribeVoice, VOICE_OPTIONS } from '../services/openaiService';
import { Listing } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';

const PropertyChatPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' });
  
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

  useEffect(() => {
    if (listingId) {
      initializeChat();
    }
  }, [listingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize voice recognition (moved after sendMessage definition)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        // User can review and send manually after voice input
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [voiceMode]);

  // Voice functions
  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakAIResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      const voiceOptions = VOICE_OPTIONS[selectedVoice];
      const audioUrl = await getAIVoiceResponse(text, voiceOptions);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Voice response error:', error);
      setIsSpeaking(false);
    }
  };

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Get listing details
      const listingData = await getListingById(listingId!);
      if (!listingData) {
        throw new Error('Listing not found');
      }
      setListing(listingData);

      // Create new chat session
      const session = await propertyAIService.createChatSession(listingId!);
      setChatSession(session);
      setMessages(session.messages);

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatSession || isSending) return;

    const userMessage = input.trim();
    setInput('');
    setIsSending(true);

    // Add user message to UI immediately
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Send to AI service
      const aiResponse = await propertyAIService.sendMessage(
        chatSession.sessionId,
        userMessage,
        leadInfo.email ? leadInfo : undefined
      );

      // Add AI response to UI
      setMessages(prev => [...prev, aiResponse]);

      // Speak AI response if voice mode is enabled
      if (voiceMode) {
        await speakAIResponse(aiResponse.content);
      }

      // Check if we should prompt for lead info
      if (!leadInfo.email && messages.length >= 6 && !showLeadForm) {
        setTimeout(() => setShowLeadForm(true), 2000);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const submitLeadInfo = () => {
    if (leadInfo.name && leadInfo.email) {
      setShowLeadForm(false);
      // Send a message to let AI know we have contact info
      setInput('I\'d like to learn more about this property');
      setTimeout(sendMessage, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Property Info Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Property Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Home className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{listing.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
            <DollarSign className="w-5 h-5" />
            <span>${listing.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Bed className="w-4 h-4" />
                <span className="text-lg font-semibold">{listing.bedrooms}</span>
              </div>
              <span className="text-xs text-gray-500">Bedrooms</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Bath className="w-4 h-4" />
                <span className="text-lg font-semibold">{listing.bathrooms}</span>
              </div>
              <span className="text-xs text-gray-500">Bathrooms</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Square className="w-4 h-4" />
                <span className="text-lg font-semibold">{listing.square_footage.toLocaleString()}</span>
              </div>
              <span className="text-xs text-gray-500">Sq Ft</span>
            </div>
          </div>
        </div>

        {/* Property Image */}
        {listing.image_urls && listing.image_urls.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <img 
              src={listing.image_urls[0]} 
              alt={listing.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Description */}
        <div className="p-6 flex-1">
          <h3 className="font-semibold text-gray-900 mb-3">About This Property</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
        </div>

        {/* Contact CTA */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3">Interested in this property?</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              <Phone className="w-4 h-4" />
              Schedule Viewing
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition">
              <Mail className="w-4 h-4" />
              Contact Agent
            </button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              voiceMode ? 'bg-purple-600' : 'bg-blue-600'
            }`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">Property AI Assistant</h2>
              <p className="text-sm text-gray-600">
                {voiceMode ? '🎤 Voice mode enabled - Speak naturally!' : 'Ask me anything about this property!'}
              </p>
            </div>
            
            {/* Voice Controls */}
            <div className="flex items-center gap-3">
              {/* Voice Mode Toggle */}
              <button
                onClick={() => setVoiceMode(!voiceMode)}
                className={`p-2 rounded-lg transition-all ${
                  voiceMode 
                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={voiceMode ? 'Disable voice mode' : 'Enable voice mode'}
              >
                {voiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Voice Personality Selector */}
              {voiceMode && (
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  {Object.keys(VOICE_OPTIONS).map((voice) => (
                    <option key={voice} value={voice}>{voice}</option>
                  ))}
                </select>
              )}

              {/* Online Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isSpeaking ? 'bg-purple-400' : 'bg-green-400'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {isSpeaking ? 'Speaking...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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
              <div className="max-w-xs lg:max-w-md flex gap-3">
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
          
          {/* Voice indicator when AI is speaking */}
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md flex gap-3">
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
              <p className="text-xs text-gray-500 mt-2">
                {isListening ? 'Listening... speak clearly!' : 'Click and speak your question about the property'}
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={voiceMode ? "Voice transcription will appear here..." : "Ask about the property, neighborhood, schools..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isSending || isListening}
            />
            
            {/* Microphone Button (always visible for quick voice input) */}
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={isSending || isSpeaking}
              className={`px-3 py-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              title={isListening ? 'Stop recording' : 'Voice input'}
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
      </div>

      {/* Lead Capture Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Stay Connected!</h3>
            <p className="text-gray-600 mb-6">
              I'd love to send you more information about this property and help you with next steps.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={leadInfo.name}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="email"
                placeholder="Your email"
                value={leadInfo.email}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="tel"
                placeholder="Your phone (optional)"
                value={leadInfo.phone}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLeadForm(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Maybe Later
              </button>
              <button
                onClick={submitLeadInfo}
                disabled={!leadInfo.name || !leadInfo.email}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Continue Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element for voice responses */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default PropertyChatPage; 