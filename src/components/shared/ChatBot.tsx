import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Clock, Crown } from 'lucide-react';
import Button from './Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  listingId?: string;
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ listingId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoWarning, setShowDemoWarning] = useState(false);
  const [demoTimeLeft, setDemoTimeLeft] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for demo expiration
  useEffect(() => {
    if (listingId) {
      const aiConfig = localStorage.getItem(`ai_config_${listingId}`);
      if (aiConfig) {
        try {
          const config = JSON.parse(aiConfig);
          if (config.is_demo && config.demo_expires_at) {
            const checkTimeLeft = () => {
              const now = new Date().getTime();
              const expiresAt = new Date(config.demo_expires_at).getTime();
              const timeLeft = Math.max(0, expiresAt - now);
              
              if (timeLeft > 0) {
                const minutesLeft = Math.ceil(timeLeft / 1000 / 60);
                setDemoTimeLeft(minutesLeft);
                
                // Show warning when less than 5 minutes left
                if (minutesLeft <= 5) {
                  setShowDemoWarning(true);
                }
              } else {
                setDemoTimeLeft(0);
                setShowDemoWarning(true);
                // Demo expired - remove the config
                localStorage.removeItem(`ai_config_${listingId}`);
              }
            };
            
            checkTimeLeft();
            const interval = setInterval(checkTimeLeft, 60000); // Check every minute
            
            return () => clearInterval(interval);
          }
        } catch (error) {
          console.error('Error parsing AI config:', error);
        }
      }
    }
  }, [listingId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm your AI real estate assistant! I can help you with information about this property, schedule viewings, and answer any questions you have. What would you like to know?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white hover:text-gray-200">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Demo Warning */}
      {showDemoWarning && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 border-b border-orange-400">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {demoTimeLeft === 0 
                ? 'Demo expired! Upgrade to keep your AI agent forever.'
                : `Demo expires in ${demoTimeLeft} minutes!`
              }
            </span>
            <button 
              onClick={() => window.location.href = '/checkout'}
              className="ml-auto bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium"
            >
              <Crown className="w-3 h-3 inline mr-1" />
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Ask me anything about this property!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 max-w-xs px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about this property..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot; 