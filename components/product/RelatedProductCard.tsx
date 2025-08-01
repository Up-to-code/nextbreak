// components/RelatedProductCard.tsx
import React from 'react';
import { RelatedProduct } from '../types/product';
 
type RelatedProductCardProps = RelatedProduct

export const RelatedProductCard: React.FC<RelatedProductCardProps> = ({ name, price }) => {
  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-y-1">
      <div className="bg-gray-200 h-48 border-b-4 border-black"></div>
      <div className="p-4">
        <h3 className="font-black text-lg text-black mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-xl font-black text-black">${price}</p>
          <button className="bg-black text-white p-2 border-2 border-black">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};