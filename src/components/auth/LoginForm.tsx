import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Added Link
import Button from '../shared/Button';
import Input from '../shared/Input';
import { User } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/welcome');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      // The error is logged in AuthContext and then re-thrown and logged here again.
      // This is fine for debugging, but for the user, setError is the main feedback.
      // console.error(err); // Original error is already logged by AuthContext
    }
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
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          isLoading={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      <div className="text-xs text-center text-gray-500 pt-3 border-t border-gray-200">
        <p className="font-semibold">Demo Credentials:</p>
        <p>Email: <code className="text-blue-600">realtor@example.com</code></p>
        <p>Password: <code className="text-blue-600">password</code></p>
      </div>
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
