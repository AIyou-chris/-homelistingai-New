// Test script to verify proxy-based scraper works
const testUrls = [
  "https://www.zillow.com/homedetails/1248-Dakota-St-Wenatchee-WA-98801/85974913_zpid/",
  "https://www.zillow.com/homedetails/1423-Springwater-Ave-Wenatchee-WA-98801/85972778_zpid/",
  "https://www.zillow.com/homedetails/1242-Cherry-St-Wenatchee-WA-98801/85975292_zpid/"
];

async function testProxyScraper() {
  console.log('🧪 Testing Proxy-Based Zillow Scraper...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n${i + 1}. Testing: ${url}`);
    
    try {
      const photos = await getRealPhotosFromZillow(url);
      
      if (photos.length > 0) {
        console.log(`✅ SUCCESS! Found ${photos.length} real photos`);
        console.log(`📸 First photo: ${photos[0]}`);
        console.log(`📸 All photos are real Zillow URLs: ${photos.every(p => p.includes('photos.zillowstatic.com'))}`);
      } else {
        console.log('❌ FAILED - No real photos found');
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🏁 Testing complete!');
}

async function getRealPhotosFromZillow(url) {
  try {
    console.log('🔍 Fetching real photos from Zillow page via proxy...');
    
    // Use a proxy service to bypass Zillow's blocking
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      console.log('❌ Failed to fetch Zillow page via proxy:', response.status);
      return [];
    }
    
    const data = await response.json();
    const html = data.contents;
    
    // Extract photo URLs using regex
    const photoRegex = /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpg/g;
    const photos = html.match(photoRegex) || [];
    
    // Filter out duplicates and non-property photos
    const uniquePhotos = [...new Set(photos)].filter((photo) => 
      !photo.includes('badge') && 
      !photo.includes('footer') &&
      !photo.includes('app-store') &&
      !photo.includes('google-play') &&
      !photo.includes('logo') &&
      !photo.includes('placeholder')
    );
    
    console.log(`📸 Found ${uniquePhotos.length} real photos from Zillow`);
    return uniquePhotos.slice(0, 10);
    
  } catch (error) {
    console.log('❌ Failed to get real photos:', error);
    return [];
  }
}

testProxyScraper(); 