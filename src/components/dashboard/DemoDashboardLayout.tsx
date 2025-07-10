import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  HomeModernIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  QrCodeIcon, 
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const DemoDashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/demo-dashboard', icon: HomeIcon },
    { name: 'Leads', href: '/demo-dashboard/leads', icon: UserGroupIcon, badge: 12 },
    { name: 'Listings', href: '/demo-dashboard/listings', icon: HomeModernIcon },
    { name: 'Appointments', href: '/demo-dashboard/appointments', icon: CalendarIcon, badge: 3 },
    { name: 'Knowledge Base', href: '/demo-dashboard/knowledge-base', icon: DocumentTextIcon },
    { name: 'QR Codes', href: '/demo-dashboard/qr-codes', icon: QrCodeIcon },
    { name: 'Support', href: '/demo-dashboard/contact', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', href: '/demo-dashboard/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Static Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-lg">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <img 
                src="/new hlailogo.png" 
                alt="HomeListingAI" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">HomeListingAI</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-sky-100 text-sky-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`mr-3 h-6 w-6 ${isActive(item.href) ? 'text-sky-500' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DemoDashboardLayout; 