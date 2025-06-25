import React, { useState, useEffect } from 'react';
import WalkScoreService, { WalkScoreResponse } from '../services/walkScoreService';
import GeocodingService from '../services/geocodingService';

export function PropertyInfo() {
  return (
    <div style={{
      background: '#fff',
      padding: 24,
      borderRadius: 16,
      margin: '24px auto',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      maxWidth: 600,
      width: '90%',
      position: 'relative',
    }}>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>2847 Sunset Boulevard</div>
      <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>$1,200,000</div>
      <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 12 }}>Los Angeles, CA 90026</div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
        <div><span style={{ fontWeight: 600 }}>4</span> Beds</div>
        <div><span style={{ fontWeight: 600 }}>3</span> Baths</div>
        <div><span style={{ fontWeight: 600 }}>2,400</span> Sq Ft</div>
      </div>
      <div style={{ color: '#444', fontSize: 15, lineHeight: 1.6 }}>
        Beautiful modern home in the heart of Silver Lake. This stunning property features an open floor plan, gourmet kitchen, and breathtaking city views. Perfect for entertaining with a spacious backyard and modern amenities throughout.
      </div>
    </div>
  );
}

// New Neighborhood Information Component
export function NeighborhoodInfo() {
  const [walkScoreData, setWalkScoreData] = useState<WalkScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalkScore = async () => {
      try {
        const address = "2847 Sunset Boulevard, Los Angeles, CA 90026";
        
        // Try to get coordinates from geocoding service first
        let coordinates = GeocodingService.getDemoCoordinates(address);
        
        if (!coordinates) {
          // Fallback to geocoding API if not in demo coordinates
          coordinates = await GeocodingService.getCoordinates(address);
        }
        
        if (coordinates) {
          const data = await WalkScoreService.getWalkScore(
            coordinates.latitude, 
            coordinates.longitude, 
            address
          );
          setWalkScoreData(data);
        } else {
          throw new Error('Could not get coordinates for address');
        }
      } catch (error) {
        console.error('Failed to fetch Walk Score data:', error);
        // Use mock data as fallback
        setWalkScoreData({
          walkscore: 92,
          transit_score: 85,
          bike_score: 78,
          walk_description: "Walker's Paradise",
          transit_description: "Excellent Transit",
          bike_description: "Very Bikeable"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWalkScore();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm sm:p-6">
      <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Neighborhood Information</h3>
      
      {/* School District */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          Schools
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">School District</span>
            <span className="text-sm font-medium text-gray-900">Los Angeles Unified</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Elementary School</span>
            <span className="text-sm font-medium text-gray-900">Micheltorena Street (9/10)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Middle School</span>
            <span className="text-sm font-medium text-gray-900">Thomas Starr King (8/10)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">High School</span>
            <span className="text-sm font-medium text-gray-900">John Marshall (7/10)</span>
          </div>
        </div>
      </div>

      {/* Transportation */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 3m3-3l3 3m0 0v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4m6 0h6m-6 0l-3-3m3 3l3-3" />
          </svg>
          Transportation
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Metro Station</span>
            <span className="text-sm font-medium text-gray-900">0.3 miles (Vermont/Sunset)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Bus Lines</span>
            <span className="text-sm font-medium text-gray-900">2, 302, 754</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Freeway Access</span>
            <span className="text-sm font-medium text-gray-900">US-101 (0.8 miles)</span>
          </div>
        </div>
      </div>

      {/* Local Amenities */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Local Amenities
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Coffee Shops (5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Restaurants (12)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Grocery Store (0.2 mi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Park (0.4 mi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Gym (0.3 mi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Library (0.6 mi)</span>
          </div>
        </div>
      </div>

      {/* Safety & Demographics */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Safety & Demographics
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Crime Rating</span>
            <span className="text-sm font-medium text-green-600">Low (6/10)</span>
          </div>
          {loading ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Walk Score</span>
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : walkScoreData ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Walk Score</span>
                <span className="text-sm font-medium text-gray-900">{walkScoreData.walkscore} ({walkScoreData.walk_description})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transit Score</span>
                <span className="text-sm font-medium text-gray-900">{walkScoreData.transit_score} ({walkScoreData.transit_description})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bike Score</span>
                <span className="text-sm font-medium text-gray-900">{walkScoreData.bike_score} ({walkScoreData.bike_description})</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Walk Score</span>
                <span className="text-sm font-medium text-gray-900">92 (Walker's Paradise)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transit Score</span>
                <span className="text-sm font-medium text-gray-900">85 (Excellent)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bike Score</span>
                <span className="text-sm font-medium text-gray-900">78 (Very Bikeable)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Market Trends */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Market Trends
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Median Home Price</span>
            <span className="text-sm font-medium text-gray-900">$1,150,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price per Sq Ft</span>
            <span className="text-sm font-medium text-gray-900">$479</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Days on Market</span>
            <span className="text-sm font-medium text-gray-900">18 days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Market Trend</span>
            <span className="text-sm font-medium text-green-600">↗️ Rising</span>
          </div>
        </div>
      </div>
    </div>
  );
} 