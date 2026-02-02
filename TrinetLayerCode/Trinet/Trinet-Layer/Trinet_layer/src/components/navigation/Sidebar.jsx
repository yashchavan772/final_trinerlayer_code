import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../AppIcon';
import { Logo } from '../shared';

const Sidebar = ({ isCollapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Home',
      path: '/homepage',
      icon: 'Home',
      tooltip: 'Platform overview and feature discovery'
    },
    {
      label: 'Vulnerabilities',
      path: '/vulnerabilities-overview',
      icon: 'Shield',
      tooltip: 'Comprehensive vulnerability research hub',
      children: [
        {
          label: 'XSS',
          path: '/xss',
          icon: 'Code',
          tooltip: 'Cross-Site Scripting vulnerability information'
        },
        {
          label: 'SQL Injection',
          path: '/sql-injection',
          icon: 'Database',
          tooltip: 'SQL Injection attack vectors and database exploitation'
        },
        {
          label: 'CRLF Injection',
          path: '/crlf-injection',
          icon: 'FileText',
          tooltip: 'CRLF Injection attack vectors'
        },
        {
          label: 'IDOR',
          path: '/idor',
          icon: 'Lock',
          tooltip: 'Insecure Direct Object Reference vulnerabilities'
        },
        {
          label: 'Dependency Confusion',
          path: '/dependency-confusion',
          icon: 'Package',
          badge: 'Critical'
        },
        {
          label: 'OTP Bypass',
          path: '/otp-bypass-hub',
          icon: 'KeyRound',
          tooltip: 'OTP Bypass & Authentication Logic Flaws Learning Hub'
        }
      ]
    },
    {
      label: 'Payload Vault',
      path: '/payload-vault',
      icon: 'Database',
      tooltip: 'Centralized repository for attack payloads'
    },
    {
      label: 'Live Sandbox',
      path: '/live-exploit-sandbox',
      icon: 'Terminal',
      tooltip: 'Practice exploits in a safe environment',
      badge: 'New'
    },
    {
      label: 'Subdomain Scanner',
      path: '/subdomain-scanner',
      icon: 'Globe',
      tooltip: 'Discover subdomains using passive and active enumeration',
      badge: 'New'
    },
    {
      label: 'JS Analyzer',
      path: '/js-analyzer',
      icon: 'FileCode',
      tooltip: 'Discover secrets, endpoints, and dangerous patterns in JavaScript files',
      badge: 'New'
    },
    {
      label: 'AI Security',
      path: '/ai-security-overview',
      icon: 'Brain',
      tooltip: 'AI & LLM Security fundamentals and OWASP Top 10',
      badge: 'New',
      children: [
        {
          label: 'Overview',
          path: '/ai-security-overview',
          icon: 'BookOpen',
          tooltip: 'Introduction to AI & LLM Security'
        },
        {
          label: 'Architecture',
          path: '/ai-security-anatomy',
          icon: 'Layers',
          tooltip: 'How AI applications work from a security perspective'
        },
        {
          label: 'Threat Modeling',
          path: '/ai-security-threat-modeling',
          icon: 'Target',
          tooltip: 'AI-specific threat modeling techniques'
        },
        {
          label: 'OWASP Top 10 (AI)',
          path: '/ai-security-owasp-top10',
          icon: 'Shield',
          tooltip: 'OWASP Top 10 for LLM Applications'
        },
        {
          label: 'Testing Prompts',
          path: '/ai-security-prompts',
          icon: 'Target',
          tooltip: 'AI/LLM security testing prompts with practical test cases'
        },
        {
          label: 'AI Labs',
          path: '/ai-security-labs',
          icon: 'FlaskConical',
          tooltip: 'Hands-on AI security training labs',
          badge: 'New'
        }
      ]
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button - Mobile Only */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[350] lg:hidden w-11 h-11 flex items-center justify-center bg-surface border border-border rounded-lg transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md active:scale-95"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <Icon name={isOpen ? 'X' : 'Menu'} size={24} color="var(--color-accent)" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? '' : '-translate-x-full lg:translate-x-0'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header group">
          <div className="sidebar-logo-container">
            <div className="sidebar-logo-glow"></div>
            <div className="sidebar-logo">
              <Logo size={40} className="logo-svg" />
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1 gap-0.5">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              TrinetLayer
            </h1>
            <span className="text-[10px] sm:text-xs font-medium text-accent uppercase tracking-widest opacity-80">
              Attack Surface Lab
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems?.map((item) => (
            <div key={item?.path}>
              <NavLink
                to={item?.path}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                title={item?.tooltip}
                onClick={closeSidebar}
              >
                <Icon name={item?.icon} size={20} className="flex-shrink-0" />
                <span className="flex-1 truncate">{item?.label}</span>
              </NavLink>

              {item?.children && (
                <div className="ml-6 sm:ml-8 mt-2 space-y-2">
                  {item?.children?.map((child) => (
                    <NavLink
                      key={child?.path}
                      to={child?.path}
                      className={({ isActive }) =>
                        `sidebar-nav-item text-xs sm:text-sm ${isActive ? 'active' : ''}`
                      }
                      title={child?.tooltip}
                      onClick={closeSidebar}
                    >
                      <Icon name={child?.icon} size={16} className="flex-shrink-0" />
                      <span className="flex-1 truncate">{child?.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-border bg-surface">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-muted rounded-lg">
            <Icon name="Terminal" size={18} color="var(--color-accent-green)" className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground">v2.5.1</p>
              <p className="text-xs text-muted-foreground">Everyday :)</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;