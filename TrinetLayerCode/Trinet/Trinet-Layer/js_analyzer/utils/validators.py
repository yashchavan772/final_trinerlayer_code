"""Input validation utilities for JS Analyzer with false positive reduction."""

import re
from typing import Tuple, Optional, List
from urllib.parse import urlparse


DOMAIN_REGEX = re.compile(
    r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
)

WILDCARD_DOMAIN_REGEX = re.compile(
    r'^\*\.(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
)

VENDOR_DOMAINS = [
    'cdn.', 'cdnjs.', 'unpkg.', 'jsdelivr.', 'googleapis.',
    'cloudflare.', 'bootstrapcdn.', 'code.jquery.', 'assets.',
    'static.', 'fonts.', 'ajax.', 'maxcdn.', 'stackpath.',
]

VENDOR_PATHS = [
    'jquery', 'react', 'angular', 'vue', 'bootstrap',
    'lodash', 'moment', 'axios', 'webpack', 'polyfill',
    'vendor', 'vendors', 'bundle', 'chunk', 'runtime',
    'node_modules', 'bower_components', 'dist/',
    '.min.js', '-min.js', '.bundle.js',
    'core-js', 'zone.js', 'rxjs', 'tslib',
    'd3.', 'chart.', 'three.', 'socket.io',
]

PLACEHOLDER_PATTERNS = [
    r'^test[_-]?',
    r'^example[_-]?',
    r'^demo[_-]?',
    r'^sample[_-]?',
    r'^dummy[_-]?',
    r'^mock[_-]?',
    r'^fake[_-]?',
    r'^placeholder',
    r'^xxx+$',
    r'^your[_-]?',
    r'^my[_-]?',
    r'^replace[_-]?me',
    r'^insert[_-]?',
    r'^todo',
    r'^fixme',
    r'^\*+$',
    r'^\.+$',
    r'^_+$',
    r'^0+$',
    r'^1+$',
    r'^abc',
    r'^123',
    r'password123',
    r'admin123',
    r'secret123',
    r'^sk_test_',
    r'^pk_test_',
    r'^rzp_test_',
    r'sandbox',
    r'staging',
]

REAL_EMAIL_DOMAINS = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'protonmail.com', 'icloud.com', 'mail.com', 'aol.com',
    'zoho.com', 'yandex.com', 'gmx.com', 'live.com',
]

FAKE_EMAIL_DOMAINS = [
    'example.com', 'example.org', 'test.com', 'test.org',
    'localhost', 'domain.com', 'email.com', 'mail.test',
    'yourcompany.com', 'company.com', 'acme.com',
]

CDN_IP_RANGES = [
    r'^104\.16\.',
    r'^104\.17\.',
    r'^104\.18\.',
    r'^104\.19\.',
    r'^172\.6[4-9]\.',
    r'^172\.7[0-1]\.',
    r'^13\.32\.',
    r'^13\.33\.',
    r'^13\.35\.',
    r'^52\.',
    r'^54\.',
    r'^34\.',
    r'^35\.',
]


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
    if not url:
        return False
    
    url_lower = url.lower()
    
    for domain in VENDOR_DOMAINS:
        if domain in url_lower:
            return True
    
    for pattern in VENDOR_PATHS:
        if pattern in url_lower:
            return True
    
    return False


def is_third_party_url(url: str, target_domain: str) -> bool:
    """
    Check if URL is from a third-party domain (not the target).
    
    Third-party code findings are typically suppressed as they're
    not actionable for the target domain owner.
    """
    if not url or not target_domain:
        return False
    
    try:
        parsed = urlparse(url)
        url_domain = parsed.netloc.lower()
        target = target_domain.lower().lstrip('*.')
        
        if target in url_domain or url_domain.endswith('.' + target):
            return False
        
        return True
    except Exception:
        return False


def is_placeholder_value(value: str) -> bool:
    """
    Check if a value appears to be a placeholder, mock, or example.
    These should be suppressed to reduce false positives.
    """
    if not value:
        return True
    
    value_lower = value.lower().strip()
    
    for pattern in PLACEHOLDER_PATTERNS:
        if re.match(pattern, value_lower):
            return True
    
    if len(set(value)) <= 2 and len(value) > 4:
        return True
    
    if value_lower in ['null', 'undefined', 'none', 'empty', 'na', 'n/a']:
        return True
    
    return False


def is_test_key(value: str) -> bool:
    """Check if the value is a test/sandbox key that shouldn't be flagged as critical."""
    if not value:
        return False
    
    value_lower = value.lower()
    test_indicators = [
        'test', 'sandbox', 'demo', 'staging', 'dev',
        'development', 'sample', 'example', 'dummy',
    ]
    
    for indicator in test_indicators:
        if indicator in value_lower:
            return True
    
    if value_lower.startswith('sk_test_') or value_lower.startswith('pk_test_'):
        return True
    if value_lower.startswith('rzp_test_'):
        return True
    
    return False


def is_valid_email_for_bounty(email: str) -> bool:
    """
    Validate email for bug bounty relevance.
    Filters out placeholder/fake emails.
    """
    if not email or '@' not in email:
        return False
    
    email_lower = email.lower()
    
    for fake in FAKE_EMAIL_DOMAINS:
        if email_lower.endswith('@' + fake):
            return False
    
    if any(email_lower.startswith(p) for p in ['test@', 'example@', 'demo@', 'user@', 'admin@', 'info@', 'support@', 'noreply@']):
        return False
    
    return True


def is_cdn_ip(ip: str) -> bool:
    """Check if IP belongs to known CDN ranges (should be suppressed)."""
    if not ip:
        return False
    
    for pattern in CDN_IP_RANGES:
        if re.match(pattern, ip):
            return True
    
    return False


def is_private_ip(ip: str) -> bool:
    """Check if IP is a private/internal IP address."""
    if not ip:
        return False
    
    private_patterns = [
        r'^10\.',
        r'^172\.(1[6-9]|2[0-9]|3[0-1])\.',
        r'^192\.168\.',
        r'^127\.',
        r'^169\.254\.',
        r'^0\.',
    ]
    
    for pattern in private_patterns:
        if re.match(pattern, ip):
            return True
    
    return False


def is_in_comment_context(content: str, match_start: int) -> bool:
    """
    Check if a match position is within a comment block.
    Findings in comments have lower exploitability.
    """
    before = content[max(0, match_start - 200):match_start]
    
    if '//' in before:
        last_newline = before.rfind('\n')
        last_comment = before.rfind('//')
        if last_comment > last_newline:
            return True
    
    if '/*' in before:
        last_open = before.rfind('/*')
        last_close = before.rfind('*/')
        if last_open > last_close:
            return True
    
    return False


def is_in_test_context(content: str, match_start: int) -> bool:
    """
    Check if a match is within test/demo code context.
    """
    context_start = max(0, match_start - 500)
    before = content[context_start:match_start].lower()
    
    test_indicators = [
        'describe(', 'it(', 'test(', 'expect(', 'assert',
        'mocha', 'jest', 'jasmine', 'karma', 'cypress',
        'mock', 'stub', 'spy', 'fixture', 'beforeeach', 'aftereach',
    ]
    
    for indicator in test_indicators:
        if indicator in before:
            return True
    
    return False


def sanitize_output(value: str, mask_secrets: bool = True) -> str:
    """Sanitize and optionally mask sensitive values in output."""
    if not value or not mask_secrets:
        return value
    
    if len(value) > 8:
        visible_chars = min(4, len(value) // 4)
        return value[:visible_chars] + '*' * (len(value) - visible_chars * 2) + value[-visible_chars:]
    
    return '*' * len(value)


def validate_aws_key_format(value: str) -> bool:
    """Validate AWS Access Key format strictly."""
    if not value:
        return False
    
    valid_prefixes = ('AKIA', 'A3T', 'AGPA', 'AIDA', 'AROA', 'AIPA', 'ANPA', 'ANVA', 'ASIA')
    
    if not value.startswith(valid_prefixes):
        return False
    
    if len(value) != 20:
        return False
    
    if not re.match(r'^[A-Z0-9]+$', value):
        return False
    
    return True


def validate_jwt_format(value: str) -> bool:
    """Validate JWT token format strictly."""
    if not value:
        return False
    
    parts = value.split('.')
    if len(parts) != 3:
        return False
    
    if not all(len(p) >= 10 for p in parts):
        return False
    
    if not value.startswith('eyJ'):
        return False
    
    return True


def validate_stripe_key(value: str, require_live: bool = True) -> bool:
    """Validate Stripe key format. Can require live keys only."""
    if not value:
        return False
    
    if require_live:
        return value.startswith('sk_live_') or value.startswith('rk_live_')
    
    return value.startswith(('sk_live_', 'sk_test_', 'pk_live_', 'pk_test_', 'rk_live_', 'rk_test_'))


def get_context_lines(content: str, match_start: int, lines_before: int = 2, lines_after: int = 2) -> str:
    """Get surrounding lines for context analysis."""
    lines = content.split('\n')
    current_pos = 0
    match_line = 0
    
    for i, line in enumerate(lines):
        if current_pos + len(line) >= match_start:
            match_line = i
            break
        current_pos += len(line) + 1
    
    start_line = max(0, match_line - lines_before)
    end_line = min(len(lines), match_line + lines_after + 1)
    
    return '\n'.join(lines[start_line:end_line])
