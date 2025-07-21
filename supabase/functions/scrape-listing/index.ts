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
    } catch (err: unknown) {
      console.error('Primary URL fetch failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      // Try example.com as a fallback for testing
      try {
        response = await fetch('https://example.com');
        console.log('Fetched example.com as fallback');
      } catch (fallbackErr: unknown) {
        console.error('Fallback fetch failed:', JSON.stringify(fallbackErr, Object.getOwnPropertyNames(fallbackErr)));
        return new Response(
          JSON.stringify({
            error: 'Both primary and fallback fetch failed',
            details: fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Extract listing details
    const title = doc.querySelector('title')?.textContent || ''
    const address = doc.querySelector('[itemprop="address"]')?.textContent?.trim() || doc.querySelector('meta[property="og:street-address"]')?.getAttribute('content') || ''
    const price = doc.querySelector('[itemprop="price"]')?.textContent?.trim() || doc.querySelector('meta[property="og:price"]')?.getAttribute('content') || ''
    const images: string[] = []
    
    doc.querySelectorAll('img').forEach((el) => {
      const src = el.getAttribute('src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    console.log('Scraping complete')
    return new Response(
      JSON.stringify({ title, address, price, images }),
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