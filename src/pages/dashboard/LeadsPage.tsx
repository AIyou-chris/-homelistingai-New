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

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadWithListing[]>([
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

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getLeads();
      // Add Joe Smith for demo
      data.unshift({
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
      });
      setLeads(data);
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
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-50 divide-y divide-slate-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap bg-slate-100 rounded-l-xl">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap bg-slate-100">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">
                        {getSourceIcon(lead.source)}
                      </span>
                      <span className="text-sm text-gray-900 capitalize">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap bg-slate-100">
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
                  <td className="px-6 py-4 whitespace-nowrap bg-slate-100">
                    <div className="text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium bg-slate-100 rounded-r-xl">
                    <div className="flex items-center space-x-2">
                      <button className="text-sky-600 hover:text-sky-900" onClick={() => { setSelectedLead(lead); setShowLeadModal(true); }}>
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" onClick={() => {/* open edit modal logic here */}}>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <a className="text-gray-600 hover:text-gray-900" href={`tel:${lead.phone}`} title="Call">
                        <PhoneIcon className="h-4 w-4" />
                      </a>
                      <a className="text-gray-600 hover:text-gray-900" href={`mailto:${lead.email}`} title="Email">
                        <Mail className="h-4 w-4" />
                      </a>
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
    </div>
  );
};

export default LeadsPage; 