import React, { useEffect, useRef, memo } from 'react';

// Declare Leaflet types for TypeScript
declare global {
  interface Window {
    L: any;
  }
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  showDirections?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = memo(({ 
  center = [34.0392, -118.6793], // Malibu coordinates
  zoom = 12,
  height = "256px",
  showDirections = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);

  useEffect(() => {
    console.log('LeafletMap: Starting initialization');
    
    const initMap = () => {
      if (!mapContainer.current) {
        console.log('No map container found');
        return;
      }

      if (!window.L) {
        console.log('Leaflet not loaded yet, waiting...');
        setTimeout(initMap, 100);
        return;
      }

      // Only create map if it doesn't exist
      if (!map.current) {
        try {
          console.log('Creating Leaflet map...');
          
          // Create map
          map.current = window.L.map(mapContainer.current).setView(center, zoom);

          // Add OpenStreetMap tiles
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map.current);

          // Add marker for property location
          marker.current = window.L.marker(center).addTo(map.current);
          
          // Add popup to marker (only shows when clicked)
          marker.current.bindPopup(`
            <div style="text-align: center; padding: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">🏖️ Luxury Villa</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                1247 Pacific Coast Highway<br>
                Malibu, CA 90265
              </p>
              <p style="margin: 10px 0 0 0; color: #059669; font-weight: bold;">
                $8.95M
              </p>
            </div>
          `);

          console.log('Leaflet map created successfully!');
          
        } catch (error) {
          console.error('Error creating Leaflet map:', error);
        }
      } else {
        // Map exists, just update view and marker position
        console.log('Updating existing map...');
        map.current.setView(center, zoom);
        if (marker.current) {
          marker.current.setLatLng(center);
        }
      }
    };

    // Start initialization
    initMap();

    // Cleanup only on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for updating view when props change
  useEffect(() => {
    if (map.current) {
      console.log('Updating map view to:', center, zoom);
      map.current.setView(center, zoom);
      if (marker.current) {
        marker.current.setLatLng(center);
      }
    }
  }, [center, zoom]);

  const getDirections = () => {
    const lat = center[0];
    const lng = center[1];
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Open Google Maps with directions
          const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}`;
          window.open(url, '_blank');
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback - open Google Maps without current location
          const url = `https://www.google.com/maps/place/${lat},${lng}`;
          window.open(url, '_blank');
        }
      );
    } else {
      // Fallback for browsers without geolocation
      const url = `https://www.google.com/maps/place/${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full space-y-4">
      <div 
        ref={mapContainer}
        className="w-full rounded-lg border-2 border-gray-200 bg-gray-100"
        style={{ height }}
      />
      
      {showDirections && (
        <div className="flex gap-2">
          <button
            onClick={getDirections}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-directions"></i>
            Get Directions
          </button>
          
          <button
            onClick={() => {
              const lat = center[0];
              const lng = center[1];
              const url = `https://maps.apple.com/?q=${lat},${lng}`;
              window.open(url, '_blank');
            }}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-map"></i>
            Apple Maps
          </button>
        </div>
      )}
    </div>
  );
});

export default LeafletMap; 