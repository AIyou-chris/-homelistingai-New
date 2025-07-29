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

interface EmailSettings {
  // Email Forwarding (Current)
  forwardEmail: string;
  autoForward: boolean;
  forwardLeads: boolean;
  forwardMessages: boolean;
  forwardAppointments: boolean;
  
  // AI Email Integration
  integrationMethod: 'forwarding' | 'oauth' | 'api';
  emailProvider: 'gmail' | 'outlook' | 'yahoo' | 'custom';
  
  // OAuth Settings
  oauthEnabled: boolean;
  oauthProvider: string;
  oauthEmail: string;
  
  // API Settings
  apiEnabled: boolean;
  apiKey: string;
  apiSecret: string;
  
  // AI Processing
  aiProcessEmails: boolean;
  autoReplyEnabled: boolean;
  leadScoringEnabled: boolean;
  smartRoutingEnabled: boolean;
  
  // Advanced Features
  emailTemplates: boolean;
  followUpSequences: boolean;
  marketAnalysis: boolean;
  competitorTracking: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'email' | 'security' | 'billing'>('profile');
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

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    // Email Forwarding (Current)
    forwardEmail: 'assistant@doerealestate.com',
    autoForward: true,
    forwardLeads: true,
    forwardMessages: true,
    forwardAppointments: true,
    
    // AI Email Integration
    integrationMethod: 'forwarding',
    emailProvider: 'gmail',
    
    // OAuth Settings
    oauthEnabled: false,
    oauthProvider: '',
    oauthEmail: '',
    
    // API Settings
    apiEnabled: false,
    apiKey: '',
    apiSecret: '',
    
    // AI Processing
    aiProcessEmails: true,
    autoReplyEnabled: false,
    leadScoringEnabled: true,
    smartRoutingEnabled: true,
    
    // Advanced Features
    emailTemplates: true,
    followUpSequences: false,
    marketAnalysis: false,
    competitorTracking: false
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

  const handleEmailToggle = (key: keyof EmailSettings) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEmailSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-300">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
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
                <h3 className="text-lg font-medium text-white">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-300">
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
                  <button className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    <CameraIcon className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Profile Photo</h4>
                  <p className="text-sm text-gray-300">Upload a new profile photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">First Name</label>
                  <Input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Last Name</label>
                  <Input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Company</label>
                  <Input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    className="mt-1 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Website</label>
                  <Input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="mt-1 bg-white border-gray-300 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
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
                <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Choose how you want to be notified about important updates
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-300">Receive notifications via email</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-700'
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
                    <h4 className="text-sm font-medium text-white">SMS Notifications</h4>
                    <p className="text-sm text-gray-300">Receive notifications via text message</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('smsNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.smsNotifications ? 'bg-blue-600' : 'bg-gray-700'
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
                    <h4 className="text-sm font-medium text-white">New Lead Alerts</h4>
                    <p className="text-sm text-gray-300">Get notified when new leads come in</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('newLeadAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.newLeadAlerts ? 'bg-blue-600' : 'bg-gray-700'
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
                    <h4 className="text-sm font-medium text-white">Appointment Reminders</h4>
                    <p className="text-sm text-gray-300">Get reminded about upcoming appointments</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('appointmentReminders')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.appointmentReminders ? 'bg-blue-600' : 'bg-gray-700'
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
                    <h4 className="text-sm font-medium text-white">Market Updates</h4>
                    <p className="text-sm text-gray-300">Receive market trend updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('marketUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.marketUpdates ? 'bg-blue-600' : 'bg-gray-700'
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
                    <h4 className="text-sm font-medium text-white">Weekly Reports</h4>
                    <p className="text-sm text-gray-300">Receive weekly performance reports</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('weeklyReports')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.weeklyReports ? 'bg-blue-600' : 'bg-gray-700'
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

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-8">
              {/* Email Integration Method */}
              <div>
                <h3 className="text-lg font-medium text-white">🤖 AI Email Integration</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Choose how to connect your email for AI-powered lead management
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Email Forwarding Option */}
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  emailSettings.integrationMethod === 'forwarding' 
                    ? 'border-blue-500 bg-blue-50/10' 
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`} onClick={() => setEmailSettings(prev => ({ ...prev, integrationMethod: 'forwarding' }))}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Email Forwarding</h4>
                      <p className="text-xs text-gray-300">Easiest Setup</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">Set up email forwarding rules. No passwords needed, just forward emails to our system.</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs text-green-400">Secure</span>
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-xs text-blue-400">Easy</span>
                  </div>
                </div>

                {/* OAuth Option */}
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  emailSettings.integrationMethod === 'oauth' 
                    ? 'border-blue-500 bg-blue-50/10' 
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`} onClick={() => setEmailSettings(prev => ({ ...prev, integrationMethod: 'oauth' }))}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">OAuth Connect</h4>
                      <p className="text-xs text-gray-300">Most Secure</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">Connect via OAuth with Gmail, Outlook, or Yahoo. No passwords stored.</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs text-green-400">Very Secure</span>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-xs text-yellow-400">Medium Setup</span>
                  </div>
                </div>

                {/* API Option */}
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  emailSettings.integrationMethod === 'api' 
                    ? 'border-blue-500 bg-blue-50/10' 
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`} onClick={() => setEmailSettings(prev => ({ ...prev, integrationMethod: 'api' }))}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <CogIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">API Integration</h4>
                      <p className="text-xs text-gray-300">Advanced</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">Use API keys for enterprise-level integration. Full control and customization.</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span className="text-xs text-purple-400">Professional</span>
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-xs text-red-400">Complex</span>
                  </div>
                </div>
              </div>

              {/* Email Provider Selection */}
              {emailSettings.integrationMethod !== 'forwarding' && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">Email Provider</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['gmail', 'outlook', 'yahoo', 'custom'].map((provider) => (
                      <button
                        key={provider}
                        onClick={() => setEmailSettings(prev => ({ ...prev, emailProvider: provider as any }))}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          emailSettings.emailProvider === provider
                            ? 'border-blue-500 bg-blue-50/10 text-blue-400'
                            : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <span className="capitalize">{provider}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* OAuth Settings */}
              {emailSettings.integrationMethod === 'oauth' && (
                <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-md font-medium text-white">🔐 OAuth Connection</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-white">Enable OAuth</h5>
                        <p className="text-xs text-gray-300">Connect your email account securely</p>
                      </div>
                      <button
                        onClick={() => setEmailSettings(prev => ({ ...prev, oauthEnabled: !prev.oauthEnabled }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailSettings.oauthEnabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailSettings.oauthEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    {emailSettings.oauthEnabled && (
                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder="your-email@gmail.com"
                          value={emailSettings.oauthEmail}
                          onChange={(e) => setEmailSettings(prev => ({ ...prev, oauthEmail: e.target.value }))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                        <Button variant="primary" size="sm">
                          Connect {emailSettings.emailProvider.charAt(0).toUpperCase() + emailSettings.emailProvider.slice(1)} Account
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* API Settings */}
              {emailSettings.integrationMethod === 'api' && (
                <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-md font-medium text-white">🔑 API Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-white">Enable API</h5>
                        <p className="text-xs text-gray-300">Use API keys for integration</p>
                      </div>
                      <button
                        onClick={() => setEmailSettings(prev => ({ ...prev, apiEnabled: !prev.apiEnabled }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailSettings.apiEnabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailSettings.apiEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    {emailSettings.apiEnabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300">API Key</label>
                          <Input
                            type="password"
                            placeholder="Enter your API key"
                            value={emailSettings.apiKey}
                            onChange={(e) => setEmailSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300">API Secret</label>
                          <Input
                            type="password"
                            placeholder="Enter your API secret"
                            value={emailSettings.apiSecret}
                            onChange={(e) => setEmailSettings(prev => ({ ...prev, apiSecret: e.target.value }))}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Processing Features */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">🧠 AI Processing Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">AI Email Processing</h5>
                      <p className="text-xs text-gray-300">Automatically analyze incoming emails</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, aiProcessEmails: !prev.aiProcessEmails }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.aiProcessEmails ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.aiProcessEmails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Auto Reply</h5>
                      <p className="text-xs text-gray-300">Send automatic responses</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, autoReplyEnabled: !prev.autoReplyEnabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.autoReplyEnabled ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.autoReplyEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Lead Scoring</h5>
                      <p className="text-xs text-gray-300">Score leads automatically</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, leadScoringEnabled: !prev.leadScoringEnabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.leadScoringEnabled ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.leadScoringEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Smart Routing</h5>
                      <p className="text-xs text-gray-300">Route emails intelligently</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, smartRoutingEnabled: !prev.smartRoutingEnabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.smartRoutingEnabled ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.smartRoutingEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">🚀 Advanced Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Email Templates</h5>
                      <p className="text-xs text-gray-300">Pre-built response templates</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, emailTemplates: !prev.emailTemplates }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.emailTemplates ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.emailTemplates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Follow-up Sequences</h5>
                      <p className="text-xs text-gray-300">Automated follow-up campaigns</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, followUpSequences: !prev.followUpSequences }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.followUpSequences ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.followUpSequences ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Market Analysis</h5>
                      <p className="text-xs text-gray-300">Analyze market trends</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, marketAnalysis: !prev.marketAnalysis }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.marketAnalysis ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.marketAnalysis ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-white">Competitor Tracking</h5>
                      <p className="text-xs text-gray-300">Monitor competitor activity</p>
                    </div>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, competitorTracking: !prev.competitorTracking }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailSettings.competitorTracking ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailSettings.competitorTracking ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Legacy Email Forwarding */}
              {emailSettings.integrationMethod === 'forwarding' && (
                <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-md font-medium text-white">📧 Email Forwarding Setup</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Forward Email Address</label>
                      <Input
                        type="email"
                        value={emailSettings.forwardEmail}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, forwardEmail: e.target.value }))}
                        placeholder="assistant@yourdomain.com"
                        className="bg-white border-gray-300 text-gray-900"
                      />
                      <p className="text-xs text-gray-400 mt-1">Set up forwarding rules in your email provider to send emails here</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-white">Auto-Forward</h5>
                          <p className="text-xs text-gray-300">Automatically forward all incoming emails</p>
                        </div>
                        <button
                          onClick={() => setEmailSettings(prev => ({ ...prev, autoForward: !prev.autoForward }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            emailSettings.autoForward ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailSettings.autoForward ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-white">Forward Leads</h5>
                          <p className="text-xs text-gray-300">Forward new lead notifications</p>
                        </div>
                        <button
                          onClick={() => setEmailSettings(prev => ({ ...prev, forwardLeads: !prev.forwardLeads }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            emailSettings.forwardLeads ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailSettings.forwardLeads ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-white">Forward Messages</h5>
                          <p className="text-xs text-gray-300">Forward all incoming messages</p>
                        </div>
                        <button
                          onClick={() => setEmailSettings(prev => ({ ...prev, forwardMessages: !prev.forwardMessages }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            emailSettings.forwardMessages ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailSettings.forwardMessages ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-white">Forward Appointments</h5>
                          <p className="text-xs text-gray-300">Forward appointment reminders</p>
                        </div>
                        <button
                          onClick={() => setEmailSettings(prev => ({ ...prev, forwardAppointments: !prev.forwardAppointments }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            emailSettings.forwardAppointments ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailSettings.forwardAppointments ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleEmailSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save AI Email Settings'}
                </Button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Manage your account security and privacy settings
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Current Password</label>
                      <Input type="password" className="mt-1 bg-white border-gray-300 text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">New Password</label>
                      <Input type="password" className="mt-1 bg-white border-gray-300 text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                      <Input type="password" className="mt-1 bg-white border-gray-300 text-gray-900" />
                    </div>
                    <Button variant="primary">Update Password</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="secondary">Enable 2FA</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Current Session</p>
                        <p className="text-xs text-gray-300">Chrome on macOS • Austin, TX</p>
                      </div>
                      <span className="text-xs text-green-400 font-medium">Current</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Mobile Session</p>
                        <p className="text-xs text-gray-300">Safari on iPhone • Austin, TX</p>
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
                <h3 className="text-lg font-medium text-white">Billing & Subscription</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Manage your subscription and billing information
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-white">Pro Plan</h4>
                      <p className="text-sm text-gray-300">$29/month • Next billing: Feb 15, 2024</p>
                    </div>
                    <Button variant="secondary">Change Plan</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Payment Method</h4>
                  <div className="flex items-center space-x-4 p-4 border border-gray-700 rounded-lg">
                    <CreditCardIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-300">Expires 12/25</p>
                    </div>
                    <Button variant="secondary" size="sm">Update</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Billing History</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Pro Plan - January 2024</p>
                        <p className="text-xs text-gray-300">Jan 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">$29.00</p>
                        <p className="text-xs text-green-400">Paid</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Pro Plan - December 2023</p>
                        <p className="text-xs text-gray-300">Dec 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">$29.00</p>
                        <p className="text-xs text-green-400">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-red-400 mb-4">Danger Zone</h4>
                  <div className="flex items-center justify-between p-4 bg-red-900 border border-red-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-red-400">Delete Account</p>
                      <p className="text-xs text-red-400">Permanently delete your account and all data</p>
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