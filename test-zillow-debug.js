// Test Zillow scraping with detailed debugging
const testUrl = 'https://www.zillow.com/homedetails/405-Valley-View-Dr-Cashmere-WA-98815/85976965_zpid/';

async function testZillowScraping() {
  try {
    console.log('🔍 TESTING ZILLOW SCRAPING');
    console.log('URL:', testUrl);
    
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
      },
      body: JSON.stringify({ url: testUrl }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('\n📊 ZILLOW SCRAPING RESULT:');
    console.log('Success:', result.success);
    console.log('Data:', JSON.stringify(result.data, null, 2));
    
    if (result.data) {
      console.log('\n📸 ZILLOW PHOTO ANALYSIS:');
      console.log('Total images found:', result.data.images?.length || 0);
      if (result.data.images && result.data.images.length > 0) {
        result.data.images.forEach((img, idx) => {
          console.log(`  Image ${idx + 1}: ${img}`);
        });
      } else {
        console.log('❌ No images found on Zillow!');
      }
      
      console.log('\n🏠 ZILLOW PROPERTY DATA:');
      console.log('Address:', result.data.address);
      console.log('Price:', result.data.price);
      console.log('Bedrooms:', result.data.bedrooms);
      console.log('Bathrooms:', result.data.bathrooms);
      console.log('Square Feet:', result.data.squareFeet);
      console.log('Description length:', result.data.description?.length || 0);
      console.log('Features found:', result.data.features?.length || 0);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testZillowScraping(); 