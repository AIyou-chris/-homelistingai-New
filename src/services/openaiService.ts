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
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Unable to get AI response. Please try again.');
  }
}

// Function to get AI voice response using OpenAI TTS
export async function getAIVoiceResponse(text: string, voiceOptions: VoiceOptions) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: text,
        voice: voiceOptions.voice,
        speed: voiceOptions.speed,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );
    
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('OpenAI TTS Error:', error);
    throw new Error('Unable to generate voice response. Please try again.');
  }
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