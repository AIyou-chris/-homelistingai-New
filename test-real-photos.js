// Test script to verify real photos are being fetched
const testUrls = [
  "https://www.zillow.com/homedetails/1248-Dakota-St-Wenatchee-WA-98801/85974913_zpid/",
  "https://www.zillow.com/homedetails/1423-Springwater-Ave-Wenatchee-WA-98801/85972778_zpid/",
  "https://www.zillow.com/homedetails/1242-Cherry-St-Wenatchee-WA-98801/85975292_zpid/"
];

async function testRealPhotos() {
  console.log('🧪 Testing Real Photo Extraction...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n${i + 1}. Testing: ${url}`);
    
    try {
      // Test the getRealPhotosFromZillow function
      const photos = await getRealPhotosFromZillow(url);
      
      if (photos.length > 0) {
        console.log(`✅ SUCCESS! Found ${photos.length} real photos`);
        console.log(`📸 First photo: ${photos[0]}`);
        console.log(`📸 Photo URLs are real Zillow URLs: ${photos[0].includes('photos.zillowstatic.com')}`);
      } else {
        console.log('❌ FAILED - No real photos found');
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🏁 Testing complete!');
}

async function getRealPhotosFromZillow(url) {
  try {
    console.log('🔍 Fetching real photos from Zillow page...');
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.log('❌ Failed to fetch Zillow page:', response.status);
      return [];
    }
    
    const html = await response.text();
    
    // Extract photo URLs using regex
    const photoRegex = /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpg/g;
    const photos = html.match(photoRegex) || [];
    
    // Filter out duplicates and non-property photos
    const uniquePhotos = [...new Set(photos)].filter(photo => 
      !photo.includes('badge') && 
      !photo.includes('footer') &&
      !photo.includes('app-store') &&
      !photo.includes('google-play') &&
      !photo.includes('logo')
    );
    
    console.log(`📸 Found ${uniquePhotos.length} real photos from Zillow`);
    return uniquePhotos.slice(0, 10);
    
  } catch (error) {
    console.log('❌ Failed to get real photos:', error);
    return [];
  }
}

testRealPhotos(); 