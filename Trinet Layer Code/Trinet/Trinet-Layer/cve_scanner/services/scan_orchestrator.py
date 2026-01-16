import asyncio
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict
from collections import defaultdict
import time

from sqlalchemy.orm import Session

from cve_scanner.models.database import Scan, Finding, ScanStatus, Severity, get_db
from cve_scanner.services.nuclei_runner import NucleiRunner
from cve_scanner.utils.validators import validate_target_url, normalize_url

logger = logging.getLogger(__name__)

class RateLimiter:
    """Rate limiter to prevent scan abuse per client IP."""
    def __init__(self, max_requests: int = 5, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
    
    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        
        self.requests[client_ip] = [
            ts for ts in self.requests[client_ip] if ts > window_start
        ]
        
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
        
        self.requests[client_ip].append(now)
        return True
    
    def get_remaining(self, client_ip: str) -> int:
        now = time.time()
        window_start = now - self.window_seconds
        recent = [ts for ts in self.requests[client_ip] if ts > window_start]
        return max(0, self.max_requests - len(recent))

class ScanOrchestrator:
    """Orchestrates CVE scan lifecycle: creation, execution, and result retrieval."""
    
    def __init__(self, debug_mode: bool = False):
        self.runner = NucleiRunner(debug_mode=debug_mode)
        self.rate_limiter = RateLimiter(max_requests=5, window_seconds=60)
        self.active_scans: Dict[str, asyncio.Task] = {}
        self.max_concurrent_scans = 3
        self.debug_mode = debug_mode
    
    def create_scan(self, db: Session, target_url: str, client_ip: str = None) -> tuple[Optional[Scan], str]:
        """Create a new scan record after validation."""
        is_valid, result = validate_target_url(target_url)
        if not is_valid:
            return None, result
        
        normalized_url = normalize_url(result)
        
        if client_ip and not self.rate_limiter.is_allowed(client_ip):
            return None, "Rate limit exceeded. Please wait before submitting another scan."
        
        if len(self.active_scans) >= self.max_concurrent_scans:
            return None, "Maximum concurrent scans reached. Please try again later."
        
        scan = Scan(
            scan_id=str(uuid.uuid4()),
            target_url=normalized_url,
            status=ScanStatus.PENDING,
            client_ip=client_ip
        )
        
        db.add(scan)
        db.commit()
        db.refresh(scan)
        
        return scan, "Scan created successfully"
    
    async def execute_scan(self, db: Session, scan_id: str, years: list = None):
        """Execute the nuclei scan and store findings in database."""
        scan = db.query(Scan).filter(Scan.scan_id == scan_id).first()
        if not scan:
            logger.error(f"Scan {scan_id} not found")
            return
        
        try:
            scan.status = ScanStatus.RUNNING
            db.commit()
            
            logger.info(f"Starting scan {scan_id} for {scan.target_url}")
            
            result = await self.runner.run_scan(scan.target_url, years or ["2025"])
            
            scan.templates_loaded = result["metadata"].get("templates_loaded", 0)
            scan.requests_sent = result["metadata"].get("requests_sent", 0)
            scan.matches_found = result["metadata"].get("matches_found", 0)
            scan.execution_time = result.get("execution_time", 0)
            
            if result["success"]:
                for finding_data in result["findings"]:
                    finding = Finding(
                        scan_id=scan_id,
                        cve_id=finding_data["cve_id"],
                        severity=Severity(finding_data["severity"]),
                        endpoint=finding_data["endpoint"],
                        template_name=finding_data["template_name"],
                        description=finding_data["description"]
                    )
                    db.add(finding)
                
                scan.status = ScanStatus.COMPLETED
                scan.completed_at = datetime.utcnow()
                logger.info(f"Scan {scan_id} completed: {scan.templates_loaded} templates, {scan.matches_found} findings")
            else:
                scan.status = ScanStatus.FAILED
                scan.error_message = result["error"]
                scan.completed_at = datetime.utcnow()
                logger.error(f"Scan {scan_id} failed: {result['error']}")
            
            db.commit()
            
        except Exception as e:
            scan.status = ScanStatus.FAILED
            scan.error_message = str(e)
            scan.completed_at = datetime.utcnow()
            db.commit()
            logger.error(f"Scan {scan_id} exception: {e}")
        finally:
            if scan_id in self.active_scans:
                del self.active_scans[scan_id]
    
    def get_scan(self, db: Session, scan_id: str) -> Optional[Scan]:
        return db.query(Scan).filter(Scan.scan_id == scan_id).first()
    
    def get_scan_with_findings(self, db: Session, scan_id: str) -> Optional[dict]:
        """Get scan result with findings and metadata for user display."""
        scan = self.get_scan(db, scan_id)
        if not scan:
            return None
        
        findings = db.query(Finding).filter(Finding.scan_id == scan_id).all()
        
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
        sorted_findings = sorted(
            findings,
            key=lambda f: severity_order.get(f.severity.value, 5)
        )
        
        return {
            "scan_id": scan.scan_id,
            "target_url": scan.target_url,
            "status": scan.status.value,
            "created_at": scan.created_at.isoformat() if scan.created_at else None,
            "completed_at": scan.completed_at.isoformat() if scan.completed_at else None,
            "error_message": scan.error_message,
            "findings": [
                {
                    "cve_id": f.cve_id,
                    "severity": f.severity.value,
                    "endpoint": f.endpoint,
                    "template_name": f.template_name,
                    "description": f.description,
                    "detected_at": f.detected_at.isoformat() if f.detected_at else None
                }
                for f in sorted_findings
            ],
            "summary": {
                "total": len(findings),
                "critical": len([f for f in findings if f.severity == Severity.CRITICAL]),
                "high": len([f for f in findings if f.severity == Severity.HIGH]),
                "medium": len([f for f in findings if f.severity == Severity.MEDIUM]),
                "low": len([f for f in findings if f.severity == Severity.LOW]),
                "info": len([f for f in findings if f.severity == Severity.INFO])
            },
            "metadata": {
                "templates_loaded": getattr(scan, 'templates_loaded', 0) or 0,
                "requests_sent": getattr(scan, 'requests_sent', 0) or 0,
                "matches_found": getattr(scan, 'matches_found', 0) or 0,
                "execution_time": getattr(scan, 'execution_time', 0) or 0
            }
        }

orchestrator = ScanOrchestrator()
