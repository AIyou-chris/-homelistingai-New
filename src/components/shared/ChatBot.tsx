import React, { useState, useRef, useEffect } from 'react';
import { askOpenAI, OpenAIMessage } from '../../services/openaiService';
import * as appointmentService from '../../services/appointmentService';
import { Listing } from '../../types';
import Button from './Button';
import Input from './Input';

interface ChatBotProps {
  listing?: Listing;
  onLeadCapture?: (lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    source: 'chat';
  }) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'lead-form' | 'appointment-form';
}

const ChatBot: React.FC<ChatBotProps> = ({ listing, onLeadCapture }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
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
        content: `Hi! I'm your AI real estate assistant. I can help you learn more about ${listing?.title || 'this property'}, schedule viewings, or answer any questions you have. What would you like to know?`,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [listing?.title]);

  const generateContext = (listing: Listing): string => {
    return `
You are a helpful AI assistant for a real estate agency. You are knowledgeable about the property listing provided below. Be friendly, helpful, and encourage the user to book a showing.

Property Details:
- Title: ${listing.title}
- Address: ${listing.address}
- Price: $${listing.price.toLocaleString()}
- Bedrooms: ${listing.bedrooms}
- Bathrooms: ${listing.bathrooms}
- Square Feet: ${listing.square_footage}
- Property Type: ${listing.property_type}
- Description: ${listing.description}
${listing.knowledge_base ? `- Additional Info: ${listing.knowledge_base}` : ''}
`;
  };

  const handleSendMessage = async (messageText: string) => {
    if (!listing) return;
    
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const context = generateContext(listing);

      const openAIMessages: OpenAIMessage[] = [
        { role: 'system', content: context },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: messageText }
      ];
      
      const response = await askOpenAI(openAIMessages, {
        temperature: 0.7,
        max_tokens: 500
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if we should show lead form or appointment form
      const lowerResponse = response.toLowerCase();
      if (lowerResponse.includes('contact') || lowerResponse.includes('information') || lowerResponse.includes('follow up')) {
        setShowLeadForm(true);
      } else if (lowerResponse.includes('schedule') || lowerResponse.includes('appointment') || lowerResponse.includes('viewing')) {
        setShowAppointmentForm(true);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const leadData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      source: 'chat' as const
    };

    onLeadCapture?.(leadData);
    setShowLeadForm(false);

    const thankYouMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Thank you for your information! A real estate agent will contact you shortly. Is there anything else I can help you with?',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, thankYouMessage]);
  };

  const handleAppointmentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const appointmentData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      preferredDate: formData.get('preferredDate') as string,
      preferredTime: formData.get('preferredTime') as string,
      message: formData.get('message') as string,
      listingId: listing?.id
    };

    try {
      // Use mock service for now (you can switch to real service later)
      await appointmentService.createMockAppointment(appointmentData);
      setShowAppointmentForm(false);

      const confirmationMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Great! I\'ve received your appointment request. A real estate agent will contact you to confirm the details. Is there anything else you\'d like to know about the property?',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, confirmationMessage]);
    } catch (error) {
      console.error('Error creating appointment:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but there was an issue scheduling your appointment. Please try again or contact us directly.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl max-w-md mx-auto">
      {/* Chat Header */}
      <div className="bg-slate-700 px-4 py-3 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          AI Real Estate Assistant
        </h3>
        <p className="text-sm text-gray-300">
          {listing ? `Chatting about ${listing.title}` : 'Ask me anything about real estate'}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-700 text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Lead Capture Form */}
        {showLeadForm && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-100 px-4 py-3 rounded-lg max-w-sm">
              <h4 className="font-semibold mb-2">Let's get you connected!</h4>
              <form onSubmit={handleLeadFormSubmit} className="space-y-3">
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  className="text-sm"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="text-sm"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  className="text-sm"
                />
                <textarea
                  name="message"
                  placeholder="Any specific questions?"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-sm text-white placeholder-gray-400"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <Button type="submit" size="sm" variant="primary">
                    Submit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowLeadForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointment Form */}
        {showAppointmentForm && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-100 px-4 py-3 rounded-lg max-w-sm">
              <h4 className="font-semibold mb-2">Schedule a viewing</h4>
              <form onSubmit={handleAppointmentFormSubmit} className="space-y-3">
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  className="text-sm"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="text-sm"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  required
                  className="text-sm"
                />
                <Input
                  name="preferredDate"
                  type="date"
                  required
                  className="text-sm"
                />
                <select
                  name="preferredTime"
                  required
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Any special requests?"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-sm text-white placeholder-gray-400"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <Button type="submit" size="sm" variant="primary">
                    Schedule
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowAppointmentForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-slate-700 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            variant="primary"
            size="sm"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot; 