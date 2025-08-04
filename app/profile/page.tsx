"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User as UserIcon, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/Button";
import { getOrdersByUserId } from "@/actions/order";
import Image from "next/image";

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
  }[];
}

export default function ProfilePage() {
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
      fetchProfileData();
    }
  }, [status, router]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const orderData = await getOrdersByUserId(session?.user.id || "");
      setOrders(orderData);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border-4 border-black p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 border-4 border-black rounded-full flex items-center justify-center">
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-12 w-12 text-gray-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black mb-2">{session.user.name}</h1>
              <p className="text-gray-600 mb-4">{session.user.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 border-b-4 border-black pb-2">
              <ShoppingBag className="inline mr-2" />
              My Orders
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <Button 
                  className="bg-black text-white border-4 border-black hover:bg-white hover:text-black"
                  onClick={() => router.push("/products")}
                >
                  Shop Now
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border-2 border-black p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-yellow-100 px-3 py-1 border-2 border-black">
                        <span className="font-bold text-sm">{order.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {item.product.images?.[0] ? (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.title}
                              className="w-16 h-16 object-cover border-2 border-black"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 border-2 border-black"></div>
                          )}
                          <div>
                            <p className="font-medium">{item.product.title}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <p className="font-bold">Total:  <Image
                   width={20}
                   height={20}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> {order.totalPrice.toFixed(2)}</p>
                      <Button 
                        variant="outline" 
                        className="border-2 border-black hover:bg-gray-100"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-2 border-black hover:bg-red-100 hover:text-red-600"
            onClick={() => router.push("/api/auth/signout")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}