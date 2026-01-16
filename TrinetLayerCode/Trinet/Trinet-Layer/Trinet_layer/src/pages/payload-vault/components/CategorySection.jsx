import React, { memo } from 'react';
import Icon from '../../../components/AppIcon';
import PayloadCard from './PayloadCard';

const CategorySection = memo(({ category, payloads, onCopy, selectedPayloads, onToggleSelect }) => {
  const getCategoryIcon = (cat) => {
    const icons = {
      'XSS': 'Code',
      'SQL Injection': 'Database',
      'CRLF Injection': 'FileText',
      'IDOR': 'Lock',
      'XXE': 'FileCode',
      'SSRF': 'Globe'
    };
    return icons?.[cat] || 'Shield';
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'XSS': 'var(--color-accent)',
      'SQL Injection': 'var(--color-accent-green)',
      'CRLF Injection': 'var(--color-warning)',
      'IDOR': 'var(--color-error)',
      'XXE': 'var(--color-accent)',
      'SSRF': 'var(--color-accent-green)'
    };
    return colors?.[cat] || 'var(--color-accent)';
  };

  if (payloads?.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ background: `${getCategoryColor(category)}20` }}>
          <Icon name={getCategoryIcon(category)} size={20} color={getCategoryColor(category)} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            {category}
          </h2>
          <p className="text-sm text-muted-foreground">
            {payloads?.length} payload{payloads?.length > 1 ? 's' : ''} available
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 auto-rows-fr">
        {payloads?.map((payload) => (
          <div key={payload?.id} className="relative flex">
            <PayloadCard 
              payload={payload} 
              onCopy={onCopy}
              isSelected={selectedPayloads?.includes(payload?.id)}
              onToggleSelect={() => onToggleSelect(payload?.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export default CategorySection;