# TrinetLayer

## Overview

TrinetLayer is a cybersecurity education and security scanning platform designed for vulnerability research, exploit payloads, and attack techniques. It serves as a "Bug Hunter Vault" providing educational content for security researchers and bug bounty hunters. The platform combines hands-on security scanning tools with interactive learning modules covering web application vulnerabilities, AI/LLM security, and modern attack techniques.

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
- **Component Design**: Utility-first CSS with Radix UI primitives for accessible foundations
- **Module Resolution**: Path aliasing via jsconfig.json with baseUrl pointing to `./src`

### Backend Architecture
- **Framework**: Python FastAPI for all security scanning APIs
- **API Structure**: RESTful endpoints organized by security module
- **Async Processing**: Background task execution for long-running scans
- **Rate Limiting**: Per-client IP rate limiting to prevent abuse
- **Database**: SQLAlchemy ORM with PostgreSQL (via DATABASE_URL environment variable)

### Security Scanning Modules

**CVE Scanner** (`cve_scanner/`)
- Integrates ProjectDiscovery Nuclei for CVE detection
- Year-based template organization (2025, 2026)
- Automatic template sync from GitHub
- Scan lifecycle: PENDING → RUNNING → COMPLETED → FAILED
- Detection-only scanning with no exploitation

**Subdomain Scanner** (`subdomain_scanner/`)
- Multi-source enumeration: Certificate Transparency (crt.sh), DNS bruteforce, Wayback Machine, Common Crawl
- Advanced passive intelligence modules (user-enabled)
- DNS validation and alive checking
- Risk classification based on subdomain patterns

**JS Analyzer** (`js_analyzer/`)
- JavaScript file discovery via Wayback Machine and live crawling
- Secret detection with entropy-based validation
- Endpoint and dangerous pattern identification
- PRO mode with subdomain enumeration
- Report generation in JSON, HTML, and Markdown formats

### AI Content Generation
- OpenAI integration for generating vulnerability educational content
- Custom hooks pattern (`useVulnerabilityContentGenerator`) for AI operations
- Dedicated service layer under `src/services/openai/` with client initialization, content generation, and error handling

### AI Security Section
- **6-module learning journey**: Overview → AI Anatomy → Threat Modeling → OWASP Top 10 → Testing Prompts → AI Labs
- **Shared navigation component**: AISecurityNav provides consistent sub-navigation across all AI Security pages
- **Progress tracking**: Visual progress bar (1/6 through 6/6) with "Next" links guiding users through the curriculum
- **OWASP Top 10 page**: Expandable grid layout with detailed attack examples and mitigations for each LLM risk
- **AI Labs**: Interactive environment for AI/LLM security testing with beginner and pro modes
- **Components location**: `src/components/ai-security/` (AISecurityNav, AISecurityLayout, SectionCard, PageHeader, etc.)

### Design Patterns
- Hooks-based architecture for reusable logic
- Service layer separation for external API calls
- CSS custom properties for design tokens (colors, spacing)
- Mobile-first responsive approach with dark mode as default

## External Dependencies

### Third-Party Services
- **OpenAI API**: GPT-5 for vulnerability content generation (requires VITE_OPENAI_API_KEY)
- **ProjectDiscovery Nuclei**: CVE template-based vulnerability scanning
- **crt.sh**: Certificate Transparency log queries for subdomain enumeration
- **Wayback Machine CDX API**: Historical URL discovery
- **Common Crawl**: Web archive subdomain discovery

### Database
- **PostgreSQL**: Primary database via DATABASE_URL environment variable
- **SQLAlchemy**: ORM for database models (Scan, Finding tables)

### Key Python Dependencies
- FastAPI, uvicorn (web framework)
- dnspython (DNS resolution)
- aiohttp (async HTTP client)
- BeautifulSoup (HTML parsing)

### Key JavaScript Dependencies
- React 18, Redux Toolkit, React Router v6
- TailwindCSS, Framer Motion
- OpenAI SDK, Axios
- D3.js, Recharts (data visualization)