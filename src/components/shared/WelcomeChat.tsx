import React, { useState, useRef, useEffect } from 'react';
import { askOpenAI, OpenAIMessage } from '../../services/openaiService';
import Button from './Button';
import Input from './Input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WelcomeChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: `Welcome to HomeListingAI! 🏠 I'm your AI assistant here to help you get started. I can help you understand our features, create your first listing, or answer any questions about real estate marketing. What would you like to know?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const generateContext = (): string => {
    return `
You are a helpful AI assistant for HomeListingAI, a real estate marketing platform. You help new users understand the platform and get started with their real estate business.

Key features to mention:
- AI-powered property descriptions
- Lead generation and management
- Professional listing creation
- Market analysis tools
- Appointment scheduling
- Knowledge base management

Be friendly, encouraging, and helpful. Guide users toward creating their first listing or exploring the dashboard. Keep responses concise but informative.
`;
  };

  const handleSendMessage = async (messageText: string) => {
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history: OpenAIMessage[] = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      const context = generateContext();

      const response = await askOpenAI([
        { role: 'system', content: context },
        ...history,
        { role: 'user', content: messageText }
      ], undefined, {
        temperature: 0.7,
        max_tokens: 300
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
      {/* Chat Header */}
      <div className="bg-white/10 px-6 py-4 rounded-t-2xl border-b border-white/20">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
          AI Assistant
        </h3>
        <p className="text-sm text-gray-300 mt-1">
          Let's get you started with HomeListingAI
        </p>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/20 text-white px-4 py-3 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-white/20 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              handleSendMessage(input);
            }
          }}
          className="flex space-x-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-white/50 focus:ring-white/20"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            variant="primary"
            size="sm"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeChat; 