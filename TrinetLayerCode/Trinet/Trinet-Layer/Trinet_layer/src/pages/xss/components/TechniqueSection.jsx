import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechniqueSection = ({ techniques }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 mb-6 md:mb-8 lg:mb-10 hover:border-accent/50 hover:shadow-glow-md transition-all duration-250 ease-cyber">
      <div className="flex items-start gap-4 mb-6 md:mb-8">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-accent-green/10 border border-accent-green/30 rounded-xl flex-shrink-0">
          <Icon name="BookOpen" size={24} color="var(--color-accent-green)" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            Exploitation Techniques
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-medium">
            Step-by-step guidance for XSS exploitation
          </p>
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        {techniques?.map((technique, index) => (
          <div
            key={index}
            className="bg-muted/30 border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-250 ease-cyber"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full flex items-center justify-between p-4 md:p-5 lg:p-6 text-left hover:bg-muted/50 transition-all duration-250 ease-cyber"
              aria-expanded={expandedIndex === index}
              aria-controls={`technique-content-${index}`}
            >
              <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-lg flex-shrink-0">
                  <span className="text-sm md:text-base font-medium font-semibold text-accent">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg lg:text-xl font-body font-medium text-foreground mb-1 md:mb-2">
                    {technique?.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium line-clamp-2">
                    {technique?.summary}
                  </p>
                </div>
              </div>
              <Icon
                name={expandedIndex === index ? 'ChevronUp' : 'ChevronDown'}
                size={20}
                className="text-accent flex-shrink-0 ml-3 transition-transform duration-250 ease-cyber"
              />
            </button>

            {expandedIndex === index && (
              <div
                id={`technique-content-${index}`}
                className="px-4 md:px-5 lg:px-6 pb-4 md:pb-5 lg:pb-6 border-t border-border"
              >
                <div className="space-y-4 md:space-y-6 mt-4 md:mt-6">
                  <div>
                    <h4 className="text-sm md:text-base font-medium font-medium text-foreground mb-3 md:mb-4">
                      Steps:
                    </h4>
                    <ol className="space-y-3 md:space-y-4">
                      {technique?.steps?.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-accent/10 border border-accent/30 rounded text-xs font-medium text-accent">
                            {stepIndex + 1}
                          </span>
                          <p className="text-xs md:text-sm text-muted-foreground font-medium flex-1">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {technique?.codeExample && (
                    <div>
                      <h4 className="text-sm md:text-base font-medium font-medium text-foreground mb-3 md:mb-4">
                        Code Example:
                      </h4>
                      <div className="bg-background/80 border border-border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border">
                          <span className="text-xs md:text-sm text-muted-foreground font-medium">
                            example.js
                          </span>
                        </div>
                        <div className="p-4 md:p-5 overflow-x-auto">
                          <pre className="text-xs md:text-sm font-medium text-accent-green leading-relaxed whitespace-pre-wrap break-all">
                            {technique?.codeExample}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {technique?.realWorldScenario && (
                    <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 md:p-5">
                      <div className="flex items-start gap-3">
                        <Icon name="Lightbulb" size={18} color="var(--color-warning)" className="flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-base font-medium font-medium text-foreground mb-2">
                            Real-World Scenario:
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            {technique?.realWorldScenario}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniqueSection;