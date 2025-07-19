import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as listingService from '../services/listingService';
import ListingCard from '../components/listings/ListingCard';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { PlusCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Crown, Zap, CheckCircle, X } from 'lucide-react';

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [aiTrainingSuccess, setAiTrainingSuccess] = useState<string | null>(null);
  const { user, demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize demo detection
  const isDemo = useMemo(() => location.pathname.includes('/demo-dashboard'), [location.pathname]);

  // Quick demo login for testing
  const handleDemoLogin = async () => {
    try {
      await demoLogin();
      console.log('✅ Demo login successful!');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  // Handle AI training success and show pricing
  const handleAiTrainingSuccess = (listingId: string) => {
    setAiTrainingSuccess(listingId);
    setShowPricingModal(true);
  };

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      
      if (isDemo) {
        setListings([
          {
            id: 'demo-listing-1',
            agent_id: 'demo-agent-1',
            title: '123 Oak Street',
            description: 'Beautiful 3 bed, 2 bath home with modern upgrades and a spacious backyard. Move-in ready!',
            address: '123 Oak Street, Springfield, USA',
            price: 499000,
            property_type: 'Single-Family Home',
            status: 'Active',
            bedrooms: 3,
            bathrooms: 2,
            square_footage: 1850,
            lot_size: 0.25,
            year_built: 2015,
            image_urls: ['/slider1.png'],
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-listing-2',
            agent_id: 'demo-agent-1',
            title: '456 Maple Avenue',
            description: 'Stunning 4 bed, 3 bath home with a chef\'s kitchen, home office, and a large deck for entertaining.',
            address: '456 Maple Avenue, Springfield, USA',
            price: 675000,
            property_type: 'Single-Family Home',
            status: 'Active',
            bedrooms: 4,
            bathrooms: 3,
            square_footage: 2400,
            lot_size: 0.35,
            year_built: 2018,
            image_urls: ['/slider2.png'],
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-listing-3',
            agent_id: 'demo-agent-1',
            title: '789 Pine Lane',
            description: 'Chic downtown condo with 2 bedrooms, 2 baths, floor-to-ceiling windows, and city views.',
            address: '789 Pine Lane, Springfield, USA',
            price: 389000,
            property_type: 'Condo',
            status: 'Active',
            bedrooms: 2,
            bathrooms: 2,
            square_footage: 1100,
            lot_size: 0,
            year_built: 2020,
            image_urls: ['/slider3.png'],
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-listing-4',
            agent_id: 'demo-agent-1',
            title: '1010 Birch Boulevard',
            description: 'Luxury 5 bed, 4.5 bath estate with pool, home theater, and smart home features throughout.',
            address: '1010 Birch Boulevard, Springfield, USA',
            price: 1250000,
            property_type: 'Estate',
            status: 'Active',
            bedrooms: 5,
            bathrooms: 4.5,
            square_footage: 4200,
            lot_size: 1.2,
            year_built: 2022,
            image_urls: ['/slider4.png'],
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-listing-5',
            agent_id: 'demo-agent-1',
            title: '2020 Cedar Court',
            description: 'Modern 2 bed, 2 bath townhouse with rooftop terrace, EV charging, and walkable to shops.',
            address: '2020 Cedar Court, Springfield, USA',
            price: 525000,
            property_type: 'Townhouse',
            status: 'Active',
            bedrooms: 2,
            bathrooms: 2,
            square_footage: 1500,
            lot_size: 0.1,
            year_built: 2021,
            image_urls: ['/slider5.png'],
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-listing-6',
            agent_id: 'demo-agent-1',
            title: '3030 Willow Way',
            description: 'Charming 3 bed, 2 bath cottage with garden, sunroom, and original hardwood floors.',
            address: '3030 Willow Way, Springfield, USA',
            price: 415000,
            property_type: 'Cottage',
            status: 'Active',
            bedrooms: 3,
            bathrooms: 2,
            square_footage: 1350,
            lot_size: 0.18,
            year_built: 1948,
            image_urls: ['/slider6.png'],
            created_at: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
        return;
      }
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('🔍 Fetching listings for user:', user.id);
        const userListings = await listingService.getListingsForAgent(user.id);
        console.log('📋 Found listings:', userListings);
        console.log('📊 Total listings found:', userListings.length);
        
        // Only add demo listing if no real listings exist
        if (userListings.length === 0) {
          userListings.unshift({
            id: 'demo-listing-1',
            agent_id: user.id,
            title: '🏠 Example: 123 Oak Street (Demo)',
            description: 'This is a demo listing to show you how your real listings will look. To create real listings, use the Property Builder below!',
            address: '123 Oak Street, Springfield, USA',
            price: 499000,
            property_type: 'Single-Family Home',
            status: 'Demo',
            bedrooms: 3,
            bathrooms: 2,
            square_footage: 1850,
            lot_size: 0.25,
            year_built: 2015,
            image_urls: ['/slider1.png'],
            created_at: new Date().toISOString(),
          });
        }
        setListings(userListings);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError('Failed to load your listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [user, isDemo]);

  const handleEdit = (id: string) => {
    // Check if it's a demo listing
    if (id.startsWith('demo-listing-')) {
      alert('This is a demo listing. To edit real listings, create one using the property builder!');
      return;
    }
    
    console.log("Opening property app for listing:", id);
    navigate(`/listings/app/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('demo-listing-')) {
      alert('Demo listings cannot be deleted. Create real listings to manage them!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        setIsDeleting(id);
        await listingService.deleteListing(id);
        setListings(prevListings => prevListings.filter(l => l.id !== id));
      } catch (err) {
        console.error("Failed to delete listing:", err);
        setError('Failed to delete listing. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6">


      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-100">My Listings</h1>
        <div className="flex gap-3">
          <Link to="/build-ai-listing">
            <Button variant="primary" leftIcon={<PlusCircleIcon className="h-5 w-5" />}>
              🚀 Build AI Listing
            </Button>
          </Link>

          <Link to="/listings/new">
            <Button variant="secondary" leftIcon={<PlusCircleIcon className="h-5 w-5" />}>
              Manual Upload
            </Button>
          </Link>
        </div>
      </div>



      {listings.length === 0 ? (
        <div className="text-center py-10 bg-slate-800 rounded-lg shadow">
          <ListBulletIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-200">No listings yet.</h2>
          <p className="text-gray-400 mt-2">Start by adding your first property.</p>
          <Link to="/listings/new" className="mt-4 inline-block">
             <Button variant="primary" size="lg">Create Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo Notice Banner */}
          {isDemo && (
            <div className="col-span-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-400 text-xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-blue-200">Demo Mode Active</h3>
                  <p className="text-blue-300 text-sm">These are example listings to show you how your real listings will look. Create your own listings to replace these!</p>
                </div>
              </div>
            </div>
          )}
          
          {listings.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard 
                listing={listing} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAiTrainingSuccess={handleAiTrainingSuccess}
              />
              {isDeleting === listing.id && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                    <LoadingSpinner size="sm" />
                    <span className="text-gray-700 font-medium">Deleting...</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pricing Modal - Appears after AI training success */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">🎉 AI Agent Created!</h2>
                </div>
                <p className="text-gray-600 text-lg">
                  Your AI agent is ready! Now unlock the full power to capture leads and close more deals.
                </p>
              </div>

              {/* Pricing Plans */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Demo Plan */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Demo</h3>
                    <div className="text-3xl font-bold text-gray-900 mt-2">$0</div>
                    <p className="text-gray-600 text-sm">30 minutes</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>1 AI Agent</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Full Chat Experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Mobile Preview</span>
                    </li>
                    <li className="flex items-center gap-2 text-red-400">
                      <X className="w-4 h-4" />
                      <span>⏰ Self-destructs in 30 min</span>
                    </li>
                    <li className="flex items-center gap-2 text-red-400">
                      <X className="w-4 h-4" />
                      <span>No lead capture</span>
                    </li>
                  </ul>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-blue-500 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      KEEP FOREVER
                    </span>
                  </div>
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">$59</div>
                    <p className="text-gray-600 text-sm">per listing/month</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>AI Agent Forever</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Lead Capture & CRM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Analytics Dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Custom Branding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>QR Codes & Mobile App</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>24/7 Availability</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowPricingModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Continue with Free
                </Button>
                <Button
                  onClick={() => navigate('/checkout')}
                  variant="primary"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>

              {/* Temporary Testing Buttons (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-500/30">
                  <h4 className="text-sm font-bold text-yellow-300 mb-2">🧪 Testing Options</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        // Go LIVE immediately
                        const keys = Object.keys(localStorage);
                        keys.forEach(key => {
                          if (key.startsWith('ai_config_')) {
                            try {
                              const config = JSON.parse(localStorage.getItem(key) || '{}');
                              if (config.is_demo) {
                                config.is_demo = false;
                                config.demo_expires_at = null;
                                localStorage.setItem(key, JSON.stringify(config));
                              }
                            } catch (error) {
                              console.error('Error updating AI config:', error);
                            }
                          }
                        });
                        setShowPricingModal(false);
                        alert('🎉 AI agent is now LIVE! Demo restrictions removed.');
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
                    >
                      🚀 Go LIVE
                    </button>
                    <button
                      onClick={() => {
                        // Stay in DEMO mode
                        const keys = Object.keys(localStorage);
                        keys.forEach(key => {
                          if (key.startsWith('ai_config_')) {
                            try {
                              const config = JSON.parse(localStorage.getItem(key) || '{}');
                              config.is_demo = true;
                              config.demo_expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();
                              localStorage.setItem(key, JSON.stringify(config));
                            } catch (error) {
                              console.error('Error updating AI config:', error);
                            }
                          }
                        });
                        setShowPricingModal(false);
                        alert('⏰ AI agent set to DEMO mode (30 minutes)!');
                      }}
                      className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium"
                    >
                      ⏰ Stay DEMO
                    </button>
                  </div>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setShowPricingModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
