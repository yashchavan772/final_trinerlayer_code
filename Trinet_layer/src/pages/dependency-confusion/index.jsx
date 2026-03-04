import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityHeader from './components/VulnerabilityHeader';
import TheorySection from './components/TheorySection';
import PracticalScenario from './components/PracticalScenario';
import DetectionChecklist from './components/DetectionChecklist';
import PoCSection from './components/PoCSection';
import CommonVectors from './components/CommonVectors';
import ImpactAnalysis from './components/ImpactAnalysis';
import PreventionMethods from './components/PreventionMethods';
import CommonMistakes from './components/CommonMistakes';
import { RelatedVulnerabilities, ModeToggle } from '../../components/shared';

const DependencyConfusionVulnerabilityDetails = () => {
  const [isProMode, setIsProMode] = useState(false);

  const theoryContent = {
    definition: "Dependency Confusion (also known as Substitution Attack) is a supply chain vulnerability that exploits the way package managers resolve dependencies from multiple sources. When an application uses private internal packages, attackers can publish malicious packages with the same names to public repositories. If the package manager prioritizes public packages or doesn't properly authenticate private registries, it may download and execute the attacker's malicious code instead of the legitimate internal package.",
    
    howItWorks: [
      {
        step: "1. Discovery",
        description: "Attacker discovers internal package names used by target organization (through leaked package.json, job postings, GitHub repos, or build logs)"
      },
      {
        step: "2. Publication",
        description: "Attacker publishes malicious package to public registry (npm, PyPI, RubyGems) using discovered internal package name with higher version number"
      },
      {
        step: "3. Resolution Confusion",
        description: "Build system or developer installs dependencies. Package manager checks both private and public registries, finds higher version on public registry"
      },
      {
        step: "4. Malicious Execution",
        description: "Package manager downloads and installs attacker's public package. Installation scripts execute arbitrary code during npm install, pip install, etc."
      }
    ],

    packageManagers: [
      {
        name: "npm (Node.js)",
        defaultBehavior: "Checks npmjs.com by default. Scoped packages (@company/package) are more secure but unscoped packages are vulnerable.",
        vulnerability: "High - Many projects use unscoped internal packages"
      },
      {
        name: "PyPI (Python)",
        defaultBehavior: "Always checks PyPI first. Private package indexes are checked after public PyPI unless explicitly configured.",
        vulnerability: "Critical - setup.py executes during installation"
      },
      {
        name: "RubyGems (Ruby)",
        defaultBehavior: "Checks rubygems.org by default. Can be configured for private gems but often misconfigured.",
        vulnerability: "High - Gemfile allows arbitrary code execution"
      },
      {
        name: "Maven (Java)",
        defaultBehavior: "Checks Maven Central. Organizations often use Nexus/Artifactory but still check public repos.",
        vulnerability: "Medium - POM files can execute code via plugins"
      },
      {
        name: "NuGet (.NET)",
        defaultBehavior: "Checks nuget.org. Private feeds can be added but resolution order matters.",
        vulnerability: "Medium - Install scripts can execute PowerShell"
      }
    ],

    whyItHappens: [
      "Internal package names not reserved on public registries",
      "Package managers prioritize higher version numbers regardless of source",
      "Build systems configured to check public registries before private ones",
      "Lack of package source verification and integrity checks",
      "Developers using loose version constraints (*, latest, or ranges)",
      "No monitoring for unexpected dependency downloads from public registries"
    ]
  };

  const realWorldScenarios = [
    {
      title: "CI/CD Pipeline Compromise via npm",
      context: "Enterprise using internal npm package \'company-api-client\' version 1.2.3 in microservices build pipeline",
      attackVector: "Attacker discovers package name from leaked package.json on GitHub. Publishes malicious \'company-api-client\' version 9.9.9 to npmjs.com with install script that exfiltrates AWS credentials from environment variables.",
      exploitation: "Build pipeline runs 'npm install' without --registry flag. npm finds version 9.9.9 on public registry (higher than internal 1.2.3), downloads and executes malicious package. Install script sends AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to attacker's server.",
      impact: "Complete AWS infrastructure compromise. Attacker gains access to production databases, S3 buckets, and can deploy malicious containers. Data breach affecting 500,000+ customer records. Estimated damage: $2.5M in incident response, legal fees, and regulatory fines.",
      detection: "Detected 3 weeks later when unusual EC2 instances mining cryptocurrency appeared in AWS bill. Forensics revealed dependency confusion attack originated from build server."
    },
    {
      title: "Python Supply Chain Attack on Financial Services",
      context: "Banking application using internal Python package \'bank-crypto-utils\' for encryption operations in transaction processing",
      attackVector: "Disgruntled ex-employee knows internal package names. Publishes malicious 'bank-crypto-utils' version 3.0.0 to PyPI with backdoored cryptographic functions that leak private keys.",
      exploitation: "Developer runs 'pip install -r requirements.txt' on fresh machine. PyPI package installed instead of internal version. setup.py exfiltrates source code and database credentials during installation. Backdoor in crypto functions sends transaction private keys to attacker.",
      impact: "Fraudulent transactions totaling $8.7M before detection. Private keys used to authorize wire transfers to offshore accounts. Complete re-architecture of cryptographic infrastructure required. 6-month project to rotate all keys and certificates.",
      detection: "Discovered when security team noticed unexpected outbound connections to unknown IP addresses from transaction processing servers. Binary analysis revealed backdoored crypto implementation."
    },
    {
      title: "Corporate Intellectual Property Theft via RubyGems",
      context: "Software company with proprietary algorithms in internal gem \'ml-forecasting-engine\' used across data science team",
      attackVector: "Competitor conducts reconnaissance via LinkedIn job postings mentioning gem name. Publishes malicious \'ml-forecasting-engine\' version 5.0.0 to rubygems.org with post-install hook that uploads entire project directory to attacker\'s S3 bucket.",
      exploitation: "Data scientist installs dependencies for new project using 'bundle install'. Gemfile doesn't specify private source explicitly. Bundler downloads public gem. Post-install script compresses and uploads source code including proprietary ML models, training data, and API keys.",
      impact: "Theft of 3 years of proprietary machine learning research. Competitor launches competing product 6 months earlier than expected. Trade secret lawsuit filed but source code already disseminated. Estimated competitive advantage loss: $15M+ over 5 years.",
      detection: "Security team detected large outbound data transfer during off-hours from data scientist\'s workstation. Investigation revealed compromised gem was the source."
    }
  ];

  const detectionChecklist = [
    {
      category: "Package Name Security",
      checks: [
        {
          question: "Are all internal package names registered/reserved on public registries?",
          critical: true,
          guidance: "Register package names on npm, PyPI, RubyGems even if not publishing. Use placeholder packages or namespace squatting to prevent attacks."
        },
        {
          question: "Do we use scoped packages (@company/package) instead of unscoped names?",
          critical: true,
          guidance: "Scoped packages in npm provide inherent protection. Migrate all internal packages to scoped format."
        },
        {
          question: "Are package names predictable or follow company branding patterns?",
          critical: false,
          guidance: "Avoid obvious patterns like \'company-toolname\'. Makes internal packages easy to guess and target."
        }
      ]
    },
    {
      category: "Build & Deployment Configuration",
      checks: [
        {
          question: "Do builds allow downloading from public registries by default?",
          critical: true,
          guidance: "Configure package managers to only check private registries first or block public registry access entirely in production builds."
        },
        {
          question: "Are dependency versions loosely defined (*, latest, or broad ranges)?",
          critical: true,
          guidance: "Use exact versions or narrow ranges. Implement lockfiles (package-lock.json, Pipfile.lock, Gemfile.lock) and commit to version control."
        },
        {
          question: "Do CI/CD pipelines install dependencies without registry restrictions?",
          critical: true,
          guidance: "Add --registry or --index-url flags to explicitly specify private registry. Disable fallback to public registries in CI/CD."
        }
      ]
    },
    {
      category: "Monitoring & Detection",
      checks: [
        {
          question: "Is there monitoring for unexpected dependency downloads from public registries?",
          critical: true,
          guidance: "Implement logging and alerting for package installations from public sources. Review logs regularly for anomalies."
        },
        {
          question: "Are build logs reviewed for external package pulls?",
          critical: false,
          guidance: "Automated log analysis to detect when packages are downloaded from unexpected sources. Flag version mismatches."
        },
        {
          question: "Do we have integrity checks (checksums/hashes) for internal packages?",
          critical: true,
          guidance: "Use subresource integrity (SRI) hashes or package signing to verify authenticity of installed packages."
        }
      ]
    },
    {
      category: "Access Control",
      checks: [
        {
          question: "Are private package registries properly authenticated?",
          critical: true,
          guidance: "Require authentication tokens for private registry access. Rotate credentials regularly. Use environment variables, never hardcode."
        },
        {
          question: "Can developers bypass private registry configuration easily?",
          critical: true,
          guidance: "Enforce registry configuration through .npmrc, pip.conf, or Gemfile. Use organization-wide config management."
        },
        {
          question: "Are service accounts for build systems using least privilege?",
          critical: false,
          guidance: "Build system credentials should only access necessary private packages, not have admin rights."
        }
      ]
    }
  ];

  const pocExamples = [
    {
      packageManager: "npm (Node.js)",
      vulnerability: "Unscoped package name confusion",
      payload: `{
  "name": "company-utils",
  "version": "99.9.9",
  "description": "Dependency Confusion PoC - Educational Only",
  "scripts": {
    "preinstall": "echo '[DEPENDENCY CONFUSION] Package: company-utils'",
    "install": "node -e \\"console.log('[DEPENDENCY CONFUSION] Install script executed');\\"",
    "postinstall": "echo '[DEPENDENCY CONFUSION] This proves package was installed from public npm'"
  },
  "keywords": ["security", "poc", "dependency-confusion"],
  "author": "Security Researcher",
  "license": "MIT"
}`,
      explanation: "Version 99.9.9 is intentionally higher than any internal version. Install scripts execute automatically during 'npm install', proving code execution. Safe PoC only logs messages, but real attacks could exfiltrate environment variables, source code, or inject backdoors.",
      detection: "Monitor npm install logs for unexpected packages from npmjs.com. Check package origins in package-lock.json."
    },
    {
      packageManager: "PyPI (Python)",
      vulnerability: "setup.py arbitrary code execution",
      payload: `from setuptools import setup

# Dependency Confusion PoC - Safe demonstration
print("[DEPENDENCY CONFUSION] setup.py executing during pip install")

setup(
    name="company-ml-toolkit",
    version="999.0.0",
    description="Dependency Confusion PoC",
    install_requires=[],
    author="Security Researcher"
)`,
      explanation: "setup.py executes arbitrary Python code during \'pip install\' before user confirmation. Version 999.0.0 ensures priority over internal packages. Real attacks extract credentials from os.environ or upload source code.",
      detection: "Review pip install output for packages from pypi.org instead of internal index. Check pip.conf registry configuration."
    },
    {
      packageManager: "RubyGems",
      vulnerability: "Gemfile post-install hooks",
      payload: `Gem::Specification.new do |s|
  s.name        = 'company-api-wrapper'
  s.version     = '100.0.0'
  s.summary     = 'Dependency Confusion PoC'
  s.description = 'Educational demonstration'
  s.authors     = ['Security Researcher']
  s.files       = ['lib/company_api_wrapper.rb']
  
  # Post-install hook executes after gem installation
  s.post_install_message = <<-MSG
    [DEPENDENCY CONFUSION] Gem installed from rubygems.org
    This is a proof of concept. Real attacks could execute arbitrary code.
  MSG
end`,
      explanation: "Post-install hooks run after gem installation. Version 100.0.0 prioritized over internal gems. Real attacks use extconf.rb to execute C code or post-install scripts to exfiltrate data.",
      detection: "Check Gemfile.lock for gem sources. Ensure internal gems specify private source explicitly in Gemfile."
    }
  ];

  const commonVectors = [
    {
      environment: "CI/CD Pipelines",
      description: "Automated build systems with access to production secrets. High-value targets for attackers.",
      indicators: [
        "Build servers installing dependencies without registry restrictions",
        "Environment variables containing AWS keys, database passwords, API tokens",
        "No monitoring of build logs for external package downloads",
        "Build scripts using \'npm install\' without --registry flag"
      ],
      risk: "Critical"
    },
    {
      environment: "Developer Workstations",
      description: "Individual machines with source code access. Entry point for supply chain attacks.",
      indicators: [
        "Developers bypassing company VPN to install packages",
        "Local .npmrc or pip.conf files missing or improperly configured",
        "No centralized package management policy enforcement",
        "Developers using \'latest\' versions instead of pinned versions"
      ],
      risk: "High"
    },
    {
      environment: "Production Deployments",
      description: "Container builds and production application deployments. Direct impact on customers.",
      indicators: [
        "Dockerfiles running \'npm install\' without lockfiles",
        "Production servers pulling dependencies during deployment",
        "No package integrity verification before deployment",
        "Kubernetes pods building from source instead of pre-built images"
      ],
      risk: "Critical"
    },
    {
      environment: "Internal Tooling",
      description: "Developer tools, scripts, and automation utilities. Often overlooked security.",
      indicators: [
        "CLI tools installing global npm packages without verification",
        "Build scripts cloning and running untrusted code",
        "Internal automation using loosely defined dependency versions",
        "No security review for internal tooling dependencies"
      ],
      risk: "Medium"
    }
  ];

  const impactCategories = [
    {
      title: "Remote Code Execution",
      severity: "Critical",
      description: "Package installation scripts execute with same privileges as installer (often root in CI/CD)",
      realExamples: [
        "AWS credentials exfiltration from environment variables during npm install",
        "Database password theft from build server configuration files",
        "Backdoor injection into application source code during pip install",
        "Cryptocurrency miner deployment via gem post-install hooks"
      ],
      financialImpact: "$500K - $5M+ per incident (including incident response, forensics, remediation)"
    },
    {
      title: "Supply Chain Compromise",
      severity: "Critical",
      description: "Malicious package becomes permanent part of application, affecting all users and deployments",
      realExamples: [
        "Backdoored logging library sending customer data to attacker",
        "Modified API client stealing authentication tokens",
        "Trojanized utility function harvesting sensitive form data",
        "Compromised build tool injecting malicious code into production artifacts"
      ],
      financialImpact: "$1M - $50M+ (data breach costs, regulatory fines, reputation damage)"
    },
    {
      title: "Intellectual Property Theft",
      severity: "High",
      description: "Source code, proprietary algorithms, and trade secrets exfiltrated during package installation",
      realExamples: [
        "Competitor stealing ML models and training data via malicious Python package",
        "Corporate API keys and service credentials leaked to public GitHub",
        "Proprietary business logic reverse-engineered from exfiltrated source code",
        "Customer database schemas and query patterns extracted from repository"
      ],
      financialImpact: "$500K - $15M+ (loss of competitive advantage, legal costs, IP litigation)"
    },
    {
      title: "Regulatory & Compliance Violations",
      severity: "High",
      description: "Security breaches leading to GDPR, HIPAA, PCI-DSS, SOC 2 violations",
      realExamples: [
        "Customer PII leaked via compromised npm package (GDPR violation)",
        "Healthcare data exfiltration through malicious Python library (HIPAA breach)",
        "Payment card data theft via backdoored Node.js payment processor (PCI-DSS)",
        "SOC 2 audit failure due to inadequate supply chain security controls"
      ],
      financialImpact: "$2M - $50M+ (regulatory fines, audit costs, contract penalties, customer compensation)"
    }
  ];

  const preventionStrategies = [
    {
      category: "Developer-Level Prevention",
      strategies: [
        {
          method: "Use Scoped Packages",
          implementation: "Migrate all internal packages to scoped format: @company/package-name instead of package-name. Scoped packages on npm require authentication by default.",
          effectiveness: "90% reduction in attack surface for npm packages",
          code: `// package.json - Before (Vulnerable)
{
  "name": "company-utils",
  "dependencies": {
    "internal-api": "^1.0.0"
  }
}

// package.json - After (Secure)
{
  "name": "@company/utils",
  "dependencies": {
    "@company/internal-api": "1.0.0"
  }
}`
        },
        {
          method: "Pin Exact Versions",
          implementation: "Use exact version numbers (1.2.3) instead of ranges (^1.2.3, ~1.2.3, *, latest). Commit lockfiles to version control.",
          effectiveness: "Prevents automatic upgrades to malicious higher versions",
          code: `// package.json
{
  "dependencies": {
    "@company/api-client": "1.2.3", // Exact version
    "lodash": "4.17.21"             // Not ^4.17.21
  }
}

// Always commit package-lock.json, Pipfile.lock, Gemfile.lock`
        },
        {
          method: "Configure Private Registry First",
          implementation: "Set package manager to check private registry before public ones. Use .npmrc, pip.conf, .gemrc configuration files.",
          effectiveness: "Prevents fallback to public registries for internal packages",
          code: `# .npmrc (npm)
registry=https://registry.company.com/
@company:registry=https://registry.company.com/
//registry.company.com/:_authToken=\${NPM_TOKEN}

# pip.conf (Python)
[global]
index-url = https://pypi.company.com/simple
extra-index-url = https://pypi.org/simple

# .gemrc (Ruby)
---
:sources:
  - https://gems.company.com/
  - https://rubygems.org/`
        }
      ]
    },
    {
      category: "Security Team Implementation",
      strategies: [
        {
          method: "Reserve Internal Package Names Publicly",
          implementation: "Register all internal package names on public registries even if not publishing. Use placeholder packages to squat on namespace.",
          effectiveness: "100% prevention of public package with same name",
          code: `# Publish placeholder to npm
npm publish --access public

# Package.json for placeholder
{
  "name": "company-internal-package",
  "version": "0.0.1",
  "description": "Reserved name - not for public use",
  "repository": "https://github.com/company/reserved-names"
}`
        },
        {
          method: "Implement Dependency Firewall",
          implementation: "Use tools like Nexus, Artifactory, or Cloudsmith to proxy package registries. Block or audit all public package downloads.",
          effectiveness: "Centralized control and monitoring of all dependencies",
          code: `# Nexus configuration example
# Only allow approved public packages through proxy
# All other packages must come from internal registry

# Artifactory virtual repository
# Combines internal and filtered public repositories
# Logs all package downloads for security review`
        },
        {
          method: "Automated Dependency Scanning",
          implementation: "Use tools like Dependabot, Snyk, Socket.dev, or GitLab Dependency Scanning to detect unexpected public package downloads.",
          effectiveness: "Early detection of dependency confusion attempts",
          code: `# GitHub Actions - Dependency Review
name: Dependency Review
on: [pull_request]
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: moderate
          deny-packages: "package-name-to-block"`
        }
      ]
    },
    {
      category: "DevOps & CI/CD Hardening",
      strategies: [
        {
          method: "Restrict CI/CD Network Access",
          implementation: "Build servers should only access private package registry. Block outbound connections to public registries via firewall rules.",
          effectiveness: "Prevents CI/CD compromise via dependency confusion",
          code: `# Docker build with private registry only
docker build --build-arg NPM_TOKEN=\${NPM_TOKEN} \\
  --network=none \\
  --add-host=registry.company.com:10.0.0.5 .

# Kubernetes Pod Security Policy
apiVersion: v1
kind: Pod
spec:
  hostNetwork: false # Prevent host network access
  dnsPolicy: ClusterFirst # Use cluster DNS only`
        },
        {
          method: "Use Pre-built Base Images",
          implementation: "Create golden images with dependencies pre-installed from verified sources. Don't install packages during production deployment.",
          effectiveness: "Eliminates runtime dependency confusion risk",
          code: `# Dockerfile - Two-stage build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
# Install dependencies in build stage only
RUN npm ci --only=production --registry=https://registry.company.com

FROM node:18-alpine
WORKDIR /app
# Copy pre-installed dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY . .
# No npm install in production image`
        },
        {
          method: "Implement Package Integrity Checks",
          implementation: "Use package hashes, checksums, or signatures to verify package authenticity before installation.",
          effectiveness: "Detects tampered or substituted packages",
          code: `# npm - Subresource Integrity (SRI) hashes
{
  "dependencies": {
    "@company/api": "1.0.0"
  },
  "integrity": {
    "@company/api@1.0.0": "sha512-ABC123..."
  }
}

# Python - Hash checking mode
pip install --require-hashes -r requirements.txt

# requirements.txt with hashes
company-utils==1.0.0 \\
    --hash=sha256:abcd1234...`
        }
      ]
    }
  ];

  const commonMistakes = [
    {
      title: "Assuming Private Registry Automatically Prevents Attack",
      description: "Having a private registry doesn't prevent dependency confusion if package managers are configured to check public registries as fallback. Many organizations mistakenly believe that deploying Artifactory or Nexus alone solves the problem, but misconfigured clients will still download from public sources.",
      correctApproach: "Explicitly configure package managers to ONLY check private registry. Disable public registry fallback entirely in production environments. Use allowlist approach instead of blocklist.",
      icon: "ShieldAlert"
    },
    {
      title: "Testing Only in Development, Not CI/CD",
      description: "Developers test dependency installation on their machines with proper VPN and registry configuration, but CI/CD pipelines run in different network environments without same protections. Build servers often have direct internet access and default to public registries.",
      correctApproach: "Test entire deployment pipeline including CI/CD builds. Verify build logs show packages coming from private registry only. Implement network-level restrictions on build servers.",
      icon: "AlertCircle"
    },
    {
      title: "Using Weak or Predictable Package Names",
      description: "Internal packages named 'company-utils', 'internal-api', 'corporate-logger' are easy for attackers to guess. Job postings, GitHub repositories, and npm package names in error logs leak internal package names constantly.",
      correctApproach: "Use non-obvious names or UUIDs for critical internal packages. Implement namespace scoping (@company/random-uuid). Never mention internal package names in public documentation or job descriptions.",
      icon: "Eye"
    },
    {
      title: "Ignoring Transitive Dependencies",
      description: "Securing direct dependencies but ignoring nested/transitive dependencies. A compromised public package deep in the dependency tree can still execute malicious code during installation.",
      correctApproach: "Audit entire dependency tree with tools like npm audit, pip-audit, or bundler-audit. Use dependency-cruiser or similar tools to visualize and review all transitive dependencies. Implement Software Bill of Materials (SBOM).",
      icon: "Layers"
    },
    {
      title: "No Monitoring for Dependency Changes",
      description: "Not tracking when new dependencies are added or versions change. Supply chain attacks often succeed because nobody notices when a package suddenly appears from an unexpected source.",
      correctApproach: "Implement dependency change tracking in PR reviews. Require security approval for new dependencies or major version bumps. Use GitHub Dependabot or GitLab Dependency Scanning to alert on changes.",
      icon: "TrendingUp"
    },
    {
      title: "Trusting Public Packages with Similar Names",
      description: "Assuming packages with professional-looking names, good documentation, and high download counts are legitimate. Attackers can create convincing fake packages with stolen documentation.",
      correctApproach: "Verify package ownership and history before adding dependencies. Check package maintainer reputation. Look for verified publishers. Use package signing and integrity verification where available.",
      icon: "Shield"
    }
  ];

  const relatedVulnerabilities = [
    {
      name: "Typosquatting",
      description: "Publishing malicious packages with names similar to popular packages (e.g., 'electorn' instead of 'electron'). Exploits developer typos during package installation.",
      severity: "high",
      icon: "Type",
      path: "/vulnerabilities-overview"
    },
    {
      name: "Dependency Hijacking",
      description: "Taking over legitimate package maintainer accounts to inject malicious code into existing trusted packages. Affects all users who update to compromised version.",
      severity: "critical",
      icon: "UserX",
      path: "/vulnerabilities-overview"
    },
    {
      name: "Package Repository Poisoning",
      description: "Compromising package repository infrastructure (npm registry, PyPI servers) to inject malicious packages or modify existing ones at the source.",
      severity: "critical",
      icon: "Database",
      path: "/vulnerabilities-overview"
    },
    {
      name: "Malicious Code Injection in Dependencies",
      description: "Injecting backdoors, crypto miners, or data exfiltration code into open source dependencies. Often discovered only after widespread adoption.",
      severity: "critical",
      icon: "Code",
      path: "/vulnerabilities-overview"
    }
  ];

  const handleModeToggle = (isPro) => {
    setIsProMode(isPro);
  };

  return (
    <>
      <Helmet>
        <title>Dependency Confusion - Supply Chain Security - TrinetLayer</title>
        <meta name="description" content="Master Dependency Confusion attacks with beginner-friendly theory, real-world exploitation scenarios, PoC examples, and comprehensive detection checklist for npm, PyPI, RubyGems, and more." />
        <meta name="keywords" content="dependency confusion, supply chain attack, npm security, PyPI security, package manager vulnerability, substitution attack, internal packages, private registry security" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Sidebar />

        <main className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] overflow-x-hidden">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-[1400px] mx-auto pl-16 pr-4 md:px-6 lg:px-8 py-4 md:py-5">
              <GlobalSearch />
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            <Breadcrumb />

            <VulnerabilityHeader
              title="Dependency Confusion (Substitution Attack)"
              severity="critical"
              lastUpdated="Everyday"
            />

            {/* Mode Toggle */}
            <div className="mb-8 flex justify-end">
              <ModeToggle isProMode={isProMode} onToggle={handleModeToggle} />
            </div>

            {/* 40% Theory Section */}
            <TheorySection content={theoryContent} isProMode={isProMode} />

            {/* 60% Practical Section */}
            <div className="space-y-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-3">
                Practical Exploitation & Detection
              </h2>

              <PracticalScenario scenarios={realWorldScenarios} isProMode={isProMode} />
              
              <PoCSection examples={pocExamples} isProMode={isProMode} />

              <DetectionChecklist checklist={detectionChecklist} isProMode={isProMode} />

              <CommonVectors vectors={commonVectors} isProMode={isProMode} />

              <ImpactAnalysis impacts={impactCategories} isProMode={isProMode} />

              <PreventionMethods strategies={preventionStrategies} isProMode={isProMode} />
            </div>

            <CommonMistakes mistakes={commonMistakes} />

            {/* Disclaimer */}
            <div className="mb-8 bg-warning/10 border border-warning/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">⚠️ Legal & Ethical Disclaimer</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>This content is for educational purposes and authorized security testing only.</strong> Publishing malicious packages to public registries (npm, PyPI, RubyGems, etc.) without explicit authorization is illegal and violates Terms of Service. Such actions constitute computer fraud, unauthorized access, and supply chain tampering under laws including the Computer Fraud and Abuse Act (CFAA), GDPR, and international cybercrime statutes. Only test dependency confusion vulnerabilities in systems you own or have written authorization to test. Unauthorized testing can result in criminal prosecution, civil liability, and permanent bans from package registries. Always conduct security research responsibly within legal boundaries.
                  </p>
                </div>
              </div>
            </div>

            <RelatedVulnerabilities vulnerabilities={relatedVulnerabilities} />
          </div>
        </main>
      </div>
    </>
  );
};

export default DependencyConfusionVulnerabilityDetails;