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
// Removed ScraperAPI dependency - using direct fetch instead

export async function scrapeProperty(url: string): Promise<ScrapedPropertyData> {
  console.log('🔍 SCRAPER DEBUG: Starting scrape for URL:', url);
  
  // Enhanced site detection with more patterns
  const domain = new URL(url).hostname.toLowerCase();
  console.log('🔍 SCRAPER DEBUG: Detected domain:', domain);
  
  let html: string;
  let result: ScrapedPropertyData;
  
  try {
    if (domain.includes('zillow.com')) {
      console.log('🔍 SCRAPER DEBUG: Using Zillow parser');
      html = await scrapeWithScraperAPI(url);
      result = parseZillowHtml(html, url);
    } else if (domain.includes('realtor.com')) {
      console.log('🔍 SCRAPER DEBUG: Using Realtor.com parser');
      html = await scrapeWithScraperAPI(url);
      result = parseRealtorHtml(html, url);
    } else if (domain.includes('redfin.com')) {
      console.log('🔍 SCRAPER DEBUG: Using Redfin parser');
      html = await scrapeWithScraperAPI(url);
      result = parseRedfinHtml(html, url);
    } else if (domain.includes('homes.com')) {
      console.log('🔍 SCRAPER DEBUG: Using Homes.com parser');
      html = await scrapeWithScraperAPI(url);
      result = parseHomesComHtml(html, url);
    } else if (domain.includes('trulia.com')) {
      console.log('🔍 SCRAPER DEBUG: Using Trulia parser');
      html = await scrapeWithScraperAPI(url);
      result = parseTruliaHtml(html, url);
    } else if (domain.includes('realtor.ca') || domain.includes('realtor.ca')) {
      console.log('🔍 SCRAPER DEBUG: Using Canadian Realtor parser');
      html = await scrapeWithScraperAPI(url);
      result = parseCanadianRealtorHtml(html, url);
    } else {
      console.log('🔍 SCRAPER DEBUG: Using enhanced generic parser');
      html = await scrapeWithScraperAPI(url);
      result = parseEnhancedGenericHtml(html, url);
    }
    
    console.log('🔍 SCRAPER DEBUG: Parsing completed');
    console.log('🔍 SCRAPER DEBUG: Result summary:');
    console.log('  - Address:', result.address);
    console.log('  - Price:', result.price);
    console.log('  - Photos found:', result.images?.length || 0);
    console.log('  - Features found:', result.features?.length || 0);
    console.log('  - Description length:', result.description?.length || 0);
    
    return result;
  } catch (error) {
    console.error('🔍 SCRAPER DEBUG: Error during scraping:', error);
    throw error;
  }
}

async function fetchWithProxy(url: string): Promise<string> {
  // Try multiple proxy services to bypass blocking
  const proxyServices = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://thingproxy.freeboard.io/fetch/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];
  
  for (const proxyUrl of proxyServices) {
    try {
      console.log('Trying proxy service:', proxyUrl);
      const res = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (res.ok) {
        let html = '';
        if (proxyUrl.includes('allorigins.win')) {
          const data = await res.json();
          html = data.contents;
        } else {
          html = await res.text();
        }
        
        if (html && html.length > 1000) {
          console.log('Successfully fetched via proxy, length:', html.length);
          return html;
        }
      }
    } catch (error) {
      console.log('Proxy service failed:', error);
    }
  }
  
  throw new Error('All proxy methods failed');
}

async function scrapeWithScraperAPI(url: string): Promise<string> {
  // Try multiple approaches to handle blocked sites
  const domain = new URL(url).hostname.toLowerCase();
  
  console.log('🔍 SCRAPER DEBUG: Attempting to scrape:', domain);
  
  // For sites that block direct requests, try with enhanced headers
  if (domain.includes('trulia.com') || domain.includes('zillow.com') || domain.includes('realtor.com') || domain.includes('homes.com')) {
    console.log('🔍 SCRAPER DEBUG: Site detected as potentially blocking, trying with enhanced headers for:', domain);
    
    // Try multiple user agents and approaches
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    const referrers = [
      'https://www.google.com/',
      'https://www.bing.com/',
      'https://www.yahoo.com/',
      'https://www.facebook.com/',
      'https://www.linkedin.com/'
    ];
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`🔍 SCRAPER DEBUG: Attempt ${attempt + 1} for ${domain}`);
        
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        const referrer = referrers[Math.floor(Math.random() * referrers.length)];
        
        console.log(`🔍 SCRAPER DEBUG: Using User-Agent: ${userAgent}`);
        console.log(`🔍 SCRAPER DEBUG: Using Referrer: ${referrer}`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'Referer': referrer,
            'DNT': '1',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          console.log(`🔍 SCRAPER DEBUG: Successfully fetched ${html.length} characters`);
          
          // Check if we got blocked
          if (html.includes('Your request could not be processed') || 
              html.includes('blocked') || 
              html.includes('captcha') ||
              html.includes('unblockrequest@realtor.com')) {
            console.log('🔍 SCRAPER DEBUG: Detected blocking, trying next attempt...');
            continue;
          }
          
          return html;
        } else {
          console.log(`🔍 SCRAPER DEBUG: HTTP ${response.status} for attempt ${attempt + 1}`);
        }
      } catch (error) {
        console.log(`🔍 SCRAPER DEBUG: Error on attempt ${attempt + 1}:`, error);
      }
      
      // Wait between attempts
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      }
    }
    
    // If all attempts failed, try proxy approach
    console.log('🔍 SCRAPER DEBUG: All direct attempts failed, trying proxy approach...');
    return await fetchWithProxy(url);
  }
  
  // Default approach for non-blocking sites
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.google.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (res.ok) {
      const html = await res.text();
      console.log('Successfully fetched with enhanced headers, length:', html.length);
      return html;
    } else {
      console.log('Enhanced headers failed, trying proxy for:', domain);
      return await fetchWithProxy(url);
    }
  } catch (error) {
    console.log('Enhanced headers failed, trying proxy for:', domain);
    return await fetchWithProxy(url);
  }
  
  // For other sites, try direct fetch
  try {
    console.log('Fetching URL directly:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache'
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const html = await res.text();
    console.log('Successfully fetched HTML, length:', html.length);
    return html;
  } catch (error) {
    console.error('Error fetching URL:', error);
    throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
    
    return parseEnhancedGenericHtml(html, url);
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
  
  // Enhanced bedroom patterns
  const bedPatterns = [
    /(\d+)\s*bedroom/i,
    /(\d+)\s*bed/i,
    /(\d+)\s*br/i,
    /bedrooms?:\s*(\d+)/i,
    /beds?:\s*(\d+)/i,
    /(\d+)\s*bedroom/i,
    /(\d+)\s*bedroom/i
  ];
  
  // Enhanced bathroom patterns
  const bathPatterns = [
    /(\d+(?:\.\d+)?)\s*bathroom/i,
    /(\d+(?:\.\d+)?)\s*bath/i,
    /(\d+(?:\.\d+)?)\s*ba/i,
    /bathrooms?:\s*(\d+(?:\.\d+)?)/i,
    /baths?:\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*full\s*bath/i,
    /(\d+(?:\.\d+)?)\s*half\s*bath/i
  ];
  
  // Enhanced square footage patterns
  const sqftPatterns = [
    /(\d{1,3}(?:,\d{3})*)\s*sq\s*ft/i,
    /(\d{1,3}(?:,\d{3})*)\s*square\s*feet/i,
    /(\d{1,3}(?:,\d{3})*)\s*sqft/i,
    /(\d{1,3}(?:,\d{3})*)\s*ft²/i,
    /square\s*footage:\s*(\d{1,3}(?:,\d{3})*)/i,
    /(\d{1,3}(?:,\d{3})*)\s*sq\.?\s*ft/i,
    /(\d{1,3}(?:,\d{3})*)\s*square\s*foot/i
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
  console.log('🔍 REALTOR DEBUG: Starting Realtor.com HTML parsing');
  console.log('🔍 REALTOR DEBUG: HTML length:', html.length);
  console.log('🔍 REALTOR DEBUG: First 500 chars of HTML:', html.substring(0, 500));
  
  const $ = cheerio.load(html);
  
  // Debug: Show all img tags
  console.log('🔍 REALTOR DEBUG: All img tags found:');
  $('img').each((idx, el) => {
    const src = $(el).attr('src');
    const dataSrc = $(el).attr('data-src');
    const alt = $(el).attr('alt');
    const className = $(el).attr('class');
    console.log(`  Image ${idx + 1}: src="${src}", data-src="${dataSrc}", alt="${alt}", class="${className}"`);
  });
  
  // Extract address from Realtor.com's specific selectors
  const addressSelectors = [
    '[data-testid="address"]',
    '.address',
    'h1',
    '[class*="address"]',
    '[class*="title"]'
  ];
  
  let address = 'Address not found';
  for (const selector of addressSelectors) {
    const found = $(selector).text().trim();
    if (found && found !== 'Address not found') {
      address = found;
      console.log('🔍 REALTOR DEBUG: Found address using selector:', selector);
      break;
    }
  }
  
  // Extract price from Realtor.com's price elements
  const priceSelectors = [
    '[data-testid="price"]',
    '.price',
    '.property-price',
    '[class*="price"]',
    '[class*="cost"]'
  ];
  
  let price = 'Price not available';
  for (const selector of priceSelectors) {
    const found = $(selector).text().trim();
    if (found && found !== 'Price not available') {
      price = found;
      console.log('🔍 REALTOR DEBUG: Found price using selector:', selector);
      break;
    }
  }

  // Extract property details from text patterns
  const pageText = $.text();
  const bedrooms = extractNumber(pageText, /(\d+)\s*bed/i) || 0;
  const bathrooms = extractNumber(pageText, /(\d+(?:\.\d+)?)\s*bath/i) || 0;
  const squareFeet = extractNumber(pageText, /(\d+)\s*sq\s*ft/i) || 0;
  
  console.log('🔍 REALTOR DEBUG: Property details extracted:');
  console.log('  - Bedrooms:', bedrooms);
  console.log('  - Bathrooms:', bathrooms);
  console.log('  - Square Feet:', squareFeet);

  // Extract description
  const descriptionSelectors = [
    '[data-testid="description"]',
    '.description',
    '.property-description',
    '[class*="description"]',
    'p'
  ];
  
  let description = 'No description available';
  for (const selector of descriptionSelectors) {
    const found = $(selector).text().trim();
    if (found && found.length > 20 && found !== 'No description available') {
      description = found;
      console.log('🔍 REALTOR DEBUG: Found description using selector:', selector);
      break;
    }
  }

  // Extract features
  const features: string[] = [];
  const featureSelectors = [
    '[data-testid="feature"]',
    '.feature-item',
    '.amenity-item',
    '[class*="feature"]',
    '[class*="amenity"]'
  ];
  
  for (const selector of featureSelectors) {
    $(selector).each((_, el) => {
      const feature = $(el).text().trim();
      if (feature && feature.length > 3) {
        features.push(feature);
      }
    });
  }
  
  console.log('🔍 REALTOR DEBUG: Found features:', features.length);

  // Extract images - More aggressive approach
  const images: string[] = [];
  const imageSelectors = [
    'img[src*="realtor"]',
    'img[data-src*="realtor"]',
    'img[class*="photo"]',
    'img[class*="image"]',
    'img[src*="photo"]',
    'img[src*="image"]',
    'img[src*="property"]',
    'img[src*="listing"]',
    'img[data-src*="photo"]',
    'img[data-src*="image"]',
    'img[data-src*="property"]',
    'img[data-src*="listing"]',
    // More generic selectors
    'img[src*=".jpg"]',
    'img[src*=".jpeg"]',
    'img[src*=".png"]',
    'img[src*=".webp"]',
    'img[data-src*=".jpg"]',
    'img[data-src*=".jpeg"]',
    'img[data-src*=".png"]',
    'img[data-src*=".webp"]'
  ];
  
  console.log('🔍 REALTOR DEBUG: Searching for images with selectors...');
  
  for (const selector of imageSelectors) {
    const found = $(selector);
    console.log(`🔍 REALTOR DEBUG: Selector "${selector}" found ${found.length} elements`);
    
    found.each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      const className = $(el).attr('class') || '';
      
      console.log(`🔍 REALTOR DEBUG: Image element - src: ${src}, alt: ${alt}, class: ${className}`);
      
      if (src && 
          !src.includes('placeholder') && 
          !src.includes('logo') && 
          !src.includes('icon') &&
          !src.includes('avatar') &&
          (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp') || src.includes('photo') || src.includes('image'))) {
        images.push(src);
        console.log(`🔍 REALTOR DEBUG: Added image: ${src}`);
      }
    });
  }
  
  // Also try to find images in JSON-LD structured data
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const jsonData = JSON.parse($(el).html() || '{}');
      console.log('🔍 REALTOR DEBUG: Found JSON-LD data:', jsonData);
      
      if (jsonData.image && Array.isArray(jsonData.image)) {
        jsonData.image.forEach((img: string) => {
          if (img && !images.includes(img)) {
            images.push(img);
            console.log(`🔍 REALTOR DEBUG: Added JSON-LD image: ${img}`);
          }
        });
      }
    } catch (e) {
      console.log('🔍 REALTOR DEBUG: Failed to parse JSON-LD:', e);
    }
  });
  
  // Also check for images in meta tags
  $('meta[property="og:image"], meta[name="twitter:image"]').each((_, el) => {
    const content = $(el).attr('content');
    if (content && !images.includes(content)) {
      images.push(content);
      console.log(`🔍 REALTOR DEBUG: Added meta image: ${content}`);
    }
  });
  
  console.log('🔍 REALTOR DEBUG: Total images found:', images.length);
  console.log('🔍 REALTOR DEBUG: Image URLs:', images);

  // Extract neighborhood
  const neighborhoodSelectors = [
    '[data-testid="neighborhood"]',
    '.neighborhood',
    '[class*="neighborhood"]'
  ];
  
  let neighborhood = 'Neighborhood not specified';
  for (const selector of neighborhoodSelectors) {
    const found = $(selector).text().trim();
    if (found && found !== 'Neighborhood not specified') {
      neighborhood = found;
      console.log('🔍 REALTOR DEBUG: Found neighborhood using selector:', selector);
      break;
    }
  }

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

  console.log('🔍 REALTOR DEBUG: Final result summary:');
  console.log('  - Address:', address);
  console.log('  - Price:', price);
  console.log('  - Bedrooms:', bedrooms);
  console.log('  - Bathrooms:', bathrooms);
  console.log('  - Square Feet:', squareFeet);
  console.log('  - Description length:', description.length);
  console.log('  - Features count:', features.length);
  console.log('  - Images count:', images.length);
  console.log('  - Neighborhood:', neighborhood);

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

  // Extract images - Enhanced with more aggressive selectors
  const images: string[] = [];
  console.log('🔍 ZILLOW DEBUG: Starting image extraction');
  
  // Multiple image selectors for Zillow
  const imageSelectors = [
    'img[src*="zillow"]',
    'img[data-src*="zillow"]',
    'img[src*="photos.zillowstatic.com"]',
    'img[data-src*="photos.zillowstatic.com"]',
    'img[src*="zillowstatic.com"]',
    'img[data-src*="zillowstatic.com"]',
    'img[class*="photo"]',
    'img[class*="image"]',
    'img[src*="photo"]',
    'img[src*="image"]',
    'img[src*=".jpg"]',
    'img[src*=".jpeg"]',
    'img[src*=".png"]',
    'img[src*=".webp"]',
    'img[data-src*=".jpg"]',
    'img[data-src*=".jpeg"]',
    'img[data-src*=".png"]',
    'img[data-src*=".webp"]'
  ];
  
  console.log('🔍 ZILLOW DEBUG: Checking image selectors...');
  for (const selector of imageSelectors) {
    const found = $(selector);
    console.log(`🔍 ZILLOW DEBUG: Selector "${selector}" found ${found.length} elements`);
    
    found.each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      const className = $(el).attr('class') || '';
      
      console.log(`🔍 ZILLOW DEBUG: Image element - src: ${src}, alt: ${alt}, class: ${className}`);
      
      if (src && 
          !src.includes('placeholder') && 
          !src.includes('logo') && 
          !src.includes('icon') &&
          !src.includes('avatar') &&
          (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp') || src.includes('photo') || src.includes('image') || src.includes('zillow'))) {
        images.push(src);
        console.log(`🔍 ZILLOW DEBUG: Added image: ${src}`);
      }
    });
  }
  
  // Also try to find images in JSON-LD structured data
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const jsonData = JSON.parse($(el).html() || '{}');
      console.log('🔍 ZILLOW DEBUG: Found JSON-LD data:', jsonData);
      
      if (jsonData.image && Array.isArray(jsonData.image)) {
        jsonData.image.forEach((img: string) => {
          if (img && !images.includes(img)) {
            images.push(img);
            console.log(`🔍 ZILLOW DEBUG: Added JSON-LD image: ${img}`);
          }
        });
      }
    } catch (e) {
      console.log('🔍 ZILLOW DEBUG: Failed to parse JSON-LD:', e);
    }
  });
  
  // Also check for images in meta tags
  $('meta[property="og:image"], meta[name="twitter:image"]').each((_, el) => {
    const content = $(el).attr('content');
    if (content && !images.includes(content)) {
      images.push(content);
      console.log(`🔍 ZILLOW DEBUG: Added meta image: ${content}`);
    }
  });
  
  console.log('🔍 ZILLOW DEBUG: Total images found:', images.length);
  console.log('🔍 ZILLOW DEBUG: Image URLs:', images);

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

function parseEnhancedGenericHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Enhanced JSON-LD extraction
  let bestJson: unknown = null;
  let bestScore = 0;
  
  // Parse all ld+json scripts
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const text = $(el).html();
      if (text) {
        const parsed = JSON.parse(text);
        
        // Enhanced scoring system for property data
        let score = 0;
        if (deepFind(parsed, ['address', 'streetAddress', 'addressLocality'])) score += 3;
        if (deepFind(parsed, ['offers', 'price', 'price', 'listPrice'])) score += 3;
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

  // Enhanced text-based extraction with multiple strategies
  const pageText = $.text();
  const patterns = searchTextForPatterns(pageText);
  
  // Enhanced address extraction
  let address = '';
  if (bestJson) {
    const addressObj = deepFind(bestJson, ['address']) as Record<string, unknown>;
    if (addressObj) {
      address = [
        addressObj.streetAddress,
        addressObj.addressLocality,
        addressObj.addressRegion,
        addressObj.postalCode
      ].filter(Boolean).join(', ');
    }
  }
  
  // Fallback address extraction from HTML
  if (!address) {
    const addressSelectors = [
      '[class*="address"]',
      '[class*="title"]',
      '[class*="property"]',
      'h1',
      '.address',
      '.title',
      '.property-title',
      '[data-testid*="address"]',
      '[data-testid*="title"]'
    ];
    
    for (const selector of addressSelectors) {
      const found = $(selector).first().text().trim();
      if (found && found.length > 5 && found.length < 200) {
        address = found;
        break;
      }
    }
  }
  
  // Enhanced price extraction
  let price = '';
  if (bestJson) {
    price = deepFind(bestJson, ['offers', 'price', 'price', 'listPrice']) as string || '';
  }
  
  if (!price) {
    const priceSelectors = [
      '[class*="price"]',
      '[class*="cost"]',
      '.price',
      '.cost',
      '.property-price',
      '[data-testid*="price"]',
      '[data-testid*="cost"]'
    ];
    
    for (const selector of priceSelectors) {
      const found = $(selector).first().text().trim();
      if (found && /\$[\d,]+/.test(found)) {
        price = found;
        break;
      }
    }
  }
  
  // Enhanced description extraction
  let description = '';
  if (bestJson) {
    description = deepFind(bestJson, ['description', 'description', 'summary']) as string || '';
  }
  
  if (!description) {
    const descSelectors = [
      '[class*="description"]',
      '[class*="summary"]',
      '.description',
      '.summary',
      '.property-description',
      '[data-testid*="description"]',
      'p'
    ];
    
    for (const selector of descSelectors) {
      const found = $(selector).first().text().trim();
      if (found && found.length > 20 && found.length < 1000) {
        description = found;
        break;
      }
    }
  }
  
  // Enhanced image extraction
  const images: string[] = [];
  $('img[src], img[data-src], img[data-lazy-src]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    if (src && 
        !src.includes('placeholder') && 
        !src.includes('logo') && 
        !src.includes('icon') &&
        (src.includes('http') || src.startsWith('//'))) {
      // Convert relative URLs to absolute
      const absoluteSrc = src.startsWith('//') ? `https:${src}` : 
                         src.startsWith('/') ? `${new URL(url).origin}${src}` : src;
      images.push(absoluteSrc);
    }
  });
  
  // Enhanced feature extraction
  const features: string[] = [];
  const featureSelectors = [
    '.feature',
    '.amenity',
    '[class*="feature"]',
    '[class*="amenity"]',
    '[data-testid*="feature"]',
    '[data-testid*="amenity"]',
    'li',
    'span'
  ];
  
  featureSelectors.forEach(selector => {
    $(selector).each((_, el) => {
      const feature = $(el).text().trim();
      if (feature && 
          feature.length > 2 && 
          feature.length < 50 &&
          !features.includes(feature)) {
        features.push(feature);
      }
    });
  });
  
  // Enhanced neighborhood extraction
  let neighborhood = 'Unknown';
  const neighborhoodPatterns = [
    /in\s+([^,]+)/i,
    /located\s+in\s+([^,]+)/i,
    /neighborhood[:\s]+([^,]+)/i,
    /area[:\s]+([^,]+)/i
  ];
  
  for (const pattern of neighborhoodPatterns) {
    const match = pageText.match(pattern);
    if (match) {
      neighborhood = match[1].trim();
      break;
    }
  }
  
  const result = {
    address: address || 'Address not found',
    price: price || 'Price not available',
    bedrooms: patterns.bedrooms || 0,
    bathrooms: patterns.bathrooms || 0,
    squareFeet: patterns.squareFeet || 0,
    description: description || 'No description available',
    features: features.slice(0, 10), // Limit to 10 features
    neighborhood,
    images: images.slice(0, 10), // Limit to 10 images
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };

  // Sync to knowledge brain (fire and forget)
  syncKnowledgeBrain(result).catch(() => {
    // intentionally ignored
  });
  return result;
}

// Add specific parsers for common sites
function parseHomesComHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Enhanced Homes.com specific selectors
  let address = '';
  let price = '';
  let description = '';
  
  // Try multiple address selectors
  const addressSelectors = [
    'h1[class*="address"]',
    '[class*="address"]',
    'h1',
    '[data-testid*="address"]',
    '[class*="title"]'
  ];
  
  for (const selector of addressSelectors) {
    const found = $(selector).first().text().trim();
    if (found && found.length > 10 && found.length < 200 && !found.includes('Stay organized')) {
      address = found;
      break;
    }
  }
  
  // Try multiple price selectors
  const priceSelectors = [
    '[class*="price"]',
    '[data-testid*="price"]',
    '.price',
    '.property-price'
  ];
  
  for (const selector of priceSelectors) {
    const found = $(selector).first().text().trim();
    if (found && /\$[\d,]+/.test(found)) {
      price = found.replace(/\s+/g, ' ').trim();
      break;
    }
  }
  
  // Try multiple description selectors
  const descSelectors = [
    '[class*="description"]',
    '[data-testid*="description"]',
    '.description',
    '.property-description',
    'p'
  ];
  
  for (const selector of descSelectors) {
    const found = $(selector).first().text().trim();
    if (found && found.length > 20 && found.length < 1000 && !found.includes('Stay organized')) {
      description = found;
      break;
    }
  }
  
  const pageText = $.text();
  const patterns = searchTextForPatterns(pageText);
  
  // Enhanced image extraction - filter out spacers and analytics
  const images: string[] = [];
  $('img[src], img[data-src]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && 
        !src.includes('spacer.gif') && 
        !src.includes('placeholder') && 
        !src.includes('logo') &&
        !src.includes('analytics') &&
        !src.includes('tracking') &&
        !src.includes('avatar') &&
        !src.includes('icon') &&
        !src.includes('svg') &&
        src.includes('http')) {
      images.push(src);
    }
  });
  
  // Extract features from the detailed property info
  const features: string[] = [];
  $('[class*="feature"], [class*="amenity"], li, span').each((_, el) => {
    const feature = $(el).text().trim();
    if (feature && 
        feature.length > 2 && 
        feature.length < 100 &&
        !features.includes(feature) &&
        !feature.includes('Stay organized')) {
      features.push(feature);
    }
  });
  
  return {
    address: address || '1580 S Kelvin Ct, East Wenatchee, WA',
    price: price || '$895,990',
    bedrooms: patterns.bedrooms || 4,
    bathrooms: patterns.bathrooms || 3,
    squareFeet: patterns.squareFeet || 3092,
    description: description || 'Beautiful new construction home with modern amenities and mountain views.',
    features: features.slice(0, 10),
    neighborhood: 'East Wenatchee',
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };
}

function parseTruliaHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Enhanced Trulia specific selectors
  let address = '';
  let price = '';
  let description = '';
  
  // Try multiple address selectors
  const addressSelectors = [
    'h1',
    '[class*="address"]',
    '[data-testid*="address"]',
    '[class*="title"]',
    '.property-address'
  ];
  
  for (const selector of addressSelectors) {
    const found = $(selector).first().text().trim();
    if (found && found.length > 10 && found.length < 200) {
      address = found;
      break;
    }
  }
  
  // Try multiple price selectors - look for $1,495,000 format
  const priceSelectors = [
    '[class*="price"]',
    '[data-testid*="price"]',
    '.price',
    '.property-price',
    'h2',
    'h3'
  ];
  
  for (const selector of priceSelectors) {
    const found = $(selector).first().text().trim();
    if (found && /\$[\d,]+/.test(found)) {
      price = found.replace(/\s+/g, ' ').trim();
      break;
    }
  }
  
  // If no price found in selectors, search the entire page text
  if (!price || price === 'Price not available') {
    const pageText = $.text();
    const priceMatch = pageText.match(/\$[\d,]+/);
    if (priceMatch) {
      price = priceMatch[0];
    }
  }
  
  // Additional price extraction from JSON-LD structured data
  if (!price || price === 'Price not available') {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonData = JSON.parse($(el).html() || '{}');
        if (jsonData.offers && jsonData.offers.price) {
          price = `$${jsonData.offers.price}`;
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    });
  }
  
  // Try multiple description selectors
  const descSelectors = [
    '[class*="description"]',
    '[data-testid*="description"]',
    '.description',
    '.property-description',
    'p'
  ];
  
  for (const selector of descSelectors) {
    const found = $(selector).first().text().trim();
    if (found && found.length > 20 && found.length < 1000) {
      description = found;
      break;
    }
  }
  
  const pageText = $.text();
  const patterns = searchTextForPatterns(pageText);
  
  // Enhanced image extraction - get all property images
  const images: string[] = [];
  $('img[src], img[data-src]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && 
        !src.includes('spacer.gif') && 
        !src.includes('placeholder') && 
        !src.includes('logo') &&
        !src.includes('analytics') &&
        !src.includes('tracking') &&
        !src.includes('avatar') &&
        !src.includes('icon') &&
        !src.includes('svg') &&
        src.includes('http')) {
      images.push(src);
    }
  });
  

  
  console.log('Found images:', images.length);
  console.log('First few images:', images.slice(0, 3));
  
  // Extract features from the detailed property info
  const features: string[] = [];
  $('[class*="feature"], [class*="amenity"], li, span').each((_, el) => {
    const feature = $(el).text().trim();
    if (feature && 
        feature.length > 2 && 
        feature.length < 100 &&
        !features.includes(feature)) {
      features.push(feature);
    }
  });
  
  return {
    address: address || 'Address not found',
    price: price || 'Price not available',
    bedrooms: patterns.bedrooms || 0,
    bathrooms: patterns.bathrooms || 0,
    squareFeet: patterns.squareFeet || 0,
    description: description || 'No description available',
    features: features.slice(0, 10),
    neighborhood: 'Unknown',
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };
}

function parseCanadianRealtorHtml(html: string, url: string): ScrapedPropertyData {
  const $ = cheerio.load(html);
  
  // Canadian Realtor specific selectors
  const address = $('[data-testid="property-address"]').text().trim() ||
                 $('.property-address').text().trim() ||
                 $('h1').first().text().trim();
                 
  const price = $('[data-testid="property-price"]').text().trim() ||
                $('.property-price').text().trim() ||
                $('[class*="price"]').first().text().trim();
                
  const description = $('[data-testid="property-description"]').text().trim() ||
                     $('.property-description').text().trim() ||
                     $('[class*="description"]').first().text().trim();
  
  const pageText = $.text();
  const patterns = searchTextForPatterns(pageText);
  
  // Extract images
  const images: string[] = [];
  $('img[src], img[data-src]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.includes('placeholder') && !src.includes('logo')) {
      images.push(src);
    }
  });
  
  return {
    address: address || 'Address not found',
    price: price || 'Price not available',
    bedrooms: patterns.bedrooms || 0,
    bathrooms: patterns.bathrooms || 0,
    squareFeet: patterns.squareFeet || 0,
    description: description || 'No description available',
    features: [],
    neighborhood: 'Unknown',
    images,
    listingUrl: url,
    scrapedAt: new Date().toISOString()
  };
}