// Test script to verify scraped photos functionality
// Run this in the browser console

const listingId = 'fe3e940a-2a70-4b32-b0ff-506073b64f9f';

async function testScrapedPhotos() {
  try {
    console.log('🔍 Testing scraped photos for listing:', listingId);
    
    // Get all photos for the listing
    const { data: photos, error } = await supabase
      .from('listing_photos')
      .select('*')
      .eq('listing_id', listingId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching photos:', error);
      return;
    }

    console.log('📸 All photos:', photos);
    
    // Check scraped vs non-scraped photos
    const scrapedPhotos = photos.filter(p => p.is_scraped);
    const nonScrapedPhotos = photos.filter(p => !p.is_scraped);
    
    console.log('🔄 Scraped photos:', scrapedPhotos.length);
    console.log('📷 Non-scraped photos:', nonScrapedPhotos.length);
    
    // Show photo details
    photos.forEach((photo, index) => {
      console.log(`Photo ${index + 1}:`, {
        id: photo.id,
        url: photo.url,
        is_scraped: photo.is_scraped,
        is_primary: photo.is_primary,
        display_order: photo.display_order
      });
    });
    
    // Test the listing service
    const listing = await getListingById(listingId);
    console.log('🏠 Listing image_urls:', listing?.image_urls);
    console.log('📊 Total images in listing:', listing?.image_urls?.length || 0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testScrapedPhotos(); 