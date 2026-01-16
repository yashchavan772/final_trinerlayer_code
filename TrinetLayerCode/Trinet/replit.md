# TrinetLayer

## Overview

TrinetLayer is a cybersecurity education and security scanning platform designed for vulnerability research, exploit payloads, and attack techniques. It provides educational content for security researchers, featuring interactive learning environments, AI-powered content generation, and production-grade security scanning tools including CVE detection, subdomain enumeration, and JavaScript analysis.

## Local Setup

For detailed instructions on running this project locally, see **[LOCAL_SETUP.md](Trinet-Layer/LOCAL_SETUP.md)**.

**Quick Start:**
```bash
# Frontend (Terminal 1)
cd Trinet-Layer/Trinet_layer && npm install && npm run start

# Backend (Terminal 2)
cd Trinet-Layer && python -m uvicorn cve_scanner.main:app --port 8000 --reload
```

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
- Multi-source enumeration pipeline:
  1. Passive: Certificate Transparency (crt.sh)
  2. Active: DNS bruteforce with safe wordlist
  3. Advanced Passive: Wayback, CommonCrawl, JS parsing
  4. DNS validation and alive checking
- Risk classification for discovered subdomains

**JS Analyzer** (`js_analyzer/`)
- JavaScript file discovery via Wayback Machine and live crawling
- Secret detection with entropy-based validation
- Endpoint and dangerous pattern identification
- PRO mode includes subdomain enumeration
- Multiple report formats (JSON, HTML, Markdown)

**Subdomain Scanner** (`subdomain_scanner/`)
- Excel export feature with xlsx library
- Formula injection protection (escapes =, +, -, @, control chars)
- Toast notifications for export feedback
- Export button visibility: only after scan completion with results

### AI Security Knowledge Base
Educational content covering AI/LLM security fundamentals:
- **Overview** (`/ai-security-overview`): Introduction to LLMs, real-world use cases, why traditional security isn't enough, initial security assessment checklist
- **Architecture** (`/ai-security-anatomy`): How AI applications work, system vs user prompts, RAG, trust boundaries, defensive architecture patterns, configuration checklist
- **Threat Modeling** (`/ai-security-threat-modeling`): AI attack surface, prompt/data/tool threats, threat detection & response playbook, red team testing techniques
- **OWASP Top 10** (`/ai-security-owasp-top10`): LLM-01 through LLM-10 risks, quick mitigation reference, pre-deployment security checklist
- **Testing Prompts** (`/ai-security-prompts`): 20 AI/LLM vulnerability categories with practical test cases

### AI Security Testing Prompts
Complete AI Security Testing Library with 20 vulnerability categories:
1. Prompt Injection - Direct instruction override attacks
2. Indirect Prompt Injection - Malicious instructions in external documents
3. System Prompt Leakage - Extracting hidden instructions
4. Jailbreak Attacks - Character roleplay bypass
5. Role Confusion - Instruction hierarchy bypass
6. Training Data Leakage - Memorized data extraction
7. Sensitive Info Disclosure - Cross-user data leakage
8. Hallucination Exploitation - Weaponizing false information
9. Insecure Output Handling - AI output injection attacks
10. RAG Poisoning - Knowledge base manipulation
11. Vector Database Manipulation - Embedding attacks
12. Tool/Function Call Abuse - Manipulating agent tools
13. Agent Privilege Escalation - Unauthorized privilege use
14. Excessive Autonomy - Uncontrolled AI actions
15. Model Abuse - Generating malicious content at scale
16. Insecure AI API Usage - API key exposure
17. Rate Limit & Cost Abuse - API cost exhaustion
18. Model Extraction - Query-based model stealing
19. Cross-Session Memory Leakage - Persistent memory issues
20. AI Supply Chain - Model poisoning risks

Each prompt includes: Title, Summary, Steps to Find the Bug, Expected Outcome, Positive Test (vulnerable behavior), Negative Test (secure behavior).

### Responsive Design
All AI Security pages are fully responsive with:
- Mobile-first breakpoints (sm: 640px, md: 768px, lg: 1024px)
- Flexible sidebar with `ml-0 lg:ml-64` for mobile overlay support
- Scalable typography and icons across screen sizes
- Touch-friendly button sizing (min px-3 py-2)
- Grid layouts that adapt from 1 to 2+ columns
- Overflow handling for code blocks and long content

### AI Security Labs
Interactive hands-on training environments at `/ai-security-labs`:
- **Lab 1: The Helpful Chatbot That Talks Too Much** (LLM-01: Prompt Injection) - Extract hidden system instructions through multi-turn manipulation
- **Lab 2: Roleplay Gone Wrong** (LLM-01: Jailbreak) - Weaken AI safety guardrails through creative roleplay, track resistance scores
- **Lab 3: The Secret That Never Existed** (LLM-06: Hallucination) - Investigate AI fabrication of sensitive information
- **Lab 4: Are You Really an Admin?** (LLM-08: Excessive Agency) - Test authorization bypass in AI with privileged actions
- **Lab 5: When Documents Lie** (LLM-03: RAG Poisoning) - Observe how malicious documents override authentic policies

Lab Features:
- Beginner mode with hints, Pro mode for experts
- Real-time security event monitoring with Investigation Panel
- Trust boundary visualization
- OWASP LLM Top 10 mapping
- Progress tracking persisted to localStorage
- Simulated AI responses only (no real APIs)

Shared Components (`pages/ai-security-labs/components/`):
- ChatSimulator: Multi-turn conversation interface
- InvestigationPanel: Real-time security state monitoring
- LabContainer: Scenario/goal display with completion tracking
- ModeToggle: Beginner/Pro difficulty switch

Future phases will add automation tools (LLMGuard integration).

### AI Content Generation
- OpenAI integration for generating vulnerability educational content
- GPT-5 model for enhanced reasoning capabilities
- Custom hooks pattern (`useVulnerabilityContentGenerator`) for React integration
- Service layer under `src/services/openai/` with dedicated error handling
- 40% theory / 60% practical content approach

### Live Exploit Sandbox
- Interactive practice environment for security researchers
- Three scenario types: XSS Playground, SQL Injection Lab, IDOR Challenge
- Beginner and Pro modes with separate progress tracking
- Simulated network delays and error conditions for realistic testing

### Design Patterns
- Hooks-based architecture for reusable frontend logic
- Service layer separation for external API calls
- CSS custom properties for design tokens (colors, spacing)
- Dataclass-based models for Python backend entities
- Async/await patterns for concurrent operations

## Project Structure

### Frontend Pages (`src/pages/`)
- `homepage/` - Platform landing page
- `vulnerabilities-overview/` - Main vulnerability hub
- `xss/` - Cross-Site Scripting details
- `sql-injection/` - SQL Injection details
- `crlf-injection/` - CRLF Injection details
- `idor/` - Insecure Direct Object Reference details
- `dependency-confusion/` - Supply chain attack details
- `otp-bypass/` - OTP Bypass details
- `otp-bypass-hub/` - OTP Bypass learning hub
- `payload-vault/` - Payload repository
- `live-exploit-sandbox/` - Interactive practice environment
- `cve-scanner/` - CVE scanning interface
- `subdomain-scanner/` - Subdomain enumeration tool
- `js-analyzer/` - JavaScript analysis tool
- `ai-security-overview/` - AI Security introduction
- `ai-security-anatomy/` - AI Architecture
- `ai-security-threat-modeling/` - AI Threat Modeling
- `ai-security-owasp-top10/` - OWASP Top 10 for LLMs
- `ai-security-prompts/` - AI Testing Prompts
- `ai-security-labs/` - Interactive AI Security Labs

### Shared Components (`src/components/`)
- `shared/` - Reusable components (ModeToggle, EmptyState, RelatedVulnerabilities, SeverityBadge)
- `navigation/` - Sidebar, Breadcrumb, GlobalSearch
- `ui/` - Base UI components

### Naming Conventions
- **Directories**: kebab-case (e.g., `sql-injection`, `ai-security-labs`)
- **Components**: PascalCase (e.g., `PayloadCard.jsx`, `ModeToggle.jsx`)
- **Routes**: kebab-case matching directory names (e.g., `/xss`, `/sql-injection`)
- **Shared components**: Used across pages, imported from `components/shared/`
- **Page-specific components**: Stored in `pages/<page-name>/components/`

## External Dependencies

### Frontend Services
- **OpenAI API**: AI-powered vulnerability content generation (requires `VITE_OPENAI_API_KEY`)
- **Google Fonts**: Inter, JetBrains Mono, Fira Code, Source Code Pro

### Backend Services
- **PostgreSQL Database**: Primary data store (requires `DATABASE_URL`)
- **ProjectDiscovery Nuclei**: CVE template scanning engine
- **crt.sh**: Certificate Transparency log queries
- **Wayback Machine CDX API**: Historical URL discovery
- **CommonCrawl Index API**: Web archive data access

### External APIs Used
- Certificate Transparency: `https://crt.sh`
- Wayback Machine: `https://web.archive.org/cdx/search/cdx`
- CommonCrawl: `https://index.commoncrawl.org`
- Nuclei Templates: `https://github.com/projectdiscovery/nuclei-templates`

### Python Dependencies
- FastAPI, uvicorn (web framework)
- SQLAlchemy (ORM)
- dnspython (DNS resolution)
- aiohttp (async HTTP client)
- BeautifulSoup (HTML parsing)

### JavaScript Dependencies
- React 18, Redux Toolkit, React Router v6
- TailwindCSS, Framer Motion
- OpenAI SDK, Axios, D3.js, Recharts