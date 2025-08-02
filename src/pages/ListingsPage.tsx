import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as listingService from '../services/listingService';
import ListingCard from '../components/listings/ListingCard';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { PlusCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

// No demo listings - this is for real agents only

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Loading listings for real agent...');
      console.log('👤 Current user:', user);
      console.log('👤 User ID:', user?.id);
      console.log('📧 User email:', user?.email);
      
      try {
        if (user) {
          // Use the same agent_id logic as the save function
          const agentId = user?.id || user?.email || 'dev-user-id';
          console.log('🏷️ Using agent_id for fetching:', agentId);
          console.log('📡 Fetching real listings from API for user:', agentId);
          const userListings = await listingService.getAgentListings(agentId);
          console.log('✅ Loaded user listings:', userListings.length);
          console.log('📋 Listings data:', userListings);
          setListings(userListings);
        } else {
          console.log('❌ No user found, showing empty state');
          setListings([]);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError('Failed to load your listings. Please try again later.');
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  // Check for success messages and onboarding
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trialSuccess = urlParams.get('trial');
    const listingCreated = urlParams.get('listing');
    
    if (trialSuccess === 'success' && listingCreated === 'created') {
      setShowSuccessMessage(true);
      setShowOnboarding(true);
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, []);

  // Refresh listings when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('🔄 Page became visible, refreshing listings...');
        const fetchListings = async () => {
          try {
            const agentId = user?.id || user?.email || 'dev-user-id';
            const userListings = await listingService.getAgentListings(agentId);
            setListings(userListings);
          } catch (err) {
            console.error("Failed to refresh listings:", err);
          }
        };
        fetchListings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const handleEdit = (id: string) => {
    // Navigate to an edit page, or open a modal
    console.log("Edit listing:", id);
    navigate(`/dashboard/listings/edit/${id}`); // Use the correct dashboard route
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        setIsLoading(true); // Potentially use a different loading state for delete
        await listingService.deleteListing(id);
        setListings(prevListings => prevListings.filter(l => l.id !== id));
      } catch (err) {
        console.error("Failed to delete listing:", err);
        setError('Failed to delete listing. Please try again.');
      } finally {
        setIsLoading(false);
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
        <Link to="/build-ai-listing">
          <Button variant="primary" leftIcon={<PlusCircleIcon className="h-5 w-5" />}>
            Add New Listing
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-10 bg-slate-800 rounded-lg shadow">
          <ListBulletIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-200">No listings yet.</h2>
          <p className="text-gray-400 mt-2">Start by adding your first property.</p>
          <Link to="/build-ai-listing" className="mt-4 inline-block">
             <Button variant="primary" size="lg">Create Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Welcome to HomeListingAI!</h3>
              <p className="text-sm opacity-90">Your listing has been saved and your 7-day trial is active.</p>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard!</h2>
              <p className="text-gray-600 mt-2">Let's get you set up for success with your new AI listing.</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🎉 Your Listing is Live!</h3>
                <p className="text-blue-800 text-sm">Your AI listing has been created and is ready to generate leads. You can find it in the "Listings" tab.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📧 Set Up Email</h4>
                  <p className="text-gray-600 text-sm mb-3">Configure your email settings to receive lead notifications.</p>
                  <button 
                    onClick={() => navigate('/dashboard/settings')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Go to Settings →
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🤖 AI Assistant</h4>
                  <p className="text-gray-600 text-sm mb-3">Customize your AI assistant's personality and responses.</p>
                  <button 
                    onClick={() => navigate('/dashboard/ai-assistant')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Configure AI →
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Analytics</h4>
                  <p className="text-gray-600 text-sm mb-3">Track your listing performance and lead generation.</p>
                  <button 
                    onClick={() => navigate('/dashboard/analytics')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    View Analytics →
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Lead Management</h4>
                  <p className="text-gray-600 text-sm mb-3">Manage and follow up with your generated leads.</p>
                  <button 
                    onClick={() => navigate('/dashboard/leads')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Manage Leads →
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">⏰ Trial Reminder</h3>
                <p className="text-yellow-800 text-sm">You have 7 days to explore all features. Upgrade to keep your listings and leads after the trial ends.</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowOnboarding(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Skip for Now
              </button>
              <button 
                onClick={() => {
                  setShowOnboarding(false);
                  navigate('/dashboard/settings');
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set Up Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
