import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--proxy-server=http://gw.dataimpulse.com:823'
    ]
  });
  const page = await browser.newPage();

  // Try email as username and API key as password
  await page.authenticate({
    username: 'aichris@anaiyou.com',
    password: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmRhdGFpbXB1bHNlLmNvbVwvcmVzZWxsZXJcL3VzZXJcL3Rva2VuXC9nZXQiLCJpYXQiOjE3NDk4NjAzNjksImV4cCI6MTc0OTk0Njc2OSwibmJmIjoxNzQ5ODYwMzY5LCJqdGkiOiJzZTJKdTZQaFBQNzNGU3dWIiwic3ViIjoxNTkzMjEsInBydiI6IjgwMTZkNDE2YWNhOTI4NjVmODhlNTg4MzQzOWM2OTkxZjM4MzRjZjUifQ.h6WwIOtvJvGTbgFsxWQ_-cC2iBaPWw3Ca-ElLMhOgYk'
  });

  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
  });

  // Go to the listing page
  await page.goto('https://www.zillow.com/homedetails/5271-Mission-Creek-Rd-Cashmere-WA-98815/85976391_zpid/', { waitUntil: 'networkidle2' });

  // Wait for the title or a key element to load
  await page.waitForSelector('title');

  // Get the page title
  const title = await page.title();
  console.log('Page title:', title);

  // Extract address
  const address = await page.$eval('[itemprop="address"]', el => el.textContent.trim()).catch(() => 'Address not found');
  console.log('Address:', address);

  // Extract price
  const price = await page.$eval('[itemprop="price"]', el => el.textContent.trim()).catch(() => 'Price not found');
  console.log('Price:', price);

  // Extract images
  const images = await page.evaluate(() => {
    const imgElements = document.querySelectorAll('img');
    return Array.from(imgElements).map(img => img.src).filter(src => src);
  });
  console.log('Images:', images);

  // Screenshot (optional)
  await page.screenshot({ path: 'listing.png' });

  // Close browser
  await browser.close();
})();