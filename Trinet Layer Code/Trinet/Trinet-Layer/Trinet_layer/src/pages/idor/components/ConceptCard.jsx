import React from 'react';
import Icon from '../../../components/AppIcon';

const ConceptCard = ({ icon, title, description, examples }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface/50 backdrop-blur-sm border border-border p-4 sm:p-5 lg:p-4 transition-all duration-300 hover:border-accent/50 hover:shadow-glow-md">
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3 sm:mb-4 lg:mb-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/30 flex-shrink-0">
            <Icon name={icon} size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[18px] lg:h-[18px]" color="var(--color-accent)" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg lg:text-base font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {examples && examples?.length > 0 && (
          <div className="mt-4 space-y-2">
            {examples?.map((example, index) => (
              <div key={index} className="flex items-start gap-2">
                <Icon name="ChevronRight" size={14} className="sm:w-4 sm:h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-muted-foreground font-medium flex-1 break-words">
                  {example}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptCard;