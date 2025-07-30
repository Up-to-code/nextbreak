'use client'

import Image from 'next/image'
import { ShoppingCart, Star, Zap } from 'lucide-react'

interface ProductDetailsProps {
  title: string
  description: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  points: number
}

export default function ProductDetails({
  title,
  description,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  points,
}: ProductDetailsProps) {
  return (
    <section className="max-w-5xl mx-auto p-6 md:p-12 bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="border-4 border-black bg-[#f1f1f1] p-4">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="object-cover w-full h-auto"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold uppercase mb-2">{title}</h1>
            <p className="text-base md:text-lg font-mono mb-4">{description}</p>

            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-400" />
              <span className="font-bold">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
            </div>

            <div className="mb-4">
              {originalPrice && originalPrice > price && (
                <p className="text-lg line-through text-gray-500">EGP {originalPrice}</p>
              )}
              <p className="text-2xl font-bold">EGP {price}</p>
              <p className="text-sm font-mono">+ {points} Points</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4 flex-wrap">
            <button className="flex items-center gap-2 bg-black text-white border-4 border-black px-6 py-3 uppercase font-bold hover:bg-white hover:text-black transition-all">
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button className="flex items-center gap-2 bg-yellow-300 text-black border-4 border-black px-6 py-3 uppercase font-bold hover:bg-yellow-400 transition-all">
              <Zap size={20} />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
