import { scrapeZillowWorking } from './src/services/workingZillowScraper';

async function testScraper() {
  console.log('🧪 Testing Zillow Scraper...');
  
  const testUrl = 'https://www.zillow.com/homedetails/1101-Fuller-St-Wenatchee-WA-98801/85969904_zpid/';
  
  try {
    const result = await scrapeZillowWorking(testUrl);
    
    if (result) {
      console.log('✅ SUCCESS! Scraped data:');
      console.log('Address:', result.address);
      console.log('Price:', result.price);
      console.log('Bedrooms:', result.bedrooms);
      console.log('Bathrooms:', result.bathrooms);
      console.log('Square Feet:', result.squareFeet);
      console.log('Description:', result.description.substring(0, 100) + '...');
      console.log('Features:', result.features);
      console.log('Images:', result.images.length, 'images found');
    } else {
      console.log('❌ FAILED: No data scraped');
    }
  } catch (error) {
    console.error('❌ ERROR:', error);
  }
}

testScraper(); 