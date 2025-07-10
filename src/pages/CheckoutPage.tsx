import React, { useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import * as listingService from '../services/listingService';

const PAYPAL_CLIENT_ID = 'AYhqKF1oICmRK-RJP0PVV_hvafhe5gqYR-y5Snvnf1L1tnDgz84UXDDUYr03iI9y3RpasjyAb7ktbrB_';
const PAYPAL_PLAN_ID = 'P-0PY21444BY304751NNBWJ7TI';

const CheckoutPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get listingId from query string
  const params = new URLSearchParams(location.search);
  const listingId = params.get('listingId');

  // Load PayPal JS SDK
  React.useEffect(() => {
    if ((window as any).paypal || !paypalRef.current) return;
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => {
      (window as any).paypal.Buttons({
        createSubscription: function (data: any, actions: any) {
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID,
          });
        },
        onApprove: async (data: any) => {
          setIsLoading(true);
          setError(null);
          setSuccess(false);
          try {
            setSuccess(true);
            if (listingId) {
              // Activate the listing
              await listingService.updateListing(listingId, { status: 'Active' });
            }
            setTimeout(() => navigate(listingId ? `/listings/${listingId}` : '/dashboard'), 1200);
          } catch (err: any) {
            setError(err.message || 'Payment failed.');
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err: any) => {
          setError('PayPal error: ' + err);
        },
      }).render(paypalRef.current);
    };
    document.body.appendChild(script);
    // Cleanup
    return () => {
      if (paypalRef.current) paypalRef.current.innerHTML = '';
    };
  }, [listingId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900">
      <Card className="w-full max-w-lg p-0 bg-slate-800/90 shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center pb-0">
          <Link to="/" className="flex justify-center mb-4">
            <img src="/ornelogog-11 copy.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold text-sky-400 mb-2">Checkout: Listing AI Agent</CardTitle>
          <CardDescription className="text-lg text-gray-300 mb-2">Unlock all features for your listing. Cancel anytime.</CardDescription>
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
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 border-t border-slate-700 mt-2 pt-4">
          <span className="text-xs text-gray-400">Need help? <Link to="/support" className="font-medium text-sky-500 hover:text-sky-400">Contact support</Link></span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage; 