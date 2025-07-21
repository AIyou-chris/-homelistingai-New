import React, { useState, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Edit3, 
  Save, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  User,
  MessageSquare,
  Phone,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

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
}

interface ConversationModalProps {
  communication: Communication;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes?: (communicationId: string, notes: string) => void;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  communication,
  isOpen,
  onClose,
  onUpdateNotes
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState(communication.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo messages for chat conversations
  const demoMessages: Message[] = communication.messages || [
    {
      id: '1',
      text: communication.type === 'voice' ? 'Hi, I saw your listing for the downtown apartment. Is it still available?' : 'Hi! I\'m interested in this property.',
      sender: 'user',
      timestamp: new Date(communication.timestamp.getTime() - 300000), // 5 minutes before
      feedback: null
    },
    {
      id: '2',
      text: communication.type === 'voice' ? 'Yes, it is! Would you like to schedule a viewing?' : 'Great! This is a beautiful property. What would you like to know about it?',
      sender: 'bot',
      timestamp: new Date(communication.timestamp.getTime() - 240000), // 4 minutes before
      feedback: 'thumbs_up'
    },
    {
      id: '3',
      text: communication.type === 'voice' ? 'That would be great. What times work for you?' : 'What are the HOA fees and what\'s included?',
      sender: 'user',
      timestamp: new Date(communication.timestamp.getTime() - 180000), // 3 minutes before
      feedback: null
    },
    {
      id: '4',
      text: communication.type === 'voice' ? 'I have availability tomorrow at 2 PM or Friday at 10 AM. Which works better for you?' : 'The HOA fees are $350/month and include water, trash, and access to the pool and gym. The building also has 24/7 security.',
      sender: 'bot',
      timestamp: new Date(communication.timestamp.getTime() - 120000), // 2 minutes before
      feedback: 'thumbs_up'
    },
    {
      id: '5',
      text: communication.type === 'voice' ? 'Tomorrow at 2 PM works perfect. Can you send me the address?' : 'That sounds great! Can I schedule a viewing?',
      sender: 'user',
      timestamp: new Date(communication.timestamp.getTime() - 60000), // 1 minute before
      feedback: null
    },
    {
      id: '6',
      text: communication.type === 'voice' ? 'Absolutely! I\'ll send you the address and confirm the appointment. Looking forward to meeting you!' : 'Absolutely! I have availability tomorrow at 2 PM or Friday at 10 AM. Which works better for you?',
      sender: 'bot',
      timestamp: communication.timestamp,
      feedback: 'thumbs_up'
    }
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
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

  const handlePlayPause = () => {
    if (communication.type === 'voice' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(communication.id, notes);
    }
    setIsEditingNotes(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {communication.type === 'voice' ? (
                  <Phone className="w-6 h-6" />
                ) : (
                  <MessageSquare className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{communication.visitorName}</h2>
                <p className="text-blue-100">{communication.listingTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getQualityColor(communication.leadQuality)}>
                {communication.leadQuality.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(communication.status)}>
                {communication.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Conversation */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Voice Recording Player */}
              {communication.type === 'voice' && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Voice Recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handlePlayPause}
                        className="w-12 h-12 rounded-full"
                        variant={isPlaying ? "destructive" : "default"}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">
                            {formatDuration(currentTime)} / {formatDuration(communication.duration || 0)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({formatDuration(communication.duration || 0)} total)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(currentTime / (communication.duration || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    {/* Demo audio element */}
                    <audio
                      ref={audioRef}
                      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                      onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                      onEnded={() => setIsPlaying(false)}
                      style={{ display: 'none' }}
                    >
                      <source src="/demo-audio.mp3" type="audio/mpeg" />
                    </audio>
                  </CardContent>
                </Card>
              )}

              {/* Messages */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {communication.type === 'voice' ? 'Call Transcript' : 'Chat Messages'}
                </h3>
                {demoMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm">{message.text}</p>
                        {message.sender === 'bot' && (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                message.feedback === 'thumbs_up' ? 'text-green-600' : 'text-gray-400'
                              }`}
                              title="This response was helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                message.feedback === 'thumbs_down' ? 'text-red-600' : 'text-gray-400'
                              }`}
                              title="This response was not helpful"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()} • {formatTimeAgo(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Details & Notes */}
          <div className="w-80 border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Conversation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <Badge variant="outline">
                      {communication.type === 'voice' ? 'Voice Call' : 'Chat'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">{communication.responseTime}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-medium">{communication.conversionRate}%</span>
                  </div>
                  {communication.type === 'voice' && communication.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="text-sm font-medium">{formatDuration(communication.duration)}</span>
                    </div>
                  )}
                  {communication.type === 'chat' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Messages</span>
                      <span className="text-sm font-medium">{communication.messageCount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Started</span>
                    <span className="text-sm font-medium">{formatTimeAgo(communication.timestamp)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Notes</CardTitle>
                    {!isEditingNotes ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingNotes(true)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveNotes}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this conversation..."
                      className="min-h-[120px]"
                      autoFocus
                    />
                  ) : (
                    <div className="min-h-[120px] p-3 bg-gray-50 rounded-lg">
                      {notes ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No notes yet. Click edit to add notes.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Conversation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Transcript
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal; 