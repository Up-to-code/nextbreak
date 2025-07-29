"use client"
import React, { useState } from 'react';
import { CreditCard, Lock, ShoppingCart, User, Mail, Phone, MessageCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('ORDER COMPLETE!');
    }, 2000);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi! I need help with my order for SKELETON 01 sneakers ($29). Can you assist me?");
    const whatsappUrl = `https://wa.me/${formData.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-6 font-mono">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black mb-2">CHECKOUT</h1>
          <p className="text-sm font-bold text-gray-600">Complete your order below</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order Summary */}
        <div className="bg-gradient-to-b from-pink-500 to-red-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-white" />
            <h2 className="text-xl font-black text-white">ORDER</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border-2 border-black p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-black border border-black">HOT</span>
                <span className="bg-white text-black px-2 py-1 text-xs font-black border border-black">⭐ 150</span>
              </div>
              <div className="text-center mb-3">
                <div className="w-16 h-16 bg-pink-500 border-2 border-black mx-auto flex items-center justify-center mb-2">
                  <span className="text-2xl">💀</span>
                </div>
              </div>
              <h3 className="font-black text-lg">SKELETON 01</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-black">$29</span>
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-black">SALE</span>
              </div>
              <p className="text-sm text-gray-500 line-through">$39.99</p>
            </div>
            
            <div className="bg-white border-2 border-black p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Subtotal:</span>
                <span className="font-bold">$29.00</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Shipping:</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Tax:</span>
                <span className="font-bold">$2.32</span>
              </div>
              <div className="border-t-2 border-black pt-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black">TOTAL:</span>
                  <span className="text-xl font-black">$31.32</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black text-white p-3 text-center">
              <span className="text-sm font-bold">⚡ FREE SHIPPING OVER $50 ⚡</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6" />
            <h2 className="text-xl font-black">CUSTOMER</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-black mb-2">PHONE NUMBER</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-16 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="+1234567890"
                />
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 border-2 border-black hover:bg-green-400 transition-colors"
                  title="Open WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-black mb-2">FIRST NAME</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">LAST NAME</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-black mb-2">SHIPPING ADDRESS</label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-black mb-2">CITY</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">ZIP CODE</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6" />
            <h2 className="text-xl font-black">PAYMENT</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black mb-2">CARD NUMBER</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-black mb-2">EXPIRY</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black font-bold focus:outline-none focus:border-pink-500"
                  placeholder="123"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 border-2 border-black p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5" />
                <span className="font-black text-sm">SECURE PAYMENT</span>
              </div>
              <p className="text-xs font-bold text-gray-600">
                Your payment information is encrypted and secure
              </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full bg-black text-white font-black text-lg py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 disabled:opacity-50"
            >
              {isProcessing ? 'PROCESSING...' : 'BUY NOW ⚡'}
            </button>
            
            <button
              type="button"
              className="w-full bg-white text-black font-black text-lg py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
            >
              🛒 ADD TO CART
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-black text-white border-4 border-black p-4 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-sm">
            © 2025 SKELETON ACADEMY • ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </div>
  );
}