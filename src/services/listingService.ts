import { supabase } from '../lib/supabase';
import { Listing, ListingPhoto, ListingStatus, PropertyType } from '../types';
import { N8N_LISTING_ENRICHMENT_URL } from '../constants';

// Mock initial listings data
let MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    agentId: 'agent-1',
    title: 'Modern Downtown Loft',
    description: 'A beautiful loft in the heart of the city.',
    address: '123 Main St, Anytown, USA',
    price: 500000,
    propertyType: PropertyType.CONDO,
    status: ListingStatus.ACTIVE,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Placeholder image
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    photos: [],
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=listing1',
    knowledgeBase: 'Built in 2020. Pool cleaned weekly. Smart home features included.'
  },
  {
    id: '2',
    agentId: 'agent-1',
    title: 'Suburban Family Home',
    description: 'Spacious home with a large backyard.',
    address: '456 Oak Ave, Suburbia, USA',
    price: 750000,
    propertyType: PropertyType.SINGLE_FAMILY,
    status: ListingStatus.PENDING,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    imageUrl: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Placeholder image
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    photos: [],
  },
  {
    id: '3',
    agentId: 'agent-2',
    title: 'Cozy Countryside Cottage',
    description: 'Charming cottage with scenic views.',
    address: '789 Pine Ln, Countryside, USA',
    price: 350000,
    propertyType: PropertyType.SINGLE_FAMILY,
    status: ListingStatus.SOLD,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Placeholder image
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    photos: [],
  }
];

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllListings = async (agentId?: string): Promise<Listing[]> => {
  await apiDelay(300);
  if (agentId) {
    return MOCK_LISTINGS.filter(listing => listing.agentId === agentId);
  }
  return MOCK_LISTINGS; // In a real app, admin might see all
};

export const getListingById = async (id: string): Promise<Listing | null> => {
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
    .eq('agentId', agentId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addListing = async (listingData: Omit<Listing, 'id' | 'createdAt' | 'agentId'>, agentId: string): Promise<Listing> => {
  console.log("Adding listing for agent:", agentId, "with data:", listingData);
  
  const newListing: Listing = {
    id: `${Date.now()}`,
    agentId,
    ...listingData,
    createdAt: new Date().toISOString(),
  };

  MOCK_LISTINGS.push(newListing);
  return newListing;
};
