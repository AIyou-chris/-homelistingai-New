import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Footer from '../components/shared/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Home, ArrowLeft } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/welcome" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
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
                to="/new-signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Sign Up
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
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthPage;
