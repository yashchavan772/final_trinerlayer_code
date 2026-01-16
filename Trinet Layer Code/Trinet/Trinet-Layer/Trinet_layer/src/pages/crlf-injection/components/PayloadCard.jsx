import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const PayloadCard = ({ payload, category, difficulty, description, context }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: 'text-accent-green',
      intermediate: 'text-accent',
      advanced: 'text-warning',
      expert: 'text-error'
    };
    return colors?.[level] || 'text-muted-foreground';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-5 lg:p-6 transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-muted rounded border border-border text-accent font-code">
              {category}
            </span>
            <span className={`text-xs px-2 py-1 bg-muted rounded border border-border font-code ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mb-2">
            {description}
          </p>
          {context && (
            <p className="text-xs text-muted-foreground italic">
              Context: {context}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName={copied ? "Check" : "Copy"}
          iconPosition="left"
          onClick={handleCopy}
          className="flex-shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <div className="relative">
        <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto">
          <code className="text-xs md:text-sm font-code text-accent-green whitespace-pre">
            {payload}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default PayloadCard;