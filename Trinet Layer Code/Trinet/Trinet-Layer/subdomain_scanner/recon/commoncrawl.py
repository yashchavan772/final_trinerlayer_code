import asyncio
import aiohttp
import logging
import re
from typing import Set
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

CC_INDEX_URL = "https://index.commoncrawl.org/CC-MAIN-2024-51-index"
CC_TIMEOUT = 15
MAX_RESULTS = 5000


async def query_commoncrawl(domain: str) -> Set[str]:
    """
    Query Common Crawl index API for hostnames related to the domain.
    
    No live crawling - only queries pre-indexed data.
    
    Args:
        domain: Target domain (e.g., "example.com")
    
    Returns:
        Set of discovered subdomains
    """
    subdomains = set()
    
    params = {
        "url": f"*.{domain}",
        "output": "json",
        "limit": str(MAX_RESULTS)
    }
    
    try:
        timeout = aiohttp.ClientTimeout(total=CC_TIMEOUT)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(CC_INDEX_URL, params=params) as response:
                if response.status == 404:
                    logger.info("Common Crawl index not found, trying alternate")
                    return await query_commoncrawl_alternate(domain, session)
                
                if response.status != 200:
                    logger.warning(f"Common Crawl returned status {response.status}")
                    return subdomains
                
                text = await response.text()
                
                for line in text.strip().split('\n'):
                    if not line:
                        continue
                    try:
                        import json
                        entry = json.loads(line)
                        url = entry.get("url", "")
                        subdomain = extract_subdomain(url, domain)
                        if subdomain:
                            subdomains.add(subdomain)
                    except Exception:
                        continue
                
                logger.info(f"Common Crawl found {len(subdomains)} subdomains for {domain}")
    
    except asyncio.TimeoutError:
        logger.warning(f"Common Crawl query timed out for {domain}")
    except aiohttp.ClientError as e:
        logger.warning(f"Common Crawl connection error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in Common Crawl query: {e}")
    
    return subdomains


async def query_commoncrawl_alternate(domain: str, session: aiohttp.ClientSession) -> Set[str]:
    """
    Try alternate Common Crawl indexes if main one fails.
    """
    subdomains = set()
    
    alternate_indexes = [
        "CC-MAIN-2024-46-index",
        "CC-MAIN-2024-42-index",
        "CC-MAIN-2024-38-index"
    ]
    
    for index_name in alternate_indexes:
        url = f"https://index.commoncrawl.org/{index_name}"
        params = {
            "url": f"*.{domain}",
            "output": "json",
            "limit": "1000"
        }
        
        try:
            async with session.get(url, params=params) as response:
                if response.status != 200:
                    continue
                
                text = await response.text()
                
                for line in text.strip().split('\n'):
                    if not line:
                        continue
                    try:
                        import json
                        entry = json.loads(line)
                        url_value = entry.get("url", "")
                        subdomain = extract_subdomain(url_value, domain)
                        if subdomain:
                            subdomains.add(subdomain)
                    except Exception:
                        continue
                
                if subdomains:
                    logger.info(f"Common Crawl ({index_name}) found {len(subdomains)} subdomains")
                    break
        except Exception:
            continue
    
    return subdomains


def extract_subdomain(url: str, domain: str) -> str:
    """Extract subdomain from URL if it belongs to target domain."""
    try:
        parsed = urlparse(url if url.startswith('http') else f"http://{url}")
        hostname = parsed.netloc.lower()
        
        hostname = re.sub(r':\d+$', '', hostname)
        
        if hostname.endswith(f".{domain}") or hostname == domain:
            if is_valid_hostname(hostname):
                return hostname
    except Exception:
        pass
    
    return ""


def is_valid_hostname(hostname: str) -> bool:
    """Check if hostname is valid."""
    if not hostname or '*' in hostname or ' ' in hostname:
        return False
    if len(hostname) > 253:
        return False
    return all(c.isalnum() or c in '-.' for c in hostname)
