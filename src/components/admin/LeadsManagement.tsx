import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Mail, 
  Phone,
  Calendar,
  MessageSquare,
  UserPlus,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Star,
  Target,
  TrendingUp,
  Zap,
  Send,
  FileText,
  X,
  Plus,
  PhoneCall,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  MessageCircle,
  BarChart3,
  DollarSign,
  MapPin,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  value: number;
  created_at: string;
  last_contact: string;
  notes: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  location?: string;
  website?: string;
  social_media?: string;
}

interface LeadsManagementProps {
  onLeadAction?: (action: string, leadId: string) => void;
}

const LeadsManagement: React.FC<LeadsManagementProps> = ({ onLeadAction }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Mock data for leads
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@techcorp.com',
          phone: '+1 (555) 123-4567',
          company: 'TechCorp Solutions',
          source: 'Website',
          status: 'qualified',
          value: 25000,
          created_at: '2024-01-15T10:30:00Z',
          last_contact: '2024-01-20T14:45:00Z',
          notes: 'Interested in AI listing features. Follow up needed.',
          assigned_to: 'admin',
          priority: 'high',
          location: 'San Francisco, CA',
          website: 'https://techcorp.com',
          social_media: '@techcorp'
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@realestate.com',
          phone: '+1 (555) 987-6543',
          company: 'Chen Real Estate',
          source: 'Referral',
          status: 'contacted',
          value: 15000,
          created_at: '2024-01-10T09:15:00Z',
          last_contact: '2024-01-19T16:20:00Z',
          notes: 'Looking for property management tools.',
          assigned_to: 'admin',
          priority: 'medium',
          location: 'Los Angeles, CA',
          website: 'https://chenrealestate.com',
          social_media: '@chenrealestate'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily@rodriguezproperties.com',
          phone: '+1 (555) 456-7890',
          company: 'Rodriguez Properties',
          source: 'Social Media',
          status: 'new',
          value: 30000,
          created_at: '2024-01-05T11:00:00Z',
          last_contact: '2024-01-18T13:30:00Z',
          notes: 'High-value prospect. Premium features interest.',
          assigned_to: 'admin',
          priority: 'high',
          location: 'Miami, FL',
          website: 'https://rodriguezproperties.com',
          social_media: '@rodriguezproperties'
        },
        {
          id: '4',
          name: 'David Thompson',
          email: 'david@thompsonagency.com',
          phone: '+1 (555) 111-2222',
          company: 'Thompson Agency',
          source: 'Cold Call',
          status: 'proposal',
          value: 20000,
          created_at: '2024-01-01T08:00:00Z',
          last_contact: '2024-01-15T10:00:00Z',
          notes: 'Proposal sent. Awaiting response.',
          assigned_to: 'admin',
          priority: 'medium',
          location: 'Chicago, IL',
          website: 'https://thompsonagency.com',
          social_media: '@thompsonagency'
        }
      ];

      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadAction = async (action: string, leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      
      switch (action) {
        case 'see':
          console.log('Viewing lead details:', lead);
          if (lead) {
            setSelectedLead(lead);
            setLeadNotes(lead.notes);
            setShowLeadModal(true);
          }
          break;
        case 'email':
          if (lead?.email) {
            setSelectedLead(lead);
            setEmailSubject('HomeListingAI - Follow Up');
            setEmailBody(`Hi ${lead.name},\n\nThank you for your interest in HomeListingAI...`);
            setShowEmailModal(true);
          }
          break;
        case 'phone':
          if (lead?.phone) {
            console.log('Calling lead:', lead.phone);
            alert(`Calling: ${lead.phone}`);
          } else {
            alert('No phone number available for this lead');
          }
          break;
        case 'appointment':
          if (lead) {
            setSelectedLead(lead);
            setShowAppointmentModal(true);
          }
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
            setLeads(prev => prev.filter(lead => lead.id !== leadId));
          }
          break;
      }
      
      onLeadAction?.(action, leadId);
    } catch (error) {
      console.error(`Error performing ${action} on lead:`, error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" />New</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500 text-white"><MessageSquare className="w-3 h-3 mr-1" />Contacted</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Qualified</Badge>;
      case 'proposal':
        return <Badge className="bg-purple-500 text-white"><FileText className="w-3 h-3 mr-1" />Proposal</Badge>;
      case 'closed':
        return <Badge className="bg-green-600 text-white"><DollarSign className="w-3 h-3 mr-1" />Closed</Badge>;
      case 'lost':
        return <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Lost</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white"><Star className="w-3 h-3 mr-1" />High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white"><Target className="w-3 h-3 mr-1" />Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-500 text-white"><TrendingUp className="w-3 h-3 mr-1" />Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-300">Loading leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Leads Management</h2>
          <p className="text-gray-300">Track and manage your sales pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            onClick={fetchLeads}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Leads</p>
                <p className="text-white text-2xl font-bold">{leads.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Pipeline Value</p>
                <p className="text-white text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Qualified Leads</p>
                <p className="text-white text-2xl font-bold">{qualifiedLeads}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">New Leads</p>
                <p className="text-white text-2xl font-bold">{newLeads}</p>
              </div>
              <Star className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="closed">Closed</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Sources</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Leads ({filteredLeads.length})</span>
            <div className="text-sm text-gray-400">
              {selectedLeads.length > 0 && `${selectedLeads.length} selected`}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(filteredLeads.map(l => l.id));
                        } else {
                          setSelectedLeads([]);
                        }
                      }}
                      className="rounded border-white/20 bg-white/10"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Lead</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Contact</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, lead.id]);
                          } else {
                            setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                          }
                        }}
                        className="rounded border-white/20 bg-white/10"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-sm text-gray-400">{lead.email}</div>
                        {lead.company && (
                          <div className="text-sm text-gray-400 flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {lead.company}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(lead.priority)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{formatCurrency(lead.value)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300">{lead.source}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-400">
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-400">
                        {lead.last_contact ? formatDate(lead.last_contact) : 'Never'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-white/10"
                            onClick={() => console.log('Dropdown clicked for lead:', lead.email)}
                          >
                            <MoreVertical className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 min-w-[200px]">
                          <DropdownMenuItem 
                            onClick={() => handleLeadAction('see', lead.id)}
                            className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            See
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleLeadAction('email', lead.id)}
                            className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleLeadAction('phone', lead.id)}
                            className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Phone
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleLeadAction('appointment', lead.id)}
                            className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Set Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleLeadAction('delete', lead.id)}
                            className="text-red-300 hover:bg-red-900/20 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-gray-400">{selectedLead.company || 'No company'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowLeadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Lead Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedLead.email}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Phone</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedLead.phone}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Website</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedLead.website || 'No website'}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Location</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedLead.location || 'No location'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedLead.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Priority</label>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(selectedLead.priority)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Value</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {formatCurrency(selectedLead.value)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Source</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedLead.source}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Created</label>
                <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                  {formatDate(selectedLead.created_at)}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Last Contact</label>
                <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                  {selectedLead.last_contact ? formatDate(selectedLead.last_contact) : 'Never'}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Lead Notes
              </label>
              <Textarea
                placeholder="Add notes about this lead..."
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setShowLeadModal(false);
                    handleLeadAction('email', selectedLead.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  onClick={() => {
                    setShowLeadModal(false);
                    handleLeadAction('phone', selectedLead.id);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  onClick={() => {
                    setShowLeadModal(false);
                    handleLeadAction('appointment', selectedLead.id);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Appointment
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLeadModal(false)}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log('Saving notes for lead:', selectedLead.email);
                    setShowLeadModal(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Send Email to {selectedLead.name}</h3>
              <Button
                variant="ghost"
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Subject</label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Message</label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log('Sending email to:', selectedLead.email);
                  setShowEmailModal(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Set Appointment with {selectedLead.name}</h3>
              <Button
                variant="ghost"
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time</label>
                  <Input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Notes</label>
                <Textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Add appointment notes..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAppointmentModal(false)}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log('Setting appointment for:', selectedLead.name);
                  setShowAppointmentModal(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Set Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagement; 