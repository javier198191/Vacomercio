import React from 'react';

export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`bg-surface-container p-xs rounded-lg flex shadow-sm border border-outline-variant ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const btnClassBase = 'flex-1 py-sm font-label-bold text-label-bold rounded transition-all duration-200 text-center';
        const btnClass = isActive
          ? `${btnClassBase} bg-surface-container-lowest text-primary shadow-sm border border-outline-variant`
          : `${btnClassBase} text-on-surface-variant hover:text-primary`;

        return (
          <button
            key={tab.id}
            type="button"
            className={btnClass}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
export default Tabs;
