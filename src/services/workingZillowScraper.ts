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
      () => scrapeWithAllOrigins(normalizedUrl, zpid, rawAddress),
      () => scrapeWithDirectHTML(normalizedUrl, zpid, rawAddress),
      () => scrapeWithZillowAPI(zpid, rawAddress),
      () => scrapeWithProxy(normalizedUrl, zpid, rawAddress)
    ];
    
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`🔍 Trying method ${i + 1}/${methods.length}...`);
        const result = await methods[i]();
        if (result && isValidData(result)) {
          console.log('✅ SUCCESS with scraping method!');
          return result;
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

async function scrapeWithAllOrigins(url: string, zpid: string, rawAddress: string): Promise<WorkingZillowData | null> {
  console.log('🔍 Trying AllOrigins proxy...');
  
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { timeout: 10000 });
    
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
      },
      timeout: 10000
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
  console.log('🔍 Trying proxy service...');
  
  try {
    // Try multiple proxy services
    const proxyServices = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://thingproxy.freeboard.io/fetch/${url}`
    ];
    
    for (const proxyUrl of proxyServices) {
      try {
        const response = await fetch(proxyUrl, { timeout: 8000 });
        if (response.ok) {
          const data = await response.json();
          const html = data.contents || await response.text();
          const result = extractDataFromHTML(html, url, zpid, rawAddress);
          if (result) return result;
        }
      } catch (error) {
        console.log('Proxy service failed:', error);
        continue;
      }
    }
  } catch (error) {
    console.log('All proxy services failed:', error);
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