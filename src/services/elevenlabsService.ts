import axios from 'axios';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

export interface ElevenLabsVoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  samples: any[];
  category: string;
  fine_tuning: any;
  labels: any;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: any;
  sharing: any;
  high_quality_base_model_ids: string[];
  safety_control: any;
  voice_verification: any;
}

export async function getElevenLabsVoices(): Promise<ElevenLabsVoice[]> {
  if (!ELEVENLABS_API_KEY) {
    console.log('ElevenLabs API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    return [];
  }
}

export async function generateElevenLabsSpeech(
  text: string, 
  voiceId: string = ELEVENLABS_VOICE_ID,
  settings?: Partial<ElevenLabsVoiceSettings>
): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    console.log('ElevenLabs API key not configured, using mock response');
    return '/audio/mock-voice-response.mp3';
  }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: settings?.stability ?? 0.5,
          similarity_boost: settings?.similarity_boost ?? 0.75,
          style: settings?.style ?? 0.0,
          use_speaker_boost: settings?.use_speaker_boost ?? true
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        responseType: 'blob',
      }
    );
    
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    return '/audio/mock-voice-response.mp3';
  }
}

export async function cloneVoice(audioFile: File, name: string): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    console.log('ElevenLabs API key not configured, using mock voice ID');
    return 'mock-voice-id';
  }

  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('files', audioFile);

    const response = await axios.post(
      'https://api.elevenlabs.io/v1/voices/add',
      formData,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );
    
    return response.data.voice_id;
  } catch (error) {
    console.error('Error cloning voice:', error);
    return 'mock-voice-id';
  }
} 