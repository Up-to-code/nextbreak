// components/orders/OrderActions.tsx
import React from 'react';
import { FaPlus, FaFileExport, FaPrint, FaFilter } from 'react-icons/fa';

const OrderActions = () => {
  return (
    <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button className="flex items-center justify-center px-4 py-2 border-2 border-black bg-[#06D6A0] font-bold hover:bg-[#05c595] transition-colors">
          <FaPlus className="mr-2" /> Create New Order
        </button>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="flex items-center px-4 py-2 border-2 border-black bg-white font-bold hover:bg-gray-100">
            <FaFileExport className="mr-2" /> Export
          </button>
          <button className="flex items-center px-4 py-2 border-2 border-black bg-white font-bold hover:bg-gray-100">
            <FaPrint className="mr-2" /> Print
          </button>
          <button className="flex items-center px-4 py-2 border-2 border-black bg-white font-bold hover:bg-gray-100">
            <FaFilter className="mr-2" /> Advanced Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderActions;