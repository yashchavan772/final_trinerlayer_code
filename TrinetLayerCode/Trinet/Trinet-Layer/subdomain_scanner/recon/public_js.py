import asyncio
import aiohttp
import logging
import re
from typing import Set

logger = logging.getLogger(__name__)

JS_TIMEOUT = 10
MAX_JS_SIZE = 1024 * 1024
MAX_JS_FILES = 10
MAX_CONCURRENT_JS = 5

COMMON_JS_PATHS = [
    "/main.js",
    "/app.js",
    "/bundle.js",
    "/vendor.js",
    "/config.js",
    "/settings.js",
    "/static/js/main.js",
    "/assets/js/app.js",
    "/dist/main.js",
    "/js/app.js"
]


async def analyze_public_js(domain: str) -> Set[str]:
    """
    Analyze publicly accessible JavaScript files for subdomain references.
    
    Static parsing only - no JavaScript execution.
    Enforces file size and timeout limits.
    
    Args:
        domain: Target domain (e.g., "example.com")
    
    Returns:
        Set of discovered subdomains
    """
    subdomains = set()
    
    timeout = aiohttp.ClientTimeout(total=JS_TIMEOUT)
    connector = aiohttp.TCPConnector(limit=MAX_CONCURRENT_JS, ssl=False)
    
    try:
        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            semaphore = asyncio.Semaphore(MAX_CONCURRENT_JS)
            
            async def fetch_and_parse(url: str) -> Set[str]:
                async with semaphore:
                    return await parse_js_file(url, domain, session)
            
            js_urls = []
            for protocol in ['https', 'http']:
                for path in COMMON_JS_PATHS[:MAX_JS_FILES]:
                    js_urls.append(f"{protocol}://{domain}{path}")
            
            js_urls = js_urls[:MAX_JS_FILES * 2]
            
            tasks = [fetch_and_parse(url) for url in js_urls]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, set):
                    subdomains.update(result)
        
        logger.info(f"JS analysis found {len(subdomains)} subdomains for {domain}")
    
    except Exception as e:
        logger.error(f"JS analysis error: {e}")
    
    return subdomains


async def parse_js_file(url: str, domain: str, session: aiohttp.ClientSession) -> Set[str]:
    """
    Fetch and parse a JavaScript file for subdomain references.
    
    Args:
        url: URL of the JavaScript file
        domain: Target domain
        session: aiohttp session
    
    Returns:
        Set of discovered subdomains
    """
    subdomains = set()
    
    try:
        async with session.get(url, allow_redirects=True, ssl=False) as response:
            if response.status != 200:
                return subdomains
            
            content_length = response.headers.get('Content-Length', '0')
            if int(content_length) > MAX_JS_SIZE:
                logger.debug(f"JS file too large: {url}")
                return subdomains
            
            content_type = response.headers.get('Content-Type', '')
            if 'javascript' not in content_type and 'text' not in content_type:
                return subdomains
            
            content = await response.text()
            
            if len(content) > MAX_JS_SIZE:
                content = content[:MAX_JS_SIZE]
            
            subdomains = extract_subdomains_from_js(content, domain)
    
    except asyncio.TimeoutError:
        pass
    except aiohttp.ClientError:
        pass
    except Exception:
        pass
    
    return subdomains


def extract_subdomains_from_js(content: str, domain: str) -> Set[str]:
    """
    Extract subdomain references from JavaScript content.
    
    Args:
        content: JavaScript file content
        domain: Target domain
    
    Returns:
        Set of discovered subdomains
    """
    subdomains = set()
    
    escaped_domain = re.escape(domain)
    
    patterns = [
        rf'["\']https?://([a-zA-Z0-9][-a-zA-Z0-9]*\.)*{escaped_domain}["\'/]',
        rf'["\']//([a-zA-Z0-9][-a-zA-Z0-9]*\.)*{escaped_domain}["\'/]',
        rf'["\']([-a-zA-Z0-9]+\.{escaped_domain})["\']',
        rf'host["\s:=]+["\']?([-a-zA-Z0-9.]*\.{escaped_domain})',
        rf'domain["\s:=]+["\']?([-a-zA-Z0-9.]*\.{escaped_domain})',
        rf'api["\s:=]+["\']?https?://([-a-zA-Z0-9.]*\.{escaped_domain})',
        rf'url["\s:=]+["\']?https?://([-a-zA-Z0-9.]*\.{escaped_domain})',
    ]
    
    for pattern in patterns:
        try:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = match[-1] if match[-1] else match[0]
                
                if not match:
                    continue
                
                hostname = match.lower().strip('"\'/: ')
                
                if hostname.startswith('http'):
                    continue
                
                if hostname.endswith(f".{domain}") or hostname == domain:
                    if is_valid_hostname(hostname):
                        subdomains.add(hostname)
        except Exception:
            continue
    
    subdomain_pattern = rf'([a-zA-Z0-9][-a-zA-Z0-9]*\.{escaped_domain})'
    try:
        matches = re.findall(subdomain_pattern, content, re.IGNORECASE)
        for match in matches:
            hostname = match.lower()
            if is_valid_hostname(hostname):
                subdomains.add(hostname)
    except Exception:
        pass
    
    return subdomains


def is_valid_hostname(hostname: str) -> bool:
    """Check if hostname is valid."""
    if not hostname or '*' in hostname or ' ' in hostname:
        return False
    if len(hostname) > 253:
        return False
    if '..' in hostname or hostname.startswith('.') or hostname.endswith('.'):
        return False
    return all(c.isalnum() or c in '-.' for c in hostname)
