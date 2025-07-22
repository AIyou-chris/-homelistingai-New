import React, { useState, useEffect } from 'react';
import { Send, BrainCircuit, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import * as knowledgeBaseService from '../../services/knowledgeBaseService';

interface AIChatDemoProps {
  listingId: string;
  listingTitle?: string;
}

const AIChatDemo: React.FC<AIChatDemoProps> = ({ listingId, listingTitle = 'this property' }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [knowledgeBaseEntries, setKnowledgeBaseEntries] = useState<knowledgeBaseService.KnowledgeBaseEntry[]>([]);
  const [isLoadingKB, setIsLoadingKB] = useState(true);

  // Load knowledge base data when component mounts
  useEffect(() => {
    const loadKnowledgeBase = async () => {
      try {
        const entries = await knowledgeBaseService.getKnowledgeBaseForListing(listingId);
        setKnowledgeBaseEntries(entries);
      } catch (error) {
        console.error('Error loading knowledge base:', error);
      } finally {
        setIsLoadingKB(false);
      }
    };

    loadKnowledgeBase();
  }, [listingId]);

  const findRelevantAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Search through FAQ content first
    const faqEntry = knowledgeBaseEntries.find(entry => entry.entry_type === 'faq');
    if (faqEntry) {
      const faqContent = faqEntry.content;
      const qaPairs = faqContent.split('\n\n').filter(pair => pair.includes('Q:') && pair.includes('A:'));
      
      for (const pair of qaPairs) {
        const [questionPart, answerPart] = pair.split('A:');
        const q = questionPart.replace('Q:', '').trim().toLowerCase();
        
        if (lowerQuestion.includes(q.split(' ')[0]) || q.includes(lowerQuestion.split(' ')[0])) {
          return answerPart.trim();
        }
      }
    }

    // Search through other entries
    for (const entry of knowledgeBaseEntries) {
      const content = entry.content.toLowerCase();
      const title = entry.title.toLowerCase();
      
      if (lowerQuestion.includes('price') && content.includes('price')) {
        const priceMatch = content.match(/price:?\s*\$?([\d,]+)/i);
        if (priceMatch) return `The current asking price is $${priceMatch[1]}.`;
      }
      
      if (lowerQuestion.includes('bedroom') && content.includes('bedroom')) {
        const bedroomMatch = content.match(/bedroom:?\s*(\d+)/i);
        if (bedroomMatch) return `This property has ${bedroomMatch[1]} bedrooms.`;
      }
      
      if (lowerQuestion.includes('bathroom') && content.includes('bathroom')) {
        const bathroomMatch = content.match(/bathroom:?\s*(\d+)/i);
        if (bathroomMatch) return `This property has ${bathroomMatch[1]} bathrooms.`;
      }
      
      if (lowerQuestion.includes('square') && content.includes('square')) {
        const sqftMatch = content.match(/square\s*footage:?\s*([\d,]+)/i);
        if (sqftMatch) return `The property is ${sqftMatch[1]} square feet.`;
      }
      
      if (lowerQuestion.includes('hoa') && content.includes('hoa')) {
        const hoaMatch = content.match(/hoa\s*fees:?\s*\$?([\d,]+)/i);
        if (hoaMatch) return `The monthly HOA fees are $${hoaMatch[1]}.`;
      }
      
      if (lowerQuestion.includes('tax') && content.includes('tax')) {
        const taxMatch = content.match(/annual\s*property\s*taxes:?\s*\$?([\d,]+)/i);
        if (taxMatch) return `The annual property taxes are $${taxMatch[1]}.`;
      }
      
      if (lowerQuestion.includes('school') && content.includes('school')) {
        const schoolMatch = content.match(/school\s*district:?\s*([^\n]+)/i);
        if (schoolMatch) return `This property is in the ${schoolMatch[1]} school district.`;
      }
      
      if (lowerQuestion.includes('showing') && content.includes('showing')) {
        const showingMatch = content.match(/showing\s*instructions:?\s*([^\n]+)/i);
        if (showingMatch) return `To schedule a showing: ${showingMatch[1]}`;
      }
      
      if (lowerQuestion.includes('contact') && content.includes('contact')) {
        const contactMatch = content.match(/phone:?\s*([^\n]+)/i);
        if (contactMatch) return `You can contact the agent at ${contactMatch[1]}.`;
      }
    }

    // Default responses based on question type
    if (lowerQuestion.includes('feature') || lowerQuestion.includes('amenity')) {
      return "This property has many great features! I can tell you about the interior features, exterior amenities, utilities, and more. What specific aspect would you like to know about?";
    }
    
    if (lowerQuestion.includes('neighborhood') || lowerQuestion.includes('area')) {
      return "I have detailed information about the neighborhood, including schools, transportation, local amenities, and crime ratings. What would you like to know?";
    }
    
    if (lowerQuestion.includes('financial') || lowerQuestion.includes('cost')) {
      return "I can provide information about the price, taxes, HOA fees, rental potential, and price history. What financial aspect interests you?";
    }

    return "I have comprehensive information about this property including features, pricing, neighborhood details, showing information, and more. What would you like to know?";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { 
      sender: 'user', 
      text: userMessage, 
      timestamp: new Date().toISOString() 
    }]);
    setLoading(true);
    setInput('');

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = findRelevantAnswer(userMessage);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiResponse, 
        timestamp: new Date().toISOString() 
      }]);
      setLoading(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const suggestedQuestions = [
    "What is the current price?",
    "How many bedrooms and bathrooms?",
    "What are the HOA fees?",
    "What school district is this in?",
    "How can I schedule a showing?",
    "What are the key features?",
    "Tell me about the neighborhood"
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Property Assistant</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ask me anything about {listingTitle}
            </p>
          </div>
        </div>
        {isLoadingKB && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading property information...
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-sm text-gray-500 mb-4">
                I have comprehensive information about this property. Ask me anything!
              </p>
              
              {/* Suggested Questions */}
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-lg px-4 py-2 ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                <div className={`text-xs text-gray-400 mt-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about the property, neighborhood, showing info..."
              disabled={loading || isLoadingKB}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim() || isLoadingKB}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {knowledgeBaseEntries.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {knowledgeBaseEntries.length} knowledge entries loaded
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatDemo; 