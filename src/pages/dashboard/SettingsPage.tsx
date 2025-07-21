import React, { useState } from 'react';
import { 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  TrashIcon,
  CameraIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Image as ImageIcon } from 'lucide-react';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import EmailForwardingSettings from '../../components/dashboard/EmailForwardingSettings';
import * as authService from '../../services/authService';

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
  newLeadAlerts: boolean;
  appointmentReminders: boolean;

}



const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'email' | 'security' | 'billing'>('notifications');
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
    newLeadAlerts: true,
    appointmentReminders: true
  });



  // Company logos state
  const [companyLogos, setCompanyLogos] = useState<Array<{ url: string; file?: File; isPrimary: boolean }>>([
    { url: '/new hlailogo.png', isPrimary: true },
  ]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newLogos = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
      isPrimary: false
    }));
    setCompanyLogos(prev => [...prev, ...newLogos]);
  };

  // Set primary logo
  const setPrimaryLogo = (idx: number) => {
    setCompanyLogos(prev => prev.map((logo, i) => ({ ...logo, isPrimary: i === idx })));
  };

  // Delete logo
  const deleteLogo = (idx: number) => {
    setCompanyLogos(prev => prev.filter((_, i) => i !== idx));
  };

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

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.')) {
      try {
        await authService.deleteUserAccount();
      } catch (error: any) {
        alert(`Failed to delete account: ${error.message}`);
      }
    }
  };



  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
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


              </div>
              <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-200 rounded-xl shadow p-6 flex items-center gap-4">
                  <svg className="h-8 w-8 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                  <div>
                    <h3 className="text-lg font-semibold text-sky-700 mb-1">Push Notifications</h3>
                    <p className="text-gray-700 text-sm">Push notifications are coming soon! You’ll be able to receive instant updates right in your browser or mobile device for new leads, appointments, and more.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set up your email forwarding and notification preferences
                </p>
              </div>

              {/* Email Forwarding Settings */}
              <EmailForwardingSettings onUpdate={handleProfileSave} />

              {/* Email Service Status */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Email Service Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Resend Email Service</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Domain Verification</span>
                    </div>
                    <span className="text-xs text-yellow-600 font-medium">Pending</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <p>• Domain verification required to send to external recipients</p>
                    <p>• Visit <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">resend.com/domains</a> to verify your domain</p>
                  </div>
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

                {/* Delete Account Section */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-red-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="secondary" 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="flex justify-center">
              <div className="w-full max-w-xl">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-semibold text-sky-700">$59</span>
                    <span className="text-base text-gray-700">/month per listing</span>
                    <span className="line-through text-gray-400 text-base ml-2">$99</span>
                    <span className="text-green-600 text-base ml-2 font-medium">Launch Special</span>
                  </div>
                  <div className="w-full mt-2">
                    <h4 className="text-base font-medium text-gray-900 mb-3">How Billing Works</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
                      <li><span className="font-semibold">$59/month</span> for each active listing.</li>
                      <li>To stop billing for a listing, simply delete/cancel the listing in HomeListingAI.</li>
                      <li>When you delete a listing, your PayPal subscription for that listing will be canceled automatically.</li>
                      <li>No need to visit PayPal to manage or cancel your subscription—everything is handled here.</li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                      For any billing questions, contact <a href="mailto:support@homelistingai.com" className="text-sky-600 hover:underline">support@homelistingai.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-6">
              <a
                href="/dashboard/listings"
                className="inline-block px-6 py-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold shadow transition-colors text-base border border-sky-200"
                style={{ boxShadow: '0 2px 12px 0 rgba(56,189,248,0.08)' }}
              >
                To cancel a listing, <span className="underline">click here</span>
              </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 