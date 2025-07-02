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
              className="text-gray-500 hover:text-gray-300 transition-colors duration-200 opacity-60 hover:opacity-100"
              title="Admin Login"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
