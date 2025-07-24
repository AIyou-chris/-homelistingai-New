# Resend Email Integration Setup

## 1. Get Your Resend API Key

1. Go to [Resend](https://resend.com/emails) and sign up/login
2. Navigate to your dashboard
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

## 2. Environment Variables

Add these to your `.env` file:

```env
# Resend Email Configuration
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_EMAIL_FROM=noreply@yourdomain.com
VITE_APP_DOMAIN=https://yourdomain.com
```

## 3. Verify Your Domain

1. In your Resend dashboard, go to Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS verification steps
4. Wait for verification (usually takes a few minutes)

## 4. Update Email Configuration

In `src/services/emailMarketingService.ts`, update the `from` email address:

```typescript
from: 'noreply@yourdomain.com', // Replace with your verified domain
```

## 5. Test the Integration

1. Start your development server
2. Go to the Email Marketing page
3. Create a test campaign
4. Add a test subscriber
5. Send a test email

## 6. Email Tracking Setup

The system automatically includes:
- ✅ Open tracking (pixel)
- ✅ Click tracking (link replacement)
- ✅ Bounce handling
- ✅ Unsubscribe tracking

## 7. Production Deployment

For production, make sure to:
1. Use your production domain in environment variables
2. Verify your production domain in Resend
3. Update the `from` email address to your verified domain
4. Test email delivery in production

## 8. Rate Limits

Resend has the following limits:
- 10 emails per second (free plan)
- 100 emails per second (paid plans)
- 100,000 emails per month (free plan)

The system automatically handles rate limiting.

## 9. Troubleshooting

### Common Issues:

1. **"Invalid API key"**
   - Check your API key in environment variables
   - Make sure it's the correct key from Resend dashboard

2. **"Domain not verified"**
   - Verify your domain in Resend dashboard
   - Wait for DNS propagation

3. **"Email not delivered"**
   - Check spam folder
   - Verify sender domain is correct
   - Check Resend logs in dashboard

4. **"Tracking not working"**
   - Make sure your domain is accessible
   - Check API routes are working
   - Verify tracking URLs are correct

## 10. Advanced Features

### Custom Templates
You can create custom email templates in the Templates tab.

### Segmentation
Use the Segments feature to target specific subscriber groups.

### Analytics
Track opens, clicks, bounces, and unsubscribes in real-time.

### Bulk Import
Import subscribers from CSV files.

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Best Practices](https://resend.com/docs/best-practices) 