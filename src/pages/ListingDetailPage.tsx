import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getListingById } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { MapPinIcon, Bed, Bath, Maximize, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        setError('Failed to fetch listing details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!listing) {
    return <div className="text-center mt-10">Listing not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-gray-600 flex items-center"><MapPinIcon className="w-4 h-4 mr-2" />{listing.address}</p>
        </div>
        <div className="text-3xl font-bold text-green-600">${listing.price.toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2">
          <img
            src={listing.image_urls[0]}
            alt={listing.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-2">
          {listing.image_urls.slice(1, 4).map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${listing.title} - view ${index + 2}`}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Property Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap mb-6">{listing.description}</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center p-4 border rounded-lg mb-6">
            <div>
              <p className="text-xl font-bold flex items-center justify-center"><Bed className="w-5 h-5 mr-2" />{listing.bedrooms}</p>
              <p className="text-gray-600">Bedrooms</p>
            </div>
            <div>
              <p className="text-xl font-bold flex items-center justify-center"><Bath className="w-5 h-5 mr-2" />{listing.bathrooms}</p>
              <p className="text-gray-600">Bathrooms</p>
            </div>
            <div>
              <p className="text-xl font-bold flex items-center justify-center"><Maximize className="w-5 h-5 mr-2" />{listing.square_footage.toLocaleString()}</p>
              <p className="text-gray-600">Sq. Ft.</p>
            </div>
            <div>
              <p className="text-xl font-bold flex items-center justify-center"><Building className="w-5 h-5 mr-2" />{listing.property_type}</p>
              <p className="text-gray-600">Type</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2">Key Features</h3>
          {listing.knowledge_base && typeof listing.knowledge_base === 'object' && (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {Object.entries(listing.knowledge_base).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {String(value)}</li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Request a Showing</h3>
            <form>
              <Input placeholder="Name" className="mb-2" />
              <Input placeholder="Email" type="email" className="mb-2" />
              <Input placeholder="Phone" type="tel" className="mb-4" />
              <Button className="w-full">Submit Request</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
