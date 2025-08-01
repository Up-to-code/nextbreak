// components/orders/OrderStats.tsx
import React from 'react';
import { Order } from '@prisma/client';

interface OrderStatsProps {
  orders: Order[];
  statusCounts: {
    all: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
  };
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders, statusCounts }) => {
  const totalRevenue = orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.totalPrice, 0)
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  const avgOrderValue = orders.length > 0 
    ? (orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '$0.00';

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold">{orders.length}</p>
          <span className="px-2 py-1 bg-[#4ECDC4] border border-black text-sm font-bold">+12.5%</span>
        </div>
      </div>
      
      <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-semibold mb-2">In Progress</h3>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold">{statusCounts['in-progress']}</p>
          <span className="px-2 py-1 bg-[#FFD166] border border-black text-sm font-bold">+8.2%</span>
        </div>
      </div>
      
      <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold">{totalRevenue}</p>
          <span className="px-2 py-1 bg-[#06D6A0] border border-black text-sm font-bold">+5.7%</span>
        </div>
      </div>
      
      <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-semibold mb-2">Avg. Order Value</h3>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold">{avgOrderValue}</p>
          <span className="px-2 py-1 bg-[#118AB2] border border-black text-sm font-bold">+3.2%</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;