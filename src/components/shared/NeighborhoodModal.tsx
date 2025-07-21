import React, { useState, useEffect } from 'react';
import { neighborhoodService, NeighborhoodData, NeighborhoodParams } from '../../services/neighborhoodService';
import LoadingSpinner from './LoadingSpinner';

interface NeighborhoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

const NeighborhoodModal: React.FC<NeighborhoodModalProps> = ({
  isOpen,
  onClose,
  address,
  latitude,
  longitude,
  city,
  state
}) => {
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'transportation' | 'demographics'>('overview');

  useEffect(() => {
    if (isOpen && !neighborhoodData) {
      fetchNeighborhoodData();
    }
  }, [isOpen]);

  const fetchNeighborhoodData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params: NeighborhoodParams = {
        address,
        latitude,
        longitude,
        city,
        state
      };
      
      const data = await neighborhoodService.getNeighborhoodData(params);
      setNeighborhoodData(data);
    } catch (err) {
      setError('Failed to load neighborhood data');
      console.error('Neighborhood data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="px-6 py-6 max-h-[calc(90vh-60px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Neighborhood Insights</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-triangle text-2xl text-red-500 mb-2"></i>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={fetchNeighborhoodData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {neighborhoodData && !isLoading && (
            <>
              {/* Neighborhood Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">{neighborhoodData.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{neighborhoodData.description}</p>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
                  { id: 'amenities', label: 'Amenities', icon: 'fas fa-store' },
                  { id: 'transportation', label: 'Transport', icon: 'fas fa-bus' },
                  { id: 'demographics', label: 'Demographics', icon: 'fas fa-users' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <i className={tab.icon}></i>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <OverviewTab neighborhoodData={neighborhoodData} />
                )}
                
                {activeTab === 'amenities' && (
                  <AmenitiesTab neighborhoodData={neighborhoodData} />
                )}
                
                {activeTab === 'transportation' && (
                  <TransportationTab neighborhoodData={neighborhoodData} />
                )}
                
                {activeTab === 'demographics' && (
                  <DemographicsTab neighborhoodData={neighborhoodData} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ neighborhoodData: NeighborhoodData }> = ({ neighborhoodData }) => {
  return (
    <div className="space-y-6">
      {/* Walkability Scores */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4">Walkability Scores</h5>
        <div className="space-y-3">
          <ScoreCard
            score={neighborhoodData.walkScore}
            title="Walk Score"
            description={neighborhoodData.walkScoreDescription}
            icon="fas fa-walking"
            color="text-green-600"
          />
          <ScoreCard
            score={neighborhoodData.transitScore}
            title="Transit Score"
            description="Public transportation access"
            icon="fas fa-bus"
            color="text-blue-600"
          />
          <ScoreCard
            score={neighborhoodData.bikeScore}
            title="Bike Score"
            description="Bicycle-friendly area"
            icon="fas fa-bicycle"
            color="text-orange-600"
          />
        </div>
      </div>

      {/* Safety & Crime */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4">Safety & Crime</h5>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Crime Rating</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              neighborhoodData.crimeRating === 'Low' ? 'bg-green-100 text-green-700' :
              neighborhoodData.crimeRating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {neighborhoodData.crimeRating}
            </span>
          </div>
          {neighborhoodData.safetyScore && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Safety Score</span>
              <span className="text-sm font-medium text-gray-900">{neighborhoodData.safetyScore}/100</span>
            </div>
          )}
        </div>
      </div>

      {/* Market Data */}
      {neighborhoodData.marketData.averageHomePrice && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-4">Market Data</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Avg Home Price</p>
              <p className="font-semibold text-gray-900">
                ${neighborhoodData.marketData.averageHomePrice?.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Price per Sq Ft</p>
              <p className="font-semibold text-gray-900">
                ${neighborhoodData.marketData.pricePerSqFt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Highlights & Drawbacks */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4">Neighborhood Insights</h5>
        
        {neighborhoodData.highlights.length > 0 && (
          <div className="mb-4">
            <h6 className="text-sm font-medium text-green-700 mb-2">Highlights</h6>
            <div className="space-y-1">
              {neighborhoodData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <i className="fas fa-check text-green-500"></i>
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {neighborhoodData.drawbacks.length > 0 && (
          <div className="mb-4">
            <h6 className="text-sm font-medium text-orange-700 mb-2">Considerations</h6>
            <div className="space-y-1">
              {neighborhoodData.drawbacks.map((drawback, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <i className="fas fa-info-circle text-orange-500"></i>
                  <span className="text-gray-700">{drawback}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {neighborhoodData.bestFor.length > 0 && (
          <div>
            <h6 className="text-sm font-medium text-blue-700 mb-2">Best For</h6>
            <div className="flex flex-wrap gap-2">
              {neighborhoodData.bestFor.map((group, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Amenities Tab Component
const AmenitiesTab: React.FC<{ neighborhoodData: NeighborhoodData }> = ({ neighborhoodData }) => {
  const amenityCategories = [
    { key: 'restaurants', title: 'Restaurants', icon: 'fas fa-utensils', color: 'text-red-500' },
    { key: 'shopping', title: 'Shopping', icon: 'fas fa-shopping-bag', color: 'text-purple-500' },
    { key: 'parks', title: 'Parks & Recreation', icon: 'fas fa-tree', color: 'text-green-500' },
    { key: 'schools', title: 'Schools', icon: 'fas fa-graduation-cap', color: 'text-blue-500' },
    { key: 'healthcare', title: 'Healthcare', icon: 'fas fa-heartbeat', color: 'text-pink-500' },
    { key: 'entertainment', title: 'Entertainment', icon: 'fas fa-film', color: 'text-yellow-500' }
  ];

  return (
    <div className="space-y-6">
      {amenityCategories.map((category) => {
        const amenities = neighborhoodData.nearbyAmenities[category.key as keyof typeof neighborhoodData.nearbyAmenities];
        
        return (
          <div key={category.key}>
            <div className="flex items-center gap-2 mb-3">
              <i className={`${category.icon} ${category.color}`}></i>
              <h5 className="font-semibold text-gray-900">{category.title}</h5>
            </div>
            
            {amenities && amenities.length > 0 ? (
              <div className="space-y-2">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{amenity.name}</p>
                      <p className="text-xs text-gray-600">{amenity.distance}</p>
                    </div>
                    {amenity.rating && (
                      <div className="flex items-center gap-1">
                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                        <span className="text-xs text-gray-600">{amenity.rating}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No {category.title.toLowerCase()} found nearby</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Transportation Tab Component
const TransportationTab: React.FC<{ neighborhoodData: NeighborhoodData }> = ({ neighborhoodData }) => {
  const getTransitIcon = (type: string) => {
    switch (type) {
      case 'bus': return 'fas fa-bus';
      case 'train': return 'fas fa-train';
      case 'subway': return 'fas fa-subway';
      case 'light_rail': return 'fas fa-tram';
      default: return 'fas fa-route';
    }
  };

  const getTransitColor = (type: string) => {
    switch (type) {
      case 'bus': return 'text-blue-500';
      case 'train': return 'text-green-500';
      case 'subway': return 'text-red-500';
      case 'light_rail': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Transit Scores */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4">Transit Scores</h5>
        <div className="space-y-3">
          <ScoreCard
            score={neighborhoodData.transitScore}
            title="Transit Score"
            description="Public transportation access"
            icon="fas fa-bus"
            color="text-blue-600"
          />
          <ScoreCard
            score={neighborhoodData.bikeScore}
            title="Bike Score"
            description="Bicycle-friendly area"
            icon="fas fa-bicycle"
            color="text-orange-600"
          />
        </div>
      </div>

      {/* Public Transit Options */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4">Public Transit</h5>
        {neighborhoodData.publicTransit.length > 0 ? (
          <div className="space-y-3">
            {neighborhoodData.publicTransit.map((transit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <i className={`${getTransitIcon(transit.type)} ${getTransitColor(transit.type)} text-lg`}></i>
                  <div>
                    <p className="font-medium text-gray-900">{transit.name}</p>
                    <p className="text-xs text-gray-600">{transit.distance} • {transit.frequency}</p>
                    {transit.route && (
                      <p className="text-xs text-gray-500">{transit.route}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No public transit options found nearby</p>
        )}
      </div>
    </div>
  );
};

// Demographics Tab Component
const DemographicsTab: React.FC<{ neighborhoodData: NeighborhoodData }> = ({ neighborhoodData }) => {
  return (
    <div className="space-y-6">
      {/* Demographics Overview */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4">Demographics</h5>
        <div className="grid grid-cols-2 gap-4">
          {neighborhoodData.demographics.population && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Population</p>
              <p className="font-semibold text-gray-900">
                {neighborhoodData.demographics.population.toLocaleString()}
              </p>
            </div>
          )}
          
          {neighborhoodData.demographics.medianAge && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Median Age</p>
              <p className="font-semibold text-gray-900">
                {neighborhoodData.demographics.medianAge} years
              </p>
            </div>
          )}
          
          {neighborhoodData.demographics.medianIncome && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Median Income</p>
              <p className="font-semibold text-gray-900">
                ${neighborhoodData.demographics.medianIncome.toLocaleString()}
              </p>
            </div>
          )}
          
          {neighborhoodData.demographics.homeOwnershipRate && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Home Ownership</p>
              <p className="font-semibold text-gray-900">
                {neighborhoodData.demographics.homeOwnershipRate}%
              </p>
            </div>
          )}
          
          {neighborhoodData.demographics.averageHouseholdSize && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Avg Household Size</p>
              <p className="font-semibold text-gray-900">
                {neighborhoodData.demographics.averageHouseholdSize}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Market Data */}
      {neighborhoodData.marketData.averageHomePrice && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-4">Market Data</h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Average Home Price</span>
              <span className="font-semibold text-gray-900">
                ${neighborhoodData.marketData.averageHomePrice.toLocaleString()}
              </span>
            </div>
            
            {neighborhoodData.marketData.pricePerSqFt && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Price per Sq Ft</span>
                <span className="font-semibold text-gray-900">
                  ${neighborhoodData.marketData.pricePerSqFt}
                </span>
              </div>
            )}
            
            {neighborhoodData.marketData.daysOnMarket && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Days on Market</span>
                <span className="font-semibold text-gray-900">
                  {neighborhoodData.marketData.daysOnMarket} days
                </span>
              </div>
            )}
            
            {neighborhoodData.marketData.inventoryLevel && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Inventory Level</span>
                <span className="font-semibold text-gray-900">
                  {neighborhoodData.marketData.inventoryLevel}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Score Card Component
const ScoreCard: React.FC<{
  score: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}> = ({ score, title, description, icon, color }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
          <i className={`${icon} ${color}`}></i>
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</p>
        <p className="text-xs text-gray-500">out of 100</p>
      </div>
    </div>
  );
};

export default NeighborhoodModal; 