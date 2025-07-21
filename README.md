# HomeListingAI

AI-powered real estate platform that turns every listing into a lead magnet.

## Features

- **AI Voice Assistant** - Property-specific AI that answers buyer questions 24/7
- **Smart Chat Widget** - Global chat support across all pages
- **Property Management** - Upload and manage listings with AI training
- **Lead Capture** - Automatic lead generation from AI conversations
- **Voice Customization** - Multiple voice options and personalities

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. OpenAI API Setup
To enable AI features (VoiceBot, ChatBot), you need an OpenAI API key:

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

### 3. Start Development Server
```bash
npm run dev
```

## AI Features

### VoiceBot
- **6 Voice Options**: Professional Male/Female, Friendly Male/Female, Enthusiastic, Calm & Patient
- **Property-Specific Responses**: AI trained on individual listing details
- **Voice Input/Output**: Full conversation capabilities
- **Custom System Prompts**: Real estate expertise built-in

### ChatBot Widget
- **Global Availability**: Appears on every page
- **AI-Powered Responses**: Intelligent property assistance
- **Lead Capture**: Automatic lead generation

## Voice Options

| Voice Style | Description | Best For |
|-------------|-------------|----------|
| Professional Male | Clear, authoritative | Formal presentations |
| Professional Female | Warm, knowledgeable | General assistance |
| Friendly Male | Approachable, casual | Relaxed interactions |
| Friendly Female | Cheerful, helpful | Customer service |
| Enthusiastic | Energetic, excited | Property highlights |
| Calm & Patient | Soothing, detailed | Complex explanations |

## Property AI Training

The AI is automatically trained on:
- Property details (price, beds, baths, sq ft)
- Features and amenities
- Neighborhood information
- School districts
- HOA fees and property taxes
- Additional property context

## Development

### Key Files
- `src/services/openaiService.ts` - AI integration and voice options
- `src/components/shared/VoiceBot.tsx` - Voice assistant component
- `src/components/shared/ChatBotWidget.tsx` - Chat widget component

### Adding New Properties
Update the property information in your listing management system. The AI will automatically use the new details for responses.

## License

MIT License
