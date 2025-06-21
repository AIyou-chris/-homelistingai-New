import React, { useState } from 'react';
import { 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  KeyIcon,
  TrashIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  bio: string;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newLeadAlerts: boolean;
  appointmentReminders: boolean;
  marketUpdates: boolean;
  weeklyReports: boolean;
}

interface IntegrationSettings {
  openaiApiKey: string;
  supabaseUrl: string;
  supabaseKey: string;
  emailProvider: string;
  smsProvider: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'integrations' | 'security' | 'billing'>('profile');
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Mock user data
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Doe Real Estate',
    website: 'https://doerealestate.com',
    bio: 'Experienced real estate agent specializing in residential properties in Austin, TX.',
    avatar: 'https://via.placeholder.com/150'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    newLeadAlerts: true,
    appointmentReminders: true,
    marketUpdates: false,
    weeklyReports: true
  });

  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    openaiApiKey: 'sk-...',
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseKey: 'eyJ...',
    emailProvider: 'sendgrid',
    smsProvider: 'twilio'
  });

  const handleProfileSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleIntegrationSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'integrations', name: 'Integrations', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and contact details
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-1 bg-sky-500 text-white rounded-full hover:bg-sky-600">
                    <CameraIcon className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Profile Photo</h4>
                  <p className="text-sm text-gray-500">Upload a new profile photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <Input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <Input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <Input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleProfileSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose how you want to be notified about important updates
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailNotifications ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via text message</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('smsNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.smsNotifications ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">New Lead Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified when new leads come in</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('newLeadAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.newLeadAlerts ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.newLeadAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Appointment Reminders</h4>
                    <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('appointmentReminders')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.appointmentReminders ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Market Updates</h4>
                    <p className="text-sm text-gray-500">Receive market trend updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('marketUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.marketUpdates ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.marketUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                    <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('weeklyReports')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.weeklyReports ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integration Settings */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">API Integrations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your API keys and external service connections
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">OpenAI Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Key</label>
                      <div className="mt-1 relative">
                        <Input
                          type={showApiKey ? 'text' : 'password'}
                          value={integrations.openaiApiKey}
                          onChange={(e) => setIntegrations(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <KeyIcon className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Supabase Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project URL</label>
                      <Input
                        type="url"
                        value={integrations.supabaseUrl}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Key</label>
                      <Input
                        type="password"
                        value={integrations.supabaseKey}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, supabaseKey: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Service Providers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Provider</label>
                      <select
                        value={integrations.emailProvider}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, emailProvider: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      >
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailgun">Mailgun</option>
                        <option value="aws-ses">AWS SES</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMS Provider</label>
                      <select
                        value={integrations.smsProvider}
                        onChange={(e) => setIntegrations(prev => ({ ...prev, smsProvider: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      >
                        <option value="twilio">Twilio</option>
                        <option value="aws-sns">AWS SNS</option>
                        <option value="messagebird">MessageBird</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleIntegrationSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account security and privacy settings
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <Input type="password" className="mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <Input type="password" className="mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <Input type="password" className="mt-1" />
                    </div>
                    <Button variant="primary">Update Password</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="secondary">Enable 2FA</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Session</p>
                        <p className="text-xs text-gray-500">Chrome on macOS • Austin, TX</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Current</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mobile Session</p>
                        <p className="text-xs text-gray-500">Safari on iPhone • Austin, TX</p>
                      </div>
                      <Button variant="secondary" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Billing & Subscription</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your subscription and billing information
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Pro Plan</h4>
                      <p className="text-sm text-gray-500">$29/month • Next billing: Feb 15, 2024</p>
                    </div>
                    <Button variant="secondary">Change Plan</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Method</h4>
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <CreditCardIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/25</p>
                    </div>
                    <Button variant="secondary" size="sm">Update</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Billing History</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pro Plan - January 2024</p>
                        <p className="text-xs text-gray-500">Jan 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">$29.00</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pro Plan - December 2023</p>
                        <p className="text-xs text-gray-500">Dec 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">$29.00</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-red-900 mb-4">Danger Zone</h4>
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-red-900">Delete Account</p>
                      <p className="text-xs text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="danger" size="sm" leftIcon={<TrashIcon className="h-4 w-4" />}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 