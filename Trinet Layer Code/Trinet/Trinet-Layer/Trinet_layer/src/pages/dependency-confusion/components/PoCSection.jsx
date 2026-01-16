import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PoCSection = ({ examples, isProMode }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Code" size={20} color="var(--color-accent)" />
        Sample Proof of Concept (Safe & Educational)
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Non-destructive PoC examples demonstrating dependency confusion without malicious actions
      </p>

      <div className="space-y-6">
        {examples?.map((example, index) => (
          <div key={index} className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-surface/50 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{example?.packageManager}</h4>
                <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded">
                  {example?.vulnerability}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="relative">
                <pre className="bg-background border border-border rounded p-4 overflow-x-auto text-sm">
                  <code className="text-accent font-medium">{example?.payload}</code>
                </pre>
                <button
                  onClick={() => handleCopy(example?.payload, index)}
                  className="absolute top-2 right-2 p-2 bg-surface border border-border rounded hover:bg-accent/10 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <Icon name="Check" size={16} color="var(--color-accent-green)" />
                  ) : (
                    <Icon name="Copy" size={16} color="var(--color-muted-foreground)" />
                  )}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 bg-accent/10 border border-accent/30 rounded">
                  <h5 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                    <Icon name="Info" size={14} />
                    Explanation
                  </h5>
                  <p className="text-sm text-muted-foreground">{example?.explanation}</p>
                </div>

                {isProMode && (
                  <div className="p-3 bg-warning/10 border border-warning/30 rounded">
                    <h5 className="text-sm font-semibold text-warning mb-2 flex items-center gap-2">
                      <Icon name="Search" size={14} />
                      Detection Method
                    </h5>
                    <p className="text-sm text-muted-foreground">{example?.detection}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="AlertOctagon" size={20} color="#ef4444" />
          <div>
            <p className="text-sm text-red-500 font-semibold mb-1">⚠️ Important Safety Notice</p>
            <p className="text-sm text-red-300">
              These PoCs are for authorized testing only. Publishing packages to public registries without permission violates Terms of Service and may be illegal. No malicious actions - only demonstration of vulnerability concept.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoCSection;