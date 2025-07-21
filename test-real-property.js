// Test the complete anonymous builder flow with a real property
const SUPABASE_URL = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/scrape-property`;

// Test with a real Zillow property URL (replace with an actual listing)
const testUrl = 'https://www.zillow.com/homedetails/195-Skyline-Dr-Cashmere-WA-98815/214635184_zpid/';

async function testRealProperty() {
  console.log('🧪 Testing Anonymous Builder Flow');
  console.log('📍 URL:', testUrl);
  console.log('⏳ Calling ScraperAPI-powered endpoint...\n');
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
      },
      body: JSON.stringify({ url: testUrl }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ ScraperAPI Success!');
      console.log('📊 Scraped Data:');
      console.log('  📍 Address:', result.data.address || 'Not found');
      console.log('  💰 Price:', result.data.price || 'Not available');
      console.log('  🛏️  Bedrooms:', result.data.bedrooms || 'Not specified');
      console.log('  🚿 Bathrooms:', result.data.bathrooms || 'Not specified');
      console.log('  📐 Square Feet:', result.data.squareFeet || 'Not specified');
      console.log('  📝 Description:', result.data.description?.substring(0, 100) + '...' || 'No description');
      console.log('  🖼️  Images:', result.data.images?.length || 0);
      console.log('  🏘️  Features:', result.data.features?.length || 0);
      
      console.log('\n🎯 Ready for Anonymous Builder Flow!');
      console.log('   → Users can now paste any property URL');
      console.log('   → ScraperAPI handles anti-bot protection');
      console.log('   → Real data flows to the card trick preview');
      console.log('   → Conversion funnel is live! 🚀');
      
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testRealProperty(); 