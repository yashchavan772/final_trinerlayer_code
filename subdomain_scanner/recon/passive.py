import asyncio
import aiohttp
import logging
import random
from typing import Set, Dict, Any, Tuple

logger = logging.getLogger(__name__)

CRT_SH_URL = "https://crt.sh/?q=%.{domain}&output=json"
CRT_SH_TIMEOUT = 30
CRT_SH_MAX_RETRIES = 3
CRT_SH_RETRY_DELAY = 2


async def query_crt_sh(domain: str) -> Tuple[Set[str], bool]:
    """
    Query Certificate Transparency logs via crt.sh to discover subdomains.
    
    This is a passive enumeration technique that searches public certificate
    records without making any requests to the target domain.
    
    Includes retry logic for handling 503 errors from crt.sh.
    
    Args:
        domain: The target domain (e.g., "example.com")
    
    Returns:
        Tuple of (Set of discovered subdomains, success boolean)
    """
    subdomains = set()
    url = CRT_SH_URL.format(domain=domain)
    
    for attempt in range(CRT_SH_MAX_RETRIES):
        try:
            timeout = aiohttp.ClientTimeout(total=CRT_SH_TIMEOUT)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url) as response:
                    if response.status == 503:
                        logger.warning(f"crt.sh returned 503 (attempt {attempt + 1}/{CRT_SH_MAX_RETRIES})")
                        if attempt < CRT_SH_MAX_RETRIES - 1:
                            delay = CRT_SH_RETRY_DELAY * (attempt + 1) + random.uniform(0, 1)
                            await asyncio.sleep(delay)
                            continue
                        return subdomains, False
                    
                    if response.status != 200:
                        logger.warning(f"crt.sh returned status {response.status}")
                        return subdomains, False
                    
                    try:
                        data = await response.json()
                    except Exception:
                        logger.warning("Failed to parse crt.sh JSON response")
                        return subdomains, False
                    
                    if not isinstance(data, list):
                        return subdomains, True
                    
                    for entry in data:
                        name_value = entry.get("name_value", "")
                        names = name_value.replace("\n", ",").split(",")
                        for name in names:
                            name = name.strip().lower()
                            if name.startswith("*."):
                                name = name[2:]
                            if name.endswith(f".{domain}") or name == domain:
                                if is_valid_subdomain(name):
                                    subdomains.add(name)
                    
                    return subdomains, True
        
        except asyncio.TimeoutError:
            logger.warning(f"crt.sh query timed out for {domain} (attempt {attempt + 1}/{CRT_SH_MAX_RETRIES})")
            if attempt < CRT_SH_MAX_RETRIES - 1:
                await asyncio.sleep(CRT_SH_RETRY_DELAY)
                continue
        except aiohttp.ClientError as e:
            logger.warning(f"crt.sh connection error: {e}")
            if attempt < CRT_SH_MAX_RETRIES - 1:
                await asyncio.sleep(CRT_SH_RETRY_DELAY)
                continue
        except Exception as e:
            logger.error(f"Unexpected error in crt.sh query: {e}")
            break
    
    return subdomains, False


def is_valid_subdomain(name: str) -> bool:
    """Check if a subdomain name is valid (no wildcards, valid chars)."""
    if not name or '*' in name or ' ' in name:
        return False
    if len(name) > 253:
        return False
    return all(c.isalnum() or c in '-.' for c in name)


async def passive_enumeration(domain: str) -> Dict[str, Any]:
    """
    Perform passive subdomain enumeration using multiple sources.
    
    Currently uses:
    - Certificate Transparency (crt.sh)
    
    Args:
        domain: Target domain
    
    Returns:
        Dict with discovered subdomains, sources, and metadata
    """
    results = {}
    metadata = {"crt_sh_success": True}
    
    crt_results, crt_success = await query_crt_sh(domain)
    metadata["crt_sh_success"] = crt_success
    
    for subdomain in crt_results:
        if subdomain not in results:
            results[subdomain] = {"sources": []}
        results[subdomain]["sources"].append("crt.sh")
    
    logger.info(f"Passive enumeration found {len(results)} subdomains for {domain}")
    return {"subdomains": results, "metadata": metadata}
