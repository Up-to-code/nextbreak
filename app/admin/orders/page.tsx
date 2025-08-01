// app/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import OrderTable from '../components/orders/OrderTable';
import OrderStats from '../components/orders/OrderStats';
import OrderFilters from '../components/orders/OrderFilters';
import OrderActions from '../components/orders/OrderActions';
import { getOrders, updateOrderStatus, OrderWithUser } from '../actions/actions';

export default function OrderManagement() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: activeFilter !== 'all' ? activeFilter : undefined,
        search: searchQuery || undefined
      });

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeFilter, searchQuery, pagination.page]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const statusCounts = {
    all: pagination.total,
    'in-progress': orders.filter(o => o.status === 'IN_PROGRESS').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl font-bold">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      <OrderStats orders={orders} statusCounts={statusCounts} />
      
      <OrderFilters 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusCounts={statusCounts}
      />
      
      <OrderTable 
        orders={orders} 
        updateOrderStatus={handleUpdateOrderStatus} 
      />
      
      <OrderActions />
    </div>
  );
}