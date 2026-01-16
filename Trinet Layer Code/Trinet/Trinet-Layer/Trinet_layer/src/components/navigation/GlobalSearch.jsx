import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const searchData = [
    {
      title: 'Home',
      path: '/homepage',
      category: 'Navigation',
      description: 'Platform overview and feature discovery',
      icon: 'Home'
    },
    {
      title: 'Vulnerabilities Overview',
      path: '/vulnerabilities-overview',
      category: 'Vulnerabilities',
      description: 'Comprehensive vulnerability research hub',
      icon: 'Shield'
    },
    {
      title: 'XSS Vulnerability',
      path: '/xss',
      category: 'Vulnerabilities',
      description: 'Cross-Site Scripting attack vectors and payloads',
      icon: 'Code'
    },
    {
      title: 'SQL Injection',
      path: '/sql-injection',
      category: 'Vulnerabilities',
      description: 'SQL Injection database exploitation techniques and payloads',
      icon: 'Database',
      keywords: ['sql', 'sqli', 'database', 'injection', 'query', 'union', 'blind', 'error-based']
    },
    {
      id: 'dependency-confusion',
      title: 'Dependency Confusion',
      description: 'Supply chain vulnerability exploiting package manager resolution to inject malicious packages',
      category: 'vulnerability',
      path: '/dependency-confusion',
      tags: ['supply-chain', 'npm', 'pypi', 'package-manager', 'critical']
    },
    {
      title: 'CRLF Injection',
      path: '/crlf-injection',
      category: 'Vulnerabilities',
      description: 'Carriage Return Line Feed injection techniques',
      icon: 'FileText'
    },
    {
      title: 'IDOR Vulnerability',
      path: '/idor',
      category: 'Vulnerabilities',
      description: 'Insecure Direct Object Reference exploits',
      icon: 'Lock'
    },
    {
      title: 'OTP Bypass',
      path: '/otp-bypass',
      category: 'Vulnerabilities',
      description: 'One-Time Password bypass techniques and authentication logic flaws',
      icon: 'KeyRound',
      keywords: ['otp', 'authentication', '2fa', 'mfa', 'bypass', 'logic flaw', 'one-time password']
    },
    {
      title: 'OTP Bypass Learning Hub',
      path: '/otp-bypass-hub',
      category: 'Learning',
      description: 'Interactive OTP bypass learning hub - beginner to elite techniques',
      icon: 'GraduationCap',
      keywords: ['otp', 'learning', 'tutorial', 'authentication', 'bypass', 'training']
    },
    {
      title: 'Payload Vault',
      path: '/payload-vault',
      category: 'Payloads',
      description: 'Centralized repository for attack payloads',
      icon: 'Database'
    },
    {
      title: 'Live Exploit Sandbox',
      path: '/live-exploit-sandbox',
      category: 'Tools',
      description: 'Practice exploits in a safe environment',
      icon: 'Terminal'
    },
    {
      title: 'CVE Scanner',
      path: '/cve-scanner',
      category: 'Tools',
      description: 'Enterprise-grade CVE vulnerability scanning',
      icon: 'Shield'
    },
    {
      title: 'Subdomain Scanner',
      path: '/subdomain-scanner',
      category: 'Tools',
      description: 'Discover subdomains using passive and active enumeration',
      icon: 'Globe'
    },
    {
      title: 'JS Analyzer',
      path: '/js-analyzer',
      category: 'Tools',
      description: 'Discover secrets, endpoints, and dangerous patterns in JavaScript files',
      icon: 'FileCode'
    },
    {
      title: 'AI Security Overview',
      path: '/ai-security-overview',
      category: 'AI Security',
      description: 'Introduction to AI & LLM Security',
      icon: 'Brain'
    },
    {
      title: 'AI Architecture',
      path: '/ai-security-anatomy',
      category: 'AI Security',
      description: 'How AI applications work from a security perspective',
      icon: 'Layers'
    },
    {
      title: 'AI Threat Modeling',
      path: '/ai-security-threat-modeling',
      category: 'AI Security',
      description: 'AI-specific threat modeling techniques',
      icon: 'Target'
    },
    {
      title: 'OWASP Top 10 (AI)',
      path: '/ai-security-owasp-top10',
      category: 'AI Security',
      description: 'OWASP Top 10 for LLM Applications',
      icon: 'Shield'
    },
    {
      title: 'AI Testing Prompts',
      path: '/ai-security-prompts',
      category: 'AI Security',
      description: 'AI/LLM security testing prompts with practical test cases',
      icon: 'Target'
    },
    {
      title: 'AI Security Labs',
      path: '/ai-security-labs',
      category: 'AI Security',
      description: 'Hands-on AI security training labs',
      icon: 'FlaskConical'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (query?.trim()?.length > 0) {
      const filtered = searchData?.filter((item) => {
        const searchQuery = query?.toLowerCase();
        const titleMatch = item?.title?.toLowerCase()?.includes(searchQuery);
        const descriptionMatch = item?.description?.toLowerCase()?.includes(searchQuery);
        const categoryMatch = item?.category?.toLowerCase()?.includes(searchQuery);
        const keywordsMatch = item?.keywords?.some(keyword => 
          keyword?.toLowerCase()?.includes(searchQuery)
        );
        
        return titleMatch || descriptionMatch || categoryMatch || keywordsMatch;
      });
      setResults(filtered);
      setSelectedIndex(0);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleKeyDown = (event) => {
    if (!isOpen || results?.length === 0) return;

    switch (event?.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results?.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results?.length) % results?.length);
        break;
      case 'Enter':
        event.preventDefault();
        if (results?.[selectedIndex]) {
          navigate(results?.[selectedIndex]?.path);
          setQuery('');
          setIsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-cyan-400/60" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search vulnerabilities, payloads, tools..."
          value={query}
          onChange={(e) => setQuery(e?.target?.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query?.trim()?.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3.5 bg-[#0d1117]/90 backdrop-blur-md border border-cyan-500/20 rounded-xl text-cyan-50 placeholder-cyan-300/40 focus:outline-none focus:bg-[#0d1117] focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:border-cyan-500/30 hover:shadow-[0_0_12px_rgba(0,234,255,0.1)] transition-all duration-300 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400/50 hover:text-cyan-300 transition-colors duration-200"
          >
            <Icon name="X" size={18} />
          </button>
        )}
      </div>

      {isOpen && results?.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {results?.map((result, index) => (
              <button
                key={result?.path}
                onClick={() => handleResultClick(result?.path)}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-accent/10 border-l-2 border-accent'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg flex-shrink-0">
                  <Icon name={result?.icon || 'File'} size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {result?.title}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {result?.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {result?.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query?.trim()?.length > 0 && results?.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-2xl p-6 text-center">
          <Icon name="SearchX" size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
