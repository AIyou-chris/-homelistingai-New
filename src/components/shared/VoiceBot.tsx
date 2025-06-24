import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { Mic, X, Bot } from 'lucide-react';

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

const VoiceBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your AI Voice Assistant. Tap the mic and ask me anything about this listing!" }
  ]);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Voice output (TTS)
  const speak = (text: string) => {
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

  const handleSend = (msg?: string) => {
    const content = msg || input;
    if (!content.trim()) return;
    setMessages([...messages, { role: 'user', content }]);
    setInput('');
    // TODO: Integrate with OpenAI backend here
    setTimeout(() => {
      const aiResponse = 'This is a sample AI voice response. (OpenAI integration coming soon!)';
      setMessages(msgs => [...msgs, { role: 'assistant', content: aiResponse }]);
      speak(aiResponse);
    }, 800);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-pink-400 animate-pop-in max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-t-2xl">
              <div className="flex items-center gap-3 text-white font-bold">
                <Mic className="w-6 h-6 animate-pulse" /> 
                <span className="text-lg">Voice Assistant</span>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Animated Waveform */}
            <AnimatedWaveform listening={listening} speaking={speaking} />
            
            {/* Status Text */}
            <div className="text-center mb-4 px-6">
              <p className={`text-sm font-medium transition-colors ${
                listening ? 'text-pink-600' : speaking ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {listening ? 'Listening...' : speaking ? 'Speaking...' : 'Ready to help!'}
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
              >
                <Mic className={`w-5 h-5 ${listening ? 'animate-pulse' : ''}`} />
              </button>
              <input
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                placeholder={listening ? 'Listening...' : 'Type your message...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={listening}
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                disabled={!input.trim() && !listening}
                className="px-4 py-3"
              >
                <Bot className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
      
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