import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  QrCode,
  FileText,
  Users,
  MessageCircle as MessageCircleIcon,
  QrCode as QrCodeIcon,
  FileText as FileTextIcon,
  Globe,
  PlusCircle,
  X,
  Calendar,
} from 'lucide-react';
import { Lead } from '../../types';
import * as leadService from '../../services/leadService';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { format } from 'date-fns';

interface LeadWithListing extends Lead {
  listing?: {
    title: string;
    address: string;
  };
}

// Demo leads for demo dashboard
const demoLeads: LeadWithListing[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    message: 'Interested in the Oak Street property. Looking for a 3-bedroom home.',
    status: 'new',
    source: 'chat',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    agent_id: 'demo-agent',
    listing_id: 'demo-listing-1'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    message: 'Saw the QR code at Pine Avenue. Would like to schedule a viewing.',
    status: 'contacted',
    source: 'qr_scan',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    agent_id: 'demo-agent',
    listing_id: 'demo-listing-2'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '(555) 345-6789',
    message: 'Qualified buyer looking for investment properties in the area.',
    status: 'qualified',
    source: 'form',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    agent_id: 'demo-agent',
    listing_id: 'demo-listing-3'
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily.w@email.com',
    phone: '(555) 456-7890',
    message: 'Interested in the Maple Drive listing. First-time homebuyer.',
    status: 'new',
    source: 'chat',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    agent_id: 'demo-agent',
    listing_id: 'demo-listing-4'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '(555) 567-8901',
    message: 'Looking for a family home with good schools nearby.',
    status: 'contacted',
    source: 'manual',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    agent_id: 'demo-agent',
    listing_id: 'demo-listing-5'
  }
];

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadWithListing[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadWithListing | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadNotes, setLeadNotes] = useState('');

  // Check if we're in demo mode
  const isDemoMode = window.location.pathname.includes('demo-dashboard');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading leads... isDemoMode:', isDemoMode);
      console.log('🔍 Current pathname:', window.location.pathname);
      console.log('🔍 Hash:', window.location.hash);
      
      // Check multiple ways to detect demo mode
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const isDemoPath = pathname.includes('demo-dashboard') || hash.includes('demo-dashboard');
      
      console.log('🎭 Demo detection - pathname:', pathname, 'hash:', hash, 'isDemoPath:', isDemoPath);
      
      // TEMPORARY: Always show demo leads for testing
      console.log('🎭 Using demo leads (forced):', demoLeads.length);
      setLeads(demoLeads);
      
      /*
      if (isDemoMode || isDemoPath) {
        // Use demo leads for demo dashboard
        console.log('🎭 Using demo leads:', demoLeads.length);
        setLeads(demoLeads);
      } else {
        console.log('📡 Fetching real leads from API...');
        const data = await leadService.getLeads();
        setLeads(data);
      }
      */
    } catch (error) {
      console.error('Error loading leads:', error);
      // Fallback to demo leads if API fails
      console.log('🔄 Fallback to demo leads due to error');
      setLeads(demoLeads);
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

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'qualified':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'lost':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'chat':
        return <MessageCircle className="h-4 w-4" />;
      case 'qr_scan':
        return <QrCodeIcon className="h-4 w-4" />;
      case 'form':
        return <FileText className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
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
          <h1 className="text-2xl font-bold text-white">Leads Management</h1>
          <p className="mt-1 text-sm text-gray-300">
            Manage and track your leads from various sources
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Add Lead
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => exportLeads('csv')}
            disabled={filteredLeads.length === 0}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-lg shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/10 text-white"
          >
            <option value="all" className="bg-gray-800">All Statuses</option>
            <option value="new" className="bg-gray-800">New</option>
            <option value="contacted" className="bg-gray-800">Contacted</option>
            <option value="qualified" className="bg-gray-800">Qualified</option>
            <option value="lost" className="bg-gray-800">Lost</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/10 text-white"
          >
            <option value="all" className="bg-gray-800">All Sources</option>
            <option value="chat" className="bg-gray-800">Chat</option>
            <option value="qr_scan" className="bg-gray-800">QR Scan</option>
            <option value="form" className="bg-gray-800">Form</option>
            <option value="manual" className="bg-gray-800">Manual</option>
          </select>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSourceFilter('all');
            }}
            className="justify-center text-white hover:bg-white/10"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-300">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
        {selectedLeads.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">
              {selectedLeads.length} selected
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportLeads('csv')}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Export Selected
            </Button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/20 text-sky-600 focus:ring-sky-500 bg-white/10"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-white/20 text-sky-600 focus:ring-sky-500 bg-white/10"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      <div className="text-sm text-gray-300">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-sm text-gray-300">{lead.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">
                        {getSourceIcon(lead.source)}
                      </span>
                      <span className="text-sm text-white capitalize">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lead.status)} border-0 focus:ring-0 bg-white/10`}
                    >
                      <option value="new" className="bg-gray-800">New</option>
                      <option value="contacted" className="bg-gray-800">Contacted</option>
                      <option value="qualified" className="bg-gray-800">Qualified</option>
                      <option value="lost" className="bg-gray-800">Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-sky-400 hover:text-sky-300"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowLeadModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-300">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-300">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-300">
                        <Mail className="h-4 w-4" />
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
            <h3 className="text-lg font-medium text-white mb-2">No leads found</h3>
            <p className="text-gray-300">
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first lead'}
            </p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Lead Details</h2>
              <button 
                onClick={() => setShowLeadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Lead Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-400 mb-1">Name</label>
                  <p className="text-white font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1">Email</label>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1">Phone</label>
                  <p className="text-white">{selectedLead.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1">Source</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">
                      {getSourceIcon(selectedLead.source)}
                    </span>
                    <span className="text-white capitalize">{selectedLead.source}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                    className={`text-xs px-3 py-2 rounded-full font-medium ${getStatusColor(selectedLead.status)} border-0 focus:ring-0 bg-white/10`}
                  >
                    <option value="new" className="bg-gray-800">New</option>
                    <option value="contacted" className="bg-gray-800">Contacted</option>
                    <option value="qualified" className="bg-gray-800">Qualified</option>
                    <option value="lost" className="bg-gray-800">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1">Date Added</label>
                  <p className="text-white">{new Date(selectedLead.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm text-gray-400 mb-1">Message</label>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white">{selectedLead.message}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Add notes about this lead..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implement appointment booking
                    alert('Appointment booking feature coming soon!');
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => {
                    // TODO: Implement email sending
                    alert('Email feature coming soon!');
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => {
                    // TODO: Implement phone call
                    alert('Phone call feature coming soon!');
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Lead
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage; 