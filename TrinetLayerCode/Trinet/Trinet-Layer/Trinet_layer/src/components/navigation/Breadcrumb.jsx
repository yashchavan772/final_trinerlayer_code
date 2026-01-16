import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location?.pathname?.split('/')?.filter((x) => x);

  const breadcrumbMap = {
    'homepage': 'Home',
    'vulnerabilities-overview': 'Vulnerabilities',
    'xss': 'XSS Details',
    'crlf-injection': 'CRLF Injection',
    'idor': 'IDOR Details',
    'sql-injection': 'SQL Injection',
    'dependency-confusion': 'Dependency Confusion',
    'otp-bypass': 'OTP Bypass',
    'otp-bypass-hub': 'OTP Bypass Hub',
    'payload-vault': 'Payload Vault',
    'live-exploit-sandbox': 'Live Sandbox',
    'cve-scanner': 'CVE Scanner',
    'subdomain-scanner': 'Subdomain Scanner',
    'js-analyzer': 'JS Analyzer',
    'ai-security-overview': 'AI Security',
    'ai-security-anatomy': 'AI Architecture',
    'ai-security-threat-modeling': 'Threat Modeling',
    'ai-security-owasp-top10': 'OWASP Top 10',
    'ai-security-prompts': 'Testing Prompts',
    'ai-security-labs': 'AI Labs'
  };

  const getBreadcrumbLabel = (path) => {
    return breadcrumbMap?.[path] || path?.split('-')?.map(word => 
      word?.charAt(0)?.toUpperCase() + word?.slice(1)
    )?.join(' ');
  };

  if (pathnames?.length === 0 || pathnames?.[0] === 'homepage') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb py-4">
      <Link
        to="/homepage"
        className="breadcrumb-item"
        aria-label="Navigate to home"
      >
        <Icon name="Home" size={16} />
        <span>Home</span>
      </Link>
      {pathnames?.map((path, index) => {
        const routeTo = `/${pathnames?.slice(0, index + 1)?.join('/')}`;
        const isLast = index === pathnames?.length - 1;
        const label = getBreadcrumbLabel(path);

        return (
          <React.Fragment key={routeTo}>
            <span className="breadcrumb-separator">
              <Icon name="ChevronRight" size={16} />
            </span>
            {isLast ? (
              <span className="breadcrumb-item text-accent" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={routeTo} className="breadcrumb-item">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
