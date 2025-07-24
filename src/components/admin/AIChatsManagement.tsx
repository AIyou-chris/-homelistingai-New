import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Mail, 
  Phone,
  Calendar,
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
  MessageCircle,
  BarChart3,
  DollarSign,
  MapPin,
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Download as DownloadIcon,
  Upload,
  Headphones,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { 
  AIChat,
  getAIChats,
  getAIChat,
  createAIChat,
  updateAIChat,
  endAIChat,
  getChatMessages,
  addChatMessage,
  getChatStats,
  searchChats,
  filterChatsByStatus,
  filterChatsByType
} from '../../services/aiChatsService';
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

// Using AIChat interface from service

interface AIChatsManagementProps {
  onChatAction?: (action: string, chatId: string) => void;
}

const AIChatsManagement: React.FC<AIChatsManagementProps> = ({ onChatAction }) => {
  const [chats, setChats] = useState<AIChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<AIChat | null>(null);
  const [chatNotes, setChatNotes] = useState('');
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const realChats = await getAIChats();
      setChats(realChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatAction = async (action: string, chatId: string) => {
    try {
      const chat = chats.find(c => c.id === chatId);
      
      switch (action) {
        case 'see':
          console.log('Viewing chat details:', chat);
          if (chat) {
            setSelectedChat(chat);
            setChatNotes(chat.notes);
            setShowChatModal(true);
          }
          break;
        case 'transcript':
          if (chat?.transcript) {
            setSelectedChat(chat);
            setShowTranscriptModal(true);
          }
          break;
        case 'recording':
          if (chat?.recording_url) {
            setSelectedChat(chat);
            setShowRecordingModal(true);
          }
          break;
        case 'resume':
          setChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, status: 'active' } : c
          ));
          break;
        case 'pause':
          setChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, status: 'paused' } : c
          ));
          break;
        case 'end':
          setChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, status: 'ended', end_time: new Date().toISOString() } : c
          ));
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
            setChats(prev => prev.filter(chat => chat.id !== chatId));
          }
          break;
      }
      
      onChatAction?.(action, chatId);
    } catch (error) {
      console.error(`Error performing ${action} on chat:`, error);
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = (chat.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (chat.user_email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    const matchesType = filterType === 'all' || chat.session_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500 text-white"><Pause className="w-3 h-3 mr-1" />Paused</Badge>;
      case 'ended':
        return <Badge className="bg-gray-500 text-white"><Square className="w-3 h-3 mr-1" />Ended</Badge>;
      case 'transferred':
        return <Badge className="bg-blue-500 text-white"><User className="w-3 h-3 mr-1" />Transferred</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sales':
        return <Badge className="bg-purple-500 text-white"><DollarSign className="w-3 h-3 mr-1" />Sales</Badge>;
      case 'support':
        return <Badge className="bg-blue-500 text-white"><MessageCircle className="w-3 h-3 mr-1" />Support</Badge>;
      case 'general':
        return <Badge className="bg-gray-500 text-white"><Globe className="w-3 h-3 mr-1" />General</Badge>;
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

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Positive</Badge>;
      case 'neutral':
        return <Badge className="bg-gray-500 text-white"><MessageSquare className="w-3 h-3 mr-1" />Neutral</Badge>;
      case 'negative':
        return <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Negative</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  const activeChats = chats.filter(chat => chat.status === 'active').length;
  const totalDuration = chats.reduce((sum, chat) => sum + chat.duration, 0);
  const voiceChats = chats.filter(chat => chat.voice_enabled).length;
  const positiveSentiment = chats.filter(chat => chat.sentiment === 'positive').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-300">Loading AI chats...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Chats Management</h2>
          <p className="text-gray-300">Monitor and manage AI-powered sales and support conversations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            onClick={fetchChats}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Bot className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Chats</p>
                <p className="text-white text-2xl font-bold">{activeChats}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Duration</p>
                <p className="text-white text-2xl font-bold">{formatDuration(totalDuration)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Voice Chats</p>
                <p className="text-white text-2xl font-bold">{voiceChats}</p>
              </div>
              <Mic className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Positive Sentiment</p>
                <p className="text-white text-2xl font-bold">{positiveSentiment}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-200" />
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
                  placeholder="Search by user name or email..."
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
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
                <option value="general">General</option>
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

      {/* Chats Table */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>AI Chats ({filteredChats.length})</span>
            <div className="text-sm text-gray-400">
              {selectedChats.length > 0 && `${selectedChats.length} selected`}
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
                          setSelectedChats(filteredChats.map(c => c.id));
                        } else {
                          setSelectedChats([]);
                        }
                      }}
                      className="rounded border-white/20 bg-white/10"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Sentiment</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Messages</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Voice</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Started</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChats.map((chat) => (
                  <motion.tr
                    key={chat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedChats.includes(chat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChats([...selectedChats, chat.id]);
                          } else {
                            setSelectedChats(selectedChats.filter(id => id !== chat.id));
                          }
                        }}
                        className="rounded border-white/20 bg-white/10"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-white">{chat.user_name || 'Unknown User'}</div>
                                                  <div className="text-sm text-gray-400">{chat.user_email || 'No email'}</div>
                        <div className="text-xs text-gray-500">{chat.assigned_agent}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getTypeBadge(chat.session_type)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(chat.status)}
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(chat.priority)}
                    </td>
                    <td className="py-3 px-4">
                      {getSentimentBadge(chat.sentiment)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{formatDuration(chat.duration)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300">{chat.messages_count}</span>
                    </td>
                    <td className="py-3 px-4">
                      {chat.voice_enabled ? (
                        <Mic className="w-4 h-4 text-green-400" />
                      ) : (
                        <MicOff className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-400">
                        {formatDate(chat.start_time)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-white/10"
                            onClick={() => console.log('Dropdown clicked for chat:', chat.id)}
                          >
                            <MoreVertical className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 min-w-[200px]">
                          <DropdownMenuItem 
                            onClick={() => handleChatAction('see', chat.id)}
                            className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {chat.transcript && (
                            <DropdownMenuItem 
                              onClick={() => handleChatAction('transcript', chat.id)}
                              className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Transcript
                            </DropdownMenuItem>
                          )}
                          {chat.recording_url && (
                            <DropdownMenuItem 
                              onClick={() => handleChatAction('recording', chat.id)}
                              className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4 mr-2" />
                              Play Recording
                            </DropdownMenuItem>
                          )}
                          {chat.status === 'paused' && (
                            <DropdownMenuItem 
                              onClick={() => handleChatAction('resume', chat.id)}
                              className="text-green-300 hover:bg-green-900/20 cursor-pointer"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Resume Chat
                            </DropdownMenuItem>
                          )}
                          {chat.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handleChatAction('pause', chat.id)}
                              className="text-yellow-300 hover:bg-yellow-900/20 cursor-pointer"
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Chat
                            </DropdownMenuItem>
                          )}
                          {chat.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handleChatAction('end', chat.id)}
                              className="text-red-300 hover:bg-red-900/20 cursor-pointer"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              End Chat
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleChatAction('delete', chat.id)}
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

      {/* Chat Details Modal */}
      {showChatModal && selectedChat && (
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
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Chat with {selectedChat.user_name || 'Unknown User'}</h3>
                  <p className="text-gray-400">{selectedChat.assigned_agent}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowChatModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">User</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedChat.user_name || 'Unknown User'} ({selectedChat.user_email || 'No email'})
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(selectedChat.session_type)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedChat.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Duration</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {formatDuration(selectedChat.duration)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Priority</label>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(selectedChat.priority)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Sentiment</label>
                  <div className="flex items-center space-x-2">
                    {getSentimentBadge(selectedChat.sentiment)}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Messages</label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                    {selectedChat.messages_count} messages
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Voice</label>
                  <div className="flex items-center space-x-2">
                    {selectedChat.voice_enabled ? (
                      <Badge className="bg-green-500 text-white">
                        <Mic className="w-3 h-3 mr-1" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500 text-white">
                        <MicOff className="w-3 h-3 mr-1" />
                        Disabled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedChat.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Chat Notes
              </label>
              <Textarea
                placeholder="Add notes about this chat..."
                value={chatNotes}
                onChange={(e) => setChatNotes(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedChat.transcript && (
                  <Button
                    onClick={() => {
                      setShowChatModal(false);
                      handleChatAction('transcript', selectedChat.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Transcript
                  </Button>
                )}
                {selectedChat.recording_url && (
                  <Button
                    onClick={() => {
                      setShowChatModal(false);
                      handleChatAction('recording', selectedChat.id);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Recording
                  </Button>
                )}
                {selectedChat.status === 'paused' && (
                  <Button
                    onClick={() => {
                      setShowChatModal(false);
                      handleChatAction('resume', selectedChat.id);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume Chat
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowChatModal(false)}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log('Saving notes for chat:', selectedChat.id);
                    setShowChatModal(false);
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

      {/* Transcript Modal */}
      {showTranscriptModal && selectedChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Chat Transcript - {selectedChat.user_name || 'Unknown User'}</h3>
              <Button
                variant="ghost"
                onClick={() => setShowTranscriptModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                {selectedChat.transcript}
              </pre>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTranscriptModal(false)}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  console.log('Downloading transcript for chat:', selectedChat.id);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Recording Modal */}
      {showRecordingModal && selectedChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Voice Recording - {selectedChat.user_name || 'Unknown User'}</h3>
              <Button
                variant="ghost"
                onClick={() => setShowRecordingModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => setCurrentTime(0)}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / selectedChat.duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm">
                    {formatDuration(currentTime)} / {formatDuration(selectedChat.duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Duration: {formatDuration(selectedChat.duration)}</span>
                <span>Voice: {selectedChat.voice_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowRecordingModal(false)}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  console.log('Downloading recording for chat:', selectedChat.id);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AIChatsManagement; 