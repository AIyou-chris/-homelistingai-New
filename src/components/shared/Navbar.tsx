import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../constants';
import Button from './Button';
import { UserCircleIcon, BellIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon, Bars3Icon } from '@heroicons/react/24/outline'; // Using outline icons
import NewLogo from './NewLogo';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openConsultationModal = () => {
    window.dispatchEvent(new CustomEvent('open-consultation-modal', { detail: { context: 'default' } }));
  };

  return (
    <nav className="bg-gradient-to-r from-sky-400 to-cyan-400 shadow-lg fixed w-full z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <NewLogo size={40} />
              <span className="hidden sm:inline text-2xl font-bold text-white drop-shadow">HomeListingAI</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {/* Navigation Links */}
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Price
              </button>
              <button 
                onClick={() => scrollToSection('what-you-get')}
                className="text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                What You Get
              </button>
              <button 
                onClick={() => scrollToSection('why-choose')}
                className="text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Why
              </button>
              <button 
                onClick={() => scrollToSection('white-label')}
                className="text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                White Label
              </button>
              <button 
                onClick={openConsultationModal}
                className="text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Contact
              </button>

              {isAuthenticated && user ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                  <Link to="/listings" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Listings</Link>
                  
                  <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="relative ml-3">
                    <div>
                      <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="max-w-xs bg-slate-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
                      >
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon className="h-8 w-8 rounded-full text-gray-400" />
                      </button>
                    </div>
                    {isProfileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-slate-600">Signed in as <br/><strong className="text-white">{user.email}</strong></div>
                        <Link to="/settings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white w-full text-left flex items-center">
                           <Cog6ToothIcon className="h-5 w-5 mr-2" /> Settings
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white flex items-center"
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/signup" 
                    className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                  <Button onClick={() => navigate('/auth')} variant="primary" size="sm">Login</Button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile Navigation Links */}
            <button 
              onClick={() => { scrollToSection('how-it-works'); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              How It Works
            </button>
            <button 
              onClick={() => { scrollToSection('pricing'); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Price
            </button>
            <button 
              onClick={() => { scrollToSection('what-you-get'); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              What You Get
            </button>
            <button 
              onClick={() => { scrollToSection('why-choose'); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Why
            </button>
            <button 
              onClick={() => { scrollToSection('white-label'); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              White Label
            </button>
            <button 
              onClick={() => { openConsultationModal(); setIsMobileMenuOpen(false); }}
              className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Contact
            </button>

            {isAuthenticated && user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                <Link to="/listings" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Listings</Link>
                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Settings</Link>
                <div className="border-t border-slate-700 pt-3">
                    <button
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                        Logout
                    </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Up
                </Link>
                <Button 
                  onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
