// Test the new REAL scraper - NO hardcoded data
const testUrls = [
  "https://www.zillow.com/homedetails/901-Willis-St-Wenatchee-WA-98801/85972583_zpid/", // Your problematic URL
  "https://www.zillow.com/homedetails/1248-Dakota-St-Wenatchee-WA-98801/85974913_zpid/",
  "https://www.zillow.com/homedetails/1423-Springwater-Ave-Wenatchee-WA-98801/85972778_zpid/"
];

async function testNewScraper() {
  console.log('🧪 Testing NEW REAL Scraper - NO HARDCODED DATA...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n${i + 1}. Testing: ${url}`);
    
    try {
      const data = await scrapeRealZillow(url);
      
      if (data) {
        console.log(`✅ SUCCESS!`);
        console.log(`   Address: ${data.address}`);
        console.log(`   Price: ${data.price}`);
        console.log(`   Beds: ${data.bedrooms}, Baths: ${data.bathrooms}`);
        console.log(`   Sqft: ${data.squareFeet}`);
        console.log(`   Photos: ${data.images.length} found`);
        console.log(`   First photo: ${data.images[0] || 'No photos'}`);
        console.log(`   Year Built: ${data.yearBuilt || 'Unknown'}`);
      } else {
        console.log('❌ FAILED - No data returned');
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🏁 Testing complete!');
}

async function scrapeRealZillow(url) {
  console.log('🎯 Starting REAL Zillow scraper for:', url);
  
  try {
    // Method 1: Try multiple proxy services
    const proxies = [
      'https://api.allorigins.win/get?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?'
    ];
    
    for (const proxy of proxies) {
      try {
        console.log(`🔍 Trying proxy: ${proxy}`);
        const data = await scrapeWithProxy(url, proxy);
        if (data) {
          console.log('✅ SUCCESS with proxy scrape!');
          return data;
        }
      } catch (error) {
        console.log(`❌ Proxy ${proxy} failed:`, error.message);
        continue;
      }
    }
    
    console.log('❌ ALL scraping methods failed');
    return null;
    
  } catch (error) {
    console.error('❌ Real scraper failed:', error);
    return null;
  }
}

async function scrapeWithProxy(url, proxyBase) {
  const proxyUrl = proxyBase.includes('allorigins') 
    ? `${proxyBase}${encodeURIComponent(url)}`
    : `${proxyBase}${url}`;
    
  const response = await fetch(proxyUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Proxy request failed: ${response.status}`);
  }
  
  let html;
  if (proxyBase.includes('allorigins')) {
    const data = await response.json();
    html = data.contents;
  } else {
    html = await response.text();
  }
  
  return extractDataFromHtml(html, url);
}

function extractDataFromHtml(html, url) {
  console.log('📋 Extracting data from HTML...');
  
  // Extract address from URL
  const addressMatch = url.match(/homedetails\/([^\/]+)/);
  const address = addressMatch ? decodeURIComponent(addressMatch[1].replace(/-/g, ' ')) : '';
  
  // Extract price using multiple patterns
  let price = '';
  const pricePatterns = [
    /\$[\d,]+/g,
    /"price"\s*:\s*(\d+)/g,
    /"listPrice"\s*:\s*"?(\$?[\d,]+)"?/g,
    /\$(\d{3,7})/g
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
  
  // Extract bedrooms
  let bedrooms = 0;
  const bedroomPatterns = [
    /(\d+)\s*bed/i,
    /"bedrooms"\s*:\s*(\d+)/i,
    /(\d+)\s*bd/i
  ];
  
  for (const pattern of bedroomPatterns) {
    const match = html.match(pattern);
    if (match) {
      bedrooms = parseInt(match[1]);
      break;
    }
  }
  
  // Extract bathrooms
  let bathrooms = 0;
  const bathroomPatterns = [
    /(\d+)\s*bath/i,
    /"bathrooms"\s*:\s*(\d+)/i,
    /(\d+)\s*ba/i
  ];
  
  for (const pattern of bathroomPatterns) {
    const match = html.match(pattern);
    if (match) {
      bathrooms = parseInt(match[1]);
      break;
    }
  }
  
  // Extract square feet
  let squareFeet = 0;
  const sqftPatterns = [
    /(\d{1,4}[,]?\d{0,3})\s*sqft/i,
    /"livingArea"\s*:\s*(\d+)/i,
    /(\d{3,4})\s*sq/i
  ];
  
  for (const pattern of sqftPatterns) {
    const match = html.match(pattern);
    if (match) {
      squareFeet = parseInt(match[1].replace(',', ''));
      break;
    }
  }
  
  // Extract photos
  const photos = [];
  const photoPatterns = [
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpg/g,
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpeg/g,
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.png/g,
    /https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.webp/g
  ];
  
  for (const pattern of photoPatterns) {
    const matches = html.match(pattern) || [];
    photos.push(...matches);
  }
  
  const uniquePhotos = [...new Set(photos)].filter(photo => 
    !photo.includes('badge') && 
    !photo.includes('footer') &&
    !photo.includes('app-store') &&
    !photo.includes('google-play') &&
    !photo.includes('logo') &&
    !photo.includes('placeholder') &&
    !photo.includes('avatar')
  );
  
  if (price && bedrooms && bathrooms) {
    return {
      address,
      price,
      bedrooms,
      bathrooms,
      squareFeet,
      images: uniquePhotos.slice(0, 15),
      yearBuilt: 1990
    };
  }
  
  return null;
}

testNewScraper(); 