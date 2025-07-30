export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

// Initialize Mailgun with API key
const getMailgunConfig = () => {
  const apiKey = import.meta.env.VITE_MAILGUN_API_KEY;
  const domain = import.meta.env.VITE_MAILGUN_DOMAIN;
  
  if (!apiKey) {
    throw new Error('VITE_MAILGUN_API_KEY environment variable is not set');
  }
  
  if (!domain) {
    throw new Error('VITE_MAILGUN_DOMAIN environment variable is not set');
  }
  
  return { apiKey, domain };
};

// Send single email using Mailgun
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const { apiKey, domain } = getMailgunConfig();
    
    // Mailgun API endpoint
    const url = `https://api.mailgun.net/v3/${domain}/messages`;
    
    // Create form data for Mailgun
    const formData = new FormData();
    formData.append('from', options.from);
    formData.append('to', options.to);
    formData.append('subject', options.subject);
    formData.append('html', options.html);
    
    if (options.text) {
      formData.append('text', options.text);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${apiKey}`)}`
      },
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, messageId: result.id };
    } else {
      const errorText = await response.text();
      console.error('Mailgun error:', errorText);
      return { success: false, error: errorText };
    }
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

    return { valid: true };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// Process HTML with tracking pixels and links
export const processHtmlWithTracking = (
  html: string,
  trackingId: string,
  domain: string
): string => {
  // Add tracking pixel
  const trackingPixel = `<img src="${domain}/track/open/${trackingId}" width="1" height="1" style="display:none;" />`;
  
  // Add tracking pixel to the end of the HTML
  let processedHtml = html + trackingPixel;
  
  // Process links to add tracking (simple implementation)
  processedHtml = processedHtml.replace(
    /<a\s+href="([^"]+)"/gi,
    `<a href="${domain}/track/click/${trackingId}?url=$1"`
  );
  
  return processedHtml;
};

// Test email configuration
export const testEmailConfiguration = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const testResult = await sendEmail({
      to: 'test@example.com',
      from: 'noreply@homelistingai.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>This is a test email to verify your Mailgun configuration.</p>'
    });

    return { success: testResult.success, error: testResult.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}; 