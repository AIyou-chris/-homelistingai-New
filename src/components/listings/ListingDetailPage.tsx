import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '@/services/listingService';
import { Listing, AgentProfile } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Edit,
  User,
  Phone,
  Mail,
  Building,
  Settings,
} from 'lucide-react';
import { getAgentProfile } from '@/services/agentService';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Log visit on page load (optional - don't fail if function not available)
  useEffect(() => {
    if (!id) return;
    const logVisit = async () => {
      try {
        // Get qr_code_id from URL if present
        const params = new URLSearchParams(window.location.search);
        const qr_code_id = params.get('qr');
        
        const response = await fetch('/functions/v1/log-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_id: id, qr_code_id }),
        });
        
        if (!response.ok) {
          console.log('⚠️ Visit logging not available (404) - this is normal in development');
        } else {
          console.log('✅ Visit logged successfully');
        }
      } catch (error) {
        console.log('⚠️ Visit logging failed - this is normal in development:', error);
      }
    };
    logVisit();
  }, [id]);

  useEffect(() => {
    const fetchListingData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const listingData = await getListingById(id);
        setListing(listingData);

        if (listingData?.agent_id) {
          const agentData = await getAgentProfile(listingData.agent_id);
          setAgent(agentData);
        }
      } catch (err) {
        setError('Failed to fetch listing details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListingData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error || !listing) {
    return <div className="text-center text-red-500 mt-10">{error || 'Listing not found.'}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-gray-600 flex items-center mt-1"><MapPin className="w-4 h-4 mr-2" />{listing.address}</p>
        </div>
        <div className="text-right">
            <div className="text-3xl font-bold text-green-600">${listing.price?.toLocaleString() || '0'}</div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <Link to={`/listings/app/${listing.id}`} className="text-sm text-blue-500 hover:underline flex items-center">
                <Edit className="w-4 h-4 mr-1" /> View App
              </Link>
              <Link to={`/listings/edit/${listing.id}`} className="text-sm text-gray-500 hover:underline flex items-center">
                <Settings className="w-4 h-4 mr-1" /> Edit Details
              </Link>
            </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
          <div className="md:col-span-2">
            <img 
              src={listing.image_urls?.[selectedPhotoIndex] || `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`} 
              alt={listing.title}
              className="w-full h-auto object-cover rounded-lg shadow-lg aspect-video"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`;
              }}
            />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
            {(listing.image_urls || []).slice(0, 3).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${listing.title} - view ${index + 1}`}
                className={`w-full h-auto object-cover rounded-lg cursor-pointer ${selectedPhotoIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPhotoIndex(index)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/200x150/777/fff?text=Photo+${index + 1}`;
                }}
              />
            ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center p-4 border rounded-lg mb-6">
              <div>
                <p className="text-xl font-bold flex items-center justify-center"><BedDouble className="w-5 h-5 mr-2" />{listing.bedrooms}</p>
                <p className="text-gray-600">Bedrooms</p>
              </div>
              <div>
                <p className="text-xl font-bold flex items-center justify-center"><Bath className="w-5 h-5 mr-2" />{listing.bathrooms}</p>
                <p className="text-gray-600">Bathrooms</p>
              </div>
              <div>
                <p className="text-xl font-bold flex items-center justify-center"><Maximize className="w-5 h-5 mr-2" />{listing.square_footage?.toLocaleString() || 'N/A'}</p>
                <p className="text-gray-600">Sq. Ft.</p>
              </div>
              <div>
                <p className="text-xl font-bold flex items-center justify-center"><Building className="w-5 h-5 mr-2" />{listing.property_type}</p>
                <p className="text-gray-600">Type</p>
              </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Property Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap mb-6">{listing.description}</p>
          
          {listing.knowledge_base && (
            <div>
              <h3 className="text-xl font-bold mb-2">More Information</h3>
              <div className="prose max-w-none text-gray-800">
                {typeof listing.knowledge_base === 'string'
                  ? <p>{listing.knowledge_base}</p>
                  : <ul>{Object.entries(listing.knowledge_base).map(([key, value]) => <li key={key}><strong>{key}:</strong> {String(value)}</li>)}</ul>}
              </div>
            </div>
          )}
        </div>
        
        {/* Agent Info */}
        {agent && (
          <div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={agent.avatar_url || 'https://via.placeholder.com/150'}
                  alt={agent.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-bold text-lg">{agent.name}</p>
                  {agent.company_name && <p className="text-gray-600 flex items-center"><Building className="w-4 h-4 mr-2" />{agent.company_name}</p>}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {agent.phone && <p className="flex items-center"><Phone className="w-4 h-4 mr-2" />{agent.phone}</p>}
                {agent.email && <p className="flex items-center"><Mail className="w-4 h-4 mr-2" />{agent.email}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage; 