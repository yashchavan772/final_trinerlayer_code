import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, activeFilters, onFilterChange }) => {
  const toggleFilter = (filterKey, value) => {
    const currentValues = activeFilters?.[filterKey] || [];
    const newValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterKey, newValues);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-5 lg:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Filter" size={20} color="var(--color-accent)" />
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Filter Payloads
        </h3>
      </div>
      <div className="space-y-4">
        {Object.entries(filters)?.map(([key, values]) => (
          <div key={key}>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase">
              {key?.replace(/([A-Z])/g, ' $1')?.trim()}
            </p>
            <div className="flex flex-wrap gap-2">
              {values?.map((value) => {
                const isActive = (activeFilters?.[key] || [])?.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleFilter(key, value)}
                    className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg border transition-all duration-250 ease-cyber ${
                      isActive
                        ? 'bg-accent text-primary border-accent shadow-glow-sm'
                        : 'bg-muted text-muted-foreground border-border hover:border-accent'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;