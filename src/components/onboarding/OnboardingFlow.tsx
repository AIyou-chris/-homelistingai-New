import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { OnboardingData, OnboardingStep } from '../../types';
import { 
  Home, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Building,
  TrendingUp,
  Eye
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    user_type: 'buyer',
    property_types: [],
    budget_range: { min: 200000, max: 500000 },
    preferred_locations: [],
    timeline: '3_months',
    has_agent: false,
    contact_preferences: {
      email: true,
      phone: false,
      sms: false
    }
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to HomeListingAI",
      description: "Let's personalize your experience to help you find your perfect home.",
      component: "welcome",
      required: true,
      completed: false
    },
    {
      id: 2,
      title: "What brings you here?",
      description: "Tell us about your real estate goals.",
      component: "user_type",
      required: true,
      completed: false
    },
    {
      id: 3,
      title: "Property Preferences",
      description: "What type of property are you looking for?",
      component: "property_types",
      required: true,
      completed: false
    },
    {
      id: 4,
      title: "Budget Range",
      description: "What's your target price range?",
      component: "budget",
      required: true,
      completed: false
    },
    {
      id: 5,
      title: "Preferred Locations",
      description: "Where would you like to live?",
      component: "locations",
      required: true,
      completed: false
    },
    {
      id: 6,
      title: "Timeline",
      description: "When are you planning to make a move?",
      component: "timeline",
      required: true,
      completed: false
    },
    {
      id: 7,
      title: "Agent Connection",
      description: "Do you already have a real estate agent?",
      component: "agent",
      required: false,
      completed: false
    },
    {
      id: 8,
      title: "Contact Preferences",
      description: "How would you like to stay updated?",
      component: "contact",
      required: true,
      completed: false
    }
  ];

  const propertyTypeOptions = [
    { value: 'house', label: 'Single Family Home', icon: Home },
    { value: 'condo', label: 'Condo/Apartment', icon: Building },
    { value: 'townhouse', label: 'Townhouse', icon: Building },
    { value: 'multi_family', label: 'Multi-Family', icon: Building },
    { value: 'land', label: 'Land/Lot', icon: MapPin }
  ];

  const userTypeOptions = [
    { value: 'buyer', label: 'Buying a Home', icon: Home, description: 'Looking to purchase a property' },
    { value: 'seller', label: 'Selling a Home', icon: TrendingUp, description: 'Want to list your property' },
    { value: 'investor', label: 'Real Estate Investor', icon: DollarSign, description: 'Looking for investment opportunities' },
    { value: 'browser', label: 'Just Browsing', icon: Eye, description: 'Exploring the market' }
  ];

  const timelineOptions = [
    { value: 'immediate', label: 'Immediately', description: 'Ready to move now' },
    { value: '3_months', label: 'Within 3 months', description: 'Planning to move soon' },
    { value: '6_months', label: 'Within 6 months', description: 'Taking time to find the right place' },
    { value: '1_year', label: 'Within 1 year', description: 'Early planning stage' },
    { value: 'no_rush', label: 'No rush', description: 'Just exploring options' }
  ];

  const popularCities = [
    'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'
  ];

  useEffect(() => {
    if (user) {
      UserService.updateOnboardingStep(user.id, currentStep);
    }
  }, [currentStep, user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (user) {
      const success = await UserService.completeOnboarding(user.id, onboardingData);
      if (success && onComplete) {
        onComplete();
      }
    }
  };

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
            <p className="text-gray-600 max-w-md mx-auto">{step.description}</p>
            <div className="pt-4">
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        );

      case 'user_type':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateOnboardingData({ user_type: option.value as any })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    onboardingData.user_type === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      onboardingData.user_type === option.value ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <option.icon className={`w-5 h-5 ${
                        onboardingData.user_type === option.value ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'property_types':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {propertyTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    const isSelected = onboardingData.property_types.includes(option.value);
                    const newTypes = isSelected
                      ? onboardingData.property_types.filter(t => t !== option.value)
                      : [...onboardingData.property_types, option.value];
                    updateOnboardingData({ property_types: newTypes });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    onboardingData.property_types.includes(option.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className={`w-5 h-5 ${
                      onboardingData.property_types.includes(option.value) ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {onboardingData.property_types.includes(option.value) && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Min: ${onboardingData.budget_range.min.toLocaleString()}</span>
                <span>Max: ${onboardingData.budget_range.max.toLocaleString()}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Price</label>
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="25000"
                    value={onboardingData.budget_range.min}
                    onChange={(e) => updateOnboardingData({
                      budget_range: { ...onboardingData.budget_range, min: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Price</label>
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="25000"
                    value={onboardingData.budget_range.max}
                    onChange={(e) => updateOnboardingData({
                      budget_range: { ...onboardingData.budget_range, max: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Cities</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const city = input.value.trim();
                        if (city && !onboardingData.preferred_locations.includes(city)) {
                          updateOnboardingData({
                            preferred_locations: [...onboardingData.preferred_locations, city]
                          });
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Popular Cities</h4>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        if (!onboardingData.preferred_locations.includes(city)) {
                          updateOnboardingData({
                            preferred_locations: [...onboardingData.preferred_locations, city]
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        onboardingData.preferred_locations.includes(city)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              {onboardingData.preferred_locations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Selected Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.preferred_locations.map((location) => (
                      <span
                        key={location}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{location}</span>
                        <button
                          onClick={() => updateOnboardingData({
                            preferred_locations: onboardingData.preferred_locations.filter(l => l !== location)
                          })}
                          className="ml-1 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="space-y-3">
              {timelineOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateOnboardingData({ timeline: option.value as any })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    onboardingData.timeline === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    {onboardingData.timeline === option.value && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'agent':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => updateOnboardingData({ has_agent: true })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  onboardingData.has_agent
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Yes, I have an agent</h3>
                    <p className="text-sm text-gray-600">I'm already working with a real estate professional</p>
                  </div>
                  {onboardingData.has_agent && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>
              <button
                onClick={() => updateOnboardingData({ has_agent: false })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  !onboardingData.has_agent
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">No, I need help finding one</h3>
                    <p className="text-sm text-gray-600">I'd like to connect with a qualified agent</p>
                  </div>
                  {!onboardingData.has_agent && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => updateOnboardingData({
                  contact_preferences: { ...onboardingData.contact_preferences, email: !onboardingData.contact_preferences.email }
                })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  onboardingData.contact_preferences.email
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Updates</h3>
                      <p className="text-sm text-gray-600">Get notified about new listings and updates</p>
                    </div>
                  </div>
                  {onboardingData.contact_preferences.email && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>
              <button
                onClick={() => updateOnboardingData({
                  contact_preferences: { ...onboardingData.contact_preferences, phone: !onboardingData.contact_preferences.phone }
                })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  onboardingData.contact_preferences.phone
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone Calls</h3>
                      <p className="text-sm text-gray-600">Receive calls from agents about opportunities</p>
                    </div>
                  </div>
                  {onboardingData.contact_preferences.phone && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>
              <button
                onClick={() => updateOnboardingData({
                  contact_preferences: { ...onboardingData.contact_preferences, sms: !onboardingData.contact_preferences.sms }
                })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  onboardingData.contact_preferences.sms
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">Get text messages about urgent opportunities</p>
                    </div>
                  </div>
                  {onboardingData.contact_preferences.sms && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip
          </button>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {renderStep()}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 