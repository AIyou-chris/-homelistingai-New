import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import Footer from '../components/shared/Footer';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  Eye,
  Zap
} from 'lucide-react';

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
        navigate('/welcome');
      }, 2000);
    } catch (err) {
      setError((err as Error).message || 'Failed to sign up. Please try again.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { delay: 0.3, type: "spring" as const, bounce: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>

      {/* Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/new hlailogo.png" 
                alt="HomeListingAI Logo" 
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">HomeListingAI</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link 
                to="/demo" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Demo
              </Link>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Back Button */}
            <div className="md:hidden">
              <Link 
                to="/" 
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={formVariants} 
          initial="hidden" 
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
            <CardHeader className="text-center space-y-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 relative">
              {/* Elegant Icon Instead of Logo */}
              <motion.div 
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-center mb-2"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <CardTitle className="text-3xl font-bold text-white">Join the AI Revolution</CardTitle>
              <p className="text-blue-100 text-lg">Transform your real estate business with intelligent automation</p>
              
              {/* What They're Getting */}
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-robot text-white text-sm"></i>
                  </div>
                  <span className="text-xs text-blue-100">AI Agent</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-chart-line text-white text-sm"></i>
                  </div>
                  <span className="text-xs text-blue-100">Lead Gen</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <i className="fas fa-mobile-alt text-white text-sm"></i>
                  </div>
                  <span className="text-xs text-blue-100">Mobile App</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 p-8">
              {/* Security & Privacy Notice */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Your Privacy is Sacred</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">No data selling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">24hr activation</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-medium">Security Promise:</span> If your account isn't activated within 24 hours, all information is automatically purged from our databases. We never sell, share, or misuse your data.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                    <i className="fas fa-user text-gray-400 text-sm"></i>
                    Full Name
                  </Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Your full name"
                    autoComplete="name"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    Password
                  </Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    Confirm Password
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">{passwordError}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-800">
                        Account created successfully! Welcome to the future of real estate...
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Your AI Empire...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start My AI Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Additional Security Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <i className="fas fa-lock text-green-600"></i>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <i className="fas fa-shield-alt text-blue-600"></i>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <i className="fas fa-eye-slash text-purple-600"></i>
                  <span>Privacy First</span>
                </div>
              </div>

              <div className="text-center pt-2">
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignUpPage; 