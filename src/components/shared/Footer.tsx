import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-gray-400 py-6 text-center shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
            <p className="text-xs mt-1">
              Built for Realtors, Powered by AI.
            </p>
          </div>
          
          {/* Admin Login Link */}
          <div className="text-xs">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
              title="Admin Login"
            >
              🔐 Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
