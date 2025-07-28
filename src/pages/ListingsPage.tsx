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
  const { user, isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Loading listings for real agent...');
      console.log('👤 Current user:', user);
      console.log('👤 User ID:', user?.id);
      
      try {
        if (user) {
          console.log('📡 Fetching real listings from API for user:', user.id);
          const userListings = await listingService.getAgentListings(user.id);
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

  // Refresh listings when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('🔄 Page became visible, refreshing listings...');
        const fetchListings = async () => {
          try {
            const userListings = await listingService.getAgentListings(user.id);
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
    </div>
  );
};

export default ListingsPage;
