import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Play, Eye, ArrowLeft } from 'lucide-react';
import MobileAppDemo from '../components/shared/MobileAppDemo';

const MobileListingDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mobile App Demo</h1>
              <p className="text-sm text-gray-600">Experience the mobile listing page</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                See Your App in Action
              </h2>
              <p className="text-gray-600">
                Experience the mobile app that your customers will use to view your listings
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowDemo(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Launch Demo
              </Button>
              
              <Button
                onClick={() => setShowDemo(true)}
                variant="outline"
                size="lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview App
              </Button>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Click to see the mobile app experience in a beautiful phone frame</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <MobileAppDemo onClose={() => setShowDemo(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileListingDemoPage; 