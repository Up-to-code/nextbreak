"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, Truck, Loader2, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/layout/AuthDialog";
import { createOrder } from "@/actions/order";
import Image from "next/image";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCartStore();

  const [isPending, setIsPending] = useState(false);
  const [authDialog, setAuthDialog] = useState<"signin" | "signup" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate points earned (1 point for every 5 SAR)
  const pointsEarned = Math.floor(totalPrice() / 5);

  const handleSubmitOrder = async () => {
    if (!session?.user?.id) {
      setAuthDialog("signin");
      return;
    }

    setErrorMessage("");
    setIsPending(true);

    try {
      // Prepare order items
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      }));

      // Create order
      const result = await createOrder({
        userId: session.user.id,
        items: orderItems,
        totalPrice: totalPrice(),
        paymentMethod: "Cash on Delivery",
        shippingMethod: "Standard",
      });

      if (result.success) {
        clearCart();
        router.push(`/order-confirmation/${result.order?.id}`);
      } else {
        setErrorMessage(result.error || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to get started!
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-black text-white px-6 py-3 font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black mb-2 bg-yellow-300 py-3 px-5 inline-block border-2 border-black">
            CHECKOUT
          </h1>
          <p className="text-gray-600 mt-2">Complete your order below</p>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border-2 border-red-500 p-3 mb-5">
            <p className="font-bold text-red-700">{errorMessage}</p>
          </div>
        )}

        {!session && (
          <div className="bg-yellow-100 border-2 border-black p-3 mb-6 text-center">
            <p className="font-bold mb-1">You&apos;re not logged in!</p>
            <p className="mb-3">Please sign in to complete your order</p>
            <button
              onClick={() => setAuthDialog("signin")}
              className="bg-black text-white px-4 py-1.5 font-bold border-2 border-black hover:bg-yellow-300 hover:text-black transition-colors"
            >
              SIGN IN
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-5">
          {/* Cart Summary */}
          <div className="bg-white border-2 border-black p-4 flex-1">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">
              Order Summary ({totalItems()} items)
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-300 p-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover border border-black"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-600">
                        SAR {item.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-7 h-7 border border-black bg-white hover:bg-gray-100 flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-12 text-center border border-black py-1"
                        min="1"
                      />

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-7 h-7 border border-black bg-white hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="font-bold">
                        SAR {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Points Section - Added Here */}
            <div className="mt-4 p-3 bg-yellow-50 border-2 border-dashed border-yellow-300 flex items-center">
              <div className="mr-3">
                <Image 
                  width={40} 
                  height={40} 
                  src={"/points.jpg"} 
                  alt="Reward Points" 
                  className="border border-gray-300"
                />
              </div>
              <div>
                <p className="font-bold text-yellow-700">
                  You&lsquo;ll earn <span className="text-lg">{pointsEarned} points</span>
                </p>
                <p className="text-sm text-yellow-600">
                  (1 point for every 5 SAR spent)
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t-2 border-black">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>TOTAL:</span>
                <span className="bg-yellow-300 px-3 py-1 border border-black">
                  SAR {totalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Confirmation */}
          <div className="bg-white border-2 border-black p-4 w-full md:w-[300px]">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">
              Confirm Order
            </h2>

            {session && (
              <div className="bg-green-100 border border-green-500 p-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <UserIcon size={18} className="text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">Logged in as</h3>
                    <p className="text-green-700">{session.user?.name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-100 border border-green-500 p-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-green-600" />
                <div>
                  <h3 className="font-bold text-green-800">Cash on Delivery</h3>
                  <p className="text-green-700">Pay when you receive</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isPending}
              className={`w-full mt-3 py-3 px-4 font-bold text-lg border-2 border-black transition-colors
                ${
                  isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-400 hover:bg-white hover:text-black"
                }`}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  PROCESSING...
                </span>
              ) : (
                `PLACE ORDER - SAR ${totalPrice().toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>

      {authDialog && (
        <AuthDialog
          mode={authDialog}
          onClose={() => setAuthDialog(null)}
          onSwitchMode={() =>
            setAuthDialog(authDialog === "signin" ? "signup" : "signin")
          }
        />
      )}
    </div>
  );
};

export default CheckoutPage;