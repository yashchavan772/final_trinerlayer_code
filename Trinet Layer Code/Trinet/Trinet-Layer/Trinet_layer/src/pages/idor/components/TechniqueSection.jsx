import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechniqueSection = ({ technique }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface/50 backdrop-blur-sm border border-border transition-all duration-300 hover:border-accent/50">
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/30 flex-shrink-0">
              <Icon name={technique?.icon} size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" color="var(--color-accent)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                {technique?.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {technique?.description}
              </p>
            </div>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={18} 
            className="sm:w-5 sm:h-5 text-accent flex-shrink-0 ml-3"
          />
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 sm:space-y-5">
            {technique?.steps?.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50">
                  <span className="text-xs sm:text-sm font-medium font-semibold text-accent">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-body font-medium text-foreground mb-1 sm:mb-2">
                    {step?.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2">
                    {step?.description}
                  </p>
                  {step?.example && (
                    <div className="rounded-lg bg-background/50 border border-border overflow-hidden">
                      <div className="px-3 py-2 sm:px-4 bg-muted/30 border-b border-border">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">Example</span>
                      </div>
                      <div className="p-3 sm:p-4 overflow-x-auto">
                        <pre className="text-xs sm:text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                          {step?.example}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechniqueSection;