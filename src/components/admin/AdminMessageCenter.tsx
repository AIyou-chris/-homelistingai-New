import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MessageSquare, Plus, Trash2, Edit, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Message {
  id: number;
  type: 'info' | 'update' | 'alert';
  title: string;
  message: string;
  date: string;
  priority: 'low' | 'normal' | 'high';
}

const AdminMessageCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to HomeListingAI! 🎉',
      message: 'Your platform is now live and ready for launch. Start adding listings and capturing leads!',
      date: '2025-07-16',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'update',
      title: 'New Features Coming Soon',
      message: 'We\'re working on advanced AI features and improved lead management. Stay tuned for updates!',
      date: '2025-07-16',
      priority: 'normal'
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    type: 'info' as 'info' | 'update' | 'alert',
    title: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  });

  const [isAdding, setIsAdding] = useState(false);

  const addMessage = () => {
    if (!newMessage.title || !newMessage.message) return;

    const message: Message = {
      id: Date.now(),
      type: newMessage.type,
      title: newMessage.title,
      message: newMessage.message,
      date: new Date().toISOString().split('T')[0],
      priority: newMessage.priority
    };

    setMessages([message, ...messages]);
    setNewMessage({
      type: 'info',
      title: '',
      message: '',
      priority: 'normal'
    });
    setIsAdding(false);
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'update': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'update': return 'bg-green-50 border-green-200';
      case 'alert': return 'bg-orange-50 border-orange-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Message Center</h2>
          <p className="text-muted-foreground">Manage messages that appear on agent dashboards</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Message
        </Button>
      </div>

      {/* Add New Message Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Add New Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newMessage.type} onValueChange={(value: any) => setNewMessage({...newMessage, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage({...newMessage, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newMessage.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage({...newMessage, title: e.target.value})}
                placeholder="Enter message title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={newMessage.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage({...newMessage, message: e.target.value})}
                placeholder="Enter message content..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addMessage} disabled={!newMessage.title || !newMessage.message}>
                Add Message
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Messages ({messages.length})</h3>
        {messages.map((message) => (
          <Card key={message.id} className={`${getBgColor(message.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(message.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{message.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">{message.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.message}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMessage(message.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview on Agent Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className={`p-4 rounded-lg border ${getBgColor(message.type)}`}>
                <div className="flex items-start gap-3">
                  {getIcon(message.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{message.title}</h4>
                      <span className="text-xs text-muted-foreground">{message.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessageCenter; 