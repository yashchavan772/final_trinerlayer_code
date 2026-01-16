"""Wayback Machine JS file discovery."""

import asyncio
import logging
import aiohttp
from typing import Set, Dict, Any
from urllib.parse import urlparse, urljoin

from ..utils.async_helpers import run_with_timeout, RateLimiter
from ..utils.validators import is_valid_js_url, is_vendor_js

logger = logging.getLogger(__name__)

WAYBACK_CDX_URL = "https://web.archive.org/cdx/search/cdx"
WAYBACK_TIMEOUT = 45
MAX_JS_FILES = 500


async def discover_wayback_js(
    domain: str,
    skip_vendor: bool = True,
    max_files: int = MAX_JS_FILES
) -> Dict[str, Any]:
    """
    Discover JavaScript files from Wayback Machine CDX API.
    
    Args:
        domain: Target domain
        skip_vendor: Whether to skip vendor/framework bundles
        max_files: Maximum number of JS files to return
        
    Returns:
        Dict with discovered JS URLs and metadata
    """
    js_urls: Set[str] = set()
    seen_hashes: Set[str] = set()
    
    params = {
        "url": f"*.{domain}/*.js",
        "output": "json",
        "fl": "original,digest,statuscode,mimetype",
        "filter": "statuscode:200",
        "collapse": "digest",
        "limit": str(max_files * 2)
    }
    
    try:
        timeout = aiohttp.ClientTimeout(total=WAYBACK_TIMEOUT)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(WAYBACK_CDX_URL, params=params) as response:
                if response.status != 200:
                    logger.warning(f"Wayback CDX returned {response.status}")
                    return {"urls": [], "count": 0, "source": "wayback", "success": False}
                
                data = await response.json()
                
                if not data or len(data) < 2:
                    return {"urls": [], "count": 0, "source": "wayback", "success": True}
                
                for row in data[1:]:
                    if len(row) < 4:
                        continue
                    
                    url, digest, status, mimetype = row[0], row[1], row[2], row[3]
                    
                    if digest in seen_hashes:
                        continue
                    seen_hashes.add(digest)
                    
                    if not is_valid_js_url(url):
                        continue
                    
                    if skip_vendor and is_vendor_js(url):
                        continue
                    
                    js_urls.add(url)
                    
                    if len(js_urls) >= max_files:
                        break
        
        urls_list = list(js_urls)[:max_files]
        
        logger.info(f"Wayback discovered {len(urls_list)} JS files for {domain}")
        
        return {
            "urls": urls_list,
            "count": len(urls_list),
            "source": "wayback",
            "success": True
        }
        
    except asyncio.TimeoutError:
        logger.warning(f"Wayback query timed out for {domain}")
        return {"urls": [], "count": 0, "source": "wayback", "success": False, "error": "timeout"}
    except Exception as e:
        logger.error(f"Wayback discovery error: {e}")
        return {"urls": [], "count": 0, "source": "wayback", "success": False, "error": str(e)}
