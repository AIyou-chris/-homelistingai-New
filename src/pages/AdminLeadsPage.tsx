import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/shared/AdminNavbar';
import { 
  Mail, 
  Users, 
  BarChart3, 
  Send, 
  FileText, 
  Target,
  Plus,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Edit,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Calendar,
  Settings,
  MessageSquare,
  Mail as MailIcon,
  UserPlus,
  Building,
  Globe,
  Zap,
  Sparkles,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { 
  EmailCampaign, 
  EmailSubscriber, 
  EmailTemplate, 
  SubscriberSegment,
  getCampaigns,
  getSubscribers,
  getTemplates,
  getSegments,
  createCampaign,
  createSubscriber,
  createTemplate,
  createSegment,
  sendCampaign,
  getSubscriberStats,
  getCampaignStats
} from '../services/emailMarketingService';
import { testEmailConfiguration } from '../services/mailgunService';

const AdminLeadsPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'templates' | 'analytics'>('campaigns');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [segments, setSegments] = useState<SubscriberSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberStats, setSubscriberStats] = useState<any>({});
  
  // Modal states
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  
  // Form states
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: ''
  });
  
  const [subscriberForm, setSubscriberForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: ''
  });
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    category: 'general'
  });
  
  const [segmentForm, setSegmentForm] = useState({
    name: '',
    description: ''
  });
  
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [campaignsData, subscribersData, templatesData, segmentsData, statsData] = await Promise.all([
        getCampaigns(),
        getSubscribers(),
        getTemplates(),
        getSegments(),
        getSubscriberStats()
      ]);
      
      setCampaigns(campaignsData);
      setSubscribers(subscribersData);
      setTemplates(templatesData);
      setSegments(segmentsData);
      setSubscriberStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCampaign = async () => {
    try {
      const campaign = await createCampaign(
        campaignForm.name,
        campaignForm.subject,
        campaignForm.htmlContent,
        campaignForm.textContent
      );
      
      if (campaign) {
        setCampaigns([campaign, ...campaigns]);
        setShowCampaignModal(false);
        setCampaignForm({ name: '', subject: '', htmlContent: '', textContent: '' });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };
  
  const handleCreateSubscriber = async () => {
    try {
      const subscriber = await createSubscriber(
        subscriberForm.email,
        subscriberForm.firstName,
        subscriberForm.lastName,
        subscriberForm.phone,
        subscriberForm.company
      );
      
      if (subscriber) {
        setSubscribers([subscriber, ...subscribers]);
        setShowSubscriberModal(false);
        setSubscriberForm({ email: '', firstName: '', lastName: '', phone: '', company: '' });
      }
    } catch (error) {
      console.error('Error creating subscriber:', error);
    }
  };
  
  const handleCreateTemplate = async () => {
    try {
      const template = await createTemplate(
        templateForm.name,
        templateForm.subject,
        templateForm.htmlContent,
        templateForm.textContent,
        templateForm.category
      );
      
      if (template) {
        setTemplates([template, ...templates]);
        setShowTemplateModal(false);
        setTemplateForm({ name: '', subject: '', htmlContent: '', textContent: '', category: 'general' });
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };
  
  const handleCreateSegment = async () => {
    try {
      const segment = await createSegment(
        segmentForm.name,
        segmentForm.description
      );
      
      if (segment) {
        setSegments([segment, ...segments]);
        setShowSegmentModal(false);
        setSegmentForm({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating segment:', error);
    }
  };
  
  const handleSendCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      const result = await sendCampaign(selectedCampaign.id, selectedSegmentIds);
      if (result.success) {
        // Refresh campaigns to get updated stats
        const updatedCampaigns = await getCampaigns();
        setCampaigns(updatedCampaigns);
        setShowSendModal(false);
        setSelectedCampaign(null);
        setSelectedSegmentIds([]);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-500', text: 'Draft' },
      scheduled: { color: 'bg-blue-500', text: 'Scheduled' },
      sending: { color: 'bg-yellow-500', text: 'Sending' },
      sent: { color: 'bg-green-500', text: 'Sent' },
      paused: { color: 'bg-orange-500', text: 'Paused' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.text}</Badge>;
  };
  
  const getSubscriberStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-500', text: 'Active' },
      unsubscribed: { color: 'bg-red-500', text: 'Unsubscribed' },
      bounced: { color: 'bg-orange-500', text: 'Bounced' },
      spam: { color: 'bg-gray-500', text: 'Spam' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.color}>{config.text}</Badge>;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white">Loading email marketing...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const isAdmin = user?.email === 'support@homelistingai.com' || user?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leads Management</h1>
          <p className="text-gray-300 text-lg">Manage leads with email marketing automation and tracking</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">{subscriberStats.total || 0}</p>
                  <p className="text-sm text-green-400 font-medium flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Active Campaigns</p>
                  <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'sent').length}</p>
                  <p className="text-sm text-blue-400 font-medium flex items-center mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    {campaigns.length} Total
                  </p>
                </div>
                <Mail className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-white">24.5%</p>
                  <p className="text-sm text-green-400 font-medium flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.1%
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Click Rate</p>
                  <p className="text-2xl font-bold text-white">3.2%</p>
                  <p className="text-sm text-green-400 font-medium flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.8%
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto mb-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Campaigns
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'subscribers'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Lead List
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Email Templates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Lead Analytics
          </button>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Email Campaigns</h2>
              <Button onClick={() => setShowCampaignModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{campaign.name}</CardTitle>
                      {getStatusBadge(campaign.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{campaign.subject}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Recipients</p>
                        <p className="text-white font-medium">{campaign.total_recipients}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Sent</p>
                        <p className="text-white font-medium">{campaign.sent_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Opened</p>
                        <p className="text-white font-medium">{campaign.opened_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Clicked</p>
                        <p className="text-white font-medium">{campaign.clicked_count}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowSendModal(true);
                        }}
                        disabled={campaign.status === 'sent'}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Lead List</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Leads
                </Button>
                <Button onClick={() => setShowSubscriberModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-white font-medium">
                            {subscriber.first_name} {subscriber.last_name}
                          </p>
                          <p className="text-gray-400 text-sm">{subscriber.email}</p>
                          {subscriber.company && (
                            <p className="text-gray-500 text-xs">{subscriber.company}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getSubscriberStatusBadge(subscriber.status)}
                        <div className="text-right">
                          <p className="text-white text-sm">{subscriber.total_emails_sent} emails</p>
                          <p className="text-gray-400 text-xs">
                            {subscriber.total_emails_opened} opened
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Email Templates</h2>
              <Button onClick={() => setShowTemplateModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{template.subject}</p>
                    <Badge variant="outline">{template.category}</Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="w-4 h-4 mr-1" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Lead Analytics</h2>
              <Button 
                onClick={async () => {
                  const result = await testEmailConfiguration();
                  if (result.success) {
                    alert('Email configuration is working!');
                  } else {
                    alert(`Email configuration failed: ${result.error}`);
                  }
                }}
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                Test Email Config
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Open Rate</span>
                      <span className="text-white font-medium">24.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Click Rate</span>
                      <span className="text-white font-medium">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bounce Rate</span>
                      <span className="text-white font-medium">1.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Unsubscribe Rate</span>
                      <span className="text-white font-medium">0.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Subscriber Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Subscribers</span>
                      <span className="text-white font-medium">{subscriberStats.total || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Active</span>
                      <span className="text-white font-medium">{subscriberStats.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Unsubscribed</span>
                      <span className="text-white font-medium">{subscriberStats.unsubscribed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bounced</span>
                      <span className="text-white font-medium">{subscriberStats.bounced || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Email Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Campaign Name"
              value={campaignForm.name}
              onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              placeholder="Subject Line"
              value={campaignForm.subject}
              onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Textarea
              placeholder="HTML Content"
              value={campaignForm.htmlContent}
              onChange={(e) => setCampaignForm({ ...campaignForm, htmlContent: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white min-h-[200px]"
            />
            <Textarea
              placeholder="Text Content (optional)"
              value={campaignForm.textContent}
              onChange={(e) => setCampaignForm({ ...campaignForm, textContent: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCampaignModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscriber Modal */}
      <Dialog open={showSubscriberModal} onOpenChange={setShowSubscriberModal}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={subscriberForm.email}
              onChange={(e) => setSubscriberForm({ ...subscriberForm, email: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="First Name"
                value={subscriberForm.firstName}
                onChange={(e) => setSubscriberForm({ ...subscriberForm, firstName: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Last Name"
                value={subscriberForm.lastName}
                onChange={(e) => setSubscriberForm({ ...subscriberForm, lastName: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Input
              placeholder="Phone (optional)"
              value={subscriberForm.phone}
              onChange={(e) => setSubscriberForm({ ...subscriberForm, phone: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              placeholder="Company (optional)"
              value={subscriberForm.company}
              onChange={(e) => setSubscriberForm({ ...subscriberForm, company: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSubscriberModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSubscriber}>
                Add Lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Email Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Template Name"
              value={templateForm.name}
              onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              placeholder="Subject Line"
              value={templateForm.subject}
              onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Textarea
              placeholder="HTML Content"
              value={templateForm.htmlContent}
              onChange={(e) => setTemplateForm({ ...templateForm, htmlContent: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white min-h-[200px]"
            />
            <Textarea
              placeholder="Text Content (optional)"
              value={templateForm.textContent}
              onChange={(e) => setTemplateForm({ ...templateForm, textContent: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Campaign Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Send Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCampaign && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-white font-medium mb-2">{selectedCampaign.name}</h3>
                <p className="text-gray-300 text-sm">{selectedCampaign.subject}</p>
              </div>
            )}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Select Segments</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {segments.map((segment) => (
                  <label key={segment.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSegmentIds.includes(segment.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSegmentIds([...selectedSegmentIds, segment.id]);
                        } else {
                          setSelectedSegmentIds(selectedSegmentIds.filter(id => id !== segment.id));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-white text-sm">{segment.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSendModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendCampaign}>
                <Send className="w-4 h-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadsPage; 