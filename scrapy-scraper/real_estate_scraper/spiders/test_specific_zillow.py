
import scrapy
from real_estate_scraper.items import PropertyItem
from real_estate_scraper.spiders.zillow_spider import ZillowSpider

class TestSpecificZillowSpider(ZillowSpider):
    name = 'test_specific_zillow'
    
    def start_requests(self):
        url = "https://www.zillow.com/homedetails/506-S-Joseph-Ave-East-Wenatchee-WA-98802/455156325_zpid/"
        yield scrapy.Request(url=url, callback=self.parse, meta={'dont_cache': True})
