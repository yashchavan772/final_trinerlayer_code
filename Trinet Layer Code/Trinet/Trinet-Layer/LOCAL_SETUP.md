# TrinetLayer - Local Setup & Dependencies

This guide explains how to set up and run the TrinetLayer cybersecurity education platform on your local system.

## Project Overview

TrinetLayer consists of two main components:
- **Frontend**: React 18 application with Vite (port 5000)
- **Backend**: Python FastAPI application (port 8000)

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | v18+ or v20+ | Frontend JavaScript runtime |
| npm | v9+ | Node.js package manager |
| Python | 3.11+ | Backend runtime |
| pip or uv | Latest | Python package manager |
| Git | Latest | Version control |
| PostgreSQL | 15+ | Database (optional for full functionality) |

### Verify Installations

```bash
node --version    # Should show v18+ or v20+
npm --version     # Should show v9+
python --version  # Should show 3.11+
git --version     # Any recent version
```

---

## Project Structure

```
Trinet-Layer/
├── Trinet_layer/          # Frontend (React + Vite)
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.mjs    # Vite configuration
├── cve_scanner/           # CVE Scanner API module
├── subdomain_scanner/     # Subdomain enumeration module
├── js_analyzer/           # JavaScript analyzer module
├── pyproject.toml         # Python dependencies
└── main.py                # Backend entry point
```

---

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Trinet-Layer
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd Trinet_layer

# Install Node.js dependencies
npm install

# Return to project root
cd ..
```

### Step 3: Backend Setup

Using pip:
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary dnspython aiohttp httpx pydantic python-multipart aiofiles pillow
```

Or using uv (faster alternative):
```bash
# Install uv if not already installed
pip install uv

# Install dependencies from pyproject.toml
uv sync
```

---

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in `Trinet_layer/` directory:

```env
# Optional: OpenAI API key for AI-powered content generation
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Backend API URL (default for local development)
VITE_API_URL=http://localhost:8000
```

### Backend Environment Variables

Create a `.env` file in the project root:

```env
# Database connection (optional - SQLite will be used if not set)
DATABASE_URL=postgresql://username:password@localhost:5432/trinetlayer

# Or use SQLite for local development (no setup required)
DATABASE_URL=sqlite:///./trinetlayer.db
```

---

## Running the Project

### Option 1: Run Both Services Separately

**Terminal 1 - Backend API:**
```bash
cd Trinet-Layer
python -m uvicorn cve_scanner.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd Trinet-Layer/Trinet_layer
npm run start
```

### Option 2: Using Concurrent Commands

You can use tools like `concurrently` or run in separate terminals.

---

## Accessing the Application

After starting both services:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5000 | Main web application |
| Backend API | http://localhost:8000 | REST API endpoints |
| API Docs | http://localhost:8000/docs | Swagger/OpenAPI documentation |

---

## Dependencies Reference

### Frontend Dependencies (package.json)

**Core:**
- `react` (v18.2.0) - UI library
- `react-dom` (v18.2.0) - React DOM renderer
- `react-router-dom` (v6.0.2) - Client-side routing
- `@reduxjs/toolkit` (v2.6.1) - State management
- `axios` (v1.8.4) - HTTP client

**UI/Styling:**
- `tailwindcss` (v3.4.6) - Utility-first CSS framework
- `framer-motion` (v10.16.4) - Animations
- `lucide-react` (v0.484.0) - Icons
- `@radix-ui/react-slot` (v1.2.3) - Accessible UI primitives

**Utilities:**
- `recharts` (v2.15.2) - Charts and graphs
- `d3` (v7.9.0) - Data visualization
- `xlsx` (v0.18.5) - Excel file handling
- `openai` (v5.12.2) - AI integration (optional)

**Build Tools:**
- `vite` (v5.4.15) - Build tool and dev server
- `postcss` (v8.4.8) - CSS processing
- `autoprefixer` (v10.4.2) - CSS vendor prefixes

### Backend Dependencies (pyproject.toml)

- `fastapi` (v0.128.0+) - Web framework
- `uvicorn` (v0.40.0+) - ASGI server
- `sqlalchemy` (v2.0.45+) - ORM
- `psycopg2-binary` (v2.9.11+) - PostgreSQL driver
- `dnspython` (v2.8.0+) - DNS queries
- `aiohttp` (v3.13.2+) - Async HTTP client
- `httpx` (v0.28.1+) - HTTP client
- `pydantic` (v2.12.5+) - Data validation
- `python-multipart` (v0.0.21+) - Form data parsing
- `aiofiles` (v25.1.0+) - Async file operations
- `pillow` (v12.0.0+) - Image processing

---

## Troubleshooting

### Common Issues

**1. Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**2. Node modules issues:**
```bash
cd Trinet_layer
rm -rf node_modules package-lock.json
npm install
```

**3. Python dependency conflicts:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**4. Database connection issues:**
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correctly configured
- For quick testing, use SQLite (no setup required)

**5. CORS errors in browser:**
- Ensure backend is running on port 8000
- Check that frontend VITE_API_URL matches backend URL

---

## Development Commands

### Frontend
```bash
npm run start     # Start development server
npm run build     # Build for production
npm run serve     # Preview production build
```

### Backend
```bash
# Development with auto-reload
python -m uvicorn cve_scanner.main:app --reload --port 8000

# Production
python -m uvicorn cve_scanner.main:app --host 0.0.0.0 --port 8000
```

---

## Optional: Database Setup

For full functionality with PostgreSQL:

```sql
-- Create database
CREATE DATABASE trinetlayer;

-- Create user (optional)
CREATE USER trinetuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE trinetlayer TO trinetuser;
```

Update `DATABASE_URL` in your environment:
```
DATABASE_URL=postgresql://trinetuser:yourpassword@localhost:5432/trinetlayer
```

---

## Support

If you encounter issues not covered here:
1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Ensure all dependencies are installed correctly
4. Verify environment variables are set properly

---

*Last updated: January 2026*
