import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PreventionMethods = ({ strategies, isProMode }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Shield" size={20} color="var(--color-accent-green)" />
        Prevention & Mitigation Strategies
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Comprehensive protection methods from developer to enterprise level
      </p>

      <div className="space-y-8">
        {strategies?.map((category, catIndex) => (
          <div key={catIndex} className="bg-background border border-border rounded-lg p-5">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Layers" size={20} color="var(--color-accent)" />
              {category?.category}
            </h4>

            <div className="space-y-6">
              {category?.strategies?.map((strategy, stratIndex) => (
                <div key={stratIndex} className="p-4 bg-surface border border-border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="CheckCircle" size={20} color="var(--color-accent-green)" className="flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground mb-2">{strategy?.method}</h5>
                      <p className="text-sm text-muted-foreground mb-2">{strategy?.implementation}</p>
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-green/10 border border-accent-green/30 rounded text-xs text-accent-green mb-3">
                        <Icon name="TrendingUp" size={12} />
                        {strategy?.effectiveness}
                      </div>

                      {strategy?.code && (
                        <div className="relative mt-3">
                          <pre className="bg-background border border-border rounded p-3 overflow-x-auto text-xs">
                            <code className="text-accent font-medium">{strategy?.code}</code>
                          </pre>
                          <button
                            onClick={() => handleCopy(strategy?.code, `${catIndex}-${stratIndex}`)}
                            className="absolute top-2 right-2 p-1.5 bg-surface border border-border rounded hover:bg-accent/10 transition-colors"
                          >
                            {copiedIndex === `${catIndex}-${stratIndex}` ? (
                              <Icon name="Check" size={14} color="var(--color-accent-green)" />
                            ) : (
                              <Icon name="Copy" size={14} color="var(--color-muted-foreground)" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreventionMethods;