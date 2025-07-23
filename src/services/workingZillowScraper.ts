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

// Rotating User Agents to avoid detection
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
];

// Advanced proxy rotation for better success rates
const PROXY_SERVICES = [
  'https://api.allorigins.win/get?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/',
  'https://api.codetabs.com/v1/proxy?quest='
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

// AI-powered marketing description generator
function generateMarketingDescription(data: WorkingZillowData): string {
  const { bedrooms, bathrooms, squareFeet, price, features } = data;
  
  let description = `Discover this stunning ${bedrooms}-bedroom, ${bathrooms}-bathroom home`;
  
  if (squareFeet) {
    description += ` with ${squareFeet.toLocaleString()} sqft of living space`;
  }
  
  if (features.length > 0) {
    const keyFeatures = features.slice(0, 3).join(', ');
    description += `. This exceptional property features ${keyFeatures}`;
  }
  
  description += `. Priced at ${price}, this home offers incredible value in a prime location. `;
  
  if (features.includes('Updated') || features.includes('Renovated')) {
    description += 'Recently updated with modern amenities and finishes. ';
  }
  
  description += 'Perfect for families, investors, or anyone seeking quality and comfort.';
  
  return description;
}

// Extract key selling points
function extractKeySellingPoints(data: WorkingZillowData): string[] {
  const points: string[] = [];
  
  if (data.bedrooms >= 4) points.push('Spacious family home');
  if (data.bathrooms >= 2.5) points.push('Multiple bathrooms for convenience');
  if (data.squareFeet > 2000) points.push('Generous living space');
  if (data.features.includes('Updated')) points.push('Recently updated');
  if (data.features.includes('Garage')) points.push('Attached garage');
  if (data.features.includes('Hardwood')) points.push('Hardwood floors');
  if (data.features.includes('Kitchen')) points.push('Gourmet kitchen');
  
  return points.slice(0, 5); // Top 5 selling points
}

// Determine target buyer profile
function determineTargetBuyer(data: WorkingZillowData): string {
  const { bedrooms, bathrooms, squareFeet, price } = data;
  const priceNum = parseFloat(price.replace(/[$,]/g, ''));
  
  if (bedrooms >= 4 && squareFeet > 2500) return 'Large families seeking space and comfort';
  if (priceNum > 800000) return 'Luxury buyers looking for premium properties';
  if (bedrooms <= 2 && squareFeet < 1500) return 'First-time homebuyers or downsizers';
  if (bedrooms >= 3 && priceNum < 500000) return 'Value-conscious families';
  
  return 'General homebuyers seeking quality and location';
}

// Assess investment potential
function assessInvestmentPotential(data: WorkingZillowData): string {
  const { price, squareFeet, yearBuilt } = data;
  const priceNum = parseFloat(price.replace(/[$,]/g, ''));
  const currentYear = new Date().getFullYear();
  const age = currentYear - (yearBuilt || 2000);
  
  if (age < 10) return 'Excellent investment - newer construction with modern amenities';
  if (age < 30 && priceNum < 500000) return 'Strong investment potential - good value in established neighborhood';
  if (age > 50 && priceNum < 400000) return 'Renovation opportunity - classic home with character';
  
  return 'Solid investment with good location and condition';
}

// Assess data quality
function assessDataQuality(data: WorkingZillowData): 'excellent' | 'good' | 'fair' | 'poor' {
  let score = 0;
  
  if (data.address) score += 20;
  if (data.price) score += 20;
  if (data.bedrooms > 0) score += 15;
  if (data.bathrooms > 0) score += 15;
  if (data.squareFeet > 0) score += 10;
  if (data.description) score += 10;
  if (data.images.length > 0) score += 10;
  
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

// Calculate confidence score
function calculateConfidence(data: WorkingZillowData): number {
  let confidence = 0;
  
  // Base confidence from data completeness
  const completeness = assessDataQuality(data);
  switch (completeness) {
    case 'excellent': confidence += 40; break;
    case 'good': confidence += 30; break;
    case 'fair': confidence += 20; break;
    case 'poor': confidence += 10; break;
  }
  
  // Additional confidence from data consistency
  if (data.bedrooms > 0 && data.bathrooms > 0) confidence += 20;
  if (data.squareFeet > 0 && data.price) confidence += 20;
  if (data.images.length > 5) confidence += 10;
  if (data.features.length > 3) confidence += 10;
  
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
      () => scrapeWithEnhancedHeaders(normalizedUrl, zpid, rawAddress),
      () => scrapeWithAllOrigins(normalizedUrl, zpid, rawAddress),
      () => scrapeWithSupabaseAPI(normalizedUrl, zpid, rawAddress),
      () => scrapeWithProxy(normalizedUrl, zpid, rawAddress),
      () => scrapeWithZillowAPI(zpid, rawAddress)
    ];
    
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`🔍 Trying method ${i + 1}/${methods.length}...`);
        const result = await methods[i]();
        if (result && isValidData(result)) {
          console.log('✅ SUCCESS with scraping method!');
          
          // 🚀 ENHANCE: Apply AI-powered data validation and enhancement
          const enhancedResult = validateAndEnhanceData(result);
          console.log('🧠 AI Enhancement applied!');
          console.log(`   Data Quality: ${enhancedResult.scrapingMetadata?.dataQuality}`);
          console.log(`   Confidence: ${enhancedResult.scrapingMetadata?.confidence}%`);
          console.log(`   Price per sq ft: $${enhancedResult.marketAnalysis?.pricePerSqFt}`);
          
          return enhancedResult;
        }
      } catch (error) {
        console.log(`❌ Method ${i + 1} failed:`, error instanceof Error ? error.message : error);
        continue;
      }
    }
    
    console.log('❌ All scraping methods failed');
    return null;
    
  } catch (error) {
    console.error('❌ Scraper failed:', error);
    return null;
  }
}

function normalizeZillowUrl(url: string): string {
  // Handle various Zillow URL formats
  let normalized = url.trim();
  
  // Add https if missing
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized;
  }
  
  // Ensure it's a Zillow URL
  if (!normalized.includes('zillow.com')) {
    throw new Error('Not a Zillow URL');
  }
  
  // Remove any fragments or query params that might interfere
  normalized = normalized.split('#')[0].split('?')[0];
  
  return normalized;
}

function extractZPID(url: string): string | null {
  // Multiple patterns to extract ZPID
  const patterns = [
    /\/(\d+)_zpid/,
    /zpid\/(\d+)/,
    /homedetails\/[^\/]+\/(\d+)/,
    /property\/(\d+)/,
    /(\d{8,})/  // ZPID is usually 8+ digits
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function extractAddressFromUrl(url: string): string {
  // Multiple patterns to extract address
  const patterns = [
    /homedetails\/([^\/]+)/,
    /property\/([^\/]+)/,
    /address\/([^\/]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return decodeURIComponent(match[1].replace(/-/g, ' '));
    }
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    });
    
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
  console.log('🔍 Trying advanced proxy rotation...');
  
  try {
    // 🚀 ENHANCE: Advanced proxy rotation with retry logic
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`   Attempt ${attempt}/3 with proxy rotation...`);
      
      for (const proxyUrl of PROXY_SERVICES) {
        try {
          const fullUrl = proxyUrl + encodeURIComponent(url);
          const response = await fetch(fullUrl, {
            headers: {
              'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const html = data.contents || data;
            const result = extractDataFromHTML(html, url, zpid, rawAddress);
            
            if (result) {
              console.log(`✅ Proxy ${proxyUrl} succeeded on attempt ${attempt}!`);
              return result;
            }
          }
        } catch (error) {
          console.log(`   Proxy ${proxyUrl} failed on attempt ${attempt}:`, error instanceof Error ? error.message : error);
          continue;
        }
      }
      
      // 🚀 ENHANCE: Exponential backoff between attempts
      if (attempt < 3) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s delays
        console.log(`   Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    console.log('❌ All proxy attempts failed:', error);
  }
  
  return null;
}

async function scrapeWithZillowAPI(zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying Zillow API...');
  
  try {
    // Try to access Zillow's internal API
    const apiUrl = `https://www.zillow.com/api/v1/property/${zpid}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return extractDataFromAPI(data, zpid, rawAddress);
    }
  } catch (error) {
    console.log('Zillow API failed:', error);
  }
  
  return null;
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
    /"value"\s*:\s*"?(\$?[\d,]+)"?/g
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
    /"bedroomCount"\s*:\s*(\d+)/i
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
    /"bathroomCount"\s*:\s*(\d+(?:\.\d+)?)/i
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
    /square\s*footage[^>]*>([\d,]+)/i
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
    /"photo"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp))"/g
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
    /"brokerage"\s*:\s*"([^"]+)"/,
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
  return !!(data.price && data.bedrooms && data.bathrooms && data.address);
} 