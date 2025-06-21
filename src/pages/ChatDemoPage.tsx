import React from 'react';
import ChatBot from '../components/shared/ChatBot';
import { Listing } from '../types';

const ChatDemoPage: React.FC = () => {
  // Sample listing for demo
  const sampleListing: Listing = {
    id: 'demo-1',
    title: 'Beautiful 3-Bedroom Family Home',
    description: 'This stunning family home features an open-concept layout, modern kitchen with granite countertops, spacious bedrooms, and a beautifully landscaped backyard. Perfect for families looking for comfort and style.',
    address: '123 Main Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200,
    propertyType: 'Single Family',
    status: 'active',
    agentId: 'demo-agent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    photos: [],
    specialFeatures: ['Granite Countertops', 'Hardwood Floors', 'Updated Kitchen', 'Large Backyard'],
    knowledgeBase: 'This property was recently renovated and includes energy-efficient appliances. The neighborhood is family-friendly with excellent schools nearby. The home has been well-maintained by the current owners for the past 8 years.'
  };

  const handleLeadCapture = (lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    source: 'chat';
  }) => {
    console.log('Demo lead captured:', lead);
    alert(`Demo: Lead captured!\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nMessage: ${lead.message}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chat Bot Demo</h1>
          <p className="text-gray-600">
            Test the real estate AI assistant with this sample property
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Sample Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{sampleListing.title}</h3>
                <p className="text-gray-600">{sampleListing.address}, {sampleListing.city}, {sampleListing.state} {sampleListing.zipCode}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-sky-600">${sampleListing.price?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sky-600">{sampleListing.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sky-600">{sampleListing.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700 text-sm">{sampleListing.description}</p>
              </div>

              {sampleListing.specialFeatures && (
                <div>
                  <h4 className="font-semibold mb-2">Special Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {sampleListing.specialFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Agent Knowledge Base</h4>
                <p className="text-gray-700 text-sm italic">{sampleListing.knowledgeBase}</p>
              </div>
            </div>
          </div>

          {/* Chat Bot */}
          <div>
            <ChatBot listing={sampleListing} onLeadCapture={handleLeadCapture} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">Try these conversation starters:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• "Tell me more about this property"</p>
              <p>• "What are the special features?"</p>
              <p>• "I'm interested in scheduling a viewing"</p>
              <p>• "What's the neighborhood like?"</p>
              <p>• "Can you help me with financing options?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemoPage; 