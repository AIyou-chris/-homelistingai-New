// Deno-compatible property scraping logic for Supabase Edge Functions
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

export interface ScrapedPropertyData {
  address: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description: string;
  features: string[];
  neighborhood: string;
  images: string[];
  listingUrl: string;
  scrapedAt: string;
}

// ScraperAPI configuration
const SCRAPER_API_KEY = Deno.env.get('SCRAPER_API_KEY');
const SCRAPER_API_URL = 'https://api.scraperapi.com';

if (!SCRAPER_API_KEY) {
  throw new Error('SCRAPER_API_KEY environment variable is not set');
}

export async function scrapeProperty(url: string): Promise<ScrapedPropertyData> {
  if (url.includes('zillow.com')) {
    const html = await scrapeWithScraperAPI(url);
    return parseZillowHtml(html, url);
  } else if (url.includes('realtor.com')) {
    const html = await scrapeWithScraperAPI(url);
    return parseRealtorHtml(html, url);
  } else if (url.includes('redfin.com')) {
    const html = await scrapeWithScraperAPI(url);
    return parseRedfinHtml(html, url);
  } else {
    const html = await scrapeWithScraperAPI(url);
    return parseGenericHtml(html, url);
  }
}

async function scrapeWithScraperAPI(url: string): Promise<string> {
  // Use ultra_premium for Zillow, premium for others
  let extraParams = '';
  if (url.includes('zillow.com')) {
    extraParams = '&ultra_premium=true';
  } else {
    extraParams = '&premium=true';
  }
  const scraperUrl = `${SCRAPER_API_URL}?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}&render=true&country_code=us${extraParams}&session_number=1`;
  
  console.log('ScraperAPI URL (without key):', `${SCRAPER_API_URL}?api_key=***&url=${encodeURIComponent(url)}&render=true&country_code=us${extraParams}&session_number=1`);
  console.log('ScraperAPI key length:', SCRAPER_API_KEY?.length || 0);
  
  const res = await fetch(scraperUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ScraperAPI failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return await res.text();
}

export async function scrapeZillowProperty(url: string): Promise<ScrapedPropertyData> {
  try {
    console.log('Starting Zillow property scraping for:', url);
    
    const html = await scrapeWithScraperAPI(url);
    console.log('Zillow HTML fetched, length:', html.length);
    
    return parseZillowHtml(html, url);
  } catch (error) {
    console.error('Error scraping Zillow property:', error);
    throw new Error('Failed to scrape Zillow property');
  }
}

export async function scrapeRealtorProperty(url: string): Promise<ScrapedPropertyData> {
  try {
    console.log('Starting Realtor.com property scraping for:', url);
    
    const html = await scrapeWithScraperAPI(url);
    console.log('Realtor.com HTML fetched, length:', html.length);
    
    return parseRealtorHtml(html, url);
  } catch (error) {
    console.error('Error scraping Realtor.com property:', error);
    throw new Error('Failed to scrape Realtor.com property');
  }
}

export async function scrapeRedfinProperty(url: string): Promise<ScrapedPropertyData> {
  try {
    console.log('Starting Redfin property scraping for:', url);
    
    const html = await scrapeWithScraperAPI(url);
    console.log('Redfin HTML fetched, length:', html.length);
    
    return parseRedfinHtml(html, url);
  } catch (error) {
    console.error('Error scraping Redfin property:', error);
    throw new Error('Failed to scrape Redfin property');
  }
}

export async function scrapeGenericProperty(url: string): Promise<ScrapedPropertyData> {
  try {
    console.log('Starting generic property scraping for:', url);
    
    const html = await scrapeWithScraperAPI(url);
    console.log('Generic HTML fetched, length:', html.length);
    
    return parseGenericHtml(html, url);
  } catch (error) {
    console.error('Error scraping generic property:', error);
    throw new Error('Failed to scrape generic property');
  }
}

function deepFind(obj: unknown, keys: string[]): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const key of keys) {
    if (obj[key as keyof typeof obj] !== undefined && obj[key as keyof typeof obj] !== null && obj[key as keyof typeof obj] !== '') return obj[key as keyof typeof obj];
  }
  for (const k in obj) {
    if (typeof obj[k as keyof typeof obj] === 'object') {
      const found = deepFind(obj[k as keyof typeof obj], keys);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

// Enhanced function to search for patterns in text content
function searchTextForPatterns(text: string): { bedrooms?: number; bathrooms?: number; squareFeet?: number } {
  const result: { bedrooms?: number; bathrooms?: number; squareFeet?: number } = {};
  
  if (!text) return result;
  
  // Bedroom patterns
  const bedPatterns = [
    /(\d+)\s*bedroom/i,
    /(\d+)\s*bed/i,
    /(\d+)\s*br/i,
    /bedrooms?:\s*(\d+)/i,
    /beds?:\s*(\d+)/i
  ];
  
  // Bathroom patterns
  const bathPatterns = [
    /(\d+(?:\.\d+)?)\s*bathroom/i,
    /(\d+(?:\.\d+)?)\s*bath/i,
    /(\d+(?:\.\d+)?)\s*ba/i,
    /bathrooms?:\s*(\d+(?:\.\d+)?)/i,
    /baths?:\s*(\d+(?:\.\d+)?)/i
  ];
  
  // Square footage patterns
  const sqftPatterns = [
    /(\d{1,3}(?:,\d{3})*)\s*sq\s*ft/i,
    /(\d{1,3}(?:,\d{3})*)\s*square\s*feet/i,
    /(\d{1,3}(?:,\d{3})*)\s*sqft/i,
    /(\d{1,3}(?:,\d{3})*)\s*ft²/i,
    /square\s*footage:\s*(\d{1,3}(?:,\d{3})*)/i
  ];
  
  for (const pattern of bedPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.bedrooms = parseInt(match[1]);
      break;
    }
  }
  
  for (const pattern of bathPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.bathrooms = parseFloat(match[1]);
      break;
    }
  }
  
  for (const pattern of sqftPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.squareFeet = parseInt(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  return result;
}

// Helper to sync knowledge to the AI brain
async function syncKnowledgeBrain(listing: ScrapedPropertyData) {
  const AI_KB_SYNC_ENDPOINT = Deno.env.get('AI_KB_SYNC_ENDPOINT') || 'https://your-ai-brain-endpoint/sync';
  // Combine all relevant fields into a single string
  const combinedText = `
Address: ${listing.address}
Price: ${listing.price}
Bedrooms: ${listing.bedrooms}
Bathrooms: ${listing.bathrooms}
Square Feet: ${listing.squareFeet}
Neighborhood: ${listing.neighborhood}
Features: ${(listing.features || []).join(', ')}
Description: ${listing.description}
Images: ${(listing.images || []).join(', ')}
Listing URL: ${listing.listingUrl}
Scraped At: ${listing.scrapedAt}
`;
  // POST to the AI knowledge sync endpoint
  await fetch(AI_KB_SYNC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId: listing.listingUrl, // or another unique ID
      text: combinedText
    })
  });
}

function parseRedfinHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Extract address from Redfin's specific selectors
  const address = $('[data-testid="home-details-summary-address"]').text().trim() ||
                 $('.home-details-summary-address').text().trim() ||
                 $('.address').text().trim() ||
                 $('h1').first().text().trim() ||
                 'Address not found';

  // Extract price from Redfin's price elements
  const price = $('[data-testid="price"]').text().trim() ||
                $('.price').text().trim() ||
                $('.home-details-summary-price').text().trim() ||
                'Price not available';

  // Extract property details
  const detailsText = $('.home-details-summary').text() || $('.property-details').text();
  const bedrooms = extractNumber(detailsText, /(\d+)\s*bed/i) || 0;
  const bathrooms = extractNumber(detailsText, /(\d+(?:\.\d+)?)\s*bath/i) || 0;
  const squareFeet = extractNumber(detailsText, /(\d+)\s*sq\s*ft/i) || 0;

  // Extract description
  const description = $('[data-testid="home-description"]').text().trim() ||
                     $('.home-description').text().trim() ||
                     $('.description').text().trim() ||
                     'No description available';

  // Extract features
  const features: string[] = [];
  $('.feature-item, .amenity-item, [data-testid="feature"]').each((_, el) => {
    const feature = $(el).text().trim();
    if (feature) features.push(feature);
  });

  // Extract images
  const images: string[] = [];
  $('img[src*="redfin"], img[data-src*="redfin"]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.includes('placeholder')) {
      images.push(src);
    }
  });

  // Extract neighborhood
  const neighborhood = $('[data-testid="neighborhood"]').text().trim() ||
                      $('.neighborhood').text().trim() ||
                      'Neighborhood not specified';

  const result = {
    address,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    description,
    features,
    neighborhood,
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };

  // Sync to knowledge brain (fire and forget)
  syncKnowledgeBrain(result).catch(() => {
    // intentionally ignored
  });
  return result;
}

function parseRealtorHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Extract address from Realtor.com's specific selectors
  const address = $('[data-testid="address"]').text().trim() ||
                 $('.address').text().trim() ||
                 $('h1').first().text().trim() ||
                 'Address not found';

  // Extract price from Realtor.com's price elements
  const price = $('[data-testid="price"]').text().trim() ||
                $('.price').text().trim() ||
                $('.property-price').text().trim() ||
                'Price not available';

  // Extract property details
  const detailsText = $('.property-details').text() || $('.home-details').text();
  const bedrooms = extractNumber(detailsText, /(\d+)\s*bed/i) || 0;
  const bathrooms = extractNumber(detailsText, /(\d+(?:\.\d+)?)\s*bath/i) || 0;
  const squareFeet = extractNumber(detailsText, /(\d+)\s*sq\s*ft/i) || 0;

  // Extract description
  const description = $('[data-testid="description"]').text().trim() ||
                     $('.description').text().trim() ||
                     $('.property-description').text().trim() ||
                     'No description available';

  // Extract features
  const features: string[] = [];
  $('.feature-item, .amenity-item, [data-testid="feature"]').each((_, el) => {
    const feature = $(el).text().trim();
    if (feature) features.push(feature);
  });

  // Extract images
  const images: string[] = [];
  $('img[src*="realtor"], img[data-src*="realtor"]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.includes('placeholder')) {
      images.push(src);
    }
  });

  // Extract neighborhood
  const neighborhood = $('[data-testid="neighborhood"]').text().trim() ||
                      $('.neighborhood').text().trim() ||
                      'Neighborhood not specified';

  const result = {
    address,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    description,
    features,
    neighborhood,
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };

  // Sync to knowledge brain (fire and forget)
  syncKnowledgeBrain(result).catch(() => {
    // intentionally ignored
  });
  return result;
}

function parseGenericHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Generic selectors that work across multiple sites
  const address = $('[class*="address"], [class*="title"], h1').first().text().trim() ||
                 $('.address, .title, .property-title').first().text().trim() ||
                 'Address not found';

  const price = $('[class*="price"], [class*="cost"]').first().text().trim() ||
                $('.price, .cost, .property-price').first().text().trim() ||
                'Price not available';

  const description = $('[class*="description"], [class*="summary"], p').first().text().trim() ||
                     $('.description, .summary, .property-description').first().text().trim() ||
                     'No description available';

  // Extract property details from text patterns
  const pageText = $.text();
  const bedrooms = extractNumber(pageText, /(\d+)\s*bed/i) || 0;
  const bathrooms = extractNumber(pageText, /(\d+(?:\.\d+)?)\s*bath/i) || 0;
  const squareFeet = extractNumber(pageText, /(\d+)\s*sq\s*ft/i) || 0;

  // Extract features
  const features: string[] = [];
  $('.feature, .amenity, [class*="feature"], [class*="amenity"]').each((_, el) => {
    const feature = $(el).text().trim();
    if (feature) features.push(feature);
  });

  // Extract images
  const images: string[] = [];
  $('img[src], img[data-src]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.includes('placeholder') && !src.includes('logo')) {
      images.push(src);
    }
  });

  const result = {
    address,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    description,
    features,
    neighborhood: 'Unknown',
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };

  // Sync to knowledge brain (fire and forget)
  syncKnowledgeBrain(result).catch(() => {
    // intentionally ignored
  });
  return result;
}

function extractNumber(text: string, pattern: RegExp): number | undefined {
  const match = text.match(pattern);
  return match ? parseInt(match[1].replace(/,/g, '')) : undefined;
}

function parseZillowHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);

  // --- Extract "What's special" section (do this first so it's available everywhere) ---
  let specialTags: string[] = [];
  let specialDescription = '';
  const whatsSpecialHeader = $("h2, h3, h4").filter((_, el) => $(el).text().toLowerCase().includes("what's special"));
  if (whatsSpecialHeader.length) {
    const specialSection = whatsSpecialHeader.parent();
    // Tags: look for buttons, spans, or divs with short text
    specialTags = specialSection.find("button, span, div")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(t => t && t.length < 40 && t.length > 2);
    // Description: look for a <div> or <p> with a decent amount of text
    specialDescription = specialSection.find("div, p")
      .map((_, el) => $(el).text().trim())
      .get()
      .find(t => t.length > 60) || '';
  }

  // Aggressively parse all ld+json blocks and any JSON-like content
  let bestJson: unknown = null;
  let bestScore = 0;
  let debugJson: unknown = null;
  const allJsonData: unknown[] = [];

  // Parse all ld+json scripts
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const text = $(el).html();
      if (text) {
        const parsed = JSON.parse(text);
        allJsonData.push(parsed);
        debugJson = debugJson || parsed;
        
        // Enhanced scoring system
        let score = 0;
        if (deepFind(parsed, ['address', 'streetAddress', 'addressLocality'])) score += 2;
        if (deepFind(parsed, ['offers', 'price', 'price', 'listPrice'])) score += 2;
        if (deepFind(parsed, ['numberOfRooms', 'numberOfBedrooms', 'bedrooms', 'bedroomCount'])) score += 2;
        if (deepFind(parsed, ['numberOfBathroomsTotal', 'numberOfBathrooms', 'bathrooms', 'bathroomCount'])) score += 2;
        if (deepFind(parsed, ['floorSize', 'area', 'livingArea', 'sqft', 'squareFootage'])) score += 2;
        if (deepFind(parsed, ['description', 'description', 'summary'])) score += 1;
        if (deepFind(parsed, ['image', 'images', 'photo', 'photos'])) score += 1;
        if (deepFind(parsed, ['amenityFeature', 'features', 'amenities'])) score += 1;
        
        if (score > bestScore) {
          bestScore = score;
          bestJson = parsed;
        }
      }
    } catch (_e) {
      // intentionally ignored
    }
  });

  // Parse all script tags that might contain JSON data
  $('script').each((_, el) => {
    const text = $(el).html();
    if (text && text.includes('{') && text.includes('}')) {
      // Look for JSON patterns in script content
      const jsonMatches = text.match(/\{[^{}]*"[^"]*"[^{}]*\}/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            const parsed = JSON.parse(match);
            if (parsed && typeof parsed === 'object') {
              allJsonData.push(parsed);
              
              // Score this JSON block
              let score = 0;
              if (deepFind(parsed, ['address', 'streetAddress', 'addressLocality'])) score += 2;
              if (deepFind(parsed, ['offers', 'price', 'price', 'listPrice'])) score += 2;
              if (deepFind(parsed, ['numberOfRooms', 'numberOfBedrooms', 'bedrooms', 'bedroomCount'])) score += 2;
              if (deepFind(parsed, ['numberOfBathroomsTotal', 'numberOfBathrooms', 'bathrooms', 'bathroomCount'])) score += 2;
              if (deepFind(parsed, ['floorSize', 'area', 'livingArea', 'sqft', 'squareFootage'])) score += 2;
              if (deepFind(parsed, ['description', 'description', 'summary'])) score += 1;
              if (deepFind(parsed, ['image', 'images', 'photo', 'photos'])) score += 1;
              if (deepFind(parsed, ['amenityFeature', 'features', 'amenities'])) score += 1;
              
              if (score > bestScore) {
                bestScore = score;
                bestJson = parsed;
              }
            }
          } catch (_e) {
            // intentionally ignored
          }
        }
      }
    }
  });

  if (debugJson) {
    console.log('First ld+json found:', JSON.stringify(debugJson, null, 2).substring(0, 2000));
  }

  let json = bestJson;
  let foundJson = !!json;

  // Fallback: Try window.__PRELOADED_STATE__ and Apollo as before
  if (!foundJson) {
    const preloadedStateMatch = html.match(/<script[^>]*>\s*window\.__PRELOADED_STATE__\s*=\s*(\{.*?\})\s*;<\/script>/s);
    if (preloadedStateMatch) {
      try {
        json = JSON.parse(preloadedStateMatch[1]);
        foundJson = true;
      } catch (_e) {
        // intentionally ignored
      }
    }
  }
  if (!foundJson) {
    const apolloMatch = html.match(/<script id="hdpApolloPreloadedData" type="application\/json">([\s\S]*?)<\/script>/);
    if (apolloMatch) {
      try {
        json = JSON.parse(apolloMatch[1]);
        foundJson = true;
      } catch (_e) {
        // intentionally ignored
      }
    }
  }

  // Extract as much as possible from JSON - enhanced with pattern matching
  if (json) {
    const addressObj = deepFind(json, ['address']) as Record<string, unknown>;
    const address = (addressObj?.streetAddress as string) || (addressObj?.addressLocality as string) || (addressObj?.addressRegion as string) || (addressObj?.addressCountry as string) || (addressObj ? String(addressObj) : 'Address not found');
    const price = deepFind(json, ['offers', 'price', 'price', 'listPrice']) || deepFind(json, ['price']) || 'Price not available';
    
    // Enhanced bedroom/bathroom/sqft extraction
    let bedrooms = (deepFind(json, ['numberOfRooms', 'numberOfBedrooms', 'bedrooms', 'bedroomCount']) as number) || 0;
    let bathrooms = (deepFind(json, ['numberOfBathroomsTotal', 'numberOfBathrooms', 'bathrooms', 'bathroomCount']) as number) || 0;
    let squareFeet = (deepFind(json, ['floorSize', 'area', 'livingArea', 'sqft', 'squareFootage']) as number) || 0;
    
    // If not found in JSON, try pattern matching on description or summary
    const description = (deepFind(json, ['description', 'summary', 'propertyDescription']) as string) || 'No description available';
    if (description && description !== 'No description available') {
      const patterns = searchTextForPatterns(description);
      if (patterns.bedrooms && !bedrooms) bedrooms = patterns.bedrooms;
      if (patterns.bathrooms && !bathrooms) bathrooms = patterns.bathrooms;
      if (patterns.squareFeet && !squareFeet) squareFeet = patterns.squareFeet;
    }
    
    // Enhanced image extraction
    let images = (deepFind(json, ['image', 'images', 'photo', 'photos']) as string[] | string) || [];
    if (typeof images === 'string') images = [images];
    if (!Array.isArray(images)) images = [];
    
    // Enhanced feature extraction
    const features = (deepFind(json, ['amenityFeature']) as Array<{ name: string }>)?.map((f: { name: string }) => f.name) || 
                    (deepFind(json, ['features']) as string[]) || 
                    (deepFind(json, ['amenities']) as string[]) || [];
    
    const neighborhood = (addressObj?.addressLocality as string) || (deepFind(json, ['neighborhood']) as string) || 'Neighborhood not specified';
    
    const result: ScrapedPropertyData = {
      address: address as string,
      price: typeof price === 'number' ? `$${price.toLocaleString()}` : (price as string),
      bedrooms,
      bathrooms,
      squareFeet,
      description: description as string,
      features,
      neighborhood: neighborhood as string,
      images: images as string[],
      listingUrl: url,
      scrapedAt: new Date().toISOString()
    };
    // Sync to knowledge brain (fire and forget)
    syncKnowledgeBrain(result).catch(() => {
      // intentionally ignored
    });
    return result;
  }
  
  // If no JSON found, try pattern matching on the entire HTML content
  const htmlText = $.text();
  const htmlPatterns = searchTextForPatterns(htmlText);
  if (htmlPatterns.bedrooms || htmlPatterns.bathrooms || htmlPatterns.squareFeet) {
    console.log('Found patterns in HTML:', htmlPatterns);
  }

  // Try multiple selectors for address - more aggressive
  const addressSelectors = [
    '[data-testid="home-details-summary-address"]',
    '.home-details-summary-address',
    '[data-testid="address"]',
    '.address',
    'h1[data-testid="home-details-summary-address"]',
    '.home-details-summary h1',
    '[data-testid="home-details-summary"] h1',
    '.property-address',
    '.listing-address',
    'h1',
    '.property-title',
    '.listing-title',
    '[data-testid="property-title"]',
    '.home-details-summary-address',
    '.property-address',
    '.address-line',
    '.street-address'
  ];
  let address = 'Address not found';
  for (const selector of addressSelectors) {
    const found = $(selector).text().trim();
    if (found) {
      address = found;
      break;
    }
  }

  // Try multiple selectors for price
  const priceSelectors = [
    '[data-testid="price"]',
    '.price',
    '[data-testid="home-details-summary-price"]',
    '.home-details-summary-price',
    '.property-price',
    '.listing-price',
    '[data-testid="home-value"]',
    '.home-value'
  ];
  let price = 'Price not available';
  for (const selector of priceSelectors) {
    const found = $(selector).text().trim();
    if (found) {
      price = found;
      break;
    }
  }

  // Extract bedrooms and bathrooms - more aggressive with pattern matching
  const summaryText = $('.home-details-summary').text().trim() ||
    $('[data-testid="home-details-summary"]').text().trim() ||
    $('.summary').text().trim() ||
    $('.property-summary').text().trim() ||
    $('.listing-summary').text().trim() ||
    $('.home-summary').text().trim() ||
    $('.property-details').text().trim() ||
    $('.listing-details').text().trim();
  
  // Use pattern matching for more reliable extraction
  const patterns = searchTextForPatterns(summaryText);
  let bedrooms = patterns.bedrooms || 0;
  let bathrooms = patterns.bathrooms || 0;
  let squareFeet = patterns.squareFeet || 0;
  
  // If not found in summary, try pattern matching on the entire page
  if (!bedrooms || !bathrooms || !squareFeet) {
    const pageText = $.text();
    const pagePatterns = searchTextForPatterns(pageText);
    if (pagePatterns.bedrooms && !bedrooms) bedrooms = pagePatterns.bedrooms;
    if (pagePatterns.bathrooms && !bathrooms) bathrooms = pagePatterns.bathrooms;
    if (pagePatterns.squareFeet && !squareFeet) squareFeet = pagePatterns.squareFeet;
  }

  // Extract description
  let description = $('[data-testid="home-description"]').text().trim() ||
    $('.home-description').text().trim() ||
    $('.description').text().trim() ||
    'No description available';
  if (specialDescription) {
    description = description && description !== 'No description available'
      ? description + '\n\n' + specialDescription
      : specialDescription;
  }

  // Extract features
  const features: string[] = [];
  $('.feature-item, .amenity-item, [data-testid="feature"]').each((_, el) => {
    const feature = $(el).text().trim();
    if (feature) features.push(feature);
  });
  // Merge specialTags
  for (const tag of specialTags) {
    if (!features.includes(tag)) features.push(tag);
  }

  // Extract images
  const images: string[] = [];
  $('img[src*="zillow"], img[data-src*="zillow"]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.includes('placeholder')) {
      images.push(src);
    }
  });

  // Extract neighborhood
  const neighborhood = $('[data-testid="neighborhood"]').text().trim() ||
    $('.neighborhood').text().trim() ||
    'Neighborhood not specified';

  const result = {
    address,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    description,
    features,
    neighborhood,
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };
  // Sync to knowledge brain (fire and forget)
  syncKnowledgeBrain(result).catch(() => {
    // intentionally ignored
  });
  return result;
}