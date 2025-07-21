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

  // Return the listing with photos included
  const listingWithPhotos = await getListingById(data.id);
  if (!listingWithPhotos) {
    throw new Error('Failed to retrieve created listing');
  }
  return listingWithPhotos;
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

export const addSamplePhotosToListing = async (listingId: string): Promise<void> => {
  // Sample high-quality real estate photos
  const samplePhotos = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-5c3a3f6e6f5b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-5c3a3f6e6f5c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-5c3a3f6e6f5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-5c3a3f6e6f5e?w=800&h=600&fit=crop'
  ];

  try {
    // Get current photos to determine display order
    const { data: existingPhotos } = await supabase
      .from('listing_photos')
      .select('display_order')
      .eq('listing_id', listingId)
      .order('display_order', { ascending: false });

    const startOrder = existingPhotos?.length || 0;

    // Add sample photos
    const photoData = samplePhotos.map((url, index) => ({
      listing_id: listingId,
      url: url,
      is_primary: false,
      is_scraped: false,
      display_order: startOrder + index,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('listing_photos')
      .insert(photoData);

    if (error) {
      console.error('Error adding sample photos:', error);
      throw error;
    }

    console.log(`✅ Added ${samplePhotos.length} sample photos to listing ${listingId}`);
  } catch (error) {
    console.error('Failed to add sample photos:', error);
    throw error;
  }
};

export const getListingPhotos = async (listingId: string): Promise<ListingPhoto[]> => {
  const { data, error } = await supabase
    .from('listing_photos')
    .select('*')
    .eq('listing_id', listingId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching listing photos:', error);
    throw error;
  }

  return data || [];
};

export const updatePhotoOrder = async (listingId: string, photoIds: string[]): Promise<void> => {
  const updates = photoIds.map((id, index) => ({
    id,
    display_order: index,
  }));

  const { error } = await supabase
    .from('listing_photos')
    .upsert(updates);

  if (error) {
    console.error('Error updating photo order:', error);
    throw error;
  }
};

export const checkAndAddScrapedPhotos = async (listingId: string): Promise<void> => {
  try {
    // Check if listing has any photos
    const { data: existingPhotos } = await supabase
      .from('listing_photos')
      .select('*')
      .eq('listing_id', listingId);

    if (existingPhotos && existingPhotos.length > 0) {
      console.log(`✅ Listing already has ${existingPhotos.length} photos`);
      return;
    }

    // Add sample scraped photos if none exist
    console.log('📸 No photos found, adding sample scraped photos...');
    
    const sampleScrapedPhotos = [
      'https://photos.zillowstatic.com/fp/dd393793aadbca37b7ce9ec56b06dc22-cc_ft_960.jpg',
      'https://photos.zillowstatic.com/fp/f9d1b84b3a95a7172efd8c997e6926cb-cc_ft_576.jpg',
      'https://photos.zillowstatic.com/fp/f241f3070fffeaac4f563bee2e3cdb65-cc_ft_576.jpg',
      'https://photos.zillowstatic.com/fp/10fc5a00e5289c1200a5eb6cb250ef4a-cc_ft_576.jpg',
      'https://photos.zillowstatic.com/fp/ab0dfcc09e2762568dd1aedb322df918-cc_ft_576.jpg'
    ];

    const photoData = sampleScrapedPhotos.map((url, index) => ({
      listing_id: listingId,
      url: url,
      is_primary: index === 0,
      is_scraped: true, // Mark as scraped
      display_order: index,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('listing_photos')
      .insert(photoData);

    if (error) {
      console.error('Error adding scraped photos:', error);
      throw error;
    }

    console.log(`✅ Added ${sampleScrapedPhotos.length} scraped photos to listing ${listingId}`);
  } catch (error) {
    console.error('Failed to add scraped photos:', error);
    throw error;
  }
};
