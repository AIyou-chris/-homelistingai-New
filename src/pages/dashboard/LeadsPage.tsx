import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  QrCodeIcon,
  MessageCircle,
  QrCode,
  FileText,
  Globe,
  PlusCircle,
  SearchIcon,
  FilterIcon,
  Users,
  Mail,
  Mic,
} from 'lucide-react';
import { Lead } from '../../types';
import * as leadService from '../../services/leadService';
import { getFollowUpStats } from '../../services/followupService';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface LeadWithListing extends Lead {
  listing?: {
    title: string;
    address: string;
  };
}

const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadWithListing[]>([
    {
      id: 'john-doe-demo',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-987-6543',
      message: 'Interested in the 3-bedroom home on Oak Street. Looking for something under $450k. Can we schedule a viewing this weekend?',
      listing_id: 'demo-listing-1',
      agent_id: 'demo-agent-1',
      status: 'qualified',
      source: 'chat',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'joe-smith-demo',
      name: 'Joe Smith',
      email: 'joe.smith@example.com',
      phone: '555-123-4567',
      message: 'Interested in Oak Street listing',
      listing_id: 'demo-listing-1',
      agent_id: 'demo-agent-1',
      status: 'new',
      source: 'form',
      created_at: new Date().toISOString(),
    },
    // Additional demo leads
    {
      id: 'sarah-johnson-demo',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '555-234-5678',
      message: 'Looking for a 3-bedroom home in the suburbs. Budget around $500k.',
      listing_id: 'demo-listing-2',
      agent_id: 'demo-agent-1',
      status: 'contacted',
      source: 'chat',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'mike-chen-demo',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '555-345-6789',
      message: 'Interested in the Maple Avenue property. Can we schedule a viewing?',
      listing_id: 'demo-listing-2',
      agent_id: 'demo-agent-1',
      status: 'qualified',
      source: 'qr_scan',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'emily-davis-demo',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '555-456-7890',
      message: 'First-time homebuyer looking for something under $400k. Any recommendations?',
      listing_id: 'demo-listing-3',
      agent_id: 'demo-agent-1',
      status: 'new',
      source: 'form',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'david-wilson-demo',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '555-567-8901',
      message: 'Selling my current home and looking to upgrade. Need advice on timing.',
      listing_id: 'demo-listing-4',
      agent_id: 'demo-agent-1',
      status: 'contacted',
      source: 'chat',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'lisa-thompson-demo',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '555-678-9012',
      message: 'Interested in the downtown condo. Is parking included?',
      listing_id: 'demo-listing-3',
      agent_id: 'demo-agent-1',
      status: 'qualified',
      source: 'qr_scan',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'robert-martinez-demo',
      name: 'Robert Martinez',
      email: 'robert.martinez@email.com',
      phone: '555-789-0123',
      message: 'Looking for investment properties. What\'s the rental market like?',
      listing_id: 'demo-listing-5',
      agent_id: 'demo-agent-1',
      status: 'new',
      source: 'form',
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [filteredLeads, setFilteredLeads] = useState<LeadWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadWithListing | null>(null);
  const [leadNotes, setLeadNotes] = useState<{ [leadId: string]: string }>({});
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailMessage, setBulkEmailMessage] = useState('');
  const [followUpStats, setFollowUpStats] = useState<{ [leadId: string]: { status: string; nextDate?: string } }>({});

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
    // Fetch follow-up status for visible leads
    (async () => {
      const stats: { [leadId: string]: { status: string; nextDate?: string } } = {};
      for (const lead of leads) {
        try {
          // Skip follow-up stats for demo leads to prevent errors
          if (lead.id.includes('-demo')) {
            stats[lead.id] = { status: 'none' };
            continue;
          }
          
          const stat = await getFollowUpStats(lead.id);
          let status = 'none';
          let nextDate = undefined;
          if (stat.totalScheduled > 0) {
            status = 'scheduled';
            if (stat.nextFollowUp) nextDate = stat.nextFollowUp.scheduled_date;
          } else if (stat.totalSent > 0) {
            status = 'sent';
          } else if (stat.totalCancelled > 0) {
            status = 'cancelled';
          }
          stats[lead.id] = { status, nextDate };
        } catch (error) {
          console.warn(`Skipping follow-up stats for lead ${lead.id}:`, error);
          stats[lead.id] = { status: 'none' };
        }
      }
      setFollowUpStats(stats);
    })();
  }, [leads]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      // Check if we're on demo dashboard (supports both pathname and hash routing)
      const isDemo = window.location.pathname.startsWith('/demo-dashboard') || window.location.hash.startsWith('#/demo-dashboard');
      
      // Also check if user is logged in as Test Agent (for demo purposes)
      const isTestAgent = user?.email === 'testagent@homelistingai.com';
      
      if (isDemo || isTestAgent) {
        // Add all demo leads for demo dashboard or test agent
        const demoLeads = [
          {
            id: 'john-doe-demo',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '555-987-6543',
            message: 'Interested in the 3-bedroom home on Oak Street. Looking for something under $450k. Can we schedule a viewing this weekend?',
            listing_id: 'demo-listing-1',
            agent_id: 'demo-agent-1',
            status: 'qualified' as Lead['status'],
            source: 'chat' as Lead['source'],
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'joe-smith-demo',
            name: 'Joe Smith',
            email: 'joe.smith@example.com',
            phone: '555-123-4567',
            message: 'Interested in Oak Street listing',
            listing_id: 'demo-listing-1',
            agent_id: 'demo-agent-1',
            status: 'new' as Lead['status'],
            source: 'form' as Lead['source'],
            created_at: new Date().toISOString(),
          },
          {
            id: 'sarah-johnson-demo',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '555-234-5678',
            message: 'Looking for a 3-bedroom home in the suburbs. Budget around $500k.',
            listing_id: 'demo-listing-2',
            agent_id: 'demo-agent-1',
            status: 'contacted' as Lead['status'],
            source: 'chat' as Lead['source'],
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mike-chen-demo',
            name: 'Mike Chen',
            email: 'mike.chen@email.com',
            phone: '555-345-6789',
            message: 'Interested in the Maple Avenue property. Can we schedule a viewing?',
            listing_id: 'demo-listing-2',
            agent_id: 'demo-agent-1',
            status: 'qualified' as Lead['status'],
            source: 'qr_scan' as Lead['source'],
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'emily-davis-demo',
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '555-456-7890',
            message: 'First-time homebuyer looking for something under $400k. Any recommendations?',
            listing_id: 'demo-listing-3',
            agent_id: 'demo-agent-1',
            status: 'new' as Lead['status'],
            source: 'form' as Lead['source'],
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'david-wilson-demo',
            name: 'David Wilson',
            email: 'david.wilson@email.com',
            phone: '555-567-8901',
            message: 'Selling my current home and looking to upgrade. Need advice on timing.',
            listing_id: 'demo-listing-4',
            agent_id: 'demo-agent-1',
            status: 'contacted' as Lead['status'],
            source: 'chat' as Lead['source'],
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'lisa-thompson-demo',
            name: 'Lisa Thompson',
            email: 'lisa.thompson@email.com',
            phone: '555-678-9012',
            message: 'Interested in the downtown condo. Is parking included?',
            listing_id: 'demo-listing-3',
            agent_id: 'demo-agent-1',
            status: 'qualified' as Lead['status'],
            source: 'qr_scan' as Lead['source'],
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'robert-martinez-demo',
            name: 'Robert Martinez',
            email: 'robert.martinez@email.com',
            phone: '555-789-0123',
            message: 'Looking for investment properties. What\'s the rental market like?',
            listing_id: 'demo-listing-5',
            agent_id: 'demo-agent-1',
            status: 'new' as Lead['status'],
            source: 'form' as Lead['source'],
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        setLeads(demoLeads);
      } else {
        // For regular dashboard, only show real leads
        const data = await leadService.getLeads();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await leadService.updateLeadStatus(leadId, newStatus);
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const exportLeads = (format: 'csv' | 'excel') => {
    const data = selectedLeads.length > 0 
      ? filteredLeads.filter(lead => selectedLeads.includes(lead.id))
      : filteredLeads;

    if (format === 'csv') {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Source', 'Status', 'Message', 'Date'],
        ...data.map(lead => [
          lead.name,
          lead.email,
          lead.phone || '',
          lead.source,
          lead.status,
          lead.message,
          new Date(lead.created_at).toLocaleDateString()
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // Excel export (simplified - you can enhance this)
      const excelContent = data.map(lead => ({
        Name: lead.name,
        Email: lead.email,
        Phone: lead.phone || '',
        Source: lead.source,
        Status: lead.status,
        Message: lead.message,
        Date: new Date(lead.created_at).toLocaleDateString()
      }));

      console.log('Excel export data:', excelContent);
      alert('Excel export functionality can be enhanced with a library like xlsx');
    }
  };

  const sendBulkEmail = () => {
    if (!bulkEmailSubject || !bulkEmailMessage) return;
    
    const selectedLeadEmails = selectedLeads.length > 0 
      ? leads.filter(lead => selectedLeads.includes(lead.id)).map(lead => lead.email)
      : filteredLeads.map(lead => lead.email);
    
    // Create mailto link with multiple recipients
    const emailBody = encodeURIComponent(bulkEmailMessage);
    const emailSubject = encodeURIComponent(bulkEmailSubject);
    const emailTo = selectedLeadEmails.join(',');
    
    window.open(`mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`);
    
    setShowBulkEmailModal(false);
    setBulkEmailSubject('');
    setBulkEmailMessage('');
  };

  const deleteLead = (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(lead => lead.id !== leadId));
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'chat':
        return <Mic className="h-4 w-4" />;
      case 'qr_scan':
        return <QrCodeIcon className="h-4 w-4" />;
      case 'form':
        return <FileText className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getFollowUpBadge = (leadId: string) => {
    const stat = followUpStats[leadId];
    if (!stat) return <span className="text-gray-400">-</span>;
    if (stat.status === 'scheduled') return <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Scheduled{stat.nextDate ? `: ${new Date(stat.nextDate).toLocaleDateString()}` : ''}</span>;
    if (stat.status === 'sent') return <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">All Sent</span>;
    if (stat.status === 'cancelled') return <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Cancelled</span>;
    return <span className="text-gray-400">-</span>;
  };

  const selectedLeadContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">{selectedLead?.name}</h3>
      <p><strong>Email:</strong> {selectedLead?.email}</p>
      <p><strong>Phone:</strong> {selectedLead?.phone || 'N/A'}</p>
      <p><strong>Date:</strong> {selectedLead && format(new Date(selectedLead.created_at), 'PPPp')}</p>
      <p><strong>Status:</strong> <span className="capitalize">{selectedLead?.status}</span></p>
      <div className="mt-4">
        {/* Add any other selected lead details here */}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your leads from various sources
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="primary" leftIcon={<PlusIcon className="h-4 w-4" />}>
            Add Lead
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<Mail className="h-4 w-4" />}
            onClick={() => setShowBulkEmailModal(true)}
            disabled={filteredLeads.length === 0}
          >
            Bulk Email
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => exportLeads('csv')}
            disabled={filteredLeads.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full py-2 rounded-md bg-slate-100 border border-slate-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              style={{ boxShadow: 'none' }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            style={{ boxShadow: 'none' }}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            style={{ boxShadow: 'none' }}
          >
            <option value="all">All Sources</option>
            <option value="chat">Chat</option>
            <option value="qr_scan">QR Scan</option>
            <option value="form">Form</option>
            <option value="manual">Manual</option>
          </select>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSourceFilter('all');
            }}
            className="justify-center"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
        {selectedLeads.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              {selectedLeads.length} selected
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportLeads('csv')}
            >
              Export Selected
            </Button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-50 divide-y divide-slate-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-100 transition-colors">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap bg-slate-100 rounded-l-xl">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate">{lead.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-xs sm:text-sm text-gray-500 truncate">{lead.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap bg-slate-100">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">
                        {getSourceIcon(lead.source)}
                      </span>
                      <span className="text-sm text-gray-900 capitalize">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap bg-slate-100">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lead.status)} border-0 focus:ring-0`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap bg-slate-100">
                    <div className="text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {getFollowUpBadge(lead.id)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium bg-slate-100 rounded-r-xl">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button className="text-sky-600 hover:text-sky-900 p-1" onClick={() => { setSelectedLead(lead); setShowLeadModal(true); }} title="View Details">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1" onClick={() => {/* open edit modal logic here */}} title="Edit">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <a className="text-gray-600 hover:text-gray-900 p-1" href={`tel:${lead.phone}`} title="Call">
                        <PhoneIcon className="h-4 w-4" />
                      </a>
                      <a className="text-gray-600 hover:text-gray-900 p-1" href={`mailto:${lead.email}`} title="Email">
                        <Mail className="h-4 w-4" />
                      </a>
                      <button className="text-red-600 hover:text-red-900 p-1" onClick={() => deleteLead(lead.id)} title="Delete">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first lead'}
            </p>
          </div>
        )}
      </div>
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowLeadModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">Lead Details</h2>
            <div className="mb-2"><strong>Name:</strong> {selectedLead.name}</div>
            <div className="mb-2"><strong>Email:</strong> {selectedLead.email}</div>
            <div className="mb-2"><strong>Phone:</strong> {selectedLead.phone}</div>
            <div className="mb-2"><strong>Status:</strong> {selectedLead.status}</div>
            <div className="mb-2"><strong>Source:</strong> {selectedLead.source}</div>
            <div className="mb-2"><strong>Message:</strong> {selectedLead.message}</div>
            <div className="mb-4"><strong>Date:</strong> {new Date(selectedLead.created_at).toLocaleString()}</div>
            <label className="block text-sm font-medium mb-1">Notes/Updates</label>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              value={leadNotes[selectedLead.id] || ''}
              onChange={e => setLeadNotes({ ...leadNotes, [selectedLead.id]: e.target.value })}
              placeholder="Add notes or updates..."
            />
            <button
              className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
              onClick={() => setShowLeadModal(false)}
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {showBulkEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowBulkEmailModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Send Bulk Email</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {selectedLeads.length > 0 
                  ? `Sending to ${selectedLeads.length} selected leads`
                  : `Sending to all ${filteredLeads.length} leads`
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={bulkEmailSubject}
                  onChange={(e) => setBulkEmailSubject(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="Enter email subject..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={6}
                  value={bulkEmailMessage}
                  onChange={(e) => setBulkEmailMessage(e.target.value)}
                  placeholder="Enter your message here..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
                onClick={sendBulkEmail}
                disabled={!bulkEmailSubject || !bulkEmailMessage}
              >
                Send Email
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowBulkEmailModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage; 