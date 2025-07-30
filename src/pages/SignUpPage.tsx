import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import NewLogo from '../components/shared/NewLogo';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear password error when user starts typing
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(null);
    }
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPasswordError(null);

    const passwordValidation = validatePassword(formData.password, formData.confirmPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError((err as Error).message || 'Failed to sign up. Please try again.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        variants={formVariants} 
        initial="hidden" 
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6">
            <Link to="/" className="flex justify-center mb-2">
              <NewLogo size={48} />
            </Link>
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <p className="text-blue-100">Join HomeListingAI today</p>
          </CardHeader>
          
          <CardContent className="space-y-4 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Your full name"
                  autoComplete="name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{passwordError}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800">
                      Account created successfully! Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage; 