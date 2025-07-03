import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, WifiIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner, { InlineSpinner } from '../components/shared/LoadingSpinner';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('support@homelistingai.com');
  const [password, setPassword] = useState('Jake@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [forceShow, setForceShow] = useState(false);
  
  const { login, loading, error, clearError, connectionStatus, forceHealthCheck, user } = useAuth();
  const navigate = useNavigate();

  // Force show login form after 2 seconds if still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Forcing admin login form to show');
      setForceShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Only redirect if we have a confirmed admin user (not during loading)
  if (!loading && user?.email === 'support@homelistingai.com') {
    console.log('Redirecting authenticated admin user to dashboard');
    return <Navigate to="/admin" replace />;
  }

  // Show loading spinner only if we're still loading AND haven't forced show
  if (loading && !forceShow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <LoadingSpinner size="lg" />
          <p className="mt-4">Loading admin login...</p>
          <button 
            onClick={() => setForceShow(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Skip Loading
          </button>
        </div>
      </div>
    );
  }

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Auto-hide demo credentials after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDemo(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      console.log('🔐 Attempting admin login with:', email);
      
      // Force connection check in demo mode
      if (!connectionStatus.isConnected) {
        console.log('⚡ Forcing health check...');
        const isHealthy = await forceHealthCheck();
        if (!isHealthy) {
          console.log('⚠️ Health check failed, continuing anyway in demo mode');
        }
      }

      const user = await login(email, password);
      console.log('✅ Admin login successful:', user);
      console.log('🚀 Navigating to /admin dashboard');
      
      // Small delay to ensure state updates
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('❌ Admin login failed:', error);
      // Error is already set by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    const isHealthy = await forceHealthCheck();
    if (isHealthy) {
      alert('✅ Connection test successful!');
    } else {
      alert('❌ Connection test failed. Please check your internet connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Secure administrative portal
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                             {connectionStatus.isConnected ? (
                 <WifiIcon className="h-5 w-5 text-green-400" />
               ) : (
                 <XMarkIcon className="h-5 w-5 text-red-400" />
               )}
              <span className="text-sm text-white">
                {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={handleTestConnection}
              className="text-xs text-blue-300 hover:text-blue-200 underline"
            >
              Test Connection
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Last check: {Math.round(connectionStatus.timeSinceLastCheck / 1000)}s ago
          </div>
        </div>

        {/* Demo Credentials (Auto-hide) */}
        {showDemo && (
          <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-blue-200">Demo Credentials</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="text-blue-300 hover:text-blue-200 text-xs"
              >
                Hide
              </button>
            </div>
            <div className="mt-2 text-xs text-blue-100 space-y-1">
              <div>Email: support@homelistingai.com</div>
              <div>Password: Jake@2024</div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Display */}
            {error && (
              <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
                <button
                  onClick={clearError}
                  className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Administrator Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter admin email"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm pr-12"
                  placeholder="Enter password"
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isSubmitting || loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading || !connectionStatus.isConnected}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loading ? (
                <>
                  <InlineSpinner size="sm" />
                  <span className="ml-2">Authenticating...</span>
                </>
              ) : (
                'Access Admin Portal'
              )}
            </button>

            {/* Connection Warning */}
            {!connectionStatus.isConnected && (
              <div className="text-center text-sm text-yellow-300">
                ⚠️ No connection to authentication service
              </div>
            )}
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center text-xs text-gray-400 space-y-1">
              <div>🔒 This is a secure administrative area</div>
              <div>All access attempts are logged and monitored</div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 