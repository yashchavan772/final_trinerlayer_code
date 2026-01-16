"""Security rules for JS analysis."""

from .patterns import (
    SECRET_PATTERNS,
    ENDPOINT_PATTERNS,
    DANGEROUS_PATTERNS,
    AUTH_PATTERNS
)

__all__ = [
    'SECRET_PATTERNS',
    'ENDPOINT_PATTERNS', 
    'DANGEROUS_PATTERNS',
    'AUTH_PATTERNS'
]
