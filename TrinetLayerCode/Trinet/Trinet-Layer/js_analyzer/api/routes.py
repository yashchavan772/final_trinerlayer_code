"""API routes for JS Analyzer."""

import asyncio
import logging
import uuid
from typing import Optional, List
from datetime import datetime
from enum import Enum

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

from ..discovery import discover_wayback_js, discover_live_js, enumerate_subdomains
from ..preprocessing import preprocess_js, JSPreprocessor
from ..analyzer import JSAnalyzerEngine, analyze_js_content
from ..scoring import calculate_risk_score, RiskLevel
from ..reports import generate_report, ReportFormat
from ..utils.validators import validate_domain

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/js-analyzer", tags=["JS Analyzer"])


class ScanMode(str, Enum):
    FAST = "fast"
    PRO = "pro"


class ScanRequest(BaseModel):
    domain: str = Field(..., min_length=1, max_length=253)
    mode: ScanMode = ScanMode.FAST
    skip_vendor: bool = True
    include_subdomains: bool = False
    scope_include: Optional[List[str]] = None
    scope_exclude: Optional[List[str]] = None


class FindingResponse(BaseModel):
    rule_id: str
    rule_name: str
    category: str
    severity: str
    value: str
    line_number: int
    confidence: float
    file_url: str
    description: str
    security_tag: Optional[str] = None
    risk_score: Optional[float] = None


class ScanSummary(BaseModel):
    total_findings: int = 0
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    info: int = 0
    secrets_found: int = 0
    endpoints_found: int = 0
    dangerous_patterns: int = 0
    auth_issues: int = 0


class ScanResponse(BaseModel):
    scan_id: str
    domain: str
    mode: str
    status: str
    js_files_analyzed: int = 0
    subdomains_checked: int = 0
    summary: ScanSummary
    findings: List[FindingResponse] = []
    execution_time_seconds: float = 0
    disclaimer: str = "Only scan domains you own or have authorization to test."


class ReportRequest(BaseModel):
    scan_result: dict
    format: str = "json"


scan_cache = {}

FAST_MODE_TIMEOUT = 120
PRO_MODE_TIMEOUT = 300


@router.post("/scan", response_model=ScanResponse)
async def run_js_scan(request: ScanRequest):
    """
    Run JavaScript analysis scan.
    
    - FAST mode: JS discovery + secret/endpoint analysis only
    - PRO mode: Subdomain enumeration + comprehensive JS analysis
    """
    start_time = asyncio.get_event_loop().time()
    scan_id = str(uuid.uuid4())
    
    is_valid, normalized_domain, error_msg = validate_domain(request.domain)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    timeout = PRO_MODE_TIMEOUT if request.mode == ScanMode.PRO else FAST_MODE_TIMEOUT
    
    summary = ScanSummary()
    all_findings: List[FindingResponse] = []
    js_files_analyzed = 0
    subdomains_checked = 0
    
    try:
        async with asyncio.timeout(timeout):
            subdomains = [normalized_domain]
            
            if request.mode == ScanMode.PRO and request.include_subdomains:
                logger.info(f"PRO mode: Enumerating subdomains for {normalized_domain}")
                subdomain_result = await enumerate_subdomains(
                    normalized_domain, 
                    check_alive=True,
                    max_results=50
                )
                if subdomain_result.get("success") and subdomain_result.get("subdomains"):
                    subdomains = subdomain_result["subdomains"][:50]
                    subdomains_checked = len(subdomains)
                    logger.info(f"Found {subdomains_checked} alive subdomains")
            
            logger.info(f"Discovering JS files for {normalized_domain}")
            
            wayback_task = discover_wayback_js(
                normalized_domain, 
                skip_vendor=request.skip_vendor,
                max_files=200
            )
            crawl_task = discover_live_js(
                normalized_domain,
                subdomains=subdomains if request.mode == ScanMode.PRO else None,
                skip_vendor=request.skip_vendor,
                max_js_files=100
            )
            
            wayback_result, crawl_result = await asyncio.gather(
                wayback_task, crawl_task, return_exceptions=True
            )
            
            js_urls = set()
            
            if isinstance(wayback_result, dict) and wayback_result.get("urls"):
                js_urls.update(wayback_result["urls"])
            
            if isinstance(crawl_result, dict) and crawl_result.get("urls"):
                js_urls.update(crawl_result["urls"])
            
            if request.scope_include:
                js_urls = {u for u in js_urls if any(inc in u for inc in request.scope_include)}
            
            if request.scope_exclude:
                js_urls = {u for u in js_urls if not any(exc in u for exc in request.scope_exclude)}
            
            js_url_list = list(js_urls)[:150]
            
            logger.info(f"Discovered {len(js_url_list)} unique JS files")
            
            if js_url_list:
                preprocessor = JSPreprocessor(
                    beautify=True,
                    deobfuscate=request.mode == ScanMode.PRO
                )
                processed_files = await preprocessor.process_urls(js_url_list)
                
                engine = JSAnalyzerEngine(
                    check_secrets=True,
                    check_endpoints=True,
                    check_dangerous=True,
                    check_auth=True,
                    min_confidence=0.5,
                    mask_secrets=False
                )
                
                for processed in processed_files:
                    if processed.processed and processed.content:
                        js_files_analyzed += 1
                        result = engine.analyze(processed.content, processed.url)
                        
                        for finding in result.findings:
                            risk = calculate_risk_score(
                                finding.severity,
                                finding.category,
                                finding.confidence,
                                finding.security_tag or ""
                            )
                            
                            all_findings.append(FindingResponse(
                                rule_id=finding.rule_id,
                                rule_name=finding.rule_name,
                                category=finding.category,
                                severity=finding.severity,
                                value=finding.value,
                                line_number=finding.line_number,
                                confidence=finding.confidence,
                                file_url=finding.file_url,
                                description=finding.description,
                                security_tag=finding.security_tag,
                                risk_score=risk.score
                            ))
                            
                            if finding.severity == "critical":
                                summary.critical += 1
                            elif finding.severity == "high":
                                summary.high += 1
                            elif finding.severity == "medium":
                                summary.medium += 1
                            elif finding.severity == "low":
                                summary.low += 1
                            else:
                                summary.info += 1
                        
                        summary.secrets_found += result.secrets_count
                        summary.endpoints_found += result.endpoints_count
                        summary.dangerous_patterns += result.dangerous_count
                        summary.auth_issues += result.auth_issues_count
            
            summary.total_findings = len(all_findings)
            
            all_findings.sort(key=lambda f: (
                {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}.get(f.severity, 5),
                -(f.risk_score or 0)
            ))
        
        execution_time = asyncio.get_event_loop().time() - start_time
        
        response = ScanResponse(
            scan_id=scan_id,
            domain=normalized_domain,
            mode=request.mode.value,
            status="completed",
            js_files_analyzed=js_files_analyzed,
            subdomains_checked=subdomains_checked,
            summary=summary,
            findings=all_findings[:100],
            execution_time_seconds=round(execution_time, 2)
        )
        
        scan_cache[scan_id] = response.dict()
        
        return response
        
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="Scan timed out. Try FAST mode or a smaller scope.")
    except Exception as e:
        logger.error(f"Scan error: {e}")
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")


@router.get("/scan/{scan_id}")
async def get_scan_result(scan_id: str):
    """Get cached scan result by ID."""
    if scan_id not in scan_cache:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan_cache[scan_id]


@router.post("/report")
async def generate_scan_report(request: ReportRequest):
    """Generate report from scan results."""
    try:
        format_map = {
            "json": ReportFormat.JSON,
            "html": ReportFormat.HTML,
            "markdown": ReportFormat.MARKDOWN,
            "md": ReportFormat.MARKDOWN
        }
        
        report_format = format_map.get(request.format.lower(), ReportFormat.JSON)
        report = generate_report(request.scan_result, report_format)
        
        return {
            "format": request.format,
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "js-analyzer"}
