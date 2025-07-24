import { trackEmailOpen, trackEmailClick } from '../services/emailMarketingService';

// Email open tracking endpoint
export const trackEmailOpenHandler = async (trackingId: string, request: Request) => {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const success = await trackEmailOpen(trackingId, ipAddress, userAgent);
    
    if (success) {
      // Return a 1x1 transparent pixel
      return new Response(
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        {
          status: 200,
          headers: {
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    } else {
      return new Response('Tracking failed', { status: 500 });
    }
  } catch (error) {
    console.error('Error tracking email open:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

// Email click tracking endpoint
export const trackEmailClickHandler = async (trackingId: string, url: string, request: Request) => {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const success = await trackEmailClick(trackingId, url, ipAddress, userAgent);
    
    if (success) {
      // Redirect to the original URL
      return new Response(null, {
        status: 302,
        headers: {
          'Location': url
        }
      });
    } else {
      return new Response('Tracking failed', { status: 500 });
    }
  } catch (error) {
    console.error('Error tracking email click:', error);
    return new Response('Internal server error', { status: 500 });
  }
}; 