import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PayloadCard = ({ payload, isProMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(payload?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: 'text-success',
      intermediate: 'text-accent',
      advanced: 'text-warning',
      expert: 'text-error'
    };
    return colors?.[level] || 'text-muted-foreground';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert'
    };
    return labels?.[level] || 'Unknown';
  };

  const getContextBadgeColor = (context) => {
    const colors = {
      'HTML': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      'Attribute': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      'JavaScript': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      'URL': 'bg-green-500/10 text-green-500 border-green-500/30'
    };
    return colors?.[context] || 'bg-muted text-muted-foreground border-border';
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'Basic': 'bg-gray-500/10 text-gray-500 border-gray-500/30',
      'Event-based': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      'Bypass': 'bg-red-500/10 text-red-500 border-red-500/30'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 md:p-6 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              {payload?.name}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-code border ${getDifficultyColor(payload?.difficulty)}`}>
              {getDifficultyLabel(payload?.difficulty)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={`px-2 py-1 rounded text-xs font-code border ${getContextBadgeColor(payload?.context)}`}>
              {payload?.context}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-code border ${getTypeBadgeColor(payload?.type)}`}>
              {payload?.type}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-code border bg-accent/10 text-accent border-accent/30`}>
              {payload?.encoding}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {payload?.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 hover:shadow-glow-sm transition-all duration-250 ease-cyber"
            aria-label={copied ? 'Copied to clipboard' : 'Copy payload to clipboard'}
          >
            <Icon name={copied ? 'Check' : 'Copy'} size={14} color={copied ? 'var(--color-success)' : 'var(--color-accent)'} />
            <span className="text-xs font-code text-accent">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>
      </div>

      <div className="relative mb-4 md:mb-6">
        <div className="bg-background/80 border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 md:py-3 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-error/60"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-warning/60"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-success/60"></div>
              </div>
              <span className="text-xs md:text-sm text-muted-foreground font-code ml-2">
                {payload?.type}.js
              </span>
            </div>
          </div>
          <div className="p-4 md:p-5 lg:p-6 overflow-x-auto">
            <pre className="text-xs md:text-sm font-code text-accent-green leading-relaxed whitespace-pre-wrap break-all">
              {payload?.code}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <Icon name="Target" size={16} color="var(--color-accent)" />
          <span className="text-xs md:text-sm text-muted-foreground font-code">
            Type: <span className="text-foreground">{payload?.type}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={16} color="var(--color-success)" />
          <span className="text-xs md:text-sm text-muted-foreground font-code">
            Effectiveness: <span className="text-success">{isProMode ? payload?.proEffectiveness : payload?.beginnerEffectiveness}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Globe" size={16} color="var(--color-accent-green)" />
          <span className="text-xs md:text-sm text-muted-foreground font-code">
            {payload?.browserCompatibility}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayloadCard;