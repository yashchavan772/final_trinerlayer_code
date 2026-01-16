import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from collections import defaultdict
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from subdomain_scanner.utils.validator import validate_domain
from subdomain_scanner.utils.risk import classify_risk
from subdomain_scanner.recon.passive import passive_enumeration
from subdomain_scanner.recon.active import dns_bruteforce, validate_dns
from subdomain_scanner.recon.alive import check_multiple_alive
from subdomain_scanner.recon.scanner import scanner, AdvancedPassiveConfig

logger = logging.getLogger(__name__)
router = APIRouter()

GLOBAL_TIMEOUT = 120
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX_REQUESTS = 5


class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[datetime]] = defaultdict(list)
    
    def is_allowed(self, key: str) -> bool:
        now = datetime.utcnow()
        cutoff = now - timedelta(seconds=self.window_seconds)
        self.requests[key] = [t for t in self.requests[key] if t > cutoff]
        
        if len(self.requests[key]) >= self.max_requests:
            return False
        
        self.requests[key].append(now)
        return True


rate_limiter = RateLimiter(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW)


class SubdomainRequest(BaseModel):
    domain: str = Field(..., min_length=1, max_length=253)


class SubdomainResult(BaseModel):
    subdomain: str
    source: List[str]
    dns_valid: bool
    alive: bool
    http_status: Optional[int]
    risk_level: str


class SubdomainSummary(BaseModel):
    total_discovered: int
    dns_valid: int
    alive: int
    execution_time_seconds: float


class SubdomainResponse(BaseModel):
    domain: str
    summary: SubdomainSummary
    results: List[SubdomainResult]
    disclaimer: str
    warning: Optional[str] = None


@router.post("/subdomains", response_model=SubdomainResponse)
async def enumerate_subdomains(request: SubdomainRequest, http_request: Request):
    """
    Enumerate subdomains for a given domain using passive and active techniques.
    
    This endpoint discovers publicly accessible subdomains using:
    - Certificate Transparency logs (crt.sh)
    - Controlled DNS brute force with a safe wordlist
    
    All discovered subdomains are validated for DNS resolution and HTTP availability.
    """
    start_time = time.time()
    passive_metadata = {"crt_sh_success": True}
    
    is_valid, normalized_domain, error_msg = validate_domain(request.domain)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    if not rate_limiter.is_allowed(normalized_domain):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait before scanning this domain again."
        )
    
    try:
        async with asyncio.timeout(GLOBAL_TIMEOUT):
            passive_task = passive_enumeration(normalized_domain)
            active_task = dns_bruteforce(normalized_domain)
            
            passive_results, active_results = await asyncio.gather(
                passive_task, active_task, return_exceptions=True
            )
            
            passive_subdomains = {}
            
            if isinstance(passive_results, Exception):
                logger.error(f"Passive enumeration failed: {passive_results}")
                passive_metadata["crt_sh_success"] = False
            elif isinstance(passive_results, dict):
                passive_subdomains = passive_results.get("subdomains", {})
                passive_metadata = passive_results.get("metadata", {"crt_sh_success": True})
            
            if isinstance(active_results, Exception):
                logger.error(f"Active enumeration failed: {active_results}")
                active_results = {}
            
            all_subdomains = {}
            
            for subdomain, data in passive_subdomains.items():
                all_subdomains[subdomain] = {
                    "sources": data.get("sources", []),
                    "dns_valid": False,
                    "alive": False,
                    "http_status": None
                }
            
            for subdomain, data in active_results.items():
                if subdomain in all_subdomains:
                    all_subdomains[subdomain]["sources"].extend(data.get("sources", []))
                    all_subdomains[subdomain]["dns_valid"] = True
                else:
                    all_subdomains[subdomain] = {
                        "sources": data.get("sources", []),
                        "dns_valid": True,
                        "alive": False,
                        "http_status": None
                    }
            
            passive_only = set(passive_subdomains.keys()) - set(active_results.keys())
            if passive_only:
                dns_validation = await validate_dns(passive_only)
                for subdomain, is_valid in dns_validation.items():
                    if subdomain in all_subdomains:
                        all_subdomains[subdomain]["dns_valid"] = is_valid
            
            valid_subdomains = [s for s, d in all_subdomains.items() if d["dns_valid"]]
            
            if valid_subdomains:
                alive_results = await check_multiple_alive(valid_subdomains)
                for subdomain, alive_data in alive_results.items():
                    if subdomain in all_subdomains:
                        all_subdomains[subdomain]["alive"] = alive_data.get("alive", False)
                        all_subdomains[subdomain]["http_status"] = alive_data.get("http_status")
    
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Scan timed out. The target domain may have too many subdomains."
        )
    except Exception as e:
        logger.error(f"Scan error for {normalized_domain}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during scan")
    
    execution_time = time.time() - start_time
    
    results = []
    for subdomain, data in sorted(all_subdomains.items()):
        risk_level = classify_risk(subdomain, data["alive"])
        results.append(SubdomainResult(
            subdomain=subdomain,
            source=list(set(data["sources"])),
            dns_valid=data["dns_valid"],
            alive=data["alive"],
            http_status=data["http_status"],
            risk_level=risk_level
        ))
    
    results.sort(key=lambda x: (
        {"high": 0, "medium": 1, "low": 2, "info": 3}.get(x.risk_level, 4),
        not x.alive,
        not x.dns_valid,
        x.subdomain
    ))
    
    summary = SubdomainSummary(
        total_discovered=len(results),
        dns_valid=sum(1 for r in results if r.dns_valid),
        alive=sum(1 for r in results if r.alive),
        execution_time_seconds=round(execution_time, 2)
    )
    
    warning_msg = None
    if not passive_metadata.get("crt_sh_success", True):
        warning_msg = "Certificate transparency lookup temporarily unavailable. Results may be incomplete - try again in a few minutes."
    
    return SubdomainResponse(
        domain=normalized_domain,
        summary=summary,
        results=results,
        disclaimer="Scan only domains you own or have explicit authorization to test. Unauthorized scanning may violate local laws.",
        warning=warning_msg
    )


@router.get("/subdomains/health")
async def health_check():
    """Health check endpoint for subdomain scanner."""
    return {"status": "healthy", "service": "subdomain-scanner"}


class AdvancedPassiveOptions(BaseModel):
    wayback: bool = False
    common_crawl: bool = False
    public_js: bool = False


class ScanRequest(BaseModel):
    domain: str = Field(..., min_length=1, max_length=253)
    advanced_passive: Optional[AdvancedPassiveOptions] = None


class SafeSubdomainResult(BaseModel):
    subdomain: str
    alive: bool
    risk_level: Optional[str] = None


class ScanSummary(BaseModel):
    total_discovered: int
    alive: int
    execution_time_seconds: float


class ScanResponse(BaseModel):
    domain: str
    summary: ScanSummary
    results: List[SafeSubdomainResult]
    disclaimer: str
    warning: Optional[str] = None


@router.post("/scan", response_model=ScanResponse)
async def full_scan(request: ScanRequest, http_request: Request):
    """
    Execute a full subdomain scan with optional advanced passive intelligence.
    
    This endpoint performs comprehensive subdomain discovery using passive
    and active techniques. Advanced passive modules (Wayback, Common Crawl,
    JavaScript analysis) can be enabled optionally.
    
    Frontend receives sanitized results without exposure of scanning techniques.
    """
    is_valid, normalized_domain, error_msg = validate_domain(request.domain)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    if not rate_limiter.is_allowed(normalized_domain):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait before scanning this domain again."
        )
    
    advanced_config = AdvancedPassiveConfig()
    if request.advanced_passive:
        advanced_config = AdvancedPassiveConfig(
            wayback=request.advanced_passive.wayback,
            commoncrawl=request.advanced_passive.common_crawl,
            public_js=request.advanced_passive.public_js
        )
    
    try:
        scan_result = await scanner.scan(normalized_domain, advanced_config)
    except Exception as e:
        logger.error(f"Scan error for {normalized_domain}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during scan")
    
    safe_results = []
    for item in scan_result.get("results", []):
        safe_results.append(SafeSubdomainResult(
            subdomain=item["subdomain"],
            alive=item["alive"],
            risk_level=item.get("risk_level")
        ))
    
    summary_data = scan_result.get("summary", {})
    summary = ScanSummary(
        total_discovered=summary_data.get("total_discovered", 0),
        alive=summary_data.get("alive", 0),
        execution_time_seconds=summary_data.get("execution_time_seconds", 0)
    )
    
    return ScanResponse(
        domain=normalized_domain,
        summary=summary,
        results=safe_results,
        disclaimer=scan_result.get("disclaimer", "Scan only domains you own or have permission to test."),
        warning=scan_result.get("warning")
    )
