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
  features?: Record<string, any>;
  mobile_config?: {
    activeButtons: Record<string, boolean>;
    lastUpdated: string;
  };
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


