"""Live web crawling for JS file discovery."""

import asyncio
import logging
import re
import aiohttp
from typing import Set, Dict, Any, List
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup

from ..utils.async_helpers import gather_with_concurrency, RateLimiter
from ..utils.validators import is_valid_js_url, is_vendor_js

logger = logging.getLogger(__name__)

CRAWL_TIMEOUT = 15
MAX_PAGES = 20
MAX_JS_PER_PAGE = 50

SCRIPT_SRC_PATTERN = re.compile(r'<script[^>]+src=["\']([^"\']+\.js[^"\']*)["\']', re.IGNORECASE)


async def fetch_page(session: aiohttp.ClientSession, url: str) -> str:
    """Fetch a page's HTML content."""
    try:
        async with session.get(url, allow_redirects=True) as response:
            if response.status == 200:
                content_type = response.headers.get('content-type', '')
                if 'text/html' in content_type:
                    return await response.text()
    except Exception as e:
        logger.debug(f"Failed to fetch {url}: {e}")
    return ""


def extract_js_urls(html: str, base_url: str) -> Set[str]:
    """Extract JavaScript URLs from HTML content."""
    js_urls = set()
    
    matches = SCRIPT_SRC_PATTERN.findall(html)
    for src in matches:
        if src.startswith('//'):
            src = 'https:' + src
        elif src.startswith('/'):
            parsed = urlparse(base_url)
            src = f"{parsed.scheme}://{parsed.netloc}{src}"
        elif not src.startswith('http'):
            src = urljoin(base_url, src)
        
        if is_valid_js_url(src):
            js_urls.add(src)
    
    try:
        soup = BeautifulSoup(html, 'html.parser')
        for script in soup.find_all('script', src=True):
            src = script.get('src', '')
            if src and isinstance(src, str):
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    parsed = urlparse(base_url)
                    src = f"{parsed.scheme}://{parsed.netloc}{src}"
                elif not src.startswith('http'):
                    src = urljoin(base_url, src)
                
                if is_valid_js_url(src):
                    js_urls.add(src)
    except Exception as e:
        logger.debug(f"BeautifulSoup parsing error: {e}")
    
    return js_urls


async def discover_live_js(
    domain: str,
    subdomains: List[str] | None = None,
    skip_vendor: bool = True,
    max_js_files: int = 200
) -> Dict[str, Any]:
    """
    Discover JavaScript files by crawling live pages.
    
    Args:
        domain: Target domain
        subdomains: Optional list of subdomains to crawl
        skip_vendor: Whether to skip vendor bundles
        max_js_files: Maximum JS files to return
        
    Returns:
        Dict with discovered JS URLs and metadata
    """
    all_js_urls: Set[str] = set()
    crawled_pages = 0
    
    targets = subdomains if subdomains else [domain]
    urls_to_crawl = []
    
    for target in targets[:MAX_PAGES]:
        for scheme in ['https', 'http']:
            urls_to_crawl.append(f"{scheme}://{target}/")
    
    try:
        timeout = aiohttp.ClientTimeout(total=CRAWL_TIMEOUT)
        connector = aiohttp.TCPConnector(limit=10, ssl=False)
        
        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            tasks = [fetch_page(session, url) for url in urls_to_crawl[:MAX_PAGES]]
            results = await gather_with_concurrency(tasks, max_concurrent=5)
            
            for i, html in enumerate(results):
                if isinstance(html, str) and html:
                    crawled_pages += 1
                    base_url = urls_to_crawl[i]
                    js_urls = extract_js_urls(html, base_url)
                    
                    for url in js_urls:
                        if skip_vendor and is_vendor_js(url):
                            continue
                        all_js_urls.add(url)
                        
                        if len(all_js_urls) >= max_js_files:
                            break
                
                if len(all_js_urls) >= max_js_files:
                    break
        
        urls_list = list(all_js_urls)[:max_js_files]
        
        logger.info(f"Live crawl discovered {len(urls_list)} JS files from {crawled_pages} pages")
        
        return {
            "urls": urls_list,
            "count": len(urls_list),
            "pages_crawled": crawled_pages,
            "source": "live_crawl",
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Live crawl error: {e}")
        return {
            "urls": list(all_js_urls),
            "count": len(all_js_urls),
            "source": "live_crawl",
            "success": False,
            "error": str(e)
        }
