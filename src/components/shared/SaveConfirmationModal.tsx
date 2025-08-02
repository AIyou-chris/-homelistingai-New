import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface SaveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
}

const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({
  isOpen,
  onClose,
  propertyTitle = 'Property'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Logo */}
            <div className="relative p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img 
                  src="/newlogo.png" 
                  alt="Logo" 
                  className="h-12 w-auto"
                />
              </div>
              
              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              {/* Success Message */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Saved Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                {propertyTitle} has been added to your favorites.
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Browsing
                </button>
                <button
                  onClick={() => {
                    // TODO: Navigate to favorites/saved listings
                    onClose();
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Saved
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveConfirmationModal; 