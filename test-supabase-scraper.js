// Test the Supabase scraping function
const testUrls = [
  "https://www.zillow.com/homedetails/901-Willis-St-Wenatchee-WA-98801/85972583_zpid/",
  "https://www.zillow.com/homedetails/1248-Dakota-St-Wenatchee-WA-98801/85974913_zpid/"
];

async function testSupabaseScraper() {
  console.log('🧪 Testing Supabase Scraper...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n${i + 1}. Testing: ${url}`);
    
    try {
      const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
        },
        body: JSON.stringify({
          url: url
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ SUCCESS!');
        console.log('📋 Full response:', JSON.stringify(result, null, 2));
        
        if (result.data) {
          console.log(`   Address: ${result.data.address || 'Not found'}`);
          console.log(`   Price: ${result.data.price || 'Not found'}`);
          console.log(`   Beds: ${result.data.bedrooms || 'Not found'}`);
          console.log(`   Baths: ${result.data.bathrooms || 'Not found'}`);
          console.log(`   Sqft: ${result.data.squareFeet || result.data.square_feet || 'Not found'}`);
          console.log(`   Photos: ${result.data.images?.length || 0} found`);
          console.log(`   Description: ${result.data.description ? 'Yes' : 'No'}`);
          console.log(`   Features: ${result.data.features?.length || 0} found`);
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ FAILED: ${response.status} - ${errorText}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🏁 Testing complete!');
}

testSupabaseScraper(); 