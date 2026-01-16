import re
from typing import Set

def normalize_subdomains(subdomains: Set[str], domain: str) -> Set[str]:
    """
    Normalize a set of subdomains.
    
    Normalization includes:
    - Lowercase conversion
    - Wildcard removal
    - Invalid character removal
    - Domain suffix validation
    
    Args:
        subdomains: Set of subdomains to normalize
        domain: Target domain for validation
    
    Returns:
        Set of normalized subdomains
    """
    normalized = set()
    domain_lower = domain.lower()
    
    for subdomain in subdomains:
        clean = normalize_single(subdomain, domain_lower)
        if clean:
            normalized.add(clean)
    
    return normalized


def normalize_single(subdomain: str, domain: str) -> str:
    """
    Normalize a single subdomain.
    
    Args:
        subdomain: Subdomain to normalize
        domain: Target domain (lowercase)
    
    Returns:
        Normalized subdomain or empty string if invalid
    """
    if not subdomain:
        return ""
    
    cleaned = subdomain.lower().strip()
    
    if cleaned.startswith('*.'):
        cleaned = cleaned[2:]
    cleaned = cleaned.replace('*', '')
    
    cleaned = re.sub(r':\d+$', '', cleaned)
    
    cleaned = cleaned.strip('.')
    
    if not cleaned:
        return ""
    
    if not (cleaned.endswith(f".{domain}") or cleaned == domain):
        return ""
    
    if not is_valid_format(cleaned):
        return ""
    
    return cleaned


def is_valid_format(hostname: str) -> bool:
    """
    Check if hostname has valid format.
    
    Args:
        hostname: Hostname to validate
    
    Returns:
        True if valid, False otherwise
    """
    if not hostname or len(hostname) > 253:
        return False
    
    if '*' in hostname or ' ' in hostname:
        return False
    
    if '..' in hostname:
        return False
    
    if hostname.startswith('-') or hostname.endswith('-'):
        return False
    
    if not all(c.isalnum() or c in '-.' for c in hostname):
        return False
    
    labels = hostname.split('.')
    for label in labels:
        if not label or len(label) > 63:
            return False
        if label.startswith('-') or label.endswith('-'):
            return False
    
    return True
