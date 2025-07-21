import { walkScoreService, WalkScoreData } from './walkScoreService';
import { supabase } from '../lib/supabase';

export interface NeighborhoodData {
  // Basic Info
  name: string;
  description: string;
  city: string;
  state: string;
  
  // Walkability Scores
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  walkScoreDescription: string;
  
  // Demographics
  demographics: {
    population?: number;
    medianAge?: number;
    medianIncome?: number;
    homeOwnershipRate?: number;
    averageHouseholdSize?: number;
  };
  
  // Safety & Crime
  crimeRating: string;
  crimeRate?: number;
  safetyScore?: number;
  
  // Amenities
  nearbyAmenities: {
    restaurants: AmenityItem[];
    shopping: AmenityItem[];
    parks: AmenityItem[];
    schools: AmenityItem[];
    healthcare: AmenityItem[];
    entertainment: AmenityItem[];
  };
  
  // Transportation
  publicTransit: TransitItem[];
  
  // Market Data
  marketData: {
    averageHomePrice?: number;
    pricePerSqFt?: number;
    daysOnMarket?: number;
    inventoryLevel?: string;
  };
  
  // Additional Info
  highlights: string[];
  drawbacks: string[];
  bestFor: string[];
  
  // Metadata
  lastUpdated: string;
  dataSources: string[];
}

export interface AmenityItem {
  name: string;
  distance: string;
  rating?: number;
  type: string;
  address?: string;
}

export interface TransitItem {
  name: string;
  type: 'bus' | 'train' | 'subway' | 'light_rail';
  distance: string;
  frequency: string;
  route?: string;
}

export interface NeighborhoodParams {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

class NeighborhoodService {
  private googlePlacesApiKey: string;
  private crimeDataApiKey: string;

  constructor() {
    this.googlePlacesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
    this.crimeDataApiKey = import.meta.env.VITE_CRIME_DATA_API_KEY || '';
  }

  async getNeighborhoodData(params: NeighborhoodParams): Promise<NeighborhoodData> {
    try {
      console.log('🏘️ Fetching neighborhood data for:', params.address);
      
      // Get walkability scores
      const walkScoreData = await this.getWalkabilityData(params);
      
      // Get nearby amenities
      const amenities = await this.getNearbyAmenities(params);
      
      // Get demographics
      const demographics = await this.getDemographicsData(params);
      
      // Get crime data
      const crimeData = await this.getCrimeData(params);
      
      // Get market data
      const marketData = await this.getMarketData(params);
      
      // Generate neighborhood description
      const description = this.generateNeighborhoodDescription(params, walkScoreData, demographics);
      
      // Generate highlights and drawbacks
      const { highlights, drawbacks, bestFor } = this.generateInsights(walkScoreData, demographics, crimeData);
      
      return {
        name: this.extractNeighborhoodName(params.address),
        description,
        city: params.city,
        state: params.state,
        
        // Walkability
        walkScore: walkScoreData.walkscore,
        transitScore: walkScoreData.transit?.score || 0,
        bikeScore: walkScoreData.bike?.score || 0,
        walkScoreDescription: walkScoreData.description,
        
        // Demographics
        demographics,
        
        // Crime & Safety
        crimeRating: crimeData.rating,
        crimeRate: crimeData.rate,
        safetyScore: crimeData.safetyScore,
        
        // Amenities
        nearbyAmenities: amenities,
        
        // Transportation
        publicTransit: await this.getTransitData(params),
        
        // Market Data
        marketData,
        
        // Insights
        highlights,
        drawbacks,
        bestFor,
        
        // Metadata
        lastUpdated: new Date().toISOString(),
        dataSources: ['WalkScore', 'Google Places', 'US Census Bureau', 'Crime Data API']
      };
      
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
      return this.getMockNeighborhoodData(params);
    }
  }

  private async getWalkabilityData(params: NeighborhoodParams): Promise<WalkScoreData> {
    try {
      console.log('🌍 Fetching walkability data for:', params.address);
      return await walkScoreService.getWalkScore({
        address: params.address,
        latitude: params.latitude,
        longitude: params.longitude,
        transit: true,
        bike: true
      });
    } catch (error) {
      console.error('Error fetching walkability data:', error);
      console.log('Using mock walkability data due to API error');
      return this.getMockWalkScoreData();
    }
  }

  private async getNearbyAmenities(params: NeighborhoodParams) {
    if (!this.googlePlacesApiKey) {
      return this.getMockAmenities();
    }

    try {
      const amenities = await this.fetchGooglePlaces(params);
      return this.categorizeAmenities(amenities);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      return this.getMockAmenities();
    }
  }

  private async fetchGooglePlaces(params: NeighborhoodParams) {
    const types = ['restaurant', 'shopping_mall', 'park', 'school', 'hospital', 'movie_theater'];
    const promises = types.map(type => 
      this.searchNearbyPlaces(params.latitude, params.longitude, type)
    );
    
    const results = await Promise.all(promises);
    return results.flat();
  }

  private async searchNearbyPlaces(lat: number, lng: number, type: string) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${this.googlePlacesApiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.results?.map((place: any) => ({
      name: place.name,
      distance: this.calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
      rating: place.rating,
      type: type,
      address: place.vicinity
    })) || [];
  }

  private async getDemographicsData(params: NeighborhoodParams) {
    try {
      // Use US Census Bureau API for real demographic data
      const censusData = await this.fetchCensusData(params);
      
      if (censusData) {
        return {
          population: censusData.population,
          medianAge: censusData.medianAge,
          medianIncome: censusData.medianIncome,
          homeOwnershipRate: censusData.homeOwnershipRate,
          averageHouseholdSize: censusData.averageHouseholdSize
        };
      }
      
      // Fallback to mock data if Census API fails
      return {
        population: 25000,
        medianAge: 35,
        medianIncome: 75000,
        homeOwnershipRate: 65,
        averageHouseholdSize: 2.4
      };
    } catch (error) {
      console.error('Error fetching demographics:', error);
      return {};
    }
  }

  private async fetchCensusData(params: NeighborhoodParams) {
    try {
      console.log('📊 Fetching Census data for:', params.address);
      
      // Get county and state FIPS codes from coordinates
      const fipsData = await this.getFIPSCodes(params.latitude, params.longitude);
      
      if (!fipsData) {
        console.log('Could not get FIPS codes, using mock data');
        return null;
      }

      // Fetch population data (using correct variable name)
      const populationUrl = `https://api.census.gov/data/2020/dec/pl?get=P1_001N&for=county:${fipsData.countyFips}&in=state:${fipsData.stateFips}`;
      const populationResponse = await fetch(populationUrl);
      const populationData = await populationResponse.json();

      // Fetch income data (ACS 5-year estimates)
      const incomeUrl = `https://api.census.gov/data/2022/acs/acs5?get=B19013_001E&for=county:${fipsData.countyFips}&in=state:${fipsData.stateFips}`;
      const incomeResponse = await fetch(incomeUrl);
      const incomeData = await incomeResponse.json();

      // Fetch age data
      const ageUrl = `https://api.census.gov/data/2022/acs/acs5?get=B01002_001E&for=county:${fipsData.countyFips}&in=state:${fipsData.stateFips}`;
      const ageResponse = await fetch(ageUrl);
      const ageData = await ageResponse.json();

      // Fetch household size data
      const householdUrl = `https://api.census.gov/data/2022/acs/acs5?get=B25010_001E&for=county:${fipsData.countyFips}&in=state:${fipsData.stateFips}`;
      const householdResponse = await fetch(householdUrl);
      const householdData = await householdResponse.json();

      // Fetch homeownership data
      const ownershipUrl = `https://api.census.gov/data/2022/acs/acs5?get=B25003_002E,B25003_001E&for=county:${fipsData.countyFips}&in=state:${fipsData.stateFips}`;
      const ownershipResponse = await fetch(ownershipUrl);
      const ownershipData = await ownershipResponse.json();

      // Parse the data (Census API returns array with headers in first row, data in second row)
      const population = parseInt(populationData[1]?.[0] || '0');
      const medianIncome = parseInt(incomeData[1]?.[0] || '0');
      const medianAge = parseFloat(ageData[1]?.[0] || '0');
      const averageHouseholdSize = parseFloat(householdData[1]?.[0] || '0');
      
      // Calculate homeownership rate
      const ownerOccupied = parseInt(ownershipData[1]?.[0] || '0');
      const totalOccupied = parseInt(ownershipData[1]?.[1] || '0');
      const homeOwnershipRate = totalOccupied > 0 ? Math.round((ownerOccupied / totalOccupied) * 100) : 0;

      return {
        population,
        medianAge,
        medianIncome,
        homeOwnershipRate,
        averageHouseholdSize
      };

    } catch (error) {
      console.error('Error fetching Census data:', error);
      return null;
    }
  }

  private async getFIPSCodes(latitude: number, longitude: number) {
    try {
      console.log('📍 Getting FIPS codes for coordinates:', latitude, longitude);
      
      // Use Census Geocoder API to get FIPS codes from coordinates
      const geocoderUrl = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${longitude}&y=${latitude}&benchmark=2020&vintage=2020&format=json`;
      
      const response = await fetch(geocoderUrl);
      
      if (!response.ok) {
        console.log('Census geocoder API failed, using mock data');
        return null;
      }
      
      const data = await response.json();
      
      if (data.result && data.result.geographies) {
        // Extract county and state FIPS from the geographies
        const counties = data.result.geographies['Counties'];
        const states = data.result.geographies['States'];
        
        if (counties && counties.length > 0 && states && states.length > 0) {
          const county = counties[0];
          const state = states[0];
          
          return {
            countyFips: county.COUNTY,
            stateFips: state.STATE
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting FIPS codes:', error);
      return null;
    }
  }

  private async getCrimeData(params: NeighborhoodParams) {
    try {
      // In a real implementation, you'd call a crime data API
      // For now, return mock data
      return {
        rating: 'Low',
        rate: 2.1,
        safetyScore: 85
      };
    } catch (error) {
      console.error('Error fetching crime data:', error);
      return { rating: 'Unknown', rate: 0, safetyScore: 0 };
    }
  }

  private async getMarketData(params: NeighborhoodParams) {
    try {
      // In a real implementation, you'd call a real estate market API
      // For now, return mock data
      return {
        averageHomePrice: 450000,
        pricePerSqFt: 250,
        daysOnMarket: 45,
        inventoryLevel: 'Low'
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {};
    }
  }

  private async getTransitData(params: NeighborhoodParams): Promise<TransitItem[]> {
    try {
      // Mock transit data - in real implementation, call transit API
      return [
        {
          name: 'Main Street Bus Stop',
          type: 'bus',
          distance: '0.2 miles',
          frequency: 'Every 15 minutes',
          route: 'Route 15'
        },
        {
          name: 'Central Station',
          type: 'train',
          distance: '0.8 miles',
          frequency: 'Every 30 minutes',
          route: 'Metro Line'
        }
      ];
    } catch (error) {
      console.error('Error fetching transit data:', error);
      return [];
    }
  }

  private generateNeighborhoodDescription(
    params: NeighborhoodParams, 
    walkScore: WalkScoreData, 
    demographics: any
  ): string {
    const neighborhoodName = this.extractNeighborhoodName(params.address);
    
    let description = `${neighborhoodName} is a vibrant neighborhood in ${params.city}, ${params.state}. `;
    
    if (walkScore.walkscore >= 70) {
      description += `This is a very walkable area with a Walk Score of ${walkScore.walkscore}. `;
    } else if (walkScore.walkscore >= 50) {
      description += `This area is somewhat walkable with a Walk Score of ${walkScore.walkscore}. `;
    } else {
      description += `This area is car-dependent with a Walk Score of ${walkScore.walkscore}. `;
    }
    
    if (demographics.medianIncome) {
      description += `The median household income is $${demographics.medianIncome.toLocaleString()}. `;
    }
    
    if (demographics.medianAge) {
      description += `The median age is ${demographics.medianAge} years. `;
    }
    
    return description;
  }

  private generateInsights(walkScore: WalkScoreData, demographics: any, crimeData: any) {
    const highlights: string[] = [];
    const drawbacks: string[] = [];
    const bestFor: string[] = [];
    
    // Walkability insights
    if (walkScore.walkscore >= 70) {
      highlights.push('Excellent walkability');
      bestFor.push('Pedestrians');
    } else {
      drawbacks.push('Limited walkability');
    }
    
    if (walkScore.transit && walkScore.transit.score >= 70) {
      highlights.push('Great public transit access');
      bestFor.push('Commuters');
    }
    
    // Demographics insights
    if (demographics.medianIncome && demographics.medianIncome > 60000) {
      highlights.push('Above-average household income');
    }
    
    if (demographics.medianAge && demographics.medianAge < 40) {
      highlights.push('Young, vibrant community');
      bestFor.push('Young professionals');
    }
    
    // Crime insights
    if (crimeData.safetyScore && crimeData.safetyScore >= 80) {
      highlights.push('Low crime rate');
      bestFor.push('Families');
    }
    
    return { highlights, drawbacks, bestFor };
  }

  private categorizeAmenities(amenities: any[]) {
    return {
      restaurants: amenities.filter(a => a.type === 'restaurant').slice(0, 5),
      shopping: amenities.filter(a => a.type === 'shopping_mall').slice(0, 5),
      parks: amenities.filter(a => a.type === 'park').slice(0, 3),
      schools: amenities.filter(a => a.type === 'school').slice(0, 3),
      healthcare: amenities.filter(a => a.type === 'hospital').slice(0, 3),
      entertainment: amenities.filter(a => a.type === 'movie_theater').slice(0, 3)
    };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 5280)} feet`;
    } else {
      return `${distance.toFixed(1)} miles`;
    }
  }

  private extractNeighborhoodName(address: string): string {
    // Extract neighborhood from address
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[0].trim();
    }
    return 'Neighborhood';
  }

  // Mock data methods
  private getMockWalkScoreData(): WalkScoreData {
    return {
      status: 1,
      walkscore: 75,
      description: "Very Walkable",
      updated: new Date().toISOString(),
      logo_url: "https://cdn.walk.sc/images/api-logo.png",
      more_info_icon: "https://cdn.walk.sc/images/api-more-info.gif",
      more_info_link: "https://www.walkscore.com/how-it-works/",
      ws_link: "https://www.walkscore.com/",
      help_link: "https://www.walkscore.com/help.shtml",
      snapped_lat: 34.0392,
      snapped_lon: -118.6793,
      transit: {
        score: 65,
        description: "Good Transit",
        summary: "Many transit options"
      },
      bike: {
        score: 78,
        description: "Very Bikeable"
      }
    };
  }

  private getMockAmenities() {
    return {
      restaurants: [
        { name: "Local Bistro", distance: "0.3 miles", rating: 4.5, type: "restaurant" },
        { name: "Pizza Place", distance: "0.5 miles", rating: 4.2, type: "restaurant" },
        { name: "Coffee Shop", distance: "0.2 miles", rating: 4.7, type: "restaurant" }
      ],
      shopping: [
        { name: "Shopping Center", distance: "0.8 miles", rating: 4.0, type: "shopping_mall" },
        { name: "Grocery Store", distance: "0.4 miles", rating: 4.3, type: "shopping_mall" }
      ],
      parks: [
        { name: "Community Park", distance: "0.6 miles", rating: 4.6, type: "park" },
        { name: "Dog Park", distance: "0.9 miles", rating: 4.4, type: "park" }
      ],
      schools: [
        { name: "Elementary School", distance: "0.7 miles", rating: 4.5, type: "school" },
        { name: "High School", distance: "1.2 miles", rating: 4.3, type: "school" }
      ],
      healthcare: [
        { name: "Medical Center", distance: "1.0 miles", rating: 4.4, type: "hospital" },
        { name: "Urgent Care", distance: "0.8 miles", rating: 4.2, type: "hospital" }
      ],
      entertainment: [
        { name: "Movie Theater", distance: "1.5 miles", rating: 4.1, type: "movie_theater" },
        { name: "Bowling Alley", distance: "2.0 miles", rating: 4.0, type: "movie_theater" }
      ]
    };
  }

  private getMockNeighborhoodData(params: NeighborhoodParams): NeighborhoodData {
    return {
      name: this.extractNeighborhoodName(params.address),
      description: "A vibrant neighborhood with excellent amenities and walkability.",
      city: params.city,
      state: params.state,
      
      walkScore: 75,
      transitScore: 65,
      bikeScore: 78,
      walkScoreDescription: "Very Walkable",
      
      demographics: {
        population: 25000,
        medianAge: 35,
        medianIncome: 75000,
        homeOwnershipRate: 65,
        averageHouseholdSize: 2.4
      },
      
      crimeRating: "Low",
      crimeRate: 2.1,
      safetyScore: 85,
      
      nearbyAmenities: this.getMockAmenities(),
      
      publicTransit: [
        {
          name: 'Main Street Bus Stop',
          type: 'bus',
          distance: '0.2 miles',
          frequency: 'Every 15 minutes',
          route: 'Route 15'
        }
      ],
      
      marketData: {
        averageHomePrice: 450000,
        pricePerSqFt: 250,
        daysOnMarket: 45,
        inventoryLevel: 'Low'
      },
      
      highlights: ['Excellent walkability', 'Great public transit access', 'Low crime rate'],
      drawbacks: ['Limited parking'],
      bestFor: ['Young professionals', 'Families', 'Pedestrians'],
      
      lastUpdated: new Date().toISOString(),
      dataSources: ['WalkScore', 'Mock Data']
    };
  }
}

export const neighborhoodService = new NeighborhoodService(); 