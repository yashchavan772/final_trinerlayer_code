import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.on_event("startup")
async def startup_event():
    logger.info("Subdomain Intelligence Engine starting up...")
    logger.info("Ready to accept enumeration requests")


@app.get("/")
async def root():
    return {
        "service": "Subdomain Intelligence Engine",
        "version": "1.0.0",
        "endpoints": {
            "enumerate": "POST /api/recon/subdomains",
            "health": "GET /api/recon/subdomains/health"
        }
    }
