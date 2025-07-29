import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { forceClearSession } from '../services/authService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const DebugPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleClearSession = () => {
    forceClearSession();
    logout();
    window.location.href = '/';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Debug Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Current Auth State:</h3>
            <div className="text-sm space-y-1">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">LocalStorage:</h3>
            <div className="text-sm space-y-1">
              <p><strong>admin_email:</strong> {localStorage.getItem('admin_email') || 'Not set'}</p>
              <p><strong>admin_password:</strong> {localStorage.getItem('admin_password') ? 'Set' : 'Not set'}</p>
              <p><strong>mock_user:</strong> {localStorage.getItem('mock_user') ? 'Set' : 'Not set'}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleClearSession}
              variant="destructive"
              className="flex-1"
            >
              Clear Session & Logout
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex-1"
            >
              Normal Logout
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>Use "Clear Session & Logout" to force a fresh login.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage; 