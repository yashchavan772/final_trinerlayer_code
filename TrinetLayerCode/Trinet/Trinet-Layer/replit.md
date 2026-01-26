# TrinetLayer

## Overview

TrinetLayer is a cybersecurity education platform designed for vulnerability research, exploit payloads, and attack techniques. It provides educational content for security researchers and penetration testers. The platform features AI-enhanced content generation for vulnerability documentation, following a 40% theory / 60% practical learning approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **State Management**: Redux Toolkit for centralized application state
- **Routing**: React Router v6 for declarative navigation
- **Styling**: TailwindCSS with CSS custom properties for theming (dark mode cybersecurity aesthetic)
- **Animation**: Framer Motion for UI animations
- **Form Handling**: React Hook Form for efficient form management

### Component Design
- Utility-first CSS approach with Tailwind
- Custom `cn()` utility combining clsx and tailwind-merge for conditional class composition
- Radix UI primitives for accessible component foundations
- Data visualization through D3.js and Recharts

### AI Content Generation
- OpenAI integration for generating vulnerability educational content
- Custom hooks pattern (`useVulnerabilityContentGenerator`) for AI operations
- Dedicated service layer under `src/services/openai/` with:
  - `openaiClient.js` - OpenAI SDK initialization
  - `vulnerabilityContentGenerator.js` - Content generation logic
  - `errorHandler.js` - Comprehensive API error handling

### Design Patterns
- Hooks-based architecture for reusable logic
- Service layer separation for external API calls
- CSS custom properties for design tokens (colors, spacing)
- Module path aliasing via jsconfig.json (`baseUrl: ./src`)

### Responsive Design
- Mobile-first responsive approach
- Dark mode as default theme
- Media query breakpoints for desktop-specific adjustments
- Focus on cross-device compatibility (desktop, tablet, mobile)

### Live Exploit Sandbox
- **Dynamic, logic-driven** interactive practice environment for security researchers
- Three scenario types: XSS Playground, SQL Injection Lab, IDOR Challenge
- Separate progress tracking for Beginner and Pro modes
- Real-time console logging with exploit detection and payload analysis
- Objective-based learning with hints (Beginner) and minimal guidance (Pro)
- Client-side only - no real vulnerabilities, safe educational environment
- Located at `/live-exploit-sandbox` route

#### Dynamic Features (sandboxEngine.js)
- Simulated network latency (variable delays based on mode)
- Realistic server error simulation (timeouts, 500 errors) in Pro mode
- HTTP headers generation with request IDs and rate limits
- JWT token generation and session management
- WAF (Web Application Firewall) response simulation
- CSP (Content Security Policy) violation detection
- Multi-level XSS filtering (None, Basic, Medium, Strict)
- SQL error message generation with realistic database responses
- Rate limiting simulation for API endpoints
- Payload analysis with severity scoring and technique detection

#### Mode-Based Behavior
- **Beginner Mode**: Fast responses, guided hints, predictable outcomes
- **Pro Mode**: Variable delays, random errors, WAF/CSP toggles, HTTP method selection, JWT display, rate limiting

### Subdomain Scanner (Production-Grade)
- **Backend**: Python FastAPI with async enumeration
- **Enumeration**: Passive (crt.sh) + Active (DNS brute force) + Advanced Passive Intelligence (optional)
- **Located at**: `/subdomain-scanner` route

#### Backend Architecture (subdomain_scanner/)
- `main.py` - FastAPI app (integrated into cve_scanner/main.py)
- `api/routes.py` - REST endpoints: POST /api/recon/subdomains, POST /api/recon/scan
- `recon/passive.py` - Certificate Transparency log queries (crt.sh)
- `recon/active.py` - DNS brute force with safe wordlist
- `recon/alive.py` - HTTP/HTTPS HEAD request checking
- `recon/scanner.py` - Full scan orchestrator with pipeline management
- `recon/wayback.py` - Internet Archive CDX API subdomain extraction
- `recon/commoncrawl.py` - Common Crawl index subdomain extraction
- `recon/public_js.py` - Public JavaScript file parsing for subdomains
- `utils/validator.py` - Domain validation and security controls
- `utils/risk.py` - Risk classification based on subdomain naming
- `utils/normalizer.py` - Subdomain normalization and cleanup
- `utils/deduplicator.py` - Result merging and deduplication

#### API Endpoints
1. **POST /api/recon/subdomains** - Legacy endpoint with source exposure
2. **POST /api/recon/scan** - Frontend-safe endpoint (no technique exposure)
   - Request: `{"domain": "example.com", "advanced_passive": {"wayback": true, "common_crawl": true, "public_js": true}}`
   - Response: subdomain, alive status, risk level only (black-box output)

#### Scan Pipeline Order (Strict)
1. Passive Enumeration (crt.sh)
2. Active Enumeration (DNS bruteforce)
3. Advanced Passive Intelligence (user-enabled, optional)
4. Normalization & Deduplication
5. DNS Validation
6. Alive Check
7. Final Results

#### Enumeration Methods
1. **Passive Enumeration** (crt.sh)
   - Queries Certificate Transparency logs
   - No direct contact with target domain
   - Extracts subdomains from SSL/TLS certificates

2. **Active Enumeration** (DNS Brute Force)
   - Safe wordlist: admin, api, dev, test, staging, beta, internal, auth, dashboard, portal, www, mail, etc.
   - Resolves A and CNAME records only
   - No AXFR or recursive enumeration

3. **Advanced Passive Intelligence** (Optional, user-enabled)
   - Wayback Machine: Historical URL subdomain extraction via CDX API
   - Common Crawl: Pre-indexed hostname extraction
   - Public JavaScript: Static JS file parsing for subdomain references
   - Per-module timeout: 10 seconds
   - Failure in one module does not stop the scan

#### Security Controls
- Input validation blocks IPs, private networks, protocols, wildcards
- Rate limiting: 5 requests/minute per domain (global, not per-IP)
- Global execution timeout: 30 seconds
- Per-module timeout: 10 seconds (advanced passive)
- Legal disclaimer required before scanning
- No intrusive techniques - bug bounty compliant
- Frontend-safe: No exposure of scanning techniques or source names

#### Frontend Features
- Domain input with legal disclaimer checkbox
- **Advanced Settings panel** with toggleable options:
  - Wayback Subdomains: "Discover historical subdomains that appeared in the past."
  - Common Crawl Assets: "Find assets observed in public web archives."
  - Public JS References: "Analyze publicly available JavaScript references for additional assets."
- Warning displayed when advanced settings enabled
- Real-time scanning progress with dynamic messaging
- Summary stats: total discovered, alive, execution time
- Expandable result cards with subdomain, alive status, and risk level
- Direct links to open discovered subdomains (HTTPS/HTTP)
- Frontend-safe: No exposure of scanning techniques or source names
- Responsive design for mobile/tablet/desktop

#### Why This Scanner Section (Expandable)
Comprehensive feature showcase explaining scanner capabilities without source disclosure:

**Core Capabilities (4 features):**
- Multi-Layer Intelligence: Combines passive enumeration, active probing, and historical analysis
- Risk Prioritization Engine: Auto-classifies assets by High/Medium/Low risk based on naming patterns
- Alive Detection: Real-time HTTP/HTTPS probing to identify active assets
- Security-First Design: Input validation, rate limiting, timeout controls, blocks private IPs

**Advanced Intelligence Modules (4 features, marked PRO):**
- Historical Intelligence: Discover forgotten/abandoned subdomains from the past
- Web Archive Analysis: Extract references from billions of indexed archive pages
- JavaScript Intelligence: Parse JS bundles for hardcoded subdomain references
- Parallel Processing: Execute modules simultaneously for fast results

**Compliance & Architecture (4 features):**
- Bug Bounty Compliant: Non-intrusive, passive-safe techniques only
- Black-Box Architecture: API returns only essential data, no technique/source exposure
- Enterprise-Grade Scalability: Handles thousands of subdomains with deduplication
- Global Coverage: Queries distributed data sources across regions

**Stats Display:**
- 5+ Intelligence Layers
- 3 Risk Levels
- 100% Non-Intrusive
- <60s Avg Scan Time

**Scanning Modes Summary:**
- Passive: Certificate Transparency & DNS
- Active: Intelligent Probing & Validation
- Historical: Archive & Time Machine Analysis

### JS Analyzer (Bug Bounty-Quality Detection)
- **Backend**: Python FastAPI with async analysis
- **Located at**: `/js-analyzer` route

#### Scan Modes
1. **FAST Mode** (120s timeout)
   - JS discovery via Wayback Machine + live crawling
   - Secret/endpoint analysis
   - 100 JS files max

2. **PRO Mode** (300s timeout)
   - Auto-enables subdomain enumeration
   - JS deobfuscation
   - 200 JS files max
   - Comprehensive analysis across subdomains

#### Detection Categories (149 patterns)
1. **Cloud & Infrastructure Secrets** (Critical)
   - AWS Access Keys, Secret Keys, Session Tokens
   - GCP API Keys, Service Accounts
   - Azure Connection Strings, Storage Keys
   - Firebase, Supabase, DigitalOcean, Cloudflare

2. **API Keys & Auth Secrets** (Critical/High)
   - JWT Tokens (validated format)
   - Bearer/OAuth/Refresh Tokens
   - Session Tokens, CSRF Tokens
   - Generic API Keys with entropy validation

3. **Payment Secrets** (Critical)
   - Stripe Live Keys (test keys downgraded)
   - Razorpay, PayPal credentials
   - Webhook secrets

4. **Database Credentials** (Critical)
   - MongoDB, PostgreSQL, MySQL connection strings
   - Redis, Elasticsearch URLs

5. **Cryptographic Material** (Critical)
   - RSA/EC Private Keys
   - JWT Signing Secrets
   - Encryption/Signing Keys

6. **Endpoints** (High/Medium)
   - Admin/Internal endpoints
   - REST/GraphQL APIs
   - WebSocket URLs
   - Internal IP URLs

7. **Dangerous Patterns** (context-aware)
   - eval(), innerHTML, document.write
   - Only flagged if user input flows detected

8. **Auth Issues** (High)
   - JWT in localStorage/sessionStorage
   - Hardcoded admin/staff flags
   - Client-side auth checks

#### False Positive Reduction
- **Entropy validation**: Per-secret-type thresholds
- **Placeholder filtering**: Detects test/mock/example values
- **Test key identification**: sandbox/test keys severity downgraded
- **Vendor code suppression**: Skips jQuery, React, CDN files
- **Third-party suppression**: Only analyzes target domain code
- **Context awareness**: Detects comments, test code context
- **CDN IP filtering**: Suppresses known CDN IP ranges

#### API Response
- Findings sorted by severity + risk score
- Suppressed findings with reasons (transparency)
- Summary: secrets, endpoints, dangerous patterns, auth issues
- Test value flagging for manual review

## External Dependencies

### Core Services
- **OpenAI API**: GPT-5 model for AI-generated vulnerability content (requires `VITE_OPENAI_API_KEY` environment variable)
- **Axios**: HTTP client for API requests

### Build & Development
- **Vite**: Development server and production bundler
- **PostCSS**: CSS processing with autoprefixer and Tailwind nesting

### UI Libraries
- **Lucide React**: Icon system
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **Recharts/D3**: Data visualization

### Fonts
- JetBrains Mono (code display)
- Inter (UI text)
- Fira Code, Source Code Pro (alternative code fonts)

### Typography System (AI Security Section)
Standardized typography utility classes for consistent Inter font usage:
- `ai-title`: Page titles (28-32px, semibold, -0.02em letter-spacing)
- `ai-section-heading`: Section headers (18px, semibold)
- `ai-card-title`: Card headings (16px, semibold)
- `ai-subsection-title`: Subsection titles (14px, medium)
- `ai-body`: Primary body text (15px, 1.7 line-height)
- `ai-body-sm`: Secondary body text (14px, 1.6 line-height)
- `ai-helper`: Labels and helper text (13px, medium)
- `ai-badge`: Badges/tags (11px, uppercase, 0.05em letter-spacing)
- `ai-mono`: Code/monospace text (13px, Fira Code)
- `ai-nav`: Navigation items (14px, medium)
- `ai-breadcrumb`: Breadcrumb links (13px)