import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SocialLoginButtons from './SocialLoginButtons';
import * as authService from '../../services/authService';

const PayPalSignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPasswordError(null);
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.signup({ name, email, password });
      setSuccess(true);
      // Redirect to checkout after signup
      setTimeout(() => navigate('/checkout'), 1200);
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
      <div className="text-center space-y-2">
        <Link to="/" className="flex justify-center mb-4">
          <img src="/ornelogog-11 copy.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
        </Link>
        <h2 className="text-3xl font-bold text-center text-sky-400">Sign Up & Subscribe</h2>
        <p className="text-center text-gray-400">Create your account to unlock all features and manage your listings.</p>
      </div>
      <SocialLoginButtons 
        onError={handleSocialError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
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
        <div>
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
        </div>
        {error && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{error}</p>}
        {passwordError && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{passwordError}</p>}
        {success && (
          <div className="text-center py-2 bg-green-900/30 rounded">
            <p className="text-xs text-green-400">
              Signup successful! Redirecting to payment...
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