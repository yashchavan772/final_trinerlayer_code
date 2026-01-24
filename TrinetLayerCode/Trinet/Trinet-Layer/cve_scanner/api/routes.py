import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime

from cve_scanner.models.database import get_db, init_db
from cve_scanner.services.scan_orchestrator import orchestrator
from cve_scanner.services.template_sync import sync_cve_templates, get_template_stats, templates_exist, get_last_sync_time

logger = logging.getLogger(__name__)
router = APIRouter()

class ScanRequest(BaseModel):
    target_url: str = Field(..., min_length=1, max_length=2048)
    years: Optional[List[str]] = Field(default=["2025"])

class ScanResponse(BaseModel):
    scan_id: str
    status: str
    message: str

class FindingResponse(BaseModel):
    cve_id: str
    severity: str
    endpoint: Optional[str]
    template_name: Optional[str]
    description: Optional[str]
    detected_at: Optional[str]

class ScanMetadata(BaseModel):
    templates_loaded: int
    requests_sent: int
    matches_found: int
    execution_time: float

class ScanResultResponse(BaseModel):
    scan_id: str
    target_url: str
    status: str
    created_at: Optional[str]
    completed_at: Optional[str]
    error_message: Optional[str]
    findings: List[FindingResponse]
    summary: dict
    metadata: Optional[ScanMetadata] = None

@router.post("/scan", response_model=ScanResponse)
async def create_scan(
    request: ScanRequest,
    background_tasks: BackgroundTasks,
    http_request: Request,
    db: Session = Depends(get_db)
):
    """Create and queue a new CVE scan for the specified target URL."""
    client_ip: str = http_request.client.host if http_request.client else "unknown"
    
    scan, message = orchestrator.create_scan(db, request.target_url, client_ip)
    
    if not scan:
        raise HTTPException(status_code=400, detail=message)
    
    scan_id: str = str(scan.scan_id)
    years: List[str] = request.years if request.years else ["2025"]
    
    async def run_scan_task():
        from cve_scanner.models.database import SessionLocal
        db_session = SessionLocal()
        try:
            await orchestrator.execute_scan(db_session, scan_id, years)
        finally:
            db_session.close()
            if scan_id in orchestrator.active_scans:
                del orchestrator.active_scans[scan_id]
    
    task = asyncio.create_task(run_scan_task())
    orchestrator.active_scans[scan_id] = task
    background_tasks.add_task(lambda: None)
    
    return ScanResponse(
        scan_id=scan_id,
        status=scan.status.value,
        message="Scan queued successfully"
    )

@router.get("/scan/{scan_id}", response_model=ScanResultResponse)
async def get_scan_result(scan_id: str, db: Session = Depends(get_db)):
    """Get scan results including findings, summary, and metadata."""
    result = orchestrator.get_scan_with_findings(db, scan_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return result

@router.post("/templates/sync")
async def sync_templates():
    """Manually trigger CVE template synchronization from ProjectDiscovery."""
    result = sync_cve_templates()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/templates/stats")
async def get_templates_stats():
    """Get template statistics including counts by year."""
    return get_template_stats()


@router.get("/test/vulnerable-endpoint")
async def test_vulnerable_endpoint():
    """Test endpoint that simulates a vulnerable response for scanner verification.
    
    This endpoint returns a crafted response that matches our test CVE template,
    proving the scanner can detect vulnerabilities when they exist.
    """
    return {
        "status": "vulnerable",
        "version": "1.0.0-test",
        "marker": "CVE-TEST-VERIFICATION-MARKER-2025",
        "message": "This is an intentionally vulnerable test endpoint for scanner verification"
    }

@router.get("/admin/diagnostics")
async def get_admin_diagnostics():
    """Admin-only diagnostics endpoint with scanner details.
    
    NOTE: This endpoint exposes internal operational data. In production,
    add authentication middleware or move behind an admin-only API gateway.
    
    Returns:
    - Template counts and loading status
    - Nuclei version
    - Last template sync time
    - Active scan count
    - Rate limiter status
    """
    from cve_scanner.services.nuclei_runner import NucleiRunner
    
    runner = NucleiRunner()
    template_counts = runner.count_templates(["2025", "2026"])
    nuclei_version = await runner.get_nuclei_version()
    last_sync = get_last_sync_time()
    template_stats = get_template_stats()
    
    return {
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "nuclei": {
            "version": nuclei_version,
            "installed": nuclei_version is not None
        },
        "templates": {
            "total_loaded": template_counts["total"],
            "by_year": template_counts["by_year"],
            "last_sync": last_sync,
            "directory_exists": templates_exist()
        },
        "scanner": {
            "active_scans": len(orchestrator.active_scans),
            "max_concurrent_scans": orchestrator.max_concurrent_scans,
            "rate_limit_per_minute": orchestrator.rate_limiter.max_requests
        },
        "template_details": template_stats
    }
