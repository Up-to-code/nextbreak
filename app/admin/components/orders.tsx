// components/orders.tsx
interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface LatestOrdersProps {
  orders: Order[];
}

export const LatestOrders = ({ orders }: LatestOrdersProps) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return dateObj.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'IN_PROGRESS': return 'text-yellow-600';
      case 'CANCELLED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-4 text-xl font-bold">Latest Orders</h2>
      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
              <div>
                <p className="font-bold">Order #{order.id.slice(-6)}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="font-bold">${order.totalPrice.toFixed(2)}</p>
                <p className={`text-right text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No orders found
          </div>
        )}
      </div>
      <button className="mt-4 w-full border-2 border-black bg-[#FFD166] py-2 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        View All Orders
      </button>
    </div>
  );
};