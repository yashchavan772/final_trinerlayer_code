import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ icon, label, value, trend, trendValue, color }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-5 lg:p-6 transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, borderWidth: '1px' }}
        >
          <Icon name={icon} size={20} color={color} />
        </div>
        <div className="flex items-center gap-1">
          <Icon
            name={isPositive ? 'TrendingUp' : 'TrendingDown'}
            size={16}
            color={isPositive ? 'var(--color-accent-green)' : 'var(--color-error)'}
          />
          <span
            className="text-xs font-medium"
            style={{ color: isPositive ? 'var(--color-accent-green)' : 'var(--color-error)' }}
          >
            {trendValue}
          </span>
        </div>
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;