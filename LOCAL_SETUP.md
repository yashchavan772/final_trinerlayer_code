# TrinetLayer - Complete Deployment Guide

This guide covers setting up TrinetLayer for both **local development** and **production deployment on a live server**.

TrinetLayer is a cybersecurity education and security scanning platform with two main components:
- **Frontend**: React 18 + Vite (UI, educational content, interactive labs)
- **Backend**: Python FastAPI (subdomain scanner API, job queue, static file serving in production)

---

# Part 1: Local Development (Linux)

## Prerequisites

| Software   | Version  | Purpose                          |
|------------|----------|----------------------------------|
| Node.js    | v18+ or v20+ | Frontend JavaScript runtime |
| npm        | v9+      | Node.js package manager          |
| Python     | 3.11+    | Backend runtime                  |
| pip or uv  | Latest   | Python package manager           |
| Git        | Latest   | Version control                  |
| PostgreSQL | 15+      | Database (optional, SQLite works for dev) |

### Verify Installations

```bash
node --version    # v18+ or v20+
npm --version     # v9+
python3 --version # 3.11+
git --version
```

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Trinet-Layer
```

## Step 2: Install Frontend Dependencies

```bash
cd Trinet_layer
npm install
cd ..
```

## Step 3: Install Backend Dependencies

**Option A — Using pip (with virtual environment):**

```bash
python3 -m venv venv
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy psycopg2-binary dnspython aiohttp httpx pydantic python-multipart aiofiles pillow
```

**Option B — Using uv (faster):**

```bash
pip install uv
uv sync
```

## Step 4: Environment Variables

### Frontend (.env in `Trinet_layer/`)

Create `Trinet_layer/.env`:

```env
# Optional: OpenAI API key for AI-powered content generation
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Backend API URL (default for local development)
VITE_API_URL=http://localhost:8000
```

### Backend (.env in project root)

Create `.env` in `Trinet-Layer/`:

```env
# Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/trinetlayer

# Or use SQLite for quick local dev (no setup required)
# DATABASE_URL=sqlite:///./trinetlayer.db

# Optional configuration
CORS_ORIGINS=*
RATE_LIMIT_REQUESTS=5
RATE_LIMIT_WINDOW_SECONDS=60
JOB_QUEUE_WORKERS=3
JOB_TTL_HOURS=24
MAX_JOBS_IN_MEMORY=1000
LOG_LEVEL=INFO
```

## Step 5: Run in Development Mode

Open **two terminals**:

**Terminal 1 — Backend API (port 8000):**

```bash
cd Trinet-Layer
source venv/bin/activate  # if using pip/venv
python -m uvicorn subdomain_scanner.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend Dev Server (port 5000):**

```bash
cd Trinet-Layer/Trinet_layer
npm run start
```

The Vite dev server proxies `/api` requests to the backend automatically (configured in `vite.config.mjs`).

## Step 6: Verify Everything Works

| Service      | URL                        | What to Check                         |
|--------------|----------------------------|---------------------------------------|
| Frontend     | http://localhost:5000       | Homepage loads with cybersecurity UI  |
| Backend API  | http://localhost:8000       | SPA or API responds                   |
| API Docs     | http://localhost:8000/docs  | Swagger/OpenAPI documentation loads   |
| Subdomain API| http://localhost:8000/api/recon | Recon endpoints available          |

### Verification Checklist

- [ ] Frontend loads at `http://localhost:5000`
- [ ] Sidebar navigation works, pages render correctly
- [ ] Backend API responds at `http://localhost:8000/docs`
- [ ] Subdomain scanner accepts scan requests via `/api/recon`
- [ ] Job queue endpoints respond at `/api/jobs/`
- [ ] No CORS errors in browser console

---

## Development Commands Reference

### Frontend

```bash
cd Trinet_layer
npm run start     # Start Vite dev server (port 5000)
npm run build     # Build for production (output: build/)
npm run serve     # Preview production build locally
```

### Backend

```bash
# Development with auto-reload
python -m uvicorn subdomain_scanner.main:app --host 0.0.0.0 --port 8000 --reload

# Production mode
python -m uvicorn subdomain_scanner.main:app --host 0.0.0.0 --port 8000
```

---

## Optional: Local PostgreSQL Setup

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database and user
CREATE DATABASE trinetlayer;
CREATE USER trinetuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE trinetlayer TO trinetuser;
\q
```

Set in your `.env`:

```env
DATABASE_URL=postgresql://trinetuser:yourpassword@localhost:5432/trinetlayer
```

For quick testing without PostgreSQL, use SQLite:

```env
DATABASE_URL=sqlite:///./trinetlayer.db
```

---

# Part 2: Production Deployment on Live Server (Linux VPS/Cloud)

## Server Requirements

| Resource     | Minimum            | Recommended         |
|--------------|--------------------|---------------------|
| OS           | Ubuntu 22.04 LTS   | Ubuntu 24.04 LTS    |
| RAM          | 2 GB               | 4 GB                |
| Disk         | 20 GB              | 40 GB               |
| CPU          | 1 vCPU             | 2 vCPU              |
| Network      | Public IPv4         | Public IPv4          |

## Step 1: Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create a dedicated user (do not run as root)
sudo adduser trinetlayer
sudo usermod -aG sudo trinetlayer
su - trinetlayer

# Set up firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Install fail2ban for SSH protection
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

## Step 3: Install Python

```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version
```

## Step 4: Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE trinetlayer;"
sudo -u postgres psql -c "CREATE USER trinetuser WITH PASSWORD 'your_secure_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE trinetlayer TO trinetuser;"
```

## Step 5: Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Step 6: Clone and Build the Application

```bash
cd /opt
sudo mkdir trinetlayer
sudo chown trinetlayer:trinetlayer trinetlayer
cd trinetlayer

git clone <repository-url> .
cd Trinet-Layer
```

### Install Backend Dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary dnspython aiohttp httpx pydantic python-multipart aiofiles pillow
```

### Install Frontend Dependencies and Build

```bash
cd Trinet_layer
npm install
npm run build
cd ..
```

The build output goes to `Trinet_layer/build/`. The FastAPI backend serves these static files in production.

## Step 7: Configure Environment Variables

Create `/opt/trinetlayer/Trinet-Layer/.env`:

```env
DATABASE_URL=postgresql://trinetuser:your_secure_password_here@localhost:5432/trinetlayer
CORS_ORIGINS=https://yourdomain.com
RATE_LIMIT_REQUESTS=5
RATE_LIMIT_WINDOW_SECONDS=60
JOB_QUEUE_WORKERS=3
JOB_TTL_HOURS=24
MAX_JOBS_IN_MEMORY=1000
LOG_LEVEL=INFO
```

## Step 8: Configure systemd Service

Create `/etc/systemd/system/trinetlayer.service`:

```ini
[Unit]
Description=TrinetLayer FastAPI Application
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=trinetlayer
Group=trinetlayer
WorkingDirectory=/opt/trinetlayer/Trinet-Layer
Environment="PATH=/opt/trinetlayer/Trinet-Layer/venv/bin:/usr/bin"
EnvironmentFile=/opt/trinetlayer/Trinet-Layer/.env
ExecStart=/opt/trinetlayer/Trinet-Layer/venv/bin/uvicorn subdomain_scanner.main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable trinetlayer
sudo systemctl start trinetlayer
sudo systemctl status trinetlayer
```

## Step 9: Configure Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/trinetlayer`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/trinetlayer /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Step 10: Set Up SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically update your Nginx config to handle HTTPS and redirect HTTP to HTTPS.

Verify auto-renewal:

```bash
sudo certbot renew --dry-run
```

## Step 11: Domain Setup

Point your domain to the server by creating a DNS **A record**:

| Type | Name              | Value           | TTL  |
|------|-------------------|-----------------|------|
| A    | yourdomain.com    | YOUR_SERVER_IP  | 300  |
| A    | www               | YOUR_SERVER_IP  | 300  |

Wait for DNS propagation (usually 5-30 minutes), then run the certbot command from Step 10.

---

## Log Management

### View Application Logs

```bash
# Live log stream
sudo journalctl -u trinetlayer -f

# Last 100 lines
sudo journalctl -u trinetlayer -n 100

# Logs from today
sudo journalctl -u trinetlayer --since today
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Log Rotation

Nginx logs are rotated automatically by logrotate. For application logs, systemd journal handles rotation. Optionally configure journal size:

```bash
sudo journalctl --vacuum-size=500M
```

---

## Update / Redeploy Workflow

When you push new code and want to deploy:

```bash
cd /opt/trinetlayer/Trinet-Layer

# Pull latest code
git pull origin main

# Update backend dependencies
source venv/bin/activate
pip install -r requirements.txt 2>/dev/null || pip install fastapi uvicorn sqlalchemy psycopg2-binary dnspython aiohttp httpx pydantic python-multipart aiofiles pillow

# Rebuild frontend
cd Trinet_layer
npm install
npm run build
cd ..

# Restart the service
sudo systemctl restart trinetlayer

# Verify it's running
sudo systemctl status trinetlayer
```

---

## Troubleshooting

### 1. Port Already in Use

```bash
# Find and kill process on port 8000
sudo lsof -ti:8000 | xargs kill -9

# Find and kill process on port 5000 (dev only)
sudo lsof -ti:5000 | xargs kill -9
```

### 2. Service Won't Start

```bash
# Check service logs
sudo journalctl -u trinetlayer -n 50 --no-pager

# Verify the uvicorn path
/opt/trinetlayer/Trinet-Layer/venv/bin/uvicorn --version

# Test manually
cd /opt/trinetlayer/Trinet-Layer
source venv/bin/activate
python -m uvicorn subdomain_scanner.main:app --host 127.0.0.1 --port 8000
```

### 3. Nginx Returns 502 Bad Gateway

- Ensure the FastAPI service is running: `sudo systemctl status trinetlayer`
- Ensure proxy_pass port matches the uvicorn port (8000)
- Check Nginx error log: `sudo tail -f /var/log/nginx/error.log`

### 4. Frontend Build Fails

```bash
cd Trinet_layer
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 5. Database Connection Issues

- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials: `psql -U trinetuser -d trinetlayer -h localhost`
- Check DATABASE_URL in `.env` matches your PostgreSQL setup
- For quick testing without PostgreSQL, set `DATABASE_URL=sqlite:///./trinetlayer.db`

### 6. CORS Errors in Browser

- In development: Ensure backend is running on port 8000 and Vite proxy is configured
- In production: Set `CORS_ORIGINS` to your domain (e.g., `https://yourdomain.com`)
- Both frontend and backend should be served from the same origin in production

### 7. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Reload Nginx after renewal
sudo systemctl reload nginx
```

### 8. Node Modules Issues

```bash
cd Trinet_layer
rm -rf node_modules package-lock.json
npm install
```

### 9. Python Dependency Conflicts

```bash
pip install --upgrade pip
pip install fastapi uvicorn sqlalchemy psycopg2-binary dnspython aiohttp httpx pydantic python-multipart aiofiles pillow --force-reinstall
```

---

## Architecture Summary

In **development**, two processes run:
- Vite dev server on port **5000** (frontend with hot reload)
- Uvicorn on port **8000** (backend API)
- Vite proxies `/api` requests to the backend

In **production**, one process runs:
- Uvicorn on port **8000** serves both the API and the built frontend static files
- Nginx reverse-proxies port **80/443** to port **8000**
- SSL is handled by Nginx + Let's Encrypt

---

## Dependencies Reference

### Frontend (package.json)

**Core:** React 18, React Router v6, Redux Toolkit, Axios
**UI/Styling:** TailwindCSS, Framer Motion, Lucide React icons, Radix UI
**Data Visualization:** D3.js, Recharts
**Utilities:** OpenAI SDK, xlsx, date-fns, React Hook Form, React Helmet
**Build:** Vite 5, PostCSS, Autoprefixer

### Backend (pyproject.toml)

**Framework:** FastAPI, Uvicorn
**Database:** SQLAlchemy, psycopg2-binary
**Networking:** aiohttp, httpx, dnspython
**Utilities:** Pydantic, python-multipart, aiofiles, Pillow

### External APIs Consumed

- **crt.sh** — Certificate Transparency log queries for subdomain discovery
- **Wayback Machine CDX API** — Historical URL discovery
- **Common Crawl Index** — Web archive data for subdomain enumeration
- **OpenAI API** (optional) — AI-powered vulnerability content generation

---

## Environment Variables Reference

| Variable                  | Required | Default   | Description                              |
|---------------------------|----------|-----------|------------------------------------------|
| DATABASE_URL              | No       | SQLite    | PostgreSQL or SQLite connection string   |
| CORS_ORIGINS              | No       | *         | Allowed origins (comma-separated or *)   |
| RATE_LIMIT_REQUESTS       | No       | 5         | Max requests per rate limit window       |
| RATE_LIMIT_WINDOW_SECONDS | No       | 60        | Rate limit window in seconds             |
| JOB_QUEUE_WORKERS         | No       | 3         | Number of async job queue workers        |
| JOB_TTL_HOURS             | No       | 24        | Hours before completed jobs are cleaned  |
| MAX_JOBS_IN_MEMORY        | No       | 1000      | Maximum jobs stored in memory            |
| LOG_LEVEL                 | No       | INFO      | Logging level                            |
| VITE_OPENAI_API_KEY       | No       | —         | OpenAI API key for AI content generation |
| VITE_API_URL              | No       | —         | Backend API URL (dev only)               |

---

*Last updated: March 2026*
