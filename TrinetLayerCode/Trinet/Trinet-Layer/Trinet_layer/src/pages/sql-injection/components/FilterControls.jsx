import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFilterChange, isProMode, onModeToggle }) => {
  const databaseOptions = ['All', 'MySQL', 'PostgreSQL', 'MSSQL', 'Oracle'];
  const complexityOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const techniqueOptions = {
    'union-based': ['All', 'Data Extraction', 'Reconnaissance', 'Schema Discovery', 'Fingerprinting', 'File Access', 'Privilege Escalation', 'Evasion', 'Blind Testing'],
    'boolean-based': ['All', 'Verification', 'Fingerprinting', 'Reconnaissance', 'Data Extraction', 'Schema Discovery', 'Blind Testing', 'Evasion'],
    'time-based': ['All', 'Verification', 'Fingerprinting', 'Reconnaissance', 'Data Extraction', 'Blind Testing', 'Evasion'],
    'error-based': ['All', 'Fingerprinting', 'Data Extraction', 'Schema Discovery', 'Verification', 'Evasion']
  };

  return (
    <div className="mb-8 bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Filter Payloads
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Mode:</span>
          <button
            onClick={() => onModeToggle(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !isProMode
                ? 'bg-accent text-background' :'bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => onModeToggle(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isProMode
                ? 'bg-accent text-background' :'bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            Elite
          </button>
        </div>
      </div>
      {!isProMode && (
        <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
          <p className="text-sm text-accent flex items-start gap-2">
            <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              <strong>Beginner Mode:</strong> Showing beginner and intermediate difficulty payloads. Switch to Elite mode to see all advanced payloads.
            </span>
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Database Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Database System
          </label>
          <select
            value={filters?.database}
            onChange={(e) => onFilterChange('database', e?.target?.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {databaseOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Complexity Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Complexity Level
          </label>
          <select
            value={filters?.complexity}
            onChange={(e) => onFilterChange('complexity', e?.target?.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {complexityOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Technique Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Attack Technique
          </label>
          <select
            value={filters?.technique}
            onChange={(e) => onFilterChange('technique', e?.target?.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {techniqueOptions?.['union-based']?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;