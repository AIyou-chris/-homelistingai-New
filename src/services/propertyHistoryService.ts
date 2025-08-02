import { getPropertyHistory } from './attomDataService';
import { askOpenAI } from './openaiService';

// Property History Types
export interface PropertyHistoryEvent {
  id: string;
  date: string;
  event_type: 'sale' | 'listing' | 'renovation' | 'permit' | 'tax_change' | 'market_event';
  title: string;
  description: string;
  price?: number;
  price_change?: number;
  days_on_market?: number;
  buyer?: string;
  seller?: string;
  source: 'attom' | 'ai_generated' | 'manual';
  confidence_score: number;
  metadata?: any;
}

export interface PropertyHistorySummary {
  total_sales: number;
  average_price: number;
  price_appreciation: number;
  total_days_on_market: number;
  average_days_on_market: number;
  last_sale_date: string;
  last_sale_price: number;
  property_age: number;
  renovation_count: number;
  market_performance: 'excellent' | 'good' | 'average' | 'below_average';
}

export interface PropertyHistoryAnalysis {
  summary: PropertyHistorySummary;
  trends: {
    price_trend: 'increasing' | 'decreasing' | 'stable';
    market_activity: 'high' | 'medium' | 'low';
    investment_potential: 'high' | 'medium' | 'low';
  };
  insights: string[];
  recommendations: string[];
}

export const propertyHistoryService = {
  // Get comprehensive property history
  async getPropertyHistory(address: string, currentPrice: number): Promise<PropertyHistoryEvent[]> {
    try {
      // Get real ATTOM data
      const attomHistory = await getPropertyHistory(address);
      
      // Transform ATTOM data
      const realEvents: PropertyHistoryEvent[] = attomHistory.map((event, index) => ({
        id: `attom-${index}`,
        date: event.date || event.saleDate,
        event_type: 'sale' as const,
        title: `Property Sold`,
        description: `Property sold for $${event.price?.toLocaleString() || 'N/A'}`,
        price: event.price,
        days_on_market: event.daysOnMarket,
        buyer: event.buyer,
        seller: event.seller,
        source: 'attom' as const,
        confidence_score: 0.95,
        metadata: event
      }));

      // Generate AI-enhanced events
      const aiEvents = await this.generateAIHistoryEvents(address, currentPrice, realEvents);
      
      return [...realEvents, ...aiEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching property history:', error);
      // Fallback to AI-generated history
      return await this.generateAIHistoryEvents(address, currentPrice, []);
    }
  },

  // Generate AI-enhanced history events
  async generateAIHistoryEvents(address: string, currentPrice: number, realEvents: PropertyHistoryEvent[]): Promise<PropertyHistoryEvent[]> {
    try {
      const prompt = `
        Generate realistic property history events for: ${address}
        Current Price: $${currentPrice.toLocaleString()}
        
        Real Events Found: ${realEvents.length}
        ${realEvents.map(e => `${e.date}: ${e.title} - $${e.price?.toLocaleString()}`).join('\n')}
        
        Generate additional realistic events including:
        - Renovations and improvements
        - Market events and neighborhood changes
        - Property tax changes
        - Permit history
        - Maintenance events
        
        Format as JSON array:
        [
          {
            "id": "ai-1",
            "date": "2023-06-15",
            "event_type": "renovation",
            "title": "Kitchen Renovation",
            "description": "Complete kitchen remodel with new cabinets, countertops, and appliances",
            "source": "ai_generated",
            "confidence_score": 0.85
          }
        ]
      `;

      const aiResponse = await askOpenAI([
        { role: 'system', content: 'You are a real estate historian. Generate realistic property history events based on address and current price. Focus on renovations, market events, and property improvements.' },
        { role: 'user', content: prompt }
      ]);

      const aiEvents: PropertyHistoryEvent[] = JSON.parse(aiResponse);
      return aiEvents;
    } catch (error) {
      console.error('Error generating AI history events:', error);
      return [];
    }
  },

  // Analyze property history
  async analyzePropertyHistory(events: PropertyHistoryEvent[]): Promise<PropertyHistoryAnalysis> {
    try {
      const sales = events.filter(e => e.event_type === 'sale');
      const renovations = events.filter(e => e.event_type === 'renovation');
      
      // Calculate summary statistics
      const totalSales = sales.length;
      const averagePrice = sales.reduce((sum, sale) => sum + (sale.price || 0), 0) / totalSales;
      const priceAppreciation = totalSales > 1 ? 
        ((sales[0].price || 0) - (sales[sales.length - 1].price || 0)) / (sales[sales.length - 1].price || 1) * 100 : 0;
      
      const summary: PropertyHistorySummary = {
        total_sales: totalSales,
        average_price: averagePrice,
        price_appreciation: priceAppreciation,
        total_days_on_market: sales.reduce((sum, sale) => sum + (sale.days_on_market || 0), 0),
        average_days_on_market: sales.reduce((sum, sale) => sum + (sale.days_on_market || 0), 0) / totalSales,
        last_sale_date: sales[0]?.date || '',
        last_sale_price: sales[0]?.price || 0,
        property_age: new Date().getFullYear() - (events.find(e => e.event_type === 'sale')?.date?.split('-')[0] || new Date().getFullYear()),
        renovation_count: renovations.length,
        market_performance: priceAppreciation > 20 ? 'excellent' : priceAppreciation > 10 ? 'good' : priceAppreciation > 0 ? 'average' : 'below_average'
      };

      // Generate AI analysis
      const analysisPrompt = `
        Analyze this property history:
        
        Summary:
        - Total Sales: ${summary.total_sales}
        - Average Price: $${summary.average_price.toLocaleString()}
        - Price Appreciation: ${summary.price_appreciation.toFixed(1)}%
        - Renovations: ${summary.renovation_count}
        - Market Performance: ${summary.market_performance}
        
        Events: ${events.map(e => `${e.date}: ${e.title}`).join('\n')}
        
        Provide analysis in JSON format:
        {
          "trends": {
            "price_trend": "increasing|decreasing|stable",
            "market_activity": "high|medium|low",
            "investment_potential": "high|medium|low"
          },
          "insights": ["array of insights"],
          "recommendations": ["array of recommendations"]
        }
      `;

      const aiResponse = await askOpenAI([
        { role: 'system', content: 'You are a real estate analyst. Analyze property history and provide insights about market trends, investment potential, and recommendations.' },
        { role: 'user', content: analysisPrompt }
      ]);

      const analysis = JSON.parse(aiResponse);

      return {
        summary,
        trends: analysis.trends,
        insights: analysis.insights,
        recommendations: analysis.recommendations
      };
    } catch (error) {
      console.error('Error analyzing property history:', error);
      throw error;
    }
  },

  // Get property timeline
  async getPropertyTimeline(address: string, currentPrice: number): Promise<PropertyHistoryEvent[]> {
    const events = await this.getPropertyHistory(address, currentPrice);
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Get market insights
  async getMarketInsights(address: string, currentPrice: number): Promise<any> {
    try {
      const events = await this.getPropertyHistory(address, currentPrice);
      const analysis = await this.analyzePropertyHistory(events);
      
      return {
        market_performance: analysis.summary.market_performance,
        price_trend: analysis.trends.price_trend,
        investment_potential: analysis.trends.investment_potential,
        insights: analysis.insights,
        recommendations: analysis.recommendations
      };
    } catch (error) {
      console.error('Error getting market insights:', error);
      throw error;
    }
  },

  // Generate property history report
  async generateHistoryReport(address: string, currentPrice: number): Promise<any> {
    try {
      const events = await this.getPropertyHistory(address, currentPrice);
      const analysis = await this.analyzePropertyHistory(events);
      
      const reportPrompt = `
        Generate a comprehensive property history report for: ${address}
        Current Price: $${currentPrice.toLocaleString()}
        
        Analysis:
        - Market Performance: ${analysis.summary.market_performance}
        - Price Appreciation: ${analysis.summary.price_appreciation.toFixed(1)}%
        - Total Sales: ${analysis.summary.total_sales}
        - Renovations: ${analysis.summary.renovation_count}
        
        Events: ${events.map(e => `${e.date}: ${e.title} - ${e.description}`).join('\n')}
        
        Create a professional report with:
        1. Executive Summary
        2. Property Timeline
        3. Market Analysis
        4. Investment Insights
        5. Recommendations
        
        Format as JSON:
        {
          "report_title": "string",
          "executive_summary": "string",
          "timeline_summary": "string",
          "market_analysis": "string",
          "investment_insights": "string",
          "recommendations": ["array"],
          "key_metrics": {
            "price_appreciation": "string",
            "market_performance": "string",
            "investment_potential": "string"
          }
        }
      `;

      const aiResponse = await askOpenAI([
        { role: 'system', content: 'You are a professional real estate analyst. Create comprehensive property history reports with actionable insights.' },
        { role: 'user', content: reportPrompt }
      ]);

      return JSON.parse(aiResponse);
    } catch (error) {
      console.error('Error generating history report:', error);
      throw error;
    }
  }
}; 