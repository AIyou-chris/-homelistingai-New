import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import * as listingService from '../services/listingService';
import * as leadService from '../services/leadService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import ChatBot from '../components/shared/ChatBot';
import { 
  HomeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  CalendarIcon,
  QrCodeIcon,
  ShareIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await listingService.getListingById(id);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing details');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleLeadCapture = async (lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    source: 'chat';
  }) => {
    try {
      // Use mock service for now (you can switch to real service later)
      await leadService.createMockLead({
        ...lead,
        listingId: listing?.id
      });
      
      console.log('Lead captured successfully:', lead);
      // You could show a success notification here
    } catch (error) {
      console.error('Error capturing lead:', error);
      // You could show an error notification here
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Listing not found'}</p>
          <Button onClick={() => navigate('/listings')}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        <p className="text-xl text-gray-600 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2" />
          {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Images */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">${listing.price?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{listing.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{listing.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{listing.sqft?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            {listing.specialFeatures && listing.specialFeatures.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Special Features</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.specialFeatures.map((feature, index) => (
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

            {listing.knowledgeBase && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                <p className="text-gray-300 italic text-sm whitespace-pre-wrap">{listing.knowledgeBase}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Take Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="ghost" className="w-full" leftIcon={<QrCodeIcon className="h-5 w-5" />}>Generate/View QR</Button>
              <Button variant="ghost" className="w-full" leftIcon={<ShareIcon className="h-5 w-5" />}>Share Listing</Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Chat Bot */}
          <ChatBot listing={listing} onLeadCapture={handleLeadCapture} />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full" leftIcon={<CalendarIcon className="h-5 w-5" />}>
                Schedule Viewing
              </Button>
              <Button variant="secondary" className="w-full" leftIcon={<UserGroupIcon className="h-5 w-5" />}>
                Contact Agent
              </Button>
            </div>
          </div>

          {/* QR Code */}
          {listing.qrCodeUrl && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">QR Code</h3>
              <img src={listing.qrCodeUrl} alt="Listing QR Code" className="mx-auto h-32 w-32 rounded"/>
              <p className="text-sm text-gray-600 mt-2">Scan to share this listing</p>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link to="/listings">
          <Button variant="ghost">&larr; Back to Listings</Button>
        </Link>
      </div>
    </div>
  );
};

export default ListingDetailPage;
