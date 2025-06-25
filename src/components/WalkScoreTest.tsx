import React, { useState } from 'react';
import WalkScoreService from '../services/walkScoreService';
import GeocodingService from '../services/geocodingService';

const WalkScoreTest: React.FC = () => {
  const [address, setAddress] = useState('2847 Sunset Boulevard, Los Angeles, CA 90026');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWalkScore = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get coordinates
      let coordinates = GeocodingService.getDemoCoordinates(address);
      
      if (!coordinates) {
        coordinates = await GeocodingService.getCoordinates(address);
      }

      if (!coordinates) {
        throw new Error('Could not get coordinates for address');
      }

      // Get Walk Score data
      const walkScoreData = await WalkScoreService.getWalkScore(
        coordinates.latitude,
        coordinates.longitude,
        address
      );

      setResult({
        coordinates,
        walkScoreData
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Walk Score API Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address:
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter an address to test"
        />
      </div>

      <button
        onClick={testWalkScore}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Testing...' : 'Test Walk Score API'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-green-800 font-medium mb-2">Success!</h3>
          
          <div className="space-y-2">
            <div>
              <strong>Coordinates:</strong>
              <p className="text-sm text-gray-600">
                Lat: {result.coordinates.latitude}, Lon: {result.coordinates.longitude}
              </p>
            </div>
            
            <div>
              <strong>Walk Score:</strong>
              <p className="text-sm text-gray-600">
                {result.walkScoreData.walkscore} - {result.walkScoreData.walk_description}
              </p>
            </div>
            
            {result.walkScoreData.transit_score && (
              <div>
                <strong>Transit Score:</strong>
                <p className="text-sm text-gray-600">
                  {result.walkScoreData.transit_score} - {result.walkScoreData.transit_description}
                </p>
              </div>
            )}
            
            {result.walkScoreData.bike_score && (
              <div>
                <strong>Bike Score:</strong>
                <p className="text-sm text-gray-600">
                  {result.walkScoreData.bike_score} - {result.walkScoreData.bike_description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkScoreTest; 