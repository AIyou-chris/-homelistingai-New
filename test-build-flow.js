// Test script to verify the build flow and dashboard functionality
const puppeteer = require('puppeteer');

async function testBuildFlow() {
  console.log('🚀 Starting comprehensive build flow test...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Navigate to dashboard
    console.log('📱 Test 1: Loading dashboard...');
    await page.goto('https://homelistingai.com/dashboard');
    await page.waitForTimeout(3000);
    
    // Check if dashboard loads
    const dashboardTitle = await page.$eval('h1', el => el.textContent);
    console.log('✅ Dashboard loaded:', dashboardTitle);
    
    // Test 2: Build first listing
    console.log('🏠 Test 2: Building first listing...');
    await page.click('a[href="/build-ai-listing"]');
    await page.waitForTimeout(2000);
    
    // Fill in the form
    await page.type('input[name="propertyUrl"]', 'https://www.zillow.com/homedetails/214-S-Bradley-St-Chelan-WA-98816/91543232_zpid/');
    await page.type('input[name="agentName"]', 'Test Agent');
    await page.type('input[name="agentPhone"]', '555-123-4567');
    await page.type('input[name="agencyName"]', 'Test Real Estate');
    await page.type('input[name="agentTitle"]', 'Senior Agent');
    
    // Navigate through steps
    await page.click('button:contains("Next")');
    await page.waitForTimeout(1000);
    
    await page.click('button:contains("Next")');
    await page.waitForTimeout(1000);
    
    await page.click('button:contains("Next")');
    await page.waitForTimeout(1000);
    
    await page.click('button:contains("Next")');
    await page.waitForTimeout(1000);
    
    await page.click('button:contains("Next")');
    await page.waitForTimeout(1000);
    
    // Build the listing
    await page.click('button:contains("Build AI Listing")');
    await page.waitForTimeout(5000);
    
    // Check if listing was created
    const createdListing = await page.$('.listing-preview');
    if (createdListing) {
      console.log('✅ First listing created successfully');
    }
    
    // Go to dashboard
    await page.click('button:contains("Edit in Your Dashboard")');
    await page.waitForTimeout(3000);
    
    // Check if listing appears in dashboard
    const listings = await page.$$('.listing-card');
    console.log('📋 Listings found in dashboard:', listings.length);
    
    // Test 3: Build second listing
    console.log('🏠 Test 3: Building second listing...');
    await page.click('a[href="/build-ai-listing"]');
    await page.waitForTimeout(2000);
    
    await page.type('input[name="propertyUrl"]', 'https://www.zillow.com/homedetails/123-Main-St-Chelan-WA-98816/12345678_zpid/');
    await page.type('input[name="agentName"]', 'Test Agent');
    await page.type('input[name="agentPhone"]', '555-123-4567');
    await page.type('input[name="agencyName"]', 'Test Real Estate');
    await page.type('input[name="agentTitle"]', 'Senior Agent');
    
    // Navigate through steps
    for (let i = 0; i < 5; i++) {
      await page.click('button:contains("Next")');
      await page.waitForTimeout(1000);
    }
    
    await page.click('button:contains("Build AI Listing")');
    await page.waitForTimeout(5000);
    
    await page.click('button:contains("Edit in Your Dashboard")');
    await page.waitForTimeout(3000);
    
    // Check updated listings count
    const updatedListings = await page.$$('.listing-card');
    console.log('📋 Updated listings count:', updatedListings.length);
    
    // Test 4: Build third listing
    console.log('🏠 Test 4: Building third listing...');
    await page.click('a[href="/build-ai-listing"]');
    await page.waitForTimeout(2000);
    
    await page.type('input[name="propertyUrl"]', 'https://www.zillow.com/homedetails/456-Oak-Ave-Chelan-WA-98816/87654321_zpid/');
    await page.type('input[name="agentName"]', 'Test Agent');
    await page.type('input[name="agentPhone"]', '555-123-4567');
    await page.type('input[name="agencyName"]', 'Test Real Estate');
    await page.type('input[name="agentTitle"]', 'Senior Agent');
    
    // Navigate through steps
    for (let i = 0; i < 5; i++) {
      await page.click('button:contains("Next")');
      await page.waitForTimeout(1000);
    }
    
    await page.click('button:contains("Build AI Listing")');
    await page.waitForTimeout(5000);
    
    await page.click('button:contains("Edit in Your Dashboard")');
    await page.waitForTimeout(3000);
    
    // Final check
    const finalListings = await page.$$('.listing-card');
    console.log('📋 Final listings count:', finalListings.length);
    
    if (finalListings.length >= 3) {
      console.log('🎉 SUCCESS: All listings are showing in dashboard!');
    } else {
      console.log('❌ FAILED: Not all listings are showing in dashboard');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testBuildFlow(); 