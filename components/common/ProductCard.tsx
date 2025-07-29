import Image from 'next/image'
import React from 'react'

export default function ProductCard() {
  return (
    <div className="max-w-sm border-4 border-black rounded-none bg-white ">
      {/* Product Image */}
      <div className="relative h-64 w-full border-b-4 border-black">
        <Image 
          src="/book.jpeg"
          alt="Book Cover"
          layout="fill"
          objectFit="cover"
          className="rounded-none"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-black mb-3 uppercase tracking-tight">Book Title</h2>
        
        {/* Description */}
        <p className="text-black text-base mb-5 font-medium leading-tight border-b-4 border-black pb-4">
          Short description with raw typography that doesn&apos;t care about line breaks.
        </p>
        
        {/* Points */}
        <div className="mb-4">
          <span className="bg-yellow-300 text-black text-sm font-extrabold px-3 py-1 border-2 border-black">
            🔥 500 POINTS
          </span>
        </div>
        
        {/* Pricing */}
        <div className="flex items-center mb-6 gap-2">
          <span className="text-3xl font-extrabold text-black">$100</span>
          <span className="text-lg font-bold text-black line-through">$120</span>
          <span className="text-sm font-extrabold bg-pink-400 text-black border-2 border-black px-2 py-0.5">
            SAVE 17%
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white text-black font-extrabold py-3 px-4 border-4 border-black hover:bg-gray-200 hover:border-b-8 hover:border-r-8 hover:border-black transition-all">
            ADD TO CART
          </button>
          <button className="flex-1 bg-green-400 text-black font-extrabold py-3 px-4 border-4 border-black hover:bg-green-500 hover:border-b-8 hover:border-r-8 hover:border-black transition-all">
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  )
}