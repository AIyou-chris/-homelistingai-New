import OpenAI from 'openai';
import { PropertyDetails, DescriptionOptions, GeneratedDescription, SEOMetadata } from './types';

export class PropertyDescriptionGenerator {
  private openai: OpenAI;
  private supportedLanguages = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ja', 'ko'
  ];
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  private async createCompletion(messages: any[]) {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7
    });
    
    return completion.choices[0].message?.content || '';
  }

  private createPrompt(property: PropertyDetails, options: DescriptionOptions): string {
    const {
      type, bedrooms, bathrooms, squareFeet,
      address, interiorFeatures, exteriorFeatures,
      amenities, nearbyAttractions
    } = property;

    return `Generate a ${options.tone} real estate description with ${options.length} length for:

Property Overview:
- ${type} with ${bedrooms} bedrooms and ${bathrooms} bathrooms
- ${squareFeet} square feet
- Located in ${address.neighborhood || address.city}, ${address.state}

Key Features:
Interior: ${interiorFeatures.join(', ')}
Exterior: ${exteriorFeatures.join(', ')}
Amenities: ${amenities.join(', ')}

${nearbyAttractions ? `Nearby: ${nearbyAttractions.join(', ')}` : ''}

Tone Guidelines:
- ${options.tone} tone
- Emphasize: ${options.emphasis.join(', ')}
${options.includePricing ? `- Include price: $${property.price.toLocaleString()}` : ''}

Additional Requirements:
- Use natural, engaging language
- Highlight unique selling points
- Include location benefits
- SEO-friendly keywords
- Avoid repetition and clichés`;
  }

  private async generateSEOMetadata(
    description: string,
    property: PropertyDetails,
    options: DescriptionOptions
  ): Promise<SEOMetadata> {
    const seoPrompt = `Analyze this real estate description and generate SEO metadata:

Description:
${description}

Property Details:
${JSON.stringify(property, null, 2)}

Target Keywords:
${options.seoKeywords?.join(', ') || 'real estate, property, home'}

Please provide:
1. SEO title (max 60 chars)
2. Meta description (max 155 chars)
3. Primary and secondary keywords
4. Suggested H1 and H2 headings
5. Readability analysis
6. Keyword density
7. SEO improvement suggestions`;

    const content = await this.createCompletion([
      {
        role: "system",
        content: "You are an SEO expert specializing in real estate content optimization."
      },
      {
        role: "user",
        content: seoPrompt
      }
    ]);

    const seoAnalysis = JSON.parse(content || '{}');
    
    return {
      title: seoAnalysis.title || '',
      metaDescription: seoAnalysis.metaDescription || '',
      keywords: seoAnalysis.keywords || [],
      headings: seoAnalysis.headings || {},
      readabilityScore: seoAnalysis.readabilityScore || 0,
      keywordDensity: seoAnalysis.keywordDensity || {},
      suggestedImprovements: seoAnalysis.suggestedImprovements || []
    };
  }

  private async translateDescription(
    description: string,
    targetLanguages: string[]
  ): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};
    
    for (const lang of targetLanguages) {
      if (!this.supportedLanguages.includes(lang)) continue;
      
      const translationPrompt = `Translate this real estate property description to ${lang}. 
Maintain the professional tone and real estate terminology:

${description}`;

      const content = await this.createCompletion([
        {
          role: "system",
          content: `You are a professional real estate translator. Translate to ${lang} maintaining proper terminology and cultural nuances.`
        },
        {
          role: "user",
          content: translationPrompt
        }
      ]);

      translations[lang] = content;
    }

    return translations;
  }

  async generateDescription(
    property: PropertyDetails,
    options: DescriptionOptions
  ): Promise<GeneratedDescription> {
    try {
      const prompt = this.createPrompt(property, options);
      
      // Generate base description
      const description = await this.createCompletion([
        {
          role: "system",
          content: "You are an expert real estate copywriter who creates compelling, accurate property descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ]);
      
      // Generate SEO metadata
      const seoMetadata = await this.generateSEOMetadata(description, property, options);
      
      // Calculate SEO score
      const seoScore = this.calculateSEOScore(seoMetadata);
      
      // Generate translations if requested
      const translations = options.language && options.language !== 'en'
        ? await this.translateDescription(description, [options.language])
        : undefined;

      return {
        description,
        metadata: {
          wordCount: description.split(' ').length,
          tone: options.tone,
          emphasis: options.emphasis,
          generatedAt: new Date(),
          language: options.language || 'en',
          seoScore,
          seoMetadata
        },
        translations
      };
    } catch (error) {
      console.error('Error generating property description:', error);
      throw new Error('Failed to generate property description');
    }
  }

  private calculateSEOScore(seoMetadata: SEOMetadata): number {
    let score = 100;
    
    // Title length (optimal: 50-60 characters)
    const titleLength = seoMetadata.title.length;
    if (titleLength < 30 || titleLength > 60) score -= 10;
    
    // Meta description length (optimal: 145-155 characters)
    const descLength = seoMetadata.metaDescription.length;
    if (descLength < 120 || descLength > 155) score -= 10;
    
    // Keywords presence
    if (seoMetadata.keywords.length < 3) score -= 10;
    
    // Readability score
    score += seoMetadata.readabilityScore * 0.2;
    
    // Keyword density (optimal: 1-3%)
    const hasOptimalDensity = Object.values(seoMetadata.keywordDensity)
      .every(density => density >= 1 && density <= 3);
    if (!hasOptimalDensity) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  async enhanceWithMarketInsights(
    baseDescription: string,
    property: PropertyDetails
  ): Promise<string> {
    const marketPrompt = `Enhance this property description with relevant market insights for ${property.address.neighborhood || property.address.city}:

${baseDescription}

Add 1-2 sentences about:
- Local market trends
- Neighborhood development
- Investment potential`;

    try {
      return await this.createCompletion([
        {
          role: "system",
          content: "You are a real estate market expert. Enhance the description with market insights."
        },
        {
          role: "user",
          content: marketPrompt
        }
      ]);
    } catch (error) {
      console.error('Error enhancing description:', error);
      return baseDescription;
    }
  }
} 