# TrinetLayer

## Overview

TrinetLayer is a cybersecurity education and security scanning platform designed for vulnerability research, exploit payloads, and attack techniques. It serves as a "Bug Hunter Vault" providing educational content for security researchers and penetration testers, combining interactive learning environments with real security scanning capabilities.

The platform consists of a React frontend for the educational interface and Python FastAPI backends powering two security scanning modules: subdomain enumeration and JavaScript file analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **State Management**: Redux Toolkit for centralized application state
- **Routing**: React Router v6 for declarative navigation with React.lazy() code splitting (30 route-based chunks)
- **Styling**: TailwindCSS with CSS custom properties for theming (dark mode cybersecurity aesthetic)
- **Animation**: Framer Motion for UI animations
- **Form Handling**: React Hook Form for efficient form management
- **Component Design**: Utility-first CSS with Radix UI primitives for accessible foundations; custom `cn()` utility combining clsx and tailwind-merge
- **Module Resolution**: Path aliasing via jsconfig.json with baseUrl pointing to `./src`
- **Data Visualization**: D3.js and Recharts for security data display

### Backend Architecture
- **Framework**: Python FastAPI for all security scanning APIs
- **API Structure**: RESTful endpoints organized by security module under `/api/` prefix
- **Async Processing**: Background job queue with 3 async workers for long-running scans
- **Rate Limiting**: Per-client IP rate limiting (5 requests/60 seconds) to prevent abuse
- **Database**: SQLAlchemy ORM with PostgreSQL (via DATABASE_URL environment variable)
- **CORS**: Permissive CORS middleware for frontend integration

### Background Job Queue (`job_queue/`)
- In-memory async job queue with configurable workers (default: 3)
- Supports subdomain scans and JS analysis
- Job lifecycle: PENDING → RUNNING → COMPLETED/FAILED/CANCELLED
- Automatic cleanup of completed jobs after 24 hours
- Max 1000 jobs in memory with LRU eviction
- API endpoints: `/api/jobs/` for submission, status, results, cancellation

### Security Scanning Modules

**Subdomain Scanner** (`subdomain_scanner/`)
- Multi-source enumeration: Certificate Transparency (crt.sh), DNS bruteforce, Wayback Machine, Common Crawl
- Advanced passive intelligence modules (user-enabled): wayback, commoncrawl, public_js
- DNS validation and HTTP alive checking
- Risk classification based on subdomain patterns (admin, dev, staging keywords)
- Normalization and deduplication pipeline
- Result limiting: Maximum 500 subdomains returned (top results by source count) for large domains
- Timeout handling: 180s basic / 300s advanced mode with graceful degradation

**JS Analyzer** (`js_analyzer/`)
- JavaScript file discovery via Wayback Machine CDX API and live crawling
- Secret detection with entropy-based validation (Shannon entropy)
- Endpoint extraction and dangerous pattern identification
- PRO mode with subdomain enumeration support
- Report generation in JSON, HTML, and Markdown formats
- Pattern-based detection with configurable security rules

### AI Content Generation
- OpenAI integration for generating vulnerability educational content
- GPT-5 model for 40% theory / 60% practical content generation
- Custom hooks pattern (`useVulnerabilityContentGenerator`) for AI operations
- Dedicated service layer under `src/services/openai/` with error handling

### Interactive Learning Features
- **Live Exploit Sandbox**: Dynamic practice environments for XSS, SQL Injection, IDOR
- **AI Security Labs**: Prompt injection, jailbreak, hallucination scenarios
- Separate progress tracking for Beginner and Pro modes

### Verified Payload Counts (as of Jan 2026)
- **XSS**: 60 payloads (Reflected, Stored, DOM)
- **SQL Injection**: 100 payloads (Union, Boolean, Time, Error, Stacked)
- **IDOR**: 27 payloads (Parameter, Enumeration, Privilege, API)
- **OTP Bypass**: 22 payloads (Reuse, Skip, Rate, Response)
- **CRLF Injection**: 12 payloads (Header, Response, Cache)
- **Dependency Confusion**: 3 PoC examples
- **Total**: 224 payloads across 6 vulnerability types
- **Payload Vault**: 124 curated payloads (subset of total)

## External Dependencies

### Frontend Dependencies
- **OpenAI SDK** (`openai`): AI-powered content generation, requires `VITE_OPENAI_API_KEY`
- **Axios**: HTTP client for API communication with backend scanners

### Backend Dependencies
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **aiohttp**: Async HTTP client for external API queries
- **dnspython**: DNS resolution for subdomain validation
- **BeautifulSoup4**: HTML parsing for JS file extraction

### External APIs Consumed
- **crt.sh**: Certificate Transparency log queries for subdomain discovery
- **Wayback Machine CDX API**: Historical URL discovery for JS files and subdomains
- **Common Crawl Index**: Web archive data for subdomain enumeration

## Documentation
- **SYSTEM_ARCHITECTURE.md**: Complete system architecture, directory structure, tool details, data flow diagrams
- **LOCAL_SETUP.md**: Comprehensive deployment guide for local Linux development and live server production deployment (Nginx, systemd, SSL)
