// Script to add sample photos to a listing
// Run this in the browser console on the listing page

const listingId = 'fe3e940a-2a70-4b32-b0ff-506073b64f9f';

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

async function addSamplePhotos() {
  try {
    console.log('🖼️ Adding sample photos to listing:', listingId);
    
    // Get current photos to determine display order
    const { data: existingPhotos } = await supabase
      .from('listing_photos')
      .select('display_order')
      .eq('listing_id', listingId)
      .order('display_order', { ascending: false });

    const startOrder = existingPhotos?.length || 0;
    console.log('📊 Current photos count:', startOrder);

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
      console.error('❌ Error adding sample photos:', error);
      return;
    }

    console.log(`✅ Successfully added ${samplePhotos.length} sample photos!`);
    console.log('🔄 Refresh the page to see the new photos in the gallery.');
    
  } catch (error) {
    console.error('❌ Failed to add sample photos:', error);
  }
}

// Run the function
addSamplePhotos(); 