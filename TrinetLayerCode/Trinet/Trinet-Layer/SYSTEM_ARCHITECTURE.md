# TrinetLayer System Architecture

## Platform Overview

TrinetLayer is a cybersecurity education and security scanning platform designed for vulnerability research, exploit payloads, and attack techniques. It serves as a "Bug Hunter Vault" providing educational content for security researchers and penetration testers, combining interactive learning environments with real security scanning capabilities.

The platform consists of:
- A React frontend for the educational interface, vulnerability reference, and interactive labs
- A Python FastAPI backend powering the subdomain enumeration scanner
- An external GhostJS Analyzer tool (hosted at `app.trinetlayer.com`) for JavaScript security analysis
- An AI content generation layer powered by OpenAI

---

## Directory / File Structure

```
TrinetLayerCode/Trinet/Trinet-Layer/
├── config.py                          # Central configuration (env vars, rate limits, job queue)
├── pyproject.toml                     # Python dependencies (FastAPI, uvicorn, aiohttp, dnspython, etc.)
├── pytest.ini                         # Test configuration
├── LOCAL_SETUP.md                     # Local development setup guide
├── SYSTEM_ARCHITECTURE.md             # This file
│
├── subdomain_scanner/                 # Backend: Subdomain Scanner module
│   ├── __init__.py
│   ├── main.py                        # FastAPI app entry point (uvicorn target)
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py                  # API route definitions (/api/recon/*)
│   ├── recon/
│   │   ├── __init__.py
│   │   ├── scanner.py                 # Orchestrator: full scan pipeline
│   │   ├── passive.py                 # Passive enumeration (crt.sh)
│   │   ├── active.py                  # Active enumeration (DNS bruteforce + validation)
│   │   ├── alive.py                   # HTTP alive checking
│   │   ├── wayback.py                 # Wayback Machine CDX API integration
│   │   ├── commoncrawl.py             # Common Crawl index integration
│   │   └── public_js.py              # Public JavaScript file subdomain extraction
│   └── utils/
│       ├── __init__.py
│       ├── validator.py               # Domain input validation
│       ├── normalizer.py              # Subdomain normalization
│       ├── deduplicator.py            # Result deduplication and merging
│       └── risk.py                    # Risk classification engine
│
├── job_queue/                         # Background async job queue
│   ├── __init__.py
│   ├── api.py                         # Job queue API routes (/api/jobs/*)
│   ├── handlers.py                    # Job execution handlers
│   ├── manager.py                     # Job lifecycle management
│   ├── models.py                      # Job data models and enums
│   └── queue.py                       # Async worker queue implementation
│
└── Trinet_layer/                      # Frontend: React application
    ├── index.html                     # HTML entry point
    ├── package.json                   # Node.js dependencies
    ├── package-lock.json
    ├── vite.config.mjs                # Vite build configuration + dev proxy
    ├── tailwind.config.js             # TailwindCSS configuration
    ├── postcss.config.js              # PostCSS configuration
    ├── jsconfig.json                  # Module resolution (baseUrl: ./src)
    ├── favicon.ico
    ├── build/                         # Production build output (generated)
    ├── public/                        # Static public assets
    │   ├── assets/
    │   │   ├── favicon.ico
    │   │   ├── favicon.png
    │   │   └── logo.png
    │   ├── manifest.json
    │   └── robots.txt
    └── src/
        ├── index.jsx                  # React DOM render entry
        ├── App.jsx                    # Root component
        ├── Routes.jsx                 # All route definitions (30+ routes with lazy loading)
        ├── components/
        │   ├── AppIcon.jsx
        │   ├── AppImage.jsx
        │   ├── ErrorBoundary.jsx
        │   ├── ScrollToTop.jsx
        │   ├── SocialIcons.jsx
        │   ├── ai-security/
        │   │   ├── AISecurityNav.jsx   # AI Security section navigation
        │   │   └── index.jsx
        │   ├── navigation/
        │   │   ├── Breadcrumb.jsx
        │   │   ├── GlobalSearch.jsx
        │   │   └── Sidebar.jsx        # Main sidebar navigation
        │   ├── shared/
        │   │   ├── EmptyState.jsx
        │   │   ├── Logo.jsx
        │   │   ├── ModeToggle.jsx
        │   │   ├── RelatedVulnerabilities.jsx
        │   │   ├── SeverityBadge.jsx
        │   │   └── index.js
        │   └── ui/
        │       ├── Button.jsx
        │       ├── Checkbox.jsx
        │       ├── Input.jsx
        │       └── Select.jsx
        ├── hooks/
        │   └── useVulnerabilityContentGenerator.js
        ├── pages/
        │   ├── homepage/              # Landing page
        │   ├── vulnerabilities-overview/
        │   ├── xss/                   # XSS payloads & education
        │   ├── sql-injection/         # SQL Injection payloads & education
        │   ├── idor/                  # IDOR payloads & education
        │   ├── otp-bypass/            # OTP Bypass payloads
        │   ├── otp-bypass-hub/        # OTP Bypass learning hub
        │   ├── crlf-injection/        # CRLF Injection payloads
        │   ├── dependency-confusion/  # Dependency Confusion education
        │   ├── payload-vault/         # Cross-vulnerability payload collection
        │   ├── live-exploit-sandbox/  # Interactive exploit practice
        │   ├── subdomain-scanner/     # Subdomain Scanner UI
        │   ├── js-analyzer/           # GhostJS Analyzer landing page
        │   ├── ai-security-overview/  # AI Security overview
        │   ├── ai-security-anatomy/   # AI attack anatomy
        │   ├── ai-security-threat-modeling/
        │   ├── ai-security-owasp-top10/
        │   ├── ai-security-prompts/   # Prompt engineering for security
        │   ├── ai-security-labs/      # Interactive AI security labs
        │   ├── ai-security-hack-the-ai/
        │   ├── contribute/            # Contribution page
        │   └── NotFound.jsx           # 404 page
        ├── services/
        │   └── openai/
        │       ├── index.js
        │       ├── openaiClient.js    # OpenAI SDK client
        │       ├── errorHandler.js    # API error handling
        │       └── vulnerabilityContentGenerator.js
        ├── styles/
        │   ├── index.css
        │   └── tailwind.css
        └── utils/
            └── cn.js                  # clsx + tailwind-merge utility
```

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                          │
│                                                                        │
│   React 18 SPA ─── React Router v6 ─── Redux Toolkit ─── TailwindCSS  │
│   Framer Motion ─── Axios ─── OpenAI SDK ─── D3.js / Recharts         │
└────────────┬──────────────────────────┬────────────────────────────────┘
             │                          │
             │  /api/recon/*            │  /api/jobs/*
             │  /api/recon/scan         │  /api/jobs/subdomain-scan
             │  /api/recon/subdomains   │  /api/jobs/{id}
             │                          │  /api/jobs/{id}/result
             │                          │
    ┌────────▼──────────────────────────▼─────────────────────────────┐
    │                    FastAPI Backend (uvicorn)                     │
    │                    Port 8000 (dev) / 5000 (prod)                │
    │                                                                  │
    │  ┌──────────────────────┐    ┌───────────────────────────────┐   │
    │  │  Subdomain Scanner   │    │    Background Job Queue       │   │
    │  │  /api/recon/*        │    │    /api/jobs/*                │   │
    │  │                      │    │                               │   │
    │  │  POST /scan          │    │  POST /subdomain-scan         │   │
    │  │  POST /subdomains    │    │  POST /js-analysis            │   │
    │  │  GET  /health        │    │  GET  /{job_id}               │   │
    │  └──────────┬───────────┘    │  GET  /{job_id}/result        │   │
    │             │                │  DELETE /{job_id}              │   │
    │             │                │  GET  /stats/queue             │   │
    │             ▼                └───────────────┬───────────────┘   │
    │  ┌─────────────────────────┐                │                   │
    │  │   Scanning Pipeline     │     ┌──────────▼────────────┐      │
    │  │                         │     │  Async Worker Pool    │      │
    │  │  1. Passive (crt.sh)    │     │  (3 workers default)  │      │
    │  │  2. Active (DNS brute)  │     │                       │      │
    │  │  3. Advanced (optional) │     │  Job Lifecycle:       │      │
    │  │     - Wayback Machine   │     │  PENDING → RUNNING    │      │
    │  │     - Common Crawl      │     │  → COMPLETED/FAILED   │      │
    │  │     - Public JS         │     │  → CANCELLED          │      │
    │  │  4. Normalize & Dedup   │     └───────────────────────┘      │
    │  │  5. DNS Validation      │                                    │
    │  │  6. Alive Check         │                                    │
    │  │  7. Risk Classification │                                    │
    │  └─────────────────────────┘                                    │
    │                                                                  │
    │  ┌─────────────────────────────────────────────────────────┐     │
    │  │  Static File Serving (Production)                       │     │
    │  │  /assets/* → Trinet_layer/build/assets/                 │     │
    │  │  /* (SPA fallback) → Trinet_layer/build/index.html      │     │
    │  └─────────────────────────────────────────────────────────┘     │
    └──────────────────────────────────────────────────────────────────┘
             │                    │                    │
             ▼                    ▼                    ▼
    ┌────────────────┐  ┌─────────────────┐  ┌────────────────────┐
    │   crt.sh API   │  │ Wayback Machine │  │   Common Crawl     │
    │  (CT Logs)     │  │   CDX API       │  │   Index API        │
    └────────────────┘  └─────────────────┘  └────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18.2 with functional components and hooks
- **Build Tool**: Vite 5.4 with `@vitejs/plugin-react`
- **State Management**: Redux Toolkit + Redux
- **Routing**: React Router v6 with declarative routes and `React.lazy()` code splitting
- **Styling**: TailwindCSS 3.4 with custom dark-mode cybersecurity aesthetic
- **Animation**: Framer Motion 10
- **Form Handling**: React Hook Form 7
- **Icons**: Lucide React
- **Data Visualization**: D3.js 7 and Recharts 2
- **HTTP Client**: Axios for backend API communication
- **AI Integration**: OpenAI SDK 5 (client-side, key via `VITE_OPENAI_API_KEY`)
- **UI Primitives**: Radix UI (`@radix-ui/react-slot`), Class Variance Authority
- **Utilities**: clsx + tailwind-merge (custom `cn()` helper)

### Module Resolution
Path aliasing configured via `jsconfig.json` with `baseUrl: "./src"`, allowing imports like `import Sidebar from 'components/navigation/Sidebar'` instead of relative paths.

### Code Splitting
All page-level components use `React.lazy()` with dynamic imports. The `Routes.jsx` file defines 30+ route-based chunks loaded on demand with a shared `<Suspense>` fallback loader.

### Route Map (33 routes)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Homepage | Landing page |
| `/homepage` | Homepage | Alias for landing |
| `/vulnerabilities-overview` | VulnerabilitiesOverview | Vulnerability research hub |
| `/xss` | XSS | Cross-Site Scripting payloads |
| `/sql-injection` | SQLInjection | SQL Injection payloads |
| `/idor` | IDOR | Insecure Direct Object Reference |
| `/otp-bypass` | OTPBypass | OTP Bypass payloads |
| `/otp-bypass-hub` | OTPBypassHub | OTP Bypass learning hub |
| `/crlf-injection` | CRLFInjection | CRLF Injection payloads |
| `/dependency-confusion` | DependencyConfusion | Dependency Confusion education |
| `/payload-vault` | PayloadVault | Cross-vulnerability payload vault |
| `/live-exploit-sandbox` | LiveExploitSandbox | Interactive exploit sandbox |
| `/subdomain-scanner` | SubdomainScanner | Subdomain Scanner UI |
| `/js-analyzer` | JSAnalyzer | GhostJS Analyzer gate page |
| `/ai-security-overview` | AISecurityOverview | AI Security overview |
| `/ai-security-anatomy` | AISecurityAnatomy | AI attack anatomy |
| `/ai-security-threat-modeling` | AISecurityThreatModeling | AI threat modeling |
| `/ai-security-owasp-top10` | AISecurityOWASPTop10 | OWASP Top 10 for LLMs |
| `/ai-security-prompts` | AISecurityPrompts | Prompt engineering for security |
| `/ai-security-labs` | AISecurityLabs | AI Security labs hub |
| `/ai-security-hack-the-ai` | AISecurityHackTheAI | Hack The AI challenge |
| `/ai-security-labs/lab-1-prompt-injection` | Lab1PromptInjection | Lab 1 |
| `/ai-security-labs/lab-2-jailbreak` | Lab2Jailbreak | Lab 2 |
| `/ai-security-labs/lab-3-hallucination` | Lab3Hallucination | Lab 3 |
| `/ai-security-labs/lab-4-excessive-agency` | Lab4ExcessiveAgency | Lab 4 |
| `/ai-security-labs/lab-5-rag-poisoning` | Lab5RAGPoisoning | Lab 5 |
| `/contribute` | Contribute | Contribution page |
| `*` | NotFound | 404 fallback |

### Security Headers (Dev Server)
The Vite dev server includes a custom security plugin that:
- Blocks access to sensitive files (`.env`, `.git`, `.npmrc`, `.yarnrc`)
- Sets `X-Content-Type-Options: nosniff`
- Sets `X-Frame-Options: SAMEORIGIN`
- Sets `X-XSS-Protection: 1; mode=block`

---

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI
- **ASGI Server**: uvicorn
- **Async HTTP**: aiohttp for external API requests
- **DNS**: dnspython for DNS resolution and bruteforce
- **Database ORM**: SQLAlchemy with PostgreSQL (psycopg2-binary)
- **Validation**: Pydantic v2 for request/response models
- **CORS**: FastAPI CORSMiddleware (permissive `*` origins)

### Application Entry Point
The FastAPI app is defined in `subdomain_scanner/main.py` and started with:
```
uvicorn subdomain_scanner.main:app --host 0.0.0.0 --port 8000
```

### Static File Serving (Production)
In production, the backend serves the built React frontend:
- `/assets/*` mapped to `Trinet_layer/build/assets/`
- All other paths fall through to `Trinet_layer/build/index.html` (SPA routing)

### Rate Limiting
Per-domain rate limiting: 5 requests per 60-second window. Configurable via environment variables `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW_SECONDS`.

---

## Tool #1: Subdomain Scanner

### Overview
Multi-source subdomain enumeration engine that discovers, validates, and risk-classifies subdomains for a target domain.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/recon/subdomains` | Basic subdomain enumeration |
| `POST` | `/api/recon/scan` | Full scan with optional advanced passive modules |
| `GET` | `/api/recon/subdomains/health` | Health check |

### Scanning Pipeline

```
1. Passive Enumeration
   └── Certificate Transparency (crt.sh) queries

2. Active Enumeration
   └── DNS bruteforce with safe wordlist

3. Advanced Passive Intelligence (optional, user-enabled)
   ├── Wayback Machine CDX API
   ├── Common Crawl Index
   └── Public JavaScript file analysis

4. Normalization & Deduplication
   ├── Lowercase normalization
   ├── Domain suffix validation
   └── Source merging

5. DNS Validation
   └── Verify discovered subdomains resolve via DNS

6. Alive Check
   └── HTTP/HTTPS connectivity verification

7. Risk Classification
   ├── HIGH: admin, dashboard, auth, login, secure, root, superuser
   ├── MEDIUM: dev, staging, internal, test, beta, uat, qa, sandbox
   ├── LOW: www, mail, api, cdn, static, assets, img, images
   └── INFO: not alive
```

### Enumeration Sources
| Source | Module | Description |
|--------|--------|-------------|
| crt.sh | `recon/passive.py` | Certificate Transparency log queries |
| DNS Bruteforce | `recon/active.py` | Controlled DNS resolution against common subdomain wordlist |
| Wayback Machine | `recon/wayback.py` | Historical URL discovery via CDX API |
| Common Crawl | `recon/commoncrawl.py` | Web archive index queries |
| Public JS | `recon/public_js.py` | Subdomain extraction from public JavaScript files |

### Timeouts and Limits
- Basic scan timeout: 180 seconds
- Advanced scan timeout: 300 seconds
- Individual advanced module timeout: 30 seconds
- Maximum subdomains displayed: 1,000 (all available in CSV export)
- DNS validation batch size: 100
- Alive check batch size: 100

---

## Tool #2: GhostJS Analyzer

### Overview
Advanced JavaScript security analysis tool with 22 detection categories. The analyzer is hosted as a separate application at `app.trinetlayer.com` and requires authentication. The TrinetLayer platform includes a landing page (`/js-analyzer`) that describes the tool's capabilities and links to the external app.

### 22 Detection Categories
1. Cloud Secrets (AWS, GCP, Azure, Cloudflare, Supabase)
2. AI & ML Secrets (OpenAI, Anthropic, Cohere, HuggingFace)
3. Monitoring (Datadog, New Relic, Sentry, PagerDuty)
4. Package Registries (npm, PyPI, NuGet, RubyGems)
5. E-commerce (Shopify, WooCommerce, BigCommerce)
6. Auth & Identity (Auth0, Okta, Firebase, Clerk)
7. Payment & Financial (Stripe, Razorpay, PayPal)
8. Source Control (GitHub PATs, GitLab, Bitbucket)
9. API & Auth (Bearer tokens, JWTs, OAuth secrets)
10. Email & Messaging (SendGrid, Mailgun)
11. Communication (Twilio, Slack webhooks, Discord)
12. SaaS Tokens (Notion, Algolia, Mapbox, Airtable)
13. CI/CD & DevOps (Jenkins, CircleCI, Vercel, Netlify)
14. Database Credentials (MongoDB, PostgreSQL, Redis, MySQL)
15. Private Keys (SSH, PEM, RSA)
16. Hardcoded Credentials (passwords, default creds)
17. Internal Endpoints (admin panels, debug routes, staging URLs)
18. Sensitive Config (env variables, config objects)
19. Source Map Exposure (.js.map files)
20. API Endpoint Exposure (hidden /api/, /admin/, /graphql routes)
21. Cloud Storage Exposure (S3, GCS, Azure Blob, R2)
22. Analytics & Tracking (CleverTap, Mixpanel, Amplitude, Segment)

### Validation Pipeline
Every match goes through Shannon entropy scoring, format validation for 14+ known key types, common false-positive pattern detection, and confidence adjustment.

---

## Tool #3: Live Exploit Sandbox

### Overview
Interactive browser-based exploit practice environment for educational purposes. Users can attempt attacks against simulated vulnerable targets without affecting real systems.

### Challenge Types
| Type | Component | Description |
|------|-----------|-------------|
| XSS | `XSSTarget.jsx` | Cross-Site Scripting injection challenges |
| SQL Injection | `SQLiTarget.jsx` | SQL Injection exploitation scenarios |
| IDOR | `IDORTarget.jsx` | Insecure Direct Object Reference access control bypass |

### Components
- `ScenarioSelector.jsx` - Challenge picker
- `VulnerableCodeViewer.jsx` - Shows vulnerable source code for analysis
- `ConsoleOutput.jsx` - Simulated console output
- `ObjectivesPanel.jsx` - Challenge objectives and progress tracking
- `sandboxEngine.js` - Core sandbox execution engine

---

## AI Security Labs

### Overview
Interactive educational labs for understanding AI/LLM security vulnerabilities with both Beginner and Pro modes.

### 5 Labs
| Lab | Path | Topic |
|-----|------|-------|
| Lab 1 | `/ai-security-labs/lab-1-prompt-injection` | Prompt Injection |
| Lab 2 | `/ai-security-labs/lab-2-jailbreak` | Jailbreak Techniques |
| Lab 3 | `/ai-security-labs/lab-3-hallucination` | Hallucination Exploitation |
| Lab 4 | `/ai-security-labs/lab-4-excessive-agency` | Excessive Agency |
| Lab 5 | `/ai-security-labs/lab-5-rag-poisoning` | RAG Poisoning |

### 7 AI Security Navigation Items
1. AI Security Overview (`/ai-security-overview`)
2. Anatomy of AI Attacks (`/ai-security-anatomy`)
3. Threat Modeling (`/ai-security-threat-modeling`)
4. OWASP Top 10 for LLMs (`/ai-security-owasp-top10`)
5. Security Prompts (`/ai-security-prompts`)
6. AI Security Labs (`/ai-security-labs`)
7. Hack The AI (`/ai-security-hack-the-ai`)

### Lab Components
- `ChatSimulator.jsx` - Simulated AI chat interface
- `InvestigationPanel.jsx` - Analysis and investigation tools
- `LabContainer.jsx` - Lab layout wrapper
- `ModeToggle.jsx` - Beginner/Pro mode switch
- `ProModePanel.jsx` - Advanced mode interface

---

## Payload Vault

### Overview
Curated collection of 224 payloads across 6 vulnerability types for security research and testing.

### Payload Breakdown
| Vulnerability Type | Count | Subtypes |
|-------------------|-------|----------|
| XSS | 60 | Reflected, Stored, DOM |
| SQL Injection | 100 | Union, Boolean, Time-based, Error-based, Stacked |
| IDOR | 27 | Parameter, Enumeration, Privilege, API |
| OTP Bypass | 22 | Reuse, Skip, Rate Limit, Response Manipulation |
| CRLF Injection | 12 | Header, Response, Cache |
| Dependency Confusion | 3 | PoC examples |

The Payload Vault page (`/payload-vault`) provides 124 curated payloads with filtering, bulk operations, and category-based organization.

---

## Background Job Queue

### Overview
In-memory async job queue for handling long-running scan operations without blocking API responses.

### Architecture
- **Workers**: 3 async workers (configurable via `JOB_QUEUE_WORKERS` env var)
- **Job Types**: `SUBDOMAIN_SCAN`, `JS_ANALYSIS`
- **Storage**: In-memory with LRU eviction (max 1,000 jobs via `MAX_JOBS_IN_MEMORY`)
- **TTL**: Completed jobs expire after 24 hours (configurable via `JOB_TTL_HOURS`)

### Job Lifecycle
```
PENDING → RUNNING → COMPLETED
                  → FAILED
                  → CANCELLED
```

### Job Queue API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/jobs/subdomain-scan` | Submit subdomain scan job |
| `POST` | `/api/jobs/js-analysis` | Submit JS analysis job |
| `GET` | `/api/jobs/{job_id}` | Get job status |
| `GET` | `/api/jobs/{job_id}/result` | Get job result |
| `DELETE` | `/api/jobs/{job_id}` | Cancel a job |
| `GET` | `/api/jobs/` | List all jobs |
| `GET` | `/api/jobs/stats/queue` | Queue statistics |

---

## AI Content Generation

### Overview
OpenAI integration for generating educational vulnerability content dynamically.

### Architecture
- **Client**: OpenAI SDK initialized with `VITE_OPENAI_API_KEY` (client-side)
- **Service Layer**: `src/services/openai/`
  - `openaiClient.js` - SDK client configuration
  - `vulnerabilityContentGenerator.js` - Content generation functions
  - `errorHandler.js` - API error handling utilities
- **Hook**: `useVulnerabilityContentGenerator` custom React hook for component integration
- **Content Mix**: 40% theory / 60% practical content generation

### Exported Functions
- `generateVulnerabilityContent` - Generate vulnerability educational content
- `generateCompleteVulnerabilitySection` - Generate full vulnerability sections
- `generateEnhancedPayloadDescription` - Generate detailed payload descriptions

---

## Frontend-Backend Communication

### Development Mode
In development, the frontend and backend run as separate processes:
- Frontend (Vite dev server): `http://localhost:5000`
- Backend (uvicorn): `http://localhost:8000`

The Vite dev server proxies `/api/*` requests to the backend:
```javascript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true
  }
}
```

### Production Mode
In production, the FastAPI backend serves both the API and the built frontend from a single port (5000):
- API requests go to `/api/recon/*` and `/api/jobs/*`
- Static assets served from `/assets/*` (mapped to `Trinet_layer/build/assets/`)
- All other paths serve `index.html` for SPA client-side routing

---

## Dependencies

### Frontend (package.json)

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| react-router-dom | ^6.30.3 | Client-side routing |
| @reduxjs/toolkit | ^2.6.1 | State management |
| redux | ^5.0.1 | State container |
| tailwindcss | 3.4.6 | Utility-first CSS |
| framer-motion | ^10.16.4 | Animation library |
| axios | ^1.8.4 | HTTP client |
| openai | ^5.12.2 | OpenAI API SDK |
| lucide-react | ^0.484.0 | Icon library |
| d3 | ^7.9.0 | Data visualization |
| recharts | ^2.15.2 | Chart components |
| react-hook-form | ^7.55.0 | Form management |
| react-helmet | ^6.1.0 | Document head management |
| class-variance-authority | ^0.7.1 | Component variant utility |
| clsx | ^2.1.1 | Conditional classnames |
| tailwind-merge | ^3.3.1 | TailwindCSS class merging |
| @radix-ui/react-slot | ^1.2.3 | Slot primitive |
| date-fns | ^4.1.0 | Date utilities |
| vite | ^5.4.21 | Build tool |
| @vitejs/plugin-react | 4.3.4 | React plugin for Vite |

### Backend (pyproject.toml)

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | >=0.128.0 | Web framework |
| uvicorn | >=0.40.0 | ASGI server |
| aiohttp | >=3.13.2 | Async HTTP client |
| httpx | >=0.28.1 | HTTP client |
| dnspython | >=2.8.0 | DNS toolkit |
| pydantic | >=2.12.5 | Data validation |
| sqlalchemy | >=2.0.45 | Database ORM |
| psycopg2-binary | >=2.9.11 | PostgreSQL adapter |
| aiofiles | >=25.1.0 | Async file I/O |
| pillow | >=12.0.0 | Image processing |
| python-multipart | >=0.0.21 | Multipart form parsing |

---

## External APIs Consumed

| API | Purpose | Module |
|-----|---------|--------|
| crt.sh | Certificate Transparency log queries for passive subdomain discovery | `recon/passive.py` |
| Wayback Machine CDX API | Historical URL discovery for subdomains and JS files | `recon/wayback.py` |
| Common Crawl Index | Web archive data for subdomain enumeration | `recon/commoncrawl.py` |
| OpenAI API | AI-powered vulnerability content generation | `services/openai/` |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_OPENAI_API_KEY` | No | - | OpenAI API key for AI content generation (frontend) |
| `DATABASE_URL` | No | - | PostgreSQL connection string |
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed CORS origins |
| `RATE_LIMIT_REQUESTS` | No | `5` | Max requests per rate limit window |
| `RATE_LIMIT_WINDOW_SECONDS` | No | `60` | Rate limit window in seconds |
| `JOB_QUEUE_WORKERS` | No | `3` | Number of async job queue workers |
| `JOB_TTL_HOURS` | No | `24` | Hours before completed jobs are cleaned up |
| `MAX_JOBS_IN_MEMORY` | No | `1000` | Maximum jobs stored in memory |
| `LOG_LEVEL` | No | `INFO` | Application log level |
| `APP_VERSION` | No | `1.0.0` | Application version string |

---

## Port Configuration

| Mode | Service | Port | Notes |
|------|---------|------|-------|
| Development | Frontend (Vite) | 5000 | Dev server with HMR, proxies `/api` to backend |
| Development | Backend (uvicorn) | 8000 | API-only, no static file serving |
| Production | Backend (uvicorn) | 5000 | Serves both API and built frontend static files |
