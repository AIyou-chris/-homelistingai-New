# 🏠 HomeListingAI Web Scraping Guide

## Overview

The HomeListingAI platform includes a powerful web scraping system that allows you to automatically collect property data from real estate websites and build comprehensive knowledge bases for your AI assistant.

## 🚀 Features

### Supported Data Sources
- **Zillow.com** - Property listings, details, and features
- **Realtor.com** - Property information and market data
- **Niche.com** - Neighborhood demographics and school information
- **Redfin.com** - Market trends and pricing data

### Data Types Collected
- 🏠 **Property Details**: Address, price, bedrooms, bathrooms, square footage
- 📝 **Descriptions**: Property descriptions and feature lists
- 🏘️ **Neighborhood Info**: Demographics, schools, amenities, walk scores
- 📊 **Market Data**: Median prices, days on market, inventory levels
- 🏫 **School Information**: Ratings, types, distances

## 🛠️ Setup & Installation

### Prerequisites
```bash
npm install cheerio @types/cheerio axios
```

### Dependencies
The scraping system requires these packages:
- `cheerio` - HTML parsing and DOM manipulation
- `axios` - HTTP requests with retry logic
- `@types/cheerio` - TypeScript definitions

## 📖 Usage

### 1. Basic Scraping Interface

Navigate to `/scraping` in your app to use the visual scraping interface:

```typescript
import ScrapingInterface from './components/shared/ScrapingInterface';

// Use in your component
<ScrapingInterface onDataScraped={handleDataScraped} />
```

### 2. Programmatic Scraping

```typescript
import scrapingService from './services/scrapingService';

// Scrape a single property
const property = await scrapingService.scrapeZillowProperty(
  'https://www.zillow.com/homedetails/123-example-street/'
);

// Scrape multiple properties
const properties = await scrapingService.scrapeMultipleProperties([
  'https://www.zillow.com/homedetails/123-example-street/',
  'https://www.realtor.com/realestateandhomes-detail/456-sample-ave'
]);

// Scrape neighborhood data
const neighborhood = await scrapingService.scrapeNeighborhoodData(
  'Downtown', 'Austin', 'TX'
);

// Scrape market data
const marketData = await scrapingService.scrapeMarketData('Austin', 'TX');
```

### 3. Knowledge Base Generation

```typescript
// Generate markdown knowledge base
const knowledgeBase = scrapingService.exportToKnowledgeBase(properties);

// Save to file
const fs = require('fs');
fs.writeFileSync('property-knowledge-base.md', knowledgeBase);
```

## 🎯 Integration with AI

### 1. Training Your AI Assistant

The scraped data can be used to train your AI with specific property knowledge:

```typescript
// Example: Use scraped data in your AI system prompt
const systemPrompt = `
You are a real estate AI assistant with knowledge of specific properties:

${knowledgeBase}

Use this information to answer questions about these properties accurately.
`;
```

### 2. VoiceBot Integration

```typescript
// In your VoiceBot component
const handlePropertyQuestion = async (question: string) => {
  const response = await openaiService.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ]
  });
  return response;
};
```

### 3. ChatBot Integration

```typescript
// In your ChatBot component
const handleChatMessage = async (message: string) => {
  const response = await openaiService.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]
  });
  return response;
};
```

## 🔧 Configuration

### Rate Limiting
The scraper includes built-in rate limiting to be respectful to websites:

```typescript
// 2-second delay between requests
await new Promise(resolve => setTimeout(resolve, 2000));
```

### User Agents
Random user agents are used to avoid detection:

```typescript
private userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36...'
];
```

### Retry Logic
Automatic retry with exponential backoff:

```typescript
private async fetchWithRetry(url: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      // Attempt request
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## 📊 Data Structure

### ScrapedPropertyData
```typescript
interface ScrapedPropertyData {
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
```

### ScrapedNeighborhoodData
```typescript
interface ScrapedNeighborhoodData {
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
```

## 🚨 Important Notes

### Legal Considerations
- Always respect robots.txt files
- Include delays between requests
- Don't overload servers
- Check website terms of service
- Consider using official APIs when available

### Anti-Bot Protection
Many real estate sites have anti-bot protection:
- Use realistic user agents
- Include delays between requests
- Handle 403/404 errors gracefully
- Consider using proxy rotation for large-scale scraping

### Data Accuracy
- Scraped data may be outdated
- Always verify critical information
- Cross-reference with multiple sources
- Include data freshness timestamps

## 🧪 Testing

Run the test script to verify functionality:

```bash
npx tsx test-scraper.ts
```

This will test:
- Property scraping functionality
- Neighborhood data collection
- Market data extraction
- Knowledge base generation

## 📈 Best Practices

### 1. Batch Processing
```typescript
// Process multiple URLs efficiently
const urls = ['url1', 'url2', 'url3'];
const results = await scrapingService.scrapeMultipleProperties(urls);
```

### 2. Error Handling
```typescript
try {
  const data = await scrapingService.scrapeZillowProperty(url);
} catch (error) {
  console.error('Scraping failed:', error);
  // Handle gracefully
}
```

### 3. Data Validation
```typescript
// Validate scraped data before using
if (property.address && property.price) {
  // Use the data
} else {
  // Skip or retry
}
```

### 4. Regular Updates
```typescript
// Schedule regular scraping for fresh data
setInterval(async () => {
  const freshData = await scrapingService.scrapeMultipleProperties(urls);
  // Update knowledge base
}, 24 * 60 * 60 * 1000); // Daily
```

## 🔮 Future Enhancements

### Planned Features
- [ ] Support for more real estate websites
- [ ] Image downloading and processing
- [ ] Automated data validation
- [ ] Real-time market alerts
- [ ] Integration with MLS APIs
- [ ] Advanced filtering and search

### API Integrations
- [ ] Zillow API (when available)
- [ ] Realtor.com API
- [ ] MLS data feeds
- [ ] Property tax databases
- [ ] School district APIs

## 📞 Support

For issues or questions about the scraping system:
1. Check the test script output
2. Verify URL formats
3. Check network connectivity
4. Review error logs
5. Test with different user agents

---

**Happy Scraping! 🏠✨** 