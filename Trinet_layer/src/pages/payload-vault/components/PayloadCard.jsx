import React, { useState, memo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PayloadCard = memo(({ payload, onCopy, isSelected, onToggleSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(payload?.code);
    setCopied(true);
    onCopy(payload?.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'text-accent-green';
      case 'Intermediate':
        return 'text-warning';
      case 'Advanced':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getEffectivenessStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < rating ? 'Star' : 'Star'}
        size={14}
        color={i < rating ? 'var(--color-accent)' : 'var(--color-muted)'}
        className={i < rating ? 'fill-accent' : ''}
      />
    ));
  };

  return (
    <div className="group relative bg-surface border border-border rounded-lg p-4 md:p-6 transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md flex flex-col w-full">
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <Checkbox
          checked={isSelected}
          onChange={onToggleSelect}
          className="flex-shrink-0"
          aria-label={`Select ${payload?.name}`}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground truncate">
            {payload?.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
        <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
          {payload?.category}
        </span>
        <span className={`text-xs font-code ${getDifficultyColor(payload?.difficulty)}`}>
          {payload?.difficulty}
        </span>
      </div>

      <div className="mb-3 md:mb-4 flex-grow">
        <div className="bg-background border border-border rounded-lg p-3 md:p-4 flex items-center justify-between gap-3">
          <pre className="text-xs md:text-sm font-code text-accent-green whitespace-pre-wrap break-all flex-1 overflow-x-auto">
            {payload?.code}
          </pre>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="flex-shrink-0"
            iconName={copied ? 'Check' : 'Copy'}
            iconSize={18}
          >
            <span className="sr-only">{copied ? 'Copied' : 'Copy payload'}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Effectiveness:</span>
          <div className="flex items-center gap-1">
            {getEffectivenessStars(payload?.effectiveness)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Target" size={14} color="var(--color-muted-foreground)" />
          <span className="text-xs text-muted-foreground">{payload?.target}</span>
        </div>
      </div>

      {payload?.description && (
        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">
          {payload?.description}
        </p>
      )}

      {payload?.bypassTechnique && (
        <div className="mt-auto pt-3 md:pt-4 border-t border-border">
          <div className="flex items-start gap-2">
            <Icon name="Shield" size={14} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground block mb-1">Bypass Technique:</span>
              <span className="text-xs md:text-sm text-foreground">{payload?.bypassTechnique}</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
        <div className="w-2 h-2 rounded-full bg-accent shadow-glow-sm"></div>
      </div>
    </div>
  );
});

PayloadCard.displayName = 'PayloadCard';

export default PayloadCard;