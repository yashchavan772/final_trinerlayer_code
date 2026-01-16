import re
import ipaddress
from urllib.parse import urlparse

BLOCKED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
]

PRIVATE_IP_RANGES = [
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    "169.254.0.0/16",
    "fc00::/7",
    "fe80::/10",
]

BLOCKED_SCHEMES = ["file", "ftp", "gopher", "data", "javascript"]

def is_private_ip(ip_str: str) -> bool:
    try:
        ip = ipaddress.ip_address(ip_str)
        for range_str in PRIVATE_IP_RANGES:
            if ip in ipaddress.ip_network(range_str, strict=False):
                return True
        return ip.is_private or ip.is_loopback or ip.is_link_local
    except ValueError:
        return False

def validate_target_url(url: str) -> tuple[bool, str]:
    if not url or not url.strip():
        return False, "URL cannot be empty"
    
    url = url.strip()
    
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid URL format"
    
    if parsed.scheme.lower() in BLOCKED_SCHEMES:
        return False, f"Blocked URL scheme: {parsed.scheme}"
    
    if parsed.scheme.lower() not in ["http", "https"]:
        return False, "Only HTTP and HTTPS protocols are allowed"
    
    hostname = parsed.hostname
    if not hostname:
        return False, "Invalid URL: no hostname found"
    
    if hostname.lower() in BLOCKED_HOSTS:
        return False, "Scanning localhost or loopback addresses is not allowed"
    
    if is_private_ip(hostname):
        return False, "Scanning private IP ranges is not allowed"
    
    if re.match(r"^\d+\.\d+\.\d+\.\d+$", hostname):
        if is_private_ip(hostname):
            return False, "Scanning private IP addresses is not allowed"
    
    return True, url

def normalize_url(url: str) -> str:
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    parsed = urlparse(url)
    normalized = f"{parsed.scheme}://{parsed.netloc}"
    if parsed.path:
        normalized += parsed.path.rstrip("/")
    if parsed.query:
        normalized += f"?{parsed.query}"
    return normalized
