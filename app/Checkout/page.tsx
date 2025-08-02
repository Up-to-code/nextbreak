"use client";
import React, { useState, useEffect } from 'react';
import { useCartStore, CartItem } from '@/store/cartStore';
import { Trash2, Plus, Minus, Truck, Loader2, UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
 import { useRouter } from 'next/navigation';
import { AuthDialog } from '@/components/layout/AuthDialog';

const CheckoutPage = () => {
  const { data: session, status } = useSession();
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
    prepareOrderItems 
  } = useCartStore();

  const [customerInfo, setCustomerInfo] = useState({
    email: session?.user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authDialog, setAuthDialog] = useState<'signin' | 'signup' | null>(null);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      setCustomerInfo(prev => ({
        ...prev,
        email: session.user.email || ''
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode', 'country'];
    for (const field of requiredFields) {
      if (!customerInfo[field as keyof typeof customerInfo]) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    // Check if user is logged in
    if (!session) {
      setAuthDialog('signin');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: prepareOrderItems(),
        customer: customerInfo,
        paymentMethod: 'Cash on Delivery',
        total: totalPrice(),
        userId: session.user?.id || null
      };

      // Create WhatsApp message
      const message = `🛒 *New Order*\n\n` +
        `*Customer:* ${customerInfo.firstName} ${customerInfo.lastName}\n` +
        `*Phone:* ${customerInfo.phone}\n` +
        `*Email:* ${customerInfo.email}\n` +
        `*Address:* ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.zipCode}, ${customerInfo.country}\n\n` +
        `*Items:*\n${cartItems.map(item => `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n` +
        `*Total: ${totalPrice().toFixed(2)}*\n` +
        `*Payment: Cash on Delivery*`;

      const whatsappNumber = "1234567890"; // Replace with your WhatsApp number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
        alert('Order sent via WhatsApp! 📱');
        router.push('/orders');
      }, 1000);
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-black text-white px-8 py-3 font-bold border-4 border-black hover:bg-white hover:text-black transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-center mb-2 border-4 border-black bg-yellow-300 py-4 px-6 transform -rotate-1">
            CHECKOUT
          </h1>
          <p className="text-center text-gray-600">Complete your order below</p>
        </div>

        {!session && (
          <div className="bg-yellow-100 border-4 border-black p-4 mb-8 text-center">
            <p className="font-bold mb-2">You&lsquo;re not logged in!</p>
            <p className="mb-4">Please sign in to complete your order and track your purchases.</p>
            <button
              onClick={() => setAuthDialog('signin')}
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
              {cartItems.map((item: CartItem) => (
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
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
                      <p className="font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
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

            <div className="mt-6 pt-4 border-t-4 border-black">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>TOTAL:</span>
                <span className="bg-yellow-300 px-4 py-2 border-2 border-black">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-white border-4 border-black p-6">
            <h2 className="text-2xl font-bold mb-6 border-b-4 border-black pb-2">
              Customer Information
            </h2>

            {session && (
              <div className="bg-green-100 border-4 border-green-500 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">Logged in as {session.user?.name}</h3>
                    <p className="text-green-700 text-sm">{session.user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full border-2 border-black px-3 py-2"
                  required
                  disabled={!!session?.user?.email}
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full border-2 border-black px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
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
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={customerInfo.country}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-green-100 border-4 border-green-500 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Truck size={24} className="text-green-600" />
                    <div>
                      <h3 className="font-bold text-green-800">Cash on Delivery</h3>
                      <p className="text-green-700 text-sm">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isProcessing}
                className={`w-full mt-8 py-4 px-6 font-black text-xl border-4 border-black transition-colors
                  ${isProcessing 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-400 hover:bg-white hover:text-black'
                  }`}
              >
                {isProcessing ? (
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
      </div>

      {/* Auth Dialog */}
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