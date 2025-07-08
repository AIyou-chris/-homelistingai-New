# OAuth Provider Setup Guide for HomeListingAI

This guide will help you configure Google, Facebook, and LinkedIn OAuth providers in your Supabase project.

## Prerequisites

1. Supabase project with Authentication enabled
2. Developer accounts for each provider:
   - Google Cloud Console
   - Facebook Developers
   - LinkedIn Developers

## 1. Google OAuth Setup

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Step 2: Supabase Configuration
1. Go to your Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. Save changes

## 2. Facebook OAuth Setup

### Step 1: Facebook Developers
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add Facebook Login product
4. Go to Settings → Basic
5. Add your domain to "App Domains"
6. Go to Facebook Login → Settings
7. Add Valid OAuth Redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Step 2: Supabase Configuration
1. Go to your Supabase Dashboard → Authentication → Providers
2. Enable Facebook provider
3. Add your Facebook App ID and App Secret
4. Save changes

## 3. LinkedIn OAuth Setup

### Step 1: LinkedIn Developers
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Go to "Auth" tab
4. Add redirect URLs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
5. Note your Client ID and Client Secret

### Step 2: Supabase Configuration
1. Go to your Supabase Dashboard → Authentication → Providers
2. Enable LinkedIn provider
3. Add your LinkedIn Client ID and Client Secret
4. Save changes

## 4. Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Testing

1. Start your development server
2. Go to `/signup` or `/login`
3. Click on any social login button
4. You should be redirected to the provider's login page
5. After successful authentication, you'll be redirected back to your app

## 6. Production Considerations

### Redirect URLs
Make sure to update redirect URLs in all provider dashboards when deploying to production:

- Replace `localhost:3000` with your production domain
- Update Supabase redirect URLs if needed

### Security
- Keep your client secrets secure
- Use environment variables for all sensitive data
- Regularly rotate your OAuth credentials

## 7. Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check that redirect URIs match exactly in both Supabase and provider dashboards
   - Include both HTTP and HTTPS versions if needed

2. **"App not configured" error**
   - Ensure your app is properly configured in the provider's dashboard
   - Check that required APIs are enabled

3. **"Client ID not found" error**
   - Verify your client ID is correct
   - Check that the provider is enabled in Supabase

### Debug Steps
1. Check browser console for errors
2. Verify Supabase logs in the dashboard
3. Test with a simple OAuth flow first
4. Ensure your app is in the correct mode (development/production)

## 8. Additional Configuration

### Custom Scopes
You can customize the scopes requested from each provider by modifying the `signInWithProvider` function in `authService.ts`:

```typescript
export const signInWithProvider = async (provider: 'google' | 'facebook' | 'linkedin'): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'email profile' // Add custom scopes here
    }
  });
  
  if (error) throw new Error(error.message);
};
```

### User Profile Data
After successful OAuth login, user data will be available in the user's metadata. You can access it in your components:

```typescript
const { user } = useAuth();
console.log(user?.user_metadata); // Contains provider-specific data
```

## Support

If you encounter issues:
1. Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review provider-specific documentation
3. Check Supabase community forums
4. Verify your configuration matches the examples above 