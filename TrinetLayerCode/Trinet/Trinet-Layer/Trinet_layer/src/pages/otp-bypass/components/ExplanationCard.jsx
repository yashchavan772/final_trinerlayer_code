import React from 'react';
import Icon from '../../../components/AppIcon';

const ExplanationCard = ({ explanation }) => {
  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="bg-surface border border-border rounded-lg md:rounded-xl p-6 md:p-8 lg:p-10">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Icon name="BookOpen" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent)" />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            Understanding OTP Bypass
          </h2>
        </div>

        <div className="mb-6 md:mb-8 lg:mb-10">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-3 md:mb-4">
            Fundamentals
          </h3>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
            {explanation?.fundamentals}
          </p>
        </div>

        <div className="mb-6 md:mb-8 lg:mb-10">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-4 md:mb-6">
            Common Attack Vectors
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            {explanation?.attackVectors?.map((vector, index) => (
              <div key={index} className="bg-muted/30 border border-border rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <Icon name="Zap" size={18} className="md:w-5 md:h-5 lg:w-6 lg:h-6" color="var(--color-accent)" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-2">
                      {vector?.name}
                    </h4>
                    <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                      {vector?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-4 md:mb-6">
            Security Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            {explanation?.impacts?.map((impact, index) => (
              <div key={index} className="bg-error/5 border border-error/20 rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <Icon name="AlertTriangle" size={20} className="md:w-6 md:h-6 flex-shrink-0 mt-0.5" color="var(--color-error)" />
                  <div>
                    <h4 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-2">
                      {impact?.title}
                    </h4>
                    <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                      {impact?.description}
                    </p>
                  </div>
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