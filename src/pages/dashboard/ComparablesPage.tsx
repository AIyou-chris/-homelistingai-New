import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  MagnifyingGlassIcon,
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
  PresentationChartLineIcon
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
import { comparablesService, ComparableProperty, ComparableAnalysis, MarketTrends, ComparableReport } from '../../services/comparablesService';

const ComparablesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparables' | 'analysis' | 'trends' | 'reports'>('overview');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [comparables, setComparables] = useState<ComparableProperty[]>([]);
  const [analysis, setAnalysis] = useState<ComparableAnalysis | null>(null);
  const [trends, setTrends] = useState<MarketTrends[]>([]);
  const [reports, setReports] = useState<ComparableReport[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFindComparables, setShowFindComparables] = useState(false);
  const [showAddComparable, setShowAddComparable] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);

  // Mock listing data for demo
  const mockListing = {
    id: 'mock-listing-1',
    address: '123 Oak Street, Springfield, IL',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2000
  };

  useEffect(() => {
    setSelectedListingId(mockListing.id);
    loadData();
  }, []);

  const loadData = async () => {
    if (!selectedListingId) return;
    
    setIsLoading(true);
    try {
      const [comparablesData, analyticsData] = await Promise.all([
        comparablesService.getComparables(selectedListingId),
        comparablesService.getComparablesAnalytics(selectedListingId)
      ]);
      
      setComparables(comparablesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindComparables = async () => {
    setIsLoading(true);
    try {
      const foundComparables = await comparablesService.findComparables(
        selectedListingId,
        mockListing.address,
        mockListing.price,
        mockListing.bedrooms,
        mockListing.bathrooms,
        mockListing.square_feet
      );
      
      setComparables(foundComparables);
      setShowFindComparables(false);
      
      // Generate AI analysis
      if (foundComparables.length > 0) {
        const analysisData = await comparablesService.generateAIAnalysis(selectedListingId, foundComparables);
        setAnalysis(analysisData);
      }
    } catch (error) {
      console.error('Error finding comparables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (reportType: 'basic' | 'detailed' | 'ai_enhanced' | 'market_analysis') => {
    setIsLoading(true);
    try {
      const report = await comparablesService.generateComparableReport(selectedListingId, reportType);
      setReports(prev => [report, ...prev]);
      setShowGenerateReport(false);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <HomeIcon className="w-8 h-8 text-blue-600 mr-3" />
            Comparables Analysis
          </h1>
          <p className="text-gray-600 mt-2">AI-powered comparable properties and market analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowFindComparables(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            Find Comparables
          </Button>
          <Button onClick={() => setShowAddComparable(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Comparable
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

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'comparables', name: 'Comparables', icon: HomeIcon },
                             { id: 'analysis', name: 'AI Analysis', icon: CpuChipIcon },
              { id: 'trends', name: 'Market Trends', icon: ArrowTrendingUpIcon },
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
                    <CardTitle className="text-sm font-medium">Total Comparables</CardTitle>
                    <HomeIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{comparables.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Properties found
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                    <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${analytics?.avg_price ? Math.round(analytics.avg_price).toLocaleString() : '0'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Market average
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Price/Sq Ft</CardTitle>
                    <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${analytics?.avg_price_per_sqft ? Math.round(analytics.avg_price_per_sqft) : '0'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Per square foot
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                         <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
                     <CpuChipIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getConfidenceColor(analytics?.confidence_score || 0)}`}>
                      {Math.round((analytics?.confidence_score || 0) * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Analysis confidence
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
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => setShowFindComparables(true)}>
                      <MagnifyingGlassIcon className="w-8 h-8 mb-2 text-blue-600" />
                      <span className="font-medium">Find Comparables</span>
                      <span className="text-xs text-gray-500">Search ATTOM database</span>
                    </Button>
                    
                                         <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => setActiveTab('analysis')}>
                       <CpuChipIcon className="w-8 h-8 mb-2 text-purple-600" />
                       <span className="font-medium">AI Analysis</span>
                       <span className="text-xs text-gray-500">Generate insights</span>
                     </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => setShowGenerateReport(true)}>
                      <DocumentTextIcon className="w-8 h-8 mb-2 text-green-600" />
                      <span className="font-medium">Generate Report</span>
                      <span className="text-xs text-gray-500">Create detailed report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'comparables' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Comparable Properties</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setShowFindComparables(true)}>
                    <MagnifyingGlassIcon className="w-4 h-4 mr-1" />
                    Find More
                  </Button>
                  <Button size="sm" onClick={() => setShowAddComparable(true)}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Manual
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparables.map((comparable) => (
                  <Card key={comparable.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg truncate">{comparable.comparable_address}</CardTitle>
                        <Badge className={getConfidenceColor(comparable.comparable_confidence_score)}>
                          {Math.round(comparable.comparable_confidence_score * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">${comparable.comparable_price.toLocaleString()}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Bedrooms:</span> {comparable.comparable_bedrooms}
                          </div>
                          <div>
                            <span className="font-medium">Bathrooms:</span> {comparable.comparable_bathrooms}
                          </div>
                          <div>
                            <span className="font-medium">Sq Ft:</span> {comparable.comparable_sqft.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Price/Sq Ft:</span> ${comparable.comparable_price_per_sqft?.toFixed(0)}
                          </div>
                        </div>
                        
                        {comparable.comparable_sold_date && (
                          <div className="text-sm text-gray-600">
                            Sold: {new Date(comparable.comparable_sold_date).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
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

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Analysis</h3>
              
              {analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                                             <CardTitle className="flex items-center">
                         <CpuChipIcon className="w-5 h-5 mr-2 text-purple-600" />
                         Market Position
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Position:</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {analysis.analysis_data?.market_position?.replace('_', ' ') || 'Unknown'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className={`font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
                            {Math.round(analysis.confidence_score * 100)}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {analysis.ai_insights}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-600" />
                        Pricing Recommendation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Suggested Price:</span>
                          <span className="font-bold text-green-600">
                            ${analysis.analysis_data?.pricing_recommendation?.suggested_price?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price Range:</span>
                          <span className="text-sm">
                            ${analysis.analysis_data?.pricing_recommendation?.price_range_min?.toLocaleString()} - 
                            ${analysis.analysis_data?.pricing_recommendation?.price_range_max?.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {analysis.analysis_data?.pricing_recommendation?.reasoning}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                                         <CpuChipIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No AI analysis available yet.</p>
                    <Button onClick={() => setShowFindComparables(true)} className="mt-4">
                      Find Comparables to Analyze
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Market Trends</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trends.map((trend) => (
                  <Card key={trend.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{trend.trend_period.replace('_', ' ').toUpperCase()}</span>
                        <span className={`text-lg ${getTrendColor(trend.price_trend)}`}>
                          {getTrendIcon(trend.price_trend)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Avg Price:</span>
                          <span className="font-medium">${trend.avg_price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Price/Sq Ft:</span>
                          <span className="font-medium">${trend.avg_price_per_sqft}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Days on Market:</span>
                          <span className="font-medium">{trend.avg_days_on_market}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Sales:</span>
                          <span className="font-medium">{trend.total_sales}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Market Activity:</span>
                          <Badge className={`${
                            trend.market_activity === 'high' ? 'bg-green-100 text-green-800' :
                            trend.market_activity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {trend.market_activity}
                          </Badge>
                        </div>
                        {trend.trend_insights && (
                          <div className="text-sm text-gray-600 mt-3">
                            {trend.trend_insights}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Comparable Reports</h3>
                <Button onClick={() => setShowGenerateReport(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Generate New Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{report.report_title}</CardTitle>
                        <Badge className={`${
                          report.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                          report.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.confidence_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{report.report_type.replace('_', ' ')}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.report_summary && (
                          <p className="text-sm text-gray-600">{report.report_summary}</p>
                        )}
                        
                        {report.pricing_recommendation && (
                          <div className="text-sm">
                            <span className="font-medium">Recommended Price:</span>
                            <span className="font-bold text-green-600 ml-2">
                              ${report.pricing_recommendation.toLocaleString()}
                            </span>
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

      {/* Find Comparables Modal */}
      <Dialog open={showFindComparables} onOpenChange={setShowFindComparables}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Find Comparable Properties</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Address</label>
              <Input value={mockListing.address} readOnly />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <Input value={`$${mockListing.price.toLocaleString()}`} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Square Feet</label>
                <Input value={mockListing.square_feet.toLocaleString()} readOnly />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <Input value={mockListing.bedrooms.toString()} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <Input value={mockListing.bathrooms.toString()} readOnly />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setShowFindComparables(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleFindComparables} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Find Comparables'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Report Modal */}
      <Dialog open={showGenerateReport} onOpenChange={setShowGenerateReport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Comparable Report</DialogTitle>
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
                  <span className="text-xs text-gray-500">Quick overview</span>
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
                  <span className="text-xs text-gray-500">Trends and forecasts</span>
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

export default ComparablesPage; 