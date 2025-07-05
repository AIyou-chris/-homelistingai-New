import { EnhancedListing, AgentTemplate, DataField, DataSource } from './types';

export const APP_NAME = "HomeListingAI";

// WalkScore API Configuration
export const WALKSCORE_API_KEY = '72bc1d2dc76c691240ed998833f507d5';
export const GEMINI_CHAT_MODEL = "gemini-2.5-flash-preview-04-17";
export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002"; // Not used in this initial setup, but good to have

// Mocked n8n webhook URLs - replace with actual n8n webhook URLs
export const N8N_LISTING_ENRICHMENT_URL = "/.netlify/functions/n8n-listing-enrichment"; // Example for Netlify function proxy
export const N8N_LEAD_CAPTURE_URL = "/.netlify/functions/n8n-lead-capture";
export const N8N_QR_CODE_GENERATOR_URL = "/.netlify/functions/n8n-qr-code";
export const N8N_REALTIME_NOTIFICATION_URL = "/.netlify/functions/n8n-notification";
export const N8N_SUBSCRIPTION_CHECK_URL = "/.netlify/functions/n8n-subscription-check";

export const PAYPAL_SUBSCRIPTION_URL = "https://www.paypal.com/billing/subscriptions"; // Example, replace with actual

// Helper function to create data fields
function createDataField<T>(
  value: T, 
  dataSource: DataSource, 
  confidence: number, 
  needsReview: boolean = false,
  fallbackUsed: boolean = false
): DataField<T> {
  return {
    value,
    dataSource,
    confidence,
    lastUpdated: new Date(),
    needsReview,
    fallbackUsed
  };
}

// Enhanced demo property with data source tracking
export const ENHANCED_DEMO_PROPERTY: EnhancedListing = {
  id: "demo-enhanced-123",
  agent_id: "agent-sarah-123",
  
  // High confidence scraped data
  title: createDataField("Luxury Malibu Oceanfront Villa", "scraped", 95),
  price: createDataField(8950000, "scraped", 98),
  bedrooms: createDataField(4, "scraped", 100),
  bathrooms: createDataField(5, "scraped", 100),
  square_footage: createDataField(5200, "scraped", 90),
  address: createDataField("1247 Pacific Coast Highway, Malibu, CA 90265", "scraped", 85),
  
  // AI-generated enhanced description
  description: createDataField(
    "A breathtaking contemporary masterpiece perched on the bluffs of Malibu, this extraordinary 4-bedroom, 5-bathroom villa offers unparalleled luxury living with breathtaking ocean views. Every detail has been meticulously crafted to create an oasis of sophistication and tranquility.",
    "ai_generated",
    75,
    true // Needs review for personalization
  ),
  
  // Mixed data sources
  property_type: createDataField("Single Family", "scraped", 100),
  status: createDataField("Active", "agent_input", 100),
  
  // API-sourced data
  lot_size: createDataField(0.8, "api", 85),
  year_built: createDataField(2023, "api", 90),
  walkScore: createDataField(85, "api", 80),
  transitScore: createDataField(65, "api", 80),
  bikeScore: createDataField(78, "api", 80),
  
  // Manual/Agent input with high confidence
  architecture: createDataField("Contemporary", "agent_input", 100),
  property_taxes: createDataField(89500, "api", 70, true), // Needs review
  hoa_fees: createDataField(2500, "manual", 60, true), // Needs review - estimated
  insurance_estimate: createDataField(12000, "ai_generated", 50, true, true), // Fallback used
  
  // AI-analyzed features from photos
  premium_features: createDataField([
    "Infinity pool with ocean views",
    "Smart home automation", 
    "Wine cellar (200+ bottles)",
    "Home theater with Dolby Atmos",
    "Chef's kitchen with premium appliances",
    "Private beach access",
    "3-car garage with EV charging"
  ], "ai_generated", 70, true),
  
  // High-confidence scraped images
  image_urls: createDataField([
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
  ], "scraped", 95),
  
  // API-sourced amenities
  nearby_amenities: createDataField([
    { name: "Nobu Malibu", distance: "0.3 miles", type: "restaurant" },
    { name: "Malibu Country Mart", distance: "0.5 miles", type: "shopping" },
    { name: "Zuma Beach", distance: "0.2 miles", type: "beach" },
    { name: "Starbucks Reserve", distance: "0.4 miles", type: "coffee" }
  ], "api", 85),
  
  // System fields
  auto_build_status: "needs_review",
  confidence_score: 78, // Overall confidence
  last_auto_update: new Date(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Enhanced agent template
export const DEMO_AGENT_TEMPLATE: AgentTemplate = {
  id: "agent-sarah-123",
  name: createDataField("Sarah Johnson", "agent_input", 100),
  title: createDataField("Luxury Real Estate Specialist", "agent_input", 100),
  bio: createDataField(
    "Specializing in luxury Malibu properties with over 15 years of experience. I provide white-glove service and deep market expertise to ensure the best outcome for my clients.",
    "agent_input",
    100
  ),
  stats: {
    totalSales: createDataField("$2.8B", "manual", 90),
    propertiesSold: createDataField("340+", "manual", 90),
    yearsExperience: createDataField(15, "agent_input", 100),
    avgRating: createDataField(4.9, "api", 85),
    reviewCount: createDataField(127, "api", 85)
  },
  email: createDataField("sarah.johnson@homelistingai.com", "agent_input", 100),
  phone: createDataField("(310) 555-0123", "agent_input", 100),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Confidence level helpers
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return "text-green-600";
  if (confidence >= 70) return "text-yellow-600";
  return "text-red-600";
};

export const getConfidenceBadge = (confidence: number): string => {
  if (confidence >= 90) return "High";
  if (confidence >= 70) return "Medium";
  return "Low";
};

export const getDataSourceIcon = (source: DataSource): string => {
  switch (source) {
    case 'scraped': return "🕷️";
    case 'agent_input': return "👤";
    case 'api': return "🔗";
    case 'ai_generated': return "🤖";
    case 'manual': return "✏️";
    default: return "❓";
  }
};

export const getDataSourceLabel = (source: DataSource): string => {
  switch (source) {
    case 'scraped': return "Auto-Scraped";
    case 'agent_input': return "Agent Input";
    case 'api': return "External API";
    case 'ai_generated': return "AI Generated";
    case 'manual': return "Manual Entry";
    default: return "Unknown";
  }
};

// Fallback content system
export const FALLBACK_CONTENT = {
  description: "Contact our agent for detailed property information and to schedule a private showing.",
  premium_features: ["Contact agent for complete feature list"],
  financial_info: "Financial details available upon request",
  agent_stats: "Experienced local specialist with proven track record"
};

// Legacy demo property for backward compatibility
export const DEMO_PROPERTY = {
  id: "demo-123",
  title: ENHANCED_DEMO_PROPERTY.title.value,
  price: ENHANCED_DEMO_PROPERTY.price.value,
  address: ENHANCED_DEMO_PROPERTY.address.value,
  bedrooms: ENHANCED_DEMO_PROPERTY.bedrooms.value,
  bathrooms: ENHANCED_DEMO_PROPERTY.bathrooms.value,
  square_footage: ENHANCED_DEMO_PROPERTY.square_footage.value,
  description: ENHANCED_DEMO_PROPERTY.description.value,
  image_urls: ENHANCED_DEMO_PROPERTY.image_urls.value,
  property_type: "Single Family",
  status: "Active"
};
