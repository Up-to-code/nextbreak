"use client"
// components/ProductActions.tsx
import React from 'react';

interface ProductActionsProps {
  isAddedToCart: boolean;
  onAddToCart: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ 
  isAddedToCart, 
  onAddToCart 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onAddToCart}
          className={`py-4 px-6 border-4 border-black font-black text-lg tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isAddedToCart
              ? 'bg-green-500 text-white'
              : 'bg-yellow-400 text-black hover:bg-yellow-300'
          }`}
        >
          {isAddedToCart ? '✓ ADDED TO CART!' : '🛒 ADD TO CART'}
        </button>
        
        <button className="py-4 px-6 bg-black text-white border-4 border-black font-black text-lg tracking-wider shadow-[8px_8px_0px_0px_rgba(255,193,7,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,193,7,1)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">
          ⚡ BUY NOW
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 px-4 bg-pink-300 text-black border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all transform active:scale-[0.98]">
          💝 WISHLIST
        </button>
        <button className="py-3 px-4 bg-cyan-300 text-black border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all transform active:scale-[0.98]">
          📤 SHARE
        </button>
      </div>
    </>
  );
};
