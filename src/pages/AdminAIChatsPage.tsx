import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import AIChatsManagement from '../components/admin/AIChatsManagement';

const AdminAIChatsPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  console.log('AdminAIChatsPage render:', { isAuthenticated, user, isLoading });
  
  // Show loading while checking authentication
  if (isLoading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading AI chats...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user is admin
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  console.log('Admin check:', { isAdmin, userEmail: user?.email, userRole: user?.role });
  
  if (!isAdmin) {
    console.log('Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('Rendering admin AI chats page');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Chats Management</h1>
          <p className="text-gray-300 text-lg">Monitor and manage AI-powered sales and support conversations</p>
        </div>

        {/* AI Chats Management Component */}
        <AIChatsManagement 
          onChatAction={(action, chatId) => {
            console.log(`Chat action: ${action} on chat: ${chatId}`);
          }}
        />
      </div>
    </div>
  );
};

export default AdminAIChatsPage; 