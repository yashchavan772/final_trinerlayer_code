import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PracticalScenario = ({ scenarios, isProMode }) => {
  const [expandedScenario, setExpandedScenario] = useState(null);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="AlertTriangle" size={20} color="var(--color-accent)" />
        Real-World Attack Scenarios
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Actual dependency confusion attacks with detailed exploitation chains and business impact
      </p>

      <div className="space-y-4">
        {scenarios?.map((scenario, index) => (
          <div key={index} className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedScenario(expandedScenario === index ? null : index)}
              className="w-full p-4 flex items-center justify-between hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon 
                  name={expandedScenario === index ? "ChevronDown" : "ChevronRight"} 
                  size={20} 
                  color="var(--color-accent)" 
                />
                <h4 className="font-semibold text-foreground text-left">
                  {scenario?.title}
                </h4>
              </div>
            </button>

            {expandedScenario === index && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="Settings" size={16} color="var(--color-accent)" />
                    Context
                  </h5>
                  <p className="text-sm text-muted-foreground">{scenario?.context}</p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="Target" size={16} color="var(--color-accent)" />
                    Attack Vector
                  </h5>
                  <p className="text-sm text-muted-foreground">{scenario?.attackVector}</p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="Zap" size={16} color="var(--color-warning)" />
                    Exploitation
                  </h5>
                  <p className="text-sm text-muted-foreground">{scenario?.exploitation}</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                  <h5 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">
                    <Icon name="AlertOctagon" size={16} />
                    Impact
                  </h5>
                  <p className="text-sm text-red-300">{scenario?.impact}</p>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded p-3">
                  <h5 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                    <Icon name="Search" size={16} />
                    How It Was Detected
                  </h5>
                  <p className="text-sm text-accent-light">{scenario?.detection}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticalScenario;