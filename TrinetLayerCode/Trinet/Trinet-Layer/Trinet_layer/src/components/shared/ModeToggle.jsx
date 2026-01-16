import React, { memo } from 'react';
import Icon from '../AppIcon';

const ModeToggle = memo(({ 
  mode, 
  onToggle, 
  beginnerLabel = 'Beginner',
  proLabel = 'Pro',
  beginnerIcon = 'GraduationCap',
  proIcon = 'Zap',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1.5 text-xs gap-1.5',
    md: 'px-3 md:px-4 py-2 text-xs md:text-sm gap-2',
    lg: 'px-4 py-2.5 text-sm gap-2'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1">
      <button
        onClick={() => onToggle('beginner')}
        className={`flex items-center ${sizeClasses[size]} rounded-lg font-medium transition-all duration-250 ease-cyber ${
          mode === 'beginner' 
            ? 'bg-accent text-primary shadow-glow-sm' 
            : 'text-muted-foreground hover:text-accent'
        }`}
        aria-pressed={mode === 'beginner'}
      >
        <Icon name={beginnerIcon} size={iconSizes[size]} />
        <span className="hidden sm:inline">{beginnerLabel}</span>
      </button>
      <button
        onClick={() => onToggle('pro')}
        className={`flex items-center ${sizeClasses[size]} rounded-lg font-medium transition-all duration-250 ease-cyber ${
          mode === 'pro' 
            ? 'bg-accent text-primary shadow-glow-sm' 
            : 'text-muted-foreground hover:text-accent'
        }`}
        aria-pressed={mode === 'pro'}
      >
        <Icon name={proIcon} size={iconSizes[size]} />
        <span className="hidden sm:inline">{proLabel}</span>
      </button>
    </div>
  );
});

ModeToggle.displayName = 'ModeToggle';

export default ModeToggle;
