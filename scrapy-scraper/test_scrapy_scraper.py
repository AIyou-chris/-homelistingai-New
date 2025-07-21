#!/usr/bin/env python3
"""
Test script for the Scrapy real estate scraper
"""

import subprocess
import sys
import os
import json
from datetime import datetime

def run_scrapy_spider(spider_name, urls=None):
    """Run a Scrapy spider with optional URLs"""
    
    # Change to the scrapy project directory
    os.chdir('scrapy-scraper')
    
    # Build the command
    cmd = ['python3', '-m', 'scrapy', 'crawl', spider_name]
    
    if urls:
        cmd.extend(['-a', f'urls={urls}'])
    
    print(f"🚀 Running Scrapy spider: {spider_name}")
    print(f"📋 Command: {' '.join(cmd)}")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    try:
        # Run the spider
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        print("📊 SPIDER OUTPUT:")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️  ERRORS:")
            print(result.stderr)
        
        print("=" * 60)
        print(f"✅ Spider completed with return code: {result.returncode}")
        
        # Check for output files
        output_files = []
        for filename in ['properties.json', 'properties.csv']:
            if os.path.exists(filename):
                output_files.append(filename)
        
        if output_files:
            print(f"📁 Output files created: {', '.join(output_files)}")
            
            # Show sample of JSON output
            if 'properties.json' in output_files:
                try:
                    with open('properties.json', 'r') as f:
                        data = json.load(f)
                        print(f"📊 Extracted {len(data)} properties")
                        if data:
                            print("📋 Sample property data:")
                            sample = data[0]
                            for key, value in sample.items():
                                if key == 'images' and isinstance(value, list):
                                    print(f"  {key}: {len(value)} images")
                                elif isinstance(value, str) and len(value) > 100:
                                    print(f"  {key}: {value[:100]}...")
                                else:
                                    print(f"  {key}: {value}")
                except Exception as e:
                    print(f"❌ Error reading JSON output: {e}")
        else:
            print("⚠️  No output files found")
        
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        print("⏰ Spider timed out after 5 minutes")
        return False
    except Exception as e:
        print(f"❌ Error running spider: {e}")
        return False

def main():
    """Main test function"""
    
    print("🏠 ULTIMATE SCRAPY REAL ESTATE SCRAPER TEST")
    print("=" * 60)
    
    # Test URLs
    test_urls = [
        'https://www.zillow.com/homedetails/405-Valley-View-Dr-Cashmere-WA-98815/85976965_zpid/',
        'https://www.zillow.com/homedetails/123-Main-St-Seattle-WA-98101/12345678_zpid/'
    ]
    
    # Test the Zillow spider
    success = run_scrapy_spider('zillow_spider', ','.join(test_urls))
    
    if success:
        print("🎉 SUCCESS: Scrapy scraper is working!")
        print("💡 Next steps:")
        print("   1. Add more spiders (Redfin, Homes.com)")
        print("   2. Integrate with Supabase")
        print("   3. Add proxy support")
        print("   4. Scale up for bulk scraping")
    else:
        print("❌ FAILED: Scrapy scraper encountered issues")
        print("💡 Troubleshooting:")
        print("   1. Check internet connection")
        print("   2. Verify target URLs are accessible")
        print("   3. Check for anti-bot protection")
        print("   4. Review spider logs for errors")

if __name__ == "__main__":
    main() 