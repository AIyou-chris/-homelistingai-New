import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  MicrophoneIcon, 
  PlayIcon, 
  PauseIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface AIRecording {
  id: string;
  type: 'chat' | 'voice';
  title: string;
  duration?: string;
  timestamp: Date;
  agent: string;
  prospect: string;
  status: 'completed' | 'in-progress' | 'failed';
  summary?: string;
  transcript?: string;
  audioUrl?: string;
}

const AIRecordingsPage: React.FC = () => {
  const [recordings, setRecordings] = useState<AIRecording[]>([]);
  const [filter, setFilter] = useState<'all' | 'chat' | 'voice'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState<AIRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockRecordings: AIRecording[] = [
      {
        id: '1',
        type: 'chat',
        title: 'Property Inquiry - 123 Main St',
        timestamp: new Date('2024-01-15T10:30:00'),
        agent: 'Sarah Martinez',
        prospect: 'John Smith',
        status: 'completed',
        summary: 'Prospect inquired about 3-bedroom home, interested in viewing this weekend.',
        transcript: 'Prospect: Hi, I saw your listing for 123 Main St. Is it still available?\nAI: Yes, it is! Would you like to schedule a viewing?\nProspect: That would be great. How about this Saturday?\nAI: Perfect! I have availability at 2 PM. Would that work for you?'
      },
      {
        id: '2',
        type: 'voice',
        title: 'Voice Call - Downtown Condo',
        duration: '5:23',
        timestamp: new Date('2024-01-14T15:45:00'),
        agent: 'Sarah Martinez',
        prospect: 'Emily Johnson',
        status: 'completed',
        summary: 'Prospect called about downtown condo, discussed financing options.',
        audioUrl: '/sample-audio.mp3'
      },
      {
        id: '3',
        type: 'chat',
        title: 'Quick Question - School District',
        timestamp: new Date('2024-01-13T09:15:00'),
        agent: 'Sarah Martinez',
        prospect: 'Mike Wilson',
        status: 'completed',
        summary: 'Prospect asked about school district ratings and walkability score.',
        transcript: 'Prospect: What\'s the school district like in this area?\nAI: The area is served by the highly-rated Oakwood School District...'
      },
      {
        id: '4',
        type: 'voice',
        title: 'Follow-up Call - Investment Property',
        duration: '8:12',
        timestamp: new Date('2024-01-12T14:20:00'),
        agent: 'Sarah Martinez',
        prospect: 'Lisa Chen',
        status: 'completed',
        summary: 'Follow-up call about investment property, discussed rental potential.',
        audioUrl: '/sample-audio.mp3'
      }
    ];

    setRecordings(mockRecordings);
    setIsLoading(false);
  }, []);

  const filteredRecordings = recordings.filter(recording => {
    if (filter === 'all') return true;
    return recording.type === filter;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'chat' ? (
      <ChatBubbleLeftRightIcon className="w-5 h-5" />
    ) : (
      <MicrophoneIcon className="w-5 h-5" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recordings</h1>
          <p className="text-gray-600">Review your AI chat and voice interactions with prospects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({recordings.length})
        </button>
        <button
          onClick={() => setFilter('chat')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'chat'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Chat ({recordings.filter(r => r.type === 'chat').length})
        </button>
        <button
          onClick={() => setFilter('voice')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'voice'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Voice ({recordings.filter(r => r.type === 'voice').length})
        </button>
      </div>

      {/* Recordings List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading recordings...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRecordings.map((recording) => (
              <div key={recording.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      recording.type === 'chat' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {getTypeIcon(recording.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{recording.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recording.status)}`}>
                          {recording.status}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>{recording.prospect}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(recording.timestamp)}</span>
                        </div>
                        {recording.duration && (
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{recording.duration}</span>
                          </div>
                        )}
                      </div>
                      
                      {recording.summary && (
                        <p className="mt-2 text-gray-700">{recording.summary}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedRecording(recording)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {recording.type === 'voice' && recording.audioUrl && (
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <PauseIcon className="w-5 h-5" />
                        ) : (
                          <PlayIcon className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    <button
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recording Details Modal */}
      {selectedRecording && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedRecording.title}</h2>
                <button
                  onClick={() => setSelectedRecording(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 capitalize">{selectedRecording.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecording.status)}`}>
                      {selectedRecording.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Prospect:</span>
                    <span className="ml-2">{selectedRecording.prospect}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2">{formatDate(selectedRecording.timestamp)}</span>
                  </div>
                </div>
                
                {selectedRecording.summary && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
                    <p className="text-gray-600">{selectedRecording.summary}</p>
                  </div>
                )}
                
                {selectedRecording.transcript && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Transcript</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRecording.transcript}</pre>
                    </div>
                  </div>
                )}
                
                {selectedRecording.type === 'voice' && selectedRecording.audioUrl && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Audio Recording</h3>
                    <audio controls className="w-full">
                      <source src={selectedRecording.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecordingsPage; 