"use client"
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
    <div className="max-w-sm border-4 border-black rounded-none bg-white transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 w-full border-b-4 border-black">
          {product.images?.length > 0 ? (
            <Image 
              src={product.images[0]}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="rounded-none"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed border-black w-full h-full flex items-center justify-center">
              <span className="text-black font-bold">No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h2 className="text-2xl font-extrabold text-black mb-3 uppercase tracking-tight hover:underline h-15">
            {product.title}
          </h2>
        </Link>
        
        {/* Description */}
        <p className="text-black text-base mb-5 font-medium leading-tight border-b-4 border-black pb-4 h-20">
          {product.description.substring(0, 100)}
          {product.description.length > 100 ? '...' : ''}
        </p>
        
        {/* Points */}
        <div className="mb-4">
          <span className="bg-yellow-300 text-black text-sm font-extrabold px-3 py-1 border-2 border-black">
            🔥 {points.toLocaleString()} POINTS
          </span>
          {/* <span className="ml-2 text-sm font-bold text-black">
            ({product.buyerCount} purchases)
          </span> */}
        </div>
        
        {/* Pricing */}
        <div className="flex items-center mb-6 gap-2  w-full  my-2">
          <Image
                   width={25}
                   height={25}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> <span className=' w-max text-3xl font-black'>
                    {product.price.toFixed(2)}
                   </span>
      
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-white text-black font-extrabold py-3 px-4 border-4 border-black hover:bg-gray-200 hover:border-b-8 hover:border-r-8 hover:border-black transition-all"
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
            className="flex-1 bg-green-400 text-black font-extrabold py-3 px-4 border-4 border-black text-center hover:bg-green-500 hover:border-b-8 hover:border-r-8 hover:border-black transition-all"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </div>
  )
}