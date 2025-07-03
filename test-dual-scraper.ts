import knowledgeBaseService from './src/services/knowledgeBaseService';

async function testDualScraping() {
  console.log('🧪 Testing HomeListingAI Dual Knowledge Base System...\n');

  try {
    // Test URL categorization
    console.log('🔍 Testing URL Categorization...');
    
    const testUrls = [
      'https://www.zillow.com/homedetails/123-example-street-austin-tx-78701/123456789_zpid/',
      'https://www.realtor.com/realestateagent/john-doe-austin-tx-12345',
      'https://www.linkedin.com/in/jane-smith-real-estate',
      'https://www.facebook.com/realestateagent.mike',
      'https://www.zillow.com/profile/agent-sarah-jones',
      'https://www.realtor.com/realestateandhomes-detail/456-sample-ave-austin_TX_78702_M12345-12345'
    ];

    console.log('URLs to test:');
    testUrls.forEach((url, index) => {
      const type = knowledgeBaseService['categorizeUrl'](url);
      console.log(`  ${index + 1}. ${url} → ${type.toUpperCase()}`);
    });

    // Test processing each URL
    console.log('\n📋 Testing URL Processing...');
    
    for (const url of testUrls) {
      try {
        console.log(`\nProcessing: ${url}`);
        const result = await knowledgeBaseService.processUrl(url);
        console.log(`  ✅ Type: ${result.type}`);
        
        if (result.type === 'listing') {
          const property = result.data;
          console.log(`  🏠 Property: ${property.address}`);
          console.log(`  💰 Price: ${property.price}`);
          console.log(`  📝 Description: ${property.description.substring(0, 50)}...`);
        } else {
          const agent = result.data;
          console.log(`  👤 Agent: ${agent.name}`);
          console.log(`  🏢 Company: ${agent.company}`);
          console.log(`  📄 Bio: ${agent.bio?.substring(0, 50)}...`);
        }
      } catch (error: any) {
        console.log(`  ❌ Failed: ${error.message}`);
      }
    }

    // Test knowledge base generation
    console.log('\n📚 Testing Knowledge Base Generation...');
    
    const listingsKB = knowledgeBaseService.generateListingsKnowledgeBase();
    const agentsKB = knowledgeBaseService.generateAgentsKnowledgeBase();
    const combinedKB = knowledgeBaseService.generateCombinedKnowledgeBase();
    
    console.log(`✅ Listings KB: ${listingsKB.length} characters`);
    console.log(`✅ Agents KB: ${agentsKB.length} characters`);
    console.log(`✅ Combined KB: ${combinedKB.length} characters`);

    // Test knowledge base structure
    console.log('\n📊 Testing Knowledge Base Structure...');
    const structure = knowledgeBaseService.getKnowledgeBaseStructure();
    console.log(`📈 Total Properties: ${structure.listings.totalProperties}`);
    console.log(`👥 Total Agents: ${structure.agents.totalAgents}`);

    // Test search functionality
    console.log('\n🔍 Testing Search Functionality...');
    const searchResults = knowledgeBaseService.searchKnowledgeBase('austin');
    console.log(`🔍 Search for "austin":`);
    console.log(`  🏠 Properties found: ${searchResults.listings.length}`);
    console.log(`  👤 Agents found: ${searchResults.agents.length}`);

    // Test adding sample data
    console.log('\n➕ Testing Data Addition...');
    
    // Add a sample property
    const sampleProperty = {
      address: "789 Test Street, Austin, TX 78703",
      price: "$750,000",
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2800,
      description: "Beautiful modern home in the heart of Austin with stunning views and luxury amenities.",
      features: ["Gourmet kitchen", "Master suite", "Pool", "Smart home features"],
      neighborhood: "Downtown Austin",
      images: [],
      listingUrl: "https://example.com/test-property",
      scrapedAt: new Date()
    };
    
    await knowledgeBaseService.addToListings(sampleProperty);
    console.log('✅ Added sample property');

    // Add a sample agent
    const sampleAgent = {
      name: "Alex Johnson",
      company: "Austin Real Estate Group",
      title: "Senior Real Estate Agent",
      bio: "Experienced real estate professional specializing in luxury properties and investment opportunities in the Austin market.",
      specialties: ["Luxury Properties", "Investment Properties", "First-time Buyers"],
      experience: "8+ years",
      certifications: ["Licensed Real Estate Agent", "Certified Luxury Home Specialist"],
      contactInfo: {
        phone: "(555) 987-6543",
        email: "alex@austinrealestate.com"
      },
      areas: ["Austin", "Round Rock", "Cedar Park"],
      languages: ["English", "Spanish"],
      profileUrl: "https://example.com/alex-johnson",
      scrapedAt: new Date()
    };
    
    await knowledgeBaseService.addToAgents(sampleAgent);
    console.log('✅ Added sample agent');

    // Show updated structure
    const updatedStructure = knowledgeBaseService.getKnowledgeBaseStructure();
    console.log(`📈 Updated - Properties: ${updatedStructure.listings.totalProperties}, Agents: ${updatedStructure.agents.totalAgents}`);

    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Use the scraping interface to add real URLs');
    console.log('   2. The system will automatically categorize them');
    console.log('   3. Generate combined knowledge base for AI training');
    console.log('   4. Integrate with VoiceBot and ChatBot for comprehensive responses');
    console.log('   5. Your AI can now answer questions about both properties AND agents!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDualScraping(); 