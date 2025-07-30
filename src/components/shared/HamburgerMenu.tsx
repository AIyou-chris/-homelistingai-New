import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Eye, Save, Share2, Facebook, Twitter, Instagram, Linkedin, Mail, Copy } from 'lucide-react';
import { Button } from '../ui/button';

interface HamburgerMenuProps {
  onShow?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onShow, onSave, onShare }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleShow = () => {
    onShow?.();
    setIsOpen(false);
  };

  const handleSave = () => {
    onSave?.();
    setIsOpen(false);
  };

  const handleShare = () => {
    onShare?.();
    setIsOpen(false);
  };

  const shareToSocial = (platform: string) => {
    const url = window.location.href;
    const title = 'Check out this AI-powered property listing!';
    const text = 'I found this amazing property with AI assistance!';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-4">
              {/* Showing Button */}
              <Button
                onClick={handleShow}
                className="w-full justify-start text-left h-auto p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">Showing</div>
                    <div className="text-sm text-blue-700">Preview your listing</div>
                  </div>
                </div>
              </Button>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="w-full justify-start text-left h-auto p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Save className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">Save</div>
                    <div className="text-sm text-green-700">Save to dashboard</div>
                  </div>
                </div>
              </Button>

              {/* Sharing Section */}
              <div className="space-y-3">
                <Button
                  onClick={handleShare}
                  className="w-full justify-start text-left h-auto p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Share2 className="w-6 h-6 text-purple-600" />
                    <div>
                      <div className="font-semibold text-purple-900">Sharing</div>
                      <div className="text-sm text-purple-700">Share your listing</div>
                    </div>
                  </div>
                </Button>

                {/* Social Media Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('linkedin')}
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('email')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('copy')}
                    className="flex items-center gap-2 col-span-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu; 