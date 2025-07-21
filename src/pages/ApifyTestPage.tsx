import React, { useState } from 'react';
import { convertApifyToPropertyData, triggerApifyRun } from '../services/apifyService';
import { sampleApifyData } from '../services/apifySampleData';
import { scrapingService } from '../services/scrapingService';

const ApifyTestPage: React.FC = () => {
  const [testUrl, setTestUrl] = useState('https://www.zillow.com/homedetails/1423-Springwater-Ave-Wenatchee-WA-98801/85972778_zpid/');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApifyConversion = () => {
    console.log('🧪 Testing Apify conversion...');
    const convertedData = convertApifyToPropertyData(sampleApifyData);
    setResult({
      type: 'Apify Conversion',
      data: convertedData,
      original: sampleApifyData
    });
  };

  const testApifyScraping = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing Apify scraping...');
      const scrapedData = await scrapingService.scrapePropertyWithApify(testUrl);
      setResult({
        type: 'Apify Scraping',
        data: scrapedData
      });
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResult({
        type: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const testApifyTrigger = async () => {
    setLoading(true);
    try {
      console.log('🚀 Testing Apify trigger...');
      const runResult = await triggerApifyRun(testUrl);
      setResult({
        type: 'Apify Trigger',
        data: runResult
      });
    } catch (error) {
      console.error('❌ Trigger failed:', error);
      setResult({
        type: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Apify Integration Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test URL:
            </label>
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter Zillow URL to test"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={testApifyConversion}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              🧪 Test Apify Conversion
            </button>
            
            <button
              onClick={testApifyScraping}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '⏳ Testing...' : '🚀 Test Apify Scraping'}
            </button>
            
            <button
              onClick={testApifyTrigger}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? '⏳ Triggering...' : '⚡ Trigger New Apify Run'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Results: {result.type}
            </h2>
            
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-red-800 font-medium">❌ Error:</h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Converted Property Data:
                  </h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {result.original && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Original Apify Data:
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(result.original, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            📊 What This Test Shows:
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>✅ <strong>Apify Data Quality:</strong> Clean, structured data vs messy HTML scraping</li>
            <li>✅ <strong>Conversion Process:</strong> How Apify data becomes HomeListingAI format</li>
            <li>✅ <strong>Fallback System:</strong> If Apify fails, uses your existing scraper</li>
            <li>✅ <strong>Integration Ready:</strong> This data can go straight into your listing creation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApifyTestPage; 