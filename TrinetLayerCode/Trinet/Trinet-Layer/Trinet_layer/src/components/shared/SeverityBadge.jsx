import React, { memo } from 'react';

const severityConfig = {
  critical: {
    bg: 'bg-error/20',
    border: 'border-error/50',
    text: 'text-error',
    dot: 'bg-error'
  },
  high: {
    bg: 'bg-warning/20',
    border: 'border-warning/50',
    text: 'text-warning',
    dot: 'bg-warning'
  },
  medium: {
    bg: 'bg-accent/20',
    border: 'border-accent/50',
    text: 'text-accent',
    dot: 'bg-accent'
  },
  low: {
    bg: 'bg-success/20',
    border: 'border-success/50',
    text: 'text-success',
    dot: 'bg-success'
  },
  info: {
    bg: 'bg-muted',
    border: 'border-border',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground'
  }
};

const SeverityBadge = memo(({ 
  severity = 'info', 
  showDot = false,
  size = 'sm',
  className = ''
}) => {
  const config = severityConfig[severity?.toLowerCase()] || severityConfig.info;
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${config.bg} ${config.text} border ${config.border} rounded-md font-medium font-medium uppercase tracking-wide ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {severity}
    </span>
  );
});

SeverityBadge.displayName = 'SeverityBadge';

export default SeverityBadge;
