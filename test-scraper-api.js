// Test script for ScraperAPI integration
// Run with: node test-scraper-api.js

const SUPABASE_URL = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/scrape-property`;

async function testScraperAPI() {
  const testUrls = [
    'https://www.zillow.com/homedetails/195-Skyline-Dr-Cashmere-WA-98815/214635184_zpid/',
    'https://www.realtor.com/realestateandhomes-detail/123-example-st',
    // Add a real test URL - you can replace this with any actual property URL
    'https://www.zillow.com/homedetails/1234-Main-St-Anytown-CA-90210/12345678_zpid/'
  ];

  for (const url of testUrls) {
    console.log(`\n🧪 Testing: ${url}`);
    
    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o`,
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Success!');
        console.log('📍 Address:', result.data.address);
        console.log('💰 Price:', result.data.price);
        console.log('🏠 Features:', result.data.features.length);
        console.log('📸 Images:', result.data.images.length);
      } else {
        console.log('❌ Failed:', result.error);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

// Run the test
testScraperAPI().catch(console.error); 