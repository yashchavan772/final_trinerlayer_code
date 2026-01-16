import re
from typing import Tuple

MAX_DOMAIN_LENGTH = 253
DOMAIN_PATTERN = re.compile(
    r'^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$'
)
IPV4_PATTERN = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$')
IPV6_PATTERN = re.compile(r'^[0-9a-fA-F:]+$')

BLOCKED_PATTERNS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '10.',
    '172.16.',
    '172.17.',
    '172.18.',
    '172.19.',
    '172.20.',
    '172.21.',
    '172.22.',
    '172.23.',
    '172.24.',
    '172.25.',
    '172.26.',
    '172.27.',
    '172.28.',
    '172.29.',
    '172.30.',
    '172.31.',
    '192.168.',
]


def validate_domain(domain: str) -> Tuple[bool, str, str]:
    """
    Validate and normalize a domain name.
    
    Returns:
        Tuple of (is_valid, normalized_domain, error_message)
    """
    if not domain:
        return False, "", "Domain is required"
    
    normalized = domain.strip().lower()
    
    if normalized.startswith(('http://', 'https://', 'ftp://')):
        return False, "", "Protocol prefixes not allowed. Provide domain only."
    
    if '/' in normalized or '?' in normalized or '#' in normalized:
        return False, "", "Paths, query strings, and fragments not allowed"
    
    if ':' in normalized and not IPV6_PATTERN.match(normalized):
        return False, "", "Port numbers not allowed"
    
    if '*' in normalized:
        return False, "", "Wildcards not allowed"
    
    if IPV4_PATTERN.match(normalized):
        return False, "", "IP addresses not allowed. Provide domain name only."
    
    if IPV6_PATTERN.match(normalized.replace(':', '')):
        return False, "", "IPv6 addresses not allowed. Provide domain name only."
    
    if len(normalized) > MAX_DOMAIN_LENGTH:
        return False, "", f"Domain exceeds maximum length of {MAX_DOMAIN_LENGTH} characters"
    
    for blocked in BLOCKED_PATTERNS:
        if normalized.startswith(blocked) or normalized == blocked.rstrip('.'):
            return False, "", "Internal/private domains not allowed"
    
    if not DOMAIN_PATTERN.match(normalized):
        return False, "", "Invalid domain format"
    
    parts = normalized.split('.')
    if len(parts) < 2:
        return False, "", "Domain must have at least one dot (e.g., example.com)"
    
    return True, normalized, ""
