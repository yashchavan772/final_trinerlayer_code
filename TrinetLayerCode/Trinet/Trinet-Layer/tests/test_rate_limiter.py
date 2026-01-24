import pytest
from datetime import datetime, timedelta
from subdomain_scanner.api.routes import RateLimiter


class TestRateLimiter:
    
    def test_first_request_allowed(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        assert limiter.is_allowed("test.com") is True
    
    def test_multiple_requests_under_limit(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        for _ in range(4):
            assert limiter.is_allowed("test.com") is True
    
    def test_request_at_limit_allowed(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        for _ in range(5):
            limiter.is_allowed("test.com")
        assert limiter.is_allowed("test.com") is False
    
    def test_exceeds_limit_blocked(self):
        limiter = RateLimiter(max_requests=3, window_seconds=60)
        for _ in range(3):
            limiter.is_allowed("test.com")
        assert limiter.is_allowed("test.com") is False
    
    def test_different_domains_independent(self):
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        limiter.is_allowed("domain1.com")
        limiter.is_allowed("domain1.com")
        assert limiter.is_allowed("domain1.com") is False
        assert limiter.is_allowed("domain2.com") is True
    
    def test_requests_expire_after_window(self):
        limiter = RateLimiter(max_requests=2, window_seconds=1)
        limiter.is_allowed("test.com")
        limiter.is_allowed("test.com")
        assert limiter.is_allowed("test.com") is False
        
        import time
        time.sleep(1.1)
        assert limiter.is_allowed("test.com") is True
    
    def test_zero_max_requests(self):
        limiter = RateLimiter(max_requests=0, window_seconds=60)
        assert limiter.is_allowed("test.com") is False
    
    def test_one_request_limit(self):
        limiter = RateLimiter(max_requests=1, window_seconds=60)
        assert limiter.is_allowed("test.com") is True
        assert limiter.is_allowed("test.com") is False
    
    def test_empty_key(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        assert limiter.is_allowed("") is True
    
    def test_long_window(self):
        limiter = RateLimiter(max_requests=100, window_seconds=3600)
        for _ in range(100):
            limiter.is_allowed("test.com")
        assert limiter.is_allowed("test.com") is False
