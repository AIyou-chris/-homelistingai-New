import { supabase } from '../lib/supabase';

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