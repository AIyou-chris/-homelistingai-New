import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import Input from '../shared/Input';
import SocialLoginButtons from './SocialLoginButtons';
import * as authService from '../../services/authService';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isLoading: authLoading } = useAuth();
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
    
    try {
      await signup(name, email, password);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to sign up. Please try again.');
    }
  };

  const handleSocialError = (error: string) => {
    setError(error);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
        <div className="text-center space-y-2">
          <Link to="/" className="flex justify-center mb-4">
            <img src="/new hlailogo.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
          </Link>
          <h2 className="text-3xl font-bold text-center text-sky-400">Create Your Account</h2>
          <p className="text-center text-gray-400">Sign up to start managing your listings and leads.</p>
        </div>
        
        {/* Privacy Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-blue-300 font-medium">🔒 Your Privacy Matters</p>
            <p className="text-xs text-gray-300 leading-relaxed">
                          We won't spam you or sell your information. In fact, if you don't use your account within an hour, 
            we automatically delete all your data from our database. We hope you'll love our services and become a valued member!
            </p>
          </div>
        </div>
        
        <SocialLoginButtons />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your Name"
            autoComplete="name"
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded border border-gray-700">
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
              <div className="mt-2 pt-2 border-t border-gray-600 text-gray-500">
                <strong>Example:</strong> MyPassword123!
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{error}</p>}
          {passwordError && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{passwordError}</p>}
          {success && (
            <div className="text-center py-2 bg-green-900/30 rounded">
              <p className="text-xs text-green-400">
                Signup successful! Please check your email to confirm your account before logging in.
              </p>
              <button
                className="mt-3 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          )}
          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={authLoading}>
            {authLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <div className="text-sm text-center text-gray-500 pt-3 border-t border-slate-700">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-500 hover:text-sky-400">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm; 