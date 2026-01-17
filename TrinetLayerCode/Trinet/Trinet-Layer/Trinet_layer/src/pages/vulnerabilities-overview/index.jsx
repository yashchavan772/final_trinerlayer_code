import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityCard from './components/VulnerabilityCard';
import FilterChip from './components/FilterChip';
import { ModeToggle, EmptyState, Logo } from '../../components/shared';
import StatsCard from './components/StatsCard';
import Icon from '../../components/AppIcon';

const VulnerabilitiesOverview = () => {
  const [mode, setMode] = useState('beginner');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeSeverityFilter, setActiveSeverityFilter] = useState('All');
  const [activeComplexityFilter, setActiveComplexityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const vulnerabilities = [
    {
      id: 1,
      type: "Cross-Site Scripting (XSS)",
      icon: "Code",
      severity: "Critical",
      complexity: "Medium",
      descriptionSimple: "XSS allows attackers to inject malicious scripts into web pages viewed by other users, potentially stealing sensitive information or performing actions on their behalf.",
      descriptionAdvanced: "Cross-Site Scripting vulnerabilities enable injection of client-side scripts into web applications, bypassing same-origin policy and executing arbitrary JavaScript in victim browsers.",
      payloadCount: 75,
      targetCount: 3,
      trend: "Reflected, Stored, DOM",
      detailPath: "/xss",
      isNew: false
    },
    {
      id: 2,
      type: "CRLF Injection",
      icon: "FileText",
      severity: "High",
      complexity: "Low",
      descriptionSimple: "CRLF injection exploits improper handling of line breaks in HTTP headers, allowing attackers to manipulate server responses and inject malicious content.",
      descriptionAdvanced: "Carriage Return Line Feed injection leverages improper input sanitization in HTTP response headers, enabling HTTP response splitting, cache poisoning, and XSS attacks.",
      payloadCount: 12,
      targetCount: 3,
      trend: "Header, Response, Cache",
      detailPath: "/crlf-injection",
      isNew: true
    },
    {
      id: 3,
      type: "Insecure Direct Object Reference (IDOR)",
      icon: "Lock",
      severity: "Critical",
      complexity: "Low",
      descriptionSimple: "IDOR vulnerabilities occur when applications expose direct references to internal objects, allowing unauthorized access to sensitive data by manipulating parameters.",
      descriptionAdvanced: "IDOR exploits insufficient authorization checks on object references, enabling horizontal and vertical privilege escalation through parameter manipulation.",
      payloadCount: 27,
      targetCount: 4,
      trend: "Param, Enum, API, Priv",
      detailPath: "/idor",
      isNew: false
    },
    {
      id: 4,
      type: "SQL Injection",
      icon: "Database",
      severity: "Critical",
      complexity: "Medium",
      descriptionSimple: "SQL injection allows attackers to interfere with database queries, potentially accessing, modifying, or deleting sensitive data stored in the application's database.",
      descriptionAdvanced: "SQL injection exploits inadequate input validation to inject malicious SQL statements, enabling database enumeration, data exfiltration, and authentication bypass.",
      payloadCount: 104,
      targetCount: 5,
      trend: "Union, Boolean, Time, Error, Stack",
      detailPath: "/sql-injection",
      isNew: false
    },
    {
      id: 5,
      type: "OTP Bypass",
      icon: "KeyRound",
      severity: "High",
      complexity: "Medium",
      descriptionSimple: "OTP bypass vulnerabilities exploit logic flaws in authentication mechanisms that rely on temporary codes for verification.",
      descriptionAdvanced: "OTP bypass exploits improper validation of one-time passwords, session binding flaws, and rate limiting weaknesses to gain unauthorized access.",
      payloadCount: 22,
      targetCount: 4,
      trend: "Reuse, Skip, Rate, Response",
      detailPath: "/otp-bypass",
      isNew: true
    },
    {
      id: 6,
      type: "Dependency Confusion",
      icon: "Package",
      severity: "Critical",
      complexity: "High",
      descriptionSimple: "Dependency confusion exploits package manager resolution to substitute malicious packages for internal dependencies.",
      descriptionAdvanced: "Supply chain attacks targeting package managers by publishing malicious packages with same names as internal packages to public registries.",
      payloadCount: 3,
      targetCount: 5,
      trend: "npm, PyPI, RubyGems, Maven, NuGet",
      detailPath: "/dependency-confusion",
      isNew: true
    },
    {
      id: 7,
      type: "Server-Side Request Forgery (SSRF)",
      icon: "Server",
      severity: "High",
      complexity: "High",
      descriptionSimple: "SSRF vulnerabilities allow attackers to make the server perform requests to unintended locations, potentially accessing internal systems or sensitive data.",
      descriptionAdvanced: "SSRF exploits server-side URL fetching mechanisms to bypass network segmentation, access internal services, and perform port scanning on internal infrastructure.",
      payloadCount: 0,
      targetCount: 0,
      trend: "Coming soon",
      detailPath: "/vulnerabilities-overview",
      isNew: false
    },
    {
      id: 8,
      type: "Cross-Site Request Forgery (CSRF)",
      icon: "Shield",
      severity: "Medium",
      complexity: "Low",
      descriptionSimple: "CSRF tricks authenticated users into performing unwanted actions on web applications where they're currently authenticated, without their knowledge or consent.",
      descriptionAdvanced: "CSRF exploits the trust that a web application has in the user's browser, forcing authenticated users to execute state-changing requests without proper validation.",
      payloadCount: 0,
      targetCount: 0,
      trend: "Coming soon",
      detailPath: "/vulnerabilities-overview",
      isNew: false
    },
    {
      id: 9,
      type: "Local File Inclusion (LFI)",
      icon: "FolderOpen",
      severity: "High",
      complexity: "Medium",
      descriptionSimple: "LFI vulnerabilities allow attackers to include files from the local server, potentially exposing sensitive configuration files or executing malicious code.",
      descriptionAdvanced: "Local File Inclusion exploits improper input validation in file inclusion mechanisms, enabling arbitrary file reading and potential remote code execution through log poisoning.",
      payloadCount: 0,
      targetCount: 0,
      trend: "Coming soon",
      detailPath: "/vulnerabilities-overview",
      isNew: false
    }
  ];

  const stats = [
    {
      icon: "Shield",
      label: "Vulnerability Types",
      value: "6",
      trend: "up",
      trendValue: "with payloads",
      color: "var(--color-accent)"
    },
    {
      icon: "Code",
      label: "Total Payloads",
      value: "243",
      trend: "up",
      trendValue: "verified",
      color: "var(--color-accent-green)"
    },
    {
      icon: "Database",
      label: "Payload Vault",
      value: "112",
      trend: "up",
      trendValue: "curated",
      color: "var(--color-warning)"
    },
    {
      icon: "TrendingUp",
      label: "Critical Issues",
      value: "3",
      trend: "up",
      trendValue: "XSS, SQLi, DC",
      color: "var(--color-error)"
    }
  ];

  const typeFilters = [
    { label: 'All', count: vulnerabilities?.length },
    { label: 'XSS', count: vulnerabilities?.filter(v => v?.type?.includes('XSS'))?.length },
    { label: 'Injection', count: vulnerabilities?.filter(v => v?.type?.includes('Injection') || v?.type?.includes('SQL'))?.length },
    { label: 'IDOR', count: vulnerabilities?.filter(v => v?.type?.includes('IDOR'))?.length },
    { label: 'SSRF', count: vulnerabilities?.filter(v => v?.type?.includes('SSRF'))?.length },
    { label: 'RCE', count: vulnerabilities?.filter(v => v?.type?.includes('RCE'))?.length }
  ];

  const severityFilters = [
    { label: 'All', count: vulnerabilities?.length },
    { label: 'Critical', count: vulnerabilities?.filter(v => v?.severity === 'Critical')?.length },
    { label: 'High', count: vulnerabilities?.filter(v => v?.severity === 'High')?.length },
    { label: 'Medium', count: vulnerabilities?.filter(v => v?.severity === 'Medium')?.length },
    { label: 'Low', count: vulnerabilities?.filter(v => v?.severity === 'Low')?.length }
  ];

  const complexityFilters = [
    { label: 'All', count: vulnerabilities?.length },
    { label: 'Low', count: vulnerabilities?.filter(v => v?.complexity === 'Low')?.length },
    { label: 'Medium', count: vulnerabilities?.filter(v => v?.complexity === 'Medium')?.length },
    { label: 'High', count: vulnerabilities?.filter(v => v?.complexity === 'High')?.length }
  ];

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities?.filter(vuln => {
      const matchesType = activeTypeFilter === 'All' || 
        vuln?.type?.toLowerCase()?.includes(activeTypeFilter?.toLowerCase());
      const matchesSeverity = activeSeverityFilter === 'All' || 
        vuln?.severity === activeSeverityFilter;
      const matchesComplexity = activeComplexityFilter === 'All' || 
        vuln?.complexity === activeComplexityFilter;
      const matchesSearch = searchQuery === '' || 
        vuln?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        vuln?.descriptionSimple?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        vuln?.descriptionAdvanced?.toLowerCase()?.includes(searchQuery?.toLowerCase());

      return matchesType && matchesSeverity && matchesComplexity && matchesSearch;
    });
  }, [activeTypeFilter, activeSeverityFilter, activeComplexityFilter, searchQuery, vulnerabilities]);

  const handleResetFilters = () => {
    setActiveTypeFilter('All');
    setActiveSeverityFilter('All');
    setActiveComplexityFilter('All');
    setSearchQuery('');
  };

  return (
    <>
      <Helmet>
        <title>Vulnerabilities Overview - Trinet_Layer</title>
        <meta name="description" content="Browse and filter comprehensive vulnerability information for security research and bug hunting" />
      </Helmet>
      <div className="flex min-h-screen bg-background overflow-x-hidden">
        <Sidebar />

        <main className="flex-1 lg:ml-[280px] lg:w-[calc(100%-280px)] overflow-x-hidden">
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="pl-16 pr-4 md:px-6 lg:px-8 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Breadcrumb />
                  <ModeToggle mode={mode} onToggle={setMode} />
                </div>
                <GlobalSearch />
              </div>
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
                {stats?.map((stat) => (
                  <StatsCard key={stat?.label} {...stat} />
                ))}
              </div>

              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    Vulnerability Database
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                      {filteredVulnerabilities?.length} results
                    </span>
                  </div>
                </div>

                <div className="mb-4 md:mb-6">
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
                      Type
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {typeFilters?.map((filter) => (
                        <FilterChip
                          key={filter?.label}
                          label={filter?.label}
                          count={filter?.count}
                          isActive={activeTypeFilter === filter?.label}
                          onClick={() => setActiveTypeFilter(filter?.label)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
                      Severity
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {severityFilters?.map((filter) => (
                        <FilterChip
                          key={filter?.label}
                          label={filter?.label}
                          count={filter?.count}
                          isActive={activeSeverityFilter === filter?.label}
                          onClick={() => setActiveSeverityFilter(filter?.label)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
                      Complexity
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {complexityFilters?.map((filter) => (
                        <FilterChip
                          key={filter?.label}
                          label={filter?.label}
                          count={filter?.count}
                          isActive={activeComplexityFilter === filter?.label}
                          onClick={() => setActiveComplexityFilter(filter?.label)}
                        />
                      ))}
                    </div>
                  </div>

                  {(activeTypeFilter !== 'All' || activeSeverityFilter !== 'All' || activeComplexityFilter !== 'All') && (
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      <Icon name="X" size={14} className="sm:w-4 sm:h-4" />
                      Reset Filters
                    </button>
                  )}
                </div>

                {filteredVulnerabilities?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                    {filteredVulnerabilities?.map((vuln) => (
                      <VulnerabilityCard key={vuln?.id} vulnerability={vuln} mode={mode} />
                    ))}
                  </div>
                ) : (
                  <EmptyState onReset={handleResetFilters} />
                )}
              </div>
            </div>
          </div>

          <footer className="border-t border-border mt-12 md:mt-16">
            <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="footer-logo w-10 h-10 flex items-center justify-center">
                    <Logo size={40} className="logo-svg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">TrinetLayer</p>
                    <p className="text-xs text-muted-foreground font-normal">Security Research Platform</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-normal">
                  &copy; {new Date()?.getFullYear()} Trinet_Layer. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default VulnerabilitiesOverview;