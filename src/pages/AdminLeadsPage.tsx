import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import LeadsManagement from '../components/admin/LeadsManagement';

const AdminLeadsPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  console.log('AdminLeadsPage render:', { isAuthenticated, user, isLoading });
  
  // Show loading while checking authentication
  if (isLoading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading admin leads...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is admin
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  console.log('Admin check:', { isAdmin, userEmail: user?.email, userRole: user?.role });
  
  if (!isAdmin) {
    console.log('Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('Rendering admin leads page');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leads Management</h1>
          <p className="text-gray-300 text-lg">Track and manage your sales pipeline with marketing automation</p>
        </div>

        {/* Leads Management Component */}
        <LeadsManagement 
          onLeadAction={(action, leadId) => {
            console.log(`Lead action: ${action} on lead: ${leadId}`);
          }}
        />
      </div>
    </div>
  );
};

export default AdminLeadsPage; 