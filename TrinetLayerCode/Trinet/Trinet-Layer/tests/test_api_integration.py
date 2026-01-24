import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from cve_scanner.main import app


@pytest.fixture
def anyio_backend():
    return 'asyncio'


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
