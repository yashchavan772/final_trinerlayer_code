import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional
from dataclasses import dataclass, field


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class JobType(str, Enum):
    SUBDOMAIN_SCAN = "subdomain_scan"
    CVE_SCAN = "cve_scan"
    JS_ANALYSIS = "js_analysis"


@dataclass
class Job:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    job_type: JobType = JobType.SUBDOMAIN_SCAN
    status: JobStatus = JobStatus.PENDING
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    params: Dict[str, Any] = field(default_factory=dict)
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    progress: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "job_type": self.job_type.value,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "params": self.params,
            "result": self.result,
            "error": self.error,
            "progress": self.progress
        }
    
    def mark_running(self):
        self.status = JobStatus.RUNNING
        self.started_at = datetime.utcnow()
    
    def mark_completed(self, result: Dict[str, Any]):
        self.status = JobStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        self.result = result
        self.progress = 100
    
    def mark_failed(self, error: str):
        self.status = JobStatus.FAILED
        self.completed_at = datetime.utcnow()
        self.error = error
    
    def mark_cancelled(self):
        self.status = JobStatus.CANCELLED
        self.completed_at = datetime.utcnow()
    
    def update_progress(self, progress: int):
        self.progress = min(max(progress, 0), 100)
