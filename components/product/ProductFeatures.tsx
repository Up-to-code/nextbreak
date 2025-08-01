// components/ProductFeatures.tsx
import React from 'react';

interface ProductFeaturesProps {
  features: string[];
}

export const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center bg-yellow-100 border-2 border-black p-2">
          <div className="w-6 h-6 bg-yellow-400 border-2 border-black mr-2 flex items-center justify-center">
            <span className="text-xs font-black">✓</span>
          </div>
          <span className="font-bold text-sm">{feature}</span>
        </div>
      ))}
    </div>
  );
};