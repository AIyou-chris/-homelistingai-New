import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SalesFooter from '../components/shared/SalesFooter';
import { useAuth } from '../contexts/AuthContext';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/shared/Navbar';

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  if (isAuthenticated) {
    return <Navigate to={redirectTo || "/dashboard"} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <SalesFooter />
    </div>
  );
};

export default AuthPage;
