"""Async utilities for performance-critical operations."""

import asyncio
import logging
from typing import Any, Callable, List, TypeVar, Optional
from functools import wraps

logger = logging.getLogger(__name__)

T = TypeVar('T')

MAX_CONCURRENT_REQUESTS = 10
DEFAULT_TIMEOUT = 30


class RateLimiter:
    """Simple async rate limiter."""
    
    def __init__(self, max_concurrent: int = MAX_CONCURRENT_REQUESTS):
        self.semaphore = asyncio.Semaphore(max_concurrent)
    
    async def acquire(self):
        await self.semaphore.acquire()
    
    def release(self):
        self.semaphore.release()
    
    async def __aenter__(self):
        await self.acquire()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self.release()


async def run_with_timeout(
    coro,
    timeout: float = DEFAULT_TIMEOUT,
    default: Any = None
) -> Any:
    """Run a coroutine with a timeout, returning default on timeout."""
    try:
        async with asyncio.timeout(timeout):
            return await coro
    except asyncio.TimeoutError:
        logger.warning(f"Operation timed out after {timeout}s")
        return default
    except Exception as e:
        logger.error(f"Operation failed: {e}")
        return default


async def gather_with_concurrency(
    coros: List,
    max_concurrent: int = MAX_CONCURRENT_REQUESTS,
    return_exceptions: bool = True
) -> List[Any]:
    """
    Run coroutines with concurrency limit.
    
    Args:
        coros: List of coroutines to run
        max_concurrent: Maximum concurrent operations
        return_exceptions: Whether to return exceptions instead of raising
        
    Returns:
        List of results (or exceptions if return_exceptions=True)
    """
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async def sem_coro(coro):
        async with semaphore:
            return await coro
    
    return await asyncio.gather(
        *[sem_coro(c) for c in coros],
        return_exceptions=return_exceptions
    )


def async_retry(retries: int = 3, delay: float = 1.0):
    """Decorator for async retry with exponential backoff."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(retries):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < retries - 1:
                        await asyncio.sleep(delay * (2 ** attempt))
            raise last_exception
        return wrapper
    return decorator
