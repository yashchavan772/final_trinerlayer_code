import React from 'react';
import Icon from '../../../components/AppIcon';

const ExplanationCard = ({ explanation }) => {
  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 mb-6 md:mb-8 lg:mb-10 hover:border-accent/50 hover:shadow-glow-md transition-all duration-250 ease-cyber">
      <div className="flex items-start gap-4 mb-6 md:mb-8">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-xl flex-shrink-0">
          <Icon name="Info" size={24} color="var(--color-accent)" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            What is XSS?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-medium">
            Understanding Cross-Site Scripting vulnerabilities
          </p>
        </div>
      </div>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-body font-medium text-foreground mb-3 md:mb-4">
            Fundamentals
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
            {explanation?.fundamentals}
          </p>
        </div>

        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-body font-medium text-foreground mb-3 md:mb-4">
            Attack Vectors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {explanation?.attackVectors?.map((vector, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 md:p-5 bg-muted/30 border border-border rounded-lg hover:border-accent/50 transition-all duration-250 ease-cyber"
              >
                <Icon name="Zap" size={18} color="var(--color-accent-green)" className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm md:text-base font-medium font-medium text-foreground mb-1">
                    {vector?.name}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium line-clamp-2">
                    {vector?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-body font-medium text-foreground mb-3 md:mb-4">
            Impact Assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {explanation?.impacts?.map((impact, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 md:p-5 bg-error/5 border border-error/20 rounded-lg"
              >
                <Icon name="AlertCircle" size={18} color="var(--color-error)" className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm md:text-base font-medium font-medium text-foreground mb-1">
                    {impact?.title}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {impact?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationCard;