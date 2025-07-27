import { supabase } from '../lib/supabase';
import { Listing, ListingPhoto, ListingStatus, PropertyType } from '../types';
import { N8N_LISTING_ENRICHMENT_URL } from '../constants';

// Mock data and functions
const listings: Listing[] = [
  {
    id: '1',
    agent_id: 'realtor-123',
    title: 'Modern Downtown Condo',
    address: '123 Main St, Anytown, USA',
    price: 500000,
    bedrooms: 2,
    bathrooms: 2,
    square_footage: 1200,
    image_urls: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], // Placeholder image
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    description: 'A beautiful condo in the heart of the city.',
    property_type: 'Condo',
    status: 'Active',
  },
  {
    id: '2',
    agent_id: 'realtor-123',
    title: 'Spacious Family Home',
    address: '456 Oak Ave, Suburbia, USA',
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    square_footage: 2500,
    image_urls: ['https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], // Placeholder image
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    description: 'A beautiful and spacious family home in a quiet neighborhood.',
    property_type: 'Single-Family Home',
    status: 'Active',
  },
  {
    id: '3',
    agent_id: 'realtor-456',
    title: 'Cozy Suburban Getaway',
    address: '789 Pine Ln, Countryside, USA',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1800,
    image_urls: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], // Placeholder image
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    description: 'Charming townhouse with a private patio.',
    property_type: 'Townhouse',
    status: 'Pending',
  }
];

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllListings = async (agentId?: string): Promise<Listing[]> => {
  await apiDelay(300);
  if (agentId) {
    return listings.filter(listing => listing.agent_id === agentId);
  }
  return listings; // In a real app, admin might see all
};

export const getListingById = async (id: string): Promise<Listing | null> => {
  // For real listings, fetch from Supabase
  console.log('🔍 Fetching real listing from Supabase:', id);
  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      photos:listing_photos(*),
      agent:agent_profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }

  return listing;
};

export const getListings = async (): Promise<Listing[]> => {
  const { data: listings, error } = await supabase
    .from('listings')
    .select(`
      *,
      photos:listing_photos(*),
      agent:agent_profiles(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }

  return listings || [];
};

export const createListing = async (listing: Partial<Listing>): Promise<Listing> => {
  const { data, error } = await supabase
    .from('listings')
    .insert([listing])
    .select()
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    throw error;
  }

  return data;
};

export const updateListing = async (
  id: string,
  updates: Partial<Listing>
): Promise<Listing> => {
  // For real listings, update in Supabase
  console.log('🔄 Updating real listing in Supabase:', id);
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating listing:', error);
    throw error;
  }

  return data;
};

export const deleteListing = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const addListingPhoto = async (photo: Partial<ListingPhoto>): Promise<ListingPhoto> => {
  const { data, error } = await supabase
    .from('listing_photos')
    .insert([photo])
    .select()
    .single();

  if (error) {
    console.error('Error adding photo:', error);
    throw error;
  }

  return data;
};

export const deleteListingPhoto = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('listing_photos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

export const updateListingPhoto = async (
  id: string,
  updates: Partial<ListingPhoto>
): Promise<ListingPhoto> => {
  const { data, error } = await supabase
    .from('listing_photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating photo:', error);
    throw error;
  }

  return data;
};

export const reorderListingPhotos = async (
  listingId: string,
  photoIds: string[]
): Promise<void> => {
  const updates = photoIds.map((id, index) => ({
    id,
    display_order: index,
  }));

  const { error } = await supabase
    .from('listing_photos')
    .upsert(updates);

  if (error) {
    console.error('Error reordering photos:', error);
    throw error;
  }
};

export const getListingsForAgent = async (agentId: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('agent_id', agentId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'agent_id'>, agentId: string): Promise<Listing> => {
  console.log("Adding listing for agent:", agentId, "with data:", listingData);
  
  const newListing: Listing = {
    id: `${Date.now()}`,
    agent_id: agentId,
    ...listingData,
    created_at: new Date().toISOString(),
  };

  listings.push(newListing);
  return newListing;
};

export const getAgentListings = async (agentId: string): Promise<Listing[]> => {
  console.log('🔍 Fetching listings for agent:', agentId);
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agent listings:', error);
    throw error;
  }

  console.log('✅ Found listings for agent:', data?.length || 0);
  return data || [];
};
