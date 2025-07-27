
      import { scrapeZillowWorking } from './src/services/workingZillowScraper.ts';
      
      async function test() {
        console.log('Testing scraper...');
        const result = await scrapeZillowWorking('https://www.zillow.com/homedetails/214-S-Bradley-St-Chelan-WA-98816/91543232_zpid/');
        
        if (result) {
          console.log('✅ SUCCESS!');
          console.log('Address:', result.address);
          console.log('Price:', result.price);
          console.log('Bedrooms:', result.bedrooms);
          console.log('Bathrooms:', result.bathrooms);
          console.log('Square Feet:', result.squareFeet);
          console.log('Images found:', result.images.length);
          console.log('Year Built:', result.yearBuilt);
          console.log('Description:', result.description.substring(0, 100) + '...');
          console.log('Features:', result.features.slice(0, 5));
        } else {
          console.log('❌ FAILED: No data returned');
        }
      }
      
      test().catch(console.error);
    