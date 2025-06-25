// Simple geocoding service using Mapbox (you can replace with Google Maps or other services)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWljaHJpcyIsImEiOiJjbWNiYjMwbncwYzhrMmpwcThveDZtMnIxIn0.Fg8UQz1mniB1krrBbPrLhg';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class GeocodingService {
  static async getCoordinates(address: string): Promise<Coordinates | null> {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Predefined coordinates for demo properties
  static getDemoCoordinates(address: string): Coordinates | null {
    const demoCoordinates: Record<string, Coordinates> = {
      '2847 Sunset Boulevard, Los Angeles, CA 90026': { latitude: 34.0928, longitude: -118.2787 },
      '123 Ocean Drive, Malibu, CA 90265': { latitude: 34.0259, longitude: -118.7798 },
      '123 Main Street, Los Angeles, CA': { latitude: 34.0522, longitude: -118.2437 },
      '456 Oak Avenue, Beverly Hills, CA': { latitude: 34.0736, longitude: -118.4004 },
      '789 Sunset Boulevard, West Hollywood, CA': { latitude: 34.0928, longitude: -118.3277 },
      '321 Maple Drive, Santa Monica, CA': { latitude: 34.0195, longitude: -118.4912 },
      '654 Pine Street, Culver City, CA': { latitude: 34.0211, longitude: -118.3965 }
    };

    return demoCoordinates[address] || null;
  }
}

export default GeocodingService; 