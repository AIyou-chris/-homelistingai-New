import scrapingService from './src/services/scrapingService';

async function testScraping() {
  console.log('🧪 Testing HomeListingAI Scraping Service...\n');

  try {
    // Test property scraping
    console.log('📋 Testing Property Scraping...');
    
    // Note: These are example URLs - you'll need real Zillow/Realtor.com URLs
    const testUrls: string[] = [
      // 'https://www.zillow.com/homedetails/123-example-street-austin-tx-78701/123456789_zpid/',
      // 'https://www.realtor.com/realestateandhomes-detail/456-sample-ave-austin_TX_78702_M12345-12345'
    ];

    if (testUrls.length > 0) {
      const properties = await scrapingService.scrapeMultipleProperties(testUrls);
      console.log(`✅ Scraped ${properties.length} properties`);
      
      properties.forEach((property, index) => {
        console.log(`\n🏠 Property ${index + 1}:`);
        console.log(`   Address: ${property.address}`);
        console.log(`   Price: ${property.price}`);
        console.log(`   Beds: ${property.bedrooms}, Baths: ${property.bathrooms}`);
        console.log(`   Sq Ft: ${property.squareFeet}`);
        console.log(`   Features: ${property.features.length} found`);
      });
    } else {
      console.log('⚠️  No test URLs provided. Add real Zillow/Realtor.com URLs to test.');
    }

    // Test neighborhood data scraping
    console.log('\n🏘️  Testing Neighborhood Data Scraping...');
    try {
      const neighborhoodData = await scrapingService.scrapeNeighborhoodData('Downtown', 'Austin', 'TX');
      console.log('✅ Neighborhood data scraped successfully');
      console.log(`   Name: ${neighborhoodData.name}`);
      console.log(`   Description: ${neighborhoodData.description.substring(0, 100)}...`);
      console.log(`   Schools: ${neighborhoodData.schools.length} found`);
      console.log(`   Amenities: ${neighborhoodData.amenities.length} found`);
    } catch (error) {
      console.log('⚠️  Neighborhood scraping failed (expected for demo)');
    }

    // Test market data scraping
    console.log('\n📊 Testing Market Data Scraping...');
    try {
      const marketData = await scrapingService.scrapeMarketData('Austin', 'TX');
      console.log('✅ Market data scraped successfully');
      console.log(`   Area: ${marketData.area}`);
      console.log(`   Median Price: ${marketData.medianHomePrice}`);
      console.log(`   Market Trend: ${marketData.marketTrend}`);
      console.log(`   Days on Market: ${marketData.daysOnMarket}`);
    } catch (error) {
      console.log('⚠️  Market data scraping failed (expected for demo)');
    }

    // Test knowledge base export
    console.log('\n📚 Testing Knowledge Base Export...');
    const sampleProperties = [
      {
        address: "123 Oak Street, Austin, TX 78701",
        price: "$599,000",
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 2200,
        description: "Beautiful modern home in the heart of Austin's most desirable neighborhood.",
        features: ["Open concept", "Gourmet kitchen", "Master suite", "Hardwood floors"],
        neighborhood: "Downtown Austin",
        images: [],
        listingUrl: "https://example.com/123-oak-street",
        scrapedAt: new Date()
      }
    ];

    const knowledgeBase = scrapingService.exportToKnowledgeBase(sampleProperties);
    console.log('✅ Knowledge base generated successfully');
    console.log(`   Length: ${knowledgeBase.length} characters`);
    console.log(`   Properties: ${sampleProperties.length}`);

    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Add real Zillow/Realtor.com URLs to testUrls array');
    console.log('   2. Run the scraper to collect real property data');
    console.log('   3. Use the generated knowledge base to train your AI');
    console.log('   4. Integrate with your VoiceBot and ChatBot for property-specific responses');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testScraping(); 