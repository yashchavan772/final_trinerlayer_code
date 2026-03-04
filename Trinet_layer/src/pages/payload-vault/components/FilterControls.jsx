import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFilterChange, resultCount, onReset }) => {
  const vulnerabilityOptions = [
    { value: 'all', label: 'All Vulnerabilities' },
    { value: 'xss', label: 'XSS (All Types)' },
    { value: 'reflected-xss', label: '└─ Reflected XSS' },
    { value: 'stored-xss', label: '└─ Stored XSS' },
    { value: 'dom-xss', label: '└─ DOM-Based XSS' },
    { value: 'sqli', label: 'SQL Injection' },
    { value: 'crlf', label: 'CRLF Injection' },
    { value: 'idor', label: 'IDOR' },
    { value: 'otp-bypass', label: 'OTP Bypass' },
    { value: 'xxe', label: 'XXE' },
    { value: 'ssrf', label: 'SSRF' }
  ];

  const complexityOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const targetOptions = [
    { value: 'all', label: 'All Technologies' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'asp.net', label: 'ASP.NET' }
  ];

  const bypassOptions = [
    { value: 'all', label: 'All Techniques' },
    { value: 'encoding', label: 'Encoding' },
    { value: 'obfuscation', label: 'Obfuscation' },
    { value: 'filter-bypass', label: 'Filter Bypass' },
    { value: 'waf-bypass', label: 'WAF Bypass' },
    { value: 'context-breaking', label: 'Context Breaking' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-6 mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} color="var(--color-accent)" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Filter Payloads
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="px-3 py-1.5 bg-muted rounded-lg flex items-center gap-2">
            <span className="text-sm font-medium text-accent">{resultCount}</span>
            <span className="text-sm text-muted-foreground">results</span>
          </div>
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-accent transition-colors duration-250 flex items-center gap-2 whitespace-nowrap"
          >
            <Icon name="RotateCcw" size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Select
          label="Vulnerability Type"
          options={vulnerabilityOptions}
          value={filters?.vulnerability}
          onChange={(value) => onFilterChange('vulnerability', value)}
          searchable
        />

        <Select
          label="Complexity Level"
          options={complexityOptions}
          value={filters?.complexity}
          onChange={(value) => onFilterChange('complexity', value)}
        />

        <Select
          label="Target Technology"
          options={targetOptions}
          value={filters?.target}
          onChange={(value) => onFilterChange('target', value)}
          searchable
        />

        <Select
          label="Bypass Technique"
          options={bypassOptions}
          value={filters?.bypass}
          onChange={(value) => onFilterChange('bypass', value)}
          searchable
        />
      </div>
    </div>
  );
};

export default FilterControls;