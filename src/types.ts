import { User as SupabaseUser } from '@supabase/supabase-js';

// ========== USER & AUTH ==========

export interface User extends SupabaseUser {
  name?: string;
  subscription_status?: SubscriptionStatus;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIALING = 'trialing',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
}

// ========== AGENT ==========

export interface AgentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  company_name?: string;
  website?: string;
  email_config?: AgentEmailConfig;
  created_at: string;
  updated_at: string;
}

export interface AgentEmailConfig {
  type: 'user' | 'auto_generated' | 'custom_domain';
  domain?: string;
  prefix?: string;
  isVerified?: boolean; 
}

// ========== LISTING ==========

export enum PropertyType {
  SINGLE_FAMILY = "Single-Family Home",
  CONDO = "Condo",
  TOWNHOUSE = "Townhouse",
  MULTI_FAMILY = "Multi-Family",
  LAND = "Land",
  COMMERCIAL = "Commercial"
}

export enum ListingStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  SOLD = "Sold",
  DRAFT = "Draft",
  COMING_SOON = "Coming Soon"
}

export interface Listing {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  property_type: PropertyType | string;
  status: ListingStatus | string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  lot_size?: number;
  year_built?: number;
  image_urls: string[];
  knowledge_base?: Record<string, any> | string;
  qr_code_url?: string;
  created_at: string;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  url: string;
  order: number;
  created_at: string;
}

// ========== LEADS & APPOINTMENTS ==========

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  listing_id: string;
  agent_id:string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'qr_code' | 'manual' | 'chat' | 'form' | 'qr_scan';
  created_at: string;
}

export interface Appointment {
  id: string;
  lead_id: string;
  agent_id: string;
  listing_id: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  notes?: string;
  created_at: string;
}

// ========== AI & API (Gemini) ==========

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}
export interface GenerateContentResponsePart {
  text?: string;
}
export interface GeminiGenerateContentResponse {
  text: string;
  candidates?: Candidate[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string; // ISO date string
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string; // ISO date string
  read: boolean;
}

// User Profile and Preferences Types
export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
  occupation?: string;
  company?: string;
  website?: string;
  social_links?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  location_preferences?: {
    cities?: string[];
    neighborhoods?: string[];
    zip_codes?: string[];
  };
  budget_preferences?: {
    min_price?: number;
    max_price?: number;
  };
  property_preferences?: {
    property_types?: string[];
    bedrooms?: { min: number; max: number };
    bathrooms?: { min: number; max: number };
  };
  is_first_time_buyer: boolean;
  is_investor: boolean;
  has_agent: boolean;
  agent_id?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  
  // Property preferences
  preferred_property_types: string[];
  min_bedrooms: number;
  max_bedrooms: number;
  min_bathrooms: number;
  max_bathrooms: number;
  min_square_feet: number;
  max_square_feet: number;
  min_price: number;
  max_price: number;
  
  // Location preferences
  preferred_cities: string[];
  preferred_neighborhoods: string[];
  preferred_zip_codes: string[];
  max_commute_time: number;
  preferred_school_districts: string[];
  
  // Feature preferences
  must_have_features: string[];
  nice_to_have_features: string[];
  deal_breakers: string[];
  
  // Lifestyle preferences
  lifestyle_preferences: {
    family_friendly?: boolean;
    walkable?: boolean;
    pet_friendly?: boolean;
    quiet_neighborhood?: boolean;
    near_public_transit?: boolean;
    near_parks?: boolean;
    near_schools?: boolean;
    near_shopping?: boolean;
  };
  accessibility_needs: string[];
  pet_friendly: boolean;
  
  // Notification preferences
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'immediate' | 'daily' | 'weekly';
  notification_types: string[];
  
  // Privacy preferences
  profile_visibility: 'public' | 'private' | 'agents_only';
  show_contact_info: boolean;
  allow_agent_contact: boolean;
  
  // AI and personalization preferences
  ai_recommendations_enabled: boolean;
  ai_chat_enabled: boolean;
  data_collection_consent: boolean;
  personalized_content: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  listing_id: string;
  notes?: string;
  created_at: string;
  listing?: Listing; // Joined with listing data
}

export interface UserSearchAlert {
  id: string;
  user_id: string;
  name: string;
  search_criteria: {
    property_types?: string[];
    bedrooms?: { min: number; max: number };
    bathrooms?: { min: number; max: number };
    price_range?: { min: number; max: number };
    square_feet?: { min: number; max: number };
    cities?: string[];
    neighborhoods?: string[];
    zip_codes?: string[];
    features?: string[];
  };
  is_active: boolean;
  notification_frequency: 'immediate' | 'daily' | 'weekly';
  last_notification_sent?: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  activity_type: 'view_listing' | 'save_listing' | 'contact_agent' | 'search_properties' | 'view_profile' | 'update_preferences' | 'chat_message';
  activity_data: {
    listing_id?: string;
    search_query?: string;
    agent_id?: string;
    message_length?: number;
    session_duration?: number;
    [key: string]: any;
  };
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserChatHistory {
  id: string;
  user_id: string;
  session_id: string;
  message_type: 'user' | 'ai' | 'system';
  message_content: string;
  message_metadata: {
    intent?: string;
    confidence?: number;
    entities?: any[];
    response_time?: number;
    [key: string]: any;
  };
  created_at: string;
}

// Onboarding Types
export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
}

export interface OnboardingData {
  user_type: 'buyer' | 'seller' | 'investor' | 'browser';
  property_types: string[];
  budget_range: { min: number; max: number };
  preferred_locations: string[];
  timeline: 'immediate' | '3_months' | '6_months' | '1_year' | 'no_rush';
  has_agent: boolean;
  contact_preferences: {
    email: boolean;
    phone: boolean;
    sms: boolean;
  };
}

// AI Recommendation Types
export interface AIRecommendation {
  listing_id: string;
  score: number;
  reasons: string[];
  match_percentage: number;
  listing: Listing;
}

export interface AIRecommendationRequest {
  user_id: string;
  current_listing_id?: string;
  limit?: number;
  include_similar?: boolean;
  include_trending?: boolean;
}


