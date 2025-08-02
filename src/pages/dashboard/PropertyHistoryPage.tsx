import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  SparklesIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon,
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon
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
import { propertyHistoryService, PropertyHistoryEvent, PropertyHistoryAnalysis } from '../../services/propertyHistoryService';

const PropertyHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'analysis' | 'insights' | 'reports'>('overview');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [historyEvents, setHistoryEvents] = useState<PropertyHistoryEvent[]>([]);
  const [analysis, setAnalysis] = useState<PropertyHistoryAnalysis | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);

  // Mock property data for demo
  const mockProperty = {
    address: '123 Oak Street, Springfield, IL',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2000
  };

  useEffect(() => {
    setSelectedAddress(mockProperty.address);
    setCurrentPrice(mockProperty.price);
    loadData();
  }, []);

  const loadData = async () => {
    if (!selectedAddress || !currentPrice) return;
    
    setIsLoading(true);
    try {
      const [eventsData, analysisData] = await Promise.all([
        propertyHistoryService.getPropertyHistory(selectedAddress, currentPrice),
        propertyHistoryService.getPropertyHistory(selectedAddress, currentPrice).then(events => 
          propertyHistoryService.analyzePropertyHistory(events)
        )
      ]);
      
      setHistoryEvents(eventsData);
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (reportType: 'basic' | 'detailed' | 'ai_enhanced' | 'market_analysis') => {
    setIsLoading(true);
    try {
      const report = await propertyHistoryService.generateHistoryReport(selectedAddress, currentPrice);
      setReports(prev => [report, ...prev]);
      setShowGenerateReport(false);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'sale': return HomeIcon;
      case 'listing': return BuildingOfficeIcon;
      case 'renovation': return WrenchScrewdriverIcon;
      case 'permit': return ClipboardDocumentListIcon;
      case 'tax_change': return CurrencyDollarIcon;
      case 'market_event': return ChartBarIcon;
      default: return ClockIcon;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'sale': return 'bg-green-100 text-green-800';
      case 'listing': return 'bg-blue-100 text-blue-800';
      case 'renovation': return 'bg-purple-100 text-purple-800';
      case 'permit': return 'bg-yellow-100 text-yellow-800';
      case 'tax_change': return 'bg-red-100 text-red-800';
      case 'market_event': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'below_average': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ClockIcon className="w-8 h-8 text-blue-600 mr-3" />
            Property History
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive property timeline and market analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowAddEvent(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Event
          </Button>
          <Button 
            onClick={() => setShowGenerateReport(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Property Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-gray-600" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input value={selectedAddress} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
              <Input value={`$${currentPrice.toLocaleString()}`} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Details</label>
              <Input value={`${mockProperty.bedrooms} bed, ${mockProperty.bathrooms} bath, ${mockProperty.square_feet.toLocaleString()} sq ft`} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'timeline', name: 'Timeline', icon: ClockIcon },
              { id: 'analysis', name: 'Analysis', icon: CpuChipIcon },
              { id: 'insights', name: 'Insights', icon: LightBulbIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <HomeIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analysis?.summary.total_sales || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Historical sales
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Price Appreciation</CardTitle>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getPerformanceColor(analysis?.summary.market_performance || 'average')}`}>
                      {analysis?.summary.price_appreciation ? `${analysis.summary.price_appreciation.toFixed(1)}%` : '0%'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Since first sale
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Renovations</CardTitle>
                    <WrenchScrewdriverIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analysis?.summary.renovation_count || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Improvements made
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Market Performance</CardTitle>
                    <StarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getPerformanceColor(analysis?.summary.market_performance || 'average')}`}>
                      {analysis?.summary.market_performance?.replace('_', ' ') || 'Average'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Performance rating
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
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => setActiveTab('timeline')}>
                      <ClockIcon className="w-8 h-8 mb-2 text-blue-600" />
                      <span className="font-medium">View Timeline</span>
                      <span className="text-xs text-gray-500">Complete property history</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => setActiveTab('analysis')}>
                      <CpuChipIcon className="w-8 h-8 mb-2 text-purple-600" />
                      <span className="font-medium">AI Analysis</span>
                      <span className="text-xs text-gray-500">Market insights</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => setShowGenerateReport(true)}>
                      <DocumentTextIcon className="w-8 h-8 mb-2 text-green-600" />
                      <span className="font-medium">Generate Report</span>
                      <span className="text-xs text-gray-500">Professional analysis</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Property Timeline</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setShowAddEvent(true)}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {historyEvents.map((event) => {
                  const EventIcon = getEventIcon(event.event_type);
                  return (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${getEventColor(event.event_type)}`}>
                            <EventIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className={getEventColor(event.event_type)}>
                                  {event.event_type.replace('_', ' ')}
                                </Badge>
                                <span className="text-sm text-gray-500">{event.date}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            {event.price && (
                              <div className="text-sm">
                                <span className="font-medium">Price: </span>
                                <span className="text-green-600 font-bold">${event.price.toLocaleString()}</span>
                              </div>
                            )}
                            {event.days_on_market && (
                              <div className="text-sm">
                                <span className="font-medium">Days on Market: </span>
                                <span>{event.days_on_market}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">Source: {event.source}</span>
                              <span className="text-xs text-gray-500">Confidence: {Math.round(event.confidence_score * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Analysis</h3>
              
              {analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CpuChipIcon className="w-5 h-5 mr-2 text-purple-600" />
                        Market Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Price Trend:</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {analysis.trends.price_trend}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Market Activity:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {analysis.trends.market_activity}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Investment Potential:</span>
                          <Badge className="bg-purple-100 text-purple-800">
                            {analysis.trends.investment_potential}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-600" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Average Price:</span>
                          <span className="font-bold text-green-600">
                            ${analysis.summary.average_price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Days on Market:</span>
                          <span className="font-medium">
                            {Math.round(analysis.summary.average_days_on_market)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Property Age:</span>
                          <span className="font-medium">
                            {analysis.summary.property_age} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Sale:</span>
                          <span className="text-sm">
                            {analysis.summary.last_sale_date}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CpuChipIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No analysis available yet.</p>
                    <Button onClick={() => loadData()} className="mt-4">
                      Generate Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Insights</h3>
              
              {analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-600" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <LightBulbIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <RocketLaunchIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <RocketLaunchIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No insights available yet.</p>
                    <Button onClick={() => loadData()} className="mt-4">
                      Generate Insights
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Property History Reports</h3>
                <Button onClick={() => setShowGenerateReport(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Generate New Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{report.report_title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">
                          AI Generated
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Property History Analysis</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.executive_summary && (
                          <p className="text-sm text-gray-600">{report.executive_summary}</p>
                        )}
                        
                        {report.key_metrics && (
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Price Appreciation:</span>
                              <span className="font-bold text-green-600">
                                {report.key_metrics.price_appreciation}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Market Performance:</span>
                              <span className="font-bold">
                                {report.key_metrics.market_performance}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      <Dialog open={showGenerateReport} onOpenChange={setShowGenerateReport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Property History Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => handleGenerateReport('basic')}
                  disabled={isLoading}
                >
                  <DocumentTextIcon className="w-8 h-8 mb-2 text-blue-600" />
                  <span className="font-medium">Basic Report</span>
                  <span className="text-xs text-gray-500">Timeline overview</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => handleGenerateReport('detailed')}
                  disabled={isLoading}
                >
                  <DocumentChartBarIcon className="w-8 h-8 mb-2 text-green-600" />
                  <span className="font-medium">Detailed Report</span>
                  <span className="text-xs text-gray-500">Comprehensive analysis</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => handleGenerateReport('ai_enhanced')}
                  disabled={isLoading}
                >
                  <CpuChipIcon className="w-8 h-8 mb-2 text-purple-600" />
                  <span className="font-medium">AI Enhanced</span>
                  <span className="text-xs text-gray-500">AI insights included</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => handleGenerateReport('market_analysis')}
                  disabled={isLoading}
                >
                  <PresentationChartLineIcon className="w-8 h-8 mb-2 text-orange-600" />
                  <span className="font-medium">Market Analysis</span>
                  <span className="text-xs text-gray-500">Market trends and forecasts</span>
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setShowGenerateReport(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyHistoryPage; 