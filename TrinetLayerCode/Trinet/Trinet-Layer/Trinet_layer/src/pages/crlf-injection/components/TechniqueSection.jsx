import React from 'react';
import Icon from '../../../components/AppIcon';

const TechniqueSection = ({ title, steps, codeExample, icon }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 md:p-7 lg:p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-muted flex items-center justify-center">
          <Icon name={icon} size={20} color="var(--color-accent)" />
        </div>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <div className="space-y-4 md:space-y-5 mb-6">
        {steps?.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-accent flex items-center justify-center">
              <span className="text-sm font-medium text-accent">{index + 1}</span>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
      {codeExample && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Example Code</span>
          </div>
          <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto">
            <code className="text-xs md:text-sm font-medium text-accent-green whitespace-pre">
              {codeExample}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default TechniqueSection;