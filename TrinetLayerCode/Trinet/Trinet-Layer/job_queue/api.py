import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from .manager import job_manager
from .models import JobStatus
from subdomain_scanner.utils.validator import validate_domain

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/jobs", tags=["jobs"])


class SubdomainScanRequest(BaseModel):
    domain: str = Field(..., min_length=1, max_length=253)
    advanced_config: Optional[Dict[str, bool]] = None


class CVEScanRequest(BaseModel):
    target_url: str = Field(..., min_length=1)
    scan_type: str = Field(default="quick")


class JSAnalysisRequest(BaseModel):
    target_url: str = Field(..., min_length=1)
    pro_mode: bool = Field(default=False)


class JobSubmitResponse(BaseModel):
    job_id: str
    status: str
    message: str


class JobStatusResponse(BaseModel):
    id: str
    job_type: str
    status: str
    created_at: str
    started_at: Optional[str]
    completed_at: Optional[str]
    progress: int
    error: Optional[str]


class JobResultResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[Dict[str, Any]]


@router.post("/subdomain-scan", response_model=JobSubmitResponse)
async def submit_subdomain_scan(request: SubdomainScanRequest):
    is_valid, normalized_domain, error_msg = validate_domain(request.domain)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    job_id = await job_manager.submit_subdomain_scan(
        domain=normalized_domain,
        advanced_config=request.advanced_config
    )
    
    return JobSubmitResponse(
        job_id=job_id,
        status="pending",
        message=f"Subdomain scan job submitted for {normalized_domain}"
    )


@router.post("/cve-scan", response_model=JobSubmitResponse)
async def submit_cve_scan(request: CVEScanRequest):
    job_id = await job_manager.submit_cve_scan(
        target_url=request.target_url,
        scan_type=request.scan_type
    )
    
    return JobSubmitResponse(
        job_id=job_id,
        status="pending",
        message=f"CVE scan job submitted for {request.target_url}"
    )


@router.post("/js-analysis", response_model=JobSubmitResponse)
async def submit_js_analysis(request: JSAnalysisRequest):
    job_id = await job_manager.submit_js_analysis(
        target_url=request.target_url,
        pro_mode=request.pro_mode
    )
    
    return JobSubmitResponse(
        job_id=job_id,
        status="pending",
        message=f"JS analysis job submitted for {request.target_url}"
    )


@router.get("/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    job_data = await job_manager.get_job_status(job_id)
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatusResponse(
        id=job_data["id"],
        job_type=job_data["job_type"],
        status=job_data["status"],
        created_at=job_data["created_at"],
        started_at=job_data["started_at"],
        completed_at=job_data["completed_at"],
        progress=job_data["progress"],
        error=job_data["error"]
    )


@router.get("/{job_id}/result", response_model=JobResultResponse)
async def get_job_result(job_id: str):
    job_data = await job_manager.get_job_status(job_id)
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job_data["status"] == "pending":
        return JobResultResponse(
            job_id=job_id,
            status="pending",
            result=None
        )
    elif job_data["status"] == "running":
        return JobResultResponse(
            job_id=job_id,
            status="running",
            result=None
        )
    elif job_data["status"] == "failed":
        raise HTTPException(
            status_code=500,
            detail=f"Job failed: {job_data.get('error', 'Unknown error')}"
        )
    elif job_data["status"] == "cancelled":
        raise HTTPException(status_code=410, detail="Job was cancelled")
    
    result = await job_manager.get_job_result(job_id)
    return JobResultResponse(
        job_id=job_id,
        status="completed",
        result=result
    )


@router.delete("/{job_id}")
async def cancel_job(job_id: str):
    success = await job_manager.cancel_job(job_id)
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel job. It may already be running or completed."
        )
    return {"message": "Job cancelled", "job_id": job_id}


@router.get("/")
async def list_jobs(limit: int = 50):
    jobs = await job_manager.list_jobs(limit=min(limit, 100))
    return {"jobs": jobs, "count": len(jobs)}


@router.get("/stats/queue")
async def get_queue_stats():
    return job_manager.get_queue_stats()
