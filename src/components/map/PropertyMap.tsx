import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Listing } from '../../types';
import { MapPin, Search, X, Home, Bed, Bath, DollarSign, Heart } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWljaHJpcyIsImEiOiJjbWNiYjMwbncwYzhrMmpwcThveDZtMnIxIn0.Fg8UQz1mniB1krrBbPrLhg';

interface PropertyMapProps {
  listings?: Listing[];
  onListingClick?: (listing: Listing) => void;
  onMapClick?: (coordinates: [number, number]) => void;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  height?: string;
  showSearch?: boolean;
  showControls?: boolean;
}

interface MapListing extends Listing {
  coordinates?: [number, number];
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  listings = [],
  onListingClick,
  onMapClick,
  initialViewState = {
    longitude: -118.2437,
    latitude: 34.0522,
    zoom: 10
  },
  height = '100vh',
  showSearch = true,
  showControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [popupInfo, setPopupInfo] = useState<MapListing | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapListings, setMapListings] = useState<MapListing[]>([]);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popup = useRef<mapboxgl.Popup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom
    });

    // Add navigation controls
    if (showControls) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-right');
    }

    // Handle map click
    map.current.on('click', (e) => {
      setPopupInfo(null);
      onMapClick?.(e.lngLat.toArray() as [number, number]);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialViewState, showControls, onMapClick]);

  // Geocode addresses to get coordinates for listings
  useEffect(() => {
    const geocodeListings = async () => {
      const listingsWithCoords = await Promise.all(
        listings.map(async (listing) => {
          try {
            // Try to geocode the address
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                listing.address
              )}.json?access_token=${MAPBOX_TOKEN}&limit=1`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              return { ...listing, coordinates: [lng, lat] as [number, number] };
            }
          } catch (error) {
            console.error('Geocoding error:', error);
          }
          return listing;
        })
      );
      
      setMapListings(listingsWithCoords.filter((listing): listing is MapListing => 
        'coordinates' in listing && listing.coordinates !== undefined
      ));
    };

    if (listings.length > 0) {
      geocodeListings();
    }
  }, [listings]);

  // Add markers to map
  useEffect(() => {
    if (!map.current || !mapListings.length) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    mapListings.forEach((listing) => {
      if (!listing.coordinates) return;

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'property-marker';
      markerEl.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            ${formatPrice(listing.price)}
          </div>
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(listing.coordinates)
        .addTo(map.current!);

      // Add click event
      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        setPopupInfo(listing);
        onListingClick?.(listing);
      });

      markers.current.push(marker);
    });
  }, [mapListings, onListingClick]);

  // Handle popup
  useEffect(() => {
    if (!map.current) return;

    if (popup.current) {
      popup.current.remove();
    }

    if (popupInfo && popupInfo.coordinates) {
      const popupEl = document.createElement('div');
      popupEl.className = 'property-popup-content';
      popupEl.innerHTML = `
        <div class="p-4">
          <div class="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
            ${popupInfo.image_urls?.[0] ? 
              `<img src="${popupInfo.image_urls[0]}" alt="${popupInfo.title}" class="w-full h-full object-cover" />` :
              `<div class="w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>`
            }
          </div>
          <h3 class="font-semibold text-gray-900 text-lg mb-2">${popupInfo.title}</h3>
          <div class="text-2xl font-bold text-blue-600 mb-3">${formatPrice(popupInfo.price)}</div>
          <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              ${popupInfo.bedrooms} beds
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              ${popupInfo.bathrooms} baths
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              ${popupInfo.square_footage?.toLocaleString()} sqft
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4">${popupInfo.address}</p>
          <div class="flex space-x-2">
            <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              View Details
            </button>
            <button class="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      popup.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      })
        .setLngLat(popupInfo.coordinates)
        .setDOMContent(popupEl)
        .addTo(map.current);

      // Add click handler to view details button
      const viewDetailsBtn = popupEl.querySelector('button');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
          onListingClick?.(popupInfo);
          setPopupInfo(null);
        });
      }
    }
  }, [popupInfo, onListingClick]);

  // Search for locations
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&types=place,address`
      );
      const data = await response.json();
      setSearchResults(data.features || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLocation]);

  // Handle search result selection
  const handleSearchResultClick = (result: any) => {
    const [lng, lat] = result.center;
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14
      });
    }
    setSearchQuery(result.place_name);
    setSearchResults([]);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative" style={{ height }}>
      {/* Search Bar */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-20">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Searching...</p>
                </div>
              ) : (
                <div>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{result.text}</div>
                      <div className="text-sm text-gray-600">{result.place_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Property Count */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2">
        <div className="text-sm font-medium text-gray-900">
          {mapListings.length} properties
        </div>
      </div>
    </div>
  );
};

export default PropertyMap; 