import { supabase } from '../lib/supabase';
import scrapingService, { ScrapedPropertyData } from './scrapingService';

export interface KnowledgeBaseEntry {
  id?: string;
  knowledge_base_id: string;
  entry_type: 'document' | 'note' | 'faq' | 'file';
  title: string;
  content: string;
  file_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
  is_current?: boolean;
}

export interface ListingKnowledgeData {
  // Core Property Details
  address: string;
  price: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  lotSize: string;
  yearBuilt: string;
  
  // Property Features
  interiorFeatures: string[];
  exteriorFeatures: string[];
  utilities: string[];
  parking: string[];
  
  // Property Highlights
  keySellingPoints: string[];
  recentUpdates: string[];
  uniqueFeatures: string[];
  investmentHighlights: string[];
  
  // Financial & Market Data
  originalPrice: string;
  priceHistory: { date: string; price: string }[];
  daysOnMarket: string;
  rentalPotential: string;
  annualTaxes: string;
  hoaFees: string;
  
  // Property History & Condition
  lastRenovated: string;
  propertyCondition: string;
  hoaRules: string;
  
  // Neighborhood Information
  schoolDistrict: string;
  schoolRatings: string;
  transportation: string[];
  localAmenities: string[];
  crimeRating: string;
  
  // Contact Information
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactCompany: string;
  contactWebsite: string;
  contactBio: string;
  
  // Showing Information
  showingInstructions: string;
  availableTimes: string[];
  specialRequirements: string;
  
  // Lead Generation
  preferredContact: string;
  responseTime: string;
  languagesSpoken: string[];
  
  // Media & Marketing
  title: string;
  description: string;
  videoUrl: string;
  socialMediaLinks: string[];
  virtualTourUrls: string[];
  floorPlanUrl: string;
}

export interface AgentData {
  name: string;
  company?: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  experience?: string;
  certifications?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  areas?: string[];
  languages?: string[];
  awards?: string[];
  testimonials?: string[];
  profileUrl?: string;
  scrapedAt: Date;
}

export interface KnowledgeBaseStructure {
  listings: {
    properties: ScrapedPropertyData[];
    lastUpdated: Date;
    totalProperties: number;
  };
  agents: {
    realtors: AgentData[];
    lastUpdated: Date;
    totalAgents: number;
  };
}

export const createKnowledgeBaseForListing = async (
  listingId: string,
  knowledgeData: ListingKnowledgeData,
  userId: string
): Promise<string> => {
  // Create the knowledge base
  const { data: knowledgeBase, error: kbError } = await supabase
    .from('knowledge_bases')
    .insert([{
      type: 'listing',
      listing_id: listingId,
      title: `Knowledge Base for ${knowledgeData.title || knowledgeData.address}`,
      created_by: userId
    }])
    .select()
    .single();

  if (kbError) {
    console.error('Error creating knowledge base:', kbError);
    throw kbError;
  }

  const knowledgeBaseId = knowledgeBase.id;

  // Generate comprehensive knowledge base entries
  const entries = generateKnowledgeBaseEntries(knowledgeData, knowledgeBaseId, userId);

  // Insert all entries
  const { error: entriesError } = await supabase
    .from('knowledge_base_entries')
    .insert(entries);

  if (entriesError) {
    console.error('Error creating knowledge base entries:', entriesError);
    throw entriesError;
  }

  return knowledgeBaseId;
};

const generateKnowledgeBaseEntries = (
  data: ListingKnowledgeData,
  knowledgeBaseId: string,
  userId: string
): KnowledgeBaseEntry[] => {
  const entries: KnowledgeBaseEntry[] = [];

  // 1. Property Overview
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Property Overview',
    content: generatePropertyOverview(data),
    created_by: userId
  });

  // 2. Property Features
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Property Features & Amenities',
    content: generateFeaturesContent(data),
    created_by: userId
  });

  // 3. Financial Information
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Financial & Market Information',
    content: generateFinancialContent(data),
    created_by: userId
  });

  // 4. Neighborhood Information
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Neighborhood & Location',
    content: generateNeighborhoodContent(data),
    created_by: userId
  });

  // 5. Property History
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Property History & Condition',
    content: generateHistoryContent(data),
    created_by: userId
  });

  // 6. Showing Information
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Showing Instructions & Availability',
    content: generateShowingContent(data),
    created_by: userId
  });

  // 7. Contact Information
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'note',
    title: 'Agent Contact Information',
    content: generateContactContent(data),
    created_by: userId
  });

  // 8. Frequently Asked Questions
  entries.push({
    knowledge_base_id: knowledgeBaseId,
    entry_type: 'faq',
    title: 'Frequently Asked Questions',
    content: generateFAQContent(data),
    created_by: userId
  });

  return entries;
};

const generatePropertyOverview = (data: ListingKnowledgeData): string => {
  return `
PROPERTY OVERVIEW

Address: ${data.address}
Price: ${data.price}
Property Type: ${data.propertyType}
Bedrooms: ${data.bedrooms}
Bathrooms: ${data.bathrooms}
Square Footage: ${data.squareFootage}
Lot Size: ${data.lotSize}
Year Built: ${data.yearBuilt}

Description: ${data.description}

Key Selling Points:
${data.keySellingPoints.map(point => `• ${point}`).join('\n')}

Unique Features:
${data.uniqueFeatures.map(feature => `• ${feature}`).join('\n')}

Recent Updates:
${data.recentUpdates.map(update => `• ${update}`).join('\n')}
  `.trim();
};

const generateFeaturesContent = (data: ListingKnowledgeData): string => {
  return `
PROPERTY FEATURES & AMENITIES

Interior Features:
${data.interiorFeatures.map(feature => `• ${feature}`).join('\n')}

Exterior Features:
${data.exteriorFeatures.map(feature => `• ${feature}`).join('\n')}

Utilities & Systems:
${data.utilities.map(utility => `• ${utility}`).join('\n')}

Parking & Access:
${data.parking.map(parking => `• ${parking}`).join('\n')}

Investment Highlights:
${data.investmentHighlights.map(highlight => `• ${highlight}`).join('\n')}
  `.trim();
};

const generateFinancialContent = (data: ListingKnowledgeData): string => {
  return `
FINANCIAL & MARKET INFORMATION

Current Price: ${data.price}
Original Purchase Price: ${data.originalPrice}
Days on Market: ${data.daysOnMarket}
Monthly Rental Potential: ${data.rentalPotential}
Annual Property Taxes: ${data.annualTaxes}
HOA Fees (Monthly): ${data.hoaFees}

Price History:
${data.priceHistory.map(entry => `• ${entry.date}: $${entry.price}`).join('\n')}

HOA Rules & Restrictions:
${data.hoaRules}
  `.trim();
};

const generateNeighborhoodContent = (data: ListingKnowledgeData): string => {
  return `
NEIGHBORHOOD & LOCATION

School District: ${data.schoolDistrict}
School Ratings: ${data.schoolRatings}
Crime Rating: ${data.crimeRating}

Transportation & Access:
${data.transportation.map(item => `• ${item}`).join('\n')}

Local Amenities:
${data.localAmenities.map(amenity => `• ${amenity}`).join('\n')}
  `.trim();
};

const generateHistoryContent = (data: ListingKnowledgeData): string => {
  return `
PROPERTY HISTORY & CONDITION

Last Renovated: ${data.lastRenovated}
Property Condition: ${data.propertyCondition}
Year Built: ${data.yearBuilt}

Property Timeline:
• Built in ${data.yearBuilt}
• Last renovated in ${data.lastRenovated}
• Current condition: ${data.propertyCondition}
  `.trim();
};

const generateShowingContent = (data: ListingKnowledgeData): string => {
  return `
SHOWING INSTRUCTIONS & AVAILABILITY

Showing Instructions:
${data.showingInstructions}

Available Times:
${data.availableTimes.map(time => `• ${time}`).join('\n')}

Special Requirements:
${data.specialRequirements}

Preferred Contact Method: ${data.preferredContact}
Response Time: ${data.responseTime}
  `.trim();
};

const generateContactContent = (data: ListingKnowledgeData): string => {
  return `
AGENT CONTACT INFORMATION

Name: ${data.contactName}
Company: ${data.contactCompany}
Phone: ${data.contactPhone}
Email: ${data.contactEmail}
Website: ${data.contactWebsite}

Bio: ${data.contactBio}

Languages Spoken:
${data.languagesSpoken.map(language => `• ${language}`).join('\n')}
  `.trim();
};

const generateFAQContent = (data: ListingKnowledgeData): string => {
  return `
FREQUENTLY ASKED QUESTIONS

Q: What is the current price of this property?
A: The current asking price is ${data.price}.

Q: How many bedrooms and bathrooms does this property have?
A: This property has ${data.bedrooms} bedrooms and ${data.bathrooms} bathrooms.

Q: What is the square footage?
A: The property is ${data.squareFootage} square feet.

Q: What are the HOA fees?
A: The monthly HOA fees are ${data.hoaFees}.

Q: What are the annual property taxes?
A: The annual property taxes are ${data.annualTaxes}.

Q: When was the property last renovated?
A: The property was last renovated in ${data.lastRenovated}.

Q: What is the property condition?
A: The property is in ${data.propertyCondition} condition.

Q: What school district is this property in?
A: This property is in the ${data.schoolDistrict} school district.

Q: How can I schedule a showing?
A: ${data.showingInstructions}

Q: What is the preferred contact method?
A: The preferred contact method is ${data.preferredContact} and the agent typically responds ${data.responseTime}.

Q: What are the key selling points of this property?
A: The key selling points include: ${data.keySellingPoints.join(', ')}.

Q: What unique features does this property have?
A: Unique features include: ${data.uniqueFeatures.join(', ')}.

Q: What recent updates have been made to the property?
A: Recent updates include: ${data.recentUpdates.join(', ')}.

Q: What is the rental potential for this property?
A: The estimated monthly rental potential is ${data.rentalPotential}.

Q: What transportation options are available nearby?
A: Nearby transportation options include: ${data.transportation.join(', ')}.

Q: What amenities are available in the neighborhood?
A: Local amenities include: ${data.localAmenities.join(', ')}.
  `.trim();
};

export const getKnowledgeBaseForListing = async (listingId: string): Promise<KnowledgeBaseEntry[]> => {
  const { data: knowledgeBase, error: kbError } = await supabase
    .from('knowledge_bases')
    .select('id')
    .eq('listing_id', listingId)
    .eq('type', 'listing')
    .single();

  if (kbError || !knowledgeBase) {
    return [];
  }

  const { data: entries, error: entriesError } = await supabase
    .from('knowledge_base_entries')
    .select('*')
    .eq('knowledge_base_id', knowledgeBase.id)
    .eq('is_current', true)
    .order('created_at', { ascending: true });

  if (entriesError) {
    console.error('Error fetching knowledge base entries:', entriesError);
    return [];
  }

  return entries || [];
};

export const updateKnowledgeBaseForListing = async (
  listingId: string,
  knowledgeData: ListingKnowledgeData,
  userId: string
): Promise<void> => {
  // Get existing knowledge base
  const { data: knowledgeBase, error: kbError } = await supabase
    .from('knowledge_bases')
    .select('id')
    .eq('listing_id', listingId)
    .eq('type', 'listing')
    .single();

  if (kbError || !knowledgeBase) {
    // Create new knowledge base if it doesn't exist
    await createKnowledgeBaseForListing(listingId, knowledgeData, userId);
    return;
  }

  // Mark existing entries as not current
  await supabase
    .from('knowledge_base_entries')
    .update({ is_current: false })
    .eq('knowledge_base_id', knowledgeBase.id);

  // Create new entries
  const entries = generateKnowledgeBaseEntries(knowledgeData, knowledgeBase.id, userId);
  
  await supabase
    .from('knowledge_base_entries')
    .insert(entries);
};

// Create a knowledge base (listing, agent, or global)
export async function createKnowledgeBase({ type, agent_id, listing_id, title, personality, created_by }: {
  type: string;
  agent_id?: string;
  listing_id?: string;
  title: string;
  personality?: string;
  created_by: string;
}) {
  return supabase
    .from('knowledge_bases')
    .insert([
      { type, agent_id, listing_id, title, personality, created_by }
    ]);
}

// Get all KBs for an agent (agent-level only)
export async function getKnowledgeBasesByAgent(agent_id: string) {
  return supabase
    .from('knowledge_bases')
    .select('*')
    .eq('agent_id', agent_id)
    .is('listing_id', null);
}

// Get all KBs for a listing
export async function getKnowledgeBasesByListing(listing_id: string) {
  return supabase
    .from('knowledge_bases')
    .select('*')
    .eq('listing_id', listing_id);
}

// Get all global KBs
export async function getGlobalKnowledgeBases() {
  return supabase
    .from('knowledge_bases')
    .select('*')
    .eq('type', 'global');
}

// Update KB personality
export async function updateKnowledgeBasePersonality(kb_id: string, personality: string) {
  return supabase
    .from('knowledge_bases')
    .update({ personality })
    .eq('id', kb_id);
}

/**
 * Upload a document to the correct knowledge base by brain type.
 */
export async function uploadDocumentToKnowledgeBase({ brain, file, userId }: { brain: string, file: File, userId: string }) {
  // Find or create the knowledge base for this brain
  const { data: kb, error: kbError } = await supabase
    .from('knowledge_bases')
    .select('*')
    .eq('type', 'brain')
    .eq('personality', brain)
    .eq('created_by', userId)
    .single();

  let knowledgeBaseId = kb?.id;
  if (!knowledgeBaseId) {
    // Create it if it doesn't exist
    const { data: newKb, error: createError } = await supabase
      .from('knowledge_bases')
      .insert([{ type: 'brain', personality: brain, title: `${brain.charAt(0).toUpperCase() + brain.slice(1)} Knowledge Base`, created_by: userId }])
      .select()
      .single();
    if (createError) throw createError;
    knowledgeBaseId = newKb.id;
  }

  // Upload file to Supabase Storage
  const filePath = `${brain}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('knowledge-base-files')
    .upload(filePath, file);
  if (uploadError) throw uploadError;
  const { data: urlData } = supabase.storage.from('knowledge-base-files').getPublicUrl(filePath);

  // Insert entry in knowledge_base_entries
  const { error: entryError } = await supabase
    .from('knowledge_base_entries')
    .insert([{
      knowledge_base_id: knowledgeBaseId,
      entry_type: 'file',
      title: file.name,
      file_url: urlData.publicUrl,
      created_by: userId,
      is_current: true,
      version: 1
    }]);
  if (entryError) throw entryError;
}

/**
 * Scrape a URL and add the result to the correct knowledge base by brain type.
 */
export async function scrapeUrlToKnowledgeBase({ brain, url, userId }: { brain: string, url: string, userId: string }) {
  // Find or create the knowledge base for this brain
  const { data: kb, error: kbError } = await supabase
    .from('knowledge_bases')
    .select('*')
    .eq('type', 'brain')
    .eq('personality', brain)
    .eq('created_by', userId)
    .single();

  let knowledgeBaseId = kb?.id;
  if (!knowledgeBaseId) {
    // Create it if it doesn't exist
    const { data: newKb, error: createError } = await supabase
      .from('knowledge_bases')
      .insert([{ type: 'brain', personality: brain, title: `${brain.charAt(0).toUpperCase() + brain.slice(1)} Knowledge Base`, created_by: userId }])
      .select()
      .single();
    if (createError) throw createError;
    knowledgeBaseId = newKb.id;
  }

  // Call your scraper API (replace with your actual endpoint)
  const response = await fetch('/api/scrape-url-to-kb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, knowledgeBaseId, userId })
  });
  if (!response.ok) throw new Error('Scrape API failed');
  // Optionally: refresh entries after scrape
}

class KnowledgeBaseService {
  private listingsFolder = 'knowledge-base/listings';
  private agentsFolder = 'knowledge-base/agents';
  private structureFile = 'knowledge-base/structure.json';

  constructor() {
    this.initializeFolders();
  }

  private initializeFolders() {
    // In a real implementation, this would create actual folders
    // For now, we'll manage this in memory and localStorage
    console.log('Initializing knowledge base folders...');
  }

  // Scrape and categorize URLs
  async processUrl(url: string): Promise<{ type: 'listing' | 'agent'; data: any }> {
    try {
      // Determine URL type
      const urlType = this.categorizeUrl(url);
      
      if (urlType === 'listing') {
        const propertyData = await this.scrapePropertyListing(url);
        return { type: 'listing', data: propertyData };
      } else {
        const agentData = await this.scrapeAgentProfile(url);
        return { type: 'agent', data: agentData };
      }
    } catch (error) {
      console.error('Error processing URL:', error);
      throw error;
    }
  }

  // Categorize URLs based on patterns
  private categorizeUrl(url: string): 'listing' | 'agent' {
    const listingPatterns = [
      'zillow.com/homedetails',
      'realtor.com/realestateandhomes-detail',
      'redfin.com/home',
      'trulia.com/property',
      'homes.com/property',
      'realtor.ca/property',
      'rightmove.co.uk/property',
      'zoopla.co.uk/property'
    ];

    const agentPatterns = [
      'zillow.com/profile',
      'realtor.com/realestateagent',
      'redfin.com/agent',
      'trulia.com/agent',
      'homes.com/agent',
      'realtor.ca/agent',
      'rightmove.co.uk/agent',
      'zoopla.co.uk/agent',
      'linkedin.com/in',
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'agentwebsite.com',
      'realestate.com/agent'
    ];

    const lowerUrl = url.toLowerCase();
    
    // Check for listing patterns
    if (listingPatterns.some(pattern => lowerUrl.includes(pattern))) {
      return 'listing';
    }
    
    // Check for agent patterns
    if (agentPatterns.some(pattern => lowerUrl.includes(pattern))) {
      return 'agent';
    }

    // Default to agent if it's a personal website or social media
    if (lowerUrl.includes('profile') || lowerUrl.includes('about') || 
        lowerUrl.includes('team') || lowerUrl.includes('agent')) {
      return 'agent';
    }

    // Default to listing for real estate domains
    if (lowerUrl.includes('realestate') || lowerUrl.includes('property') || 
        lowerUrl.includes('home') || lowerUrl.includes('house')) {
      return 'listing';
    }

    return 'agent'; // Default fallback
  }

  // Scrape property listing
  private async scrapePropertyListing(url: string): Promise<ScrapedPropertyData> {
    if (url.includes('zillow.com')) {
      return await scrapingService.scrapeZillowProperty(url);
    } else if (url.includes('realtor.com')) {
      return await scrapingService.scrapeRealtorProperty(url);
    } else {
      // Generic property scraping
      return await this.scrapeGenericProperty(url);
    }
  }

  // Scrape agent profile
  private async scrapeAgentProfile(url: string): Promise<AgentData> {
    if (url.includes('zillow.com/profile')) {
      return await this.scrapeZillowAgent(url);
    } else if (url.includes('realtor.com/realestateagent')) {
      return await this.scrapeRealtorAgent(url);
    } else if (url.includes('linkedin.com/in')) {
      return await this.scrapeLinkedInProfile(url);
    } else {
      // Generic agent scraping
      return await this.scrapeGenericAgent(url);
    }
  }

  // Generic property scraping
  private async scrapeGenericProperty(url: string): Promise<ScrapedPropertyData> {
    try {
      const html = await scrapingService['fetchWithRetry'](url);
      const $ = require('cheerio').load(html);

      // Generic selectors for property data
      const address = $('[class*="address"], [class*="title"], h1').first().text().trim();
      const price = $('[class*="price"], [class*="cost"]').first().text().trim();
      const description = $('[class*="description"], [class*="summary"], p').first().text().trim();

      return {
        address: address || 'Address not found',
        price: price || 'Price not available',
        description: description || 'No description available',
        features: [],
        neighborhood: 'Unknown',
        images: [],
        listingUrl: url,
        scrapedAt: new Date()
      };
    } catch (error) {
      console.error('Generic property scraping failed:', error);
      return this.getMockPropertyData(url);
    }
  }

  // Generic agent scraping
  private async scrapeGenericAgent(url: string): Promise<AgentData> {
    try {
      const html = await scrapingService['fetchWithRetry'](url);
      const $ = require('cheerio').load(html);

      // Generic selectors for agent data
      const name = $('h1, [class*="name"], [class*="title"]').first().text().trim();
      const bio = $('[class*="bio"], [class*="about"], [class*="description"]').first().text().trim();
      const company = $('[class*="company"], [class*="agency"]').first().text().trim();

      return {
        name: name || 'Agent Name Not Found',
        company: company || 'Company Not Listed',
        bio: bio || 'No bio available',
        specialties: [],
        profileUrl: url,
        scrapedAt: new Date()
      };
    } catch (error) {
      console.error('Generic agent scraping failed:', error);
      return this.getMockAgentData(url);
    }
  }

  // Zillow agent scraping
  private async scrapeZillowAgent(url: string): Promise<AgentData> {
    try {
      const html = await scrapingService['fetchWithRetry'](url);
      const $ = require('cheerio').load(html);

      const name = $('[data-testid="agent-name"]').text().trim();
      const company = $('[data-testid="agent-company"]').text().trim();
      const bio = $('[data-testid="agent-bio"]').text().trim();

      return {
        name: name || 'Zillow Agent',
        company: company || 'Zillow',
        bio: bio || 'Professional real estate agent',
        specialties: ['Residential', 'Buyer Representation', 'Seller Representation'],
        profileUrl: url,
        scrapedAt: new Date()
      };
    } catch (error) {
      console.error('Zillow agent scraping failed:', error);
      return this.getMockAgentData(url);
    }
  }

  // Realtor.com agent scraping
  private async scrapeRealtorAgent(url: string): Promise<AgentData> {
    try {
      const html = await scrapingService['fetchWithRetry'](url);
      const $ = require('cheerio').load(html);

      const name = $('.agent-name').text().trim();
      const company = $('.agent-company').text().trim();
      const bio = $('.agent-bio').text().trim();

      return {
        name: name || 'Realtor Agent',
        company: company || 'Realtor.com',
        bio: bio || 'Experienced real estate professional',
        specialties: ['Residential', 'Commercial', 'Investment'],
        profileUrl: url,
        scrapedAt: new Date()
      };
    } catch (error) {
      console.error('Realtor.com agent scraping failed:', error);
      return this.getMockAgentData(url);
    }
  }

  // LinkedIn profile scraping
  private async scrapeLinkedInProfile(url: string): Promise<AgentData> {
    try {
      const html = await scrapingService['fetchWithRetry'](url);
      const $ = require('cheerio').load(html);

      const name = $('h1').text().trim();
      const title = $('[class*="title"], [class*="headline"]').text().trim();
      const company = $('[class*="company"], [class*="organization"]').text().trim();

      return {
        name: name || 'LinkedIn Professional',
        title: title || 'Real Estate Professional',
        company: company || 'Real Estate',
        bio: 'Professional real estate agent with LinkedIn presence',
        specialties: ['Real Estate', 'Property Management'],
        profileUrl: url,
        scrapedAt: new Date()
      };
    } catch (error) {
      console.error('LinkedIn profile scraping failed:', error);
      return this.getMockAgentData(url);
    }
  }

  // Mock data generators
  private getMockPropertyData(url: string): ScrapedPropertyData {
    return {
      address: `Sample Property from ${new URL(url).hostname}`,
      price: '$450,000',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      description: 'Beautiful sample property with modern amenities and great location.',
      features: ['Modern kitchen', 'Hardwood floors', 'Large backyard', 'Garage'],
      neighborhood: 'Sample Neighborhood',
      images: [],
      listingUrl: url,
      scrapedAt: new Date()
    };
  }

  private getMockAgentData(url: string): AgentData {
    const hostname = new URL(url).hostname;
    return {
      name: `Sample Agent from ${hostname}`,
      company: 'Sample Real Estate Company',
      title: 'Licensed Real Estate Agent',
      bio: 'Experienced real estate professional with expertise in residential and commercial properties.',
      specialties: ['Residential Sales', 'Buyer Representation', 'Seller Representation'],
      experience: '5+ years',
      certifications: ['Licensed Real Estate Agent', 'Certified Residential Specialist'],
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'agent@sample.com'
      },
      areas: ['Sample City', 'Sample County'],
      languages: ['English', 'Spanish'],
      profileUrl: url,
      scrapedAt: new Date()
    };
  }

  // Add data to knowledge base
  async addToListings(propertyData: ScrapedPropertyData): Promise<void> {
    const listings = this.getListings();
    listings.push(propertyData);
    this.saveListings(listings);
  }

  async addToAgents(agentData: AgentData): Promise<void> {
    const agents = this.getAgents();
    agents.push(agentData);
    this.saveAgents(agents);
  }

  // Get data from knowledge base
  getListings(): ScrapedPropertyData[] {
    try {
      const stored = localStorage.getItem('knowledgeBase_listings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getAgents(): AgentData[] {
    try {
      const stored = localStorage.getItem('knowledgeBase_agents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save data to storage
  private saveListings(listings: ScrapedPropertyData[]): void {
    localStorage.setItem('knowledgeBase_listings', JSON.stringify(listings));
  }

  private saveAgents(agents: AgentData[]): void {
    localStorage.setItem('knowledgeBase_agents', JSON.stringify(agents));
  }

  // Generate knowledge base content
  generateListingsKnowledgeBase(): string {
    const listings = this.getListings();
    return scrapingService.exportToKnowledgeBase(listings);
  }

  generateAgentsKnowledgeBase(): string {
    const agents = this.getAgents();
    let knowledgeBase = '# Real Estate Agents Knowledge Base\n\n';
    
    agents.forEach((agent, index) => {
      knowledgeBase += `## Agent ${index + 1}: ${agent.name}\n\n`;
      if (agent.company) knowledgeBase += `**Company:** ${agent.company}\n`;
      if (agent.title) knowledgeBase += `**Title:** ${agent.title}\n`;
      if (agent.bio) knowledgeBase += `**Bio:** ${agent.bio}\n\n`;
      
      if (agent.specialties && agent.specialties.length > 0) {
        knowledgeBase += `**Specialties:**\n`;
        agent.specialties.forEach(specialty => {
          knowledgeBase += `- ${specialty}\n`;
        });
        knowledgeBase += '\n';
      }
      
      if (agent.experience) knowledgeBase += `**Experience:** ${agent.experience}\n`;
      if (agent.areas && agent.areas.length > 0) {
        knowledgeBase += `**Service Areas:** ${agent.areas.join(', ')}\n`;
      }
      
      knowledgeBase += `**Profile:** ${agent.profileUrl}\n`;
      knowledgeBase += `**Added:** ${agent.scrapedAt.toISOString()}\n\n`;
      knowledgeBase += '---\n\n';
    });
    
    return knowledgeBase;
  }

  // Generate combined knowledge base
  generateCombinedKnowledgeBase(): string {
    const listingsKB = this.generateListingsKnowledgeBase();
    const agentsKB = this.generateAgentsKnowledgeBase();
    
    return `# HomeListingAI Complete Knowledge Base\n\n${listingsKB}\n${agentsKB}`;
  }

  // Get knowledge base structure
  getKnowledgeBaseStructure(): KnowledgeBaseStructure {
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

  // Clear knowledge base
  clearKnowledgeBase(): void {
    localStorage.removeItem('knowledgeBase_listings');
    localStorage.removeItem('knowledgeBase_agents');
  }

  // Search knowledge base
  searchKnowledgeBase(query: string): { listings: ScrapedPropertyData[], agents: AgentData[] } {
    const listings = this.getListings();
    const agents = this.getAgents();
    const lowerQuery = query.toLowerCase();
    
    const matchingListings = listings.filter(listing => 
      listing.address.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery) ||
      listing.neighborhood.toLowerCase().includes(lowerQuery)
    );
    
    const matchingAgents = agents.filter(agent => 
      agent.name.toLowerCase().includes(lowerQuery) ||
      agent.company?.toLowerCase().includes(lowerQuery) ||
      agent.bio?.toLowerCase().includes(lowerQuery) ||
      agent.specialties?.some(s => s.toLowerCase().includes(lowerQuery))
    );
    
    return { listings: matchingListings, agents: matchingAgents };
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService; 