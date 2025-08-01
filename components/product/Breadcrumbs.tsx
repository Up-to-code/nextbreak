// components/Breadcrumbs.tsx
import React from 'react';

interface BreadcrumbsProps {
  items: Array<{ label: string; active?: boolean }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="flex items-center text-sm font-bold mb-3">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className={item.active ? 'text-black' : 'text-gray-500'}>
            {item.label}
          </span>
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
