import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DetectionChecklist = ({ checklist, isProMode }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (categoryIndex, checkIndex) => {
    const key = `${categoryIndex}-${checkIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="CheckSquare" size={20} color="var(--color-accent-green)" />
        Dependency Confusion Detection Checklist
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Systematic checklist to identify vulnerability before exploitation. Test each item in your environment.
      </p>

      <div className="space-y-6">
        {checklist?.map((category, catIndex) => (
          <div key={catIndex} className="bg-background border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="FolderOpen" size={18} color="var(--color-accent)" />
              {category?.category}
            </h4>

            <div className="space-y-3">
              {category?.checks?.map((check, checkIndex) => {
                const key = `${catIndex}-${checkIndex}`;
                const isChecked = checkedItems?.[key] || false;

                return (
                  <div key={checkIndex} className="group">
                    <div className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg hover:border-accent/50 transition-colors">
                      <button
                        onClick={() => handleCheck(catIndex, checkIndex)}
                        className="flex-shrink-0 mt-1"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isChecked 
                            ? 'bg-accent-green border-accent-green' :'border-border hover:border-accent'
                        }`}>
                          {isChecked && (
                            <Icon name="Check" size={14} color="white" />
                          )}
                        </div>
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <p className="text-sm text-foreground flex-1">
                            {check?.question}
                          </p>
                          {check?.critical && (
                            <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded">
                              Critical
                            </span>
                          )}
                        </div>
                        
                        {isProMode && (
                          <div className="text-xs text-muted-foreground pl-4 border-l-2 border-accent/30">
                            <strong>Guidance:</strong> {check?.guidance}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-accent)" />
          <div>
            <p className="text-sm text-foreground font-semibold mb-1">Pro Tip</p>
            <p className="text-sm text-muted-foreground">
              Items marked "Critical" should be addressed immediately. A single critical vulnerability can lead to complete infrastructure compromise via dependency confusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionChecklist;