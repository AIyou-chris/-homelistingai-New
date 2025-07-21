import scrapy
import json
import re
from datetime import datetime
from urllib.parse import urljoin
from ..items import PropertyItem, PropertyLoader

class ZillowSpider(scrapy.Spider):
    name = "zillow_spider"
    allowed_domains = ["zillow.com", "homes.com", "realtor.com", "redfin.com", "trulia.com"]
    
    # Anti-detection settings
    custom_settings = {
        'DOWNLOAD_DELAY': 10,  # Increased delay for rate limiting
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'CONCURRENT_REQUESTS': 1,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        'AUTOTHROTTLE_ENABLED': True,
        'AUTOTHROTTLE_START_DELAY': 5,  # Increased start delay
        'AUTOTHROTTLE_MAX_DELAY': 20,  # Increased max delay
        'AUTOTHROTTLE_TARGET_CONCURRENCY': 0.2,  # Reduced concurrency
        'AUTOTHROTTLE_DEBUG': True,
        'DOWNLOAD_TIMEOUT': 60,  # Increased timeout
        'RETRY_TIMES': 5,  # Increased retries
        'RETRY_HTTP_CODES': [500, 502, 503, 504, 408, 429, 403],
        'HTTPCACHE_ENABLED': True,
        'HTTPCACHE_EXPIRATION_SECS': 3600,
        'HTTPCACHE_IGNORE_HTTP_CODES': [500, 502, 503, 504, 408, 429, 403],
        'ROBOTSTXT_OBEY': False,
        'COOKIES_ENABLED': True,
        'DOWNLOADER_MIDDLEWARES': {
            'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
            'real_estate_scraper.middlewares.RandomUserAgentMiddleware': 400,
        },
        'DEFAULT_REQUEST_HEADERS': {
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
    }
    
    def __init__(self, urls=None, *args, **kwargs):
        super(ZillowSpider, self).__init__(*args, **kwargs)
        self.start_urls = []
        if urls:
            self.start_urls = urls.split(',')
        else:
            # Default test URL
            self.start_urls = [
                'https://www.zillow.com/homedetails/405-Valley-View-Dr-Cashmere-WA-98815/85976965_zpid/'
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
        self.logger.info(f"Parsing property: {response.url}")
        
        loader = PropertyLoader(item=PropertyItem(), response=response)
        
        # Extract JSON-LD structured data
        json_data = self.extract_json_ld(response)
        
        # Determine source site
        source_site = 'zillow'
        if 'homes.com' in response.url:
            source_site = 'homes'
        elif 'realtor.com' in response.url:
            source_site = 'realtor'
        elif 'redfin.com' in response.url:
            source_site = 'redfin'
        elif 'trulia.com' in response.url:
            source_site = 'trulia'
        
        # Basic property information
        loader.add_value('source_url', response.url)
        loader.add_value('source_site', source_site)
        loader.add_value('scraped_at', datetime.now().isoformat())
        
        # Extract address
        address = self.extract_address(response, json_data)
        loader.add_value('address', address)
        
        # Extract price
        price = self.extract_price(response, json_data)
        loader.add_value('price', price)
        
        # Homes.com specific parsing
        if source_site == 'homes':
            self.logger.info("Parsing Homes.com property")
            # Homes.com has different structure, try specific selectors
            homes_address = response.css('[data-testid="address"]::text').get() or response.css('.address::text').get()
            if homes_address:
                loader.add_value('address', homes_address.strip())
            
            homes_price = response.css('[data-testid="price"]::text').get() or response.css('.price::text').get()
            if homes_price:
                loader.add_value('price', homes_price.strip())
        
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
        agent_company = self.extract_agent_company_enhanced(response)
        
        loader.add_value('agent_name', agent_name)
        loader.add_value('agent_company', agent_company)
        
        # Extract property type
        property_type = self.extract_property_type(response, json_data)
        loader.add_value('property_type', property_type)
        
        # Extract additional property details
        year_built = self.extract_year_built(response)
        lot_size = self.extract_lot_size(response)
        detailed_features = self.extract_detailed_features(response)
        
        loader.add_value('year_built', year_built)
        loader.add_value('lot_size', lot_size)
        loader.add_value('detailed_features', detailed_features)
        
        # Extract location details
        city, state, zip_code = self.extract_location_details(address)
        loader.add_value('city', city)
        loader.add_value('state', state)
        loader.add_value('zip_code', zip_code)
        
        self.logger.info(f"Extracted data: Address={address}, Price={price}, Beds={bedrooms}, Baths={bathrooms}, Images={len(images)}")
        
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
        
        # Try CSS selectors
        selectors = [
            '[data-testid="home-details-summary-address"]',
            '.home-details-summary-address',
            '[data-testid="address"]',
            '.address',
            'h1[data-testid="home-details-summary-address"]',
            '.home-details-summary h1',
            'h1',
            '.property-address'
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
        
        # Try CSS selectors - more aggressive
        selectors = [
            '[data-testid="price"]',
            '.price',
            '[data-testid="home-details-summary-price"]',
            '.home-details-summary-price',
            '.property-price',
            '.listing-price',
            '[data-testid="home-value"]',
            '.home-value',
            '.price-value',
            '.listing-price-value',
            '.property-price-value',
            '.price-display',
            '.price-text',
            '.price-label',
            '.price-amount',
            '.price-number',
            '.price-value-text',
            '.price-value-display',
            '.price-value-label',
            '.price-value-amount',
            '.price-value-number'
        ]
        
        for selector in selectors:
            price = response.css(selector + '::text').get()
            if price and price.strip():
                return price.strip()
        
        # Try pattern matching in the entire page
        text = response.text
        price_patterns = [
            r'\$[\d,]+(?:\.\d{2})?',
            r'\$[\d,]+',
            r'[\d,]+(?:\.\d{2})?\s*USD',
            r'[\d,]+(?:\.\d{2})?\s*dollars',
            r'Price:\s*\$[\d,]+(?:\.\d{2})?',
            r'Listed for:\s*\$[\d,]+(?:\.\d{2})?',
            r'Asking price:\s*\$[\d,]+(?:\.\d{2})?'
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)
        
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
            value = json_data['floorSize']['value']
            # Handle comma-separated numbers like "2,478"
            if isinstance(value, str):
                value = value.replace(',', '')
            return int(value)
        
        # Try pattern matching with comma support
        text = response.text
        # Look for patterns like "3,664 sqft" or "3664 sqft"
        sqft_match = re.search(r'(\d{1,3}(?:,\d{3})*)\s*sq\s*ft', text, re.IGNORECASE)
        if sqft_match:
            value = sqft_match.group(1).replace(',', '')
            return int(value)
        
        # Try alternative patterns
        sqft_match = re.search(r'(\d+)\s*sq\s*ft', text, re.IGNORECASE)
        if sqft_match:
            return int(sqft_match.group(1))
        
        return 0

    def extract_description(self, response, json_data):
        """Extract property description"""
        # Try JSON-LD first
        if json_data.get('description'):
            return json_data['description']
        
        # Try CSS selectors - more aggressive
        selectors = [
            '[data-testid="home-description"]',
            '.home-description',
            '.description',
            '.property-description',
            '[data-testid="property-description"]',
            '.property-description',
            '.listing-description',
            '.home-details-description',
            '.property-details-description',
            '.listing-details-description',
            '.home-summary-description',
            '.property-summary-description',
            '.listing-summary-description',
            '.description-text',
            '.description-content',
            '.description-body',
            '.description-paragraph',
            '.description-section',
            '.description-block',
            '.description-area',
            '.description-field'
        ]
        
        for selector in selectors:
            desc = response.css(selector + '::text').get()
            if desc and desc.strip():
                return desc.strip()
        
        # Try to find any paragraph with substantial text
        paragraphs = response.css('p::text').getall()
        for p in paragraphs:
            if p and len(p.strip()) > 50:  # Look for substantial paragraphs
                return p.strip()
        
        return 'No description available'

    def extract_features(self, response):
        """Extract property features"""
        features = []
        
        # Extract from "What's special" section
        special_section = response.xpath('//h2[contains(text(), "What\'s special")]/following-sibling::*')
        for element in special_section:
            text = element.xpath('.//text()').get()
            if text and len(text.strip()) > 3 and len(text.strip()) < 50:
                features.append(text.strip())
        
        # Extract from feature lists
        feature_selectors = [
            '.feature-item',
            '.amenity-item',
            '[data-testid="feature"]',
            '.property-features li',
            '.amenities li'
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
        
        # Extract from img tags
        img_selectors = [
            'img[src*="photos.zillowstatic.com"]',
            'img[src*="zillowstatic.com"]',
            'img[src*="zillow"]',
            'img[class*="photo"]',
            'img[class*="image"]'
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
            '.location-info'
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
            'a[href*="/agent/"]',
            '.agent-info a',
            '.listing-agent-name',
            'span:contains("Listed by") + *',
            'div:contains("Listed by") + *'
        ]
        
        for selector in selectors:
            name = response.css(selector + '::text').get()
            if name and name.strip():
                # Clean up the name
                name = name.strip()
                # Remove "Listed by" prefix if present
                if name.startswith('Listed by'):
                    name = name.replace('Listed by', '').strip()
                return name
        
        # Try to find agent name in text patterns
        text = response.text
        agent_patterns = [
            r'Listed by:\s*([^,\n]+)',
            r'Agent:\s*([^,\n]+)',
            r'Contact:\s*([^,\n]+)'
        ]
        
        for pattern in agent_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return ''

    def extract_agent_company(self, response):
        """Extract agent company"""
        selectors = [
            '.agent-company',
            '.brokerage',
            '[data-testid="agent-company"]',
            '.agent-info .company',
            '.listing-agent-company',
            '.brokerage-name'
        ]
        
        for selector in selectors:
            company = response.css(selector + '::text').get()
            if company and company.strip():
                return company.strip()
        
        # Try to find company in text patterns
        text = response.text
        company_patterns = [
            r'Windermere[^,\n]*',
            r'RE/MAX[^,\n]*',
            r'Coldwell Banker[^,\n]*',
            r'Keller Williams[^,\n]*',
            r'Century 21[^,\n]*',
            r'Berkshire Hathaway[^,\n]*'
        ]
        
        for pattern in company_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0).strip()
        
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

    def extract_year_built(self, response):
        """Extract year built"""
        # Try CSS selectors
        selectors = [
            '[data-testid="year-built"]',
            '.year-built',
            '.built-year',
            '.construction-year'
        ]
        
        for selector in selectors:
            year = response.css(selector + '::text').get()
            if year:
                # Extract year from text like "Built in 1946"
                year_match = re.search(r'(\d{4})', year)
                if year_match:
                    return int(year_match.group(1))
        
        # Try pattern matching in text
        text = response.text
        year_match = re.search(r'Built in (\d{4})', text)
        if year_match:
            return int(year_match.group(1))
        
        return None

    def extract_lot_size(self, response):
        """Extract lot size"""
        # Try CSS selectors
        selectors = [
            '[data-testid="lot-size"]',
            '.lot-size',
            '.acres',
            '.lot-acres'
        ]
        
        for selector in selectors:
            lot = response.css(selector + '::text').get()
            if lot:
                # Extract acres from text like "0.46 Acres"
                acre_match = re.search(r'(\d+\.?\d*)\s*Acres?', lot, re.IGNORECASE)
                if acre_match:
                    return float(acre_match.group(1))
        
        # Try pattern matching in text
        text = response.text
        acre_match = re.search(r'(\d+\.?\d*)\s*Acres?', text, re.IGNORECASE)
        if acre_match:
            return float(acre_match.group(1))
        
        return None

    def extract_detailed_features(self, response):
        """Extract detailed property features"""
        features = []
        
        # Extract from "Facts & features" section
        facts_section = response.xpath('//h2[contains(text(), "Facts & features")]/following-sibling::*')
        for element in facts_section:
            text = element.xpath('.//text()').get()
            if text and len(text.strip()) > 3 and len(text.strip()) < 100:
                features.append(text.strip())
        
        # Extract from "What's special" section
        special_section = response.xpath('//h2[contains(text(), "What\'s special")]/following-sibling::*')
        for element in special_section:
            text = element.xpath('.//text()').get()
            if text and len(text.strip()) > 3 and len(text.strip()) < 100:
                features.append(text.strip())
        
        # Extract from interior features
        interior_section = response.xpath('//h3[contains(text(), "Interior")]/following-sibling::*')
        for element in interior_section:
            text = element.xpath('.//text()').get()
            if text and len(text.strip()) > 3 and len(text.strip()) < 100:
                features.append(text.strip())
        
        # Try pattern matching for specific features
        text = response.text
        feature_patterns = [
            r'(\d+)\s*fireplaces?',
            r'(\d+)\s*bedrooms?',
            r'(\d+(?:\.\d+)?)\s*bathrooms?',
            r'(\d+(?:,\d+)*)\s*sq\s*ft',
            r'(\d+\.?\d*)\s*acres?',
            r'Built in (\d{4})',
            r'(\d+)\s*garage spaces?',
            r'(\d+)\s*parking spaces?'
        ]
        
        for pattern in feature_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                features.append(f"{pattern.split('(')[0].strip()}: {match}")
        
        return features

    def extract_agent_company_enhanced(self, response):
        """Extract agent company name with enhanced detection"""
        # Try CSS selectors
        selectors = [
            '[data-testid="agent-company"]',
            '.agent-company',
            '.listing-company',
            '.brokerage-company',
            '.real-estate-company'
        ]
        
        for selector in selectors:
            company = response.css(selector + '::text').get()
            if company and company.strip():
                return company.strip()
        
        # Try to find in agent section
        agent_section = response.xpath('//div[contains(@class, "agent")]//text()').getall()
        for text in agent_section:
            if 'LLC' in text or 'Inc' in text or 'Realty' in text or 'Properties' in text:
                return text.strip()
        
        # Try pattern matching in text
        text = response.text
        company_patterns = [
            r'Castlerock[^,\n]*',
            r'Windermere[^,\n]*',
            r'RE/MAX[^,\n]*',
            r'Coldwell Banker[^,\n]*',
            r'Keller Williams[^,\n]*',
            r'Century 21[^,\n]*',
            r'Berkshire Hathaway[^,\n]*'
        ]
        
        for pattern in company_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0).strip()
        
        return None
