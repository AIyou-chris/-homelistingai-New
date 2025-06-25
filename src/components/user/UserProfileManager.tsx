import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { UserProfile, UserPreferences } from '../../types';
import { 
  User, 
  Settings, 
  Heart, 
  Bell, 
  MapPin, 
  DollarSign, 
  Home,
  Edit3,
  ChevronRight,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import UserPreferencesManager from './UserPreferencesManager';
import FavoritesManager from './FavoritesManager';

interface UserProfileManagerProps {
  onClose?: () => void;
}

const UserProfileManager: React.FC<UserProfileManagerProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    const [userProfile, userPreferences] = await Promise.all([
      UserService.getUserProfile(user.id),
      UserService.getUserPreferences(user.id)
    ]);
    
    setProfile(userProfile);
    setPreferences(userPreferences);
    setLoading(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadUserData(); // Reload data after onboarding
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
      />
    );
  }

  if (showPreferences) {
    return (
      <UserPreferencesManager 
        onClose={() => setShowPreferences(false)}
      />
    );
  }

  if (showFavorites) {
    return (
      <FavoritesManager 
        onClose={() => setShowFavorites(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {profile?.display_name || user?.email || 'User'}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
                {!profile?.onboarding_completed && (
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Complete onboarding →
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {preferences && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {preferences.preferred_cities.length}
                  </div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {preferences.preferred_property_types.length}
                  </div>
                  <div className="text-sm text-gray-600">Property Types</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${(preferences.min_price / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-gray-600">Min Price</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${(preferences.max_price / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-gray-600">Max Price</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            
            <button
              onClick={() => setShowPreferences(true)}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Preferences</div>
                  <div className="text-sm text-gray-600">Manage your property preferences</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowFavorites(true)}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Favorites</div>
                  <div className="text-sm text-gray-600">View your saved properties</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Update Preferences</div>
                  <div className="text-sm text-gray-600">Refine your search criteria</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Preferences Summary */}
          {preferences && (
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Current Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Preferred Cities</div>
                    <div className="text-sm text-gray-600">
                      {preferences.preferred_cities.length > 0 
                        ? preferences.preferred_cities.join(', ')
                        : 'Not set'
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Price Range</div>
                    <div className="text-sm text-gray-600">
                      ${preferences.min_price.toLocaleString()} - ${preferences.max_price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Property Types</div>
                    <div className="text-sm text-gray-600">
                      {preferences.preferred_property_types.length > 0 
                        ? preferences.preferred_property_types.join(', ')
                        : 'Not set'
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Notifications</div>
                    <div className="text-sm text-gray-600">
                      {preferences.email_notifications ? 'Email' : ''}
                      {preferences.push_notifications ? (preferences.email_notifications ? ', Push' : 'Push') : ''}
                      {preferences.sms_notifications ? (preferences.email_notifications || preferences.push_notifications ? ', SMS' : 'SMS') : ''}
                      {!preferences.email_notifications && !preferences.push_notifications && !preferences.sms_notifications && 'Disabled'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManager; 