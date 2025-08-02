const ATTOM_API_BASE = 'https://api.developer.attomdata.com/v3.0';
const ATTOM_API_KEY = 'c7eff490b37a37b3fcd4083fe2a704e5';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { endpoint, params } = JSON.parse(event.body || '{}');
    
    if (!endpoint) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Endpoint is required' })
      };
    }

    // Build query string from params
    const queryString = params ? Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&') : '';

    const url = `${ATTOM_API_BASE}/${endpoint}${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: {
        'apikey': ATTOM_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`ATTOM API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('ATTOM proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch data from ATTOM API',
        details: error.message 
      })
    };
  }
}; 