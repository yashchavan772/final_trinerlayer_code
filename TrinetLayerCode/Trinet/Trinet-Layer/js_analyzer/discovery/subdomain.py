"""Subdomain enumeration for PRO mode (passive only)."""

import asyncio
import logging
import aiohttp
import dns.resolver
from typing import Set, Dict, Any, List
from urllib.parse import urlparse

from ..utils.async_helpers import gather_with_concurrency, run_with_timeout

logger = logging.getLogger(__name__)

CRT_SH_URL = "https://crt.sh/?q=%.{domain}&output=json"
TIMEOUT = 30
DNS_TIMEOUT = 3
HTTP_CHECK_TIMEOUT = 5
MAX_SUBDOMAINS = 100


async def query_crt_sh(domain: str) -> Set[str]:
    """Query Certificate Transparency logs via crt.sh."""
    subdomains = set()
    url = CRT_SH_URL.format(domain=domain)
    
    try:
        timeout = aiohttp.ClientTimeout(total=TIMEOUT)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    for entry in data:
                        name = entry.get('name_value', '')
                        for subdomain in name.split('\n'):
                            subdomain = subdomain.strip().lower()
                            if subdomain and '*' not in subdomain:
                                if subdomain.endswith(f".{domain}") or subdomain == domain:
                                    subdomains.add(subdomain)
    except Exception as e:
        logger.debug(f"crt.sh query failed: {e}")
    
    return subdomains


def resolve_dns(subdomain: str) -> bool:
    """Check if subdomain resolves via DNS."""
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = DNS_TIMEOUT
        resolver.lifetime = DNS_TIMEOUT
        resolver.resolve(subdomain, 'A')
        return True
    except Exception:
        return False


async def check_http_status(session: aiohttp.ClientSession, subdomain: str) -> Dict[str, Any]:
    """Check HTTP status of a subdomain."""
    result = {"subdomain": subdomain, "alive": False, "status": None}
    
    for scheme in ['https', 'http']:
        try:
            url = f"{scheme}://{subdomain}/"
            async with session.get(url, allow_redirects=False) as response:
                if response.status in [200, 301, 302]:
                    result["alive"] = True
                    result["status"] = response.status
                    result["scheme"] = scheme
                    return result
        except Exception:
            continue
    
    return result


async def enumerate_subdomains(
    domain: str,
    check_alive: bool = True,
    max_results: int = MAX_SUBDOMAINS
) -> Dict[str, Any]:
    """
    Enumerate subdomains using passive sources only.
    
    Args:
        domain: Target domain
        check_alive: Whether to verify HTTP 200/301/302
        max_results: Maximum subdomains to return
        
    Returns:
        Dict with discovered subdomains and metadata
    """
    all_subdomains: Set[str] = set()
    alive_subdomains: List[Dict[str, Any]] = []
    
    crt_results = await run_with_timeout(query_crt_sh(domain), timeout=TIMEOUT, default=set())
    all_subdomains.update(crt_results)
    
    logger.info(f"Found {len(all_subdomains)} subdomains from passive sources")
    
    if not check_alive:
        return {
            "subdomains": list(all_subdomains)[:max_results],
            "count": len(all_subdomains),
            "alive_count": 0,
            "success": True
        }
    
    loop = asyncio.get_event_loop()
    dns_valid = []
    
    subdomain_list = list(all_subdomains)[:max_results * 2]
    
    for subdomain in subdomain_list:
        try:
            is_valid = await loop.run_in_executor(None, resolve_dns, subdomain)
            if is_valid:
                dns_valid.append(subdomain)
        except Exception:
            continue
    
    logger.info(f"{len(dns_valid)} subdomains passed DNS validation")
    
    if dns_valid:
        timeout = aiohttp.ClientTimeout(total=HTTP_CHECK_TIMEOUT)
        connector = aiohttp.TCPConnector(limit=10, ssl=False)
        
        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            tasks = [check_http_status(session, sub) for sub in dns_valid[:max_results]]
            results = await gather_with_concurrency(tasks, max_concurrent=10)
            
            for result in results:
                if isinstance(result, dict) and result.get("alive"):
                    alive_subdomains.append(result)
    
    logger.info(f"{len(alive_subdomains)} subdomains are alive (200/301/302)")
    
    return {
        "subdomains": [s["subdomain"] for s in alive_subdomains],
        "details": alive_subdomains,
        "total_found": len(all_subdomains),
        "dns_valid": len(dns_valid),
        "alive_count": len(alive_subdomains),
        "success": True
    }
