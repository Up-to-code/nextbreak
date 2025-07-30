"use client"
import React, { useState, useEffect } from 'react';

const NeoBrutalProductPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedColor, setSelectedColor] = useState('oak');
  const [selectedMaterial, setSelectedMaterial] = useState('cotton');

  const product = {
    name: "MINIMALIST CHAIR",
    price: 89,
    originalPrice: 120,
    description: "A clean, functional chair designed for modern living spaces. Crafted with sustainability in mind, each piece is made to last generations while providing exceptional comfort.",
    details: {
      dimensions: "20″W × 22″D × 32″H",
      materials: "Solid oak wood, organic cotton upholstery",
      weight: "15 lbs",
      care: "Wipe clean with damp cloth",
      assembly: "15-20 minutes",
      warranty: "5 years limited"
    },
    features: [
      "HANDCRAFTED JOINERY",
      "NON-TOXIC FINISHES",
      "ERGONOMIC DESIGN",
      "SUSTAINABLE MATERIALS"
    ],
    colors: [
      { id: 'oak', name: 'Natural Oak', hex: '#D1A783' },
      { id: 'walnut', name: 'Dark Walnut', hex: '#3E2723' },
      { id: 'white', name: 'Arctic White', hex: '#FFFFFF' }
    ],
    materials: [
      { id: 'cotton', name: 'Organic Cotton' },
      { id: 'linen', name: 'Premium Linen' },
      { id: 'velvet', name: 'Recycled Velvet' }
    ],
    reviews: [
      { rating: 5, name: "Alex J.", comment: "Perfect balance of comfort and style!", date: "2025-07-15" },
      { rating: 4, name: "Sam T.", comment: "Love the design but assembly was tricky", date: "2025-06-22" },
      { rating: 5, name: "Jordan K.", comment: "Worth every penny. Gets compliments daily!", date: "2025-07-01" }
    ]
  };

  const productImages = [
    '/api/placeholder/500/600?text=Chair+Front',
    '/api/placeholder/500/600?text=Chair+Side',
    '/api/placeholder/500/600?text=Chair+Angle',
    '/api/placeholder/500/600?text=Chair+Detail'
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    // Add haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const handleImageChange = (index: number) => {
    setImageLoading(true);
    setSelectedImage(index);
    setTimeout(() => setImageLoading(false), 200);
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">


      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Product Gallery */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative">
              <div className="bg-yellow-400 border-4 sm:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                <div className="relative">
                  <img 
                    src={productImages[selectedImage]} 
                    alt={product.name}
                    className={`w-full h-64 sm:h-80 lg:h-[500px] object-cover object-center transition-opacity duration-200 ${
                      imageLoading ? 'opacity-50' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-yellow-400">
                      <div className="border-4 border-black border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 border-4 border-black font-black text-sm transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  🔥 HOT!
                </div>
                
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 border-4 border-black font-black text-sm transform -rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  ✓ IN STOCK
                </div>
              </div>
              
              {/* Image navigation arrows */}
              <button
                onClick={() => handleImageChange(selectedImage > 0 ? selectedImage - 1 : productImages.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleImageChange(selectedImage < productImages.length - 1 ? selectedImage + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex flex-wrap gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`relative border-4 transition-all transform hover:scale-105 active:scale-95 ${
                    selectedImage === index 
                      ? 'border-yellow-400 shadow-[4px_4px_0px_0px_rgba(255,193,7,1)]' 
                      : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`View ${index + 1}`} 
                    className="w-20 h-20 object-cover object-center" 
                  />
                  {selectedImage === index && (
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-yellow-400 border-2 border-black flex items-center justify-center">
                      <div className="w-2 h-2 bg-black"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm font-bold mb-3">
                <span className="text-gray-500">Home</span>
                <span className="mx-2">/</span>
                <span className="text-gray-500">Furniture</span>
                <span className="mx-2">/</span>
                <span className="text-black">Chairs</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-wider">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {renderStars(4.8)}
                  <span className="ml-2 font-bold text-sm">(42 reviews)</span>
                </div>
                <span className="text-sm font-bold text-green-700 bg-green-200 px-2 py-1 border-2 border-black">
                  ★ BESTSELLER
                </span>
              </div>
              
              <p className="text-lg font-bold text-black leading-relaxed mb-6">
                {product.description}
              </p>
   
              
              {/* Features grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-yellow-100 border-2 border-black p-2">
                    <div className="w-6 h-6 bg-yellow-400 border-2 border-black mr-2 flex items-center justify-center">
                      <span className="text-xs font-black">✓</span>
                    </div>
                    <span className="font-bold text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

   

            {/* Quantity and Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <h3 className="font-black text-black">QUANTITY:</h3>
                <div className="flex items-center border-4 border-black bg-white">
                  <button 
                    onClick={decrementQuantity}
                    className="px-4 py-2 font-black text-lg hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-lg w-12 text-center">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="px-4 py-2 font-black text-lg hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`py-4 px-6 border-4 border-black font-black text-lg tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    isAddedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-400 text-black hover:bg-yellow-300'
                  }`}
                >
                  {isAddedToCart ? '✓ ADDED TO CART!' : '🛒 ADD TO CART'}
                </button>
                
                <button className="py-4 px-6 bg-black text-white border-4 border-black font-black text-lg tracking-wider shadow-[8px_8px_0px_0px_rgba(255,193,7,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,193,7,1)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  ⚡ BUY NOW
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 bg-pink-300 text-black border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all transform active:scale-[0.98]">
                  💝 WISHLIST
                </button>
                <button className="py-3 px-4 bg-cyan-300 text-black border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all transform active:scale-[0.98]">
                  📤 SHARE
                </button>
              </div>
            </div>
            
            {/* Product highlights */}
            {/* <div className="border-4 border-black p-4 bg-blue-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center mr-2">
                  <span className="font-black">✓</span>
                </div>
                <h3 className="font-black text-lg">FREE SHIPPING</h3>
              </div>
              <p className="font-bold pl-10">On all orders over $50. Delivered in 3-5 business days.</p>
            </div> */}


            
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-16 bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-black mb-8 tracking-wider">PRODUCT DETAILS</h2>
 

          {/* Customer Reviews */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-black mb-2 tracking-wider">CUSTOMER REVIEWS</h3>
                <div className="flex items-center">
                  {renderStars(4.8)}
                  <span className="ml-2 font-bold">4.8 out of 5 • 42 reviews</span>
                </div>
              </div>
              <button className="mt-4 sm:mt-0 py-3 px-6 bg-yellow-400 border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                ✍️ WRITE A REVIEW
              </button>
            </div>
            
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div key={index} className="bg-gray-100 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <h4 className="font-black">{review.name}</h4>
                    </div>
                    <span className="text-sm text-gray-600">{review.date}</span>
                  </div>
                  <p className="font-bold">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="py-3 px-8 bg-white border-4 border-black font-black hover:bg-gray-100">
                LOAD MORE REVIEWS
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,193,7,1)] mb-8">
            <h2 className="text-2xl font-black tracking-wider">COMPLETE YOUR SPACE</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "MINIMALIST DESK", price: 249 },
              { name: "MODERN SOFA", price: 899 },
              { name: "SHELF UNIT", price: 149 },
              { name: "COFFEE TABLE", price: 129 }
            ].map((item, index) => (
              <div key={index} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-y-1">
                <div className="bg-gray-200 h-48 border-b-4 border-black"></div>
                <div className="p-4">
                  <h3 className="font-black text-lg text-black mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-black text-black">${item.price}</p>
                    <button className="bg-black text-white p-2 border-2 border-black">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-3 z-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-black text-black">${product.price}</p>
              {quantity > 1 && (
                <p className="text-sm font-bold">${product.price * quantity} total</p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <div className="flex items-center border-2 border-black bg-white">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-1 font-black hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 font-bold w-8 text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-1 font-black hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className={`py-3 px-4 border-4 border-black font-black text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  isAddedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-400 text-black'
                }`}
              >
                {isAddedToCart ? '✓ ADDED!' : '🛒 ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeoBrutalProductPage;