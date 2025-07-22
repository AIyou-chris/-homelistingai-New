export interface PropertyDetails {
  // Basic Information
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt?: number;
  
  // Location
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    neighborhood?: string;
  };
  
  // Features
  interiorFeatures: string[];
  exteriorFeatures: string[];
  amenities: string[];
  
  // Additional Details
  parkingSpaces?: number;
  lotSize?: string;
  architecturalStyle?: string;
  condition?: string;
  
  // Nearby Points of Interest
  nearbyAttractions?: string[];
}

export interface DescriptionOptions {
  tone: 'professional' | 'luxury' | 'friendly' | 'modern';
  length: 'short' | 'medium' | 'long';
  emphasis: ('features' | 'location' | 'value' | 'lifestyle')[];
  includePricing: boolean;
  language?: string; // ISO language code (e.g., 'en', 'es', 'fr')
  seoKeywords?: string[]; // Target keywords for SEO
}

export interface GeneratedDescription {
  description: string;
  metadata: {
    wordCount: number;
    tone: string;
    emphasis: string[];
    generatedAt: Date;
    language: string;
    seoScore?: number; // 0-100 score
    seoMetadata?: SEOMetadata;
  };
  translations?: Record<string, string>; // Key is language code
}

export interface SEOMetadata {
  title: string;
  metaDescription: string;
  keywords: string[];
  headings: {
    h1?: string;
    h2?: string[];
  };
  readabilityScore: number; // 0-100
  keywordDensity: {
    [keyword: string]: number;
  };
  suggestedImprovements: string[];
} 