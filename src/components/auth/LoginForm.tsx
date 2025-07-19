import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Added Link
import Button from '../shared/Button';
import Input from '../shared/Input';
import SocialLoginButtons from './SocialLoginButtons';
import { User } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { login, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with email:', email);
    setError(null);
    setShowResend(false);
    setResendSuccess(false);
    setIsLoading(true);
    
    try {
      console.log('Calling login function...');
      const loggedInUser = await login(email, password);
      console.log('Login successful, user:', loggedInUser);
      console.log('User role:', loggedInUser?.role);
      
      // Check if the logged in user is admin and redirect accordingly
      if (loggedInUser && loggedInUser.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('Redirecting to regular dashboard');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err?.message?.toLowerCase() || '';
      
      if (msg.includes('invalid login credentials')) {
        setError('Incorrect password. Please try again.');
      } else if (msg.includes('user not found')) {
        setError('No account found with that email address.');
      } else if (msg.includes('not confirmed') || msg.includes('confirm your email')) {
        setError('Please confirm your email before logging in. Check your inbox (and spam folder) for the confirmation email.');
        setShowResend(true);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendSuccess(false);
    setError(null);
    try {
      // Call Supabase to resend confirmation email
      const { error } = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/auth/v1/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
        },
        body: JSON.stringify({ email, type: 'signup' })
      }).then(res => res.json());
      if (error) {
        setError('Failed to resend confirmation email.');
      } else {
        setResendSuccess(true);
        setShowResend(false);
      }
    } catch {
      setError('Failed to resend confirmation email.');
    }
  };

  const handleSocialError = (error: string) => {
    setError(error);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl border-0">
      <div className="text-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg -m-8 mb-6 p-8">
        <Link to="/" className="flex justify-center mb-4">
          <img src="/new hlailogo.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
        </Link>
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="text-blue-100">Sign in to manage your listings and leads.</p>
      </div>
      
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Email Address</label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Password</label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{error}</p>}
        {showResend && (
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-xs text-blue-600 underline hover:text-blue-800"
              onClick={handleResend}
            >
              Resend confirmation email
            </button>
          </div>
        )}
        {resendSuccess && (
          <p className="text-xs text-green-600 text-center mt-2">Confirmation email sent! Please check your inbox.</p>
        )}
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          isLoading={isLoading || authLoading}
        >
          {isLoading || authLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        
        {/* Debug buttons for testing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                console.log('Testing login with admin credentials...');
                setEmail('admin@homelistingai.com');
                setPassword('AdminPass123!');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Fill Admin Credentials (Dev Only)
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Testing login with agent credentials...');
                setEmail('agent@homelistingai.com');
                setPassword('AgentPass123!');
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Fill Agent Credentials (Dev Only)
            </button>
          </div>
        )}
      </form>
      <div className="text-sm text-center text-gray-600 space-y-2">
        <p>
          Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
        </p>
        <p>
          <Link to="/sales" className="font-medium text-blue-600 hover:text-blue-500 text-xs">
            Discover HomeListingAI features &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
