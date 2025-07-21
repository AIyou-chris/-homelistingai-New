import { WALKSCORE_API_KEY } from '../constants';

export interface WalkScoreData {
  status: number;
  walkscore: number;
  description: string;
  updated: string;
  logo_url: string;
  more_info_icon: string;
  more_info_link: string;
  ws_link: string;
  help_link: string;
  snapped_lat: number;
  snapped_lon: number;
  transit?: {
    score: number;
    description: string;
    summary: string;
  };
  bike?: {
    score: number;
    description: string;
  };
}

export interface WalkScoreParams {
  address: string;
  latitude: number;
  longitude: number;
  transit?: boolean;
  bike?: boolean;
}

class WalkScoreService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = WALKSCORE_API_KEY;
    this.baseUrl = 'https://api.walkscore.com/score';
  }

  async getWalkScore(params: WalkScoreParams): Promise<WalkScoreData> {
    const { address, latitude, longitude, transit = true, bike = true } = params;

    const url = new URL(this.baseUrl);
    url.searchParams.append('format', 'json');
    url.searchParams.append('address', address);
    url.searchParams.append('lat', latitude.toString());
    url.searchParams.append('lon', longitude.toString());
    url.searchParams.append('wsapikey', this.apiKey);
    
    if (transit) {
      url.searchParams.append('transit', '1');
    }
    
    if (bike) {
      url.searchParams.append('bike', '1');
    }

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`WalkScore API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 1) {
        throw new Error('WalkScore API returned error status');
      }

      return data;
    } catch (error) {
      console.error('Error fetching Walk Score:', error);
      // Return mock data for demo purposes
      return this.getMockWalkScoreData();
    }
  }

  private getMockWalkScoreData(): WalkScoreData {
    return {
      status: 1,
      walkscore: 85,
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

  getWalkScoreDescription(score: number): string {
    if (score >= 90) return "Walker's Paradise";
    if (score >= 70) return "Very Walkable";
    if (score >= 50) return "Somewhat Walkable";
    if (score >= 25) return "Car-Dependent";
    return "Car-Dependent";
  }

  getWalkScoreColor(score: number): string {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    if (score >= 25) return "text-orange-500";
    return "text-red-500";
  }

  getTransitScoreDescription(score: number): string {
    if (score >= 90) return "Excellent Transit";
    if (score >= 70) return "Very Good Transit";
    if (score >= 50) return "Good Transit";
    if (score >= 25) return "Some Transit";
    return "Minimal Transit";
  }

  getBikeScoreDescription(score: number): string {
    if (score >= 90) return "Biker's Paradise";
    if (score >= 70) return "Very Bikeable";
    if (score >= 50) return "Bikeable";
    if (score >= 25) return "Somewhat Bikeable";
    return "Not Bikeable";
  }
}

export const walkScoreService = new WalkScoreService(); 