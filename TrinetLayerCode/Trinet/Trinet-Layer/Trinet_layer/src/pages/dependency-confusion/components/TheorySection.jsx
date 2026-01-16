import React from 'react';
import Icon from '../../../components/AppIcon';

const TheorySection = ({ content, isProMode }) => {
  return (
    <div className="mb-8 space-y-6">
      <div className="bg-accent/5 border-l-4 border-accent px-6 py-4 rounded-r-lg">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Icon name="BookOpen" size={24} color="var(--color-accent)" />
          What is Dependency Confusion? (Theory - 40%)
        </h2>
        <p className="text-sm text-muted-foreground">
          Understanding the fundamentals before exploitation
        </p>
      </div>

      {/* Definition */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} color="var(--color-accent)" />
          Definition
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {content?.definition}
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} color="var(--color-accent)" />
          How Dependency Confusion Happens
        </h3>
        <div className="space-y-4">
          {content?.howItWorks?.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold">{index + 1}</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{step?.step}</h4>
                <p className="text-sm text-muted-foreground">{step?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Managers Vulnerability */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Package" size={20} color="var(--color-accent)" />
          Package Manager Behaviors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content?.packageManagers?.map((pm, index) => (
            <div key={index} className="p-4 bg-background border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{pm?.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  pm?.vulnerability?.includes('Critical') ? 'bg-red-500/10 text-red-500' :
                  pm?.vulnerability?.includes('High') ? 'bg-orange-500/10 text-orange-500' :
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {pm?.vulnerability}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{pm?.defaultBehavior}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why It Happens */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
          Why This Vulnerability Exists
        </h3>
        <ul className="space-y-2">
          {content?.whyItHappens?.map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-warning mt-1">▸</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TheorySection;