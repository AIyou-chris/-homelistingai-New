import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../shared/LoadingSpinner';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_date?: string;
  sent_date?: string;
  recipient_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
}

interface MarketingAutomation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const AdminMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [automations, setAutomations] = useState<MarketingAutomation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    status: 'draft' as const,
    scheduled_date: ''
  });

  // New automation form state
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: '',
    action: '',
    status: 'active' as const
  });

  useEffect(() => {
    fetchCampaigns();
    fetchAutomations();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns from database (you'll need to create this table)
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, start with empty array
        console.log('No campaigns table found, starting with empty data');
        setCampaigns([]);
        return;
      }

      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAutomations = async () => {
    try {
      // Fetch automations from database (you'll need to create this table)
      const { data, error } = await supabase
        .from('marketing_automations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, start with empty array
        console.log('No automations table found, starting with empty data');
        setAutomations([]);
        return;
      }

      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      setAutomations([]);
    }
  };

  const createCampaign = async () => {
    try {
      // Create campaign in database
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert([{
          name: newCampaign.name,
          subject: newCampaign.subject,
          content: newCampaign.content,
          status: newCampaign.status,
          scheduled_date: newCampaign.scheduled_date || null,
          recipient_count: 0,
          open_rate: 0,
          click_rate: 0
        }])
        .select();

      if (error) throw error;

      // Refresh campaigns
      await fetchCampaigns();
      setShowNewCampaign(false);
      setNewCampaign({ name: '', subject: '', content: '', status: 'draft', scheduled_date: '' });
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please ensure the email_campaigns table exists.');
    }
  };

  const createAutomation = async () => {
    try {
      // Create automation in database
      const { data, error } = await supabase
        .from('marketing_automations')
        .insert([{
          name: newAutomation.name,
          trigger: newAutomation.trigger,
          action: newAutomation.action,
          status: newAutomation.status
        }])
        .select();

      if (error) throw error;

      // Refresh automations
      await fetchAutomations();
      setShowNewAutomation(false);
      setNewAutomation({ name: '', trigger: '', action: '', status: 'active' });
    } catch (error) {
      console.error('Error creating automation:', error);
      alert('Failed to create automation. Please ensure the marketing_automations table exists.');
    }
  };

  const sendQuickEmail = async (recipient: string, subject: string, content: string) => {
    try {
      // Use the existing send-email Edge Function
      const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
        },
        body: JSON.stringify({
          to: recipient,
          subject: subject,
          html: content
        })
      });

      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  // Add Launch Campaign handler
  const addLaunchCampaign = async () => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert([{
          name: 'Launch Announcement',
          subject: '🚀 Introducing HomeListingAI: Launch Special – Transform Your Listings & Save!',
          content: `Hi Agent,\n\nWe’re excited to announce the official launch of HomeListingAI – the fastest, smartest way to create stunning property listings and attract more leads!\n\nFor a limited time, we’re offering exclusive launch pricing to help you get started:\n\n✨ Professional Plan: Just $29/month (normally $49/month)\n✨ 14-day free trial – no credit card required!\n\nWith HomeListingAI, you can:\n- Instantly generate beautiful, persuasive property descriptions\n- Automate your listing workflow and save hours every week\n- Get AI-powered insights to convert more leads\n- Stand out with premium, Apple-like design and seamless user experience\n\nDon’t miss out on this special offer!\nClick below to claim your launch discount and start growing your business today:\n\n👉 [Sign Up Now](https://your-app-url.com/signup)\n\nQuestions? Reply to this email or contact our support team anytime.\n\nTo your success,\nThe HomeListingAI Team`,
          status: 'draft',
          recipient_count: 0,
          open_rate: 0,
          click_rate: 0
        }]);
      if (error) throw error;
      await fetchCampaigns();
      alert('Launch campaign added!');
    } catch (error) {
      alert('Failed to add launch campaign.');
    }
  };

  const tabs = [
    { id: 'campaigns', label: 'Email Campaigns', icon: '📧' },
    { id: 'automation', label: 'Marketing Automation', icon: '🤖' },
    { id: 'calendar', label: 'Calendar & Appointments', icon: '📅' },
    { id: 'quick-email', label: 'Quick Email', icon: '⚡' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketing & Communications</h2>
          <p className="text-gray-400">Manage email campaigns and marketing automation</p>
        </div>
        <div className="text-sm text-gray-400">
          Total Campaigns: {campaigns.length} | Total Automations: {automations.length}
        </div>
      </div>

      {/* Add Launch Campaign Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={addLaunchCampaign}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Launch Campaign
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Email Campaigns</h3>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              New Campaign
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No campaigns yet</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-white font-semibold">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{campaign.subject}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipients</span>
                      <span className="text-white">{campaign.recipient_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Open Rate</span>
                      <span className="text-white">{campaign.open_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Click Rate</span>
                      <span className="text-white">{campaign.click_rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Marketing Automation</h3>
            <button
              onClick={() => setShowNewAutomation(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              New Automation
            </button>
          </div>

          {automations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No automations yet</div>
              <button
                onClick={() => setShowNewAutomation(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Create Your First Automation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automations.map((automation) => (
                <div key={automation.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-white font-semibold">{automation.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      automation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {automation.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trigger</span>
                      <span className="text-white">{automation.trigger}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Action</span>
                      <span className="text-white">{automation.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Marketing Calendar</h3>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="text-center text-gray-400">
              Marketing calendar view coming soon...
            </div>
          </div>
        </div>
      )}

      {/* Quick Email Tab */}
      {activeTab === 'quick-email' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Quick Email</h3>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Email</label>
                <input
                  type="email"
                  id="quick-email-recipient"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  id="quick-email-subject"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  id="quick-email-content"
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Your message here..."
                />
              </div>
              <button
                onClick={() => {
                  const recipient = (document.getElementById('quick-email-recipient') as HTMLInputElement)?.value;
                  const subject = (document.getElementById('quick-email-subject') as HTMLInputElement)?.value;
                  const content = (document.getElementById('quick-email-content') as HTMLTextAreaElement)?.value;
                  
                  if (recipient && subject && content) {
                    sendQuickEmail(recipient, subject, content);
                  } else {
                    alert('Please fill in all fields');
                  }
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={newCampaign.status}
                  onChange={(e) => setNewCampaign({...newCampaign, status: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewCampaign(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={createCampaign}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Automation Modal */}
      {showNewAutomation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Automation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Automation Name</label>
                <input
                  type="text"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trigger</label>
                <select
                  value={newAutomation.trigger}
                  onChange={(e) => setNewAutomation({...newAutomation, trigger: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="">Select Trigger</option>
                  <option value="user_signup">User Signup</option>
                  <option value="listing_created">Listing Created</option>
                  <option value="appointment_scheduled">Appointment Scheduled</option>
                  <option value="lead_created">Lead Created</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
                <select
                  value={newAutomation.action}
                  onChange={(e) => setNewAutomation({...newAutomation, action: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="">Select Action</option>
                  <option value="send_welcome_email">Send Welcome Email</option>
                  <option value="notify_agent">Notify Agent</option>
                  <option value="send_reminder">Send Reminder</option>
                  <option value="create_task">Create Task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={newAutomation.status}
                  onChange={(e) => setNewAutomation({...newAutomation, status: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewAutomation(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={createAutomation}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Create Automation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMarketing; 