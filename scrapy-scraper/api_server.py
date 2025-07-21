#!/usr/bin/env python3
"""
API Server for Scrapy Real Estate Scraper
Connects the web interface to the working Scrapy scraper
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import os
import tempfile
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your web interface

class ScrapyAPIServer:
    def __init__(self):
        self.scrape_do_token = os.getenv('SCRAPE_DO_TOKEN', '0e2a18311b9643b1bca4891ad146b3c6b8df890ddf3')
    
    def run_scrapy_spider(self, urls):
        """Run the Scrapy spider and return results"""
        try:
            # Create a temporary file for the URLs
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
                f.write('\n'.join(urls))
                urls_file = f.name
            
            # Build the Scrapy command
            cmd = [
                'python3', '-m', 'scrapy', 'crawl', 'zillow_spider',
                '-a', f'urls={",".join(urls)}',
                '-s', 'DOWNLOAD_DELAY=3',
                '-s', 'CONCURRENT_REQUESTS=1',
                '-s', 'AUTOTHROTTLE_TARGET_CONCURRENCY=0.5'
            ]
            
            # Set environment variable for Scrape.do
            env = os.environ.copy()
            env['SCRAPE_DO_TOKEN'] = self.scrape_do_token
            
            print(f"🚀 Running Scrapy spider for URLs: {urls}")
            
            # Run the spider
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=300,  # 5 minute timeout
                env=env
            )
            
            print(f"✅ Scrapy completed with return code: {result.returncode}")
            
            # Read the results
            properties = []
            if os.path.exists('properties.json'):
                with open('properties.json', 'r') as f:
                    properties = json.load(f)
            
            # Clean up temporary file
            os.unlink(urls_file)
            
            return {
                'success': True,
                'properties': properties,
                'total_scraped': len(properties),
                'spider_output': result.stdout,
                'spider_errors': result.stderr
            }
            
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'error': 'Spider timed out after 5 minutes',
                'properties': []
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'properties': []
            }

# Initialize the server
scrapy_server = ScrapyAPIServer()

@app.route('/api/scrape', methods=['POST'])
def scrape_properties():
    """API endpoint to scrape properties"""
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({
                'success': False,
                'error': 'No URLs provided'
            }), 400
        
        print(f"📥 Received scrape request for {len(urls)} URLs")
        
        # Run the Scrapy spider
        result = scrapy_server.run_scrapy_spider(urls)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'scrape_do_token': 'configured' if scrapy_server.scrape_do_token else 'missing'
    })

@app.route('/api/test', methods=['GET'])
def test_scraper():
    """Test endpoint with a sample URL"""
    test_url = 'https://www.zillow.com/homedetails/1106-Filbeck-Pl-Wenatchee-WA-98801/91540'
    
    result = scrapy_server.run_scrapy_spider([test_url])
    
    return jsonify({
        'test_url': test_url,
        'result': result
    })

if __name__ == '__main__':
    print("🚀 Starting Scrapy API Server...")
    print("📡 API endpoints:")
    print("   POST /api/scrape - Scrape properties")
    print("   GET  /api/health - Health check")
    print("   GET  /api/test   - Test scraper")
    print("🌐 Server will run on http://localhost:5001")
    
    app.run(host='0.0.0.0', port=5001, debug=True) 