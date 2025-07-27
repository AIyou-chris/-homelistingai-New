// @ts-ignore: Ignore linter error for Deno import
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

async function fetchWithProxy(url: string, proxyConfig: any) {
  const { host, port, auth } = proxyConfig;
  const proxyUrl = `http://${auth.username}:${auth.password}@${host}:${port}`;
  const response = await fetch(url, {
    headers: {
      'Proxy-Authorization': `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
      'Proxy-Connection': 'Keep-Alive'
    }
  });
  return response;
}

serve(async (req: Request) => {
  try {
    console.log('Function invoked')
    const { url } = await req.json()
    console.log('URL received:', url)

    if (!url) {
      console.log('No URL provided')
      return new Response(
        JSON.stringify({ error: 'Missing URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let response
    let html = ''
    
    try {
      // Use proxy for Zillow scraping
      const proxyConfig = {
        host: 'gw.dataimpulse.com',
        port: 823,
        auth: {
          username: 'aichris@anaiyou.com',
          password: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmRhdGFpbXB1bHNlLmNvbVwvcmVzZWxsZXJcL3VzZXJcL3Rva2VuXC9nZXQiLCJpYXQiOjE3NDk4NjAzNjksImV4cCI6MTc0OTk0Njc2OSwibmJmIjoxNzQ5ODYwMzY5LCJqdGkiOiJzZTJKdTZQaFBQNzNGU3dWIiwic3ViIjoxNTkzMjEsInBydiI6IjgwMTZkNDE2YWNhOTI4NjVmODhlNTg4MzQzOWM2OTkxZjM4MzRjZjUifQ.h6WwIOtvJvGTbgFsxWQ_-cC2iBaPWw3Ca-ElLMhOgYk'
        }
      };
      response = await fetchWithProxy(url, proxyConfig);
      html = await response.text();
      console.log('Successfully fetched with proxy, HTML length:', html.length);
    } catch (err: unknown) {
      console.error('Primary URL fetch failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      
      // Try AllOrigins as fallback
      try {
        const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const allOriginsResponse = await fetch(allOriginsUrl);
        const allOriginsData = await allOriginsResponse.json();
        html = allOriginsData.contents;
        console.log('Successfully fetched with AllOrigins, HTML length:', html.length);
      } catch (fallbackErr: unknown) {
        console.error('AllOrigins fallback failed:', JSON.stringify(fallbackErr, Object.getOwnPropertyNames(fallbackErr)));
        return new Response(
          JSON.stringify({
            error: 'Both primary and fallback fetch failed',
            details: fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Extract data using modern Zillow patterns
    const extractedData = extractZillowData(html, url);
    
    console.log('Scraping complete, extracted data:', extractedData);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error occurred:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to scrape listing',
        stack: error instanceof Error ? error.stack : error
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

function extractZillowData(html: string, url: string) {
  console.log('Extracting Zillow data from HTML...');
  
  // Extract address from URL
  const addressMatch = url.match(/homedetails\/([^\/]+)/);
  const address = addressMatch ? addressMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Address not found';
  
  // Extract price - multiple modern patterns
  let price = 'Price not available';
  const pricePatterns = [
    /\$[\d,]+/g,
    /"price"\s*:\s*"?(\$?[\d,]+)"?/g,
    /"listPrice"\s*:\s*"?(\$?[\d,]+)"?/g,
    /"price"\s*:\s*(\d+)/g,
    /data-cy="price"[^>]*>\s*\$?([\d,]+)/g,
    /class="[^"]*price[^"]*"[^>]*>\s*\$?([\d,]+)/g,
    /price[^>]*>\s*\$?([\d,]+)/g,
    /"value"\s*:\s*"?(\$?[\d,]+)"?/g,
    // Modern Zillow patterns
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
      if (price !== 'Price not available') break;
    }
  }
  
  // Extract bedrooms
  let bedrooms = 0;
  const bedroomPatterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /"beds"\s*:\s*(\d+)/i,
    /data-cy="bed"[^>]*>(\d+)/i,
    /(\d+)\s*bd/i,
    /bedroom[^>]*>(\d+)/i,
    /"bedroomCount"\s*:\s*(\d+)/i,
    // Modern Zillow patterns
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
  
  // Extract bathrooms
  let bathrooms = 0;
  const bathroomPatterns = [
    /(\d+(?:\.\d+)?)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+(?:\.\d+)?)/i,
    /"baths"\s*:\s*(\d+(?:\.\d+)?)/i,
    /data-cy="bath"[^>]*>(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*ba/i,
    /bathroom[^>]*>(\d+(?:\.\d+)?)/i,
    /"bathroomCount"\s*:\s*(\d+(?:\.\d+)?)/i,
    // Modern Zillow patterns
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
  
  // Extract square feet
  let squareFeet = 0;
  const sqftPatterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /"squareFeet"\s*:\s*(\d+)/i,
    /data-cy="sqft"[^>]*>([\d,]+)/i,
    /(\d{3,4})\s*sq/i,
    /"area"\s*:\s*(\d+)/i,
    /square\s*footage[^>]*>([\d,]+)/i,
    // Modern Zillow patterns
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
  
  // Extract photos
  const images = extractPhotosFromHTML(html);
  
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
  
  // Extract description
  let description = 'No description available';
  const descPatterns = [
    /"description"\s*:\s*"([^"]+)"/,
    /"summary"\s*:\s*"([^"]+)"/,
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i
  ];
  
  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match) {
      description = match[1];
      break;
    }
  }
  
  // Extract features
  const features: string[] = [];
  if (bedrooms > 0) features.push(`${bedrooms} bedrooms`);
  if (bathrooms > 0) features.push(`${bathrooms} bathrooms`);
  if (squareFeet > 0) features.push(`${squareFeet} sqft`);
  if (yearBuilt) features.push(`Built in ${yearBuilt}`);
  
  // Extract neighborhood
  let neighborhood = 'Neighborhood not specified';
  const neighborhoodPatterns = [
    /"neighborhood"\s*:\s*"([^"]+)"/,
    /"area"\s*:\s*"([^"]+)"/,
    /"city"\s*:\s*"([^"]+)"/,
    /neighborhood[^>]*>([^<]+)</i
  ];
  
  for (const pattern of neighborhoodPatterns) {
    const match = html.match(pattern);
    if (match) {
      neighborhood = match[1];
      break;
    }
  }
  
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
    yearBuilt,
    lotSize: extractLotSize(html) || '0.25',
    propertyType: extractPropertyType(html) || 'Single Family',
    agentName: extractAgentName(html) || 'Real Estate Agent',
    agentCompany: extractAgentCompany(html) || 'Real Estate Company',
    scrapedAt: new Date().toISOString()
  };
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
    // Modern Zillow photo patterns
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
  
  console.log(`Found ${uniquePhotos.length} photos`);
  return uniquePhotos.slice(0, 15);
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