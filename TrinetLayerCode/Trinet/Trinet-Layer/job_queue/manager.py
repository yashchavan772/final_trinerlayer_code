import logging
from typing import Dict, Any, Optional

from .models import Job, JobType, JobStatus
from .queue import JobQueue

logger = logging.getLogger(__name__)


class JobManager:
    def __init__(self):
        self.queue = JobQueue(max_workers=3)
        self._initialized = False
    
    async def initialize(self):
        if self._initialized:
            return
        
        await self.queue.start()
        self._initialized = True
        logger.info("Job manager initialized")
    
    async def shutdown(self):
        await self.queue.stop()
        self._initialized = False
        logger.info("Job manager shutdown")
    
    def register_handler(self, job_type: JobType, handler):
        self.queue.register_handler(job_type, handler)
    
    async def submit_subdomain_scan(
        self,
        domain: str,
        advanced_config: Optional[Dict[str, bool]] = None
    ) -> str:
        job = Job(
            job_type=JobType.SUBDOMAIN_SCAN,
            params={
                "domain": domain,
                "advanced_config": advanced_config or {}
            }
        )
        return await self.queue.submit(job)
    
    async def submit_cve_scan(
        self,
        target_url: str,
        scan_type: str = "quick"
    ) -> str:
        job = Job(
            job_type=JobType.CVE_SCAN,
            params={
                "target_url": target_url,
                "scan_type": scan_type
            }
        )
        return await self.queue.submit(job)
    
    async def submit_js_analysis(
        self,
        target_url: str,
        pro_mode: bool = False
    ) -> str:
        job = Job(
            job_type=JobType.JS_ANALYSIS,
            params={
                "target_url": target_url,
                "pro_mode": pro_mode
            }
        )
        return await self.queue.submit(job)
    
    async def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        job = await self.queue.get_job(job_id)
        if job:
            return job.to_dict()
        return None
    
    async def get_job_result(self, job_id: str) -> Optional[Dict[str, Any]]:
        job = await self.queue.get_job(job_id)
        if job and job.status == JobStatus.COMPLETED:
            return job.result
        return None
    
    async def cancel_job(self, job_id: str) -> bool:
        return await self.queue.cancel_job(job_id)
    
    async def list_jobs(self, limit: int = 50) -> list:
        jobs = await self.queue.get_all_jobs(limit)
        return [job.to_dict() for job in jobs]
    
    def get_queue_stats(self) -> Dict[str, Any]:
        return self.queue.get_stats()


job_manager = JobManager()
