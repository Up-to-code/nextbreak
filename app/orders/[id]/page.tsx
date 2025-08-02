// app/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Truck, CheckCircle, Loader2, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/Button";
import { getOrderById } from "@/actions/order";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    title: string;
    images: string[];
  };
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: Date;
  shippingAddress: ShippingAddress | null;
  items: OrderItem[];
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(params.id);
        
        if (!orderData) {
          setError("Order not found");
          return;
        }

        if (orderData.userId !== session?.user?.id) {
          router.push("/orders");
          return;
        }

        setOrder(orderData);
      } catch (err) {
        setError("Failed to load order details");
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrder();
    }
  }, [params.id, session, status, router]);

  const handlePrint = () => {
    window.print();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-black" />
          <p className="mt-4 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center border-4 border-black bg-white p-8 max-w-md mx-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black mb-4">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push("/orders")}
              className="w-full"
            >
              Back to Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 print:py-0">
      <div className="max-w-4xl mx-auto px-4 print:px-0">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/orders")}
            className="border-4 border-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>

        <div className="bg-white border-4 border-black p-6 mb-8 print:border-0">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-black mb-2">Order #{order.id.slice(-8)}</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="border-4 border-black"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <div className="bg-yellow-100 border-4 border-black px-4 py-2">
                <span className="font-bold">{order.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border-4 border-black p-4">
              <h2 className="text-xl font-black mb-4">Shipping Information</h2>
              {order.shippingAddress ? (
                <div className="space-y-2">
                  <p className="font-bold">{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </div>

            <div className="border-4 border-black p-4">
              <h2 className="text-xl font-black mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Method:</span>
                  <span className="font-bold">{order.shippingMethod}</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-2 mt-2">
                  <span className="font-bold">Order Total:</span>
                  <span className="font-bold">SAR {order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-4 border-black p-4">
            <h2 className="text-xl font-black mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between border-b-2 border-black pb-4">
                  <div className="flex items-start gap-4">
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.title}
                        className="w-16 h-16 object-cover border-2 border-black"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 border-2 border-black flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold">{item.product.title}</h3>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">SAR {item.priceAtPurchase.toFixed(2)}</p>
                    <p className="text-gray-600">
                      SAR {(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center print:hidden">
          <Button
            onClick={() => router.push("/products")}
            className="border-4 border-black"
          >
            <Truck className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}