import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 md:mb-8">
      {filters?.map((filter) => (
        <button
          key={filter?.id}
          onClick={() => onFilterChange(filter?.id)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${
            activeFilter === filter?.id
              ? 'bg-accent text-background border-2 border-accent shadow-glow-md'
              : 'bg-surface/50 text-muted-foreground border border-border hover:border-accent/50 hover:text-foreground'
          }`}
          aria-pressed={activeFilter === filter?.id}
        >
          <Icon name={filter?.icon} size={14} className="sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">{filter?.label}</span>
          <span className={`px-1.5 py-0.5 sm:px-2 rounded text-xs ${
            activeFilter === filter?.id ? 'bg-background/20' : 'bg-muted'
          }`}>
            {filter?.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterChips;