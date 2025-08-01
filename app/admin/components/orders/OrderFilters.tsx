// components/orders/OrderFilters.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface OrderFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusCounts: {
    all: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
  };
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  statusCounts
}) => {
  return (
    <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-lg focus:outline-none"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 border-2 border-black font-bold ${
              activeFilter === 'all' 
                ? 'bg-[#4ECDC4] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All ({statusCounts.all})
          </button>
          
          <button 
            className={`px-4 py-2 border-2 border-black font-bold ${
              activeFilter === 'in-progress' 
                ? 'bg-[#FFD166] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => setActiveFilter('in-progress')}
          >
            In Progress ({statusCounts['in-progress']})
          </button>
          
          <button 
            className={`px-4 py-2 border-2 border-black font-bold ${
              activeFilter === 'completed' 
                ? 'bg-[#06D6A0] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed ({statusCounts.completed})
          </button>
          
          <button 
            className={`px-4 py-2 border-2 border-black font-bold ${
              activeFilter === 'cancelled' 
                ? 'bg-[#EF476F] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => setActiveFilter('cancelled')}
          >
            Cancelled ({statusCounts.cancelled})
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;