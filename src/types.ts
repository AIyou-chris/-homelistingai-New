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
  userId: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  companyName?: string;
  website?: string;
  email_config?: AgentEmailConfig;
  createdAt: string;
  updatedAt: string;
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
  agentId: string;
  title: string;
  description: string;
  address: string;
  price: number;
  propertyType: PropertyType | string;
  status: ListingStatus | string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  imageUrls: string[];
  knowledgeBase?: Record<string, any> | string;
  qrCodeUrl?: string;
  createdAt: string;
}

export interface ListingPhoto {
  id: string;
  listingId: string;
  url: string;
  order: number;
  createdAt: string;
}

// ========== LEADS & APPOINTMENTS ==========

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  listingId: string;
  agentId:string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'qr_code' | 'manual';
  createdAt: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  agentId: string;
  listingId: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  notes?: string;
  createdAt: string;
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


