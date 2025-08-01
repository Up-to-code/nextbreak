"use client"
// components/MobileBottomBar.tsx
import React from 'react';
import { QuantitySelector } from './QuantitySelector';

interface MobileBottomBarProps {
  price: number;
  quantity: number;
  isAddedToCart: boolean;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  price,
  quantity,
  isAddedToCart,
  onAddToCart,
  onIncrement,
  onDecrement
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-3 z-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-black text-black">${price}</p>
          {quantity > 1 && (
            <p className="text-sm font-bold">${price * quantity} total</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <div className="flex items-center border-2 border-black bg-white">
            <button 
              onClick={onDecrement}
              className="px-3 py-1 font-black hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-3 py-1 font-bold w-8 text-center">{quantity}</span>
            <button 
              onClick={onIncrement}
              className="px-3 py-1 font-black hover:bg-gray-100"
            >
              +
            </button>
          </div>
          
          <button
            onClick={onAddToCart}
            className={`py-3 px-4 border-4 border-black font-black text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              isAddedToCart
                ? 'bg-green-500 text-white'
                : 'bg-yellow-400 text-black'
            }`}
          >
            {isAddedToCart ? '✓ ADDED!' : '🛒 ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
};