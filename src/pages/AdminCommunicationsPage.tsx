import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  User, 
  Calendar,
  Download,
  BarChart3,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Volume2,
  FileText,
  Eye,
  EyeOff,
  Settings,
  Users,
  Bot,
  Activity,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConversationModal from '@/components/shared/ConversationModal';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  feedback?: 'thumbs_up' | 'thumbs_down' | null;
}

interface Communication {
  id: string;
  type: 'chat' | 'voice';
  visitorName: string;
  listingTitle: string;
  timestamp: Date;
  duration?: number;
  messageCount: number;
  leadQuality: 'hot' | 'warm' | 'cold';
  status: 'active' | 'completed' | 'followup_needed';
  feedback?: 'thumbs_up' | 'thumbs_down' | null;
  responseTime: number;
  conversionRate?: number;
  transcript?: string;
  recordingUrl?: string;
  messages?: Message[];
  notes?: string;
  agentName: string;
  agentId: string;
  listingId: string;
}

interface BotStats {
  totalConversations: number;
  averageResponseTime: number;
  averageConversionRate: number;
  totalFeedback: number;
  positiveFeedback: number;
  negativeFeedback: number;
}

const AdminCommunicationsPage: React.FC = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'chat' | 'voice'>('all');
  const [filterQuality, setFilterQuality] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'followup_needed'>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'conversations' | 'bots' | 'analytics'>('conversations');

  // Demo data with multiple agents
  useEffect(() => {
    // Initialize with empty array - no demo data
    setCommunications([]);
  }, []);

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = 
      comm.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesQuality = filterQuality === 'all' || comm.leadQuality === filterQuality;
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
    const matchesAgent = filterAgent === 'all' || comm.agentId === filterAgent;
    
    return matchesSearch && matchesType && matchesQuality && matchesStatus && matchesAgent;
  });

  const agents = Array.from(new Set(communications.map(c => ({ id: c.agentId, name: c.agentName }))));

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'followup_needed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewConversation = (communication: Communication) => {
    setSelectedCommunication(communication);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCommunication(null);
  };

  const handleUpdateNotes = (communicationId: string, notes: string) => {
    setCommunications(prev => 
      prev.map(comm => 
        comm.id === communicationId 
          ? { ...comm, notes } 
          : comm
      )
    );
  };

  const getBotStats = (): BotStats => {
    const totalConversations = communications.length;
    const averageResponseTime = totalConversations > 0 
      ? Math.round(communications.reduce((acc, c) => acc + c.responseTime, 0) / totalConversations)
      : 0;
    const averageConversionRate = totalConversations > 0
      ? Math.round(communications.reduce((acc, c) => acc + (c.conversionRate || 0), 0) / totalConversations)
      : 0;
    const totalFeedback = communications.filter(c => c.feedback).length;
    const positiveFeedback = communications.filter(c => c.feedback === 'thumbs_up').length;
    const negativeFeedback = communications.filter(c => c.feedback === 'thumbs_down').length;

    return {
      totalConversations,
      averageResponseTime,
      averageConversionRate,
      totalFeedback,
      positiveFeedback,
      negativeFeedback
    };
  };

  const stats = getBotStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Communications</h1>
          <p className="text-gray-600">Manage all chat bots and voice bots across your platform</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'conversations' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('conversations')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversations
          </Button>
          <Button 
            variant={viewMode === 'bots' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('bots')}
          >
            <Bot className="w-4 h-4 mr-2" />
            Bot Management
          </Button>
          <Button 
            variant={viewMode === 'analytics' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Bot Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-green-600">{stats.averageResponseTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageConversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Feedback Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalFeedback > 0 
                    ? Math.round((stats.positiveFeedback / stats.totalFeedback) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'conversations' && (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="chat">Chat Only</SelectItem>
                    <SelectItem value="voice">Voice Only</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterQuality} onValueChange={(value: any) => setFilterQuality(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lead Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quality</SelectItem>
                    <SelectItem value="hot">Hot Leads</SelectItem>
                    <SelectItem value="warm">Warm Leads</SelectItem>
                    <SelectItem value="cold">Cold Leads</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="followup_needed">Follow-up Needed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAgent} onValueChange={(value: any) => setFilterAgent(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Communications List */}
          <div className="space-y-4">
            {filteredCommunications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Communications Yet</h3>
                      <p className="text-gray-600 max-w-md">
                        When agents' AI listings receive visitor interactions, their conversations and voice calls will appear here for admin review and management.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>All agent communications will be visible here</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredCommunications.map((communication) => (
                <Card key={communication.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Type Icon */}
                        <div className="flex-shrink-0">
                          {communication.type === 'voice' ? (
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-green-600" />
                            </div>
                          )}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{communication.visitorName}</h3>
                            <Badge className={getQualityColor(communication.leadQuality)}>
                              {communication.leadQuality.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(communication.status)}>
                              {communication.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {communication.agentName}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">{communication.listingTitle}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(communication.timestamp)}
                            </span>
                            {communication.type === 'voice' && communication.duration && (
                              <span className="flex items-center gap-1">
                                <Volume2 className="w-4 h-4" />
                                {formatDuration(communication.duration)}
                              </span>
                            )}
                            {communication.type === 'chat' && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {communication.messageCount} messages
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              {communication.responseTime}s response
                            </span>
                          </div>

                          {/* Transcript Preview */}
                          {communication.transcript && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {communication.transcript}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Feedback Buttons */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={communication.feedback === 'thumbs_up' ? 'text-green-600 bg-green-50' : ''}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={communication.feedback === 'thumbs_down' ? 'text-red-600 bg-red-50' : ''}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {communication.type === 'voice' && (
                              <Button variant="ghost" size="sm">
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewConversation(communication)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {viewMode === 'bots' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bot Management</h3>
            {agents.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Bots</h3>
                    <p className="text-gray-600 max-w-md">
                      When agents create AI listings, their bots will appear here for management and monitoring.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>Bots will be created automatically with listings</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{agent.name}</h4>
                        <p className="text-sm text-gray-600">Active Bot</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'analytics' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
            {communications.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
                    <p className="text-gray-600 max-w-md">
                      Analytics will appear here once agents start receiving communications through their AI listings.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>Metrics will populate automatically</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Conversations</span>
                      <span className="font-medium">{stats.totalConversations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="font-medium">{stats.averageResponseTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Conversion Rate</span>
                      <span className="font-medium">{stats.averageConversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Positive Feedback</span>
                      <span className="font-medium">{stats.positiveFeedback}/{stats.totalFeedback}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Bot Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Bots</span>
                      <span className="font-medium">{agents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Voice Calls</span>
                      <span className="font-medium">{communications.filter(c => c.type === 'voice').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Chat Conversations</span>
                      <span className="font-medium">{communications.filter(c => c.type === 'chat').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hot Leads</span>
                      <span className="font-medium">{communications.filter(c => c.leadQuality === 'hot').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversation Modal */}
      {selectedCommunication && (
        <ConversationModal
          communication={selectedCommunication}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </div>
  );
};

export default AdminCommunicationsPage; 