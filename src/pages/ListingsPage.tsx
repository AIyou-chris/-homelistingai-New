import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as listingService from '../services/listingService';
import ListingCard from '../components/listings/ListingCard';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { PlusCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

// Demo listings for demo dashboard
const demoListings: Listing[] = [
  {
    id: 'demo-1',
    title: 'Beautiful 3-Bedroom Home on Oak Street',
    address: '123 Oak Street, Beverly Hills, CA 90210',
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 2200,
    description: 'Stunning modern home with open floor plan, updated kitchen, and beautiful backyard. Perfect for families looking for comfort and style.',
    image_urls: ['/slider1.png', '/slider2.png', '/slider3.png'],
    status: 'active',
    agent_id: 'demo-agent',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    property_type: 'Single Family',
    lot_size: 0.25,
    year_built: 2018
  },
  {
    id: 'demo-2',
    title: 'Luxury Condo with City Views',
    address: '456 Pine Avenue, Los Angeles, CA 90001',
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    square_footage: 1500,
    description: 'Sophisticated condo with panoramic city views, high-end finishes, and resort-style amenities. Ideal for professionals or investors.',
    image_urls: ['/slider4.png', '/slider5.png', '/slider6.png'],
    status: 'active',
    agent_id: 'demo-agent',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    property_type: 'Condo',
    lot_size: 0.1,
    year_built: 2020
  },
  {
    id: 'demo-3',
    title: 'Charming Family Home on Maple Drive',
    address: '789 Maple Drive, Pasadena, CA 91101',
    price: 950000,
    bedrooms: 4,
    bathrooms: 3,
    square_footage: 2800,
    description: 'Spacious family home with excellent schools nearby, large yard, and plenty of room to grow. Perfect for growing families.',
    image_urls: ['/slider7.png', '/slider1.png', '/slider2.png'],
    status: 'draft',
    agent_id: 'demo-agent',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    property_type: 'Single Family',
    lot_size: 0.35,
    year_built: 2015
  }
];

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if we're in demo mode
  const isDemoMode = window.location.pathname.includes('demo-dashboard');

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (isDemoMode) {
          // Use demo listings for demo dashboard
          setListings(demoListings);
        } else if (user) {
          const userListings = await listingService.getAllListings(user.id);
          setListings(userListings);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError('Failed to load your listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [user, isDemoMode]);

  const handleEdit = (id: string) => {
    // Navigate to an edit page, or open a modal
    console.log("Edit listing:", id);
    navigate(`/listings/edit/${id}`); // Assuming an edit route like /listings/edit/:id
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
        <Link to="/listings/new">
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
          <Link to="/listings/new" className="mt-4 inline-block">
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
