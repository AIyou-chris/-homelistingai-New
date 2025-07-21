import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const PostPaymentAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const paymentSuccess = searchParams.get('success') === 'true';
  const planName = searchParams.get('plan') || 'Professional';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const user = await login(formData.email, formData.password);
      
      // After successful login, check if there's scraped property data to save
      if (user?.id && (window as any).saveScrapedPropertyAsListing) {
        console.log('🏠 Checking for scraped property data to save...');
        const listingId = await (window as any).saveScrapedPropertyAsListing(user.id);
        if (listingId) {
          console.log('✅ Scraped property saved as listing:', listingId);
        }
      }
      
      // Navigate to dashboard after successful re-authentication
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Success Header */}
          {paymentSuccess && (
            <motion.div 
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 text-center"
              variants={itemVariants}
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-green-100">
                Welcome to {planName} plan
              </p>
            </motion.div>
          )}

          <CardHeader className="text-center pb-4">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Secure Re-Authentication
              </CardTitle>
              <p className="text-gray-600 text-sm">
                For your security, please sign in again to access your new dashboard
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </motion.div>

              {error && (
                <motion.div 
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
                  variants={itemVariants}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Access My Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Security Notice */}
            <motion.div 
              className="mt-6 p-4 bg-gray-50 rounded-lg border"
              variants={itemVariants}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    What's Next?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Once authenticated, you'll have full access to your AI-powered dashboard with lead management, analytics, and all premium features.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Help Text */}
            <motion.div 
              className="mt-4 text-center text-sm text-gray-500"
              variants={itemVariants}
            >
              <p>
                Having trouble? This should be the same email and password you used during signup.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PostPaymentAuthPage; 