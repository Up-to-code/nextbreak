"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { getOrdersByUserId } from "@/actions/order";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
  items: {
    product: {
      title: string;
      images: string[];
    };
    quantity: number;
    priceAtPurchase: number;
  }[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrdersByUserId(session?.user.id || "");
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View your order history and track current orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => router.push("/products")}
                className="bg-black text-white hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-lg font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                      >
                        <div className="flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="h-16 w-16 rounded object-cover border"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded bg-gray-100 border" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.title}</h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × {formatCurrency(item.priceAtPurchase)}
                          </p>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.priceAtPurchase * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold">
                        Total: {formatCurrency(order.totalPrice)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}