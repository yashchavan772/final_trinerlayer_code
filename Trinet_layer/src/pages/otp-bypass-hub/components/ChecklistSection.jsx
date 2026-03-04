import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const ChecklistSection = ({ checklistItems, checkedItems, onCheckItem }) => {
  return (
    <section className="mb-8 md:mb-12 lg:mb-16">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Icon name="ClipboardCheck" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent)" />
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Master OTP Testing Checklist
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {checklistItems?.map((category, catIndex) => {
          const completedCount = category?.items?.filter(item => checkedItems?.[item?.id])?.length;
          const totalCount = category?.items?.length;
          const progress = (completedCount / totalCount) * 100;

          return (
            <div
              key={catIndex}
              className="p-5 md:p-6 rounded-xl border-2 transition-all"
              style={{
                backgroundColor: `${category?.color}05`,
                borderColor: `${category?.color}30`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${category?.color}20`,
                    border: `2px solid ${category?.color}40`
                  }}
                >
                  <Icon name="CheckSquare" size={20} color={category?.color} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                    {category?.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {completedCount}/{totalCount} completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-4 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: category?.color
                  }}
                />
              </div>
              <div className="space-y-3">
                {category?.items?.map((item) => (
                  <label
                    key={item?.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="pt-0.5">
                      <Checkbox
                        checked={checkedItems?.[item?.id] || false}
                        onChange={() => onCheckItem(item?.id)}
                        className="w-4 h-4"
                      />
                    </div>
                    <span
                      className={`text-sm font-body flex-1 transition-all ${
                        checkedItems?.[item?.id]
                          ? 'text-muted-foreground line-through opacity-60'
                          : 'text-foreground group-hover:text-accent'
                      }`}
                    >
                      {item?.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ChecklistSection;