import React, { useState } from 'react';
import { X, Filter, DollarSign, Home, Bed, Bath } from 'lucide-react';

interface MapFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  propertyType: string[];
  bedrooms: number[];
  bathrooms: number[];
  squareFootage: [number, number];
}

const MapFilters: React.FC<MapFiltersProps> = ({ onFiltersChange, isOpen, onClose }) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    squareFootage: [0, 10000]
  });

  const propertyTypes = [
    'Single-Family Home',
    'Condo',
    'Townhouse',
    'Multi-Family',
    'Land',
    'Commercial'
  ];

  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const bathroomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter(t => t !== type)
      : [...filters.propertyType, type];
    updateFilters({ propertyType: newTypes });
  };

  const toggleBedrooms = (bedrooms: number) => {
    const newBedrooms = filters.bedrooms.includes(bedrooms)
      ? filters.bedrooms.filter(b => b !== bedrooms)
      : [...filters.bedrooms, bedrooms];
    updateFilters({ bedrooms: newBedrooms });
  };

  const toggleBathrooms = (bathrooms: number) => {
    const newBathrooms = filters.bathrooms.includes(bathrooms)
      ? filters.bathrooms.filter(b => b !== bathrooms)
      : [...filters.bathrooms, bathrooms];
    updateFilters({ bathrooms: newBathrooms });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, 5000000],
      propertyType: [],
      bedrooms: [],
      bathrooms: [],
      squareFootage: [0, 10000]
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Price Range
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilters({ 
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Property Type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => togglePropertyType(type)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.propertyType.includes(type)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Bed className="w-4 h-4 mr-2" />
              Bedrooms
            </h3>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((bedrooms) => (
                <button
                  key={bedrooms}
                  onClick={() => toggleBedrooms(bedrooms)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.bedrooms.includes(bedrooms)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {bedrooms}+
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Bath className="w-4 h-4 mr-2" />
              Bathrooms
            </h3>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((bathrooms) => (
                <button
                  key={bathrooms}
                  onClick={() => toggleBathrooms(bathrooms)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.bathrooms.includes(bathrooms)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {bathrooms}+
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters; 