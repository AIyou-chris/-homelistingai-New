
import React from 'react';
import { APP_NAME } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-gray-400 py-6 text-center shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-xs mt-1">
          Built for Realtors, Powered by AI.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
