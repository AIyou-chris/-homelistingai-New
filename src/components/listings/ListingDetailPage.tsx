import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Listing, ListingPhoto, AgentProfile } from '../../types';
import * as listingService from '../../services/listingService';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import { MapPinIcon, CurrencyDollarIcon, HomeIcon, ArrowsPointingOutIcon, Cog6ToothIcon, ChatBubbleLeftEllipsisIcon, PencilSquareIcon, PhotoIcon, MapIcon, UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await listingService.getListingById(id);
          if (data) {
            setListing(data);
          } else {
            setError('Listing not found.');
          }
        } catch (err) {
          console.error("Failed to fetch listing details:", err);
          setError('Failed to load listing details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchListing();
    } else {
      setError('No listing ID provided.');
      setIsLoading(false);
    }
  }, [id]);

  const formatPrice = (price?: number) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  const isAgent = user?.id === listing?.agentId;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center text-red-400 p-8">
        {error || 'Listing not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Photo Gallery */}
      <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={listing.photos[selectedPhotoIndex]?.url || `https://via.placeholder.com/1200x675/777/fff?text=${listing.title}`}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        {listing.photos.length > 1 && (
          <div className="grid grid-cols-6 gap-2 p-4">
            {listing.photos.map((photo: ListingPhoto, index: number) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden ${
                  selectedPhotoIndex === index ? 'ring-2 ring-sky-500' : ''
                }`}
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-100">{listing.title}</h1>
              {isAgent && (
                <Link to={`/listings/edit/${listing.id}`}>
                  <Button variant="secondary" size="sm">
                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                    Edit Listing
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-gray-300 mb-6">
              <div className="flex items-start">
                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Price</span>
                  <span className="text-xl font-semibold">{formatPrice(listing.price)}</span>
                </div>
              </div>
              <div className="flex items-start">
                <HomeIcon className="h-6 w-6 mr-2 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Beds/Baths</span>
                  <span className="text-xl font-semibold">{listing.bedrooms} bed / {listing.bathrooms} bath</span>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowsPointingOutIcon className="h-6 w-6 mr-2 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Sqft</span>
                  <span className="text-xl font-semibold">{listing.squareFeet}</span>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-6 w-6 mr-2 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-400">Location</span>
                  <span className="text-xl font-semibold">{listing.city}, {listing.state}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-300">{listing.description}</p>
              
              {listing.customDescription && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-4">Agent's Notes</h2>
                  <p className="text-gray-300">{listing.customDescription}</p>
                </>
              )}

              {listing.specialFeatures && listing.specialFeatures.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-4">Special Features</h2>
                  <ul className="list-disc list-inside text-gray-300">
                    {listing.specialFeatures.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}

              {listing.moreInformation && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-4">More Information</h2>
                  <p className="text-gray-300">{listing.moreInformation}</p>
                </>
              )}
            </div>
          </div>

          {/* Map */}
          {listing.latitude && listing.longitude && (
            <div className="bg-slate-800 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapIcon className="h-6 w-6 mr-2 text-sky-400" />
                Location
              </h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${listing.latitude},${listing.longitude}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Agent Info) */}
        <div className="space-y-8">
          {listing.agent && (
            <div className="bg-slate-800 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <UserCircleIcon className="h-6 w-6 mr-2 text-sky-400" />
                Agent Information
              </h2>
              
              <div className="flex items-center mb-6">
                {listing.agent.headshotUrl ? (
                  <img
                    src={listing.agent.headshotUrl}
                    alt={listing.agent.companyName || 'Agent'}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mr-4">
                    <UserCircleIcon className="h-12 w-12 text-slate-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {listing.agent.companyName || 'Agent'}
                  </h3>
                  {listing.agent.phone && (
                    <p className="text-gray-300">{listing.agent.phone}</p>
                  )}
                  {listing.agent.email && (
                    <p className="text-gray-300">{listing.agent.email}</p>
                  )}
                </div>
              </div>

              {listing.agent.website && (
                <a
                  href={listing.agent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sky-400 hover:text-sky-300 mb-4"
                >
                  Visit Website
                </a>
              )}

              <Button variant="primary" className="w-full">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" />
                Contact Agent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage; 