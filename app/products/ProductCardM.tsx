"use client";
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

type Product = {
  id: string;
  title: string;
  images: string[];
  price: number;
  description: string;
  buyerCount: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCartStore()
  
  // Calculate points (5 points per SAR)
  const points = Math.round(product.price * 5)

  return (
    <div className="w-[140px] max-w-[140px] p-1 sm:w-full sm:max-w-xs md:max-w-sm border-2 sm:border-4 border-black rounded-none bg-white transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 sm:hover:-translate-y-1 group">
      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative h-20 sm:h-48 md:h-56 w-full border-b-2 sm:border-b-4 border-black overflow-hidden">
          {product.images?.length > 0 ? (
            <Image 
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover rounded-none group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 140px, (max-width: 768px) 320px, 384px"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed border-black w-full h-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-1 sm:p-4 md:p-5">
        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h2 className="text-xs sm:text-base md:text-lg font-extrabold text-black mb-1 sm:mb-2 md:mb-3 uppercase tracking-tight hover:underline line-clamp-2 h-8 sm:h-10 md:h-12">
            {product.title}
          </h2>
        </Link>
        
        {/* Description - Hidden on mobile, shown on larger screens */}
        <p className="hidden sm:block text-black text-sm md:text-base mb-3 md:mb-5 font-medium leading-tight border-b-2 md:border-b-4 border-black pb-2 md:pb-4 h-12 md:h-20">
          {product.description.substring(0, 100)}
          {product.description.length > 100 ? '...' : ''}
        </p>
        
        {/* Points and Buyer Count */}
        <div className="flex justify-between items-center mb-1 sm:mb-3 md:mb-4">
          <span className="bg-yellow-300 text-black text-[10px] sm:text-xs md:text-sm font-extrabold px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 border border-black sm:border-2">
            🔥 {points.toLocaleString()}
          </span>
          {product.buyerCount > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
              {product.buyerCount} bought
            </span>
          )}
        </div>
        
        {/* Pricing */}
        <div className="flex items-center mb-1 sm:mb-4 md:mb-6 gap-1 w-full">
          <Image
            width={12}
            height={12}
            className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6"
            src={"/SAR.svg"}
            alt="SAR currency"
          />
          <span className='text-sm sm:text-xl md:text-3xl font-black'>
            {product.price.toFixed(2)}
          </span>
        </div>
        
        {/* Action Buttons - Stack vertically on mobile */}
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 md:gap-3">
          <button 
            className="bg-white text-black font-extrabold py-1 px-1 text-[10px] sm:text-xs md:text-sm sm:py-2 md:py-3 sm:px-3 md:px-4 border border-black sm:border-2 md:border-4 hover:bg-gray-200 hover:border-b-2 hover:border-r-2 sm:hover:border-b-4 sm:hover:border-r-4 hover:border-black transition-all"
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id: product.id,
                name: product.title,
                price: product.price,
                image: product.images?.[0] || '/placeholder.jpg'
              });
            }}
          > 
            ADD TO CART
          </button>
          <Link 
            href={`/product/${product.id}`}
            className="bg-green-400 text-black font-extrabold py-1 px-1 text-[10px] sm:text-xs md:text-sm sm:py-2 md:py-3 sm:px-3 md:px-4 border border-black sm:border-2 md:border-4 text-center hover:bg-green-500 hover:border-b-2 hover:border-r-2 sm:hover:border-b-4 sm:hover:border-r-4 hover:border-black transition-all"
          >
            DETAILS
          </Link>
        </div>
      </div>
    </div>
  )
}