import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Bot, Send } from 'lucide-react';
import Button from './Button';

// Animated waveform component with multiple bars
const AnimatedWaveform = ({ listening, speaking }: { listening: boolean; speaking: boolean }) => {
  const bars = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center h-16 mb-6">
      <div className="flex items-end gap-1 h-12">
        {bars.map((bar) => (
          <div
            key={bar}
            className={`w-1 rounded-full transition-all duration-300 ${
              listening || speaking
                ? 'bg-gradient-to-t from-pink-500 via-purple-500 to-blue-500'
                : 'bg-gray-300'
            }`}
            style={{
              height: listening || speaking 
                ? `${Math.random() * 40 + 10}px` 
                : '8px',
              animation: listening || speaking 
                ? `waveform ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`
                : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};

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

interface ChatBotWidgetProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ open: openProp, setOpen: setOpenProp }) => {
  const [open, setOpenInternal] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your AI Voice Assistant. You can click the microphone to talk, or type in the box to chat. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Use prop for modal control if provided, else internal state
  const isOpen = openProp !== undefined ? openProp : open;
  const setOpenFn = setOpenProp || setOpenInternal;

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

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

  useEffect(() => {
    const openHandler = () => setOpenFn(true);
    window.addEventListener('open-voice-chat', openHandler);
    return () => window.removeEventListener('open-voice-chat', openHandler);
  }, [setOpenFn]);

  const handleMic = () => {
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current && recognitionRef.current.start();
    }
  };

  const handleSend = async (message?: string) => {
    const userMessage = message || input.trim();
    if (!userMessage) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Thank you for your message! I\'m here to help with any questions about our services.' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="fixed bottom-[100px] right-6 z-50 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full shadow-2xl p-4 flex items-center justify-center hover:scale-105 transition-all border-4 border-white"
          onClick={() => setOpenFn(true)}
          aria-label="Open voice chat"
        >
          <Mic className="w-7 h-7 animate-pulse" />
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-6 z-50 w-96 max-w-[98vw] bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-pink-400 animate-pop-in max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white font-bold">
              <Mic className="w-5 h-5 animate-pulse" /> Voice Assistant
            </div>
            <button onClick={() => setOpenFn(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Voice/Talk Option Notice */}
          <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
            <p className="text-xs text-blue-700 font-medium text-center">
              💬 You can talk to me or type your message below - both options work!
            </p>
          </div>
          
          {/* Animated Voice Visualizer */}
          <AnimatedVoiceVisualizer listening={listening} speaking={speaking} />
          
          {/* Status Text */}
          <div className="text-center mb-4 px-4">
            <p className={`text-sm font-medium transition-colors ${
              listening ? 'text-pink-600' : speaking ? 'text-purple-600' : isLoading ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {listening ? 'Listening...' : speaking ? 'Speaking...' : isLoading ? 'Thinking...' : 'Ready to help!'}
            </p>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                    {message.role === 'user' ? 'U' : 'A'}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg p-3 text-gray-800">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;