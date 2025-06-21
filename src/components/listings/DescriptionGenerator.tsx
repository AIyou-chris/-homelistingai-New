import React, { useState } from 'react';
import { PropertyDetails, DescriptionOptions, GeneratedDescription, SEOMetadata } from '../../services/ai/propertyDescription/types';
import { PropertyDescriptionGenerator } from '../../services/ai/propertyDescription/generator';

interface Props {
  propertyDetails: PropertyDetails;
  onDescriptionGenerated?: (description: GeneratedDescription) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
];

const DescriptionGenerator: React.FC<Props> = ({ 
  propertyDetails,
  onDescriptionGenerated 
}) => {
  const [description, setDescription] = useState<GeneratedDescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  
  const [options, setOptions] = useState<DescriptionOptions>({
    tone: 'professional',
    length: 'medium',
    emphasis: ['features', 'location'],
    includePricing: true,
    language: 'en',
    seoKeywords: []
  });

  const generator = new PropertyDescriptionGenerator();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedDescription = await generator.generateDescription(
        propertyDetails,
        {
          ...options,
          language: selectedLanguage,
          seoKeywords: seoKeywords.split(',').map(k => k.trim()).filter(k => k)
        }
      );
      
      setDescription(generatedDescription);
      onDescriptionGenerated?.(generatedDescription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate description');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Generate Property Description
        </h2>
        
        {/* Options Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone
            </label>
            <select
              value={options.tone}
              onChange={(e) => setOptions({
                ...options,
                tone: e.target.value as DescriptionOptions['tone']
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="professional">Professional</option>
              <option value="luxury">Luxury</option>
              <option value="friendly">Friendly</option>
              <option value="modern">Modern</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length
            </label>
            <select
              value={options.length}
              onChange={(e) => setOptions({
                ...options,
                length: e.target.value as DescriptionOptions['length']
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="luxury home, waterfront, modern design"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Emphasis Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emphasis
          </label>
          <div className="flex flex-wrap gap-4">
            {['features', 'location', 'value', 'lifestyle'].map((emp) => (
              <label key={emp} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.emphasis.includes(emp as any)}
                  onChange={(e) => {
                    const newEmphasis = e.target.checked
                      ? [...options.emphasis, emp]
                      : options.emphasis.filter(e => e !== emp);
                    setOptions({
                      ...options,
                      emphasis: newEmphasis as DescriptionOptions['emphasis']
                    });
                  }}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-gray-700 capitalize">{emp}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Include Pricing Toggle */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.includePricing}
              onChange={(e) => setOptions({
                ...options,
                includePricing: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Include pricing information</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-medium
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? 'Generating...' : 'Generate Description'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {/* Generated Description */}
        {description && (
          <div className="mt-6 space-y-6">
            {/* Main Description */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Generated Description
                </h3>
                <div className="text-sm text-gray-500">
                  {description.metadata.wordCount} words
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {description.description}
                </p>
              </div>
            </div>

            {/* SEO Information */}
            {description.metadata.seoMetadata && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  SEO Analysis
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    Score: {description.metadata.seoScore}/100
                  </span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Title</h4>
                    <p className="text-gray-600">{description.metadata.seoMetadata.title}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Meta Description</h4>
                    <p className="text-gray-600">{description.metadata.seoMetadata.metaDescription}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {description.metadata.seoMetadata.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Suggested Improvements</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {description.metadata.seoMetadata.suggestedImprovements.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Translations */}
            {description.translations && Object.keys(description.translations).length > 0 && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Translations
                </h3>
                
                {Object.entries(description.translations).map(([lang, text]) => (
                  <div key={lang} className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name}
                    </h4>
                    <p className="whitespace-pre-wrap text-gray-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionGenerator; 