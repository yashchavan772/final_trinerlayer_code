import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChip = ({ label, isActive, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-250 ease-cyber flex-shrink-0 ${
        isActive
          ? 'bg-accent text-primary border border-accent shadow-glow-sm'
          : 'bg-surface text-muted-foreground border border-border hover:border-accent hover:text-accent'
      }`}
      aria-pressed={isActive}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            isActive ? 'bg-primary text-accent' : 'bg-muted text-foreground'
          }`}
        >
          {count}
        </span>
      )}
      {isActive && <Icon name="X" size={14} />}
    </button>
  );
};

export default FilterChip;