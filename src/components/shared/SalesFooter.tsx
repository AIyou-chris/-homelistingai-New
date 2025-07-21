import React from 'react';

const SalesFooter: React.FC = () => (
  <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 relative z-20" id="contact">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
        <div className="mb-8 md:mb-0 flex-1 min-w-[200px]">
          <div className="flex items-center mb-4">
            <img src="/new hlailogo.png" alt="HomeListingAI Logo" className="h-8 mr-2" />
            <span className="font-bold text-lg tracking-tight">AI</span>
          </div>
          <p className="text-gray-400 mb-4 text-sm max-w-xs">Transform your real estate business with AI-powered listings and automated lead generation.</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-green-400 text-green-400 bg-gray-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
            30-Day Money-Back Guarantee
          </div>
        </div>
        <div className="flex flex-1 justify-between gap-12">
          <div>
            <h4 className="font-semibold mb-3 text-gray-100">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#how" className="hover:text-blue-400">How It Works</a></li>
              <li><a href="#guarantee" className="hover:text-blue-400">Guarantee</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-100">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-100">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@homelistingai.com" className="hover:text-blue-400">support@homelistingai.com</a></li>
              <li><span className="text-gray-400">Seattle, WA</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        © 2024 HomeListingAI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default SalesFooter; 