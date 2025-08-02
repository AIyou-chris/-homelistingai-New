import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  Cog6ToothIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { advancedFollowupService, FollowupSequence, FollowupStep, LeadFollowup, AILeadScoring } from '../../services/advancedFollowupService';

const AdvancedFollowupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sequences' | 'leads' | 'analytics' | 'ai'>('overview');
  const [sequences, setSequences] = useState<FollowupSequence[]>([]);
  const [leadFollowups, setLeadFollowups] = useState<LeadFollowup[]>([]);
  const [aiScoring, setAiScoring] = useState<AILeadScoring[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateSequence, setShowCreateSequence] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<FollowupSequence | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sequencesData, analyticsData] = await Promise.all([
        advancedFollowupService.getFollowupSequences(),
        advancedFollowupService.getFollowupAnalytics()
      ]);
      
      setSequences(sequencesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create default sequences
  const createDefaultSequences = async () => {
    try {
      // New Lead Sequence
      const newLeadSequence = await advancedFollowupService.createFollowupSequence({
        name: "New Lead Welcome",
        description: "Automated welcome sequence for new leads",
        trigger_type: "lead_capture",
        status: "active",
        total_steps: 5,
        average_conversion_rate: 0.25
      });

      // Add steps to new lead sequence
      await advancedFollowupService.createFollowupStep({
        sequence_id: newLeadSequence.id,
        step_number: 1,
        step_type: "email",
        delay_hours: 0,
        delay_days: 0,
        subject: "Welcome to HomeListingAI! 🏠",
        content_template: "Welcome email template with AI personalization",
        personalization_fields: ["lead_name", "lead_email", "lead_source"],
        status: "active"
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: newLeadSequence.id,
        step_number: 2,
        step_type: "email",
        delay_hours: 0,
        delay_days: 1,
        subject: "Here are 3 properties you might love",
        content_template: "Property recommendations with AI insights",
        personalization_fields: ["lead_name", "property_preferences"],
        status: "active"
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: newLeadSequence.id,
        step_number: 3,
        step_type: "sms",
        delay_hours: 0,
        delay_days: 3,
        content_template: "Quick check-in SMS with AI personalization",
        personalization_fields: ["lead_name"],
        status: "active"
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: newLeadSequence.id,
        step_number: 4,
        step_type: "email",
        delay_hours: 0,
        delay_days: 7,
        subject: "Market update: New listings in your area",
        content_template: "Market insights with AI-generated content",
        personalization_fields: ["lead_name", "market_data"],
        status: "active"
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: newLeadSequence.id,
        step_number: 5,
        step_type: "call",
        delay_hours: 0,
        delay_days: 14,
        content_template: "Final follow-up call script with AI personalization",
        personalization_fields: ["lead_name", "lead_phone", "interaction_history"],
        status: "active"
      });

      // Appointment Follow-up Sequence
      const appointmentSequence = await advancedFollowupService.createFollowupSequence({
        name: "Appointment Follow-up",
        description: "Follow-up sequence for scheduled appointments",
        trigger_type: "appointment_scheduled",
        status: "active",
        total_steps: 3,
        average_conversion_rate: 0.40
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: appointmentSequence.id,
        step_number: 1,
        step_type: "email",
        delay_hours: 0,
        delay_days: 0,
        subject: "Appointment Confirmation",
        content_template: "Appointment confirmation with AI personalization",
        personalization_fields: ["lead_name", "appointment_date", "property_details"],
        status: "active"
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: appointmentSequence.id,
        step_number: 2,
        step_type: "sms",
        delay_hours: 2,
        delay_days: 0,
        content_template: "Reminder SMS with AI personalization",
        personalization_fields: ["lead_name", "appointment_time"],
        status: "active"
      });

      await advancedFollowupService.createFollowupStep({
        sequence_id: appointmentSequence.id,
        step_number: 3,
        step_type: "email",
        delay_hours: 0,
        delay_days: 1,
        subject: "How was your appointment?",
        content_template: "Post-appointment follow-up with AI insights",
        personalization_fields: ["lead_name", "appointment_feedback"],
        status: "active"
      });

      await loadData();
      console.log('✅ Default sequences created successfully!');
    } catch (error) {
      console.error('Error creating default sequences:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SparklesIcon className="w-8 h-8 text-purple-600 mr-3" />
            Advanced Follow-up
          </h1>
          <p className="text-gray-600 mt-2">AI-powered lead nurturing and automation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={createDefaultSequences}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RocketLaunchIcon className="w-4 h-4 mr-2" />
            Setup Default Sequences
          </Button>
          <Button onClick={() => setShowCreateSequence(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'sequences', name: 'Sequences', icon: Cog6ToothIcon },
              { id: 'leads', name: 'Lead Follow-ups', icon: UserGroupIcon },
              { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
                             { id: 'ai', name: 'AI Insights', icon: CpuChipIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Sequences</CardTitle>
                    <Cog6ToothIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sequences.filter(s => s.status === 'active').length}</div>
                    <p className="text-xs text-muted-foreground">
                      {sequences.length} total sequences
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Follow-ups</CardTitle>
                    <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.active_followups || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.total_followups || 0} total follow-ups
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analytics?.conversion_rate || 0).toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.converted_leads || 0} converted leads
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                         <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
                     <CpuChipIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics?.average_score || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      AI-powered scoring
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <EnvelopeIcon className="w-8 h-8 mb-2 text-blue-600" />
                      <span className="font-medium">Send AI Email</span>
                      <span className="text-xs text-gray-500">Generate personalized email</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <PhoneIcon className="w-8 h-8 mb-2 text-green-600" />
                      <span className="font-medium">AI Call Script</span>
                      <span className="text-xs text-gray-500">Generate call script</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 mb-2 text-purple-600" />
                      <span className="font-medium">Start AI Chat</span>
                      <span className="text-xs text-gray-500">Engage with AI assistant</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'sequences' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Follow-up Sequences</h3>
                <Button onClick={() => setShowCreateSequence(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Sequence
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sequences.map((sequence) => (
                  <Card key={sequence.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{sequence.name}</CardTitle>
                        <Badge className={getStatusColor(sequence.status)}>
                          {sequence.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{sequence.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Steps:</span>
                          <span className="font-medium">{sequence.total_steps}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Conversion Rate:</span>
                          <span className="font-medium">{(sequence.average_conversion_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Trigger:</span>
                          <span className="font-medium capitalize">{sequence.trigger_type.replace('_', ' ')}</span>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedSequence(sequence)}>
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <PlayIcon className="w-4 h-4 mr-1" />
                            {sequence.status === 'active' ? 'Pause' : 'Start'}
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Lead Follow-ups</h3>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Active Follow-ups</h4>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {leadFollowups.map((followup) => (
                    <div key={followup.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Lead #{followup.lead_id.slice(0, 8)}</h5>
                          <p className="text-sm text-gray-600">
                            Step {followup.current_step} • {followup.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(followup.status)}>
                            {followup.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Follow-up Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Follow-ups</span>
                        <span className="font-medium">{analytics?.total_followups || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Follow-ups</span>
                        <span className="font-medium">{analytics?.active_followups || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Converted Leads</span>
                        <span className="font-medium">{analytics?.converted_leads || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion Rate</span>
                        <span className="font-medium">{(analytics?.conversion_rate || 0).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interaction Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Interactions</span>
                        <span className="font-medium">{analytics?.total_interactions || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Lead Score</span>
                        <span className="font-medium">{Math.round(analytics?.average_score || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email Open Rate</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Click-through Rate</span>
                        <span className="font-medium">12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Insights & Scoring</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                                         <CardTitle className="flex items-center">
                       <CpuChipIcon className="w-5 h-5 mr-2 text-purple-600" />
                       AI Lead Scoring
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiScoring.map((score) => (
                        <div key={score.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Lead #{score.lead_id.slice(0, 8)}</span>
                            <span className={`font-bold ${getScoreColor(score.score)}`}>
                              {score.score}/100
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Conversion Probability: {(score.predicted_conversion_probability * 100).toFixed(1)}%</p>
                            <p className="mt-1">{score.ai_insights}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <SparklesIcon className="w-5 h-5 mr-2 text-yellow-600" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h5 className="font-medium text-blue-900 mb-2">High-Value Lead Detected</h5>
                        <p className="text-sm text-blue-700">
                          Lead #abc123 has 85% conversion probability. Recommend immediate follow-up call.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h5 className="font-medium text-green-900 mb-2">Sequence Optimization</h5>
                        <p className="text-sm text-green-700">
                          Email sequences sent at 2 PM have 23% higher open rates. Consider adjusting timing.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h5 className="font-medium text-purple-900 mb-2">Content Personalization</h5>
                        <p className="text-sm text-purple-700">
                          Leads from "chat" source respond better to SMS. Adjust channel mix.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Sequence Modal */}
      <Dialog open={showCreateSequence} onOpenChange={setShowCreateSequence}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Follow-up Sequence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sequence Name</label>
              <Input placeholder="e.g., New Lead Welcome Sequence" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea placeholder="Describe what this sequence does..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Trigger Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_capture">Lead Capture</SelectItem>
                  <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                  <SelectItem value="property_viewed">Property Viewed</SelectItem>
                  <SelectItem value="market_update">Market Update</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setShowCreateSequence(false)} variant="outline">
                Cancel
              </Button>
              <Button>
                Create Sequence
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedFollowupPage; 