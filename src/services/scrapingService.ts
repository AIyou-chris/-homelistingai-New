import axios from 'axios';
import * as cheerio from 'cheerio';
import { fetchApifyPropertyData, convertApifyToPropertyData } from './apifyService';
import { sampleApifyData } from './apifySampleData';
import { scrapeAnyZillowListing, ZillowPropertyData } from './universalZillowScraper';
import { scrapeZillowWithPhotos, SimpleZillowData } from './simpleZillowScraper';
import { scrapeZillowWorking, WorkingZillowData } from './workingZillowScraper';

export interface ScrapedPropertyData {
  address: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description: string;
  features: string[];
  neighborhood: string;
  schoolDistrict?: string;
  hoaFees?: string;
  propertyTax?: string;
  yearBuilt?: number;
  lotSize?: string;
  images: string[];
  listingUrl: string;
  scrapedAt: Date;
}

export interface ScrapedNeighborhoodData {
  name: string;
  description: string;
  demographics: {
    population?: number;
    medianAge?: number;
    medianIncome?: number;
    homeOwnershipRate?: number;
  };
  schools: {
    name: string;
    rating?: number;
    type: 'elementary' | 'middle' | 'high';
  }[];
  amenities: string[];
  crimeRate?: string;
  walkScore?: number;
  transitScore?: number;
}

export interface ScrapedMarketData {
  area: string;
  medianHomePrice: string;
  pricePerSqFt: string;
  daysOnMarket: number;
  inventoryCount: number;
  marketTrend: 'rising' | 'falling' | 'stable';
  yearOverYearChange: string;
}

class ScrapingService {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];

  private referrers = [
    'https://www.google.com/',
    'https://www.bing.com/',
    'https://www.yahoo.com/',
    'https://www.facebook.com/',
    'https://www.linkedin.com/'
  ];

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private getRandomReferrer(): string {
    return this.referrers[Math.floor(Math.random() * this.referrers.length)];
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        // Add random delay between requests
        const delay = Math.random() * 3000 + 2000; // 2-5 seconds
        await new Promise(resolve => setTimeout(resolve, delay));

        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
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
            'Referer': this.getRandomReferrer(),
            'DNT': '1'
          },
          timeout: 15000,
          maxRedirects: 5,
          validateStatus: (status) => status < 500, // Accept 4xx status codes
        });

        // Check if we got blocked
        if (response.data.includes('blocked') || 
            response.data.includes('captcha') || 
            response.data.includes('robot') ||
            response.data.includes('403') ||
            response.data.includes('access denied')) {
          throw new Error('Access blocked by website');
        }

        return response.data;
      } catch (error: any) {
        console.log(`Attempt ${i + 1} failed for ${url}: ${error.message}`);
        
        if (i === retries - 1) {
          // On final attempt, throw error instead of returning mock data
          throw new Error(`Failed to scrape ${url} after ${retries} attempts. This is likely due to CORS restrictions or anti-bot protection.`);
        }
        
        // Exponential backoff
        const backoffDelay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    throw new Error('Failed to fetch after retries');
  }

  // Mock responses for demo purposes when real scraping fails
  private getMockZillowResponse(): string {
    return `
      <html>
        <body>
          <div data-testid="home-details-summary-address">123 Oak Street, Austin, TX 78701</div>
          <div data-testid="price">$599,000</div>
          <div data-testid="home-description">Beautiful modern home in the heart of Austin's most desirable neighborhood. This stunning property features an open concept layout, gourmet kitchen with stainless steel appliances, and a master suite with walk-in closet.</div>
          <div data-testid="home-features">
            <li>Open concept living area</li>
            <li>Gourmet kitchen with granite countertops</li>
            <li>Master suite with walk-in closet</li>
            <li>Hardwood floors throughout</li>
            <li>Large backyard with patio</li>
          </div>
          <div class="home-details-summary">3 bed 2.5 bath 2,200 sq ft</div>
        </body>
      </html>
    `;
  }

  private getMockRealtorResponse(): string {
    return `
      <html>
        <body>
          <div class="address">456 Maple Avenue, Austin, TX 78702</div>
          <div class="price">$675,000</div>
          <div class="description">Charming bungalow in historic neighborhood. Recently updated with modern amenities while preserving original character. Features include updated kitchen, new HVAC system, and beautiful landscaping.</div>
          <div class="features">
            <li>Updated kitchen with quartz countertops</li>
            <li>New HVAC system (2023)</li>
            <li>Original hardwood floors</li>
            <li>Detached garage</li>
            <li>Mature trees and landscaping</li>
          </div>
        </body>
      </html>
    `;
  }

  private getMockNicheResponse(): string {
    return `
      <html>
        <body>
          <div class="description">Downtown Austin is a vibrant urban neighborhood known for its live music scene, excellent restaurants, and walkable lifestyle. The area offers easy access to major employers, entertainment venues, and cultural attractions.</div>
          <div class="demographics">Population: 15,000 | Median Age: 32 | Median Income: $85,000 | Home Ownership: 45%</div>
          <div class="schools">
            <div class="school"><span class="name">Downtown Elementary</span><span class="rating">8/10</span><span class="type">Elementary</span></div>
            <div class="school"><span class="name">Central Middle School</span><span class="rating">7/10</span><span class="type">Middle</span></div>
            <div class="school"><span class="name">Austin High School</span><span class="rating">9/10</span><span class="type">High</span></div>
          </div>
          <div class="amenities">
            <li>Live music venues</li>
            <li>Farmers markets</li>
            <li>Public parks</li>
            <li>Public transportation</li>
            <li>Shopping centers</li>
          </div>
          <div class="walk-score">85</div>
          <div class="transit-score">92</div>
        </body>
      </html>
    `;
  }

  private getMockRedfinResponse(): string {
    return `
      <html>
        <body>
          <div class="median-price">$650,000</div>
          <div class="price-per-sqft">$295/sq ft</div>
          <div class="market-stats">Days on market: 15 | Homes for sale: 1,250</div>
          <div class="yoy-change">+8.5%</div>
        </body>
      </html>
    `;
  }

  // Scrape Zillow property listing
  async scrapeZillowProperty(url: string): Promise<ScrapedPropertyData> {
    try {
      // Use the API server instead of direct scraping
      const response = await fetch('http://localhost:5001/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [url]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Scraping failed');
      }

      if (result.properties && result.properties.length > 0) {
        const property = result.properties[0];
        return {
          address: property.address || 'Address not available',
          price: property.price ? `$${property.price.toLocaleString()}` : 'Price not available',
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          squareFeet: property.square_feet || 0,
          description: property.description || 'No description available',
          features: property.features ? property.features.split(',').map((f: string) => f.trim()) : [],
          neighborhood: property.neighborhood || 'Neighborhood not specified',
          images: property.image_urls || [],
          listingUrl: url,
          scrapedAt: new Date()
        };
      }

      throw new Error('No properties found in response');
    } catch (error) {
      console.error('Error scraping Zillow property:', error);
      throw new Error('Failed to scrape Zillow property');
    }
  }

  // Scrape Realtor.com property listing
  async scrapeRealtorProperty(url: string): Promise<ScrapedPropertyData> {
    try {
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);

      // Enhanced Realtor.com selectors based on actual page structure
      const address = $('[data-testid="address"]').text().trim() ||
                     $('.address').text().trim() ||
                     $('h1').first().text().trim() ||
                     $('[class*="address"]').first().text().trim();

      const price = $('[data-testid="price"]').text().trim() ||
                   $('.price').text().trim() ||
                   $('[class*="price"]').first().text().trim() ||
                   $('[class*="cost"]').first().text().trim();

      // Extract property details from text patterns
      const pageText = $.text();
      const bedrooms = this.extractNumber(pageText, /(\d+)\s*bed/i) || 0;
      const bathrooms = this.extractNumber(pageText, /(\d+(?:\.\d+)?)\s*bath/i) || 0;
      const squareFeet = this.extractNumber(pageText, /(\d+)\s*sq\s*ft/i) || 0;

      const description = $('[data-testid="description"]').text().trim() ||
                         $('.description').text().trim() ||
                         $('[class*="description"]').first().text().trim() ||
                         $('p').first().text().trim();

      const features: string[] = [];
      $('[data-testid="feature"], .feature-item, .amenity-item, [class*="feature"], [class*="amenity"]').each((_: number, el: any) => {
        const feature = $(el).text().trim();
        if (feature && feature.length > 3) features.push(feature);
      });

      const images: string[] = [];
      $('img[src*="realtor"], img[data-src*="realtor"], img[class*="photo"], img[class*="image"]').each((_: number, el: any) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && !src.includes('placeholder') && !src.includes('logo')) {
          images.push(src);
        }
      });

      const neighborhood = $('[data-testid="neighborhood"]').text().trim() ||
                          $('.neighborhood').text().trim() ||
                          this.extractNeighborhood(address);

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
        scrapedAt: new Date(),
      };
    } catch (error) {
      console.error('Error scraping Realtor.com property:', error);
      throw new Error('Failed to scrape Realtor.com property');
    }
  }

  // Scrape neighborhood information from Niche.com
  async scrapeNeighborhoodData(neighborhood: string, city: string, state: string): Promise<ScrapedNeighborhoodData> {
    try {
      const searchUrl = `https://www.niche.com/places-to-live/${neighborhood.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}/`;
      const html = await this.fetchWithRetry(searchUrl);
      const $ = cheerio.load(html);

      const description = $('.description').text().trim() ||
                         $('.neighborhood-description').text().trim();

      const demographics = {
        population: this.extractNumber($('.demographics').text(), /population[:\s]*([\d,]+)/i),
        medianAge: this.extractNumber($('.demographics').text(), /median age[:\s]*(\d+)/i),
        medianIncome: this.extractNumber($('.demographics').text(), /median income[:\s]*\$?([\d,]+)/i),
        homeOwnershipRate: this.extractNumber($('.demographics').text(), /home ownership[:\s]*(\d+)%/i),
      };

      const schools: { name: string; rating?: number; type: 'elementary' | 'middle' | 'high' }[] = [];
      $('.schools .school').each((_: number, el: any) => {
        const name = $(el).find('.name').text().trim();
        const rating = this.extractNumber($(el).text(), /rating[:\s]*(\d+)/i);
        const type = $(el).find('.type').text().trim().toLowerCase() as 'elementary' | 'middle' | 'high';
        
        if (name) {
          schools.push({ name, rating, type });
        }
      });

      const amenities: string[] = [];
      $('.amenities li, .nearby-places li').each((_: number, el: any) => {
        const amenity = $(el).text().trim();
        if (amenity) amenities.push(amenity);
      });

      return {
        name: neighborhood,
        description,
        demographics,
        schools,
        amenities,
        crimeRate: $('.crime-rate').text().trim(),
        walkScore: this.extractNumber($('.walk-score').text(), /(\d+)/),
        transitScore: this.extractNumber($('.transit-score').text(), /(\d+)/),
      };
    } catch (error) {
      console.error('Error scraping neighborhood data:', error);
      throw new Error('Failed to scrape neighborhood data');
    }
  }

  // Scrape market data from Redfin
  async scrapeMarketData(city: string, state: string): Promise<ScrapedMarketData> {
    try {
      const searchUrl = `https://www.redfin.com/city/${this.slugify(city)}-${state.toUpperCase()}`;
      const html = await this.fetchWithRetry(searchUrl);
      const $ = cheerio.load(html);

      const medianHomePrice = $('.median-price').text().trim() ||
                             $('[data-testid="median-price"]').text().trim();

      const pricePerSqFt = $('.price-per-sqft').text().trim() ||
                          $('[data-testid="price-per-sqft"]').text().trim();

      const daysOnMarket = this.extractNumber($('.market-stats').text(), /days on market[:\s]*(\d+)/i) || 0;

      const inventoryCount = this.extractNumber($('.market-stats').text(), /homes for sale[:\s]*([\d,]+)/i) || 0;

      const yearOverYearChange = $('.yoy-change').text().trim() ||
                                $('[data-testid="yoy-change"]').text().trim();

      // Determine market trend based on year-over-year change
      let marketTrend: 'rising' | 'falling' | 'stable' = 'stable';
      if (yearOverYearChange.includes('+') || yearOverYearChange.includes('up')) {
        marketTrend = 'rising';
      } else if (yearOverYearChange.includes('-') || yearOverYearChange.includes('down')) {
        marketTrend = 'falling';
      }

      return {
        area: `${city}, ${state}`,
        medianHomePrice,
        pricePerSqFt,
        daysOnMarket,
        inventoryCount,
        marketTrend,
        yearOverYearChange,
      };
    } catch (error) {
      console.error('Error scraping market data:', error);
      throw new Error('Failed to scrape market data');
    }
  }

  // Scrape school information from GreatSchools.org
  async scrapeSchoolData(address: string): Promise<{ name: string; rating: number; type: string; distance: string }[]> {
    try {
      // This would require a more sophisticated approach with GreatSchools API
      // For now, return mock data structure
      return [
        {
          name: "Sample Elementary School",
          rating: 8,
          type: "Elementary",
          distance: "0.5 miles"
        },
        {
          name: "Sample Middle School", 
          rating: 7,
          type: "Middle",
          distance: "1.2 miles"
        },
        {
          name: "Sample High School",
          rating: 9,
          type: "High", 
          distance: "2.1 miles"
        }
      ];
    } catch (error) {
      console.error('Error scraping school data:', error);
      throw new Error('Failed to scrape school data');
    }
  }

  // Utility methods
  private extractNumber(text: string, regex: RegExp): number | undefined {
    const match = text.match(regex);
    return match ? parseInt(match[1].replace(/,/g, '')) : undefined;
  }

  private extractNeighborhood(address: string): string {
    // Simple neighborhood extraction from address
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[1].trim();
    }
    return 'Unknown';
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Batch scraping for multiple properties
  async scrapeMultipleProperties(urls: string[]): Promise<ScrapedPropertyData[]> {
    const results: ScrapedPropertyData[] = [];
    
    for (const url of urls) {
      try {
        let data: ScrapedPropertyData;
        
        if (url.includes('zillow.com')) {
          data = await this.scrapeZillowProperty(url);
        } else if (url.includes('realtor.com')) {
          data = await this.scrapeRealtorProperty(url);
        } else {
          throw new Error('Unsupported website');
        }
        
        results.push(data);
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
      }
    }
    
    return results;
  }

  // Export scraped data to knowledge base format
  exportToKnowledgeBase(scrapedData: ScrapedPropertyData[]): string {
    let knowledgeBase = '# Property Knowledge Base\n\n';
    
    scrapedData.forEach((property, index) => {
      knowledgeBase += `## Property ${index + 1}: ${property.address}\n\n`;
      knowledgeBase += `**Price:** ${property.price}\n`;
      knowledgeBase += `**Description:** ${property.description}\n\n`;
      
      if (property.bedrooms) knowledgeBase += `**Bedrooms:** ${property.bedrooms}\n`;
      if (property.bathrooms) knowledgeBase += `**Bathrooms:** ${property.bathrooms}\n`;
      if (property.squareFeet) knowledgeBase += `**Square Feet:** ${property.squareFeet}\n`;
      if (property.neighborhood) knowledgeBase += `**Neighborhood:** ${property.neighborhood}\n`;
      
      if (property.features.length > 0) {
        knowledgeBase += `**Features:**\n`;
        property.features.forEach(feature => {
          knowledgeBase += `- ${feature}\n`;
        });
        knowledgeBase += '\n';
      }
      
      knowledgeBase += `**Source:** ${property.listingUrl}\n`;
      knowledgeBase += `**Scraped:** ${property.scrapedAt.toISOString()}\n\n`;
      knowledgeBase += '---\n\n';
    });
    
    return knowledgeBase;
  }

  // New method: Try Apify first, then fallback to scraper
  async scrapePropertyWithApify(url: string): Promise<ScrapedPropertyData> {
    console.log('🔍 Starting property scrape for:', url);
    
    // Try Apify first (better data quality)
    try {
      console.log('🎯 Trying Apify first...');
      const apifyData = await fetchApifyPropertyData(url);
      
      if (apifyData) {
        console.log('✅ Apify data found!');
        const convertedData = convertApifyToPropertyData(apifyData);
        console.log('📸 Photo debug - convertedData.images:', convertedData.images);
        console.log('📸 Photo debug - images length:', convertedData.images?.length);
        
        return {
          address: convertedData.address,
          price: convertedData.price,
          bedrooms: convertedData.bedrooms,
          bathrooms: convertedData.bathrooms,
          squareFeet: convertedData.squareFeet,
          description: convertedData.description,
          features: convertedData.features,
          neighborhood: convertedData.neighborhood,
          images: convertedData.images,
          listingUrl: convertedData.listingUrl,
          scrapedAt: new Date()
        };
      }
    } catch (error) {
      console.log('⚠️ Apify failed, falling back to scraper:', error);
    }
    
    // Fallback to original scraper
    console.log('🔄 Using fallback scraper...');
    return await this.scrapeZillowProperty(url);
  }

  // NEW: WORKING Zillow scraper that actually works
  async scrapeAnyZillowListing(url: string): Promise<ScrapedPropertyData> {
    console.log('🎯 Starting WORKING Zillow scraper for:', url);
    
    try {
      const result = await scrapeZillowWorking(url);
      
      if (result) {
        console.log('✅ WORKING scraper successful!');
        
        return {
          address: result.address,
          price: result.price,
          bedrooms: result.bedrooms,
          bathrooms: result.bathrooms,
          squareFeet: result.squareFeet,
          description: result.description,
          features: result.features,
          neighborhood: result.neighborhood,
          images: result.images,
          listingUrl: result.listingUrl,
          scrapedAt: new Date(),
          yearBuilt: result.yearBuilt,
          lotSize: result.lotSize
        };
      } else {
        console.log('❌ WORKING scraper failed, using fallback');
        throw new Error('WORKING scraper returned null');
      }
    } catch (error) {
      console.log('❌ WORKING scraper error:', error);
      // Fallback to original scraper
      return this.scrapeZillowProperty(url);
    }
  }
}

export const scrapingService = new ScrapingService();
export default scrapingService; 