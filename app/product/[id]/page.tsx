



// Main Component: NeoBrutalProductPage.tsx
"use client"
import { Breadcrumbs } from '@/components/product/Breadcrumbs';
import { CustomerReviews } from '@/components/product/CustomerReviews';
import { MobileBottomBar } from '@/components/product/MobileBottomBar';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductFeatures } from '@/components/product/ProductFeatures';
import { ProductGallery } from '@/components/product/ProductGallery';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { StarRating } from '@/components/product/StarRating';
import { Product, RelatedProduct } from '@/components/types/product';
import React, { useState, useEffect } from 'react';


const NeoBrutalProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const product: Product = {
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

  const relatedProducts: RelatedProduct[] = [
    { name: "MINIMALIST DESK", price: 249 },
    { name: "MODERN SOFA", price: 899 },
    { name: "SHELF UNIT", price: 149 },
    { name: "COFFEE TABLE", price: 129 }
  ];

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Furniture" },
    { label: "Chairs", active: true }
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

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Product Gallery */}
          <ProductGallery images={productImages} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <Breadcrumbs items={breadcrumbItems} />
              
              <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-wider">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <StarRating rating={4.8} />
                  <span className="ml-2 font-bold text-sm">(42 reviews)</span>
                </div>
                <span className="text-sm font-bold text-green-700 bg-green-200 px-2 py-1 border-2 border-black">
                  ★ BESTSELLER
                </span>
              </div>
              
              <p className="text-lg font-bold text-black leading-relaxed mb-6">
                {product.description}
              </p>
              
              <ProductFeatures features={product.features} />
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-4">
              <QuantitySelector
                quantity={quantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
              />
              
              <ProductActions
                isAddedToCart={isAddedToCart}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-16 bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-black mb-8 tracking-wider">PRODUCT DETAILS</h2>
          
          <CustomerReviews
            reviews={product.reviews}
            averageRating={4.8}
            totalReviews={42}
          />
        </div>

        {/* <RelatedProducts products={relatedProducts} /> */}
      </div>

      {/* Sticky Mobile Bottom Bar */}
      {isMobile && (
        <MobileBottomBar
          price={product.price}
          quantity={quantity}
          isAddedToCart={isAddedToCart}
          onAddToCart={handleAddToCart}
          onIncrement={incrementQuantity}
          onDecrement={decrementQuantity}
        />
      )}
    </div>
  );
};

export default NeoBrutalProductPage;