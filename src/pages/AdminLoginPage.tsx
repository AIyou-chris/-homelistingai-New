import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated as admin
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // After login, check if user has admin role
      // In a real app, you'd verify the user role from the auth context
      // For now, we'll check if the email is the admin email we set up
      if (email === 'support@homelistingai.com') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid credentials or insufficient privileges');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent)] pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 mt-2">
            Administrative login for HomeListingAI
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-white">
              Sign in to Admin Dashboard
            </CardTitle>
            <CardDescription className="text-center text-slate-300">
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@homelistingai.com"
                    className="pl-10 bg-white/10 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white border-0 py-2.5 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in to Admin'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            This is a secure admin area. All access is logged and monitored.
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-2">Demo Credentials:</h3>
          <div className="space-y-1 text-xs text-slate-400">
            <p><strong>Email:</strong> support@homelistingai.com</p>
            <p><strong>Password:</strong> Use your admin password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 