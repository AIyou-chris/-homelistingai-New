import scrapy
import json
import re
from datetime import datetime
from urllib.parse import urljoin
from ..items import PropertyItem, PropertyLoader

class RedfinSpider(scrapy.Spider):
    name = "redfin_spider"
    allowed_domains = ["redfin.com"]
    
    # Anti-detection settings
    custom_settings = {
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 3,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'CONCURRENT_REQUESTS': 1,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        'AUTOTHROTTLE_ENABLED': True,
        'AUTOTHROTTLE_START_DELAY': 2,
        'AUTOTHROTTLE_MAX_DELAY': 15,
        'AUTOTHROTTLE_TARGET_CONCURRENCY': 0.8,
        'AUTOTHROTTLE_DEBUG': True,
        'COOKIES_ENABLED': True,
        'DOWNLOAD_TIMEOUT': 30,
        'RETRY_TIMES': 3,
        'RETRY_HTTP_CODES': [500, 502, 503, 504, 408, 429],
        
        # User agent rotation
        'DOWNLOADER_MIDDLEWARES': {
            'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
            'real_estate_scraper.middlewares.RandomUserAgentMiddleware': 400,
        }
    }
    
    def __init__(self, urls=None, *args, **kwargs):
        super(RedfinSpider, self).__init__(*args, **kwargs)
        self.start_urls = []
        if urls:
            self.start_urls = urls.split(',')
        else:
            # Default test URL
            self.start_urls = [
                'https://www.redfin.com/WA/Cashmere/405-Valley-View-Dr-98815/home/85976965'
            ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse_property,
                meta={'dont_cache': True},
                headers={
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                    'DNT': '1',
                }
            )

    def parse_property(self, response):
        """Parse individual property page"""
        self.logger.info(f"Parsing Redfin property: {response.url}")
        
        loader = PropertyLoader(item=PropertyItem(), response=response)
        
        # Extract JSON-LD structured data
        json_data = self.extract_json_ld(response)
        
        # Basic property information
        loader.add_value('source_url', response.url)
        loader.add_value('source_site', 'redfin')
        loader.add_value('scraped_at', datetime.now().isoformat())
        
        # Extract address
        address = self.extract_address(response, json_data)
        loader.add_value('address', address)
        
        # Extract price
        price = self.extract_price(response, json_data)
        loader.add_value('price', price)
        
        # Extract property details
        bedrooms = self.extract_bedrooms(response, json_data)
        bathrooms = self.extract_bathrooms(response, json_data)
        square_feet = self.extract_square_feet(response, json_data)
        
        loader.add_value('bedrooms', bedrooms)
        loader.add_value('bathrooms', bathrooms)
        loader.add_value('square_feet', square_feet)
        
        # Extract description
        description = self.extract_description(response, json_data)
        loader.add_value('description', description)
        
        # Extract features
        features = self.extract_features(response)
        loader.add_value('features', features)
        
        # Extract images
        images = self.extract_images(response, json_data)
        loader.add_value('images', images)
        loader.add_value('image_urls', images)
        
        # Extract neighborhood
        neighborhood = self.extract_neighborhood(response)
        loader.add_value('neighborhood', neighborhood)
        
        # Extract agent information
        agent_name = self.extract_agent_name(response)
        agent_company = self.extract_agent_company(response)
        
        loader.add_value('agent_name', agent_name)
        loader.add_value('agent_company', agent_company)
        
        # Extract property type
        property_type = self.extract_property_type(response, json_data)
        loader.add_value('property_type', property_type)
        
        # Extract location details
        city, state, zip_code = self.extract_location_details(address)
        loader.add_value('city', city)
        loader.add_value('state', state)
        loader.add_value('zip_code', zip_code)
        
        self.logger.info(f"Extracted Redfin data: Address={address}, Price={price}, Beds={bedrooms}, Baths={bathrooms}, Images={len(images)}")
        
        yield loader.load_item()

    def extract_json_ld(self, response):
        """Extract JSON-LD structured data"""
        json_data = {}
        for script in response.xpath('//script[@type="application/ld+json"]/text()').getall():
            try:
                data = json.loads(script)
                if isinstance(data, dict):
                    json_data.update(data)
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            json_data.update(item)
            except json.JSONDecodeError:
                continue
        return json_data

    def extract_address(self, response, json_data):
        """Extract property address"""
        # Try JSON-LD first
        if json_data.get('address'):
            address_obj = json_data['address']
            if isinstance(address_obj, dict):
                street = address_obj.get('streetAddress', '')
                city = address_obj.get('addressLocality', '')
                state = address_obj.get('addressRegion', '')
                zip_code = address_obj.get('postalCode', '')
                return f"{street}, {city}, {state} {zip_code}".strip()
        
        # Try Redfin-specific selectors
        selectors = [
            '[data-testid="home-details-summary-address"]',
            '.home-details-summary-address',
            '[data-testid="address"]',
            '.address',
            'h1[data-testid="home-details-summary-address"]',
            '.home-details-summary h1',
            'h1',
            '.property-address',
            '.street-address',
            '.property-title'
        ]
        
        for selector in selectors:
            address = response.css(selector + '::text').get()
            if address and address.strip():
                return address.strip()
        
        return 'Address not found'

    def extract_price(self, response, json_data):
        """Extract property price"""
        # Try JSON-LD first
        if json_data.get('offers', {}).get('price'):
            return str(json_data['offers']['price'])
        
        # Try Redfin-specific selectors
        selectors = [
            '[data-testid="price"]',
            '.price',
            '[data-testid="home-details-summary-price"]',
            '.home-details-summary-price',
            '.property-price',
            '.listing-price',
            '.price-value',
            '.home-price'
        ]
        
        for selector in selectors:
            price = response.css(selector + '::text').get()
            if price and price.strip():
                return price.strip()
        
        return 'Price not available'

    def extract_bedrooms(self, response, json_data):
        """Extract number of bedrooms"""
        # Try JSON-LD first
        if json_data.get('numberOfBedrooms'):
            return int(json_data['numberOfBedrooms'])
        
        # Try pattern matching
        text = response.text
        bed_match = re.search(r'(\d+)\s*bed', text, re.IGNORECASE)
        if bed_match:
            return int(bed_match.group(1))
        
        return 0

    def extract_bathrooms(self, response, json_data):
        """Extract number of bathrooms"""
        # Try JSON-LD first
        if json_data.get('numberOfBathroomsTotal'):
            return float(json_data['numberOfBathroomsTotal'])
        
        # Try pattern matching
        text = response.text
        bath_match = re.search(r'(\d+(?:\.\d+)?)\s*bath', text, re.IGNORECASE)
        if bath_match:
            return float(bath_match.group(1))
        
        return 0

    def extract_square_feet(self, response, json_data):
        """Extract square footage"""
        # Try JSON-LD first
        if json_data.get('floorSize', {}).get('value'):
            return int(json_data['floorSize']['value'])
        
        # Try pattern matching
        text = response.text
        sqft_match = re.search(r'(\d+)\s*sq\s*ft', text, re.IGNORECASE)
        if sqft_match:
            return int(sqft_match.group(1))
        
        return 0

    def extract_description(self, response, json_data):
        """Extract property description"""
        # Try JSON-LD first
        if json_data.get('description'):
            return json_data['description']
        
        # Try Redfin-specific selectors
        selectors = [
            '[data-testid="home-description"]',
            '.home-description',
            '.description',
            '.property-description',
            '.listing-description'
        ]
        
        for selector in selectors:
            desc = response.css(selector + '::text').get()
            if desc and desc.strip():
                return desc.strip()
        
        return 'No description available'

    def extract_features(self, response):
        """Extract property features"""
        features = []
        
        # Extract from feature sections
        feature_selectors = [
            '.feature-item',
            '.amenity-item',
            '[data-testid="feature"]',
            '.property-features li',
            '.amenities li',
            '.home-features li',
            '.property-amenities li'
        ]
        
        for selector in feature_selectors:
            for element in response.css(selector):
                feature = element.css('::text').get()
                if feature and feature.strip():
                    features.append(feature.strip())
        
        return features

    def extract_images(self, response, json_data):
        """Extract property images"""
        images = []
        
        # Try JSON-LD first
        if json_data.get('image'):
            if isinstance(json_data['image'], list):
                images.extend(json_data['image'])
            else:
                images.append(json_data['image'])
        
        # Extract from img tags - Redfin specific
        img_selectors = [
            'img[src*="redfin.com"]',
            'img[src*="redfinstatic.com"]',
            'img[class*="photo"]',
            'img[class*="image"]',
            'img[data-testid="property-image"]'
        ]
        
        for selector in img_selectors:
            for img in response.css(selector):
                src = img.attrib.get('src') or img.attrib.get('data-src')
                if src and 'placeholder' not in src and 'logo' not in src:
                    if src.startswith('//'):
                        src = 'https:' + src
                    images.append(src)
        
        return list(set(images))  # Remove duplicates

    def extract_neighborhood(self, response):
        """Extract neighborhood information"""
        selectors = [
            '[data-testid="neighborhood"]',
            '.neighborhood',
            '.location-info',
            '.area-info'
        ]
        
        for selector in selectors:
            neighborhood = response.css(selector + '::text').get()
            if neighborhood and neighborhood.strip():
                return neighborhood.strip()
        
        return 'Neighborhood not specified'

    def extract_agent_name(self, response):
        """Extract agent name"""
        selectors = [
            '.agent-name',
            '.listing-agent',
            '[data-testid="agent-name"]',
            '.agent-info .name'
        ]
        
        for selector in selectors:
            name = response.css(selector + '::text').get()
            if name and name.strip():
                return name.strip()
        
        return ''

    def extract_agent_company(self, response):
        """Extract agent company"""
        selectors = [
            '.agent-company',
            '.brokerage',
            '[data-testid="agent-company"]',
            '.agent-info .company'
        ]
        
        for selector in selectors:
            company = response.css(selector + '::text').get()
            if company and company.strip():
                return company.strip()
        
        return ''

    def extract_property_type(self, response, json_data):
        """Extract property type"""
        # Try JSON-LD first
        if json_data.get('@type') == 'RealEstateListing':
            return 'Single Family'
        
        # Try CSS selectors
        selectors = [
            '.property-type',
            '.listing-type',
            '[data-testid="property-type"]'
        ]
        
        for selector in selectors:
            prop_type = response.css(selector + '::text').get()
            if prop_type and prop_type.strip():
                return prop_type.strip()
        
        return 'Single Family'

    def extract_location_details(self, address):
        """Extract city, state, zip from address"""
        if not address or address == 'Address not found':
            return '', '', ''
        
        # Simple regex to extract location details
        match = re.search(r',\s*([^,]+),\s*([A-Z]{2})\s*(\d{5})', address)
        if match:
            return match.group(1).strip(), match.group(2), match.group(3)
        
        return '', '', ''
