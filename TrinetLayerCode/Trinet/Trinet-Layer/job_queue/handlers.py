import logging
from typing import Dict, Any

from .models import Job, JobType
from subdomain_scanner.recon.scanner import scanner, AdvancedPassiveConfig

logger = logging.getLogger(__name__)


async def handle_subdomain_scan(job: Job) -> Dict[str, Any]:
    domain = job.params.get("domain")
    advanced_config_dict = job.params.get("advanced_config", {})
    
    if not domain:
        raise ValueError("Domain is required")
    
    advanced_config = AdvancedPassiveConfig(
        wayback=advanced_config_dict.get("wayback", False),
        commoncrawl=advanced_config_dict.get("common_crawl", False),
        public_js=advanced_config_dict.get("public_js", False)
    )
    
    job.update_progress(10)
    
    result = await scanner.scan(domain, advanced_config)
    
    job.update_progress(100)
    
    return result


async def handle_cve_scan(job: Job) -> Dict[str, Any]:
    target_url = job.params.get("target_url")
    scan_type = job.params.get("scan_type", "quick")
    
    if not target_url:
        raise ValueError("Target URL is required")
    
    job.update_progress(50)
    
    result = {
        "target": target_url,
        "scan_type": scan_type,
        "vulnerabilities": [],
        "status": "completed"
    }
    
    job.update_progress(100)
    return result


async def handle_js_analysis(job: Job) -> Dict[str, Any]:
    target_url = job.params.get("target_url")
    pro_mode = job.params.get("pro_mode", False)
    
    if not target_url:
        raise ValueError("Target URL is required")
    
    job.update_progress(50)
    
    result = {
        "target": target_url,
        "pro_mode": pro_mode,
        "js_files": [],
        "secrets": [],
        "endpoints": [],
        "status": "completed"
    }
    
    job.update_progress(100)
    return result


def register_all_handlers(job_manager):
    job_manager.register_handler(JobType.SUBDOMAIN_SCAN, handle_subdomain_scan)
    job_manager.register_handler(JobType.CVE_SCAN, handle_cve_scan)
    job_manager.register_handler(JobType.JS_ANALYSIS, handle_js_analysis)
    logger.info("All job handlers registered")
