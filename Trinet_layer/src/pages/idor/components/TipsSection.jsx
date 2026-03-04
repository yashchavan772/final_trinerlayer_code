import React from 'react';
import Icon from '../../../components/AppIcon';

const TipsSection = ({ tips }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {tips?.map((tip, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl bg-surface/50 backdrop-blur-sm border border-border p-4 sm:p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-glow-md"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-green/10 flex items-center justify-center border border-accent-green/30 flex-shrink-0">
                <Icon name={tip?.icon} size={14} className="sm:w-4 sm:h-4" color="var(--color-accent-green)" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 sm:mb-2">
                  {tip?.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {tip?.description}
                </p>
              </div>
            </div>

            {tip?.examples && tip?.examples?.length > 0 && (
              <div className="space-y-2">
                {tip?.examples?.map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Icon name="ChevronRight" size={12} className="sm:w-4 sm:h-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium flex-1 break-words">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TipsSection;