import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Bot } from 'lucide-react';
import { 
  askOpenAI, 
  SAMPLE_PROPERTY,
  type OpenAIMessage,
  type PropertyInfo
} from '../../services/openaiService';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const initialMessages: ChatMessage[] = [
  { role: 'assistant', content: "Hi! 👋 I'm your AI assistant. I can help you learn about our properties or answer any questions about HomeListingAI. What would you like to know?" }
];

const ChatBotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Property info for this listing (using sample data for now)
  const propertyInfo: PropertyInfo = SAMPLE_PROPERTY;

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    try {
      // Convert messages to OpenAI format
      const openAIMessages: OpenAIMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      openAIMessages.push({ role: 'user', content: input });

      // Get AI response with property context
      const aiResponse = await askOpenAI(openAIMessages, propertyInfo);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
    } catch (error) {
      console.error('AI Error:', error);
      const errorResponse = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl p-4 flex items-center justify-center hover:scale-105 transition-all"
          onClick={() => setOpen(true)}
          aria-label="Open chat bot"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[98vw] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-pop-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white font-bold">
              <Bot className="w-5 h-5" /> AI Chat
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50" style={{ minHeight: 300, maxHeight: 480 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800 border border-gray-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="px-3 py-2 rounded-lg text-sm bg-white text-gray-800 border border-gray-200">
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
          {/* Input */}
          <form className="flex items-center gap-2 p-3 border-t bg-white" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <button 
              type="button" 
              className="p-2 text-gray-400 hover:text-blue-600" 
              title="Voice input (coming soon)"
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <button 
              type="submit" 
              className="p-2 text-blue-600 hover:text-blue-800" 
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget; 