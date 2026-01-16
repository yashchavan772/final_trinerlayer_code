import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFilterChange, isProMode, onModeToggle }) => {
  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="bg-surface border border-border rounded-lg md:rounded-xl p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1">
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium font-medium text-muted-foreground mb-2">
                Complexity
              </label>
              <select
                value={filters?.complexity}
                onChange={(e) => onFilterChange('complexity', e?.target?.value)}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-muted border border-border rounded-lg text-sm md:text-base text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              >
                <option value="All">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium font-medium text-muted-foreground mb-2">
                Category
              </label>
              <select
                value={filters?.category}
                onChange={(e) => onFilterChange('category', e?.target?.value)}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-muted border border-border rounded-lg text-sm md:text-base text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              >
                <option value="All">All Categories</option>
                <option value="Logic">Logic Flaw</option>
                <option value="Session">Session Management</option>
                <option value="Rate">Rate Limiting</option>
                <option value="Response">Response Manipulation</option>
                <option value="API">API Exploitation</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium font-medium text-muted-foreground mb-2">
                Scenario
              </label>
              <select
                value={filters?.scenario}
                onChange={(e) => onFilterChange('scenario', e?.target?.value)}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-muted border border-border rounded-lg text-sm md:text-base text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              >
                <option value="All">All Scenarios</option>
                <option value="Login">Login</option>
                <option value="Authentication">Authentication</option>
                <option value="Verification">Verification</option>
                <option value="Password">Password Reset</option>
                <option value="Transaction">Transaction</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 lg:border-l lg:border-border lg:pl-6">
            <span className="text-xs md:text-sm font-medium font-medium text-muted-foreground whitespace-nowrap">
              Mode:
            </span>
            <button
              onClick={() => onModeToggle(!isProMode)}
              className={`flex items-center gap-2 md:gap-3 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium font-medium text-sm md:text-base transition-all ${
                isProMode
                  ? 'bg-accent text-background hover:bg-accent/90' :'bg-muted border border-border text-foreground hover:border-accent/50'
              }`}
            >
              <Icon name={isProMode ? 'Zap' : 'User'} size={16} className="md:w-5 md:h-5" />
              <span>{isProMode ? 'Pro Mode' : 'Beginner Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;