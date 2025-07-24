# OpenAI API Setup Guide

## 🚨 Voice Bot Issue Fix

The voice bot is currently showing an error because the OpenAI API key is not configured. Here's how to fix it:

## 📋 Steps to Set Up OpenAI API

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Copy the generated API key (it starts with `sk-`)

### 2. Create Environment File
Create a `.env` file in your project root with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_OPENAI_MODEL=gpt-4o-mini

# Email Configuration
VITE_RESEND_API_KEY=re_ieWJUiJr_D1zPPpFo27L7ybB3puaYdzMs
VITE_EMAIL_FROM=noreply@homelistingai.com
VITE_APP_DOMAIN=https://homelistingai.com
```

### 3. Replace Placeholder Values
- Replace `sk-your-actual-api-key-here` with your actual OpenAI API key
- Replace Supabase URL and key with your actual values

### 4. Restart Development Server
```bash
npm run dev
```

## 🔧 What This Enables

Once configured, your voice bot will be able to:
- ✅ **Process voice input** using OpenAI Whisper
- ✅ **Generate AI responses** using GPT-4
- ✅ **Convert text to speech** using OpenAI TTS
- ✅ **Log conversations** to your admin dashboard

## 💰 Cost Information

OpenAI API usage costs:
- **GPT-4o-mini**: ~$0.15 per 1M tokens
- **Whisper (transcription)**: ~$0.006 per minute
- **TTS (text-to-speech)**: ~$0.015 per 1K characters

Typical conversation cost: **$0.01-0.05 per interaction**

## 🚀 Alternative: Use Demo Mode

If you don't want to set up OpenAI right now, you can:
1. Use the **text chat** instead of voice
2. Try the **demo dashboard** to see the full experience
3. Contact support for help with setup

## 📞 Need Help?

If you need assistance setting up the OpenAI API:
1. Check the [OpenAI Documentation](https://platform.openai.com/docs)
2. Contact support for guided setup
3. Use the demo mode to explore features without API setup 