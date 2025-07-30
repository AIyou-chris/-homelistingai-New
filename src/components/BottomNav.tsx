import React, { useState } from 'react';
import { HeartIcon, HomeIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import InstallAppModal from './shared/InstallAppModal';
import NewLogo from './shared/NewLogo';

const navItems = [
  { label: 'Home', icon: 'logo', active: true },
  { label: 'Search', icon: MagnifyingGlassIcon, active: false },
  { label: 'Wallet', icon: HeartIcon, active: false },
  { label: 'Profile', icon: UserIcon, active: false },
];

export default function BottomNav() {
  const [installModalOpen, setInstallModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-4">
        {/* White bar with rounded corners */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mx-4">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon === 'logo' ? null : item.icon;
              return (
                <div 
                  key={item.label} 
                  onClick={() => item.label === 'Wallet' && setInstallModalOpen(true)}
                  className={`flex flex-col items-center justify-center flex-1 h-full relative cursor-pointer transition-all duration-200 ${
                    item.active ? 'text-orange-500' : 'text-gray-400'
                  }`}
                >
                  {/* Active indicator - white circle protruding up */}
                  {item.active && (
                    <div className="absolute -top-2 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center">
                      {item.icon === 'logo' ? (
                        <NewLogo size={20} />
                      ) : (
                        <IconComponent className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  )}
                  
                  {/* Icon and text */}
                  <div className={`flex flex-col items-center ${item.active ? 'mt-2' : ''}`}>
                    {!item.active && (
                      item.icon === 'logo' ? (
                        <NewLogo size={24} />
                      ) : (
                        <IconComponent className="w-6 h-6 mb-1" />
                      )
                    )}
                    <span className={`text-xs font-medium ${item.active ? 'text-gray-700' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Install App Modal */}
      <InstallAppModal 
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </>
  );
} 