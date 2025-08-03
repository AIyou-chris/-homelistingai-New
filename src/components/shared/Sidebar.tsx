
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, ListBulletIcon, ArrowUpOnSquareIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Listings', href: '/listings', icon: ListBulletIcon },
  { name: 'Upload Listing', href: '/demo-dashboard', icon: ArrowUpOnSquareIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-800 shadow-lg hidden md:block overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-5 w-5 mr-3 shrink-0 ${ isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-700">
        <NavLink
            to="/help" // Assuming a help page or external link
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white group"
        >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            Help & Support
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
