import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      icon: "Database",
      value: "2,500+",
      label: "Exploit Payloads",
      description: "Tested and documented",
      color: "var(--color-accent)"
    },
    {
      id: 2,
      icon: "Shield",
      value: "50+",
      label: "Vulnerabilities",
      description: "Comprehensive guides",
      color: "var(--color-accent-green)"
    },
    {
      id: 3,
      icon: "Users",
      value: "10K+",
      label: "Security Researchers",
      description: "Active community",
      color: "var(--color-accent)"
    },
    {
      id: 4,
      icon: "TrendingUp",
      value: "99.9%",
      label: "Success Rate",
      description: "Verified exploits",
      color: "var(--color-accent-green)"
    }
  ];

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-8">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-4">
          {stats?.map((stat) => (
            <div
              key={stat?.id}
              className="group relative bg-surface border border-border rounded-xl p-4 sm:p-5 lg:p-4 text-center transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md hover:scale-[1.01]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,234,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 rounded-xl pointer-events-none" />
              
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-10 lg:h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-3 group-hover:bg-[rgba(0,234,255,0.1)] transition-colors duration-250">
                  <Icon name={stat?.icon} size={18} className="sm:w-5 sm:h-5 lg:w-[18px] lg:h-[18px]" color={stat?.color} />
                </div>
                
                <div className="text-2xl sm:text-3xl lg:text-2xl font-bold text-accent mb-1.5">
                  {stat?.value}
                </div>
                
                <div className="text-xs sm:text-sm font-semibold text-foreground mb-1">
                  {stat?.label}
                </div>
                
                <div className="text-xs text-muted-foreground font-medium">
                  {stat?.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;