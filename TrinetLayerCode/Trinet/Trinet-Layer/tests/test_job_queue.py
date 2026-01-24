import pytest
import asyncio
from datetime import datetime
from unittest.mock import AsyncMock, patch

from job_queue.models import Job, JobStatus, JobType
from job_queue.queue import JobQueue
from job_queue.manager import JobManager


class TestJobModel:
    
    def test_job_creation(self):
        job = Job(job_type=JobType.SUBDOMAIN_SCAN)
        assert job.id is not None
        assert job.status == JobStatus.PENDING
        assert job.job_type == JobType.SUBDOMAIN_SCAN
        assert job.progress == 0
    
    def test_job_with_params(self):
        job = Job(
            job_type=JobType.SUBDOMAIN_SCAN,
            params={"domain": "example.com"}
        )
        assert job.params["domain"] == "example.com"
    
    def test_mark_running(self):
        job = Job()
        job.mark_running()
        assert job.status == JobStatus.RUNNING
        assert job.started_at is not None
    
    def test_mark_completed(self):
        job = Job()
        result = {"subdomains": ["api.example.com"]}
        job.mark_completed(result)
        assert job.status == JobStatus.COMPLETED
        assert job.result == result
        assert job.progress == 100
        assert job.completed_at is not None
    
    def test_mark_failed(self):
        job = Job()
        job.mark_failed("Connection timeout")
        assert job.status == JobStatus.FAILED
        assert job.error == "Connection timeout"
        assert job.completed_at is not None
    
    def test_mark_cancelled(self):
        job = Job()
        job.mark_cancelled()
        assert job.status == JobStatus.CANCELLED
        assert job.completed_at is not None
    
    def test_update_progress(self):
        job = Job()
        job.update_progress(50)
        assert job.progress == 50
        
        job.update_progress(150)
        assert job.progress == 100
        
        job.update_progress(-10)
        assert job.progress == 0
    
    def test_to_dict(self):
        job = Job(
            job_type=JobType.SUBDOMAIN_SCAN,
            params={"domain": "example.com"}
        )
        data = job.to_dict()
        assert "id" in data
        assert data["job_type"] == "subdomain_scan"
        assert data["status"] == "pending"
        assert "created_at" in data


class TestJobQueue:
    
    @pytest.mark.asyncio
    async def test_submit_job(self):
        queue = JobQueue(max_workers=1)
        job = Job(job_type=JobType.SUBDOMAIN_SCAN)
        
        job_id = await queue.submit(job)
        
        assert job_id == job.id
        assert job.id in queue.jobs
    
    @pytest.mark.asyncio
    async def test_get_job(self):
        queue = JobQueue(max_workers=1)
        job = Job(job_type=JobType.SUBDOMAIN_SCAN)
        await queue.submit(job)
        
        retrieved = await queue.get_job(job.id)
        
        assert retrieved is not None
        assert retrieved.id == job.id
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_job(self):
        queue = JobQueue(max_workers=1)
        
        retrieved = await queue.get_job("nonexistent")
        
        assert retrieved is None
    
    @pytest.mark.asyncio
    async def test_cancel_pending_job(self):
        queue = JobQueue(max_workers=1)
        job = Job(job_type=JobType.SUBDOMAIN_SCAN)
        await queue.submit(job)
        
        success = await queue.cancel_job(job.id)
        
        assert success is True
        assert job.status == JobStatus.CANCELLED
    
    @pytest.mark.asyncio
    async def test_get_queue_stats(self):
        queue = JobQueue(max_workers=2)
        
        stats = queue.get_stats()
        
        assert "total_jobs" in stats
        assert "pending_in_queue" in stats
        assert "status_counts" in stats
        assert "workers" in stats
    
    @pytest.mark.asyncio
    async def test_register_handler(self):
        queue = JobQueue(max_workers=1)
        
        async def handler(job):
            return {"result": "success"}
        
        queue.register_handler(JobType.SUBDOMAIN_SCAN, handler)
        
        assert JobType.SUBDOMAIN_SCAN in queue.handlers
    
    @pytest.mark.asyncio
    async def test_worker_processes_job(self):
        queue = JobQueue(max_workers=1)
        
        async def mock_handler(job):
            await asyncio.sleep(0.1)
            return {"domain": job.params["domain"], "subdomains": []}
        
        queue.register_handler(JobType.SUBDOMAIN_SCAN, mock_handler)
        
        job = Job(
            job_type=JobType.SUBDOMAIN_SCAN,
            params={"domain": "test.com"}
        )
        await queue.submit(job)
        
        await queue.start()
        await asyncio.sleep(0.5)
        await queue.stop()
        
        assert job.status == JobStatus.COMPLETED
        assert job.result is not None


class TestJobManager:
    
    @pytest.mark.asyncio
    async def test_submit_subdomain_scan(self):
        manager = JobManager()
        
        job_id = await manager.submit_subdomain_scan(
            domain="example.com",
            advanced_config={"wayback": True}
        )
        
        assert job_id is not None
        
        status = await manager.get_job_status(job_id)
        assert status is not None
        assert status["status"] == "pending"
    
    @pytest.mark.asyncio
    async def test_get_job_status(self):
        manager = JobManager()
        
        job_id = await manager.submit_subdomain_scan(domain="test.com")
        status = await manager.get_job_status(job_id)
        
        assert status["job_type"] == "subdomain_scan"
        assert "test.com" in str(status["params"])
    
    @pytest.mark.asyncio
    async def test_cancel_job(self):
        manager = JobManager()
        
        job_id = await manager.submit_subdomain_scan(domain="test.com")
        success = await manager.cancel_job(job_id)
        
        assert success is True
        status = await manager.get_job_status(job_id)
        assert status["status"] == "cancelled"
    
    @pytest.mark.asyncio
    async def test_list_jobs(self):
        manager = JobManager()
        
        await manager.submit_subdomain_scan(domain="test1.com")
        await manager.submit_subdomain_scan(domain="test2.com")
        
        jobs = await manager.list_jobs(limit=10)
        
        assert len(jobs) >= 2
    
    @pytest.mark.asyncio
    async def test_queue_stats(self):
        manager = JobManager()
        
        stats = manager.get_queue_stats()
        
        assert "total_jobs" in stats
        assert "status_counts" in stats
