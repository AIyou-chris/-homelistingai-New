# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from itemloaders import ItemLoader
from itemloaders.processors import TakeFirst, Join, Compose
import re

class PropertyItem(scrapy.Item):
    # Basic property information
    address = scrapy.Field()
    price = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    square_feet = scrapy.Field()
    lot_size = scrapy.Field()
    year_built = scrapy.Field()
    
    # Detailed information
    description = scrapy.Field()
    features = scrapy.Field()
    detailed_features = scrapy.Field()
    neighborhood = scrapy.Field()
    school_district = scrapy.Field()
    
    # Media
    images = scrapy.Field()
    image_urls = scrapy.Field()
    
    # Property details
    property_type = scrapy.Field()
    listing_type = scrapy.Field()
    mls_number = scrapy.Field()
    
    # Agent information
    agent_name = scrapy.Field()
    agent_company = scrapy.Field()
    agent_phone = scrapy.Field()
    agent_email = scrapy.Field()
    
    # Location
    city = scrapy.Field()
    state = scrapy.Field()
    zip_code = scrapy.Field()
    county = scrapy.Field()
    
    # Financial
    price_per_sqft = scrapy.Field()
    hoa_fees = scrapy.Field()
    property_tax = scrapy.Field()
    
    # Metadata
    source_url = scrapy.Field()
    source_site = scrapy.Field()
    scraped_at = scrapy.Field()
    processed_at = scrapy.Field()
    
    # Status
    status = scrapy.Field()
    days_on_market = scrapy.Field()
    last_updated = scrapy.Field()

    # --- MARKETING & SOCIAL FIELDS ---
    marketing_ready = scrapy.Field()
    seo_title = scrapy.Field()
    social_description = scrapy.Field()
    hashtags = scrapy.Field()
    enhanced_description = scrapy.Field()
    instagram_post = scrapy.Field()
    twitter_post = scrapy.Field()
    scraped_by = scrapy.Field()
    data_quality_score = scrapy.Field()

def clean_price(value):
    """Clean price data"""
    if value and isinstance(value, str):
        return re.sub(r'[^\d,.]', '', value)
    return value

def clean_bedrooms(value):
    """Clean bedrooms data"""
    if value and isinstance(value, str):
        match = re.search(r'\d+', value)
        if match:
            return int(match.group())
    elif isinstance(value, int):
        return value
    return 0

def clean_bathrooms(value):
    """Clean bathrooms data"""
    if value and isinstance(value, str):
        match = re.search(r'\d+(?:\.\d+)?', value)
        if match:
            return float(match.group())
    elif isinstance(value, (int, float)):
        return value
    return 0

def clean_square_feet(value):
    """Clean square footage data"""
    if value and isinstance(value, str):
        match = re.search(r'\d+', value)
        if match:
            return int(match.group())
    elif isinstance(value, int):
        return value
    return 0

def keep_images(value):
    """Keep all images"""
    return value

class PropertyLoader(ItemLoader):
    default_output_processor = TakeFirst()
    
    # Clean up price
    price_in = Compose(TakeFirst(), clean_price)
    
    # Clean up bedrooms/bathrooms
    bedrooms_in = Compose(TakeFirst(), clean_bedrooms)
    bathrooms_in = Compose(TakeFirst(), clean_bathrooms)
    
    # Clean up square feet
    square_feet_in = Compose(TakeFirst(), clean_square_feet)
    
    # Join features into list
    features_out = Join(', ')
    
    # Keep all images
    images_out = keep_images
    image_urls_out = keep_images
