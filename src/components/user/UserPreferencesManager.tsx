import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { UserPreferences } from '../../types';
import { 
  Home, 
  Building, 
  MapPin, 
  DollarSign, 
  Bell, 
  Settings, 
  Save, 
  X,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserPreferencesManagerProps {
  onClose?: () => void;
}

const UserPreferencesManager: React.FC<UserPreferencesManagerProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('property');
  const [newLocation, setNewLocation] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    const prefs = await UserService.getUserPreferences(user.id);
    setPreferences(prefs);
    setLoading(false);
  };

  const savePreferences = async () => {
    if (!user || !preferences) return;
    
    setSaving(true);
    const success = await UserService.updateUserPreferences(user.id, preferences);
    if (success) {
      // Show success message or toast
      console.log('Preferences saved successfully');
    }
    setSaving(false);
  };

  const updatePreference = (updates: Partial<UserPreferences>) => {
    if (preferences) {
      setPreferences({ ...preferences, ...updates });
    }
  };

  const addLocation = () => {
    if (newLocation.trim() && preferences) {
      const location = newLocation.trim();
      if (!preferences.preferred_cities.includes(location)) {
        updatePreference({
          preferred_cities: [...preferences.preferred_cities, location]
        });
      }
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    if (preferences) {
      updatePreference({
        preferred_cities: preferences.preferred_cities.filter(l => l !== location)
      });
    }
  };

  const getFeaturePropertyName = (type: 'must_have' | 'nice_to_have' | 'deal_breakers') => {
    return type === 'deal_breakers' ? 'deal_breakers' : `${type}_features`;
  };

  const addFeature = (type: 'must_have' | 'nice_to_have' | 'deal_breakers') => {
    if (newFeature.trim() && preferences) {
      const feature = newFeature.trim();
      const propertyName = getFeaturePropertyName(type);
      const currentFeatures = preferences[propertyName as keyof UserPreferences] as string[];
      if (!currentFeatures.includes(feature)) {
        updatePreference({
          [propertyName]: [...currentFeatures, feature]
        });
      }
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string, type: 'must_have' | 'nice_to_have' | 'deal_breakers') => {
    if (preferences) {
      const propertyName = getFeaturePropertyName(type);
      const currentFeatures = preferences[propertyName as keyof UserPreferences] as string[];
      updatePreference({
        [propertyName]: currentFeatures.filter((f: string) => f !== feature)
      });
    }
  };

  const propertyTypeOptions = [
    { value: 'house', label: 'Single Family Home', icon: Home },
    { value: 'condo', label: 'Condo/Apartment', icon: Building },
    { value: 'townhouse', label: 'Townhouse', icon: Building },
    { value: 'multi_family', label: 'Multi-Family', icon: Building },
    { value: 'land', label: 'Land/Lot', icon: MapPin }
  ];

  const tabs = [
    { id: 'property', label: 'Property', icon: Home },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-600">Unable to load preferences</p>
          <button onClick={onClose} className="mt-4 text-blue-600 hover:text-blue-700">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'property' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {propertyTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const isSelected = preferences.preferred_property_types.includes(option.value);
                        const newTypes = isSelected
                          ? preferences.preferred_property_types.filter(t => t !== option.value)
                          : [...preferences.preferred_property_types, option.value];
                        updatePreference({ preferred_property_types: newTypes });
                      }}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                        preferences.preferred_property_types.includes(option.value)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <option.icon className={`w-5 h-5 ${
                        preferences.preferred_property_types.includes(option.value) ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className="font-medium">{option.label}</span>
                      {preferences.preferred_property_types.includes(option.value) && (
                        <Check className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bedrooms</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={preferences.min_bedrooms}
                        onChange={(e) => updatePreference({ min_bedrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={preferences.max_bedrooms}
                        onChange={(e) => updatePreference({ max_bedrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bathrooms</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={preferences.min_bathrooms}
                        onChange={(e) => updatePreference({ min_bathrooms: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={preferences.max_bathrooms}
                        onChange={(e) => updatePreference({ max_bathrooms: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minimum Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        value={preferences.min_price}
                        onChange={(e) => updatePreference({ min_price: parseInt(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Maximum Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        value={preferences.max_price}
                        onChange={(e) => updatePreference({ max_price: parseInt(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Cities</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter city name..."
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addLocation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {preferences.preferred_cities.map((city) => (
                      <span
                        key={city}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{city}</span>
                        <button
                          onClick={() => removeLocation(city)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Maximum Commute Time</h4>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={preferences.max_commute_time}
                    onChange={(e) => updatePreference({ max_commute_time: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {preferences.max_commute_time} min
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Must Have Features</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a must-have feature..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature('must_have')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => addFeature('must_have')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {preferences.must_have_features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{feature}</span>
                        <button
                          onClick={() => removeFeature(feature, 'must_have')}
                          className="hover:text-red-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nice to Have Features</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a nice-to-have feature..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature('nice_to_have')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => addFeature('nice_to_have')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {preferences.nice_to_have_features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{feature}</span>
                        <button
                          onClick={() => removeFeature(feature, 'nice_to_have')}
                          className="hover:text-green-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => updatePreference({ email_notifications: !preferences.email_notifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.email_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get instant notifications on your device</p>
                    </div>
                    <button
                      onClick={() => updatePreference({ push_notifications: !preferences.push_notifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.push_notifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.push_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                    </div>
                    <button
                      onClick={() => updatePreference({ sms_notifications: !preferences.sms_notifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.sms_notifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notification Frequency</h4>
                <select
                  value={preferences.notification_frequency}
                  onChange={(e) => updatePreference({ notification_frequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={savePreferences}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesManager; 