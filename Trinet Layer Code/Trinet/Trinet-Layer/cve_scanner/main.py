import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from cve_scanner.api.routes import router as cve_router
from cve_scanner.models.database import init_db
from cve_scanner.services.template_sync import templates_exist, sync_cve_templates
from subdomain_scanner.api.routes import router as subdomain_router
from js_analyzer.api.routes import router as js_analyzer_router

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
    
    yield
    
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

@app.get("/")
async def root():
    return {
        "name": "TrinetLayer Security API",
        "version": "1.0.0",
        "services": {
            "cve_scanner": "/api/scan",
            "subdomain_enum": "/api/recon/subdomains",
            "js_analyzer": "/api/js-analyzer/scan"
        },
        "documentation": "/docs"
    }
