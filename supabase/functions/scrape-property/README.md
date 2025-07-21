# Property Scraper Edge Function

This Supabase Edge Function scrapes property data from real estate websites using ScraperAPI for reliable, anti-bot-protected scraping.

## Setup

### 1. Get a ScraperAPI Key
- Sign up at [scraperapi.com](https://scraperapi.com)
- Get your API key from the dashboard
- They offer 1000 free requests/month for testing

### 2. Set Environment Variable
```bash
# Set the API key for your Supabase project
supabase secrets set SCRAPER_API_KEY=your-actual-api-key-here
```

### 3. Deploy the Function
```bash
supabase functions deploy scrape-property
```

## Usage

POST to your function endpoint with a property URL:

```json
{
  "url": "https://www.zillow.com/homedetails/123-example-st"
}
```

## Features

- **Anti-bot Protection**: Uses ScraperAPI's proxy rotation and browser automation
- **Fallback**: Falls back to direct fetching if ScraperAPI fails
- **Multiple Sites**: Supports Zillow, Realtor.com, and generic sites
- **Structured Data**: Returns clean, structured property information

## Cost Considerations

- ScraperAPI: ~$0.50 per 1000 requests (varies by plan)
- Free tier: 1000 requests/month
- Production: Consider bulk plans for better rates

## Alternative Services

You can easily adapt this for other scraping APIs:
- **Bright Data**: `https://lumtest.com/myip.json`
- **ZenRows**: `https://api.zenrows.com/v1/`
- **Apify**: `https://api.apify.com/v2/acts/`

Just update the `fetchHtmlWithScraperAPI` function with the appropriate API endpoint and parameters. 