/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/orders/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { getOrderById, updateOrderStatus } from '@/actions/order';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, startTransition] = useTransition();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(id);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, newStatus);
      if (result.success && result.order) {
        setOrder({ ...order, status: result.order.status });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => router.push('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white min-h-screen">
      <Button 
        className="mb-4 flex items-center gap-2"
        onClick={() => router.back()}
        variant="outline"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="border-2 border-black p-4 rounded-lg mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
            <p className="text-gray-600 text-sm">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bg-yellow-100 px-3 py-1 border-2 border-black font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-black p-3 rounded">
            <h3 className="font-bold mb-2">Customer Information</h3>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Phone:</strong> {order.user.phone || 'N/A'}</p>
          </div>

          <div className="border border-black p-3 rounded">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <p><strong>Total:</strong> {formatCurrency(order.totalPrice)}</p>
            <p><strong>Items:</strong> {order.items.length}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        </div>

        <div className="border border-black p-3 rounded mb-4">
          <h3 className="font-bold mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                {item.product.images?.[0] && (
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                    className="w-16 h-16 object-cover border border-black"
                    width={64}
                    height={64}
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    
                  />
                )}
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {formatCurrency(item.priceAtPurchase)} each</p>
                  <p>Total: {formatCurrency(item.priceAtPurchase * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}