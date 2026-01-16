import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureGrid = () => {
  const features = [
    {
      id: 1,
      icon: "Database",
      title: "Payload Repository",
      description: "Hundreds of copy-paste-ready payloads for XSS, SQLi, CRLF, and more. Each one tested and explained.",
      color: "var(--color-accent)"
    },
    {
      id: 2,
      icon: "BookOpen",
      title: "Vulnerability Database",
      description: "Comprehensive guides on web vulnerabilities with real-world examples, attack vectors, and mitigation strategies.",
      color: "var(--color-accent-green)"
    },
    {
      id: 3,
      icon: "Code",
      title: "Code Examples",
      description: "Battle-tested exploit code you can run right now. See it work, understand why it works.",
      color: "var(--color-accent)"
    },
    {
      id: 4,
      icon: "Zap",
      title: "Quick Access",
      description: "Find what you need in seconds. Smart filters, instant search, zero friction.",
      color: "var(--color-accent-green)"
    }
  ];

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-8">
      <div className="w-full">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Built for <span className="text-accent">Security Researchers</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
            Everything you need to discover, exploit, and document vulnerabilities in modern web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-4">
          {features?.map((feature) => (
            <div
              key={feature?.id}
              className="group relative bg-surface border border-border rounded-xl p-4 sm:p-5 lg:p-4 transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md hover:scale-[1.01]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,234,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 rounded-xl pointer-events-none" />
              
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-10 lg:h-10 rounded-xl bg-muted flex items-center justify-center mb-4 sm:mb-5 lg:mb-3 group-hover:bg-[rgba(0,234,255,0.1)] transition-colors duration-250">
                  <Icon name={feature?.icon} size={20} className="sm:w-6 sm:h-6 lg:w-5 lg:h-5" color={feature?.color} />
                </div>
                
                <h3 className="text-sm sm:text-base lg:text-sm font-semibold text-foreground mb-2 break-words">
                  {feature?.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;