import React from 'react';
import Icon from '../../../components/AppIcon';

const LevelSelector = ({ levels, activeLevel, onLevelChange }) => {
  return (
    <div className="mb-8 md:mb-12 lg:mb-14">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Icon name="Layers" size={24} className="md:w-7 md:h-7" color="var(--color-accent)" />
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Choose Your Level
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {levels?.map((level) => (
          <button
            key={level?.id}
            onClick={() => onLevelChange(level?.id)}
            className={`p-6 md:p-8 rounded-xl border-2 transition-all duration-300 text-left group ${
              activeLevel === level?.id
                ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                : 'border-border bg-muted/30 hover:border-accent/50 hover:bg-accent/5'
            }`}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all ${
                  activeLevel === level?.id
                    ? 'bg-accent/20 border-2 border-accent/60' :'bg-muted/50 border border-border group-hover:border-accent/40'
                }`}
              >
                <Icon 
                  name={level?.icon} 
                  size={24} 
                  className="md:w-7 md:h-7" 
                  color={level?.color}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  {level?.label}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 md:w-20 rounded-full bg-border overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeLevel === level?.id ? 'w-full' : 'w-0'
                      }`}
                      style={{ backgroundColor: level?.color }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm md:text-base text-muted-foreground font-body">
              {level?.id === 'beginner' && 'Understand OTP fundamentals, basic security checks, and how authentication flows work.'}
              {level?.id === 'hunter' && 'Learn real-world bug patterns, request manipulation, and practical exploitation techniques.'}
              {level?.id === 'elite' && 'Master advanced bypasses, race conditions, and rare vulnerabilities from high-value reports.'}
            </p>

            {activeLevel === level?.id && (
              <div className="mt-4 flex items-center gap-2 text-sm text-accent font-medium">
                <Icon name="CheckCircle" size={16} color={level?.color} />
                <span>Active Level</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;