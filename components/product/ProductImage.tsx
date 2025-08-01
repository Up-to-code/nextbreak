// components/ProductImage.tsx
 import React from 'react';
import { ProductBadge } from './ProductBadge';

interface ProductImageProps {
  src: string;
  alt: string;
  isLoading: boolean;
  onLoad: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  isLoading, 
  onLoad 
}) => {
  return (
    <div className="bg-yellow-400 border-4 sm:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
      <div className="relative">
        <img 
          src={src} 
          alt={alt}
          className={`w-full h-64 sm:h-80 lg:h-[500px] object-cover object-center transition-opacity duration-200 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
          onLoad={onLoad}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-400">
            <div className="border-4 border-black border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
      </div>
      
      <ProductBadge 
        text="🔥 HOT!" 
        bgColor="bg-red-500" 
        position="top-right" 
        rotation="rotate-3" 
      />
      <ProductBadge 
        text="✓ IN STOCK" 
        bgColor="bg-green-500" 
        position="bottom-left" 
        rotation="-rotate-3" 
      />
    </div>
  );
};