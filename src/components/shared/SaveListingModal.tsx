import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Save, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import NewLogo from './NewLogo';
import { User } from '../../types';

interface SaveListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData?: Partial<User>) => Promise<void>;
  listingEmail?: string;
}

const SaveListingModal: React.FC<SaveListingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  listingEmail
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(listingEmail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

        try {
      console.log('👤 Signing up user:', { name, email });

      // Sign up the user
      const newUser = await signup(name, email, password);
      console.log('✅ User signed up successfully:', newUser);

      // Save the listing with the new user data
      console.log('💾 Saving listing after signup...');
      console.log('🔍 Raw newUser object:', newUser);
      console.log('🔍 newUser.id:', newUser.id);
      console.log('🔍 newUser.email:', newUser.email);
      console.log('🔍 newUser keys:', Object.keys(newUser));
      
      // FORCE CONSISTENCY: Create a reliable user ID if Supabase doesn't provide one
      const reliableUserId = newUser.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const userData = {
        id: reliableUserId,
        email: newUser.email || email,
        name: newUser.name || name
      };
      console.log('📋 Passing user data to save function:', userData);
      console.log('📋 userData.id:', userData.id);
      console.log('📋 userData.email:', userData.email);
      console.log('💾 Original newUser.id was:', newUser.id);
      
      localStorage.setItem('current_user_id', reliableUserId);
      localStorage.setItem('current_user_email', newUser.email || email);
      console.log('💾 Stored reliable user ID in localStorage:', reliableUserId);
      
      await onSave(userData);
      console.log('✅ Listing saved successfully');

      setIsSuccess(true);

      // Show success message and stay on the same page
      setTimeout(() => {
        onClose(); // Close the modal
        // Show success alert instead of redirecting
        alert('✅ Listing saved successfully! You can now view it in your dashboard.');
      }, 1000);

    } catch (err) {
      console.error('❌ Error in SaveListingModal:', err);
      setError((err as Error).message || 'Failed to save listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <NewLogo size={40} />
          </div>
          
          <h2 className="text-2xl font-bold text-center">Save Your Listing</h2>
          <p className="text-blue-100 text-center mt-2">
            Create your account and get 7 days free
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSuccess ? (
            <>
              {/* Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">What you get:</h3>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Save your listing to your dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    7 days free access to all features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Create unlimited listings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    AI-powered listing optimization
                  </li>
                </ul>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Listing & Get 7 Days Free
                    </div>
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to HomeListingAI!
              </h3>
              <p className="text-gray-600 mb-4">
                Your listing has been saved and your 7-day free trial is now active.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveListingModal; 