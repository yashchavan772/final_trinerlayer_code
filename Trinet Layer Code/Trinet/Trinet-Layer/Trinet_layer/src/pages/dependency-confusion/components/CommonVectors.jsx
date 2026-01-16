import React from 'react';
import Icon from '../../../components/AppIcon';

const CommonVectors = ({ vectors, isProMode }) => {
  const riskColors = {
    'Critical': 'bg-red-500/10 text-red-500 border-red-500/30',
    'High': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    'Medium': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    'Low': 'bg-blue-500/10 text-blue-500 border-blue-500/30'
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Target" size={20} color="var(--color-accent)" />
        Where Dependency Confusion Commonly Exists
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Common environments and indicators where dependency confusion vulnerabilities are typically found
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vectors?.map((vector, index) => (
          <div key={index} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{vector?.environment}</h4>
              <span className={`text-xs px-2 py-1 rounded border ${riskColors?.[vector?.risk]}`}>
                {vector?.risk} Risk
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{vector?.description}</p>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">Indicators:</h5>
              <ul className="space-y-1.5">
                {vector?.indicators?.map((indicator, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Icon name="AlertCircle" size={14} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonVectors;