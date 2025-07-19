import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import * as listingService from '../services/listingService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// TODO: Replace with your PayPal production credentials
// 1. Go to https://developer.paypal.com/
// 2. Create a production app with your business account
// 3. Get your Client ID and create a subscription plan
// 4. Replace the values below

// Using sandbox credentials for testing
const PAYPAL_CLIENT_ID = 'AYhqKF1oICmRK-RJP0PVV_hvafhe5gqYR-y5Snvnf1L1tnDgz84UXDDUYr03iI9y3RpasjyAb7ktbrB_';
const PAYPAL_PLAN_ID = 'P-0PY21444BY304751NNBWJ7TI';

// TODO: Replace with your production credentials when ready
// const PAYPAL_CLIENT_ID = 'YOUR_PRODUCTION_CLIENT_ID';
// const PAYPAL_PLAN_ID = 'YOUR_PRODUCTION_PLAN_ID';

const CheckoutPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get listingId from query string
  const params = new URLSearchParams(location.search);
  const listingId = params.get('listingId');

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Allow access to checkout even without session (for signup flow)
      setIsAuthenticated(true);
    };
    checkAuth();
  }, [navigate, listingId]);

  // Load PayPal JS SDK
  useEffect(() => {
    // Clear any existing PayPal buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    // Don't load if already loaded or not authenticated
    if ((window as any).paypal) {
      renderPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&currency=USD`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      renderPayPalButton();
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      setError('Failed to load PayPal. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      if (paypalRef.current) paypalRef.current.innerHTML = '';
    };
  }, [listingId, navigate, user, isAuthenticated]);

  const renderPayPalButton = () => {
    if (!(window as any).paypal || !paypalRef.current) {
      console.log('PayPal not ready or ref not available');
      return;
    }

    console.log('Rendering PayPal button...');
    
    try {
      (window as any).paypal.Buttons({
        createSubscription: function (data: any, actions: any) {
          console.log('Creating subscription with plan:', PAYPAL_PLAN_ID);
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID,
            custom_id: user?.id || 'anonymous'
          });
        },
        onApprove: async (data: any) => {
          console.log('Payment approved:', data);
          setIsLoading(true);
          setError(null);
          setSuccess(false);
          try {
            // Store subscription ID in user profile
            if (user?.id) {
              const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert({
                  user_id: user.id,
                  subscription_id: data.subscriptionID,
                  subscription_status: 'active',
                  updated_at: new Date().toISOString()
                });
              
              if (profileError) {
                console.error('Error updating user profile:', profileError);
              }
            }

            setSuccess(true);
            if (listingId) {
              // Activate the listing
              await listingService.updateListing(listingId, { status: 'Active' });
            }
            setTimeout(() => navigate(listingId ? `/listings/${listingId}` : '/dashboard'), 1200);
          } catch (err: any) {
            console.error('Payment processing error:', err);
            setError(err.message || 'Payment failed.');
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setError('PayPal error: ' + (err.message || 'Unknown error'));
        },
        onCancel: () => {
          console.log('Payment cancelled by user');
          setError('Payment was cancelled.');
        }
      }).render(paypalRef.current);
    } catch (err: any) {
      console.error('Failed to render PayPal button:', err);
      setError('Failed to load payment button. Please refresh the page.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900">
      <Card className="w-full max-w-lg p-0 bg-slate-800/90 shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center pb-0">
          <Link to="/" className="flex justify-center mb-4">
            <img src="/ornelogog-11 copy.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold text-sky-400 mb-2">Keep Your AI Agent Forever</CardTitle>
          <CardDescription className="text-lg text-gray-300 mb-2">Upgrade from demo to permanent AI agent. Cancel anytime.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <span className="bg-white text-pink-600 text-base font-extrabold px-4 py-1 rounded-full border-2 border-pink-400 shadow mb-2 animate-pop-in">
              <span className="line-through mr-1">$99</span> <span className="text-pink-400 font-bold text-xs align-middle">Normally</span>
            </span>
            <span className="text-5xl font-bold text-white mb-1 animate-pop-in">$59 <span className="text-2xl font-medium opacity-80">/mo/listing</span></span>
            <span className="text-sm text-green-400 font-semibold">60-Day Money-Back Guarantee</span>
            <span className="text-xs text-gray-400">Billed monthly per active listing. Cancel anytime.</span>
          </div>
          <ul className="grid grid-cols-1 gap-2 text-left text-white/90 text-sm mb-2">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Full AI Lead System Included</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 24/7 Automated Lead Capture</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Instant Buyer Conversations</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Easy AI Upgrades: Just Upload New Info</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Built-in CRM & Follow-up Tools</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Voice Bot & Live Chat</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Neighborhood & School Data</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Property History & Comps</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Custom AI Training—No Coding Needed</li>
          </ul>
          <div className="rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-3 px-4 mb-2 font-semibold shadow">
            <Clock className="inline w-5 h-5 mr-1 align-middle" />
            <span>Act now: Launch pricing ends soon!</span>
          </div>
          {/* PayPal Button Label */}
          <div className="text-center mb-2">
            <span className="inline-block bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-full shadow">Start Your AI Listing Agent</span>
          </div>
          {error && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{error}</p>}
          {success && (
            <div className="text-center py-2 bg-green-900/30 rounded">
              <p className="text-xs text-green-400">
                Payment successful! Redirecting to your dashboard...
              </p>
            </div>
          )}
          <div ref={paypalRef} className="flex justify-center" />
          {isLoading && <p className="text-center text-sky-400">Processing...</p>}
          
          {/* Fallback test button for development */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                try {
                  // Simulate successful payment
                  if (user?.id) {
                    const { error: profileError } = await supabase
                      .from('user_profiles')
                      .upsert({
                        user_id: user.id,
                        subscription_id: 'test-subscription-' + Date.now(),
                        subscription_status: 'active',
                        updated_at: new Date().toISOString()
                      });
                    
                    if (profileError) {
                      console.error('Error updating user profile:', profileError);
                    }
                  }
                  setSuccess(true);
                  setTimeout(() => navigate('/dashboard'), 1200);
                } catch (err: any) {
                  setError('Test payment failed: ' + err.message);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              🧪 Test Payment (Dev Only)
            </button>
          )}
          
          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300">
              <div>Debug Info:</div>
              <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
              <div>User ID: {user?.id || 'None'}</div>
              <div>PayPal Client ID: {PAYPAL_CLIENT_ID ? 'Set' : 'Missing'}</div>
              <div>PayPal Plan ID: {PAYPAL_PLAN_ID ? 'Set' : 'Missing'}</div>
            </div>
          )}

          {/* Temporary Demo Choice Buttons */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-300 mb-3">🎯 Temporary Testing Options</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    setError(null);
                    try {
                      // Simulate successful payment and go LIVE immediately
                      if (user?.id) {
                        const { error: profileError } = await supabase
                          .from('user_profiles')
                          .upsert({
                            user_id: user.id,
                            subscription_id: 'live-subscription-' + Date.now(),
                            subscription_status: 'active',
                            updated_at: new Date().toISOString()
                          });
                        
                        if (profileError) {
                          console.error('Error updating user profile:', profileError);
                        }
                      }
                      
                      // Remove demo flags from all AI configs
                      const keys = Object.keys(localStorage);
                      keys.forEach(key => {
                        if (key.startsWith('ai_config_')) {
                          try {
                            const config = JSON.parse(localStorage.getItem(key) || '{}');
                            if (config.is_demo) {
                              config.is_demo = false;
                              config.demo_expires_at = null;
                              localStorage.setItem(key, JSON.stringify(config));
                              console.log('✅ Made AI agent LIVE:', key);
                            }
                          } catch (error) {
                            console.error('Error updating AI config:', error);
                          }
                        }
                      });
                      
                      setSuccess(true);
                      alert('🎉 All AI agents are now LIVE! Demo restrictions removed.');
                      setTimeout(() => navigate('/dashboard'), 1200);
                    } catch (err: any) {
                      setError('Failed to go live: ' + err.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg"
                >
                  🚀 Go LIVE Now
                  <div className="text-xs opacity-80 mt-1">Remove all demo restrictions</div>
                </button>
                
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    setError(null);
                    try {
                      // Simulate successful payment but keep in DEMO mode
                      if (user?.id) {
                        const { error: profileError } = await supabase
                          .from('user_profiles')
                          .upsert({
                            user_id: user.id,
                            subscription_id: 'demo-subscription-' + Date.now(),
                            subscription_status: 'demo',
                            updated_at: new Date().toISOString()
                          });
                        
                        if (profileError) {
                          console.error('Error updating user profile:', profileError);
                        }
                      }
                      
                      // Set all AI configs to demo mode with 30-minute expiration
                      const keys = Object.keys(localStorage);
                      keys.forEach(key => {
                        if (key.startsWith('ai_config_')) {
                          try {
                            const config = JSON.parse(localStorage.getItem(key) || '{}');
                            config.is_demo = true;
                            config.demo_expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();
                            localStorage.setItem(key, JSON.stringify(config));
                            console.log('⏰ Set AI agent to DEMO mode:', key);
                          } catch (error) {
                            console.error('Error updating AI config:', error);
                          }
                        }
                      });
                      
                      setSuccess(true);
                      alert('⏰ All AI agents set to DEMO mode (30 minutes)!');
                      setTimeout(() => navigate('/dashboard'), 1200);
                    } catch (err: any) {
                      setError('Failed to set demo mode: ' + err.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg"
                >
                  ⏰ Stay in DEMO
                  <div className="text-xs opacity-80 mt-1">30-minute countdown</div>
                </button>
              </div>
              <p className="text-xs text-blue-400 mt-2 text-center">
                These buttons are for testing only - will be removed in production
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 border-t border-slate-700 mt-2 pt-4">
          <span className="text-xs text-gray-400">Need help? <Link to="/support" className="font-medium text-sky-500 hover:text-sky-400">Contact support</Link></span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage; 