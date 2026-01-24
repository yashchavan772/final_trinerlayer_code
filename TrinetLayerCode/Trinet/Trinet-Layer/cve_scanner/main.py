import logging
import os
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

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
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

@app.get("/api/health")
async def health_check():
    queue_stats = job_manager.get_queue_stats()
    return {
        "status": "healthy",
        "templates_available": templates_exist(),
        "name": "TrinetLayer Security API",
        "version": "1.0.0",
        "services": {
            "cve_scanner": "/api/scan",
            "subdomain_enum": "/api/recon/subdomains",
            "js_analyzer": "/api/js-analyzer/scan",
            "job_queue": "/api/jobs"
        },
        "job_queue": {
            "running": queue_stats["running"],
            "workers": queue_stats["workers"],
            "pending_jobs": queue_stats["status_counts"]["pending"],
            "running_jobs": queue_stats["status_counts"]["running"]
        },
        "documentation": "/docs"
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
