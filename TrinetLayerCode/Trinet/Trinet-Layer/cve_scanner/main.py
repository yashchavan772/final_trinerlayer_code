import logging
import os
import time
from datetime import datetime
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from cve_scanner.api.routes import router as cve_router
from cve_scanner.models.database import init_db
from cve_scanner.services.template_sync import templates_exist, sync_cve_templates
from subdomain_scanner.api.routes import router as subdomain_router
from js_analyzer.api.routes import router as js_analyzer_router
from job_queue.api import router as job_router
from job_queue.manager import job_manager
from job_queue.handlers import register_all_handlers

BASE_DIR = Path(__file__).resolve().parent.parent
BUILD_DIR = BASE_DIR / "Trinet_layer" / "build"

START_TIME = None

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global START_TIME
    START_TIME = datetime.utcnow()
    
    logger.info("Initializing CVE Scanner...")
    init_db()
    logger.info("Database initialized")
    
    if not templates_exist():
        logger.info("No CVE templates found, initiating sync...")
        result = sync_cve_templates()
        if result["success"]:
            logger.info(f"Template sync completed: {result['template_count']} templates")
        else:
            logger.warning(f"Template sync failed: {result['message']}")
    else:
        logger.info("CVE templates already available")
    
    logger.info("Initializing job queue...")
    register_all_handlers(job_manager)
    await job_manager.initialize()
    logger.info("Job queue initialized with 3 workers")
    
    yield
    
    logger.info("Shutting down job queue...")
    await job_manager.shutdown()
    logger.info("CVE Scanner shutting down...")

app = FastAPI(
    title="TrinetLayer Security API",
    description="Enterprise-grade security scanning: CVE Detection and Subdomain Enumeration",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cve_router, prefix="/api")
app.include_router(subdomain_router, prefix="/api/recon")
app.include_router(js_analyzer_router, prefix="/api")
app.include_router(job_router, prefix="/api")

if BUILD_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(BUILD_DIR / "assets")), name="assets")

def check_database_health():
    try:
        from sqlalchemy import text
        from cve_scanner.models.database import SessionLocal
        start = time.time()
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        latency = round((time.time() - start) * 1000, 2)
        return {"status": "healthy", "latency_ms": latency}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

def get_system_resources():
    try:
        with open('/proc/meminfo', 'r') as f:
            meminfo = {}
            for line in f:
                parts = line.split(':')
                if len(parts) == 2:
                    key = parts[0].strip()
                    value = parts[1].strip().split()[0]
                    meminfo[key] = int(value) * 1024
        
        total_mem = meminfo.get('MemTotal', 0)
        available_mem = meminfo.get('MemAvailable', 0)
        
        statvfs = os.statvfs('/')
        disk_total = statvfs.f_blocks * statvfs.f_frsize
        disk_free = statvfs.f_bavail * statvfs.f_frsize
        
        return {
            "memory": {
                "total_gb": round(total_mem / (1024**3), 2),
                "available_gb": round(available_mem / (1024**3), 2),
                "percent_used": round((1 - available_mem / total_mem) * 100, 1) if total_mem else 0
            },
            "disk": {
                "total_gb": round(disk_total / (1024**3), 2),
                "free_gb": round(disk_free / (1024**3), 2),
                "percent_used": round((1 - disk_free / disk_total) * 100, 1) if disk_total else 0
            }
        }
    except Exception:
        return None

def get_uptime():
    if START_TIME:
        delta = datetime.utcnow() - START_TIME
        total_seconds = int(delta.total_seconds())
        days, remainder = divmod(total_seconds, 86400)
        hours, remainder = divmod(remainder, 3600)
        minutes, seconds = divmod(remainder, 60)
        
        parts = []
        if days > 0:
            parts.append(f"{days}d")
        if hours > 0:
            parts.append(f"{hours}h")
        if minutes > 0:
            parts.append(f"{minutes}m")
        parts.append(f"{seconds}s")
        
        return {
            "started_at": START_TIME.isoformat() + "Z",
            "uptime_seconds": total_seconds,
            "uptime_formatted": " ".join(parts)
        }
    return None

@app.get("/api/health")
async def health_check():
    queue_stats = job_manager.get_queue_stats()
    db_health = check_database_health()
    system = get_system_resources()
    uptime = get_uptime()
    
    components = {
        "database": db_health["status"],
        "job_queue": "healthy" if queue_stats["running"] else "unhealthy",
        "cve_templates": "healthy" if templates_exist() else "degraded"
    }
    
    overall_status = "healthy"
    if any(s == "unhealthy" for s in components.values()):
        overall_status = "unhealthy"
    elif any(s == "degraded" for s in components.values()):
        overall_status = "degraded"
    
    return {
        "status": overall_status,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
        "uptime": uptime,
        "components": components,
        "job_queue": {
            "running": queue_stats["running"],
            "workers": queue_stats["workers"],
            "pending_jobs": queue_stats["status_counts"]["pending"],
            "running_jobs": queue_stats["status_counts"]["running"],
            "completed_jobs": queue_stats["status_counts"]["completed"],
            "failed_jobs": queue_stats["status_counts"]["failed"]
        },
        "system": system,
        "endpoints": {
            "cve_scanner": "/api/scan",
            "subdomain_enum": "/api/recon/subdomains",
            "js_analyzer": "/api/js-analyzer/scan",
            "job_queue": "/api/jobs",
            "docs": "/docs"
        }
    }

@app.get("/api/health/live")
async def liveness_check():
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat() + "Z"}

@app.get("/api/health/ready")
async def readiness_check():
    queue_stats = job_manager.get_queue_stats()
    db_health = check_database_health()
    
    is_ready = (
        queue_stats["running"] and 
        db_health["status"] == "healthy"
    )
    
    return {
        "ready": is_ready,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "checks": {
            "database": db_health["status"] == "healthy",
            "job_queue": queue_stats["running"]
        }
    }

@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    if full_path.startswith("api/") or full_path == "docs" or full_path == "openapi.json":
        return {"detail": "Not Found"}
    
    index_file = BUILD_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    
    return {
        "name": "TrinetLayer Security API",
        "version": "1.0.0",
        "message": "Frontend build not found. Run 'npm run build' in Trinet_layer directory."
    }
