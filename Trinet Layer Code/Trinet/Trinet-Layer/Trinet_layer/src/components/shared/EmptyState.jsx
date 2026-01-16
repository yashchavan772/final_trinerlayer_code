import React, { memo } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const EmptyState = memo(({ 
  onReset,
  title = 'No results found',
  description = 'Try adjusting your filters to find what you need.',
  icon = 'SearchX',
  buttonText = 'Reset Filters',
  buttonVariant = 'default'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 px-4">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6">
        <Icon name={icon} size={32} className="md:w-10 md:h-10" color="var(--color-muted-foreground)" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground text-center mb-6 max-w-md">
        {description}
      </p>
      {onReset && (
        <Button 
          variant={buttonVariant} 
          iconName="RotateCcw" 
          iconPosition="left" 
          onClick={onReset}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
