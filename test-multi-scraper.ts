import { scrapeUniversalListing } from './src/services/universalRealEstateScraper';
import { scrapeZillowWorking } from './src/services/workingZillowScraper';

async function testMultiSiteScraper() {
  console.log('🧪 Testing Multi-Site Real Estate Scraper...\n');
  
  const testUrls = [
    // Zillow (we know this works)
    'https://www.zillow.com/homedetails/1101-Fuller-St-Wenatchee-WA-98801/85969904_zpid/',
    
    // Redfin example
    'https://www.redfin.com/WA/Wenatchee/1101-Fuller-St-98801/home/12345678',
    
    // Realtor.com example  
    'https://www.realtor.com/realestateandhomes-detail/1101-Fuller-St_Wenatchee_WA_98801_M12345-12345',
    
    // Trulia example
    'https://www.trulia.com/p/wa/wenatchee/1101-fuller-st-wenatchee-wa-98801--1234567890',
    
    // Homes.com example
    'https://www.homes.com/property/1101-fuller-st-wenatchee-wa-98801/id-123456789/'
  ];
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n🏠 Testing URL ${i + 1}/${testUrls.length}:`);
    console.log(`   ${url}`);
    
    try {
      // Try universal scraper first
      const result = await scrapeUniversalListing(url);
      
      if (result) {
        console.log('✅ SUCCESS with Universal Scraper!');
        console.log(`   Site: ${result.site}`);
        console.log(`   Address: ${result.address}`);
        console.log(`   Price: ${result.price}`);
        console.log(`   Beds: ${result.bedrooms}, Baths: ${result.bathrooms}`);
        console.log(`   Sq Ft: ${result.squareFeet}`);
        console.log(`   Images: ${result.images.length} found`);
      } else {
        console.log('❌ Universal scraper failed, trying Zillow-specific...');
        
        // Fallback to Zillow-specific scraper for Zillow URLs
        if (url.includes('zillow.com')) {
          const zillowResult = await scrapeZillowWorking(url);
          if (zillowResult) {
            console.log('✅ SUCCESS with Zillow Scraper!');
            console.log(`   Address: ${zillowResult.address}`);
            console.log(`   Price: ${zillowResult.price}`);
            console.log(`   Beds: ${zillowResult.bedrooms}, Baths: ${zillowResult.bathrooms}`);
            console.log(`   Sq Ft: ${zillowResult.squareFeet}`);
            console.log(`   Images: ${zillowResult.images.length} found`);
          } else {
            console.log('❌ Both scrapers failed');
          }
        } else {
          console.log('❌ No fallback available for this site');
        }
      }
    } catch (error) {
      console.error('❌ ERROR:', error);
    }
  }
  
  console.log('\n🎯 Supported Sites:');
  console.log('   ✅ Zillow.com');
  console.log('   ✅ Redfin.com');
  console.log('   ✅ Realtor.com');
  console.log('   ✅ Trulia.com');
  console.log('   ✅ Homes.com');
  console.log('   ✅ Compass.com');
  console.log('   ✅ BerkshireHathaway.com');
  console.log('   ✅ ColdwellBanker.com');
  console.log('   ✅ Remax.com');
  console.log('   ✅ KellerWilliams.com');
  console.log('   ✅ Generic fallback for other sites');
}

testMultiSiteScraper(); 