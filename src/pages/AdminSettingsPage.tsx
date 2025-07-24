import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  Settings, 
  Shield, 
  Users, 
  Database, 
  Globe, 
  Bell, 
  Key,
  Eye,
  Clock,
  Zap,
  Cloud,
  Server,
  Activity,
  BarChart3,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Button from '../components/shared/Button';

const AdminSettingsPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4">⏳</div>
          <p className="text-white">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const settingsCategories = [
    {
      name: 'General Settings',
      icon: Settings,
      settings: [
        { name: 'Site Name', value: 'HomeListingAI', type: 'text' },
        { name: 'Admin Email', value: 'support@homelistingai.com', type: 'email' },
        { name: 'Timezone', value: 'UTC-5 (Eastern)', type: 'select' },
        { name: 'Language', value: 'English', type: 'select' }
      ]
    },
    {
      name: 'Security Settings',
      icon: Shield,
      settings: [
        { name: 'Two-Factor Auth', value: 'Enabled', type: 'toggle' },
        { name: 'Session Timeout', value: '30 minutes', type: 'select' },
        { name: 'Password Policy', value: 'Strong', type: 'select' },
        { name: 'IP Whitelist', value: 'Disabled', type: 'toggle' }
      ]
    },
    {
      name: 'User Management',
      icon: Users,
      settings: [
        { name: 'User Registration', value: 'Enabled', type: 'toggle' },
        { name: 'Email Verification', value: 'Required', type: 'toggle' },
        { name: 'Default Role', value: 'User', type: 'select' },
        { name: 'Max Users', value: 'Unlimited', type: 'text' }
      ]
    },
    {
      name: 'System Settings',
      icon: Server,
      settings: [
        { name: 'Maintenance Mode', value: 'Disabled', type: 'toggle' },
        { name: 'Auto Backups', value: 'Daily', type: 'select' },
        { name: 'Log Retention', value: '90 days', type: 'select' },
        { name: 'Cache TTL', value: '1 hour', type: 'select' }
      ]
    },
    {
      name: 'AI Settings',
      icon: Zap,
      settings: [
        { name: 'AI Model', value: 'GPT-4', type: 'select' },
        { name: 'Training Frequency', value: 'Weekly', type: 'select' },
        { name: 'Response Timeout', value: '30 seconds', type: 'select' },
        { name: 'Max Tokens', value: '4000', type: 'text' }
      ]
    },
    {
      name: 'Notification Settings',
      icon: Bell,
      settings: [
        { name: 'Email Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'SMS Notifications', value: 'Disabled', type: 'toggle' },
        { name: 'Admin Alerts', value: 'Enabled', type: 'toggle' },
        { name: 'System Updates', value: 'Enabled', type: 'toggle' }
      ]
    }
  ];

  const getSettingValue = (setting: any) => {
    if (setting.type === 'toggle') {
      return setting.value === 'Enabled' ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-gray-500/10';
    }
    return 'text-blue-500 bg-blue-500/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-300 text-lg">Configure system preferences, security, and user management</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <span className="text-gray-300 font-medium text-sm">{setting.name}</span>
                        <p className="text-gray-500 text-xs">{setting.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{setting.value}</span>
                        <Badge className={getSettingValue(setting)}>
                          {setting.type === 'toggle' ? (setting.value === 'Enabled' ? 'ON' : 'OFF') : 'Edit'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" className="w-full">
                    Edit Settings
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Backup Database</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Security Scan</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>User Export</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Generate Report</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Clear Cache</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>System Health</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Update DNS</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>Rotate Keys</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage; 