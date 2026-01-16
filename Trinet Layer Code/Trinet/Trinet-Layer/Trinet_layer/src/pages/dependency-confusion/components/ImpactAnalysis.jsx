import React from 'react';
import Icon from '../../../components/AppIcon';

const ImpactAnalysis = ({ impacts, isProMode }) => {
  const severityIcons = {
    'Critical': 'AlertOctagon',
    'High': 'AlertTriangle',
    'Medium': 'AlertCircle',
    'Low': 'Info'
  };

  const severityColors = {
    'Critical': 'text-red-500',
    'High': 'text-orange-500',
    'Medium': 'text-yellow-500',
    'Low': 'text-blue-500'
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
        Impact & Consequences
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Real-world business and security impact with financial estimates
      </p>
      <div className="space-y-6">
        {impacts?.map((impact, index) => (
          <div key={index} className="bg-background border border-border rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <Icon 
                name={severityIcons?.[impact?.severity]} 
                size={24} 
                color={`var(--color-${impact?.severity === 'Critical' || impact?.severity === 'High' ? 'red' : 'orange'}-500)`}
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">{impact?.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    impact?.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                    impact?.severity === 'High'? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {impact?.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{impact?.description}</p>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Real-World Examples:</h5>
                    <ul className="space-y-1.5">
                      {impact?.realExamples?.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-accent mt-1">▸</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-warning/10 border border-warning/30 rounded">
                    <h5 className="text-xs font-semibold text-warning uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Icon name="DollarSign" size={14} />
                      Financial Impact
                    </h5>
                    <p className="text-sm text-foreground font-medium">{impact?.financialImpact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactAnalysis;