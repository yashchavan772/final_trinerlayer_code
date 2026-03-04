import logging
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from subdomain_scanner.api.routes import router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Subdomain Intelligence Engine",
    description="Production-grade subdomain enumeration API for cybersecurity platforms",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/recon")

STATIC_DIR = Path(__file__).parent.parent / "Trinet_layer" / "build"

@app.on_event("startup")
async def startup_event():
    logger.info("Subdomain Intelligence Engine starting up...")
    if STATIC_DIR.exists():
        logger.info(f"Serving static files from {STATIC_DIR}")
    else:
        logger.info("No static build directory found (development mode)")
    logger.info("Ready to accept enumeration requests")

if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="static-assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(STATIC_DIR / "index.html"))
