// Market Data Service - Connects to existing APIs for real market intelligence
import { getPropertyDetails, getComparableProperties, getNeighborhoodData, getPropertyHistory } from './attomDataService';
import { generatePropertyReport, generateComparableProperties } from './propertyDataService';

export interface MarketInsight {
  type: 'comparable' | 'trend' | 'neighborhood' | 'history' | 'analysis';
  title: string;
  description: string;
  data: any;
  timestamp: string;
}

export interface MarketKnowledgeBase {
  propertyAddress: string;
  insights: MarketInsight[];
  lastUpdated: string;
  marketTrend: 'rising' | 'stable' | 'declining';
  averagePricePerSqFt: number;
  daysOnMarket: number;
  inventoryLevel: 'low' | 'medium' | 'high';
}

// Get comprehensive market data for a property
export const getMarketData = async (address: string): Promise<MarketKnowledgeBase> => {
  try {
    const insights: MarketInsight[] = [];
    
    // Get property details
    const propertyDetails = await getPropertyDetails(address);
    
    // Get comparable properties
    const comparables = await getComparableProperties(address, 0.5);
    
    // Get neighborhood data
    const neighborhood = await getNeighborhoodData(address);
    
    // Get property history
    const history = await getPropertyHistory(address);
    
    // Generate property report
    const report = await generatePropertyReport(address, 0, '');
    
    // Calculate market trends
    const avgPricePerSqFt = comparables.length > 0 
      ? comparables.reduce((sum, comp) => sum + (comp.sale.amount / (comp.building.size.livingsize || 1000)), 0) / comparables.length
      : 0;
    
    const daysOnMarket = comparables.length > 0
      ? comparables.reduce((sum, comp) => sum + 30, 0) / comparables.length // Mock calculation
      : 45;
    
    // Determine market trend
    let marketTrend: 'rising' | 'stable' | 'declining' = 'stable';
    if (comparables.length >= 2) {
      const recentSales = comparables.slice(0, 3);
      const olderSales = comparables.slice(-3);
      const recentAvg = recentSales.reduce((sum, comp) => sum + comp.sale.amount, 0) / recentSales.length;
      const olderAvg = olderSales.reduce((sum, comp) => sum + comp.sale.amount, 0) / olderSales.length;
      
      if (recentAvg > olderAvg * 1.05) marketTrend = 'rising';
      else if (recentAvg < olderAvg * 0.95) marketTrend = 'declining';
    }
    
    // Determine inventory level
    const inventoryLevel: 'low' | 'medium' | 'high' = comparables.length < 5 ? 'low' : comparables.length < 15 ? 'medium' : 'high';
    
    // Add comparable properties insight
    if (comparables.length > 0) {
      insights.push({
        type: 'comparable',
        title: 'Recent Comparable Sales',
        description: `${comparables.length} comparable properties sold in the area`,
        data: comparables.slice(0, 5),
        timestamp: new Date().toISOString()
      });
    }
    
    // Add market trend insight
    insights.push({
      type: 'trend',
      title: 'Market Trend Analysis',
      description: `Market is currently ${marketTrend} with average price per sq ft of $${avgPricePerSqFt.toFixed(2)}`,
      data: { trend: marketTrend, avgPricePerSqFt, daysOnMarket },
      timestamp: new Date().toISOString()
    });
    
    // Add neighborhood insight
    if (neighborhood) {
      insights.push({
        type: 'neighborhood',
        title: 'Neighborhood Overview',
        description: 'Local area demographics and amenities',
        data: neighborhood,
        timestamp: new Date().toISOString()
      });
    }
    
    // Add property history insight
    if (history && history.length > 0) {
      insights.push({
        type: 'history',
        title: 'Property History',
        description: 'Historical property events and transactions',
        data: history,
        timestamp: new Date().toISOString()
      });
    }
    
    // Add market analysis insight
    insights.push({
      type: 'analysis',
      title: 'Market Analysis',
      description: report.marketAnalysis,
      data: report,
      timestamp: new Date().toISOString()
    });
    
    return {
      propertyAddress: address,
      insights,
      lastUpdated: new Date().toISOString(),
      marketTrend,
      averagePricePerSqFt: avgPricePerSqFt,
      daysOnMarket,
      inventoryLevel
    };
    
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      propertyAddress: address,
      insights: [],
      lastUpdated: new Date().toISOString(),
      marketTrend: 'stable',
      averagePricePerSqFt: 0,
      daysOnMarket: 0,
      inventoryLevel: 'medium'
    };
  }
};

// Get market insights for a specific property
export const getMarketInsights = async (address: string): Promise<MarketInsight[]> => {
  const marketData = await getMarketData(address);
  return marketData.insights;
};

// Get comparable properties for market analysis
export const getComparableMarketData = async (address: string): Promise<any[]> => {
  try {
    const comparables = await getComparableProperties(address, 0.5);
    return comparables.map(comp => ({
      address: comp.address.oneLine,
      price: comp.sale.amount,
      bedrooms: comp.building.rooms.beds,
      bathrooms: comp.building.rooms.bathstotal,
      squareFootage: comp.building.size.livingsize,
      soldDate: comp.sale.date,
      pricePerSqFt: comp.sale.amount / (comp.building.size.livingsize || 1000)
    }));
  } catch (error) {
    console.error('Error fetching comparable market data:', error);
    return [];
  }
};

// Get neighborhood market data
export const getNeighborhoodMarketData = async (address: string): Promise<any> => {
  try {
    return await getNeighborhoodData(address);
  } catch (error) {
    console.error('Error fetching neighborhood market data:', error);
    return null;
  }
}; 