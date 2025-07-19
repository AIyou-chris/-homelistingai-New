import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SocialLoginButtons from './SocialLoginButtons';
import * as authService from '../../services/authService';
import { supabase } from '../../lib/supabase';

const PayPalSignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const failedRequirements = Object.entries(requirements)
      .filter(([_, met]) => !met)
      .map(([req]) => req);
    
    return { isValid: failedRequirements.length === 0, failedRequirements };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPasswordError(null);
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError('Password does not meet all requirements. Please check the requirements below.');
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.signup({ name, email, password });
      
      // Transfer anonymous session data to authenticated user
      const anonymousSession = localStorage.getItem('anonymousSession');
      if (anonymousSession) {
        try {
          const sessionData = JSON.parse(anonymousSession);
          
          // Create a listing from the anonymous session data
          const listingData = {
            title: sessionData.propertyData?.title || 'My Property',
            price: sessionData.propertyData?.price || '$599,000',
            bedrooms: sessionData.propertyData?.bedrooms || 3,
            bathrooms: sessionData.propertyData?.bathrooms || 2,
            sqft: sessionData.propertyData?.sqft || 2200,
            description: sessionData.propertyData?.description || 'Beautiful property with great features.',
            images: sessionData.propertyData?.images || [],
            property_url: sessionData.propertyUrl,
            agent_name: sessionData.agentName,
            agency_name: sessionData.agencyName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Save the listing to the database
          const { data: listing, error: listingError } = await supabase
            .from('listings')
            .insert([listingData])
            .select()
            .single();
          
          if (listingError) {
            console.error('Error saving listing:', listingError);
          } else {
            console.log('Listing saved successfully:', listing);
            // Clear the anonymous session
            localStorage.removeItem('anonymousSession');
          }
        } catch (error) {
          console.error('Error transferring anonymous session:', error);
        }
      }
      
      setSuccess(true);
      // Redirect directly to agent dashboard after signup (skip payment for now)
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialError = (error: string) => {
    setError(error);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
      {/* Promotional text box */}
      <div className="mb-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-900/30 to-sky-400/10 p-5 text-center shadow-lg border border-blue-200/30">
          <div className="text-lg font-bold text-sky-300 mb-1">Ready to stand out?</div>
          <div className="text-white/90 mb-1">Join a community of top agents who are closing more deals with less effort.</div>
          <div className="text-blue-100">Sign up now—your future clients are waiting!</div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <Link to="/" className="flex justify-center mb-4">
          <img src="/ornelogog-11 copy.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
        </Link>
        <h2 className="text-3xl font-bold text-center text-sky-400">Sign Up & Subscribe</h2>
        <p className="text-center text-gray-400">Create your account to unlock all features and manage your listings.</p>
      </div>
      <SocialLoginButtons />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input
            className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Your Name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
          <input
            className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="new-password"
          />
                      <div className="text-xs text-gray-400 bg-slate-900 p-3 rounded border border-slate-700">
              <div className="font-medium mb-1">Password Requirements:</div>
              <ul className="space-y-1">
                <li className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                  ✓ At least 8 characters
                </li>
                <li className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                  ✓ One lowercase letter
                </li>
                <li className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                  ✓ One uppercase letter
                </li>
                <li className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                  ✓ One number
                </li>
                <li className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                  ✓ One special character (!@#$%^&*)
                </li>
              </ul>
              <div className="mt-2 pt-2 border-t border-slate-600 text-gray-500">
                <strong>Example:</strong> MyPassword123!
              </div>
            </div>
        </div>
        {error && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{error}</p>}
        {passwordError && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{passwordError}</p>}
        {success && (
          <div className="text-center py-2 bg-green-900/30 rounded">
            <p className="text-xs text-green-400">
              Signup successful! Redirecting to your dashboard...
            </p>
          </div>
        )}
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div className="text-sm text-center text-gray-500 pt-3 border-t border-slate-700">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-sky-500 hover:text-sky-400">Sign in</Link>
      </div>
    </div>
  );
};

export default PayPalSignUpForm; 