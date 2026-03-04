import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PayloadCard = ({ payload, isProMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(payload?.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Easy':
        return 'text-accent-green';
      case 'Medium':
        return 'text-warning';
      case 'Hard':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface/50 backdrop-blur-sm border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-glow-md">
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 p-4 sm:p-5 lg:p-4">
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4 lg:mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base lg:text-sm font-heading font-semibold text-foreground mb-1 sm:mb-2">
              {payload?.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {payload?.description}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="w-9 h-9 sm:w-10 sm:h-10 lg:w-9 lg:h-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border hover:border-accent transition-all duration-300 hover:shadow-glow-sm flex-shrink-0"
            aria-label="Copy payload to clipboard"
          >
            <Icon 
              name={copied ? "Check" : "Copy"} 
              size={14} 
              className="sm:w-4 sm:h-4 lg:w-3.5 lg:h-3.5"
              color={copied ? "var(--color-accent-green)" : "var(--color-accent)"} 
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 lg:mb-3">
          <span className={`px-2.5 py-1 rounded text-xs sm:text-sm font-code ${getDifficultyColor(payload?.difficulty)} bg-muted/50 border border-border`}>
            {payload?.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded text-xs sm:text-sm font-code text-accent bg-accent/10 border border-accent/30">
            {payload?.category}
          </span>
          {isProMode && (
            <span className="px-2.5 py-1 rounded text-xs sm:text-sm font-code text-accent-green bg-accent-green/10 border border-accent-green/30">
              Success: {payload?.successRate}%
            </span>
          )}
        </div>

        <div className="relative rounded-lg bg-background/50 border border-border overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 sm:px-4 lg:px-3 bg-muted/30 border-b border-border">
            <span className="text-xs sm:text-sm font-code text-muted-foreground">Payload</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-code text-accent">{payload?.method}</span>
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-3 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-code text-foreground whitespace-pre-wrap break-words">
              {payload?.code}
            </pre>
          </div>
        </div>

        {isProMode && payload?.context && (
          <div className="mt-3 sm:mt-4 lg:mt-3 p-3 sm:p-4 lg:p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={14} className="sm:w-4 sm:h-4 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-heading font-medium text-foreground mb-1">Context</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {payload?.context}
                </p>
              </div>
            </div>
          </div>
        )}

        {payload?.targetApps && payload?.targetApps?.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground font-code">Target Apps:</span>
            {payload?.targetApps?.map((app, index) => (
              <span key={index} className="px-2 py-1 rounded text-xs sm:text-sm font-code text-foreground bg-muted/50 border border-border">
                {app}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayloadCard;