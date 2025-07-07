// Deno-compatible property scraping logic for Supabase Edge Functions
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';
// Note: Playwright may not be available in Supabase Edge Functions
// We'll implement a fallback approach that doesn't require Playwright

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
const SCRAPER_API_KEY = Deno.env.get('SCRAPER_API_KEY') || 'your-api-key-here';
const SCRAPER_API_URL = 'http://api.scraperapi.com';

const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN');
const ACTOR_ID = 'ENK9p4RZHgOiVs052'; // Zillow Detail Scraper

export async function scrapeProperty(url: string): Promise<any> {
  if (url.includes('zillow.com')) {
    const html = await scrapeWithScraperAPI(url);
    return parseZillowHtml(html, url);
  } else if (url.includes('realtor.com')) {
    return await scrapeRealtorProperty(url);
  } else {
    return await scrapeGenericProperty(url);
  }
}

// Enhanced Zillow scraping with better selectors and JSON extraction
// Note: For production headless browser scraping, consider using a separate service
// like ScraperAPI with render=true or a dedicated scraping service

async function fetchHtmlWithScraperAPI(url: string): Promise<string> {
  // Build ScraperAPI URL with parameters
  const scraperUrl = `${SCRAPER_API_URL}?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}&render=true&country_code=us`;
  
  const res = await fetch(scraperUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
  });
  
  if (!res.ok) {
    throw new Error(`ScraperAPI failed: ${res.status} ${res.statusText}`);
  }
  
  return await res.text();
}

// Fallback to direct fetch if ScraperAPI is not configured
async function fetchHtmlDirect(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HomeListingAI/1.0; +https://homelistingai.com)'
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return await res.text();
}

async function fetchHtml(url: string): Promise<string> {
  // Use ScraperAPI if configured, otherwise fall back to direct fetch
  if (SCRAPER_API_KEY && SCRAPER_API_KEY !== 'your-api-key-here') {
    try {
      return await fetchHtmlWithScraperAPI(url);
    } catch (error) {
      console.warn('ScraperAPI failed, falling back to direct fetch:', error.message);
      return await fetchHtmlDirect(url);
    }
  } else {
    return await fetchHtmlDirect(url);
  }
}

export async function scrapeZillowProperty(url: string): Promise<any> {
  // 1. Start the actor run
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          startUrls: [{ url }]
        }
      }),
    }
  );
  const startData = await startRes.json();
  if (!startData.data || !startData.data.id) {
    throw new Error('Failed to start Apify actor');
  }
  const runId = startData.data.id;

  // 2. Poll for run completion
  let status = 'RUNNING';
  let datasetId = '';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
    const runRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const runData = await runRes.json();
    status = runData.data.status;
    if (status === 'SUCCEEDED') {
      datasetId = runData.data.defaultDatasetId;
      break;
    }
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      throw new Error('Apify actor run failed');
    }
  }

  // 3. Fetch results from dataset
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`
  );
  const items = await itemsRes.json();
  if (!items.length) throw new Error('No data returned from Apify');
  return items[0]; // Zillow Detail Scraper returns one object per listing
}

export async function scrapeRealtorProperty(url: string) {
  // Implementation for scraping from Realtor
}

export async function scrapeGenericProperty(url: string) {
  // Implementation for scraping from a generic source
}

export async function scrapeWithScraperAPI(url: string): Promise<string> {
  const SCRAPER_API_KEY = '7c29cde7f6025b989f362bca10db53fa';
  // Enhanced parameters for better JavaScript rendering and data extraction
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}&render=true&country_code=us&premium=true&session_number=1`;
  const res = await fetch(scraperUrl);
  if (!res.ok) throw new Error(`ScraperAPI failed: ${res.status} ${res.statusText}`);
  return await res.text();
}

function deepFind(obj: any, keys: string[]): any {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
  }
  for (const k in obj) {
    if (typeof obj[k] === 'object') {
      const found = deepFind(obj[k], keys);
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

function parseZillowHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);

  // Aggressively parse all ld+json blocks and any JSON-like content
  let bestJson: any = null;
  let bestScore = 0;
  let debugJson: any = null;
  let allJsonData: any[] = [];

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
    } catch (e) {}
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
          } catch (e) {}
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
      } catch (e) {}
    }
  }
  if (!foundJson) {
    const apolloMatch = html.match(/<script id="hdpApolloPreloadedData" type="application\/json">([\s\S]*?)<\/script>/);
    if (apolloMatch) {
      try {
        json = JSON.parse(apolloMatch[1]);
        foundJson = true;
      } catch (e) {}
    }
  }

  // Extract as much as possible from JSON - enhanced with pattern matching
  if (json) {
    const addressObj = deepFind(json, ['address']);
    const address = addressObj?.streetAddress || addressObj?.addressLocality || addressObj?.addressRegion || addressObj?.addressCountry || addressObj || 'Address not found';
    const price = deepFind(json, ['offers', 'price', 'price', 'listPrice']) || deepFind(json, ['price']) || 'Price not available';
    
    // Enhanced bedroom/bathroom/sqft extraction
    let bedrooms = deepFind(json, ['numberOfRooms', 'numberOfBedrooms', 'bedrooms', 'bedroomCount']) || 0;
    let bathrooms = deepFind(json, ['numberOfBathroomsTotal', 'numberOfBathrooms', 'bathrooms', 'bathroomCount']) || 0;
    let squareFeet = deepFind(json, ['floorSize', 'area', 'livingArea', 'sqft', 'squareFootage']) || 0;
    
    // If not found in JSON, try pattern matching on description or summary
    const description = deepFind(json, ['description', 'summary', 'propertyDescription']) || 'No description available';
    if (description && description !== 'No description available') {
      const patterns = searchTextForPatterns(description);
      if (patterns.bedrooms && !bedrooms) bedrooms = patterns.bedrooms;
      if (patterns.bathrooms && !bathrooms) bathrooms = patterns.bathrooms;
      if (patterns.squareFeet && !squareFeet) squareFeet = patterns.squareFeet;
    }
    
    // Enhanced image extraction
    let images = deepFind(json, ['image', 'images', 'photo', 'photos']) || [];
    if (typeof images === 'string') images = [images];
    if (!Array.isArray(images)) images = [];
    
    // Enhanced feature extraction
    const features = deepFind(json, ['amenityFeature'])?.map((f: any) => f.name) || 
                    deepFind(json, ['features']) || 
                    deepFind(json, ['amenities']) || [];
    
    const neighborhood = addressObj?.addressLocality || deepFind(json, ['neighborhood']) || 'Neighborhood not specified';
    
    return {
      address,
      price: typeof price === 'number' ? `$${price.toLocaleString()}` : price,
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
  }
  
  // If no JSON found, try pattern matching on the entire HTML content
  const htmlText = $.text();
  const htmlPatterns = searchTextForPatterns(htmlText);
  if (htmlPatterns.bedrooms || htmlPatterns.bathrooms || htmlPatterns.squareFeet) {
    console.log('Found patterns in HTML:', htmlPatterns);
  }

  // Fallback: Use selectors (as before)
  // ... existing code for selector-based extraction ...

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

  return {
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
}