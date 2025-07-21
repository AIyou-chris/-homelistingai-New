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
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConversationModal from '@/components/shared/ConversationModal';

interface Communication {
  id: string;
  type: 'chat' | 'voice';
  visitorName: string;
  listingTitle: string;
  timestamp: Date;
  duration?: number; // for voice calls
  messageCount: number;
  leadQuality: 'hot' | 'warm' | 'cold';
  status: 'active' | 'completed' | 'followup_needed';
  feedback?: 'thumbs_up' | 'thumbs_down' | null;
  responseTime: number; // in seconds
  conversionRate?: number;
  transcript?: string;
  recordingUrl?: string;
}

const CommunicationsPage: React.FC = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'chat' | 'voice'>('all');
  const [filterQuality, setFilterQuality] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'followup_needed'>('all');
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo data
  useEffect(() => {
    // Check if we're on demo dashboard
    const isDemo = window.location.pathname.startsWith('/demo-dashboard') || window.location.hash.startsWith('#/demo-dashboard');
    
    if (isDemo) {
      // Add fake communications data for demo
      const demoCommunications: Communication[] = [
        {
          id: 'comm-1',
          type: 'chat',
          visitorName: 'Sarah Johnson',
          listingTitle: '123 Oak Street - Beautiful 3BR Home',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          messageCount: 8,
          leadQuality: 'hot',
          status: 'completed',
          feedback: 'thumbs_up',
          responseTime: 15,
          conversionRate: 85,
          transcript: 'Sarah: Hi! I saw your listing for the Oak Street home. Is it still available?\nAI: Yes, it is! This is a beautiful 3-bedroom home with recent updates. What would you like to know about it?\nSarah: What are the HOA fees and what\'s included?\nAI: The HOA fees are $250/month and include water, trash, and access to the community pool and gym.\nSarah: That sounds great! Can we schedule a viewing?\nAI: Absolutely! I have availability tomorrow at 2 PM or Friday at 10 AM. Which works better for you?\nSarah: Tomorrow at 2 PM would be perfect.\nAI: Excellent! I\'ll send you a confirmation email with the details. Looking forward to showing you this beautiful home!'
        },
        {
          id: 'comm-2',
          type: 'voice',
          visitorName: 'Mike Chen',
          listingTitle: '456 Maple Avenue - Luxury 4BR Home',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          duration: 180, // 3 minutes
          messageCount: 12,
          leadQuality: 'warm',
          status: 'followup_needed',
          feedback: 'thumbs_up',
          responseTime: 8,
          conversionRate: 65,
          recordingUrl: '/demo-recording.mp3',
          transcript: 'Mike: Hi, I\'m interested in the Maple Avenue property. What\'s the current price?\nAI: The current price is $675,000. This is a stunning 4-bedroom home with a chef\'s kitchen and large deck.\nMike: What\'s the school district like?\nAI: This home is in the highly-rated Springfield School District. The elementary school is just a 5-minute walk away.\nMike: That\'s perfect for my family. Can we schedule a viewing?\nAI: Of course! I have availability this weekend. Would Saturday at 1 PM work for you?\nMike: Yes, that would be great.\nAI: Perfect! I\'ll send you a confirmation with the details. Looking forward to showing you this beautiful home!'
        },
        {
          id: 'comm-3',
          type: 'chat',
          visitorName: 'Emily Davis',
          listingTitle: '789 Pine Street - Cozy 2BR Condo',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          messageCount: 6,
          leadQuality: 'cold',
          status: 'completed',
          feedback: null,
          responseTime: 45,
          conversionRate: 25,
          transcript: 'Emily: Hi, I\'m looking for a condo in the downtown area.\nAI: Hi Emily! I have several great options in downtown. What\'s your budget range?\nEmily: Around $300k to $400k.\nAI: Perfect! I have a beautiful 2BR condo at 789 Pine Street for $350k. It has great amenities and is walking distance to everything.\nEmily: What are the HOA fees?\nAI: The HOA fees are $350/month and include water, trash, parking, and access to the fitness center.\nEmily: That\'s a bit high for my budget.\nAI: I understand. Let me show you some other options with lower HOA fees. Would you like to see those?'
        },
        {
          id: 'comm-4',
          type: 'voice',
          visitorName: 'David Wilson',
          listingTitle: '123 Oak Street - Beautiful 3BR Home',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          duration: 240, // 4 minutes
          messageCount: 15,
          leadQuality: 'hot',
          status: 'active',
          feedback: 'thumbs_up',
          responseTime: 12,
          conversionRate: 90,
          recordingUrl: '/demo-recording-2.mp3',
          transcript: 'David: Hi, I saw your listing for the Oak Street home. Is it still available?\nAI: Yes, it is! This is a beautiful 3-bedroom home with recent updates. What would you like to know about it?\nDavid: What\'s the current price and has it been on the market long?\nAI: The current price is $499,000 and it\'s been on the market for just 2 weeks. We\'ve had a lot of interest already.\nDavid: What are the key features?\nAI: This home features a modern kitchen with granite countertops, hardwood floors throughout, a finished basement, and a beautiful backyard with a deck.\nDavid: That sounds perfect! Can we schedule a viewing?\nAI: Absolutely! I have availability tomorrow at 2 PM or Friday at 10 AM. Which works better for you?\nDavid: Tomorrow at 2 PM would be perfect.\nAI: Excellent! I\'ll send you a confirmation email with the details. Looking forward to showing you this beautiful home!'
        },
        {
          id: 'comm-5',
          type: 'chat',
          visitorName: 'Lisa Thompson',
          listingTitle: '456 Maple Avenue - Luxury 4BR Home',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          messageCount: 10,
          leadQuality: 'warm',
          status: 'completed',
          feedback: 'thumbs_down',
          responseTime: 30,
          conversionRate: 40,
          transcript: 'Lisa: Hi, I\'m interested in the Maple Avenue property. What\'s the current price?\nAI: The current price is $675,000. This is a stunning 4-bedroom home with a chef\'s kitchen and large deck.\nLisa: What\'s the school district like?\nAI: This home is in the highly-rated Springfield School District. The elementary school is just a 5-minute walk away.\nLisa: That\'s perfect for my family. Can we schedule a viewing?\nAI: Of course! I have availability this weekend. Would Saturday at 1 PM work for you?\nLisa: Actually, I think this might be too expensive for us.\nAI: I understand. Let me show you some other options in your price range. What\'s your budget?\nLisa: Around $500k to $550k.\nAI: Perfect! I have several great options in that range. Would you like to see those?'
        }
      ];
      setCommunications(demoCommunications);
    } else {
      // Initialize with empty array for regular dashboard
      setCommunications([]);
    }
  }, []);

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = 
      comm.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.listingTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesQuality = filterQuality === 'all' || comm.leadQuality === filterQuality;
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
    
    return matchesSearch && matchesType && matchesQuality && matchesStatus;
  });

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

  const handleFeedback = (communicationId: string, feedback: 'thumbs_up' | 'thumbs_down') => {
    setCommunications(prev => 
      prev.map(comm => 
        comm.id === communicationId 
          ? { ...comm, feedback } 
          : comm
      )
    );
  };

  const handlePlayRecording = (communication: Communication) => {
    setSelectedCommunication(communication);
    setIsPlaying(true);
    // In real implementation, this would play the audio file
    setTimeout(() => setIsPlaying(false), 3000); // Demo: stop after 3 seconds
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage your chat and voice interactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    When visitors interact with your AI listings, their conversations and voice calls will appear here for you to review and manage.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your AI will automatically capture all interactions</span>
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
                          onClick={() => handleFeedback(communication.id, 'thumbs_up')}
                          className={communication.feedback === 'thumbs_up' ? 'text-green-600 bg-green-50' : ''}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(communication.id, 'thumbs_down')}
                          className={communication.feedback === 'thumbs_down' ? 'text-red-600 bg-red-50' : ''}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        {communication.type === 'voice' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayRecording(communication)}
                          >
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

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {communications.filter(c => c.type === 'voice').length}
              </div>
              <div className="text-sm text-gray-600">Voice Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {communications.filter(c => c.type === 'chat').length}
              </div>
              <div className="text-sm text-gray-600">Chat Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {communications.filter(c => c.status === 'followup_needed').length}
              </div>
              <div className="text-sm text-gray-600">Follow-ups Needed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {communications.length > 0 
                  ? Math.round(communications.reduce((acc, c) => acc + (c.conversionRate || 0), 0) / communications.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

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

export default CommunicationsPage; 