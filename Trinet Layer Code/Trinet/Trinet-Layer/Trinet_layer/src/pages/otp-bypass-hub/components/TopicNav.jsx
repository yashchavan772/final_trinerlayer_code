import React from 'react';
import Icon from '../../../components/AppIcon';

const TopicNav = ({ sections, activeSection, onSectionChange, levelColor }) => {
  return (
    <div className="sticky top-[120px]">
      <div className="p-4 md:p-5 rounded-xl bg-muted/30 border border-border backdrop-blur-sm">
        <h3 className="text-sm md:text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="List" size={18} color={levelColor} />
          Topics
        </h3>
        <nav className="space-y-2">
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => onSectionChange(section?.id)}
              className={`w-full p-3 rounded-lg text-left transition-all group ${
                activeSection === section?.id
                  ? 'bg-accent/15 border border-accent/40' :'bg-transparent border border-transparent hover:bg-muted/50 hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    activeSection === section?.id
                      ? 'bg-accent/20 border border-accent/40' :'bg-muted/50 border border-border group-hover:border-accent/30'
                  }`}
                >
                  <Icon 
                    name={section?.icon} 
                    size={16} 
                    color={activeSection === section?.id ? levelColor : 'var(--color-muted-foreground)'}
                  />
                </div>
                <span className={`text-sm font-body font-medium ${
                  activeSection === section?.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {section?.title}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TopicNav;