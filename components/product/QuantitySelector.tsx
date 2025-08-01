// components/QuantitySelector.tsx
import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrement, 
  onDecrement 
}) => {
  return (
    <div className="flex items-center space-x-4">
      <h3 className="font-black text-black">QUANTITY:</h3>
      <div className="flex items-center border-4 border-black bg-white">
        <button 
          onClick={onDecrement}
          className="px-4 py-2 font-black text-lg hover:bg-gray-100"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-4 py-2 font-bold text-lg w-12 text-center">{quantity}</span>
        <button 
          onClick={onIncrement}
          className="px-4 py-2 font-black text-lg hover:bg-gray-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};
