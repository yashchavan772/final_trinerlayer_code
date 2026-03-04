import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechniqueSection = ({ techniques }) => {
  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Icon name="Wrench" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent)" />
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Exploitation Techniques
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {techniques?.map((technique, index) => (
          <TechniqueCard key={index} technique={technique} />
        ))}
      </div>
    </div>
  );
};

const TechniqueCard = ({ technique }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg md:rounded-xl overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-6 md:p-8 cursor-pointer hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={20} className="md:w-6 md:h-6" color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2">
              {technique?.title}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {technique?.summary}
            </p>
          </div>
        </div>
        <Icon
          name="ChevronDown"
          size={24}
          className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-border">
          <div className="pt-6 md:pt-8">
            <h4 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-4 md:mb-6">
              Step-by-Step Approach
            </h4>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {technique?.steps?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 md:gap-4">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs md:text-sm font-medium font-bold text-accent">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-muted/30 border border-border rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Icon name="Code" size={18} className="md:w-5 md:h-5" color="var(--color-accent)" />
                <span className="text-xs md:text-sm font-medium font-semibold text-foreground uppercase">
                  Implementation Example
                </span>
              </div>
              <pre className="text-xs md:text-sm lg:text-base font-medium text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words">
                {technique?.codeExample}
              </pre>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <Icon name="AlertCircle" size={20} className="flex-shrink-0 mt-0.5" color="var(--color-accent)" />
                <div>
                  <h4 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-2">
                    Real-World Scenario
                  </h4>
                  <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {technique?.realWorldScenario}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniqueSection;