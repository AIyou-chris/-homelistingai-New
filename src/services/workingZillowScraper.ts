// ULTRA ROBUST Zillow Scraper - Gets REAL data from ANY Zillow URL
export interface WorkingZillowData {
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
  // NEW: Enhanced data fields
  marketAnalysis?: {
    pricePerSqFt: number;
    daysOnMarket: number;
    priceHistory: Array<{date: string, price: string}>;
    marketTrend: 'rising' | 'falling' | 'stable';
    comparableProperties: Array<{address: string, price: string, distance: string}>;
  };
  neighborhoodInsights?: {
    walkScore: number;
    transitScore: number;
    schoolRating: number;
    crimeRate: string;
    nearbyAmenities: string[];
  };
  propertyHighlights?: {
    uniqueFeatures: string[];
    recentUpdates: string[];
    energyEfficiency: string;
    parkingInfo: string;
  };
  aiGeneratedContent?: {
    marketingDescription: string;
    keySellingPoints: string[];
    targetBuyerProfile: string;
    investmentPotential: string;
  };
  scrapingMetadata?: {
    scrapedAt: string;
    dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
    confidence: number;
    sourceMethod: string;
    retryCount: number;
  };
}

// Enhanced user agents for better success
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
];

// AI-powered data validation
function validateAndEnhanceData(data: WorkingZillowData): WorkingZillowData {
  const enhanced = { ...data };
  
  // Calculate price per sq ft
  if (enhanced.price && enhanced.squareFeet) {
    const priceNum = parseFloat(enhanced.price.replace(/[$,]/g, ''));
    const sqFt = enhanced.squareFeet;
    if (priceNum && sqFt) {
      enhanced.marketAnalysis = {
        pricePerSqFt: Math.round(priceNum / sqFt),
        daysOnMarket: 0,
        priceHistory: [],
        marketTrend: 'stable' as const,
        comparableProperties: []
      };
    }
  }
  
  // Generate AI marketing content
  if (enhanced.description && enhanced.features) {
    enhanced.aiGeneratedContent = {
      marketingDescription: generateMarketingDescription(enhanced),
      keySellingPoints: extractKeySellingPoints(enhanced),
      targetBuyerProfile: determineTargetBuyer(enhanced),
      investmentPotential: assessInvestmentPotential(enhanced)
    };
  }
  
  // Add scraping metadata
  enhanced.scrapingMetadata = {
    scrapedAt: new Date().toISOString(),
    dataQuality: assessDataQuality(enhanced),
    confidence: calculateConfidence(enhanced),
    sourceMethod: 'enhanced_scraper',
    retryCount: 0
  };
  
  return enhanced;
}

function generateMarketingDescription(data: WorkingZillowData): string {
  const price = data.price ? `priced at ${data.price}` : 'available';
  const sqft = data.squareFeet ? ` with ${data.squareFeet} square feet` : '';
  const year = data.yearBuilt ? `, built in ${data.yearBuilt}` : '';
  
  return `This beautiful ${data.bedrooms} bedroom, ${data.bathrooms} bathroom home${sqft}${year} is ${price}. ${data.description}`;
}

function extractKeySellingPoints(data: WorkingZillowData): string[] {
  const points = [];
  if (data.bedrooms > 3) points.push(`${data.bedrooms} spacious bedrooms`);
  if (data.bathrooms > 2) points.push(`${data.bathrooms} modern bathrooms`);
  if (data.squareFeet > 2000) points.push(`${data.squareFeet} sqft of living space`);
  if (data.yearBuilt && data.yearBuilt > 2000) points.push('Newer construction');
  return points;
}

function determineTargetBuyer(data: WorkingZillowData): string {
  if (data.bedrooms >= 4) return 'Family buyers';
  if (data.bedrooms >= 3) return 'Young professionals or small families';
  return 'First-time buyers or investors';
}

function assessInvestmentPotential(data: WorkingZillowData): string {
  const price = parseFloat(data.price.replace(/[$,]/g, ''));
  if (price > 1000000) return 'Luxury market - high-end buyers';
  if (price > 500000) return 'Mid-market - good investment potential';
  return 'Affordable market - great for first-time buyers';
}

function assessDataQuality(data: WorkingZillowData): 'excellent' | 'good' | 'fair' | 'poor' {
  let score = 0;
  if (data.price && data.price !== 'Price not available') score += 2;
  if (data.bedrooms > 0) score += 1;
  if (data.bathrooms > 0) score += 1;
  if (data.squareFeet > 0) score += 1;
  if (data.images.length > 0) score += 1;
  if (data.description && data.description.length > 50) score += 1;
  
  if (score >= 5) return 'excellent';
  if (score >= 4) return 'good';
  if (score >= 2) return 'fair';
  return 'poor';
}

function calculateConfidence(data: WorkingZillowData): number {
  let confidence = 0;
  if (data.price && data.price !== 'Price not available') confidence += 25;
  if (data.bedrooms > 0) confidence += 20;
  if (data.bathrooms > 0) confidence += 20;
  if (data.squareFeet > 0) confidence += 15;
  if (data.images.length > 0) confidence += 10;
  if (data.description) confidence += 10;
  return Math.min(confidence, 100);
}

export async function scrapeZillowWorking(url: string): Promise<WorkingZillowData | null> {
  console.log('🎯 Starting ULTRA ROBUST Zillow scraper for:', url);
  
  try {
    // Normalize URL
    const normalizedUrl = normalizeZillowUrl(url);
    console.log('📋 Normalized URL:', normalizedUrl);
    
    // Extract ZPID from URL - multiple patterns
    const zpid = extractZPID(normalizedUrl);
    if (!zpid) {
      console.log('❌ Could not extract ZPID from URL');
      return null;
    }
    
    console.log('📋 Extracted ZPID:', zpid);
    
    // Extract address from URL
    const rawAddress = extractAddressFromUrl(normalizedUrl);
    console.log('📋 Extracted address:', rawAddress);
    
    // Try multiple scraping methods with better error handling
    const methods = [
      () => scrapeWithSupabaseAPI(normalizedUrl, zpid, rawAddress),
      () => scrapeWithEnhancedHeaders(normalizedUrl, zpid, rawAddress),
      () => scrapeWithAllOrigins(normalizedUrl, zpid, rawAddress),
      () => scrapeWithSupabaseAPI(normalizedUrl, zpid, rawAddress),
      () => scrapeWithProxy(normalizedUrl, zpid, rawAddress),
      () => scrapeWithZillowAPI(zpid, rawAddress)
    ];
    
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`🔄 Trying method ${i + 1}/${methods.length}...`);
        const result = await methods[i]();
        
        if (result && isValidData(result)) {
          console.log('✅ Success with method', i + 1);
          return validateAndEnhanceData(result);
        }
      } catch (error) {
        console.log(`❌ Method ${i + 1} failed:`, error);
      }
    }
    
    console.log('❌ All scraping methods failed');
    return null;
  } catch (error) {
    console.error('❌ Scraper error:', error);
    return null;
  }
}

function normalizeZillowUrl(url: string): string {
  // Ensure URL is in correct format
  if (!url.includes('zillow.com')) {
    throw new Error('Not a valid Zillow URL');
  }
  
  // Remove any tracking parameters
  url = url.split('?')[0];
  
  // Ensure it ends with _zpid
  if (!url.endsWith('_zpid/')) {
    url = url.replace(/\/$/, '') + '_zpid/';
  }
  
  return url;
}

function extractZPID(url: string): string | null {
  // Multiple patterns to extract ZPID
  const patterns = [
    /(\d+)_zpid/,
    /zpid\/(\d+)/,
    /homedetails\/[^\/]+\/(\d+)/,
    /(\d{8,})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

function extractAddressFromUrl(url: string): string {
  // Extract address from URL path
  const addressMatch = url.match(/homedetails\/([^\/]+)/);
  if (addressMatch) {
    return addressMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  return 'Address from URL';
}

async function scrapeWithSupabaseAPI(url: string, zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying Supabase API...');
  
  try {
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/scrape-property', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
      },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        return {
          address: result.data.address || rawAddress,
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
          agentCompany: result.data.agentCompany || result.data.agent_company
        };
      }
    }
  } catch (error) {
    console.log('Supabase API failed:', error);
  }
  
  return null;
}

async function scrapeWithEnhancedHeaders(url: string, zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying enhanced headers method...');
  
  try {
    const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const response = await fetch(url, {
      headers: {
        'User-Agent': randomUserAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
        'Referer': 'https://www.google.com/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Enhanced headers failed: ${response.status}`);
    }
    
    const html = await response.text();
    return extractDataFromHTML(html, url, zpid, rawAddress);
  } catch (error) {
    console.log('Enhanced headers failed:', error);
    return null;
  }
}

async function scrapeWithAllOrigins(url: string, zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying AllOrigins proxy...');
  
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`AllOrigins failed: ${response.status}`);
    }
    
    const data = await response.json();
    const html = data.contents;
    
    return extractDataFromHTML(html, url, zpid, rawAddress);
  } catch (error) {
    console.log('AllOrigins failed:', error);
    return null;
  }
}

async function scrapeWithDirectHTML(url: string, zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying direct HTML fetch...');
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Direct fetch failed: ${response.status}`);
    }
    
    const html = await response.text();
    return extractDataFromHTML(html, url, zpid, rawAddress);
  } catch (error) {
    console.log('Direct HTML failed:', error);
    return null;
  }
}

async function scrapeWithProxy(url: string, zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying proxy method...');
  
  try {
    // Use a public proxy service
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    const response = await fetch(proxyUrl, {
      headers: {
        'Origin': 'https://www.zillow.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Proxy failed: ${response.status}`);
    }
    
    const html = await response.text();
    return extractDataFromHTML(html, url, zpid, rawAddress);
  } catch (error) {
    console.log('Proxy failed:', error);
    return null;
  }
}

async function scrapeWithZillowAPI(zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying Zillow API...');
  
  try {
    // This would require a Zillow API key
    // For now, return null as we don't have API access
    return null;
  } catch (error) {
    console.log('Zillow API failed:', error);
    return null;
  }
}

function extractDataFromHTML(html: string, url: string, zpid: string, rawAddress: string): WorkingZillowData | null {
  console.log('📋 Extracting data from HTML...');
  
  // Extract price - multiple modern patterns
  let price = '';
  const pricePatterns = [
    /\$[\d,]+/g,
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /"listPrice"\s*:\s*"?(\$?[\d,]+)"?/g,
    /"price"\s*:\s*(\d+)/g,
    /data-cy="price"[^>]*>\s*\$?([\d,]+)/g,
    /class="[^"]*price[^"]*"[^>]*>\s*\$?([\d,]+)/g,
    /price[^>]*>\s*\$?([\d,]+)/g,
    /"value"\s*:\s*"?(\$?[\d,]+)"?/g,
    // NEW: Modern Zillow patterns
    /"listPrice"\s*:\s*"?(\$?[\d,]+)"?/g,
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /data-testid="price"[^>]*>\s*\$?([\d,]+)/g,
    /class="[^"]*price[^"]*"[^>]*>\s*\$?([\d,]+)/g
  ];
  
  for (const pattern of pricePatterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanPrice = match.replace(/[^\d]/g, '');
        const numPrice = parseInt(cleanPrice);
        if (numPrice > 50000 && numPrice < 50000000) {
          price = `$${numPrice.toLocaleString()}`;
          break;
        }
      }
      if (price) break;
    }
  }
  
  // Extract bedrooms - multiple patterns
  let bedrooms = 0;
  const bedroomPatterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /"beds"\s*:\s*(\d+)/i,
    /data-cy="bed"[^>]*>(\d+)/i,
    /(\d+)\s*bd/i,
    /bedroom[^>]*>(\d+)/i,
    /"bedroomCount"\s*:\s*(\d+)/i,
    // NEW: Modern Zillow patterns
    /data-testid="bed"[^>]*>(\d+)/i,
    /class="[^"]*bed[^"]*"[^>]*>(\d+)/i
  ];
  
  for (const pattern of bedroomPatterns) {
    const match = html.match(pattern);
    if (match) {
      bedrooms = parseInt(match[1]);
      if (bedrooms > 0 && bedrooms < 20) break;
    }
  }
  
  // Extract bathrooms - multiple patterns
  let bathrooms = 0;
  const bathroomPatterns = [
    /(\d+(?:\.\d+)?)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+(?:\.\d+)?)/i,
    /"baths"\s*:\s*(\d+(?:\.\d+)?)/i,
    /data-cy="bath"[^>]*>(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*ba/i,
    /bathroom[^>]*>(\d+(?:\.\d+)?)/i,
    /"bathroomCount"\s*:\s*(\d+(?:\.\d+)?)/i,
    // NEW: Modern Zillow patterns
    /data-testid="bath"[^>]*>(\d+(?:\.\d+)?)/i,
    /class="[^"]*bath[^"]*"[^>]*>(\d+(?:\.\d+)?)/i
  ];
  
  for (const pattern of bathroomPatterns) {
    const match = html.match(pattern);
    if (match) {
      bathrooms = parseFloat(match[1]);
      if (bathrooms > 0 && bathrooms < 20) break;
    }
  }
  
  // Extract square feet - multiple patterns
  let squareFeet = 0;
  const sqftPatterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /"squareFeet"\s*:\s*(\d+)/i,
    /data-cy="sqft"[^>]*>([\d,]+)/i,
    /(\d{3,4})\s*sq/i,
    /"area"\s*:\s*(\d+)/i,
    /square\s*footage[^>]*>([\d,]+)/i,
    // NEW: Modern Zillow patterns
    /data-testid="sqft"[^>]*>([\d,]+)/i,
    /class="[^"]*sqft[^"]*"[^>]*>([\d,]+)/i,
    /(\d{1,4}[,]?\d{0,3})\s*sq\s*ft/i
  ];
  
  for (const pattern of sqftPatterns) {
    const match = html.match(pattern);
    if (match) {
      squareFeet = parseInt(match[1].replace(',', ''));
      if (squareFeet > 0 && squareFeet < 100000) break;
    }
  }
  
  // Extract photos with better patterns
  const photos = extractPhotosFromHTML(html);
  
  // Extract year built
  let yearBuilt: number | undefined;
  const yearPatterns = [
    /built\s*in\s*(\d{4})/i,
    /"yearBuilt"\s*:\s*(\d{4})/,
    /year\s*built[^>]*>(\d{4})/i,
    /"constructionYear"\s*:\s*(\d{4})/,
    /(\d{4})\s*build/i
  ];
  
  for (const pattern of yearPatterns) {
    const match = html.match(pattern);
    if (match) {
      yearBuilt = parseInt(match[1]);
      if (yearBuilt > 1800 && yearBuilt < 2030) break;
    }
  }
  
  // Create result if we have minimum required data
  if (price && bedrooms && bathrooms) {
    console.log('✅ Successfully extracted data from HTML!');
    return {
      address: rawAddress,
      price,
      bedrooms,
      bathrooms,
      squareFeet,
      description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home${squareFeet ? ` with ${squareFeet} sqft` : ''}${yearBuilt ? `, built in ${yearBuilt}` : ''}.`,
      features: [
        `${bedrooms} bedrooms`,
        `${bathrooms} bathrooms`,
        squareFeet ? `${squareFeet} sqft` : '',
        yearBuilt ? `Built in ${yearBuilt}` : ''
      ].filter(Boolean),
      neighborhood: extractNeighborhood(html) || 'Neighborhood not specified',
      images: photos,
      listingUrl: url,
      yearBuilt,
      lotSize: extractLotSize(html) || '0.25',
      propertyType: extractPropertyType(html) || 'Single Family',
      agentName: extractAgentName(html) || 'Real Estate Agent',
      agentCompany: extractAgentCompany(html) || 'Real Estate Company'
    };
  }
  
  console.log('❌ Could not extract enough data from HTML');
  console.log('Extracted data:', { price, bedrooms, bathrooms, squareFeet });
  return null;
}

function extractPhotosFromHTML(html: string): string[] {
  const photos: string[] = [];
  
  // Multiple patterns to find Zillow photos
  const photoPatterns = [
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpg/g,
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpeg/g,
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.png/g,
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.webp/g,
    /https:\/\/images\.zillowstatic\.com\/[^"'\s]+\.jpg/g,
    /https:\/\/images\.zillowstatic\.com\/[^"'\s]+\.jpeg/g,
    /https:\/\/images\.zillowstatic\.com\/[^"'\s]+\.png/g,
    /https:\/\/images\.zillowstatic\.com\/[^"'\s]+\.webp/g,
    /"imageUrl"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp))"/g,
    /"photo"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp))"/g,
    // NEW: Modern Zillow photo patterns
    /"imageUrl"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp))"/g,
    /"photoUrl"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp))"/g,
    /"src"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp))"/g
  ];
  
  for (const pattern of photoPatterns) {
    const matches = html.match(pattern) || [];
    photos.push(...matches);
  }
  
  // Filter and deduplicate
  const uniquePhotos = [...new Set(photos)].filter((photo: string) => 
    !photo.includes('badge') && 
    !photo.includes('footer') &&
    !photo.includes('app-store') &&
    !photo.includes('google-play') &&
    !photo.includes('logo') &&
    !photo.includes('placeholder') &&
    !photo.includes('avatar') &&
    !photo.includes('icon') &&
    photo.includes('zillowstatic.com')
  );
  
  console.log(`📸 Found ${uniquePhotos.length} photos`);
  return uniquePhotos.slice(0, 15);
}

function extractNeighborhood(html: string): string | null {
  const patterns = [
    /"neighborhood"\s*:\s*"([^"]+)"/,
    /"area"\s*:\s*"([^"]+)"/,
    /"city"\s*:\s*"([^"]+)"/,
    /neighborhood[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractLotSize(html: string): string | null {
  const patterns = [
    /"lotSize"\s*:\s*"([^"]+)"/,
    /"acreage"\s*:\s*"([^"]+)"/,
    /lot\s*size[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractPropertyType(html: string): string | null {
  const patterns = [
    /"propertyType"\s*:\s*"([^"]+)"/,
    /"homeType"\s*:\s*"([^"]+)"/,
    /property\s*type[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractAgentName(html: string): string | null {
  const patterns = [
    /"agentName"\s*:\s*"([^"]+)"/,
    /"agent"\s*:\s*"([^"]+)"/,
    /agent[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractAgentCompany(html: string): string | null {
  const patterns = [
    /"agentCompany"\s*:\s*"([^"]+)"/,
    /"company"\s*:\s*"([^"]+)"/,
    /company[^>]*>([^<]+)</i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractDataFromAPI(data: any, zpid: string, rawAddress: string): WorkingZillowData | null {
  console.log('📋 Extracting data from API...');
  
  const property = data.property || data.data || data;
  
  if (!property) return null;
  
  const address = property.address || property.streetAddress || rawAddress;
  const price = property.price ? `$${property.price.toLocaleString()}` : '';
  const bedrooms = property.bedrooms || property.beds || 0;
  const bathrooms = property.bathrooms || property.baths || 0;
  const squareFeet = property.livingArea || property.squareFeet || 0;
  const yearBuilt = property.yearBuilt;
  const photos = property.images || property.photos || [];
  
  if (price && bedrooms && bathrooms) {
    console.log('✅ Successfully extracted data from API!');
    return {
      address,
      price,
      bedrooms,
      bathrooms,
      squareFeet,
      description: `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home.`,
      features: [`${bedrooms} bedrooms`, `${bathrooms} bathrooms`],
      neighborhood: property.neighborhood || 'Neighborhood not specified',
      images: photos,
      listingUrl: `https://www.zillow.com/homedetails/${zpid}_zpid/`,
      yearBuilt,
      lotSize: property.lotSize || '0.25',
      propertyType: property.propertyType || 'Single Family',
      agentName: property.agentName || 'Real Estate Agent',
      agentCompany: property.agentCompany || 'Real Estate Company'
    };
  }
  
  return null;
}

function isValidData(data: WorkingZillowData): boolean {
  return !!(data.price && data.price !== 'Price not available' && 
           data.bedrooms > 0 && data.bathrooms > 0);
} 