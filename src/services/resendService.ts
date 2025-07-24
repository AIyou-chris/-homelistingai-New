import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  trackingId?: string;
  campaignId?: string;
}

export interface TrackingData {
  trackingId: string;
  campaignId: string;
  subscriberId: string;
  email: string;
}

// Generate tracking pixel HTML
export const generateTrackingPixel = (trackingId: string, domain: string) => {
  return `<img src="${domain}/api/track/open/${trackingId}" width="1" height="1" style="display:none;" />`;
};

// Generate tracking links
export const generateTrackingLink = (originalUrl: string, trackingId: string, domain: string) => {
  return `${domain}/api/track/click/${trackingId}?url=${encodeURIComponent(originalUrl)}`;
};

// Process HTML content to add tracking
export const processHtmlWithTracking = (html: string, trackingId: string, domain: string) => {
  // Add tracking pixel
  const trackingPixel = generateTrackingPixel(trackingId, domain);
  
  // Replace links with tracking links
  const processedHtml = html.replace(
    /<a\s+href=["']([^"']+)["'][^>]*>/gi,
    (match, url) => {
      if (url.startsWith('http') || url.startsWith('https')) {
        const trackingUrl = generateTrackingLink(url, trackingId, domain);
        return match.replace(url, trackingUrl);
      }
      return match;
    }
  );
  
  // Add tracking pixel before closing body tag
  return processedHtml.replace('</body>', `${trackingPixel}</body>`);
};

// Send single email
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      headers: {
        'X-Tracking-ID': options.trackingId || '',
        'X-Campaign-ID': options.campaignId || '',
      }
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Send bulk emails with rate limiting
export const sendBulkEmails = async (
  emails: EmailOptions[],
  rateLimit: number = 10 // emails per second
): Promise<{ success: number; errors: number; results: Array<{ success: boolean; email: string; error?: string }> }> => {
  const results: Array<{ success: boolean; email: string; error?: string }> = [];
  let success = 0;
  let errors = 0;

  // Process emails in batches to respect rate limits
  for (let i = 0; i < emails.length; i += rateLimit) {
    const batch = emails.slice(i, i + rateLimit);
    
    const batchPromises = batch.map(async (emailOptions) => {
      try {
        const result = await sendEmail(emailOptions);
        return {
          success: result.success,
          email: emailOptions.to,
          error: result.error
        };
      } catch (error) {
        return {
          success: false,
          email: emailOptions.to,
          error: (error as Error).message
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Count successes and errors
    batchResults.forEach(result => {
      if (result.success) {
        success++;
      } else {
        errors++;
      }
    });

    // Wait 1 second between batches to respect rate limits
    if (i + rateLimit < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { success, errors, results };
};

// Verify email address
export const verifyEmail = async (email: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    // You can add additional validation here
    // For example, checking against disposable email providers
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// Get email sending statistics
export const getEmailStats = async (): Promise<{ sent: number; delivered: number; failed: number }> => {
  try {
    // This would typically call Resend's API to get stats
    // For now, returning mock data
    return {
      sent: 0,
      delivered: 0,
      failed: 0
    };
  } catch (error) {
    console.error('Error getting email stats:', error);
    return { sent: 0, delivered: 0, failed: 0 };
  }
};

// Test email configuration
export const testEmailConfiguration = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const testResult = await sendEmail({
      to: 'test@example.com',
      from: 'noreply@yourdomain.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>This is a test email to verify your Resend configuration.</p>'
    });

    return { success: testResult.success, error: testResult.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}; 