from typing import Dict

HIGH_RISK_KEYWORDS = ['admin', 'dashboard', 'auth', 'login', 'secure', 'root', 'superuser']
MEDIUM_RISK_KEYWORDS = ['dev', 'staging', 'internal', 'test', 'beta', 'uat', 'qa', 'sandbox']
LOW_RISK_KEYWORDS = ['www', 'mail', 'api', 'cdn', 'static', 'assets', 'img', 'images']


def classify_risk(subdomain: str, alive: bool) -> str:
    """
    Classify risk level based on subdomain name and alive status.
    
    Args:
        subdomain: The subdomain name (e.g., "admin.example.com")
        alive: Whether the subdomain responds to HTTP requests
    
    Returns:
        Risk level: "high", "medium", "low", or "info"
    """
    subdomain_lower = subdomain.lower()
    prefix = subdomain_lower.split('.')[0] if '.' in subdomain_lower else subdomain_lower
    
    if not alive:
        return "info"
    
    for keyword in HIGH_RISK_KEYWORDS:
        if keyword in prefix:
            return "high"
    
    for keyword in MEDIUM_RISK_KEYWORDS:
        if keyword in prefix:
            return "medium"
    
    return "low"


def get_risk_summary(results: list) -> Dict[str, int]:
    """Get summary of risk levels across all results."""
    summary = {"high": 0, "medium": 0, "low": 0, "info": 0}
    for result in results:
        level = result.get("risk_level", "info")
        if level in summary:
            summary[level] += 1
    return summary
