import React from 'react';
import Icon from '../../../components/AppIcon';

const LearningHero = () => {
  return (
    <div className="relative mb-8 md:mb-12 lg:mb-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      
      <div className="relative px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/30 backdrop-blur-sm">
            <Icon name="Shield" size={28} className="md:w-9 md:h-9" color="var(--color-accent)" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-1 md:mb-2">
              OTP Bypass & Authentication Logic Flaws
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-body">
              Progressive Learning Hub
            </p>
          </div>
        </div>

        <p className="text-base md:text-lg lg:text-xl text-foreground/90 font-body mb-6 md:mb-8 max-w-4xl">
          Master OTP bypass techniques from basic validation testing to advanced race conditions. 
          Learn real-world exploitation methods used in successful bug bounty reports.
        </p>

        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
            <Icon name="BookOpen" size={18} className="md:w-5 md:h-5" color="var(--color-accent-green)" />
            <span className="font-medium">Beginner Friendly</span>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
            <Icon name="TrendingUp" size={18} className="md:w-5 md:h-5" color="var(--color-accent)" />
            <span className="font-medium">Advanced Techniques</span>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
            <Icon name="Zap" size={18} className="md:w-5 md:h-5" color="var(--color-accent-red)" />
            <span className="font-medium">Real-World Cases</span>
          </div>
        </div>

        <div className="mt-6 md:mt-8 p-4 md:p-5 rounded-xl bg-accent/5 border border-accent/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={20} className="mt-0.5 flex-shrink-0" color="var(--color-accent)" />
            <div>
              <p className="text-sm md:text-base text-foreground/80 font-body">
                <span className="font-semibold text-accent">Learning Path:</span> Start with Beginner level to understand OTP fundamentals, 
                progress to Hunter for real bug patterns, and master Elite techniques for advanced bypasses found in high-paying bounty reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHero;