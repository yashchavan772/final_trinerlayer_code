import asyncio
import logging
from datetime import datetime, timedelta
from typing import Callable, Dict, Optional, List, Any, Awaitable
from collections import OrderedDict

from .models import Job, JobStatus, JobType
from config import config

logger = logging.getLogger(__name__)

MAX_JOBS_IN_MEMORY = config.MAX_JOBS_IN_MEMORY
JOB_TTL_HOURS = config.JOB_TTL_HOURS
MAX_CONCURRENT_WORKERS = config.JOB_QUEUE_WORKERS


class JobQueue:
    def __init__(self, max_workers: int = MAX_CONCURRENT_WORKERS):
        self.jobs: OrderedDict[str, Job] = OrderedDict()
        self.pending_queue: asyncio.Queue = asyncio.Queue()
        self.handlers: Dict[JobType, Callable[[Job], Awaitable[Dict[str, Any]]]] = {}
        self.max_workers = max_workers
        self.workers: List[asyncio.Task] = []
        self.running = False
        self._lock = asyncio.Lock()
    
    def register_handler(self, job_type: JobType, handler: Callable[[Job], Awaitable[Dict[str, Any]]]):
        self.handlers[job_type] = handler
        logger.info(f"Registered handler for job type: {job_type.value}")
    
    async def start(self):
        if self.running:
            return
        
        self.running = True
        logger.info(f"Starting job queue with {self.max_workers} workers")
        
        for i in range(self.max_workers):
            worker = asyncio.create_task(self._worker(i))
            self.workers.append(worker)
        
        cleanup_task = asyncio.create_task(self._cleanup_loop())
        self.workers.append(cleanup_task)
    
    async def stop(self):
        self.running = False
        for worker in self.workers:
            worker.cancel()
        self.workers.clear()
        logger.info("Job queue stopped")
    
    async def submit(self, job: Job) -> str:
        async with self._lock:
            if len(self.jobs) >= MAX_JOBS_IN_MEMORY:
                self._evict_old_jobs()
            
            self.jobs[job.id] = job
            await self.pending_queue.put(job.id)
            logger.info(f"Job {job.id} submitted: {job.job_type.value}")
            return job.id
    
    async def get_job(self, job_id: str) -> Optional[Job]:
        return self.jobs.get(job_id)
    
    async def get_jobs_by_status(self, status: JobStatus) -> List[Job]:
        return [job for job in self.jobs.values() if job.status == status]
    
    async def get_all_jobs(self, limit: int = 50) -> List[Job]:
        jobs = list(self.jobs.values())
        jobs.sort(key=lambda j: j.created_at, reverse=True)
        return jobs[:limit]
    
    async def cancel_job(self, job_id: str) -> bool:
        job = self.jobs.get(job_id)
        if job and job.status == JobStatus.PENDING:
            job.mark_cancelled()
            logger.info(f"Job {job_id} cancelled")
            return True
        return False
    
    async def _worker(self, worker_id: int):
        logger.info(f"Worker {worker_id} started")
        
        while self.running:
            try:
                job_id = await asyncio.wait_for(
                    self.pending_queue.get(),
                    timeout=1.0
                )
                
                job = self.jobs.get(job_id)
                if not job:
                    continue
                
                if job.status == JobStatus.CANCELLED:
                    continue
                
                handler = self.handlers.get(job.job_type)
                if not handler:
                    job.mark_failed(f"No handler for job type: {job.job_type.value}")
                    logger.error(f"No handler for job type: {job.job_type.value}")
                    continue
                
                job.mark_running()
                logger.info(f"Worker {worker_id} processing job {job_id}")
                
                try:
                    result = await handler(job)
                    job.mark_completed(result)
                    logger.info(f"Job {job_id} completed successfully")
                except Exception as e:
                    job.mark_failed(str(e))
                    logger.error(f"Job {job_id} failed: {e}")
                
            except asyncio.TimeoutError:
                continue
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Worker {worker_id} error: {e}")
        
        logger.info(f"Worker {worker_id} stopped")
    
    async def _cleanup_loop(self):
        while self.running:
            try:
                await asyncio.sleep(3600)
                await self._cleanup_old_jobs()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Cleanup error: {e}")
    
    async def _cleanup_old_jobs(self):
        cutoff = datetime.utcnow() - timedelta(hours=JOB_TTL_HOURS)
        async with self._lock:
            old_jobs = [
                job_id for job_id, job in self.jobs.items()
                if job.created_at < cutoff and job.status in [
                    JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED
                ]
            ]
            for job_id in old_jobs:
                del self.jobs[job_id]
            
            if old_jobs:
                logger.info(f"Cleaned up {len(old_jobs)} old jobs")
    
    def _evict_old_jobs(self):
        completed_jobs = [
            (job_id, job) for job_id, job in self.jobs.items()
            if job.status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]
        ]
        completed_jobs.sort(key=lambda x: x[1].created_at)
        
        evict_count = len(self.jobs) - MAX_JOBS_IN_MEMORY + 100
        for job_id, _ in completed_jobs[:evict_count]:
            del self.jobs[job_id]
        
        logger.info(f"Evicted {min(evict_count, len(completed_jobs))} old jobs")
    
    def get_stats(self) -> Dict[str, Any]:
        status_counts = {status.value: 0 for status in JobStatus}
        for job in self.jobs.values():
            status_counts[job.status.value] += 1
        
        return {
            "total_jobs": len(self.jobs),
            "pending_in_queue": self.pending_queue.qsize(),
            "status_counts": status_counts,
            "workers": len(self.workers) - 1,
            "running": self.running
        }
