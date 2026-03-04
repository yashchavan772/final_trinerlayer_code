import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PayloadCard = ({ payload, isProMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(payload?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    beginner: 'text-green-500 bg-green-500/10 border-green-500/30',
    intermediate: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    advanced: 'text-red-500 bg-red-500/10 border-red-500/30'
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            {payload?.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-medium border ${difficultyColors?.[payload?.difficulty]}`}>
              {payload?.complexity}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent border border-accent/30">
              {payload?.database}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-muted/10 text-muted-foreground border border-border">
              {payload?.technique}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {payload?.description}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/5 border-b border-border">
            <span className="text-xs font-code text-muted-foreground">SQL Payload</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
            >
              {copied ? (
                <>
                  <Icon name="Check" size={14} />
                  <span className="text-xs font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Icon name="Copy" size={14} />
                  <span className="text-xs font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <code className="text-sm font-code text-foreground whitespace-pre-wrap break-all">
              {payload?.code}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayloadCard;