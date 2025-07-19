import { supabase } from '../lib/supabase';
import { Listing, ListingPhoto, ListingStatus, PropertyType } from '../types';
import { N8N_LISTING_ENRICHMENT_URL } from '../constants';

export const getListingById = async (id: string): Promise<Listing | null> => {
  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_photos (
        id,
        url,
        display_order
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }

  if (!listing) return null;

  // Transform the data to include image_urls array and map square_feet to square_footage
  return {
    ...listing,
    square_footage: listing.square_feet, // Map database field to frontend field
    image_urls: listing.listing_photos
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      ?.map((photo: any) => photo.url) || []
  };
};

export const getListings = async (): Promise<Listing[]> => {
  const { data: listings, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_photos (
        id,
        url,
        display_order
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }

  // Transform the data to include image_urls array and map square_feet to square_footage
  const transformedListings = (listings || []).map(listing => ({
    ...listing,
    square_footage: listing.square_feet, // Map database field to frontend field
    image_urls: listing.listing_photos
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      ?.map((photo: any) => photo.url) || []
  }));

  return transformedListings;
};

export const createListing = async (listing: Partial<Listing>): Promise<Listing> => {
  // Get the current session to ensure we're authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  // Convert to match the actual database schema
  const dbListing = {
    agent_id: listing.agent_id || session.user.id,
    title: listing.title,
    address: listing.address,
    city: listing.city || 'Unknown',
    state: listing.state || 'Unknown', 
    zip_code: listing.zip_code || '00000',
    price: listing.price,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    square_feet: listing.square_feet || listing.square_footage,
    description: listing.description,
    status: (listing.status || 'active').toLowerCase(),
    special_features: listing.special_features || [],
    more_information: listing.more_information || '',
    created_at: new Date().toISOString()
  };

  console.log('Creating listing with authenticated user:', session.user.id);

  const { data, error } = await supabase
    .from('listings')
    .insert([dbListing])
    .select()
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    throw error;
  }

  // If we have images, add them to listing_photos table
  if (listing.image_urls && listing.image_urls.length > 0) {
    const photoData = listing.image_urls.map((url, index) => ({
      listing_id: data.id,
      url: url,
      is_primary: index === 0,
      is_scraped: true,
      display_order: index,
      created_at: new Date().toISOString()
    }));

    const { error: photoError } = await supabase
      .from('listing_photos')
      .insert(photoData);

    if (photoError) {
      console.error('Error adding photos:', photoError);
      // Don't fail the listing creation for photo errors
    }
  }

  return data;
};

export const updateListing = async (
  id: string,
  updates: Partial<Listing>
): Promise<Listing> => {
  console.log('🔄 Updating listing:', id, 'with data:', updates);
  
  // Map the updates to database field names
  const dbUpdates: any = {};
  
  // Direct field mappings - only include fields that exist in database schema
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
  if (updates.bathrooms !== undefined) dbUpdates.bathrooms = updates.bathrooms;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  // Note: property_type, lot_size, year_built don't exist in current schema
  // We'll handle these separately if needed
  
  // Handle city, state, zip_code if they're in the address
  if (updates.address !== undefined) {
    const addressParts = updates.address.split(',').map(part => part.trim());
    if (addressParts.length >= 3) {
      dbUpdates.city = addressParts[1] || '';
      dbUpdates.state = addressParts[2] || '';
      dbUpdates.zip_code = addressParts[3] || '';
    }
  }
  
  // Handle square footage mapping - database uses square_feet
  if (updates.square_footage !== undefined) {
    dbUpdates.square_feet = updates.square_footage;
  }
  
  // Note: knowledge_base field doesn't exist in database schema
  // We'll handle this separately if needed
  if (updates.knowledge_base !== undefined) {
    console.log('⚠️ knowledge_base field not supported in database schema');
    // Don't add to dbUpdates since the column doesn't exist
  }
  
  // Always update the updated_at timestamp
  dbUpdates.updated_at = new Date().toISOString();
  
  // Remove any undefined values to avoid database errors
  Object.keys(dbUpdates).forEach(key => {
    if (dbUpdates[key] === undefined || dbUpdates[key] === null) {
      delete dbUpdates[key];
    }
  });
  
  console.log('📝 Database updates:', dbUpdates);

  console.log('🔄 Attempting to update listing with data:', dbUpdates);
  
  const { data, error } = await supabase
    .from('listings')
    .update(dbUpdates)
    .eq('id', id)
    .select(`
      *,
      listing_photos (
        id,
        url,
        display_order
      )
    `)
    .single();

  if (error) {
    console.error('❌ Error updating listing:', error);
    console.error('❌ Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }

  console.log('✅ Listing updated successfully:', data);

  // Transform the response to include image_urls and map square_feet to square_footage
  const transformedListing = {
    ...data,
    square_footage: data.square_feet, // Map database field to frontend field
    image_urls: data.listing_photos
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      ?.map((photo: any) => photo.url) || []
  };

  // Handle image_urls updates if provided
  if (updates.image_urls !== undefined) {
    console.log('🖼️ Updating photos for listing:', id);
    
    // Delete existing photos
    await supabase
      .from('listing_photos')
      .delete()
      .eq('listing_id', id);
    
    // Add new photos
    if (updates.image_urls.length > 0) {
      const photoData = updates.image_urls.map((url, index) => ({
        listing_id: id,
        url: url,
        is_primary: index === 0,
        is_scraped: false,
        display_order: index,
        created_at: new Date().toISOString()
      }));

      const { error: photoError } = await supabase
        .from('listing_photos')
        .insert(photoData);

      if (photoError) {
        console.error('❌ Error updating photos:', photoError);
        // Don't fail the listing update for photo errors
      } else {
        console.log('✅ Photos updated successfully');
        transformedListing.image_urls = updates.image_urls;
      }
    }
  }

  return transformedListing;
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

export const getListingsForAgent = async (agentId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_photos (
        id,
        url,
        display_order
      )
    `)
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings for agent:', error);
    throw error;
  }

  // Transform the data to include image_urls array and map square_feet to square_footage
  const transformedListings = (data || []).map(listing => ({
    ...listing,
    square_footage: listing.square_feet, // Map database field to frontend field
    image_urls: listing.listing_photos
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      ?.map((photo: any) => photo.url) || []
  }));

  return transformedListings;
};

export const addListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'agent_id'>, agentId: string): Promise<Listing> => {
  console.log("Adding listing for agent:", agentId, "with data:", listingData);
  
  const newListing: Listing = {
    id: `${Date.now()}`,
    agent_id: agentId,
    ...listingData,
    created_at: new Date().toISOString(),
  };

  // This function is no longer used for mock data, but kept for consistency
  // In a real app, you would call a Supabase insert here.
  // For now, it just returns the newListing object.
  return newListing;
};

export const getAgentListings = async (agentId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agent listings:', error);
    throw error;
  }

  return data || [];
};
