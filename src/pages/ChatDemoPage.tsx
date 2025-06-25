import React from 'react';
import ChatBot from '../components/shared/ChatBot';
import { Listing, PropertyType, ListingStatus } from '../types';

const ChatDemoPage: React.FC = () => {
  // Sample listing for demo
  const sampleListing: Listing = {
    id: 'demo-listing-1',
    agent_id: 'agent-123',
    title: 'Luxury Villa with Ocean View',
    description: 'A stunning villa with breathtaking ocean views, a private pool, and modern amenities.',
    address: '123 Ocean Drive, Malibu, CA 90265',
    price: 5000000,
    property_type: PropertyType.SINGLE_FAMILY,
    status: ListingStatus.ACTIVE,
    bedrooms: 5,
    bathrooms: 5.5,
    square_footage: 6000,
    image_urls: ['/placeholder.svg'],
    created_at: new Date().toISOString(),
    knowledge_base: `
      PROPERTY FEATURES:
      - Infinity pool with city and ocean views
      - 12-seat movie theater
      - Temperature-controlled wine cellar
      - Gated community with 24/7 security
      - Gourmet kitchen with premium appliances
      - Master suite with spa bathroom
      - Smart home automation system
      - 3-car garage with electric charging station

      NEIGHBORHOOD INFORMATION:
      School District: Santa Monica-Malibu Unified School District
      Elementary School: Point Dume Marine Science (9/10 rating)
      Middle School: Malibu Middle School (8/10 rating)
      High School: Malibu High School (9/10 rating)

      Transportation:
      - Pacific Coast Highway access (0.2 miles)
      - Malibu Pier (0.5 miles)
      - Bus routes: 534, 704
      - LAX Airport (25 miles)

      Local Amenities:
      - Malibu Country Mart (0.3 miles) - Shopping and dining
      - Malibu Lagoon State Beach (0.4 miles)
      - Pepperdine University (2 miles)
      - Malibu Village (0.6 miles) - Restaurants and shops
      - Malibu Library (1.2 miles)
      - Malibu Medical Center (1.5 miles)

      Safety & Demographics:
      - Crime Rating: Very Low (8/10)
      - Walk Score: 45 (Car-dependent)
      - Transit Score: 25 (Minimal transit)
      - Bike Score: 35 (Somewhat bikeable)

      Market Trends:
      - Median Home Price: $4,200,000
      - Price per Sq Ft: $700
      - Days on Market: 45 days
      - Market Trend: Stable with slight appreciation

      Property Taxes: $52,000/year
      HOA Fees: $850/month
      Showing Instructions: 24-hour notice required, gated access
      Contact: Sarah Johnson, (310) 555-0123, sarah@maliburealestate.com
    `
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
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{sampleListing.title}</h2>
                <p className="text-gray-600">{sampleListing.address}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${sampleListing.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{sampleListing.bedrooms} bds | {sampleListing.bathrooms} ba | {sampleListing.square_footage.toLocaleString()} sqft</p>
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
              <p>• "Tell me about schools nearby"</p>
              <p>• "What are the property taxes?"</p>
              <p>• "Can you help me with financing options?"</p>
              <p>• "What's the crime rate in this area?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemoPage; 