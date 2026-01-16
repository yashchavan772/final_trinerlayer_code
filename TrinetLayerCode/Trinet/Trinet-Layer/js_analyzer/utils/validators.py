"""Input validation utilities for JS Analyzer."""

import re
from typing import Tuple
from urllib.parse import urlparse


DOMAIN_REGEX = re.compile(
    r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
)

WILDCARD_DOMAIN_REGEX = re.compile(
    r'^\*\.(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
)


def validate_domain(domain: str) -> Tuple[bool, str, str]:
    """
    Validate and normalize a domain input.
    
    Args:
        domain: Domain string (can include wildcard like *.example.com)
        
    Returns:
        Tuple of (is_valid, normalized_domain, error_message)
    """
    if not domain:
        return False, "", "Domain is required"
    
    domain = domain.strip().lower()
    
    if domain.startswith("http://") or domain.startswith("https://"):
        try:
            parsed = urlparse(domain)
            domain = parsed.netloc or parsed.path
        except Exception:
            return False, "", "Invalid URL format"
    
    domain = domain.rstrip('/')
    
    is_wildcard = domain.startswith("*.")
    check_domain = domain[2:] if is_wildcard else domain
    
    if not DOMAIN_REGEX.match(check_domain):
        return False, "", f"Invalid domain format: {domain}"
    
    if len(check_domain) > 253:
        return False, "", "Domain name too long"
    
    return True, domain, ""


def is_valid_js_url(url: str) -> bool:
    """Check if URL points to a JavaScript file."""
    if not url:
        return False
    
    try:
        parsed = urlparse(url)
        path = parsed.path.lower()
        return path.endswith('.js') or '.js?' in path or '/js/' in path
    except Exception:
        return False


def is_vendor_js(url: str) -> bool:
    """Check if URL is likely a vendor/framework bundle to skip."""
    vendor_patterns = [
        'jquery', 'react', 'angular', 'vue', 'bootstrap',
        'lodash', 'moment', 'axios', 'webpack', 'polyfill',
        'vendor', 'bundle', 'chunk', 'runtime', 'node_modules',
        'cdn.', 'cdnjs.', 'unpkg.', 'jsdelivr.', 'googleapis.',
        '.min.js', '-min.js'
    ]
    
    url_lower = url.lower()
    return any(pattern in url_lower for pattern in vendor_patterns)


def sanitize_output(value: str, mask_secrets: bool = True) -> str:
    """Sanitize and optionally mask sensitive values in output."""
    if not value or not mask_secrets:
        return value
    
    if len(value) > 8:
        visible_chars = min(4, len(value) // 4)
        return value[:visible_chars] + '*' * (len(value) - visible_chars * 2) + value[-visible_chars:]
    
    return '*' * len(value)
