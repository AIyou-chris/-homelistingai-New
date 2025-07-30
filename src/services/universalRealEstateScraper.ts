// UNIVERSAL REAL ESTATE SCRAPER - Handles multiple listing sites
export interface UniversalListingData {
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  features: string[];
  neighborhood: string;
  images: string[];
  listingUrl: string;
  yearBuilt?: number;
  lotSize?: string;
  propertyType?: string;
  agentName?: string;
  agentCompany?: string;
  site: string; // Which site it came from
}

export async function scrapeUniversalListing(url: string): Promise<UniversalListingData | null> {
  console.log('🌐 Starting UNIVERSAL scraper for:', url);
  
  try {
    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    console.log('📋 Normalized URL:', normalizedUrl);
    
    // Detect which site this is
    const site = detectSite(normalizedUrl);
    console.log('🎯 Detected site:', site);
    
    if (!site) {
      console.log('❌ Could not detect site type');
      return null;
    }
    
    // Use site-specific scraper
    const scrapers = {
      'zillow': scrapeZillow,
      'redfin': scrapeRedfin,
      'realtor': scrapeRealtor,
      'trulia': scrapeTrulia,
      'homes': scrapeHomes,
      'compass': scrapeCompass,
      'berkshire': scrapeBerkshire,
      'coldwell': scrapeColdwell,
      'remax': scrapeRemax,
      'keller': scrapeKeller
    };
    
    const scraper = scrapers[site as keyof typeof scrapers];
    if (scraper) {
      const result = await scraper(normalizedUrl);
      if (result) {
        result.site = site;
        return result;
      }
    }
    
    // Fallback to generic scraper
    console.log('🔄 Trying generic scraper...');
    return await scrapeGeneric(normalizedUrl, site);
    
  } catch (error) {
    console.error('❌ Universal scraper failed:', error);
    return null;
  }
}

function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  // Add https if missing
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized;
  }
  
  // Remove fragments and query params
  normalized = normalized.split('#')[0].split('?')[0];
  
  return normalized;
}

function detectSite(url: string): string | null {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('zillow.com')) return 'zillow';
  if (urlLower.includes('redfin.com')) return 'redfin';
  if (urlLower.includes('realtor.com')) return 'realtor';
  if (urlLower.includes('trulia.com')) return 'trulia';
  if (urlLower.includes('homes.com')) return 'homes';
  if (urlLower.includes('compass.com')) return 'compass';
  if (urlLower.includes('berkshirehathaway.com')) return 'berkshire';
  if (urlLower.includes('coldwellbanker.com')) return 'coldwell';
  if (urlLower.includes('remax.com')) return 'remax';
  if (urlLower.includes('kw.com') || urlLower.includes('kellerwilliams.com')) return 'keller';
  
  return null;
}

// ZILLOW SCRAPER
async function scrapeZillow(url: string): Promise<UniversalListingData | null> {
  console.log('🏠 Scraping Zillow...');
  
  try {
    const response = await fetch('/.netlify/functions/scrape-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        return {
          address: result.data.address || 'Address not available',
          price: result.data.price || 'Price not available',
          bedrooms: result.data.bedrooms || 0,
          bathrooms: result.data.bathrooms || 0,
          squareFeet: result.data.squareFeet || result.data.square_feet || 0,
          description: result.data.description || 'No description available',
          features: result.data.features || [],
          neighborhood: result.data.neighborhood || 'Neighborhood not specified',
          images: result.data.images || [],
          listingUrl: url,
          yearBuilt: result.data.yearBuilt || result.data.year_built,
          lotSize: result.data.lotSize || result.data.lot_size,
          propertyType: result.data.propertyType || result.data.property_type,
          agentName: result.data.agentName || result.data.agent_name,
          agentCompany: result.data.agentCompany || result.data.agent_company,
          site: 'zillow'
        };
      }
    }
  } catch (error) {
    console.log('Zillow scraper failed:', error);
  }
  
  return null;
}

// REDFIN SCRAPER
async function scrapeRedfin(url: string): Promise<UniversalListingData | null> {
  console.log('🏠 Scraping Redfin...');
  
  try {
    const html = await fetchWithProxy(url);
    if (!html) return null;
    
    // Extract data from Redfin HTML
    const price = extractRedfinPrice(html);
    const bedrooms = extractRedfinBedrooms(html);
    const bathrooms = extractRedfinBathrooms(html);
    const squareFeet = extractRedfinSquareFeet(html);
    const address = extractRedfinAddress(html);
    const photos = extractRedfinPhotos(html);
    
    if (price && bedrooms && bathrooms) {
      return {
        address: address || 'Address not available',
        price,
        bedrooms,
        bathrooms,
        squareFeet,
        description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home${squareFeet ? ` with ${squareFeet} sqft` : ''}.`,
        features: [`${bedrooms} bedrooms`, `${bathrooms} bathrooms`],
        neighborhood: 'Neighborhood not specified',
        images: photos,
        listingUrl: url,
        site: 'redfin'
      };
    }
  } catch (error) {
    console.log('Redfin scraper failed:', error);
  }
  
  return null;
}

// REALTOR.COM SCRAPER
async function scrapeRealtor(url: string): Promise<UniversalListingData | null> {
  console.log('🏠 Scraping Realtor.com...');
  
  try {
    const html = await fetchWithProxy(url);
    if (!html) return null;
    
    // Extract data from Realtor.com HTML
    const price = extractRealtorPrice(html);
    const bedrooms = extractRealtorBedrooms(html);
    const bathrooms = extractRealtorBathrooms(html);
    const squareFeet = extractRealtorSquareFeet(html);
    const address = extractRealtorAddress(html);
    const photos = extractRealtorPhotos(html);
    
    if (price && bedrooms && bathrooms) {
      return {
        address: address || 'Address not available',
        price,
        bedrooms,
        bathrooms,
        squareFeet,
        description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home${squareFeet ? ` with ${squareFeet} sqft` : ''}.`,
        features: [`${bedrooms} bedrooms`, `${bathrooms} bathrooms`],
        neighborhood: 'Neighborhood not specified',
        images: photos,
        listingUrl: url,
        site: 'realtor'
      };
    }
  } catch (error) {
    console.log('Realtor.com scraper failed:', error);
  }
  
  return null;
}

// TRULIA SCRAPER
async function scrapeTrulia(url: string): Promise<UniversalListingData | null> {
  console.log('🏠 Scraping Trulia...');
  
  try {
    const html = await fetchWithProxy(url);
    if (!html) return null;
    
    // Extract data from Trulia HTML
    const price = extractTruliaPrice(html);
    const bedrooms = extractTruliaBedrooms(html);
    const bathrooms = extractTruliaBathrooms(html);
    const squareFeet = extractTruliaSquareFeet(html);
    const address = extractTruliaAddress(html);
    const photos = extractTruliaPhotos(html);
    
    if (price && bedrooms && bathrooms) {
      return {
        address: address || 'Address not available',
        price,
        bedrooms,
        bathrooms,
        squareFeet,
        description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home${squareFeet ? ` with ${squareFeet} sqft` : ''}.`,
        features: [`${bedrooms} bedrooms`, `${bathrooms} bathrooms`],
        neighborhood: 'Neighborhood not specified',
        images: photos,
        listingUrl: url,
        site: 'trulia'
      };
    }
  } catch (error) {
    console.log('Trulia scraper failed:', error);
  }
  
  return null;
}

// GENERIC SCRAPER for unknown sites
async function scrapeGeneric(url: string, site: string): Promise<UniversalListingData | null> {
  console.log('🏠 Scraping generic site:', site);
  
  try {
    const html = await fetchWithProxy(url);
    if (!html) return null;
    
    // Generic patterns that work across many sites
    const price = extractGenericPrice(html);
    const bedrooms = extractGenericBedrooms(html);
    const bathrooms = extractGenericBathrooms(html);
    const squareFeet = extractGenericSquareFeet(html);
    const address = extractGenericAddress(html);
    const photos = extractGenericPhotos(html);
    
    if (price && bedrooms && bathrooms) {
      return {
        address: address || 'Address not available',
        price,
        bedrooms,
        bathrooms,
        squareFeet,
        description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home${squareFeet ? ` with ${squareFeet} sqft` : ''}.`,
        features: [`${bedrooms} bedrooms`, `${bathrooms} bathrooms`],
        neighborhood: 'Neighborhood not specified',
        images: photos,
        listingUrl: url,
        site
      };
    }
  } catch (error) {
    console.log('Generic scraper failed:', error);
  }
  
  return null;
}

// HELPER FUNCTIONS

async function fetchWithProxy(url: string): Promise<string | null> {
  const proxyServices = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://thingproxy.freeboard.io/fetch/${url}`
  ];
  
  for (const proxyUrl of proxyServices) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(proxyUrl, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        return data.contents || await response.text();
      }
    } catch (error) {
      console.log('Proxy service failed:', error);
      continue;
    }
  }
  
  return null;
}

// REDFIN EXTRACTION FUNCTIONS
function extractRedfinPrice(html: string): string {
  const patterns = [
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /data-price="(\$?[\d,]+)"/g,
    /price[^>]*>\s*\$?([\d,]+)/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanPrice = match.replace(/[^\d]/g, '');
        const numPrice = parseInt(cleanPrice);
        if (numPrice > 50000 && numPrice < 50000000) {
          return `$${numPrice.toLocaleString()}`;
        }
      }
    }
  }
  
  return '';
}

function extractRedfinBedrooms(html: string): number {
  const patterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /data-beds="(\d+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      if (bedrooms > 0 && bedrooms < 20) return bedrooms;
    }
  }
  
  return 0;
}

function extractRedfinBathrooms(html: string): number {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+(?:\.\d+)?)/i,
    /data-baths="(\d+(?:\.\d+)?)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bathrooms = parseFloat(match[1]);
      if (bathrooms > 0 && bathrooms < 20) return bathrooms;
    }
  }
  
  return 0;
}

function extractRedfinSquareFeet(html: string): number {
  const patterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /data-sqft="(\d+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const sqft = parseInt(match[1].replace(',', ''));
      if (sqft > 0 && sqft < 100000) return sqft;
    }
  }
  
  return 0;
}

function extractRedfinAddress(html: string): string {
  const patterns = [
    /"address"\s*:\s*"([^"]+)"/,
    /data-address="([^"]+)"/,
    /address[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return '';
}

function extractRedfinPhotos(html: string): string[] {
  const photos: string[] = [];
  const patterns = [
    /https:\/\/ssl\.cdn-redfin\.com\/[^"'\s]+\.jpg/g,
    /https:\/\/ssl\.cdn-redfin\.com\/[^"'\s]+\.jpeg/g,
    /https:\/\/ssl\.cdn-redfin\.com\/[^"'\s]+\.png/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    photos.push(...matches);
  }
  
  return [...new Set(photos)].slice(0, 15);
}

// REALTOR.COM EXTRACTION FUNCTIONS
function extractRealtorPrice(html: string): string {
  const patterns = [
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /data-price="(\$?[\d,]+)"/g,
    /price[^>]*>\s*\$?([\d,]+)/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanPrice = match.replace(/[^\d]/g, '');
        const numPrice = parseInt(cleanPrice);
        if (numPrice > 50000 && numPrice < 50000000) {
          return `$${numPrice.toLocaleString()}`;
        }
      }
    }
  }
  
  return '';
}

function extractRealtorBedrooms(html: string): number {
  const patterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /data-beds="(\d+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      if (bedrooms > 0 && bedrooms < 20) return bedrooms;
    }
  }
  
  return 0;
}

function extractRealtorBathrooms(html: string): number {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+(?:\.\d+)?)/i,
    /data-baths="(\d+(?:\.\d+)?)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bathrooms = parseFloat(match[1]);
      if (bathrooms > 0 && bathrooms < 20) return bathrooms;
    }
  }
  
  return 0;
}

function extractRealtorSquareFeet(html: string): number {
  const patterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /data-sqft="(\d+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const sqft = parseInt(match[1].replace(',', ''));
      if (sqft > 0 && sqft < 100000) return sqft;
    }
  }
  
  return 0;
}

function extractRealtorAddress(html: string): string {
  const patterns = [
    /"address"\s*:\s*"([^"]+)"/,
    /data-address="([^"]+)"/,
    /address[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return '';
}

function extractRealtorPhotos(html: string): string[] {
  const photos: string[] = [];
  const patterns = [
    /https:\/\/ar\.1r\.com\/[^"'\s]+\.jpg/g,
    /https:\/\/ar\.1r\.com\/[^"'\s]+\.jpeg/g,
    /https:\/\/ar\.1r\.com\/[^"'\s]+\.png/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    photos.push(...matches);
  }
  
  return [...new Set(photos)].slice(0, 15);
}

// TRULIA EXTRACTION FUNCTIONS
function extractTruliaPrice(html: string): string {
  const patterns = [
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /data-price="(\$?[\d,]+)"/g,
    /price[^>]*>\s*\$?([\d,]+)/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanPrice = match.replace(/[^\d]/g, '');
        const numPrice = parseInt(cleanPrice);
        if (numPrice > 50000 && numPrice < 50000000) {
          return `$${numPrice.toLocaleString()}`;
        }
      }
    }
  }
  
  return '';
}

function extractTruliaBedrooms(html: string): number {
  const patterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /data-beds="(\d+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      if (bedrooms > 0 && bedrooms < 20) return bedrooms;
    }
  }
  
  return 0;
}

function extractTruliaBathrooms(html: string): number {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+(?:\.\d+)?)/i,
    /data-baths="(\d+(?:\.\d+)?)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bathrooms = parseFloat(match[1]);
      if (bathrooms > 0 && bathrooms < 20) return bathrooms;
    }
  }
  
  return 0;
}

function extractTruliaSquareFeet(html: string): number {
  const patterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /data-sqft="(\d+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const sqft = parseInt(match[1].replace(',', ''));
      if (sqft > 0 && sqft < 100000) return sqft;
    }
  }
  
  return 0;
}

function extractTruliaAddress(html: string): string {
  const patterns = [
    /"address"\s*:\s*"([^"]+)"/,
    /data-address="([^"]+)"/,
    /address[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return '';
}

function extractTruliaPhotos(html: string): string[] {
  const photos: string[] = [];
  const patterns = [
    /https:\/\/www\.trulia\.com\/[^"'\s]+\.jpg/g,
    /https:\/\/www\.trulia\.com\/[^"'\s]+\.jpeg/g,
    /https:\/\/www\.trulia\.com\/[^"'\s]+\.png/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    photos.push(...matches);
  }
  
  return [...new Set(photos)].slice(0, 15);
}

// GENERIC EXTRACTION FUNCTIONS (for unknown sites)
function extractGenericPrice(html: string): string {
  const patterns = [
    /\$[\d,]+/g,
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /"listPrice"\s*:\s*"?(\$?[\d,]+)"?/g,
    /price[^>]*>\s*\$?([\d,]+)/g,
    /"value"\s*:\s*"?(\$?[\d,]+)"?/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanPrice = match.replace(/[^\d]/g, '');
        const numPrice = parseInt(cleanPrice);
        if (numPrice > 50000 && numPrice < 50000000) {
          return `$${numPrice.toLocaleString()}`;
        }
      }
    }
  }
  
  return '';
}

function extractGenericBedrooms(html: string): number {
  const patterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /"beds"\s*:\s*(\d+)/i,
    /(\d+)\s*bd/i,
    /bedroom[^>]*>(\d+)/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      if (bedrooms > 0 && bedrooms < 20) return bedrooms;
    }
  }
  
  return 0;
}

function extractGenericBathrooms(html: string): number {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+(?:\.\d+)?)/i,
    /"baths"\s*:\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*ba/i,
    /bathroom[^>]*>(\d+(?:\.\d+)?)/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const bathrooms = parseFloat(match[1]);
      if (bathrooms > 0 && bathrooms < 20) return bathrooms;
    }
  }
  
  return 0;
}

function extractGenericSquareFeet(html: string): number {
  const patterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /"squareFeet"\s*:\s*(\d+)/i,
    /(\d{3,4})\s*sq/i,
    /square\s*footage[^>]*>([\d,]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const sqft = parseInt(match[1].replace(',', ''));
      if (sqft > 0 && sqft < 100000) return sqft;
    }
  }
  
  return 0;
}

function extractGenericAddress(html: string): string {
  const patterns = [
    /"address"\s*:\s*"([^"]+)"/,
    /"streetAddress"\s*:\s*"([^"]+)"/,
    /address[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return '';
}

function extractGenericPhotos(html: string): string[] {
  const photos: string[] = [];
  const patterns = [
    /https:\/\/[^"'\s]+\.jpg/g,
    /https:\/\/[^"'\s]+\.jpeg/g,
    /https:\/\/[^"'\s]+\.png/g,
    /https:\/\/[^"'\s]+\.webp/g
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    photos.push(...matches);
  }
  
  // Filter out non-property photos
  const filteredPhotos = photos.filter(photo => 
    !photo.includes('badge') && 
    !photo.includes('footer') &&
    !photo.includes('app-store') &&
    !photo.includes('google-play') &&
    !photo.includes('logo') &&
    !photo.includes('placeholder') &&
    !photo.includes('avatar') &&
    !photo.includes('icon')
  );
  
  return [...new Set(filteredPhotos)].slice(0, 15);
}

// Placeholder functions for other sites (can be expanded)
async function scrapeHomes(url: string): Promise<UniversalListingData | null> {
  return await scrapeGeneric(url, 'homes');
}

async function scrapeCompass(url: string): Promise<UniversalListingData | null> {
  return await scrapeGeneric(url, 'compass');
}

async function scrapeBerkshire(url: string): Promise<UniversalListingData | null> {
  return await scrapeGeneric(url, 'berkshire');
}

async function scrapeColdwell(url: string): Promise<UniversalListingData | null> {
  return await scrapeGeneric(url, 'coldwell');
}

async function scrapeRemax(url: string): Promise<UniversalListingData | null> {
  return await scrapeGeneric(url, 'remax');
}

async function scrapeKeller(url: string): Promise<UniversalListingData | null> {
  return await scrapeGeneric(url, 'keller');
} 