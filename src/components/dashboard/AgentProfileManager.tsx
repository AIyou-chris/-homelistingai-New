import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { AgentProfile, AgentEmailConfig } from '../../types';
import * as agentService from '../../services/agentService';
import Button from '../shared/Button';
import Input from '../shared/Input';

interface AgentProfileManagerProps {
  onProfileUpdate?: (profile: AgentProfile) => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  bio: string;
}

const AgentProfileManager: React.FC<AgentProfileManagerProps> = ({ onProfileUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    bio: ''
  });
  const [emailConfig, setEmailConfig] = useState<AgentEmailConfig>({
    type: 'user_provided',
    email: '',
    isVerified: false
  });
  const [showEmailOptions, setShowEmailOptions] = useState(false);

  useEffect(() => {
    loadAgentProfile();
  }, [user]);

  const loadAgentProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const agentProfile = await agentService.getAgentProfile(user.id);
      
      if (agentProfile) {
        setProfile(agentProfile);
        setFormData({
          firstName: agentProfile.firstName,
          lastName: agentProfile.lastName,
          email: agentProfile.email,
          phone: agentProfile.phone || '',
          company: agentProfile.company || '',
          website: agentProfile.website || '',
          bio: agentProfile.bio || ''
        });
        setEmailConfig(agentProfile.email_config || {
          type: 'user_provided',
          email: agentProfile.email,
          isVerified: false
        });
      } else {
        // Create default profile
        const defaultFormData = {
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: '',
          company: '',
          website: '',
          bio: ''
        };
        setFormData(defaultFormData);
        setEmailConfig({
          type: 'user_provided',
          email: user.email || '',
          isVerified: false
        });
      }
    } catch (error) {
      console.error('Error loading agent profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      if (profile?.id) {
        // Update existing profile
        const updatedProfile = await agentService.updateAgentProfile(user.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          website: formData.website,
          bio: formData.bio,
          email_config: emailConfig
        });
        setProfile(updatedProfile);
      } else {
        // Create new profile
        const newProfile = await agentService.createAgentProfile({
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          website: formData.website,
          bio: formData.bio,
          emailConfig: emailConfig
        });
        setProfile(newProfile);
      }
      
      onProfileUpdate?.(profile!);
    } catch (error) {
      console.error('Error saving agent profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateEmailOptions = () => {
    if (!formData.firstName || !formData.lastName) return [];

    const options: Array<{
      type: 'user_provided' | 'auto_generated' | 'custom_domain';
      label: string;
      email: string;
      description: string;
      icon: React.ComponentType<{ className?: string }>;
      domain?: string;
    }> = [
      {
        type: 'user_provided',
        label: 'Use Current Email',
        email: formData.email,
        description: 'Keep your existing email address',
        icon: EnvelopeIcon
      }
    ];

    // Auto-generated option
    const autoEmail = agentService.generateAgentEmail(
      formData.firstName,
      formData.lastName
    );
    options.push({
      type: 'auto_generated',
      label: 'Auto-Generated Email',
      email: autoEmail.email,
      description: 'Professional email with your name',
      icon: SparklesIcon
    });

    // Company domain option
    if (formData.company) {
      const companyEmail = agentService.generateAgentEmail(
        formData.firstName,
        formData.lastName,
        formData.company
      );
      if (companyEmail.type === 'custom_domain') {
        options.push({
          type: 'custom_domain',
          label: 'Company Email',
          email: companyEmail.email,
          description: `Email using your company domain`,
          icon: BuildingOfficeIcon,
          domain: companyEmail.domain
        });
      }
    }

    return options;
  };

  const handleEmailOptionSelect = (option: any) => {
    const newEmailConfig: AgentEmailConfig = {
      type: option.type,
      email: option.email,
      domain: option.domain,
      isVerified: false
    };
    setEmailConfig(newEmailConfig);
    setFormData(prev => ({ ...prev, email: option.email }));
    setShowEmailOptions(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  const emailOptions = generateEmailOptions();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-sky-500 rounded-full flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Agent Profile</h3>
          <p className="text-sm text-gray-500">
            Manage your professional information and contact details
          </p>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Configuration</h4>
            <p className="text-sm text-gray-500">
              Choose how you want to display your email address
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEmailOptions(!showEmailOptions)}
          >
            Change Email
          </Button>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{formData.email}</p>
            <p className="text-xs text-gray-500">
              {emailConfig.type === 'user_provided' && 'User-provided email'}
              {emailConfig.type === 'auto_generated' && 'Auto-generated professional email'}
              {emailConfig.type === 'custom_domain' && 'Company domain email'}
            </p>
          </div>
          {emailConfig.isVerified ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          )}
        </div>

        {/* Email Options Modal */}
        {showEmailOptions && (
          <div className="mt-4 space-y-3">
            {emailOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleEmailOptionSelect(option)}
                  className="w-full p-3 text-left bg-white rounded-lg border hover:border-sky-300 hover:bg-sky-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600">{option.email}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Tell potential clients about your experience and specialties..."
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileManager; 