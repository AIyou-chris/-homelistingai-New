import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyMap from '../components/map/PropertyMap';
import MapFilters, { FilterState } from '../components/map/MapFilters';
import { Listing } from '../types';
import { ArrowLeft, Filter, List } from 'lucide-react';

const MapSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    squareFootage: [0, 10000]
  });

  // Sample listings for the map
  const sampleListings: Listing[] = [
    {
      id: '1',
      agent_id: 'agent1',
      title: 'Modern Downtown Condo',
      description: 'Beautiful modern condo in the heart of downtown with amazing city views.',
      address: '123 Main Street, Los Angeles, CA',
      price: 850000,
      property_type: 'Condo',
      status: 'Active',
      bedrooms: 2,
      bathrooms: 2,
      square_footage: 1200,
      image_urls: ['/slider1.png'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      agent_id: 'agent1',
      title: 'Family Home in Suburbs',
      description: 'Spacious family home with large backyard and excellent schools nearby.',
      address: '456 Oak Avenue, Beverly Hills, CA',
      price: 1200000,
      property_type: 'Single-Family Home',
      status: 'Active',
      bedrooms: 4,
      bathrooms: 3,
      square_footage: 2800,
      image_urls: ['/slider2.png'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      agent_id: 'agent1',
      title: 'Luxury Penthouse',
      description: 'Stunning penthouse with panoramic views and high-end finishes.',
      address: '789 Sunset Boulevard, West Hollywood, CA',
      price: 2500000,
      property_type: 'Condo',
      status: 'Active',
      bedrooms: 3,
      bathrooms: 3.5,
      square_footage: 2200,
      image_urls: ['/slider3.png'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      agent_id: 'agent1',
      title: 'Charming Bungalow',
      description: 'Cozy bungalow with character and a beautiful garden.',
      address: '321 Maple Drive, Santa Monica, CA',
      price: 950000,
      property_type: 'Single-Family Home',
      status: 'Active',
      bedrooms: 3,
      bathrooms: 2,
      square_footage: 1600,
      image_urls: ['/slider4.png'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      agent_id: 'agent1',
      title: 'Investment Property',
      description: 'Great investment opportunity with rental income potential.',
      address: '654 Pine Street, Culver City, CA',
      price: 750000,
      property_type: 'Multi-Family',
      status: 'Active',
      bedrooms: 6,
      bathrooms: 4,
      square_footage: 3200,
      image_urls: ['/slider5.png'],
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  // Filter listings based on active filters
  const filteredListings = useMemo(() => {
    return sampleListings.filter(listing => {
      // Price range filter
      if (listing.price < activeFilters.priceRange[0] || listing.price > activeFilters.priceRange[1]) {
        return false;
      }

      // Property type filter
      if (activeFilters.propertyType.length > 0 && !activeFilters.propertyType.includes(listing.property_type)) {
        return false;
      }

      // Bedrooms filter
      if (activeFilters.bedrooms.length > 0 && !activeFilters.bedrooms.some(bed => listing.bedrooms >= bed)) {
        return false;
      }

      // Bathrooms filter
      if (activeFilters.bathrooms.length > 0 && !activeFilters.bathrooms.some(bath => listing.bathrooms >= bath)) {
        return false;
      }

      // Square footage filter
      if (listing.square_footage && (listing.square_footage < activeFilters.squareFootage[0] || listing.square_footage > activeFilters.squareFootage[1])) {
        return false;
      }

      return true;
    });
  }, [sampleListings, activeFilters]);

  const handleListingClick = (listing: Listing) => {
    // Navigate to listing detail page
    navigate(`/listing/${listing.id}`);
  };

  const handleMapClick = (coordinates: [number, number]) => {
    console.log('Map clicked at:', coordinates);
    // Could open a modal to add a new listing or show area info
  };

  const handleFiltersChange = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const hasActiveFilters = () => {
    return activeFilters.propertyType.length > 0 ||
           activeFilters.bedrooms.length > 0 ||
           activeFilters.bathrooms.length > 0 ||
           activeFilters.priceRange[1] < 5000000 ||
           activeFilters.squareFootage[1] < 10000;
  };

  return (
    <div className="relative h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/demo')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Map Search</h1>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFilters(true)}
              className={`p-2 rounded-lg transition-colors ${
                hasActiveFilters() 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowList(!showList)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="pt-16 h-full">
        <PropertyMap
          listings={filteredListings}
          onListingClick={handleListingClick}
          onMapClick={handleMapClick}
          initialViewState={{
            longitude: -118.2437,
            latitude: 34.0522,
            zoom: 11
          }}
          height="100%"
          showSearch={true}
          showControls={true}
        />
      </div>

      {/* List View Overlay */}
      {showList && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-96 overflow-y-auto z-30">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Properties ({filteredListings.length})
              </h3>
              <button
                onClick={() => setShowList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {filteredListings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No properties match your current filters.</p>
                <button
                  onClick={() => setShowFilters(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Adjust filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => handleListingClick(listing)}
                    className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.image_urls?.[0] ? (
                        <img
                          src={listing.image_urls[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {listing.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {listing.address}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{listing.bedrooms} beds</span>
                          <span>{listing.bathrooms} baths</span>
                          <span>{listing.square_footage?.toLocaleString()} sqft</span>
                        </div>
                        <div className="font-semibold text-blue-600">
                          ${listing.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Modal */}
      <MapFilters
        onFiltersChange={handleFiltersChange}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};

export default MapSearchPage; 