# PayPal Integration Guide

## Overview
This guide covers the complete PayPal subscription integration for HomeListingAI, including webhook handling, subscription management, and payment tracking.

## Backend Functions

### 1. PayPal Webhook Handler (`/functions/paypal-webhook`)
Handles PayPal webhook events for subscription lifecycle management.

**Events Handled:**
- `BILLING.SUBSCRIPTION.ACTIVATED` - New subscription activated
- `BILLING.SUBSCRIPTION.CANCELLED` - Subscription cancelled
- `BILLING.SUBSCRIPTION.EXPIRED` - Subscription expired
- `PAYMENT.SALE.COMPLETED` - Payment successful
- `PAYMENT.SALE.DENIED` - Payment failed

**Environment Variables Required:**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

### 2. Subscription Verification (`/functions/verify-subscription`)
Verifies subscription status with PayPal and updates user profiles.

**Usage:**
```javascript
const response = await fetch('/functions/v1/verify-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: 'user-uuid' })
});
```

### 3. Subscription Management (`/functions/manage-subscription`)
Manages subscription lifecycle (cancel, pause, reactivate).

**Usage:**
```javascript
const response = await fetch('/functions/v1/manage-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    user_id: 'user-uuid', 
    action: 'cancel' // or 'pause', 'reactivate'
  })
});
```

## Database Schema

### Payments Table
```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT NOT NULL UNIQUE,
  subscription_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Profiles Updates
The `user_profiles` table should include:
- `subscription_id` (TEXT) - PayPal subscription ID
- `subscription_status` (TEXT) - Current subscription status

## Frontend Integration

### CheckoutPage Updates
- Added authentication check
- Integrated with user profile updates
- Stores subscription ID on successful payment

### PaymentService Updates
- `checkSubscription()` - Verifies subscription status
- `cancelSubscription()` - Cancels subscription
- `pauseSubscription()` - Pauses subscription
- `reactivateSubscription()` - Reactivates subscription

## PayPal Setup Requirements

### 1. PayPal Developer Account
1. Create account at [developer.paypal.com](https://developer.paypal.com)
2. Create a new app for your application
3. Get Client ID and Secret

### 2. Subscription Plan Setup
1. Create a subscription plan in PayPal dashboard
2. Note the Plan ID (starts with 'P-')
3. Configure webhook endpoints

### 3. Webhook Configuration
Add these webhook endpoints in PayPal dashboard:
- URL: `https://your-domain.supabase.co/functions/v1/paypal-webhook`
- Events: All billing and payment events

### 4. Environment Variables
Add to your `.env` file:
```bash
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
PAYPAL_PLAN_ID=your_plan_id
```

## Security Considerations

### Webhook Verification
The webhook handler includes basic signature verification. In production:
1. Verify the certificate URL is from PayPal
2. Implement proper signature verification
3. Use HTTPS for all webhook endpoints

### Error Handling
- All functions include comprehensive error handling
- Failed payments are logged and user status updated
- Subscription status is synchronized between PayPal and database

## Testing

### Sandbox Mode
1. Use PayPal sandbox environment for testing
2. Create test accounts in PayPal sandbox
3. Test all webhook events
4. Verify subscription lifecycle management

### Production Checklist
- [ ] Switch to PayPal production environment
- [ ] Update webhook URLs to production
- [ ] Test with real payment methods
- [ ] Monitor webhook delivery
- [ ] Set up error alerting

## Troubleshooting

### Common Issues
1. **Webhook not receiving events** - Check URL and authentication
2. **Subscription status not updating** - Verify database permissions
3. **Payment failures** - Check PayPal account status and limits

### Debugging
- Check Supabase function logs
- Monitor PayPal webhook delivery
- Verify environment variables
- Test with PayPal webhook simulator

## Support
For issues with this integration:
1. Check PayPal developer documentation
2. Review Supabase function logs
3. Test webhook endpoints manually
4. Contact PayPal developer support if needed 