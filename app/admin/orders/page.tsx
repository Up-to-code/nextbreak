'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrderWithUser } from '@/actions/actions';
import { formatDate, formatCurrency, truncateText } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, ArrowRight, ShoppingBag } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/actions/actions';

type SafeOrderWithUser = Omit<OrderWithUser, 'shippingMethod' | 'shippingAddress' | 'shippingAddressId'> & {
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    product?: {
      id: string;
      title: string;
      images?: string[];
    };
  }>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<SafeOrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: activeFilter !== 'all' ? activeFilter : undefined,
        search: searchQuery || undefined
      });
      
      setOrders(data.orders as unknown as SafeOrderWithUser[]);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFilter, searchQuery, pagination.page]);

  const statusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-black rounded-lg"
            />
          </div>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[180px] border border-black">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-2 border-black rounded-lg overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="border-r border-black p-2">Order</TableHead>
              <TableHead className="border-r border-black p-2">Customer</TableHead>
              <TableHead className="border-r border-black p-2">Date</TableHead>
              <TableHead className="border-r border-black p-2">Items</TableHead>
              <TableHead className="border-r border-black p-2">Total</TableHead>
              <TableHead className="border-r border-black p-2">Status</TableHead>
              <TableHead className="p-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-3" />
                    <h3 className="text-base md:text-lg font-medium">No orders found</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {searchQuery ? 'Try a different search' : 'No orders match your filters'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-b border-black">
                  <TableCell className="border-r border-black p-2 font-medium">
                    #{truncateText(order.id, 10)}
                  </TableCell>
                  <TableCell className="border-r border-black p-2">
                    <div className="font-medium">{order.user.name}</div>
                    <div className="text-gray-500 text-xs">{order.user.email}</div>
                  </TableCell>
                  <TableCell className="border-r border-black p-2">
                    {formatDate(order.createdAt.toString())}
                  </TableCell>
                  <TableCell className="border-r border-black p-2">
                    <div className="flex -space-x-1">
                      {order.items.slice(0, 3).map((item, index) => {
                        const product = item.product;
                        const firstImage = product?.images?.[0];
                        const productTitle = product?.title || 'Unknown Product';
                        
                        return (
                          <div key={item.id} className="relative">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={productTitle}
                                className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white"
                              />
                            ) : (
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                <ShoppingBag className="h-3 w-3 text-gray-500" />
                              </div>
                            )}
                            {index === 2 && order.items.length > 3 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-xxs">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-1 text-xxs md:text-xs">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="border-r border-black p-2">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                  <TableCell className="border-r border-black p-2">
                    <Badge className={`${statusBadge(order.status)} rounded-lg`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-2">
                    <Button
             
                      className="text-black flex items-center gap-1"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      View <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {orders.length} of {pagination.total} orders
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}