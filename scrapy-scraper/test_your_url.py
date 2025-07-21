#!/usr/bin/env python3
"""
Test script for scraping the specific Zillow URL provided by the user
"""

import os
import sys
import subprocess
import json
from datetime import datetime

def test_specific_zillow_url():
    """Test the scraper with the user's specific Zillow URL"""
    
    # The URL the user wants to test
    test_url = "https://www.zillow.com/homedetails/506-S-Joseph-Ave-East-Wenatchee-WA-98802/455156325_zpid/"
    
    print("🏠 TESTING SPECIFIC ZILLOW URL SCRAPER")
    print("=" * 60)
    print(f"🚀 Testing URL: {test_url}")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Set the test URL as an environment variable
    os.environ['TEST_ZILLOW_URL'] = test_url
    
    # Run the scraper with the specific URL
    try:
        # Create a temporary spider file for this specific URL
        spider_content = f'''
import scrapy
from real_estate_scraper.items import PropertyItem
from real_estate_scraper.spiders.zillow_spider import ZillowSpider

class TestSpecificZillowSpider(ZillowSpider):
    name = 'test_specific_zillow'
    
    def start_requests(self):
        url = "{test_url}"
        yield scrapy.Request(url=url, callback=self.parse, meta={{'dont_cache': True}})
'''
        
        # Write the temporary spider
        with open('real_estate_scraper/spiders/test_specific_zillow.py', 'w') as f:
            f.write(spider_content)
        
        # Run the scraper
        cmd = [
            'scrapy', 'crawl', 'test_specific_zillow',
            '-s', 'FEEDS=properties_specific.json:json',
            '-s', 'LOG_LEVEL=INFO'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        print("\n📊 SPIDER OUTPUT:")
        print("=" * 60)
        
        if result.stdout:
            print(result.stdout)
        
        if result.stderr:
            print("⚠️  ERRORS:")
            print(result.stderr)
        
        # Check if output file was created
        if os.path.exists('properties_specific.json'):
            with open('properties_specific.json', 'r') as f:
                data = json.load(f)
            
            print("\n📋 EXTRACTED DATA:")
            print("=" * 60)
            for item in data:
                print(f"  Address: {item.get('address', 'N/A')}")
                print(f"  Price: {item.get('price', 'N/A')}")
                print(f"  Bedrooms: {item.get('bedrooms', 'N/A')}")
                print(f"  Bathrooms: {item.get('bathrooms', 'N/A')}")
                print(f"  Square Feet: {item.get('square_feet', 'N/A')}")
                print(f"  Description: {item.get('description', 'N/A')[:100]}...")
                print(f"  Images: {len(item.get('image_urls', []))} images")
                print(f"  Source URL: {item.get('source_url', 'N/A')}")
                print()
        else:
            print("❌ No output file created")
        
        print("=" * 60)
        print("✅ Test completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(test_specific_zillow_url()) 