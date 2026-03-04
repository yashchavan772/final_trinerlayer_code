import asyncio
import aiohttp
import logging
import re
from typing import Set
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

WAYBACK_CDX_URL = "https://web.archive.org/cdx/search/cdx"
WAYBACK_TIMEOUT = 15
MAX_RESULTS = 10000


async def query_wayback(domain: str) -> Set[str]:
    """
    Query Internet Archive Wayback Machine CDX API for historical URLs.
    
    Extracts subdomains from archived URLs without fetching page content.
    
    Args:
        domain: Target domain (e.g., "example.com")
    
    Returns:
        Set of discovered subdomains
    """
    subdomains = set()
    
    params = {
        "url": f"*.{domain}/*",
        "output": "json",
        "fl": "original",
        "collapse": "urlkey",
        "limit": str(MAX_RESULTS),
        "filter": "statuscode:200"
    }
    
    try:
        timeout = aiohttp.ClientTimeout(total=WAYBACK_TIMEOUT)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(WAYBACK_CDX_URL, params=params) as response:
                if response.status != 200:
                    logger.warning(f"Wayback CDX returned status {response.status}")
                    return subdomains
                
                try:
                    data = await response.json()
                except Exception:
                    logger.warning("Failed to parse Wayback CDX JSON response")
                    return subdomains
                
                if not isinstance(data, list) or len(data) < 2:
                    return subdomains
                
                for row in data[1:]:
                    if not row:
                        continue
                    url = row[0] if isinstance(row, list) else row
                    subdomain = extract_subdomain(url, domain)
                    if subdomain:
                        subdomains.add(subdomain)
                
                logger.info(f"Wayback found {len(subdomains)} subdomains for {domain}")
    
    except asyncio.TimeoutError:
        logger.warning(f"Wayback CDX query timed out for {domain}")
    except aiohttp.ClientError as e:
        logger.warning(f"Wayback CDX connection error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in Wayback query: {e}")
    
    return subdomains


def extract_subdomain(url: str, domain: str) -> str:
    """
    Extract subdomain from a URL if it belongs to the target domain.
    
    Args:
        url: Full URL from archive
        domain: Target domain
    
    Returns:
        Subdomain or empty string if invalid
    """
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
