import React from 'react';
import Select from '../../../components/ui/Select';

const FilterControls = ({ filters, onFilterChange, isProMode, onModeToggle, xssType }) => {
  const contextOptions = [
    { value: 'All', label: 'All Contexts' },
    { value: 'HTML', label: 'HTML' },
    { value: 'Attribute', label: 'Attribute' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'URL', label: 'URL' }
  ];

  const typeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Event-based', label: 'Event-based' },
    { value: 'Bypass', label: 'Bypass' }
  ];

  const encodingOptions = [
    { value: 'All', label: 'All Encodings' },
    { value: 'Plain', label: 'Plain' },
    { value: 'URL-encoded', label: 'URL-encoded' }
  ];

  return (
    <div className="mb-6 md:mb-8 bg-surface border border-border rounded-xl p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Filter Payloads
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {!isProMode 
              ? 'Beginner mode: Showing beginner and intermediate level payloads only' :'Elite mode: Showing all payloads including advanced techniques'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onModeToggle(false)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              !isProMode
                ? 'bg-accent text-background font-semibold' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => onModeToggle(true)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isProMode
                ? 'bg-accent text-background font-semibold' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Elite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium font-medium text-muted-foreground mb-2">
            Context
          </label>
          <Select
            value={filters?.context}
            onChange={(value) => onFilterChange('context', value)}
            options={contextOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-medium text-muted-foreground mb-2">
            Type
          </label>
          <Select
            value={filters?.type}
            onChange={(value) => onFilterChange('type', value)}
            options={typeOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-medium text-muted-foreground mb-2">
            Encoding
          </label>
          <Select
            value={filters?.encoding}
            onChange={(value) => onFilterChange('encoding', value)}
            options={encodingOptions}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">
          Showing payloads for <span className="text-accent font-semibold">{xssType?.replace('-', ' ')}</span> XSS
        </span>
      </div>
    </div>
  );
};

export default FilterControls;