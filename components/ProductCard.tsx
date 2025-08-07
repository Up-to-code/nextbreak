'use client'
import React, { useState } from 'react'
import { ShoppingCart, Zap, Star } from 'lucide-react'

interface ProductCardProps {
  title?: string
  price?: string
  points?: number
  image?: string
  onAddToCart?: () => void
  onBuyNow?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  title = "SKELETON 01",
  price = "$29",
  points = 0,
  image = "💀",
  onAddToCart,
  onBuyNow
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const handleAddToCart = async (): Promise<void> => {
    setIsAddingToCart(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    if (onAddToCart) onAddToCart()
    setIsAddingToCart(false)
  }

  const handleBuyNow = async (): Promise<void> => {
    setIsBuying(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    if (onBuyNow) onBuyNow()
    setIsBuying(false)
  }

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 relative text-sm">
        
        {/* Header */}
        <div className="bg-yellow-400 border-b-2 border-black p-2">
          <div className="flex justify-between items-center">
            <div className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-widest">
              HOT
            </div>
            <div className="bg-white border border-black px-2 py-0.5 flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" />
              <span className="font-bold text-xs">{points}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="h-32 bg-gradient-to-br from-pink-500 to-red-500 border-b-2 border-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="text-5xl transform hover:scale-105 transition-transform duration-300">
            {image}
          </div>
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 border border-black transform rotate-45" />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-white border border-black" />
        </div>

        {/* Content */}
        <div className="p-3 bg-white">
          <h3 className="text-lg font-black uppercase tracking-wide text-black mb-2 hover:text-red-600 transition-colors duration-200">
            {title}
          </h3>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-black">{price}</span>
              <div className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-black uppercase border border-black transform -rotate-2">
                SALE
              </div>
            </div>
            <div className="text-sm font-bold text-gray-600 line-through">$39.99</div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-white border-2 border-black text-black py-2 px-3 font-black uppercase tracking-wider text-xs hover:bg-yellow-400 transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>{isAddingToCart ? 'ADDING...' : 'ADD TO CART'}</span>
              </div>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isBuying}
              className="w-full bg-black border-2 border-black text-white py-2 px-3 font-black uppercase tracking-wider text-xs hover:bg-red-600 hover:border-red-600 transition-all duration-200 shadow-[2px_2px_0px_0px_#ff0000] hover:shadow-[3px_3px_0px_0px_#ff0000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_0px_#ff0000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                <span>{isBuying ? 'BUYING...' : 'BUY NOW'}</span>
              </div>
            </button>
          </div>

          {/* Shipping Note */}
          <div className="mt-4 pt-2 border-t-2 border-black border-dashed">
            <div className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase text-center">
              ⚡ FREE SHIPPING OVER $50 ⚡
            </div>
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-yellow-400 border border-black transform rotate-45" />
      </div>
    </div>
  )
}

export default ProductCard
