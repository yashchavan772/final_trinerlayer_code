from typing import Dict, Set, List, Any


def deduplicate_results(
    passive_results: Dict[str, Any],
    active_results: Dict[str, Any],
    advanced_results: Dict[str, Set[str]]
) -> Dict[str, Dict[str, Any]]:
    """
    Merge and deduplicate results from all enumeration sources.
    
    Combines passive, active, and advanced passive results into a single
    deduplicated dictionary with source tracking.
    
    Args:
        passive_results: Results from passive enumeration (crt.sh)
        active_results: Results from active enumeration (DNS bruteforce)
        advanced_results: Results from advanced passive modules
    
    Returns:
        Merged dictionary mapping subdomain to metadata
    """
    merged = {}
    
    passive_subs = passive_results.get("subdomains", {})
    for subdomain, data in passive_subs.items():
        if subdomain not in merged:
            merged[subdomain] = {"sources": set()}
        merged[subdomain]["sources"].update(data.get("sources", []))
    
    for subdomain, data in active_results.items():
        if subdomain not in merged:
            merged[subdomain] = {"sources": set()}
        merged[subdomain]["sources"].update(data.get("sources", []))
        if "dns_record_type" in data:
            merged[subdomain]["dns_record_type"] = data["dns_record_type"]
    
    source_names = {
        "wayback": "wayback",
        "commoncrawl": "commoncrawl",
        "public_js": "jsparse"
    }
    
    for source_key, subdomains in advanced_results.items():
        source_name = source_names.get(source_key, source_key)
        for subdomain in subdomains:
            if subdomain not in merged:
                merged[subdomain] = {"sources": set()}
            merged[subdomain]["sources"].add(source_name)
    
    for subdomain in merged:
        merged[subdomain]["sources"] = list(merged[subdomain]["sources"])
    
    return merged


def merge_alive_results(
    subdomains: Dict[str, Dict[str, Any]],
    dns_results: Dict[str, bool],
    alive_results: Dict[str, Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Merge subdomain data with DNS and alive check results.
    
    Args:
        subdomains: Merged subdomain data with sources
        dns_results: DNS validation results
        alive_results: HTTP alive check results
    
    Returns:
        List of complete subdomain result dicts
    """
    results = []
    
    for subdomain, data in subdomains.items():
        dns_valid = dns_results.get(subdomain, False)
        alive_data = alive_results.get(subdomain, {})
        
        result = {
            "subdomain": subdomain,
            "dns_valid": dns_valid,
            "alive": alive_data.get("alive", False),
            "http_status": alive_data.get("http_status"),
            "sources": data.get("sources", [])
        }
        
        results.append(result)
    
    return results
