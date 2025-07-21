import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Phone, Mail, ExternalLink } from 'lucide-react';
import { smartyService, SmartyPropertyData } from '@/services/smartyService';

interface SchoolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const SchoolsModal: React.FC<SchoolsModalProps> = ({ isOpen, onClose, address }) => {
  const [propertyData, setPropertyData] = useState<SmartyPropertyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && address) {
      fetchSchoolData();
    }
  }, [isOpen, address]);

  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await smartyService.getPropertyData(address);
      setPropertyData(data);
    } catch (err) {
      setError('Failed to load school information');
      console.error('Error fetching school data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSchoolRatingColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSchoolRatingText = (rating?: number) => {
    if (!rating) return 'N/A';
    if (rating >= 8) return 'Excellent';
    if (rating >= 6) return 'Good';
    return 'Fair';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 mb-4 bg-white rounded-t-3xl shadow-2xl animate-slide-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">School Information</h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchSchoolData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {propertyData && !loading && (
            <div className="space-y-6">
              {/* School District */}
              {propertyData.schoolDistrict && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">School District</h4>
                  <p className="text-blue-800">{propertyData.schoolDistrict}</p>
                </div>
              )}

              {/* Elementary School */}
              {propertyData.elementarySchool && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Elementary School</h4>
                      <p className="text-gray-600 text-sm">{propertyData.elementarySchool}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getSchoolRatingColor(propertyData.schoolRatings?.elementary)}`} />
                      <span className={`text-sm font-medium ${getSchoolRatingColor(propertyData.schoolRatings?.elementary)}`}>
                        {propertyData.schoolRatings?.elementary || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>0.5 miles away</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Rating: {getSchoolRatingText(propertyData.schoolRatings?.elementary)}
                  </p>
                </div>
              )}

              {/* Middle School */}
              {propertyData.middleSchool && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Middle School</h4>
                      <p className="text-gray-600 text-sm">{propertyData.middleSchool}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getSchoolRatingColor(propertyData.schoolRatings?.middle)}`} />
                      <span className={`text-sm font-medium ${getSchoolRatingColor(propertyData.schoolRatings?.middle)}`}>
                        {propertyData.schoolRatings?.middle || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>1.2 miles away</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Rating: {getSchoolRatingText(propertyData.schoolRatings?.middle)}
                  </p>
                </div>
              )}

              {/* High School */}
              {propertyData.highSchool && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">High School</h4>
                      <p className="text-gray-600 text-sm">{propertyData.highSchool}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getSchoolRatingColor(propertyData.schoolRatings?.high)}`} />
                      <span className={`text-sm font-medium ${getSchoolRatingColor(propertyData.schoolRatings?.high)}`}>
                        {propertyData.schoolRatings?.high || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>2.1 miles away</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Rating: {getSchoolRatingText(propertyData.schoolRatings?.high)}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{propertyData.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{propertyData.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Footage:</span>
                    <span className="font-medium">{propertyData.squareFootage?.toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => window.open('https://www.greatschools.org', '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">More School Info</span>
                </button>
                <button 
                  onClick={() => window.open('https://www.schooldigger.com', '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">School Ratings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolsModal; 