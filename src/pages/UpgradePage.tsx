import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Crown, 
  Clock, 
  Users, 
  Eye, 
  Brain, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Star,
  Shield,
  ArrowRight,
  CreditCard,
  Lock,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Target,
  DollarSign,
  Calendar,
  Gift
} from 'lucide-react';

interface UpgradeData {
  trial_id: string;
  listing_title: string;
  price: string;
  views: number;
  leads: number;
  ai_responses: number;
  time_remaining: number;
  trial_value: number;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  benefits: string[];
}

const UpgradePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [upgradeData, setUpgradeData] = useState<UpgradeData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadUpgradeData(id);
    }
  }, [id]);

  const loadUpgradeData = async (trialId: string) => {
    setIsLoading(true);
    try {
      // Mock data for development
      const mockData: UpgradeData = {
        trial_id: trialId,
        listing_title: 'Beautiful Modern Home',
        price: '$450,000',
        views: 47,
        leads: 3,
        ai_responses: 12,
        time_remaining: 24, // hours (1 day remaining)
        trial_value: 1250,
        monthly_price: 97,
        yearly_price: 997,
        features: [
          'Unlimited AI property assistants',
          'Real-time lead generation',
          'Automated follow-up messaging',
          'Performance analytics dashboard',
          'Custom AI training',
          'Priority support',
          'Advanced reporting',
          'Multi-property management'
        ],
        benefits: [
          'Keep all your current leads',
          'Continue AI assistant conversations',
          'Access to premium features',
          '24/7 customer support',
          'No setup fees',
          'Cancel anytime'
        ]
      };
      
      setUpgradeData(mockData);
    } catch (error) {
      console.error('Failed to load upgrade data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful upgrade
      console.log('✅ Payment processed successfully!');
      setShowSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (isLoading && !upgradeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading upgrade options...</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upgrade Successful! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Your AI app is now permanently active. All your leads and conversations have been saved!
          </p>
          <div className="bg-white rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!upgradeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Trial Not Found</h2>
          <p className="text-gray-600 mb-4">This trial doesn't exist or has expired.</p>
                          <Button onClick={() => navigate('/build-ai-listing')}>
            Create New AI App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Upgrade Your AI App</h1>
                <p className="text-sm text-gray-600">Keep your leads and continue growing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="destructive">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(upgradeData.time_remaining)} left
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trial Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgency Banner */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      ⏰ Trial Expiring Soon!
                    </h3>
                    <p className="text-red-700">
                      Your AI app has generated <strong>{upgradeData.leads} leads</strong> and 
                      <strong> {upgradeData.views} views</strong>. Don't lose this momentum!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Your Trial Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{upgradeData.views}</p>
                    <p className="text-sm text-gray-600">Property Views</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{upgradeData.leads}</p>
                    <p className="text-sm text-gray-600">Leads Generated</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{upgradeData.ai_responses}</p>
                    <p className="text-sm text-gray-600">AI Responses</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Trial Value Generated</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">${upgradeData.trial_value.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Estimated value of leads and engagement</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Your Active Property</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{upgradeData.listing_title}</h4>
                    <p className="text-gray-600">{upgradeData.price}</p>
                    <p className="text-sm text-gray-500">Active AI assistant helping buyers</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upgrade Options */}
          <div className="space-y-6">
            {/* Plan Selection */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Choose Your Plan</h3>
                
                <div className="space-y-4">
                  {/* Monthly Plan */}
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === 'monthly' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          checked={selectedPlan === 'monthly'}
                          onChange={() => setSelectedPlan('monthly')}
                          className="text-blue-600"
                        />
                        <span className="font-semibold">Monthly Plan</span>
                      </div>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${upgradeData.monthly_price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Cancel anytime</p>
                  </div>

                  {/* Yearly Plan */}
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === 'yearly' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('yearly')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          checked={selectedPlan === 'yearly'}
                          onChange={() => setSelectedPlan('yearly')}
                          className="text-blue-600"
                        />
                        <span className="font-semibold">Yearly Plan</span>
                      </div>
                      <Badge variant="default">Save 15%</Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${upgradeData.yearly_price}</span>
                      <span className="text-gray-600">/year</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Best value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">What You'll Get</h3>
                
                <div className="space-y-3">
                  {upgradeData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upgrade Benefits</h3>
                
                <div className="space-y-3">
                  {upgradeData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                
                <div className="space-y-3 mb-6">
                  <div 
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-blue-600"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="text-blue-600"
                      />
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <span className="font-medium">PayPal</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <Lock className="w-4 h-4" />
                  <span>Your payment is secure and encrypted</span>
                </div>

                {/* Upgrade Button */}
                <Button 
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade Now - ${selectedPlan === 'monthly' ? upgradeData.monthly_price : upgradeData.yearly_price}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By upgrading, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage; 