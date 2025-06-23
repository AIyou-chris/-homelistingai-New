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
import Textarea from '../shared/Textarea';

interface AgentProfileManagerProps {
  onProfileUpdate?: (profile: AgentProfile) => void;
}

interface ProfileFormData {
  name: string;
  phone: string;
  bio: string;
  company_name: string;
  website: string;
}

const AgentProfileManager: React.FC<AgentProfileManagerProps> = ({ onProfileUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    bio: '',
    company_name: '',
    website: '',
  });
  const [emailConfig, setEmailConfig] = useState<AgentEmailConfig>({
    type: "user",
    isVerified: false
  });
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

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
          name: agentProfile.name || '',
          phone: agentProfile.phone || '',
          bio: agentProfile.bio || '',
          company_name: agentProfile.company_name || '',
          website: agentProfile.website || '',
        });
        setAvatarUrl(agentProfile.avatar_url || '');
        if (agentProfile.email_config) {
          setEmailConfig(agentProfile.email_config);
        }
      } else {
        // Create default profile
        const defaultFormData = {
          name: user.name || '',
          phone: '',
          bio: '',
          company_name: '',
          website: '',
        };
        setFormData(defaultFormData);
        setEmailConfig({
          type: "user",
          isVerified: false
        });
      }
    } catch (error) {
      console.error('Error loading agent profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailConfigChange = (type: AgentEmailConfig['type']) => {
    setEmailConfig(prev => ({ ...prev, type }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Create a partial profile object with only the fields that can be updated
      const profileUpdate: Partial<AgentProfile> = {
        ...formData,
        avatar_url: avatarUrl,
        email_config: emailConfig,
      };

      await agentService.updateAgentProfile(user.id, profileUpdate);
      onProfileUpdate?.(profile!);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmailOptions = () => {
    if (!formData.name || !formData.name.split(' ').length) return [];

    const options: Array<{
      type: 'user' | 'auto_generated' | 'custom_domain';
      label: string;
      email: string;
      description: string;
      icon: React.ComponentType<{ className?: string }>;
      domain?: string;
    }> = [
      {
        type: 'user',
        label: 'Use Current Email',
        email: formData.name,
        description: 'Keep your existing email address',
        icon: EnvelopeIcon
      }
    ];

    // Auto-generated option
    const autoEmail = agentService.generateAgentEmail(
      formData.name.split(' ')[0],
      formData.name.split(' ').slice(1).join(' ')
    );
    options.push({
      type: 'auto_generated',
      label: 'Auto-Generated Email',
      email: autoEmail.email,
      description: 'Professional email with your name',
      icon: SparklesIcon
    });

    // Company domain option
    if (formData.company_name) {
      const companyEmail = agentService.generateAgentEmail(
        formData.name.split(' ')[0],
        formData.name.split(' ').slice(1).join(' '),
        formData.company_name
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
    setFormData(prev => ({ ...prev, name: option.email }));
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Agent Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {/* Avatar Upload */}
        </div>
        <div className="md:col-span-2 space-y-4">
          <Input name="name" label="Full Name" value={formData.name} onChange={handleInputChange} />
          <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleInputChange} />
          <Input name="company_name" label="Company" value={formData.company_name} onChange={handleInputChange} />
          <Input name="website" label="Website" value={formData.website} onChange={handleInputChange} />
          <Textarea name="bio" label="Biography" value={formData.bio} onChange={handleInputChange} rows={4} />
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium">Email Configuration</h3>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input type="radio" name="emailType" value="user" checked={emailConfig.type === 'user'} onChange={() => handleEmailConfigChange('user')} className="mr-2"/>
                Use my account email
              </label>
              <label className="flex items-center">
                <input type="radio" name="emailType" value="auto_generated" checked={emailConfig.type === 'auto_generated'} onChange={() => handleEmailConfigChange('auto_generated')} className="mr-2"/>
                Auto-generate an anonymous email
              </label>
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</Button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileManager; 