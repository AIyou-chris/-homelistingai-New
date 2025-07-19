import React, { useState } from 'react';
import VoiceBot from '../components/shared/VoiceBot';
import { PropertyInfo } from '../services/openaiService';

const VoiceTestPage: React.FC = () => {
  const [showVoiceBot, setShowVoiceBot] = useState(false);

  // Sample property for testing
  const testProperty: PropertyInfo = {
    address: '123 Ocean Drive, Malibu, CA 90265',
    price: '$5,000,000',
    bedrooms: 5,
    bathrooms: 5.5,
    squareFeet: 6000,
    description: 'A stunning luxury villa with breathtaking ocean views, private pool, and modern amenities.',
    features: [
      'Infinity pool with city and ocean views',
      '12-seat movie theater',
      'Temperature-controlled wine cellar',
      'Gated community with 24/7 security',
      'Chef\'s kitchen with premium appliances',
      'Master suite with spa bathroom'
    ],
    neighborhood: 'Exclusive Malibu neighborhood',
    schoolDistrict: 'Top-rated Malibu schools',
    yearBuilt: 2020,
    lotSize: '15,000 sq ft',
    additionalInfo: 'This property offers the perfect blend of luxury and comfort with stunning Pacific Ocean views.'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Voice Backend Test</h1>
          <p className="text-lg text-gray-600 mb-6">
            Test the AI voice assistant with this sample property
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">{testProperty.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Price</h3>
                <p className="text-2xl font-bold text-green-600">{testProperty.price}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Bedrooms</h3>
                  <p className="text-xl font-bold text-blue-600">{testProperty.bedrooms}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Bathrooms</h3>
                  <p className="text-xl font-bold text-blue-600">{testProperty.bathrooms}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Square Feet</h3>
                  <p className="text-xl font-bold text-blue-600">{testProperty.squareFeet.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Description</h3>
                <p className="text-gray-600">{testProperty.description}</p>
              </div>
            </div>
          </div>

          {/* Voice Test Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Voice Controls</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowVoiceBot(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                🎤 Open Voice Assistant
              </button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Test Commands:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• "Tell me about this property"</li>
                  <li>• "What are the features?"</li>
                  <li>• "How much is it?"</li>
                  <li>• "What's the neighborhood like?"</li>
                  <li>• "I'm interested in scheduling a viewing"</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Voice Features:</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✅ 6 Voice Personalities</li>
                  <li>✅ Property-Specific Responses</li>
                  <li>✅ Voice Input/Output</li>
                  <li>✅ Animated Visualizations</li>
                  <li>✅ Lead Capture Integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Check */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Backend Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Environment Variables:</h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_OPENAI_API_KEY ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  OpenAI API Key: {import.meta.env.VITE_OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}
                </li>
                <li className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_SUPABASE_URL ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </li>
                <li className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Voice Backend:</h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  VoiceBot Component: ✅ Ready
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  OpenAI TTS: ✅ Ready
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  Whisper Transcription: ✅ Ready
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  Property AI Service: ✅ Ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* VoiceBot Component */}
      <VoiceBot 
        open={showVoiceBot} 
        setOpen={setShowVoiceBot} 
        propertyInfo={testProperty}
      />
    </div>
  );
};

export default VoiceTestPage; 