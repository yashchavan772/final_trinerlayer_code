import React from 'react';
import Icon from '../../../components/AppIcon';

const CommonMistakes = ({ mistakes }) => {
  return (
    <section className="mb-8 md:mb-12 lg:mb-16">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
        <Icon name="AlertCircle" size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0" color="var(--color-accent-red)" />
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground break-words">
          Common Mistakes to Avoid
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {mistakes?.map((mistake, index) => (
          <div
            key={index}
            className="p-4 sm:p-5 md:p-6 rounded-xl bg-gradient-to-br from-red-500/5 to-background border-2 border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name="XCircle" size={18} className="sm:w-5 sm:h-5" color="rgb(239, 68, 68)" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1 sm:mb-2 break-words overflow-hidden">
                  {mistake?.mistake}
                </h3>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="p-2.5 sm:p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Icon name="AlertTriangle" size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" color="rgb(239, 68, 68)" />
                  <span className="break-words">Why It's Wrong</span>
                </h4>
                <p className="text-muted-foreground font-body break-words overflow-wrap-anywhere leading-relaxed">
                  {mistake?.explanation}
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Icon name="TrendingDown" size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" color="var(--color-muted-foreground)" />
                  <span className="break-words">Impact</span>
                </h4>
                <p className="text-muted-foreground font-body break-words overflow-wrap-anywhere leading-relaxed">
                  {mistake?.impact}
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Icon name="CheckCircle" size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" color="rgb(34, 197, 94)" />
                  <span className="break-words">Correct Approach</span>
                </h4>
                <p className="text-green-400/90 font-body break-words overflow-wrap-anywhere leading-relaxed">
                  {mistake?.correctApproach}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommonMistakes;