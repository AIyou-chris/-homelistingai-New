import { supabase } from './src/lib/supabase'

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhocWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NDUzOTMsImV4cCI6MjAyNTQyMTM5M30.04bca5e0c2358387f861d709ff2f16f0cd06eeaebcf553da34ffd2dcd7944d4e3c32a164a4c65454f460976cd6375d990b2015b498ee3ce7c96f7c1c1b9689d6ac'

async function testScraper() {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-listing', {
      body: {
        url: 'https://www.zillow.com/homedetails/1600-Amphitheatre-Pkwy-Mountain-View-CA-94043/12345678_zpid/'
      },
      headers: {
        Authorization: `Bearer ${anonKey}`
      }
    })

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('Scraped data:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Failed to test scraper:', err)
  }
}

testScraper() 