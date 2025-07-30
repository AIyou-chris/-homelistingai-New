import { supabase } from '../lib/supabase';

export interface PropertyData {
  // Basic property info (from scraper or manual input)
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  
  // Generated from APIs or fallbacks
  schools?: SchoolInfo[];
  neighborhood?: NeighborhoodInfo;
  comparables?: ComparableProperty[];
  amenities?: string[];
  description?: string;
  photos?: string[];
}

export interface SchoolInfo {
  name: string;
  type: 'elementary' | 'middle' | 'high';
  rating: number;
  distance: number;
  address: string;
}

export interface NeighborhoodInfo {
  name: string;
  walkScore: number;
  transitScore: number;
  crimeRate: 'low' | 'medium' | 'high';
  amenities: string[];
  description: string;
}

export interface ComparableProperty {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  soldDate: string;
  distance: number;
}

class PropertyDataService {
  // Generate school information from address
  async getSchoolInfo(address: string): Promise<SchoolInfo[]> {
    try {
      // Try to get from external API (you can integrate with real school APIs)
      // For now, return mock data based on address
      const mockSchools: SchoolInfo[] = [
        {
          name: 'Local Elementary School',
          type: 'elementary',
          rating: 8,
          distance: 0.5,
          address: '123 School St, City, State'
        },
        {
          name: 'Local Middle School',
          type: 'middle',
          rating: 7,
          distance: 1.2,
          address: '456 Middle Ave, City, State'
        },
        {
          name: 'Local High School',
          type: 'high',
          rating: 8,
          distance: 2.1,
          address: '789 High Blvd, City, State'
        }
      ];
      
      return mockSchools;
    } catch (error) {
      console.error('Error fetching school info:', error);
      return [];
    }
  }

  // Generate neighborhood information
  async getNeighborhoodInfo(address: string): Promise<NeighborhoodInfo> {
    try {
      // Mock neighborhood data - in real app, use APIs like Walk Score, etc.
      const mockNeighborhood: NeighborhoodInfo = {
        name: 'Desirable Neighborhood',
        walkScore: 75,
        transitScore: 65,
        crimeRate: 'low',
        amenities: [
          'Coffee shops',
          'Restaurants',
          'Parks',
          'Shopping centers',
          'Public transportation'
        ],
        description: 'A family-friendly neighborhood with excellent amenities and low crime rates. Perfect for families and professionals alike.'
      };
      
      return mockNeighborhood;
    } catch (error) {
      console.error('Error fetching neighborhood info:', error);
      return {
        name: 'Neighborhood',
        walkScore: 50,
        transitScore: 50,
        crimeRate: 'medium',
        amenities: [],
        description: 'Neighborhood information available upon request.'
      };
    }
  }

  // Generate comparable properties
  async getComparableProperties(address: string, price: number): Promise<ComparableProperty[]> {
    try {
      // Mock comparable data - in real app, use MLS APIs
      const mockComparables: ComparableProperty[] = [
        {
          address: '123 Similar St',
          price: price * 0.95,
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1500,
          soldDate: '2024-01-15',
          distance: 0.3
        },
        {
          address: '456 Comparable Ave',
          price: price * 1.05,
          bedrooms: 3,
          bathrooms: 2.5,
          squareFootage: 1600,
          soldDate: '2024-02-01',
          distance: 0.8
        },
        {
          address: '789 Market St',
          price: price * 0.98,
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1550,
          soldDate: '2024-01-30',
          distance: 1.2
        }
      ];
      
      return mockComparables;
    } catch (error) {
      console.error('Error fetching comparable properties:', error);
      return [];
    }
  }

  // Generate amenities based on property type and price
  generateAmenities(bedrooms: number, bathrooms: number, squareFootage: number, price: number): string[] {
    const amenities: string[] = [];
    
    // Basic amenities
    amenities.push('Central heating');
    amenities.push('Air conditioning');
    
    // Based on bedrooms/bathrooms
    if (bathrooms >= 2) {
      amenities.push('Multiple bathrooms');
    }
    if (bedrooms >= 3) {
      amenities.push('Spacious bedrooms');
    }
    
    // Based on square footage
    if (squareFootage > 2000) {
      amenities.push('Large living space');
      amenities.push('Family room');
    }
    
    // Based on price point
    if (price > 500000) {
      amenities.push('Updated kitchen');
      amenities.push('Hardwood floors');
      amenities.push('Modern appliances');
    }
    
    // Common amenities
    amenities.push('Laundry room');
    amenities.push('Storage space');
    
    return amenities;
  }

  // Generate property description
  generateDescription(address: string, bedrooms: number, bathrooms: number, squareFootage: number, price: number): string {
    const priceRange = price < 300000 ? 'affordable' : price < 600000 ? 'mid-range' : 'luxury';
    const sizeDescription = squareFootage < 1500 ? 'cozy' : squareFootage < 2500 ? 'spacious' : 'large';
    
    return `This ${sizeDescription} ${bedrooms}-bedroom, ${bathrooms}-bathroom home offers ${priceRange} living in a desirable location. 
    With ${squareFootage} square feet of living space, this property provides the perfect balance of comfort and functionality. 
    Located at ${address}, this home is ideal for families, professionals, or investors looking for quality real estate in a great neighborhood. 
    Don't miss the opportunity to make this beautiful property your new home!`;
  }

  // Generate mock photos based on property type
  generateMockPhotos(bedrooms: number, bathrooms: number, price: number): string[] {
    const basePhotos = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ];
    
    const additionalPhotos = [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
    ];
    
    return [...basePhotos, ...additionalPhotos];
  }

  // Main method to generate complete property data from basic info
  async generatePropertyData(basicInfo: {
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
  }): Promise<PropertyData> {
    const { address, price, bedrooms, bathrooms, squareFootage } = basicInfo;
    
    // Generate all additional data
    const [schools, neighborhood, comparables] = await Promise.all([
      this.getSchoolInfo(address),
      this.getNeighborhoodInfo(address),
      this.getComparableProperties(address, price)
    ]);
    
    const amenities = this.generateAmenities(bedrooms, bathrooms, squareFootage, price);
    const description = this.generateDescription(address, bedrooms, bathrooms, squareFootage, price);
    const photos = this.generateMockPhotos(bedrooms, bathrooms, price);
    
    return {
      ...basicInfo,
      schools,
      neighborhood,
      comparables,
      amenities,
      description,
      photos
    };
  }

  // Save generated data to database
  async savePropertyData(propertyData: PropertyData, listingId: string) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update({
          amenities: propertyData.amenities,
          description: propertyData.description,
          photos: propertyData.photos,
          schools_data: propertyData.schools,
          neighborhood_data: propertyData.neighborhood,
          comparables_data: propertyData.comparables
        })
        .eq('id', listingId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving property data:', error);
      throw error;
    }
  }
}

export const propertyDataService = new PropertyDataService();
export default propertyDataService; 