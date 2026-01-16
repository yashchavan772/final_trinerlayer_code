import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const BulkOperations = ({ selectedCount, onSelectAll, onDeselectAll, onCopySelected }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
      <div className="bg-surface border border-accent rounded-lg shadow-glow-lg p-4 backdrop-blur-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="CheckSquare" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">
                {selectedCount} payload{selectedCount > 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-muted-foreground">Bulk operations available</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="flex-1 sm:flex-initial"
            >
              Clear
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onCopySelected}
              iconName="Copy"
              iconPosition="left"
              iconSize={16}
              className="flex-1 sm:flex-initial"
            >
              Copy All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;