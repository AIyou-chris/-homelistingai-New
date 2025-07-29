import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface VoiceOptions {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number; // 0.25 to 4.0
  pitch?: number; // -20 to 20
}

export interface PropertyInfo {
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  features: string[];
  neighborhood: string;
  schoolDistrict: string;
  hoaFees?: string;
  propertyTax?: string;
  yearBuilt?: number;
  lotSize?: string;
  additionalInfo?: string;
}

// Default system prompt for real estate AI assistant
const DEFAULT_SYSTEM_PROMPT = `You are HomeListingAI, a professional, friendly, and knowledgeable real estate AI assistant. Your role is to help potential buyers learn about properties and assist real estate agents in providing excellent service.

CORE PERSONALITY:
- Professional yet warm and approachable
- Enthusiastic about helping people find their perfect home
- Knowledgeable about real estate, neighborhoods, and property details
- Patient and thorough in answering questions
- Always honest and transparent about property information

RESPONSE STYLE:
- Keep responses conversational and engaging
- Use bullet points when listing multiple features
- Include specific details when available
- Ask follow-up questions to better understand buyer needs
- Be encouraging about scheduling viewings or contacting the agent

PROPERTY INFORMATION:
When discussing a specific property, always reference the provided property details and be specific about:
- Address and location
- Price and value
- Features and amenities
- Neighborhood highlights
- School information
- HOA details (if applicable)
- Property taxes and costs

NEVER:
- Make up information not provided
- Pressure buyers to make quick decisions
- Provide financial advice beyond basic property costs
- Share agent contact information unless specifically asked

ALWAYS:
- Encourage questions and engagement
- Suggest scheduling a viewing for interested buyers
- Provide accurate, helpful information
- Maintain a positive, professional tone`;

// Voice configuration options
export const VOICE_OPTIONS: Record<string, VoiceOptions> = {
  'Professional Male': {
    voice: 'onyx',
    speed: 1.0,
    pitch: 0
  },
  'Professional Female': {
    voice: 'nova',
    speed: 1.0,
    pitch: 0
  },
  'Friendly Male': {
    voice: 'echo',
    speed: 1.1,
    pitch: 2
  },
  'Friendly Female': {
    voice: 'shimmer',
    speed: 1.1,
    pitch: 2
  },
  'Enthusiastic': {
    voice: 'fable',
    speed: 1.2,
    pitch: 5
  },
  'Calm & Patient': {
    voice: 'alloy',
    speed: 0.9,
    pitch: -2
  }
};

export async function askOpenAI(
  messages: OpenAIMessage[], 
  propertyInfo?: PropertyInfo,
  options?: {
    temperature?: number;
    max_tokens?: number;
    customPrompt?: string;
  }
) {
  // Check if API key is configured
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    // Return mock AI response when OpenAI is not configured
    return getMockAIResponse(messages, propertyInfo);
  }

  // Create property-specific system prompt
  let systemPrompt = options?.customPrompt || DEFAULT_SYSTEM_PROMPT;
  
  if (propertyInfo) {
    systemPrompt += `\n\nCURRENT PROPERTY DETAILS:
Address: ${propertyInfo.address}
Price: ${propertyInfo.price}
Bedrooms: ${propertyInfo.bedrooms}
Bathrooms: ${propertyInfo.bathrooms}
Square Feet: ${propertyInfo.squareFeet}
Description: ${propertyInfo.description}
Features: ${propertyInfo.features.join(', ')}
Neighborhood: ${propertyInfo.neighborhood}
School District: ${propertyInfo.schoolDistrict}
${propertyInfo.hoaFees ? `HOA Fees: ${propertyInfo.hoaFees}` : ''}
${propertyInfo.propertyTax ? `Property Tax: ${propertyInfo.propertyTax}` : ''}
${propertyInfo.yearBuilt ? `Year Built: ${propertyInfo.yearBuilt}` : ''}
${propertyInfo.lotSize ? `Lot Size: ${propertyInfo.lotSize}` : ''}
${propertyInfo.additionalInfo ? `Additional Info: ${propertyInfo.additionalInfo}` : ''}

When answering questions, always reference these specific property details and be enthusiastic about this particular home.`;
  }

  // Add system message to the beginning
  const messagesWithSystem = [
    { role: 'system' as const, content: systemPrompt },
    ...messages
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: messagesWithSystem,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('OpenAI API key is invalid. Please check your configuration.');
    } else if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again in a moment.');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`OpenAI API error: ${error.message || 'Unknown error'}`);
    }
  }
}

// Mock AI response function for when OpenAI is not configured
function getMockAIResponse(messages: OpenAIMessage[], propertyInfo?: PropertyInfo): string {
  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage.content.toLowerCase();
  
  // Context-aware responses based on user input
  if (userInput.includes('help') || userInput.includes('assist')) {
    return "I'm here to help you with your listing! I can assist with property details, pricing strategies, marketing tips, and optimizing your listing for better results. What specific area would you like help with?";
  }
  
  if (userInput.includes('price') || userInput.includes('pricing')) {
    return "For pricing strategy, I recommend analyzing comparable properties in your area, considering market trends, and highlighting unique features that justify your price point. Would you like me to help you identify key selling points for this property?";
  }
  
  if (userInput.includes('photo') || userInput.includes('image')) {
    return "Great photos are crucial! I suggest using high-quality, well-lit images that showcase the best features of each room. Consider professional photography for the best results. Have you uploaded all your property photos yet?";
  }
  
  if (userInput.includes('description') || userInput.includes('write')) {
    return "For compelling descriptions, focus on unique features, lifestyle benefits, and emotional appeal. Highlight what makes this property special. Would you like me to help you craft a compelling description?";
  }
  
  if (userInput.includes('feature') || userInput.includes('amenity')) {
    return "Make sure to highlight all the key features that buyers value most - like updated kitchens, outdoor spaces, energy efficiency, or unique architectural details. What are the standout features of this property?";
  }
  
  if (userInput.includes('market') || userInput.includes('trend')) {
    return "I can help you stay informed about market trends and competitive analysis. This helps with pricing and marketing strategies. Would you like me to help you research comparable properties?";
  }
  
  if (userInput.includes('ai') || userInput.includes('personality')) {
    return "I can help you configure the AI personality for your listing! This includes voice settings, knowledge base setup, and response style. Would you like to customize how I interact with potential buyers?";
  }
  
  if (userInput.includes('knowledge') || userInput.includes('upload')) {
    return "Uploading documents to the AI knowledge base helps me provide more accurate and detailed responses about your property and expertise. You can upload floor plans, neighborhood guides, and property documents.";
  }
  
  // Default helpful response
  return "I'm your AI assistant for this listing! I can help you optimize your property presentation, answer questions about features, assist with pricing strategies, and guide you through the listing setup process. What would you like to work on?";
}

// Function to get AI voice response using ElevenLabs
export async function getAIVoiceResponse(text: string, voiceOptions: VoiceOptions) {
  const { generateElevenLabsSpeech } = await import('./elevenlabsService');
  return generateElevenLabsSpeech(text);
}

// Function to transcribe voice input using OpenAI Whisper
export async function transcribeVoice(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    
    return response.data.text;
  } catch (error) {
    console.error('OpenAI Whisper Error:', error);
    throw new Error('Unable to transcribe voice input. Please try again.');
  }
}

// Sample property data for testing
export const SAMPLE_PROPERTY: PropertyInfo = {
  address: "123 Oak Street, Austin, TX 78701",
  price: "$599,000",
  bedrooms: 3,
  bathrooms: 2.5,
  squareFeet: 2200,
  description: "Beautiful modern home in the heart of Austin's most desirable neighborhood. This stunning property features an open concept design with high-end finishes throughout.",
  features: [
    "Open concept living area",
    "Gourmet kitchen with granite countertops",
    "Master suite with walk-in closet",
    "Hardwood floors throughout",
    "Energy-efficient windows",
    "Attached 2-car garage",
    "Large backyard with patio"
  ],
  neighborhood: "Downtown Austin",
  schoolDistrict: "Austin Independent School District",
  hoaFees: "$150/month",
  propertyTax: "$8,500/year",
  yearBuilt: 2020,
  lotSize: "0.25 acres",
  additionalInfo: "Walking distance to restaurants, shopping, and public transportation. Excellent investment opportunity with strong rental potential."
}; 