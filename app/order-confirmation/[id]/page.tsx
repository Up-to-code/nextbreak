"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/actions/order";
import { Truck, CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  userId: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: Date;
  shippingAddress: ShippingAddress | null;
  items: OrderItem[];
}

function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-bold transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function OrderConfirmationPage({
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
    // Wait for session to load before checking
    if (status === "loading") return;

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

    fetchOrder();
  }, [params.id, session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
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
              className="bg-black text-white border-4 border-black hover:bg-white hover:text-black w-full"
            >
              View Your Orders
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-yellow-400 border-4 border-black hover:bg-yellow-300 w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-black mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        <div className="bg-white border-4 border-black p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold">Order #{order.id.slice(-8)}</h2>
              <p className="text-gray-600">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
            <div className="bg-yellow-100 border-2 border-black px-3 py-1">
              <span className="font-bold">{order.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-2">
                Shipping Information
              </h3>
              {order.shippingAddress ? (
                <div className="space-y-2">
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </p>
                  <p>
                    {order.shippingAddress.state}, {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-2">
                Order Details
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-bold">Items:</span> {order.items.length}
                </p>
                <p>
                  <span className="font-bold">Total:</span>         <Image
                   width={20}
                   height={20}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> {order.totalPrice.toFixed(2)}
                </p>
                <p>
                  <span className="font-bold">Payment Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="font-bold">Shipping Method:</span> {order.shippingMethod}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-2">
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.title}
                        className="w-16 h-16 object-cover border-2 border-black"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 border-2 border-black flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold">{item.product.title}</h4>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold"> <Image
                   width={20}
                   height={20}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> {item.priceAtPurchase.toFixed(2)}</p>
                    <p className="text-gray-600">
                    <Image
                   width={20}
                   height={20}
                   src={"/24 PX.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> {(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-black text-white border-4 border-black hover:bg-white hover:text-black"
          >
            <Truck className="mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}