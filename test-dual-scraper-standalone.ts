// Standalone test for dual knowledge base system
import axios from 'axios';
import * as cheerio from 'cheerio';

// Mock the scraping service for testing
class MockScrapingService {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async fetchWithRetry(url: string): Promise<string> {
    // Return mock data for testing
    if (url.includes('zillow.com/homedetails')) {
      return `
        <html>
          <body>
            <div data-testid="home-details-summary-address">123 Oak Street, Austin, TX 78701</div>
            <div data-testid="price">$599,000</div>
            <div data-testid="home-description">Beautiful modern home in the heart of Austin's most desirable neighborhood.</div>
            <div class="home-details-summary">3 bed 2.5 bath 2,200 sq ft</div>
          </body>
        </html>
      `;
    } else if (url.includes('linkedin.com/in')) {
      return `
        <html>
          <body>
            <h1>Jane Smith</h1>
            <div class="headline">Real Estate Professional</div>
            <div class="company">Austin Real Estate Group</div>
          </body>
        </html>
      `;
    } else {
      return `
        <html>
          <body>
            <h1>Sample Agent</h1>
            <div class="bio">Experienced real estate professional</div>
            <div class="company">Sample Company</div>
          </body>
        </html>
      `;
    }
  }
}

// Mock knowledge base service
class MockKnowledgeBaseService {
  private listings: any[] = [];
  private agents: any[] = [];

  categorizeUrl(url: string): 'listing' | 'agent' {
    const listingPatterns = [
      'zillow.com/homedetails',
      'realtor.com/realestateandhomes-detail',
      'redfin.com/home'
    ];

    const agentPatterns = [
      'zillow.com/profile',
      'realtor.com/realestateagent',
      'linkedin.com/in',
      'facebook.com',
      'instagram.com'
    ];

    const lowerUrl = url.toLowerCase();
    
    if (listingPatterns.some(pattern => lowerUrl.includes(pattern))) {
      return 'listing';
    }
    
    if (agentPatterns.some(pattern => lowerUrl.includes(pattern))) {
      return 'agent';
    }

    if (lowerUrl.includes('profile') || lowerUrl.includes('about') || 
        lowerUrl.includes('team') || lowerUrl.includes('agent')) {
      return 'agent';
    }

    if (lowerUrl.includes('realestate') || lowerUrl.includes('property') || 
        lowerUrl.includes('home') || lowerUrl.includes('house')) {
      return 'listing';
    }

    return 'agent';
  }

  async processUrl(url: string): Promise<{ type: 'listing' | 'agent'; data: any }> {
    const urlType = this.categorizeUrl(url);
    
    if (urlType === 'listing') {
      const propertyData = await this.scrapePropertyListing(url);
      return { type: 'listing', data: propertyData };
    } else {
      const agentData = await this.scrapeAgentProfile(url);
      return { type: 'agent', data: agentData };
    }
  }

  private async scrapePropertyListing(url: string): Promise<any> {
    const mockScrapingService = new MockScrapingService();
    const html = await mockScrapingService.fetchWithRetry(url);
    const $ = cheerio.load(html);

    const address = $('[data-testid="home-details-summary-address"]').text().trim();
    const price = $('[data-testid="price"]').text().trim();
    const description = $('[data-testid="home-description"]').text().trim();

    return {
      address: address || 'Sample Property Address',
      price: price || '$500,000',
      description: description || 'Beautiful sample property',
      features: ['Modern kitchen', 'Hardwood floors', 'Large backyard'],
      neighborhood: 'Sample Neighborhood',
      images: [],
      listingUrl: url,
      scrapedAt: new Date()
    };
  }

  private async scrapeAgentProfile(url: string): Promise<any> {
    const mockScrapingService = new MockScrapingService();
    const html = await mockScrapingService.fetchWithRetry(url);
    const $ = cheerio.load(html);

    const name = $('h1').text().trim();
    const title = $('.headline').text().trim();
    const company = $('.company').text().trim();

    return {
      name: name || 'Sample Agent',
      company: company || 'Sample Company',
      title: title || 'Real Estate Professional',
      bio: 'Experienced real estate professional with expertise in residential and commercial properties.',
      specialties: ['Residential Sales', 'Buyer Representation', 'Seller Representation'],
      experience: '5+ years',
      profileUrl: url,
      scrapedAt: new Date()
    };
  }

  async addToListings(propertyData: any): Promise<void> {
    this.listings.push(propertyData);
  }

  async addToAgents(agentData: any): Promise<void> {
    this.agents.push(agentData);
  }

  getListings(): any[] {
    return this.listings;
  }

  getAgents(): any[] {
    return this.agents;
  }

  generateListingsKnowledgeBase(): string {
    const listings = this.getListings();
    let knowledgeBase = '# Property Knowledge Base\n\n';
    
    listings.forEach((property, index) => {
      knowledgeBase += `## Property ${index + 1}: ${property.address}\n\n`;
      knowledgeBase += `**Price:** ${property.price}\n`;
      knowledgeBase += `**Description:** ${property.description}\n\n`;
      knowledgeBase += `**Source:** ${property.listingUrl}\n\n`;
      knowledgeBase += '---\n\n';
    });
    
    return knowledgeBase;
  }

  generateAgentsKnowledgeBase(): string {
    const agents = this.getAgents();
    let knowledgeBase = '# Real Estate Agents Knowledge Base\n\n';
    
    agents.forEach((agent, index) => {
      knowledgeBase += `## Agent ${index + 1}: ${agent.name}\n\n`;
      if (agent.company) knowledgeBase += `**Company:** ${agent.company}\n`;
      if (agent.title) knowledgeBase += `**Title:** ${agent.title}\n`;
      if (agent.bio) knowledgeBase += `**Bio:** ${agent.bio}\n\n`;
      knowledgeBase += `**Profile:** ${agent.profileUrl}\n\n`;
      knowledgeBase += '---\n\n';
    });
    
    return knowledgeBase;
  }

  generateCombinedKnowledgeBase(): string {
    const listingsKB = this.generateListingsKnowledgeBase();
    const agentsKB = this.generateAgentsKnowledgeBase();
    return `# HomeListingAI Complete Knowledge Base\n\n${listingsKB}\n${agentsKB}`;
  }

  getKnowledgeBaseStructure(): any {
    const listings = this.getListings();
    const agents = this.getAgents();
    
    return {
      listings: {
        properties: listings,
        lastUpdated: new Date(),
        totalProperties: listings.length
      },
      agents: {
        realtors: agents,
        lastUpdated: new Date(),
        totalAgents: agents.length
      }
    };
  }

  searchKnowledgeBase(query: string): { listings: any[], agents: any[] } {
    const listings = this.getListings();
    const agents = this.getAgents();
    const lowerQuery = query.toLowerCase();
    
    const matchingListings = listings.filter(listing => 
      listing.address.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery)
    );
    
    const matchingAgents = agents.filter(agent => 
      agent.name.toLowerCase().includes(lowerQuery) ||
      agent.company?.toLowerCase().includes(lowerQuery) ||
      agent.bio?.toLowerCase().includes(lowerQuery)
    );
    
    return { listings: matchingListings, agents: matchingAgents };
  }
}

async function testDualScraping() {
  console.log('🧪 Testing HomeListingAI Dual Knowledge Base System...\n');

  try {
    const knowledgeBaseService = new MockKnowledgeBaseService();

    // Test URL categorization
    console.log('🔍 Testing URL Categorization...');
    
    const testUrls = [
      'https://www.zillow.com/homedetails/195-Skyline-Dr-Cashmere-WA-98815/214635184_zpid/',
      'https://www.realtor.com/realestateagent/john-doe-austin-tx-12345',
      'https://www.linkedin.com/in/jane-smith-real-estate',
      'https://www.facebook.com/realestateagent.mike',
      'https://www.zillow.com/profile/agent-sarah-jones',
      'https://www.realtor.com/realestateandhomes-detail/456-sample-ave-austin_TX_78702_M12345-12345'
    ];

    console.log('URLs to test:');
    testUrls.forEach((url, index) => {
      const type = knowledgeBaseService.categorizeUrl(url);
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