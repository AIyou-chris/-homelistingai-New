import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import ChatBot from './ChatBot';
import VoiceBot from './VoiceBot';
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
  MessageSquare,
  Mail,
  Mic,
  MessageCircle
} from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
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
    { name: 'AI Chats', href: '/admin/ai-chats', icon: MessageSquare },
    { name: 'Activity', href: '/admin/activity', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <img 
                src="/newlogo.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
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
            {/* Chat Bot Button */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="p-2 text-gray-300 hover:text-blue-400 transition-colors"
              title="AI Chat Assistant"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            
            {/* Voice Bot Button */}
            <button
              onClick={() => setVoiceOpen(!voiceOpen)}
              className="p-2 text-gray-300 hover:text-green-400 transition-colors"
              title="AI Voice Assistant"
            >
              <Mic className="w-5 h-5" />
            </button>
            
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
      
      {/* AI Chat Bot */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBot 
            onLeadCapture={(lead) => {
              console.log('Lead captured from admin chat:', lead);
              // TODO: Handle lead capture for admin
            }}
          />
        </div>
      )}
      
      {/* AI Voice Bot */}
      {voiceOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <VoiceBot showFloatingButton={false} />
        </div>
      )}
    </div>
  );
};

export default AdminNavbar; 