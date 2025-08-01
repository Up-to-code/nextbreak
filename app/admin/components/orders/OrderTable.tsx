import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaCheck } from 'react-icons/fa';
import { Order, OrderStatus, User, Product } from '@prisma/client';

interface OrderWithUser {
  id: string;
  userId: string;
  totalPrice: number;
  pointsEarned: number;
  status: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddressId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  items: Array<{
    id: string;
    title: string;
    price: number;
    images: string[];
  }>;
}

interface OrderTableProps {
  orders: OrderWithUser[];
  updateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, updateOrderStatus }) => {
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>(orders[0]?.status || 'IN_PROGRESS');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    setEditingOrder(orderId);
    setNewStatus(currentStatus);
  };

  const saveStatusChange = (orderId: string) => {
    updateOrderStatus(orderId, newStatus);
    setEditingOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-[#FFD166]';
      case 'COMPLETED': return 'bg-[#06D6A0]';
      case 'CANCELLED': return 'bg-[#EF476F]';
      default: return 'bg-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="rounded-lg border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2 border-black">
            <tr>
              <th className="py-3 px-4 text-left font-bold w-8"></th>
              <th className="py-3 px-4 text-left font-bold">Order ID</th>
              <th className="py-3 px-4 text-left font-bold">Customer</th>
              <th className="py-3 px-4 text-left font-bold">Date</th>
              <th className="py-3 px-4 text-left font-bold">Status</th>
              <th className="py-3 px-4 text-left font-bold">Items</th>
              <th className="py-3 px-4 text-right font-bold">Amount</th>
              <th className="py-3 px-4 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => toggleOrderDetails(order.id)}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        <FaChevronDown 
                          className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold">{order.id}</td>
                    <td className="py-3 px-4">{order.user.name}</td>
                    <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      {editingOrder === order.id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            className="border-2 border-black p-1 rounded"
                          >
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => saveStatusChange(order.id)}
                            className="p-1 bg-[#06D6A0] border border-black"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className={`px-3 py-1 rounded-full text-sm font-bold border border-black ${getStatusColor(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{order.items.length}</td>
                    <td className="py-3 px-4 text-right font-bold">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleStatusChange(order.id, order.status)}
                          className="p-2 rounded-lg border-2 border-black bg-white hover:bg-gray-100"
                          title="Edit Status"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="p-2 rounded-lg border-2 border-black bg-white hover:bg-gray-100"
                          title="Delete Order"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-bold mb-2">Customer Information</h3>
                            <p className="text-sm">{order.user.name}</p>
                            <p className="text-sm text-gray-600">{order.user.email}</p>
                            <p className="text-sm text-gray-600">{order.user.phone}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-bold mb-2">Order Details</h3>
                            <p className="text-sm"><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
                            <p className="text-sm"><span className="font-semibold">Shipping:</span> {order.shippingMethod}</p>
                            <p className="text-sm"><span className="font-semibold">Items:</span> {order.items.length}</p>
                            <p className="text-sm"><span className="font-semibold">Points Earned:</span> {order.pointsEarned}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-bold mb-2">Shipping Address</h3>
                            <p className="text-sm">123 Main Street</p>
                            <p className="text-sm">Anytown, ST 12345</p>
                            <p className="text-sm">United States</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 px-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-black bg-[#FFD166] flex items-center justify-center mb-4">
                      <span className="text-xl">📦</span>
                    </div>
                    <p className="text-lg font-bold">No orders found</p>
                    <p className="text-gray-600">Try changing your filters or search query</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      {orders.length > 0 && (
        <div className="border-t-2 border-black p-4 bg-[#f5f5f5] flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-sm">
              Showing <span className="font-bold">1-{orders.length}</span> of{' '}
              <span className="font-bold">{orders.length}</span> orders
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border-2 border-black bg-white font-bold hover:bg-gray-100">
              <span className="mr-2">⬅</span> Previous
            </button>
            <button className="px-4 py-2 border-2 border-black bg-[#4ECDC4] font-bold">
              1
            </button>
            <button className="px-4 py-2 border-2 border-black bg-white font-bold hover:bg-gray-100">
              2
            </button>
            <button className="flex items-center px-4 py-2 border-2 border-black bg-white font-bold hover:bg-gray-100">
              Next <span className="ml-2">➡</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;