
// components/RelatedProducts.tsx
import React from 'react';
import { RelatedProductCard } from './RelatedProductCard';
import { RelatedProduct } from '../types/product';

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mt-16">
      <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,193,7,1)] mb-8">
        <h2 className="text-2xl font-black tracking-wider">COMPLETE YOUR SPACE</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <RelatedProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};