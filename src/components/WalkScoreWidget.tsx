import React, { useState, useEffect } from 'react';
import { walkScoreService, WalkScoreData, WalkScoreParams } from '../services/walkScoreService';
import LoadingSpinner from './shared/LoadingSpinner';

interface WalkScoreWidgetProps {
  address: string;
  latitude: number;
  longitude: number;
  className?: string;
}

const WalkScoreWidget: React.FC<WalkScoreWidgetProps> = ({
  address,
  latitude,
  longitude,
  className = ""
}) => {
  const [walkScoreData, setWalkScoreData] = useState<WalkScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalkScore = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params: WalkScoreParams = {
          address,
          latitude,
          longitude,
          transit: true,
          bike: true
        };
        
        const data = await walkScoreService.getWalkScore(params);
        setWalkScoreData(data);
      } catch (err) {
        setError('Failed to load walkability data');
        console.error('WalkScore error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalkScore();
  }, [address, latitude, longitude]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error || !walkScoreData) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>Unable to load walkability data</p>
        </div>
      </div>
    );
  }

  const ScoreCard = ({ 
    score, 
    title, 
    description, 
    icon,
    color = "text-blue-600"
  }: {
    score: number;
    title: string;
    description: string;
    icon: string;
    color?: string;
  }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mr-4">
        <div className={`w-12 h-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center`}>
          <i className={`${icon} ${color} text-xl`}></i>
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-sm text-gray-600">/100</span>
        </div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i className="fas fa-walking text-blue-600"></i>
          Walkability Scores
        </h3>
        <a 
          href={walkScoreData.ws_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Powered by Walk Score
        </a>
      </div>

      <div className="space-y-4">
        {/* Walk Score */}
        <ScoreCard
          score={walkScoreData.walkscore}
          title="Walk Score"
          description={walkScoreData.description}
          icon="fas fa-walking"
          color={walkScoreService.getWalkScoreColor(walkScoreData.walkscore)}
        />

        {/* Transit Score */}
        {walkScoreData.transit && (
          <ScoreCard
            score={walkScoreData.transit.score}
            title="Transit Score"
            description={walkScoreData.transit.description}
            icon="fas fa-bus"
            color="text-green-600"
          />
        )}

        {/* Bike Score */}
        {walkScoreData.bike && (
          <ScoreCard
            score={walkScoreData.bike.score}
            title="Bike Score"
            description={walkScoreData.bike.description}
            icon="fas fa-bicycle"
            color="text-orange-600"
          />
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
          <div>
            <p className="text-sm text-blue-900 font-medium">About these scores</p>
            <p className="text-xs text-blue-700 mt-1">
              Walk Score measures how easy it is to accomplish errands on foot. 
              Transit and Bike scores measure public transportation and biking infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkScoreWidget; 