import json
import csv
from datetime import datetime
from itemadapter import ItemAdapter
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RealEstateScraperPipeline:
    def process_item(self, item, spider):
        """Process each scraped item"""
        adapter = ItemAdapter(item)
        
        # Clean and validate data
        self.clean_price(adapter)
        self.clean_bedrooms(adapter)
        self.clean_bathrooms(adapter)
        self.clean_square_feet(adapter)
        self.clean_images(adapter)
        self.add_timestamp(adapter)
        
        # Log the processed item
        spider.logger.info(f"Processed property: {adapter.get('address', 'Unknown')} - {adapter.get('price', 'N/A')}")
        
        return item
    
    def clean_price(self, adapter):
        """Clean and standardize price data"""
        price = adapter.get('price', '')
        if price and isinstance(price, str):
            # Remove non-numeric characters except commas and periods
            import re
            cleaned = re.sub(r'[^\d,.]', '', price)
            if cleaned:
                adapter['price'] = cleaned
    
    def clean_bedrooms(self, adapter):
        """Clean bedrooms data"""
        bedrooms = adapter.get('bedrooms', 0)
        if isinstance(bedrooms, str):
            import re
            match = re.search(r'(\d+)', bedrooms)
            if match:
                adapter['bedrooms'] = int(match.group(1))
            else:
                adapter['bedrooms'] = 0
        elif not isinstance(bedrooms, int):
            adapter['bedrooms'] = 0
    
    def clean_bathrooms(self, adapter):
        """Clean bathrooms data"""
        bathrooms = adapter.get('bathrooms', 0)
        if isinstance(bathrooms, str):
            import re
            match = re.search(r'(\d+(?:\.\d+)?)', bathrooms)
            if match:
                adapter['bathrooms'] = float(match.group(1))
            else:
                adapter['bathrooms'] = 0
        elif not isinstance(bathrooms, (int, float)):
            adapter['bathrooms'] = 0
    
    def clean_square_feet(self, adapter):
        """Clean square footage data"""
        sqft = adapter.get('square_feet', 0)
        if isinstance(sqft, str):
            import re
            match = re.search(r'(\d+)', sqft)
            if match:
                adapter['square_feet'] = int(match.group(1))
            else:
                adapter['square_feet'] = 0
        elif not isinstance(sqft, int):
            adapter['square_feet'] = 0
    
    def clean_images(self, adapter):
        """Clean and validate image URLs"""
        images = adapter.get('images', [])
        if isinstance(images, list):
            # Remove duplicates and invalid URLs
            cleaned_images = []
            for img in images:
                if img and isinstance(img, str) and img.startswith('http'):
                    cleaned_images.append(img)
            adapter['images'] = cleaned_images
            adapter['image_urls'] = cleaned_images
    
    def add_timestamp(self, adapter):
        """Add processing timestamp"""
        adapter['processed_at'] = datetime.now().isoformat()

class SupabasePipeline:
    """Pipeline to store items in Supabase database"""
    
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.api_url = f"{self.supabase_url}/rest/v1"
        self.headers = {
            'apikey': self.supabase_key,
            'Authorization': f'Bearer {self.supabase_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
    
    def process_item(self, item, spider):
        """Store item in Supabase"""
        if not self.supabase_url or not self.supabase_key:
            spider.logger.warning("Supabase credentials not found. Skipping database storage.")
            return item
        
        try:
            # Prepare data for Supabase
            data = self.prepare_data_for_supabase(item)
            
            # Insert into properties table
            response = requests.post(
                f"{self.api_url}/properties",
                headers=self.headers,
                json=data
            )
            
            if response.status_code == 201:
                spider.logger.info(f"✅ Stored property in Supabase: {data.get('address', 'Unknown')}")
            else:
                spider.logger.error(f"❌ Failed to store in Supabase: {response.status_code} - {response.text}")
                
        except Exception as e:
            spider.logger.error(f"❌ Supabase error: {str(e)}")
        
        return item
    
    def prepare_data_for_supabase(self, item):
        """Prepare item data for Supabase storage"""
        adapter = ItemAdapter(item)
        
        # Convert to dict and clean up
        data = dict(adapter)
        
        # Ensure required fields exist
        required_fields = ['address', 'source_url', 'source_site']
        for field in required_fields:
            if not data.get(field):
                data[field] = 'Unknown'
        
        # Convert images list to JSON string for storage
        if data.get('images'):
            data['images'] = json.dumps(data['images'])
        
        if data.get('features'):
            data['features'] = json.dumps(data['features'])
        
        # Add marketing metadata
        data['marketing_ready'] = True
        data['scraped_by'] = 'ultimate_scrapy_scraper'
        data['data_quality_score'] = self.calculate_quality_score(data)
        
        return data
    
    def calculate_quality_score(self, data):
        """Calculate data quality score for marketing"""
        score = 0
        
        # Basic info (40 points)
        if data.get('address') and data['address'] != 'Address not found':
            score += 20
        if data.get('price') and data['price'] != 'Price not available':
            score += 10
        if data.get('bedrooms', 0) > 0:
            score += 5
        if data.get('bathrooms', 0) > 0:
            score += 5
        
        # Media (30 points)
        images = data.get('images', [])
        if isinstance(images, str):
            try:
                images = json.loads(images)
            except:
                images = []
        
        if len(images) >= 5:
            score += 30
        elif len(images) >= 3:
            score += 20
        elif len(images) >= 1:
            score += 10
        
        # Description (20 points)
        if data.get('description') and data['description'] != 'No description available':
            score += 20
        
        # Features (10 points)
        features = data.get('features', [])
        if isinstance(features, str):
            try:
                features = json.loads(features)
            except:
                features = []
        
        if len(features) >= 3:
            score += 10
        elif len(features) >= 1:
            score += 5
        
        return min(score, 100)  # Cap at 100

class MarketingPipeline:
    """Pipeline to prepare data for marketing use"""
    
    def process_item(self, item, spider):
        """Enhance item with marketing data"""
        adapter = ItemAdapter(item)
        
        # Add marketing enhancements
        self.add_marketing_metadata(adapter)
        self.enhance_description(adapter)
        self.add_social_media_ready_content(adapter)
        
        return item
    
    def add_marketing_metadata(self, adapter):
        """Add marketing-specific metadata"""
        adapter['marketing_ready'] = True
        adapter['seo_title'] = self.generate_seo_title(adapter)
        adapter['social_description'] = self.generate_social_description(adapter)
        adapter['hashtags'] = self.generate_hashtags(adapter)
    
    def enhance_description(self, adapter):
        """Enhance property description for marketing"""
        description = adapter.get('description', '')
        if description and description != 'No description available':
            # Add marketing enhancements
            enhanced = f"🏠 {description}"
            if adapter.get('bedrooms'):
                enhanced += f" | {adapter['bedrooms']} bed"
            if adapter.get('bathrooms'):
                enhanced += f" | {adapter['bathrooms']} bath"
            if adapter.get('square_feet'):
                enhanced += f" | {adapter['square_feet']} sqft"
            
            adapter['enhanced_description'] = enhanced
    
    def add_social_media_ready_content(self, adapter):
        """Create social media ready content"""
        address = adapter.get('address', '')
        price = adapter.get('price', '')
        bedrooms = adapter.get('bedrooms', 0)
        bathrooms = adapter.get('bathrooms', 0)
        
        # Instagram post content
        instagram_post = f"🏠 New Listing Alert! 🏠\n\n"
        instagram_post += f"📍 {address}\n"
        if price and price != 'Price not available':
            instagram_post += f"💰 {price}\n"
        if bedrooms:
            instagram_post += f"🛏️ {bedrooms} bed"
        if bathrooms:
            instagram_post += f" 🚿 {bathrooms} bath\n"
        instagram_post += f"\n#realestate #newlisting #property"
        
        adapter['instagram_post'] = instagram_post
        
        # Twitter post content
        twitter_post = f"🏠 New listing: {address}"
        if price and price != 'Price not available':
            twitter_post += f" - {price}"
        twitter_post += f" #realestate #newlisting"
        
        adapter['twitter_post'] = twitter_post
    
    def generate_seo_title(self, adapter):
        """Generate SEO-friendly title"""
        address = adapter.get('address', '')
        price = adapter.get('price', '')
        bedrooms = adapter.get('bedrooms', 0)
        bathrooms = adapter.get('bathrooms', 0)
        
        title = f"{address} - "
        if price and price != 'Price not available':
            title += f"{price} - "
        if bedrooms:
            title += f"{bedrooms} bed"
        if bathrooms:
            title += f" {bathrooms} bath"
        title += " | Real Estate Listing"
        
        return title[:60]  # Keep under 60 chars for SEO
    
    def generate_social_description(self, adapter):
        """Generate social media description"""
        address = adapter.get('address', '')
        price = adapter.get('price', '')
        bedrooms = adapter.get('bedrooms', 0)
        bathrooms = adapter.get('bathrooms', 0)
        
        desc = f"Check out this amazing property at {address}!"
        if price and price != 'Price not available':
            desc += f" Priced at {price}."
        if bedrooms or bathrooms:
            desc += f" Features {bedrooms} bed, {bathrooms} bath."
        
        return desc[:160]  # Keep under 160 chars for social media
    
    def generate_hashtags(self, adapter):
        """Generate relevant hashtags"""
        hashtags = [
            "#realestate",
            "#newlisting", 
            "#property",
            "#homeforsale"
        ]
        
        if adapter.get('bedrooms'):
            hashtags.append(f"#{adapter['bedrooms']}bed")
        if adapter.get('bathrooms'):
            hashtags.append(f"#{adapter['bathrooms']}bath")
        
        return " ".join(hashtags)

class JsonWriterPipeline:
    """Pipeline to write items to JSON file"""
    
    def open_spider(self, spider):
        self.file = open('properties.json', 'w', encoding='utf-8')
        self.file.write('[\n')
        self.first_item = True
    
    def close_spider(self, spider):
        self.file.write('\n]')
        self.file.close()
    
    def process_item(self, item, spider):
        if not self.first_item:
            self.file.write(',\n')
        else:
            self.first_item = False
        
        line = json.dumps(ItemAdapter(item).asdict(), ensure_ascii=False, indent=2)
        self.file.write(line)
        return item

class CsvWriterPipeline:
    """Pipeline to write items to CSV file"""
    
    def open_spider(self, spider):
        self.file = open('properties.csv', 'w', newline='', encoding='utf-8')
        self.writer = None
        self.fieldnames = None
    
    def close_spider(self, spider):
        self.file.close()
    
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        if self.writer is None:
            # First item - write header
            self.fieldnames = list(adapter.keys())
            self.writer = csv.DictWriter(self.file, fieldnames=self.fieldnames)
            self.writer.writeheader()
        
        # Convert lists to strings for CSV
        row = {}
        for key, value in adapter.items():
            if isinstance(value, list):
                row[key] = ', '.join(str(v) for v in value)
            else:
                row[key] = value
        
        self.writer.writerow(row)
        return item

class DuplicatesPipeline:
    """Pipeline to remove duplicate items"""
    
    def __init__(self):
        self.ids_seen = set()
    
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Create a unique identifier for the property
        address = adapter.get('address', '')
        price = adapter.get('price', '')
        source_url = adapter.get('source_url', '')
        
        item_id = f"{address}_{price}_{source_url}"
        
        if item_id in self.ids_seen:
            spider.logger.info(f"Duplicate item found: {address}")
            raise DropItem(f"Duplicate item found: {item_id}")
        else:
            self.ids_seen.add(item_id)
            return item

class ValidationPipeline:
    """Pipeline to validate item data"""
    
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Check for required fields
        required_fields = ['address', 'source_url']
        for field in required_fields:
            if not adapter.get(field):
                spider.logger.warning(f"Missing required field: {field}")
        
        # Validate price
        price = adapter.get('price', '')
        if price and isinstance(price, str):
            import re
            if not re.match(r'^\d{1,3}(,\d{3})*$', price.replace('.', '')):
                spider.logger.warning(f"Invalid price format: {price}")
        
        # Validate bedrooms/bathrooms
        bedrooms = adapter.get('bedrooms', 0)
        bathrooms = adapter.get('bathrooms', 0)
        
        if not isinstance(bedrooms, int) or bedrooms < 0:
            spider.logger.warning(f"Invalid bedrooms: {bedrooms}")
        
        if not isinstance(bathrooms, (int, float)) or bathrooms < 0:
            spider.logger.warning(f"Invalid bathrooms: {bathrooms}")
        
        return item
