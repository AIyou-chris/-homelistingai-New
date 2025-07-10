import { User as SupabaseUser } from '@supabase/supabase-js';

// ========== USER & AUTH ==========

export interface User extends SupabaseUser {
  name?: string;
  subscription_status?: SubscriptionStatus;
  role?: string; // 'admin' | 'agent' | etc.
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

// ========== AUTO-BUILDING & DATA SOURCE TRACKING ==========

export type DataSource = 'scraped' | 'agent_input' | 'api' | 'ai_generated' | 'manual';

export interface DataField<T = any> {
  value: T;
  dataSource: DataSource;
  confidence: number; // 0-100%
  lastUpdated: Date;
  needsReview: boolean;
  fallbackUsed?: boolean;
}

export interface AgentStats {
  totalSales: DataField<string>;
  propertiesSold: DataField<string>;
  yearsExperience: DataField<number>;
  avgRating: DataField<number>;
  reviewCount: DataField<number>;
}

export interface AgentTemplate {
  id: string;
  name: DataField<string>;
  title: DataField<string>;
  bio: DataField<string>;
  stats: AgentStats;
  avatar_url?: DataField<string>;
  phone?: DataField<string>;
  email: DataField<string>;
  created_at: string;
  updated_at: string;
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

// Enhanced Listing with Auto-Building Support
export interface EnhancedListing {
  id: string;
  agent_id: string;
  
  // Core listing data with tracking
  title: DataField<string>;
  description: DataField<string>;
  address: DataField<string>;
  price: DataField<number>;
  property_type: DataField<PropertyType | string>;
  status: DataField<ListingStatus | string>;
  bedrooms: DataField<number>;
  bathrooms: DataField<number>;
  square_footage: DataField<number>;
  
  // Optional enhanced data
  lot_size?: DataField<number>;
  year_built?: DataField<number>;
  architecture?: DataField<string>;
  property_taxes?: DataField<number>;
  hoa_fees?: DataField<number>;
  insurance_estimate?: DataField<number>;
  
  // Media and content
  image_urls: DataField<string[]>;
  premium_features?: DataField<string[]>;
  
  // Location data
  walkScore?: DataField<number>;
  transitScore?: DataField<number>;
  bikeScore?: DataField<number>;
  nearby_amenities?: DataField<Array<{name: string; distance: string; type: string}>>;
  
  // System fields
  auto_build_status: 'pending' | 'processing' | 'completed' | 'needs_review';
  confidence_score: number; // Overall listing confidence 0-100%
  last_auto_update: Date;
  knowledge_base?: Record<string, any> | string;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
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


