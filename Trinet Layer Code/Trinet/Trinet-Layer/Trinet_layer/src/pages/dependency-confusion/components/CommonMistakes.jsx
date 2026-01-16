import React from 'react';
import Icon from '../../../components/AppIcon';

const CommonMistakes = ({ mistakes }) => {
  return (
    <div className="mb-8 bg-surface border border-border rounded-xl p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Common Testing & Security Mistakes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mistakes?.map((mistake, index) => (
          <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg hover:border-warning/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">{mistake?.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{mistake?.description}</p>
              <div className="p-2 bg-accent-green/10 border border-accent-green/30 rounded">
                <p className="text-xs text-accent-green">
                  <strong>✓ Correct Approach:</strong> {mistake?.correctApproach}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonMistakes;