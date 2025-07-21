const { scrapeZillowWorking } = require('./src/services/workingZillowScraper.ts');

// Test URLs
const testUrls = [
  "https://www.zillow.com/homedetails/1248-Dakota-St-Wenatchee-WA-98801/85974913_zpid/",
  "https://www.zillow.com/homedetails/1423-Springwater-Ave-Wenatchee-WA-98801/85972778_zpid/",
  "https://www.zillow.com/homedetails/1242-Cherry-St-Wenatchee-WA-98801/85975292_zpid/",
  "https://www.zillow.com/homedetails/628-Meadows-Dr-Wenatchee-WA-98801/110533304_zpid/",
  "https://www.zillow.com/homedetails/1234-Main-St-Wenatchee-WA-98801/12345678_zpid/"
];

async function testScraper() {
  console.log('🧪 Testing Zillow Scraper with 5 URLs...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n${i + 1}. Testing: ${url}`);
    
    try {
      const result = await scrapeZillowWorking(url);
      
      if (result) {
        console.log('✅ SUCCESS!');
        console.log(`   Address: ${result.address}`);
        console.log(`   Price: ${result.price}`);
        console.log(`   Beds: ${result.bedrooms}, Baths: ${result.bathrooms}`);
        console.log(`   Sqft: ${result.squareFeet}`);
        console.log(`   Photos: ${result.images.length} found`);
        console.log(`   First photo: ${result.images[0]}`);
      } else {
        console.log('❌ FAILED - No result returned');
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🏁 Testing complete!');
}

testScraper(); 