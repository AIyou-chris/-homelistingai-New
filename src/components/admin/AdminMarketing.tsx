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
      // Mock data for now - replace with actual Supabase query
      const mockCampaigns: EmailCampaign[] = [
        {
          id: '1',
          name: 'Welcome Series',
          subject: 'Welcome to HomeListingAI!',
          content: 'Thank you for joining our platform...',
          status: 'sent',
          sent_date: '2024-01-15',
          recipient_count: 150,
          open_rate: 45.2,
          click_rate: 12.8,
          created_at: '2024-01-10'
        },
        {
          id: '2',
          name: 'New Listing Alert',
          subject: 'New Properties in Your Area',
          content: 'Check out these new listings...',
          status: 'scheduled',
          scheduled_date: '2024-01-20',
          recipient_count: 300,
          open_rate: 0,
          click_rate: 0,
          created_at: '2024-01-12'
        }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAutomations = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockAutomations: MarketingAutomation[] = [
        {
          id: '1',
          name: 'New User Welcome',
          trigger: 'user_signup',
          action: 'send_welcome_email',
          status: 'active',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Listing Created',
          trigger: 'listing_created',
          action: 'notify_agent',
          status: 'active',
          created_at: '2024-01-05'
        }
      ];
      setAutomations(mockAutomations);
    } catch (error) {
      console.error('Error fetching automations:', error);
    }
  };

  const createCampaign = async () => {
    try {
      // Mock campaign creation - replace with actual Supabase insert
      const campaign: EmailCampaign = {
        id: Date.now().toString(),
        ...newCampaign,
        recipient_count: 0,
        open_rate: 0,
        click_rate: 0,
        created_at: new Date().toISOString()
      };
      
      setCampaigns(prev => [campaign, ...prev]);
      setShowNewCampaign(false);
      setNewCampaign({ name: '', subject: '', content: '', status: 'draft', scheduled_date: '' });
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const createAutomation = async () => {
    try {
      // Mock automation creation - replace with actual Supabase insert
      const automation: MarketingAutomation = {
        id: Date.now().toString(),
        ...newAutomation,
        created_at: new Date().toISOString()
      };
      
      setAutomations(prev => [automation, ...prev]);
      setShowNewAutomation(false);
      setNewAutomation({ name: '', trigger: '', action: '', status: 'active' });
    } catch (error) {
      console.error('Error creating automation:', error);
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
          <p className="text-gray-400">Manage email campaigns, automation, and communications</p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="bg-slate-800 rounded-lg p-4">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Email Campaigns</h3>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              Create Campaign
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-slate-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-white">{campaign.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{campaign.subject}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recipients:</span>
                    <span className="text-white">{campaign.recipient_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Open Rate:</span>
                    <span className="text-white">{campaign.open_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Click Rate:</span>
                    <span className="text-white">{campaign.click_rate}%</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="text-sky-400 hover:text-sky-300 text-sm"
                  >
                    View Details
                  </button>
                  {campaign.status === 'draft' && (
                    <button className="text-green-400 hover:text-green-300 text-sm">
                      Send
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Marketing Automation</h3>
            <button
              onClick={() => setShowNewAutomation(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Create Automation
            </button>
          </div>

          {/* Automations List */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Trigger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {automations.map((automation) => (
                  <tr key={automation.id} className="hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{automation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{automation.trigger}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{automation.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        automation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {automation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-sky-400 hover:text-sky-300 mr-3">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Calendar & Appointments</h3>
          
          {/* Calendar Placeholder */}
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h4 className="text-xl font-semibold text-white mb-2">Interactive Calendar</h4>
            <p className="text-gray-400 mb-6">
              Live calendar integration coming soon. View and manage all appointments across agents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-2">Today's Appointments</h5>
                <p className="text-gray-400">5 scheduled</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-2">This Week</h5>
                <p className="text-gray-400">23 appointments</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-2">Pending</h5>
                <p className="text-gray-400">3 to confirm</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quick-email' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Quick Email</h3>
          
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To:</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject:</label>
                <input
                  type="text"
                  placeholder="Email subject"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message:</label>
                <textarea
                  rows={6}
                  placeholder="Your email message..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
                  Send Email
                </button>
                <button className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition">
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name:</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject:</label>
                <input
                  type="text"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content:</label>
                <textarea
                  rows={8}
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status:</label>
                <select
                  value={newCampaign.status}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {newCampaign.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Schedule Date:</label>
                  <input
                    type="datetime-local"
                    value={newCampaign.scheduled_date}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowNewCampaign(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={createCampaign}
                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Automation Modal */}
      {showNewAutomation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Automation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Automation Name:</label>
                <input
                  type="text"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trigger:</label>
                <select
                  value={newAutomation.trigger}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, trigger: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select trigger</option>
                  <option value="user_signup">User Signup</option>
                  <option value="listing_created">Listing Created</option>
                  <option value="appointment_scheduled">Appointment Scheduled</option>
                  <option value="lead_created">Lead Created</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Action:</label>
                <select
                  value={newAutomation.action}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select action</option>
                  <option value="send_welcome_email">Send Welcome Email</option>
                  <option value="notify_agent">Notify Agent</option>
                  <option value="send_reminder">Send Reminder</option>
                  <option value="update_status">Update Status</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowNewAutomation(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={createAutomation}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Create Automation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <p className="text-white">{selectedCampaign.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Subject</label>
                <p className="text-white">{selectedCampaign.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Content</label>
                <div className="bg-slate-700 p-4 rounded-lg text-white text-sm">
                  {selectedCampaign.content}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <p className="text-white">{selectedCampaign.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Recipients</label>
                  <p className="text-white">{selectedCampaign.recipient_count}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Open Rate</label>
                  <p className="text-white">{selectedCampaign.open_rate}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Click Rate</label>
                  <p className="text-white">{selectedCampaign.click_rate}%</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMarketing; 