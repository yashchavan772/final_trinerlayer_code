import os
from typing import List

def get_cors_origins() -> List[str]:
    origins = os.getenv("CORS_ORIGINS", "*")
    if origins == "*":
        return ["*"]
    return [o.strip() for o in origins.split(",") if o.strip()]

def get_rate_limit_requests() -> int:
    return int(os.getenv("RATE_LIMIT_REQUESTS", "5"))

def get_rate_limit_window() -> int:
    return int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))

def get_job_queue_workers() -> int:
    return int(os.getenv("JOB_QUEUE_WORKERS", "3"))

def get_job_ttl_hours() -> int:
    return int(os.getenv("JOB_TTL_HOURS", "24"))

def get_max_jobs_in_memory() -> int:
    return int(os.getenv("MAX_JOBS_IN_MEMORY", "1000"))

def get_log_level() -> str:
    return os.getenv("LOG_LEVEL", "INFO")

def get_app_version() -> str:
    return os.getenv("APP_VERSION", "1.0.0")

class Config:
    CORS_ORIGINS: List[str] = get_cors_origins()
    RATE_LIMIT_REQUESTS: int = get_rate_limit_requests()
    RATE_LIMIT_WINDOW: int = get_rate_limit_window()
    JOB_QUEUE_WORKERS: int = get_job_queue_workers()
    JOB_TTL_HOURS: int = get_job_ttl_hours()
    MAX_JOBS_IN_MEMORY: int = get_max_jobs_in_memory()
    LOG_LEVEL: str = get_log_level()
    APP_VERSION: str = get_app_version()

config = Config()
