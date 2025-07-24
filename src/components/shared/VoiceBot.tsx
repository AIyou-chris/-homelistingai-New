import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { Mic, X, Volume2, Send, AlertTriangle } from 'lucide-react';
import { 
  askOpenAI, 
  getAIVoiceResponse, 
  transcribeVoice, 
  VOICE_OPTIONS, 
  SAMPLE_PROPERTY,
  type OpenAIMessage,
  type VoiceOptions,
  type PropertyInfo
} from '../../services/openaiService';
import { 
  createAIChat, 
  addChatMessage, 
  endAIChat, 
  updateAIChat 
} from '../../services/aiChatsService';
import { motion } from 'framer-motion';

// Voice Circle Animation Component
const VoiceCircle: React.FC<{ listening: boolean; speaking: boolean }> = ({ listening, speaking }) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!listening || !circleRef.current) return;

    const circle = circleRef.current;
    
    // Set up audio context + analyser
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.fftSize);

    audioContextRef.current = audioCtx;
    analyserRef.current = analyser;

    // Ask for mic access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        requestAnimationFrame(checkVolume);
      })
      .catch(err => {
        console.error('Microphone access denied:', err);
      });

    // Compute RMS and toggle .active
    function checkVolume() {
      if (!analyser) return;
      
      analyser.getByteTimeDomainData(dataArray);
      let sumSq = 0;
      for (let i = 0; i < dataArray.length; i++) {
        let v = dataArray[i] - 128;
        sumSq += v * v;
      }
      const rms = Math.sqrt(sumSq / dataArray.length);

      // threshold: tweak this value for sensitivity
      if (rms > 20) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
      animationFrameRef.current = requestAnimationFrame(checkVolume);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [listening]);

  return (
    <div className="flex justify-center items-center py-8">
      <div 
        ref={circleRef}
        className="voice-circle"
        style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <div 
          className="wave"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${listening ? '#4CAF50' : speaking ? '#FF6B6B' : '#4CAF50'}`,
            animation: 'pulse 2s infinite ease-in-out',
            opacity: 0
          }}
        />
        <div 
          className="wave"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${listening ? '#4CAF50' : speaking ? '#FF6B6B' : '#4CAF50'}`,
            animation: 'pulse 2s infinite ease-in-out',
            animationDelay: '0.5s',
            opacity: 0
          }}
        />
        <div 
          className="wave"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${listening ? '#4CAF50' : speaking ? '#FF6B6B' : '#4CAF50'}`,
            animation: 'pulse 2s infinite ease-in-out',
            animationDelay: '1s',
            opacity: 0
          }}
        />
        <Mic className="w-8 h-8 text-gray-600" />
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% {
              transform: scale(0.5);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

const VoiceBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your AI Voice Assistant. I can help you learn about this beautiful property at 123 Oak Street. What would you like to know?" }
  ]);
  const [selectedVoice, setSelectedVoice] = useState<string>('Friendly Female');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Property info for this listing (using sample data for now)
  const propertyInfo: PropertyInfo = SAMPLE_PROPERTY;

  // Initialize chat session when voice bot opens
  useEffect(() => {
    if (open && !chatId) {
      const initializeVoiceChat = async () => {
        try {
          const newChat = await createAIChat('sales', true, 'en');
          if (newChat) {
            setChatId(newChat.id);
            
            // Add welcome message to database
            const welcomeContent = "Hi! I'm your AI Voice Assistant. I can help you learn about this beautiful property at 123 Oak Street. What would you like to know?";
            await addChatMessage(newChat.id, 'ai', welcomeContent, 'AI Voice Assistant');
          }
        } catch (error) {
          console.error('Error initializing voice chat:', error);
        }
      };
      
      initializeVoiceChat();
    }
  }, [open, chatId]);

  // Cleanup chat session when component unmounts
  useEffect(() => {
    return () => {
      if (chatId) {
        endAIChat(chatId).catch(error => {
          console.error('Error ending voice chat session:', error);
        });
      }
    };
  }, [chatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  // Voice recognition setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      handleSend(transcript);
    };
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onerror = () => setListening(false);
  }, []);

  // AI-powered voice output using OpenAI TTS
  const speakWithAI = async (text: string) => {
    try {
      setSpeaking(true);
      const voiceOptions = VOICE_OPTIONS[selectedVoice];
      const audioUrl = await getAIVoiceResponse(text, voiceOptions);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => setSpeaking(false);
      }
    } catch (error) {
      console.error('AI Voice Error:', error);
      // Fallback to browser TTS
      speakWithBrowser(text);
    }
  };

  // Fallback to browser TTS
  const speakWithBrowser = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    setSpeaking(true);
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleMic = () => {
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current && recognitionRef.current.start();
    }
  };

  const handleSend = async (msg?: string) => {
    const content = msg || input;
    if (!content.trim()) return;
    
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');

    // Add user message to database
    if (chatId) {
      try {
        await addChatMessage(chatId, 'user', content);
      } catch (error) {
        console.error('Error adding user message to database:', error);
      }
    }

    try {
      // Convert messages to OpenAI format
      const openAIMessages: OpenAIMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      openAIMessages.push({ role: 'user', content });

      // Get AI response with property context
      const aiResponse = await askOpenAI(openAIMessages, propertyInfo);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
      // Add AI response to database
      if (chatId) {
        try {
          await addChatMessage(chatId, 'ai', aiResponse, 'AI Voice Assistant');
        } catch (error) {
          console.error('Error adding AI message to database:', error);
        }
      }
      
      // Speak the response
      await speakWithAI(aiResponse);
      
    } catch (error: any) {
      console.error('AI Error:', error);
      let errorResponse = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      // Provide more specific error messages
      if (error.message?.includes('API key is not configured')) {
        errorResponse = "OpenAI API key is not configured. Please contact support to set up the voice assistant.";
      } else if (error.message?.includes('API key is invalid')) {
        errorResponse = "OpenAI API key is invalid. Please contact support to fix the configuration.";
      } else if (error.message?.includes('rate limit')) {
        errorResponse = "The AI service is busy right now. Please try again in a few moments.";
      } else if (error.message?.includes('Network error')) {
        errorResponse = "Network connection issue. Please check your internet connection and try again.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorResponse }]);
      speakWithBrowser(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for custom event to open VoiceBot
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-voicebot', handler);
    return () => window.removeEventListener('open-voicebot', handler);
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-24 z-50 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full shadow-2xl p-4 flex items-center justify-center hover:scale-105 transition-all border-4 border-white"
          onClick={() => setOpen(true)}
          aria-label="Open voice bot"
        >
          <Mic className="w-7 h-7 animate-pulse" />
        </button>
      )}
      
      {/* Centered Modal Overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-pink-400 animate-pop-in max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-t-2xl">
              <div className="flex items-center gap-3 text-white font-bold">
                <Mic className="w-6 h-6 animate-pulse" /> 
                <span className="text-lg">Voice Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Voice Settings"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setOpen(false)} 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Voice Settings */}
            {showVoiceSettings && (
              <div className="px-6 py-3 bg-gray-50 border-b">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Voice Style:</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  {Object.keys(VOICE_OPTIONS).map(voice => (
                    <option key={voice} value={voice}>{voice}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Animated Waveform */}
            <VoiceCircle listening={listening} speaking={speaking} />
            
            {/* AI Disclaimer */}
            <div className="bg-amber-50 border-b border-amber-200 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  <strong>AI Voice Notice:</strong> This AI provides information for assistance only. 
                  Please verify all details with a licensed real estate professional before making decisions.
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-4 px-6">
              <p className={`text-sm font-medium transition-colors ${
                listening ? 'text-pink-600' : speaking ? 'text-purple-600' : isLoading ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {listening ? 'Listening...' : speaking ? 'Speaking...' : isLoading ? 'Thinking...' : 'Ready to help!'}
              </p>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50" style={{ minHeight: 200, maxHeight: 300 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg text-sm max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-3">
                  <div className="px-4 py-2 rounded-lg text-sm bg-white text-gray-800 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input & Controls */}
            <form className="flex items-center gap-3 p-4 border-t bg-white rounded-b-2xl" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <button 
                type="button" 
                className={`p-3 rounded-full transition-all ${
                  listening 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`} 
                onClick={handleMic} 
                title="Voice input"
                disabled={isLoading}
              >
                <Mic className={`w-5 h-5 ${listening ? 'animate-pulse' : ''}`} />
              </button>
              <input
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                placeholder={listening ? 'Listening...' : isLoading ? 'AI is thinking...' : 'Type your message...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={listening || isLoading}
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                disabled={(!input.trim() && !listening) || isLoading}
                className="px-4 py-3"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {/* Hidden audio element for AI voice */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Add waveform animation styles */}
      <style>{`
        @keyframes waveform {
          0% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.3); }
        }
      `}</style>
    </>
  );
};

export default VoiceBot; 