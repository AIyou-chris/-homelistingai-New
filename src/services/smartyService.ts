// Smarty API Service for comprehensive property data
// API Key: 241266923499736869

export interface SmartyPropertyData {
  // Basic Property Info
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  
  // Geocoding
  latitude: number;
  longitude: number;
  geocodingAccuracy: string;
  
  // Property Details
  propertyType?: string;
  squareFootage?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  lotSize?: number;
  
  // School Information
  schoolDistrict?: string;
  elementarySchool?: string;
  middleSchool?: string;
  highSchool?: string;
  schoolRatings?: {
    elementary?: number;
    middle?: number;
    high?: number;
  };
  
  // Market Data
  estimatedValue?: number;
  lastSoldDate?: string;
  lastSoldPrice?: number;
  pricePerSqFt?: number;
  
  // Owner/Agent Info
  ownerName?: string;
  ownerPhone?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  
  // Neighborhood Data
  crimeRate?: number;
  walkScore?: number;
  transitScore?: number;
  
  // Additional Data
  propertyTax?: number;
  homeownersInsurance?: number;
  hoaFees?: number;
}

export interface SmartyGeocodeResult {
  latitude: number;
  longitude: number;
  accuracy: string;
  address: string;
}

export interface SmartySchoolData {
  district: string;
  schools: {
    name: string;
    type: 'elementary' | 'middle' | 'high';
    distance: string;
    rating?: number;
    address: string;
  }[];
}

class SmartyService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = '241266923499736869'; // Your Smarty API key
    this.baseUrl = 'https://us-street.api.smartystreets.com';
  }

  // Get comprehensive property data
  async getPropertyData(address: string): Promise<SmartyPropertyData> {
    try {
      console.log('🏠 Fetching Smarty property data for:', address);
      
      // First, geocode the address
      const geocodeResult = await this.geocodeAddress(address);
      
      if (!geocodeResult) {
        throw new Error('Could not geocode address');
      }

      // Get property data using the coordinates
      const propertyData = await this.getPropertyDetails(geocodeResult);
      
      // Get school data
      const schoolData = await this.getSchoolData(geocodeResult);
      
      // Get market data
      const marketData = await this.getMarketData(geocodeResult);
      
      return {
        address: geocodeResult.address,
        city: propertyData.city || '',
        state: propertyData.state || '',
        zipCode: propertyData.zipCode || '',
        county: propertyData.county || '',
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude,
        geocodingAccuracy: geocodeResult.accuracy,
        propertyType: propertyData.propertyType,
        squareFootage: propertyData.squareFootage,
        yearBuilt: propertyData.yearBuilt,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        lotSize: propertyData.lotSize,
        schoolDistrict: schoolData.district,
        elementarySchool: schoolData.schools.find(s => s.type === 'elementary')?.name,
        middleSchool: schoolData.schools.find(s => s.type === 'middle')?.name,
        highSchool: schoolData.schools.find(s => s.type === 'high')?.name,
        schoolRatings: {
          elementary: schoolData.schools.find(s => s.type === 'elementary')?.rating,
          middle: schoolData.schools.find(s => s.type === 'middle')?.rating,
          high: schoolData.schools.find(s => s.type === 'high')?.rating,
        },
        estimatedValue: marketData.estimatedValue,
        lastSoldDate: marketData.lastSoldDate,
        lastSoldPrice: marketData.lastSoldPrice,
        pricePerSqFt: marketData.pricePerSqFt,
        ownerName: propertyData.ownerName,
        ownerPhone: propertyData.ownerPhone,
        agentName: propertyData.agentName,
        agentPhone: propertyData.agentPhone,
        agentEmail: propertyData.agentEmail,
        crimeRate: propertyData.crimeRate,
        walkScore: propertyData.walkScore,
        transitScore: propertyData.transitScore,
        propertyTax: propertyData.propertyTax,
        homeownersInsurance: propertyData.homeownersInsurance,
        hoaFees: propertyData.hoaFees,
      };
      
    } catch (error) {
      console.error('Error fetching Smarty property data:', error);
      return this.getMockPropertyData(address);
    }
  }

  // Geocode an address to get coordinates
  async geocodeAddress(address: string): Promise<SmartyGeocodeResult | null> {
    try {
      const url = `${this.baseUrl}/street-address?auth-id=${this.apiKey}&street=${encodeURIComponent(address)}&candidates=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Check for authentication error
      if (data.errors && data.errors.length > 0) {
        console.log('Smarty API authentication error - using mock data');
        return null;
      }
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: result.metadata.latitude,
          longitude: result.metadata.longitude,
          accuracy: result.metadata.geocoding_accuracy,
          address: result.delivery_line_1 + ', ' + result.components.city_name + ', ' + result.components.state_abbreviation
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Get detailed property information
  private async getPropertyDetails(geocodeResult: SmartyGeocodeResult) {
    try {
      // Smarty Property Data API call would go here
      // For now, return mock data based on coordinates
      return {
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        county: 'Los Angeles',
        propertyType: 'Single Family',
        squareFootage: 2500,
        yearBuilt: 1995,
        bedrooms: 3,
        bathrooms: 2.5,
        lotSize: 8000,
        ownerName: 'John Smith',
        ownerPhone: '(555) 123-4567',
        agentName: 'Sarah Johnson',
        agentPhone: '(555) 987-6543',
        agentEmail: 'sarah.johnson@realty.com',
        crimeRate: 2.1,
        walkScore: 75,
        transitScore: 65,
        propertyTax: 4500,
        homeownersInsurance: 1200,
        hoaFees: 0,
      };
    } catch (error) {
      console.error('Error fetching property details:', error);
      return {};
    }
  }

  // Get school information
  private async getSchoolData(geocodeResult: SmartyGeocodeResult): Promise<SmartySchoolData> {
    try {
      // Smarty School Data API call would go here
      // For now, return mock school data
      return {
        district: 'Los Angeles Unified School District',
        schools: [
          {
            name: 'Elementary School A',
            type: 'elementary',
            distance: '0.5 miles',
            rating: 8,
            address: '123 School St, Los Angeles, CA'
          },
          {
            name: 'Middle School B',
            type: 'middle',
            distance: '1.2 miles',
            rating: 7,
            address: '456 Middle Ave, Los Angeles, CA'
          },
          {
            name: 'High School C',
            type: 'high',
            distance: '2.1 miles',
            rating: 9,
            address: '789 High Blvd, Los Angeles, CA'
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching school data:', error);
      return {
        district: 'Unknown District',
        schools: []
      };
    }
  }

  // Get market data
  private async getMarketData(geocodeResult: SmartyGeocodeResult) {
    try {
      // Smarty Market Data API call would go here
      // For now, return mock market data
      return {
        estimatedValue: 750000,
        lastSoldDate: '2022-03-15',
        lastSoldPrice: 650000,
        pricePerSqFt: 300,
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {};
    }
  }

  // Mock data fallback
  private getMockPropertyData(address: string): SmartyPropertyData {
    return {
      address,
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      county: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      geocodingAccuracy: 'Rooftop',
      propertyType: 'Single Family',
      squareFootage: 2500,
      yearBuilt: 1995,
      bedrooms: 3,
      bathrooms: 2.5,
      lotSize: 8000,
      schoolDistrict: 'Los Angeles Unified School District',
      elementarySchool: 'Elementary School A',
      middleSchool: 'Middle School B',
      highSchool: 'High School C',
      schoolRatings: {
        elementary: 8,
        middle: 7,
        high: 9,
      },
      estimatedValue: 750000,
      lastSoldDate: '2022-03-15',
      lastSoldPrice: 650000,
      pricePerSqFt: 300,
      ownerName: 'John Smith',
      ownerPhone: '(555) 123-4567',
      agentName: 'Sarah Johnson',
      agentPhone: '(555) 987-6543',
      agentEmail: 'sarah.johnson@realty.com',
      crimeRate: 2.1,
      walkScore: 75,
      transitScore: 65,
      propertyTax: 4500,
      homeownersInsurance: 1200,
      hoaFees: 0,
    };
  }

  // Get directions data
  async getDirectionsData(address: string) {
    try {
      const geocodeResult = await this.geocodeAddress(address);
      
      if (!geocodeResult) {
        return null;
      }

      return {
        address: geocodeResult.address,
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude,
        googleMapsUrl: `https://www.google.com/maps?q=${geocodeResult.latitude},${geocodeResult.longitude}`,
        appleMapsUrl: `http://maps.apple.com/?q=${geocodeResult.latitude},${geocodeResult.longitude}`,
        wazeUrl: `https://waze.com/ul?ll=${geocodeResult.latitude},${geocodeResult.longitude}&navigate=yes`,
      };
    } catch (error) {
      console.error('Error getting directions data:', error);
      return null;
    }
  }

  // Get share data
  async getShareData(address: string) {
    try {
      const propertyData = await this.getPropertyData(address);
      
      return {
        title: `Check out this property at ${propertyData.address}`,
        description: `${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath home in ${propertyData.city}, ${propertyData.state}`,
        url: window.location.href,
        price: propertyData.estimatedValue ? `$${propertyData.estimatedValue.toLocaleString()}` : 'Price on request',
        image: 'https://via.placeholder.com/400x300/777/fff?text=Property+Image',
      };
    } catch (error) {
      console.error('Error getting share data:', error);
      return {
        title: `Check out this property at ${address}`,
        description: 'Beautiful home for sale',
        url: window.location.href,
        price: 'Price on request',
        image: 'https://via.placeholder.com/400x300/777/fff?text=Property+Image',
      };
    }
  }
}

export const smartyService = new SmartyService(); 