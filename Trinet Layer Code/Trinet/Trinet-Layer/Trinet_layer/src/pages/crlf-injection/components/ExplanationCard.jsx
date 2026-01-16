import React from 'react';
import Icon from '../../../components/AppIcon';

const ExplanationCard = ({ title, content, icon, iconColor }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 md:p-7 lg:p-8 transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={20} color={iconColor} />
        </div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <div className="space-y-3 md:space-y-4">
        {content?.map((paragraph, index) => (
          <p key={index} className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ExplanationCard;