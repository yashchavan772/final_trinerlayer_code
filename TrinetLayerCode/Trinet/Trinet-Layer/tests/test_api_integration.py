import pytest
import asyncio
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient, ASGITransport
from cve_scanner.main import app
from subdomain_scanner.api.routes import rate_limiter


@pytest.fixture
def anyio_backend():
    return 'asyncio'


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    rate_limiter.requests.clear()
    yield
    rate_limiter.requests.clear()


@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_recon_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/recon/subdomains/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "subdomain-scanner"


@pytest.mark.asyncio
async def test_scan_invalid_domain():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/scan",
            json={"domain": "http://example.com"}
        )
        assert response.status_code == 400
        assert "protocol" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_scan_empty_domain():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/scan",
            json={"domain": ""}
        )
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_scan_localhost_blocked():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/scan",
            json={"domain": "localhost"}
        )
        assert response.status_code == 400


@pytest.mark.asyncio
async def test_scan_private_ip_blocked():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/scan",
            json={"domain": "192.168.1.1"}
        )
        assert response.status_code == 400


@pytest.mark.asyncio
async def test_subdomains_invalid_domain():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/subdomains",
            json={"domain": "https://example.com"}
        )
        assert response.status_code == 400


@pytest.mark.asyncio
async def test_scan_with_wildcard_blocked():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/scan",
            json={"domain": "*.example.com"}
        )
        assert response.status_code == 400
        assert "wildcard" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_scan_with_path_blocked():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/recon/scan",
            json={"domain": "example.com/path"}
        )
        assert response.status_code == 400


@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_rate_limit_429_on_repeated_scans():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        for i in range(5):
            response = await client.post(
                "/api/recon/scan",
                json={"domain": "ratelimit-test.com"}
            )
        
        response = await client.post(
            "/api/recon/scan",
            json={"domain": "ratelimit-test.com"}
        )
        assert response.status_code == 429
        assert "rate limit" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_scan_success_with_mocked_recon():
    mock_scan_result = {
        "domain": "test.com",
        "success": True,
        "results": [
            {"subdomain": "api.test.com", "alive": True, "risk_level": "low"},
            {"subdomain": "admin.test.com", "alive": True, "risk_level": "high"}
        ],
        "summary": {
            "total_discovered": 2,
            "alive": 2,
            "execution_time_seconds": 1.5
        },
        "disclaimer": "Test disclaimer",
        "warning": None
    }
    
    with patch('subdomain_scanner.api.routes.scanner.scan', new_callable=AsyncMock) as mock_scan:
        mock_scan.return_value = mock_scan_result
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/recon/scan",
                json={"domain": "test.com"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["domain"] == "test.com"
            assert data["summary"]["total_discovered"] == 2
            assert data["summary"]["alive"] == 2
            assert len(data["results"]) == 2
            assert data["disclaimer"] is not None


@pytest.mark.asyncio
async def test_scan_response_structure():
    mock_scan_result = {
        "domain": "structure-test.com",
        "success": True,
        "results": [
            {"subdomain": "www.structure-test.com", "alive": True, "risk_level": "low"}
        ],
        "summary": {
            "total_discovered": 1,
            "alive": 1,
            "execution_time_seconds": 0.5
        },
        "disclaimer": "Test disclaimer"
    }
    
    with patch('subdomain_scanner.api.routes.scanner.scan', new_callable=AsyncMock) as mock_scan:
        mock_scan.return_value = mock_scan_result
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/recon/scan",
                json={"domain": "structure-test.com"}
            )
            
            assert response.status_code == 200
            data = response.json()
            
            assert "domain" in data
            assert "summary" in data
            assert "results" in data
            assert "disclaimer" in data
            
            assert "total_discovered" in data["summary"]
            assert "alive" in data["summary"]
            assert "execution_time_seconds" in data["summary"]
            
            if data["results"]:
                result = data["results"][0]
                assert "subdomain" in result
                assert "alive" in result


@pytest.mark.asyncio
async def test_scan_with_advanced_options():
    mock_scan_result = {
        "domain": "advanced-test.com",
        "success": True,
        "results": [],
        "summary": {"total_discovered": 0, "alive": 0, "execution_time_seconds": 2.0},
        "disclaimer": "Test"
    }
    
    with patch('subdomain_scanner.api.routes.scanner.scan', new_callable=AsyncMock) as mock_scan:
        mock_scan.return_value = mock_scan_result
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/recon/scan",
                json={
                    "domain": "advanced-test.com",
                    "advanced_passive": {
                        "wayback": True,
                        "common_crawl": True,
                        "public_js": False
                    }
                }
            )
            
            assert response.status_code == 200
            mock_scan.assert_called_once()


@pytest.mark.asyncio
async def test_scan_internal_error_handling():
    with patch('subdomain_scanner.api.routes.scanner.scan', new_callable=AsyncMock) as mock_scan:
        mock_scan.side_effect = Exception("Database connection failed")
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/recon/scan",
                json={"domain": "error-test.com"}
            )
            
            assert response.status_code == 500
            assert "internal server error" in response.json()["detail"].lower()
