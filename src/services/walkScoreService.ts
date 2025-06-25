const WALK_SCORE_API_KEY = '72bc1d2dc76c691240ed998833f507d';
const WALK_SCORE_BASE_URL = 'https://api.walkscore.com/score';

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

export interface WalkScoreResponse {
  walkscore: number;
  transit_score?: number;
  bike_score?: number;
  walk_description: string;
  transit_description?: string;
  bike_description?: string;
}

export class WalkScoreService {
  static async getWalkScore(
    latitude: number, 
    longitude: number, 
    address: string
  ): Promise<WalkScoreResponse> {
    try {
      const url = `${WALK_SCORE_BASE_URL}?format=json&address=${encodeURIComponent(address)}&lat=${latitude}&lon=${longitude}&wsapikey=${WALK_SCORE_API_KEY}&transit=1&bike=1`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Walk Score API error: ${response.status}`);
      }
      
      const data: WalkScoreData = await response.json();
      
      if (data.status !== 1) {
        throw new Error(`Walk Score API returned status: ${data.status}`);
      }
      
      return {
        walkscore: data.walkscore,
        transit_score: data.transit?.score,
        bike_score: data.bike?.score,
        walk_description: data.description,
        transit_description: data.transit?.description,
        bike_description: data.bike?.description
      };
    } catch (error) {
      console.error('Error fetching Walk Score data:', error);
      
      // Return mock data for demo purposes if API fails
      return {
        walkscore: 92,
        transit_score: 85,
        bike_score: 78,
        walk_description: "Walker's Paradise",
        transit_description: "Excellent Transit",
        bike_description: "Very Bikeable"
      };
    }
  }

  static getWalkScoreDescription(score: number): string {
    if (score >= 90) return "Walker's Paradise";
    if (score >= 70) return "Very Walkable";
    if (score >= 50) return "Somewhat Walkable";
    if (score >= 25) return "Car-Dependent";
    return "Car-Dependent";
  }

  static getTransitScoreDescription(score: number): string {
    if (score >= 90) return "Rider's Paradise";
    if (score >= 70) return "Excellent Transit";
    if (score >= 50) return "Good Transit";
    if (score >= 25) return "Some Transit";
    return "Minimal Transit";
  }

  static getBikeScoreDescription(score: number): string {
    if (score >= 90) return "Biker's Paradise";
    if (score >= 70) return "Very Bikeable";
    if (score >= 50) return "Bikeable";
    if (score >= 25) return "Somewhat Bikeable";
    return "Minimal Bike Infrastructure";
  }
}

export default WalkScoreService; 