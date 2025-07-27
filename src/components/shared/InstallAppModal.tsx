import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | 'unknown'>('unknown');
  const [browserType, setBrowserType] = useState<'safari' | 'chrome' | 'other'>('other');
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');

    // Detect browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    setBrowserType(isSafari ? 'safari' : isChrome ? 'chrome' : 'other');

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(false);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App installed successfully');
      }
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  const getInstallInstructions = () => {
    if (deviceType === 'mobile') {
      if (browserType === 'safari') {
        return {
          title: 'Add to Home Screen (iOS)',
          steps: [
            'Tap the Share button (square with arrow up)',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to confirm',
            'Your app will now appear on your home screen!'
          ]
        };
      } else {
        return {
          title: 'Install App (Android)',
          steps: [
            'Tap the menu button (three dots)',
            'Select "Add to Home screen" or "Install app"',
            'Tap "Add" or "Install" to confirm',
            'Your app will now appear on your home screen!'
          ]
        };
      }
    } else {
      return {
        title: 'Install App (Desktop)',
        steps: [
          'Look for the install button in your browser address bar',
          'Click the install button (usually looks like a download icon)',
          'Click "Install" in the popup that appears',
          'Your app will now open in its own window!'
        ]
      };
    }
  };

  const instructions = getInstallInstructions();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <HeartIcon className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Install HomeListingAI</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* App Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                  <img 
                    src="/new hlailogo.png" 
                    alt="HomeListingAI" 
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">HomeListingAI</h3>
                <p className="text-sm text-gray-600">AI-powered real estate platform</p>
              </div>

              {/* Install Button (if available) */}
              {canInstall && (
                <div className="mb-6">
                  <button
                    onClick={handleInstall}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Install App
                  </button>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-center">
                  {deviceType === 'mobile' ? (
                    <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600 mr-3" />
                  ) : (
                    <ComputerDesktopIcon className="w-6 h-6 text-blue-600 mr-3" />
                  )}
                  <h4 className="font-medium text-gray-900">{instructions.title}</h4>
                </div>

                <div className="space-y-3">
                  {instructions.steps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Why install?</h5>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Quick access from home screen
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Works offline
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Native app experience
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Faster loading times
                    </li>
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallAppModal; 