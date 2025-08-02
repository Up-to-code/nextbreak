"use client";

import React, { useState, useTransition } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, Truck, Loader2, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/layout/AuthDialog";
import { createOrder } from "@/actions/order";
import { createAddress } from "@/actions/address";

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

  const [isPending, startTransition] = useTransition();
  const [authDialog, setAuthDialog] = useState<"signin" | "signup" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Saudi Arabia",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const requiredFields = ['street', 'city', 'state', 'postalCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        setErrorMessage(`Please fill in the ${field} field`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitOrder = () => {
    if (!session?.user?.id) {
      setAuthDialog("signin");
      return;
    }

    setErrorMessage("");
    
    if (!validateAddress()) {
      return;
    }

    startTransition(async () => {
      try {
        // Create shipping address
        const addressResult = await createAddress({
          userId: session.user.id,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          isDefault: false
        });

        if (!addressResult.success || !addressResult.address) {
          setErrorMessage(addressResult.error || "Failed to create shipping address");
          return;
        }

        // Prepare order items with required fields
        const orderItems = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        }));

        // Create order
        const result = await createOrder({
          userId: session.user.id,
          items: orderItems,
          totalPrice: totalPrice(),
          paymentMethod: "Cash on Delivery",
          shippingMethod: "Standard",
          shippingAddressId: addressResult.address.id
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
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-black text-white px-8 py-3 font-bold border-4 border-black hover:bg-white hover:text-black transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-center mb-2 border-4 border-black bg-yellow-300 py-4 px-6 transform -rotate-1">
            CHECKOUT
          </h1>
          <p className="text-center text-gray-600">Complete your order below</p>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border-4 border-red-500 p-4 mb-6">
            <p className="font-bold text-red-700">{errorMessage}</p>
          </div>
        )}

        {!session && (
          <div className="bg-yellow-100 border-4 border-black p-4 mb-8 text-center">
            <p className="font-bold mb-2">You&lsquo;re not logged in!</p>
            <p className="mb-4">Please sign in to complete your order and track your purchases.</p>
            <button
              onClick={() => setAuthDialog("signin")}
              className="bg-black text-white px-6 py-2 font-bold border-4 border-black hover:bg-yellow-300 hover:text-black transition-colors"
            >
              SIGN IN TO CONTINUE
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div className="bg-white border-4 border-black p-6">
            <h2 className="text-2xl font-bold mb-6 border-b-4 border-black pb-2">
              Order Summary ({totalItems()} items)
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="border-2 border-gray-300 p-4">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover border-2 border-black"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 border-2 border-black bg-white hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center border-2 border-black py-1"
                        min="1"
                      />

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 border-2 border-black bg-white hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
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

            <div className="mt-6 pt-4 border-t-4 border-black">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>TOTAL:</span>
                <span className="bg-yellow-300 px-4 py-2 border-2 border-black">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Confirmation */}
          <div className="bg-white border-4 border-black p-6">
            <h2 className="text-2xl font-bold mb-6 border-b-4 border-black pb-2">
              Shipping Information
            </h2>

            {session && (
              <div className="bg-green-100 border-4 border-green-500 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <UserIcon size={24} className="text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">Logged in as {session.user?.name}</h3>
                    <p className="text-green-700 text-sm">{session.user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-bold mb-2">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  className="w-full border-2 border-black px-3 py-2"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="w-full border-2 border-black px-3 py-2"
                  required
                  disabled
                />
              </div>
            </div>

            <div className="bg-green-100 border-4 border-green-500 p-4 mb-6">
              <div className="flex items-center gap-3">
                <Truck size={24} className="text-green-600" />
                <div>
                  <h3 className="font-bold text-green-800">Cash on Delivery</h3>
                  <p className="text-green-700 text-sm">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isPending}
              className={`w-full mt-4 py-4 px-6 font-black text-xl border-4 border-black transition-colors
                ${isPending
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
                `PLACE ORDER - $${totalPrice().toFixed(2)}`
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