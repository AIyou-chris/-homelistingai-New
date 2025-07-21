import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Play, 
  Settings, 
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Check,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as listingService from '@/services/listingService';

interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  description: string;
  image_urls: string[];
  agent_id: string;
}

const ListingDemoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        const listingData = await listingService.getListingById(id);
        setListing(listingData);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleGoLive = async () => {
    if (!listing) return;
    
    try {
      // Update listing status to live
      await listingService.updateListing(listing.id, { status: 'Live' });
      setIsLive(true);
      
      // Show success message
      alert('Your AI listing is now live! 🎉');
    } catch (error) {
      console.error('Error going live:', error);
      alert('Failed to go live. Please try again.');
    }
  };

  const handleEdit = () => {
    navigate(`/listings/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your AI listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Listing not found</p>
          <Button onClick={() => navigate('/build-ai-listing')} className="mt-4">
            Create New Listing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">AI Listing Demo</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/build-ai-listing')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Build Your Own
              </Button>
              <Button
                onClick={() => navigate('/build-ai-listing')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-4 h-4" />
                Start Building
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Attention-Grabbing Banner */}
        <div className="mb-8">
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8">
              {/* Feature Cards */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">AI-Powered Responses</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Lead Capture</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">24/7 Availability</span>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">From Curious to Customer in 4 Steps</h2>
                <p className="text-gray-700 mb-6">
                  <span className="font-bold text-green-600">No signup required!</span> Try the magic first, see what you're missing, then decide if you want the superpowers.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/build-ai-listing')}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Building Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-blue-200 to-purple-200">
                {listing.image_urls && listing.image_urls.length > 0 ? (
                  <div className="relative h-full">
                    {/* Simple 3-image carousel */}
                    <div className="flex h-full">
                      {listing.image_urls.slice(0, 3).map((image, index) => (
                        <div key={index} className="flex-1 relative">
                          <img 
                            src={image} 
                            alt={`${listing.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Image counter */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      1 of 3
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <p>Property Image</p>
                    </div>
                  </div>
                )}
                
                {/* Demo Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    SHOWCASE
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{listing.title}</h2>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {listing.address}
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ${listing.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                        <Bed className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{listing.bedrooms}</p>
                      <p className="text-xs text-gray-600">Bedrooms</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                        <Bath className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{listing.bathrooms}</p>
                      <p className="text-xs text-gray-600">Bathrooms</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                        <Square className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{listing.square_footage?.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Sq Ft</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{listing.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Chat Demo */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                    <p className="text-sm text-gray-600">Basic demo mode</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "Hi! I'm your AI assistant for this property. I can answer basic questions about the home, 
                    price, and features. What would you like to know?"
                  </p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.open('https://www.homelistingai.com', '_blank')}
                  >
                    "Tell me about this property"
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.open('https://www.homelistingai.com', '_blank')}
                  >
                    "What's the price?"
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.open('https://www.homelistingai.com', '_blank')}
                  >
                    "How many bedrooms?"
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Assistant</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Basic Demo</p>
                      <p className="text-sm text-gray-600">Simple responses</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open('https://www.homelistingai.com', '_blank')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Demo Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Basic AI responses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Property details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Simple interface</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Explore Dashboard CTA */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Ready to Build Your Own?</h3>
                  <p className="text-sm text-purple-700 mb-4">
                    Create your own AI-powered listing in just a few minutes
                  </p>
                  <Button
                    onClick={() => window.open('https://www.homelistingai.com', '_blank')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Building Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Go Live CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">🚀 Go Live & Capture Leads!</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Upgrade to full AI agent with lead capture, CRM, and 24/7 availability
                  </p>
                  <Button
                    onClick={() => navigate('/checkout?listingId=' + listing.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Go Live - $59/mo
                  </Button>
                  <p className="text-xs text-blue-600 mt-2">Cancel anytime • 60-day guarantee</p>
                </div>
              </CardContent>
            </Card>

            {/* Build Your Own CTA */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-900 mb-2">Ready to Build Your Own?</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Create your own AI listing in just a few minutes
                  </p>
                  <Button
                    onClick={() => navigate('/build-ai-listing')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Build Your Own
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDemoPage; 