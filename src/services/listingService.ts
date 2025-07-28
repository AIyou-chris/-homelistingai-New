import { supabase } from '../lib/supabase';
import { Listing, ListingPhoto, ListingStatus, PropertyType } from '../types';
import { N8N_LISTING_ENRICHMENT_URL } from '../constants';

// Mock data and functions - persistent in-memory store
let mockListings: Listing[] = [
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
    return mockListings.filter(listing => listing.agent_id === agentId);
  }
  return mockListings; // In a real app, admin might see all
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
  try {
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
      // Return mock data for demo users
      return [
        {
          id: 'demo-listing-1',
          title: 'Demo Property',
          description: 'A beautiful demo property for testing',
          address: '123 Demo Street, Demo City, DC 12345',
          price: 500000,
          property_type: 'Single-Family Home',
          status: 'active',
          bedrooms: 3,
          bathrooms: 2,
          square_footage: 1500,
          image_urls: [],
          created_at: new Date().toISOString(),
          agent_id: 'mock-user-id'
        }
      ];
    }

    return listings || [];
  } catch (error) {
    console.error('Error in getListings:', error);
    // Return mock data on any error
    return [
      {
        id: 'demo-listing-1',
        title: 'Demo Property',
        description: 'A beautiful demo property for testing',
        address: '123 Demo Street, Demo City, DC 12345',
        price: 500000,
        property_type: 'Single-Family Home',
        status: 'active',
        bedrooms: 3,
        bathrooms: 2,
        square_footage: 1500,
        image_urls: [],
        created_at: new Date().toISOString(),
        agent_id: 'mock-user-id'
      }
    ];
  }
};

export const createListing = async (listing: Partial<Listing>): Promise<Listing> => {
  try {
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
  } catch (error) {
    console.log('⚠️ Using mock data for createListing');
    // Create and persist mock listing for development
    const mockListing: Listing = {
      id: 'new-listing-' + Date.now(),
      title: listing.title || 'New Property',
      description: listing.description || 'Beautiful property with great features',
      address: listing.address || '123 New Property St',
      price: listing.price || 500000,
      property_type: listing.property_type || 'Single-Family Home',
      status: listing.status || 'active',
      bedrooms: listing.bedrooms || 3,
      bathrooms: listing.bathrooms || 2,
      square_footage: listing.square_footage || 1500,
      image_urls: listing.image_urls || ['/home1.jpg', '/home2.jpg'],
      created_at: new Date().toISOString(),
      agent_id: listing.agent_id || 'dev-user-id'
    };
    
    // Add to persistent mock store
    mockListings.push(mockListing);
    console.log('✅ Added listing to mock store. Total listings:', mockListings.length);
    
    return mockListing;
  }
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

  mockListings.push(newListing);
  return newListing;
};

export const getAgentListings = async (agentId: string): Promise<Listing[]> => {
  console.log('🔍 Fetching listings for agent:', agentId);
  
  try {
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
  } catch (error) {
    console.log('⚠️ Using mock data for agent listings');
    // Filter mock listings by agent ID and add default listings if none exist
    let agentListings = mockListings.filter(listing => listing.agent_id === agentId);
    
    // If no listings exist for this agent, add some default ones
    if (agentListings.length === 0) {
      const defaultListings = [
        {
          id: 'mock-listing-1',
          title: 'Beautiful Mountain View Home',
          description: 'A stunning property with amazing views',
          address: '123 Mountain View Dr, Cashmere, WA 98815',
          price: 750000,
          property_type: 'Single-Family Home',
          status: 'active',
          bedrooms: 4,
          bathrooms: 3,
          square_footage: 2200,
          image_urls: ['/home1.jpg', '/home2.jpg', '/home3.jpg'],
          created_at: new Date().toISOString(),
          agent_id: agentId
        },
        {
          id: 'mock-listing-2',
          title: 'Cozy Downtown Condo',
          description: 'Perfect for first-time buyers',
          address: '456 Main St, Cashmere, WA 98815',
          price: 350000,
          property_type: 'Condo',
          status: 'active',
          bedrooms: 2,
          bathrooms: 2,
          square_footage: 1200,
          image_urls: ['/home4.jpg', '/home5.jpg'],
          created_at: new Date().toISOString(),
          agent_id: agentId
        }
      ] as Listing[];
      
      // Add default listings to persistent store
      mockListings.push(...defaultListings);
      agentListings = defaultListings;
    }
    
    console.log('✅ Returning', agentListings.length, 'listings for agent:', agentId);
    return agentListings;
  }
};
