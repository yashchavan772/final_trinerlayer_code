import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import SeverityBadge from './SeverityBadge';

const defaultVulnerabilities = [
  {
    name: 'Cross-Site Scripting (XSS)',
    icon: 'Code',
    path: '/xss',
    description: 'Inject scripts into web pages to steal sessions and hijack accounts',
    severity: 'critical'
  },
  {
    name: 'SQL Injection',
    icon: 'Database',
    path: '/sql-injection',
    description: 'Manipulate database queries to extract data and bypass auth',
    severity: 'critical'
  },
  {
    name: 'CRLF Injection',
    icon: 'FileText',
    path: '/crlf-injection',
    description: 'HTTP header injection and response splitting attacks',
    severity: 'medium'
  },
  {
    name: 'IDOR',
    icon: 'Lock',
    path: '/idor',
    description: 'Access unauthorized resources via object reference manipulation',
    severity: 'high'
  },
  {
    name: 'Dependency Confusion',
    icon: 'Package',
    path: '/dependency-confusion',
    description: 'Supply chain attacks through malicious package injection',
    severity: 'critical'
  },
  {
    name: 'OTP Bypass',
    icon: 'KeyRound',
    path: '/otp-bypass',
    description: 'Circumvent one-time password verification mechanisms',
    severity: 'high'
  }
];

const RelatedVulnerabilities = memo(({ 
  vulnerabilities,
  exclude = [],
  maxItems = 4,
  title = 'Related Vulnerabilities',
  subtitle = 'Explore connected attack vectors'
}) => {
  const items = (vulnerabilities || defaultVulnerabilities)
    .filter(v => !exclude.includes(v.path) && !exclude.includes(v.name))
    .slice(0, maxItems);

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl md:rounded-2xl p-6 md:p-8 hover:border-accent/50 hover:shadow-glow-md transition-all duration-250 ease-cyber">
      <div className="flex items-start gap-4 mb-6 md:mb-8">
        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-xl flex-shrink-0">
          <Icon name="Link" size={24} color="var(--color-accent)" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            {subtitle}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {items.map((vuln, index) => (
          <Link
            key={`${vuln.path}-${vuln.name}-${index}`}
            to={vuln.path}
            className="block bg-muted/30 border border-border rounded-lg p-4 md:p-5 hover:border-accent/50 hover:bg-muted/50 hover:shadow-glow-sm transition-all duration-250 ease-cyber group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-lg flex-shrink-0 group-hover:shadow-glow-sm transition-all duration-250">
                <Icon name={vuln.icon} size={20} color="var(--color-accent)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="text-base md:text-lg font-body font-medium text-foreground group-hover:text-accent transition-colors duration-250">
                    {vuln.name}
                  </h3>
                  <SeverityBadge severity={vuln.severity} size="xs" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-3 line-clamp-2">
                  {vuln.description}
                </p>
                <div className="flex items-center gap-2 text-accent">
                  <span className="text-xs md:text-sm font-medium">Learn more</span>
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-250" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

RelatedVulnerabilities.displayName = 'RelatedVulnerabilities';

export default RelatedVulnerabilities;
