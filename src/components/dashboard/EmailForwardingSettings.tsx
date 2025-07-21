import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  enableEmailForwarding, 
  disableEmailForwarding, 
  getEmailForwardingConfig,
  EmailForwardingConfig 
} from '../../services/agentService';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { 
  EnvelopeIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface EmailForwardingSettingsProps {
  onUpdate?: () => void;
}

const EmailForwardingSettings: React.FC<EmailForwardingSettingsProps> = ({ onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<EmailForwardingConfig | null>(null);
  const [forwardingEmail, setForwardingEmail] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (user) {
      loadEmailForwardingConfig();
    }
  }, [user]);

  const loadEmailForwardingConfig = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const config = await getEmailForwardingConfig(user.id);
      setConfig(config);
      if (config) {
        setForwardingEmail(config.forwardingEmail);
      }
    } catch (error) {
      console.error('Error loading email forwarding config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableForwarding = async () => {
    if (!user || !forwardingEmail.trim()) return;
    
    try {
      setLoading(true);
      await enableEmailForwarding(user.id, forwardingEmail.trim());
      await loadEmailForwardingConfig();
      onUpdate?.();
    } catch (error) {
      console.error('Error enabling email forwarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableForwarding = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await disableEmailForwarding(user.id);
      await loadEmailForwardingConfig();
      onUpdate?.();
    } catch (error) {
      console.error('Error disabling email forwarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (config?.uniqueEmailAddress) {
      navigator.clipboard.writeText(config.uniqueEmailAddress);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <EnvelopeIcon className="h-6 w-6 text-sky-500" />
        <h3 className="text-lg font-semibold text-gray-900">Email Forwarding</h3>
      </div>

      {config?.isEnabled ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-800">Email forwarding is active</span>
            </div>
            <p className="text-sm text-green-700">
              Emails sent to your unique address will be forwarded to your personal email.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Unique Email Address
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono">
                  {config.uniqueEmailAddress}
                </div>
                <Button
                  onClick={handleCopyEmail}
                  variant="secondary"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use this address on your listings and marketing materials
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forwarding to
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm">
                {config.forwardingEmail}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleDisableForwarding}
              variant="danger"
            >
              Disable Forwarding
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-800">Set up email forwarding</span>
            </div>
            <p className="text-sm text-blue-700">
              Get a unique email address for your listings. All emails will be forwarded to your personal email.
            </p>
          </div>

          {showSetup ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forward emails to
                </label>
                <Input
                  type="email"
                  value={forwardingEmail}
                  onChange={(e) => setForwardingEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is where you'll receive forwarded emails
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleEnableForwarding}
                  disabled={!forwardingEmail.trim() || loading}
                >
                  {loading ? 'Setting up...' : 'Enable Forwarding'}
                </Button>
                <Button
                  onClick={() => setShowSetup(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowSetup(true)}>
              Set Up Email Forwarding
            </Button>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How it works</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• You get a unique email address like john.doe@homelistingai.com</li>
          <li>• Use this address on your listings and marketing materials</li>
          <li>• All emails sent to this address are forwarded to your personal email</li>
          <li>• You can reply directly from your personal email</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailForwardingSettings; 