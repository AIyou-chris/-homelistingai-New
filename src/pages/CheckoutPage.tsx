import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle, 
  Shield, 
  Calendar, 
  Users,
  ArrowRight,
  Lock,
  Star,
  Zap,
  Sparkles,
  Building,
  Globe
} from 'lucide-react';

// PayPal types
declare global {
  interface Window {
    paypal: any;
  }
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingEmail: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PayPal Configuration
  const PAYPAL_PLAN_ID = 'P-40U48682XK3036234NCAWEQI';
  const PAYPAL_CLIENT_ID = 'Ac22b_nWho5JKmP11XrEe3RsGecB2MMw6Tu4EY87rPzEqsERcI_hL4msfk8lsWUjfPIP9DQsaFBIUsoD';

  const plans = {
    pro: {
      name: 'Professional',
      price: 79,
      period: 'listing',
      features: [
        'AI for one listing',
        'Advanced AI features',
        'Lead management',
        'Priority support',
        'Analytics dashboard',
        'Custom branding',
        'API access',
        'QR code generation',
        'Mobile app access',
        'Team collaboration'
      ],
      popular: true
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Load PayPal SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = () => setPaypalLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize PayPal Buttons
  useEffect(() => {
    if (paypalLoaded && window.paypal) {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID
          });
        },
        onApprove: function(data: any, actions: any) {
          console.log('Subscription approved:', data.subscriptionID);
          // Redirect to agent dashboard on success
          navigate('/agent');
        },
        onError: function(err: any) {
          console.error('PayPal error:', err);
          setError('Payment failed. Please try again.');
        }
      }).render('#paypal-button-container');
    }
  }, [paypalLoaded, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    setIsProcessing(false);
    navigate('/agent');
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const selectedPlanData = plans[selectedPlan as keyof typeof plans];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Plan Selection */}
        <motion.div 
          variants={formVariants} 
          initial="hidden" 
          animate="visible"
          className="space-y-6"
        >
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Professional
              <span className="text-blue-600 block">Plan</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Everything you need to succeed in real estate.
            </p>
          </div>

          {/* Plan Card */}
          <Card className="ring-2 ring-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Professional Plan</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Most Popular
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    $79
                    <span className="text-sm font-normal text-slate-600">/listing</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {plans.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Checkout Form */}
        <motion.div 
          variants={formVariants} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6">
              <Link to="/" className="flex justify-center mb-2">
                <img src="/new hlailogo.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
              </Link>
              <CardTitle className="text-2xl font-bold text-white">Complete Checkout</CardTitle>
              <p className="text-blue-100">Secure payment powered by Stripe</p>
            </CardHeader>
            
            <CardContent className="space-y-6 p-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedPlanData.name} Plan</span>
                    <span className="font-medium">${selectedPlanData.price}/listing</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Today</span>
                    <span>${selectedPlanData.price}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm font-medium">Credit Card</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">PayPal</span>
                      </div>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-gray-700 font-medium">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber" 
                        type="text" 
                        value={formData.cardNumber} 
                        onChange={handleInputChange} 
                        placeholder="1234 5678 9012 3456"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-gray-700 font-medium">Expiry Date</Label>
                        <Input 
                          id="expiryDate" 
                          name="expiryDate" 
                          type="text" 
                          value={formData.expiryDate} 
                          onChange={handleInputChange} 
                          placeholder="MM/YY"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-gray-700 font-medium">CVV</Label>
                        <Input 
                          id="cvv" 
                          name="cvv" 
                          type="text" 
                          value={formData.cvv} 
                          onChange={handleInputChange} 
                          placeholder="123"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName" className="text-gray-700 font-medium">Cardholder Name</Label>
                      <Input 
                        id="cardName" 
                        name="cardName" 
                        type="text" 
                        value={formData.cardName} 
                        onChange={handleInputChange} 
                        placeholder="John Doe"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">PayPal Subscription</Label>
                    <div id="paypal-button-container" className="w-full"></div>
                    {!paypalLoaded && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading PayPal...</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="billingEmail" className="text-gray-700 font-medium">Billing Email</Label>
                  <Input 
                    id="billingEmail" 
                    name="billingEmail" 
                    type="email" 
                    value={formData.billingEmail} 
                    onChange={handleInputChange} 
                    placeholder="billing@example.com"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isProcessing} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Purchase
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  By completing your purchase, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage; 