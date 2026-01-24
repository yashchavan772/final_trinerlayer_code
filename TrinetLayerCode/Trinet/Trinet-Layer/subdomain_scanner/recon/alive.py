import asyncio
import aiohttp
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

HTTP_TIMEOUT = 3
MAX_REDIRECTS = 3
MAX_CONCURRENT_HTTP = 30
VALID_STATUS_CODES = {200, 301, 302, 401, 403, 404, 500, 502, 503}


async def check_alive(subdomain: str, session: aiohttp.ClientSession) -> Dict[str, Any]:
    """
    Check if a subdomain is alive by sending HTTP/HTTPS HEAD requests.
    
    Args:
        subdomain: The subdomain to check
        session: aiohttp session for connection pooling
    
    Returns:
        Dict with alive status, HTTP status code, and protocol
    """
    result = {
        "subdomain": subdomain,
        "alive": False,
        "http_status": None,
        "protocol": None
    }
    
    for protocol in ['https', 'http']:
        url = f"{protocol}://{subdomain}"
        try:
            async with session.head(
                url,
                allow_redirects=True,
                max_redirects=MAX_REDIRECTS,
                ssl=False
            ) as response:
                if response.status in VALID_STATUS_CODES:
                    result["alive"] = True
                    result["http_status"] = response.status
                    result["protocol"] = protocol
                    return result
        except asyncio.TimeoutError:
            continue
        except aiohttp.ClientSSLError:
            continue
        except aiohttp.ClientConnectorError:
            continue
        except aiohttp.TooManyRedirects:
            result["alive"] = True
            result["http_status"] = 302
            result["protocol"] = protocol
            return result
        except Exception:
            continue
    
    return result


async def check_multiple_alive(subdomains: list) -> Dict[str, Dict[str, Any]]:
    """
    Check alive status for multiple subdomains concurrently.
    
    Args:
        subdomains: List of subdomains to check
    
    Returns:
        Dict mapping subdomain to alive status info
    """
    results = {}
    
    timeout = aiohttp.ClientTimeout(total=HTTP_TIMEOUT)
    connector = aiohttp.TCPConnector(limit=MAX_CONCURRENT_HTTP, ssl=False)
    
    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        semaphore = asyncio.Semaphore(MAX_CONCURRENT_HTTP)
        
        async def check_with_semaphore(subdomain: str):
            async with semaphore:
                return await check_alive(subdomain, session)
        
        tasks = [check_with_semaphore(subdomain) for subdomain in subdomains]
        completed = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in completed:
            if isinstance(result, Exception):
                continue
            if isinstance(result, dict):
                results[result["subdomain"]] = result
    
    alive_count = sum(1 for r in results.values() if r.get("alive"))
    logger.info(f"Alive check: {alive_count}/{len(subdomains)} subdomains responding")
    
    return results
