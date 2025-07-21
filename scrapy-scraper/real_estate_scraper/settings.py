# Scrapy settings for real_estate_scraper project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = "real_estate_scraper"

SPIDER_MODULES = ["real_estate_scraper.spiders"]
NEWSPIDER_MODULE = "real_estate_scraper.spiders"

# Obey robots.txt rules of this website.
ROBOTSTXT_OBEY = False

# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
DOWNLOAD_DELAY = 5  # Increased delay for better anti-detection
# The download delay setting will honor only one of:
CONCURRENT_REQUESTS_PER_DOMAIN = 1
CONCURRENT_REQUESTS_PER_IP = 1
CONCURRENT_REQUESTS = 1  # Only one request at a time

# Disable cookies (enabled by default)
COOKIES_ENABLED = True

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
DEFAULT_REQUEST_HEADERS = {
   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
   "Accept-Language": "en-US,en;q=0.5",
   "Accept-Encoding": "gzip, deflate",
   "Connection": "keep-alive",
   "Upgrade-Insecure-Requests": "1",
}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "real_estate_scraper.middlewares.RealEstateScraperSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
   "real_estate_scraper.middlewares.RandomUserAgentMiddleware": 400,
   "real_estate_scraper.middlewares.AntiDetectionMiddleware": 350,
   "real_estate_scraper.middlewares.ProxyRotationMiddleware": 300,
   "real_estate_scraper.middlewares.RetryMiddleware": 250,
   "scrapy.downloadermiddlewares.useragent.UserAgentMiddleware": None,
}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
   "real_estate_scraper.pipelines.RealEstateScraperPipeline": 300,
   "real_estate_scraper.pipelines.ValidationPipeline": 400,
   "real_estate_scraper.pipelines.DuplicatesPipeline": 500,
   "real_estate_scraper.pipelines.MarketingPipeline": 600,
   "real_estate_scraper.pipelines.SupabasePipeline": 700,
   "real_estate_scraper.pipelines.JsonWriterPipeline": 800,
   "real_estate_scraper.pipelines.CsvWriterPipeline": 900,
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
AUTOTHROTTLE_ENABLED = True
# The initial download delay
AUTOTHROTTLE_START_DELAY = 3
# The maximum download delay to be set in case of high latencies
AUTOTHROTTLE_MAX_DELAY = 20
# The average number of requests Scrapy should be sending in parallel to
# each remote server
AUTOTHROTTLE_TARGET_CONCURRENCY = 0.5  # Reduced for better stealth
# Enable showing throttling stats for every response received:
AUTOTHROTTLE_DEBUG = True

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Retry settings
RETRY_ENABLED = True
RETRY_TIMES = 5
RETRY_HTTP_CODES = [500, 502, 503, 504, 408, 429, 403]

# Download timeout
DOWNLOAD_TIMEOUT = 30

# Logging settings
LOG_LEVEL = 'INFO'
LOG_FORMAT = '%(asctime)s [%(name)s] %(levelname)s: %(message)s'

# Feed export settings
FEEDS = {
    'properties.json': {
        'format': 'json',
        'encoding': 'utf8',
        'indent': 2,
        'overwrite': True,
    },
    'properties.csv': {
        'format': 'csv',
        'encoding': 'utf8',
        'overwrite': True,
    },
    'marketing_ready_properties.json': {
        'format': 'json',
        'encoding': 'utf8',
        'indent': 2,
        'overwrite': True,
    }
}

# Cache settings
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 3600  # 1 hour
HTTPCACHE_DIR = 'httpcache'
HTTPCACHE_IGNORE_HTTP_CODES = [500, 502, 503, 504, 408, 429, 403]
HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'

# Respect robots.txt
ROBOTSTXT_OBEY = False

# Concurrent requests
CONCURRENT_REQUESTS = 1
CONCURRENT_REQUESTS_PER_DOMAIN = 1

# Download delay
DOWNLOAD_DELAY = 3
RANDOMIZE_DOWNLOAD_DELAY = True

# Enable cookies
COOKIES_ENABLED = True

# Default request headers
DEFAULT_REQUEST_HEADERS = {
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

# Marketing settings
MARKETING_ENABLED = True
SOCIAL_MEDIA_READY = True
SEO_OPTIMIZED = True
