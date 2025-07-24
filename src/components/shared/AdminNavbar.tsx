import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import { 
  Home, 
  Users, 
  Settings, 
  Database, 
  Cpu, 
  Shield, 
  LogOut,
  BarChart3,
  Activity,
  Globe,
  Target,
  MessageSquare
} from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Leads', href: '/admin/leads', icon: Target },
    { name: 'AI Training', href: '/admin/ai', icon: Cpu },
    { name: 'System', href: '/admin/system', icon: Database },
    { name: 'Activity', href: '/admin/activity', icon: Activity },
    { name: 'Security', href: '/admin/security', icon: Shield },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <img 
                src="/new hlailogo.png" 
                alt="HomeListingAI" 
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-white">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">Admin</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar; 