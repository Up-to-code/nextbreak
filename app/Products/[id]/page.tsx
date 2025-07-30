'use client'

import Image from 'next/image'
import { ShoppingCart, Star, Zap, MessageSquare, Tag } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  points: number
  sku: string
  availability: string
  category: string
  tags: string[]
}

const product: Product = {
  id: 'prod-001',
  title: 'Brutalist Canvas Backpack',
  description:
    'Bold, rugged, and unapologetically raw. This backpack was built for brutalists on the move.',
  image: '/backpack.jpg', // Change to your product image
  price: 699,
  originalPrice: 899,
  rating: 4.7,
  reviewCount: 124,
  points: 80,
  sku: 'BKP-BRTLST-001',
  availability: 'In Stock',
  category: 'Accessories',
  tags: ['Canvas', 'Backpack', 'Limited', 'Unisex'],
}

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-black py-12 px-6 md:px-16 font-mono">
      <section className="max-w-6xl mx-auto bg-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_0px_black]">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="border-4 border-black p-4 bg-[#eaeaea]">
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">{product.title}</h1>
              <p className="text-base md:text-lg mb-4">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-400" />
                <span className="font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="line-through text-gray-500 text-lg">
                    EGP {product.originalPrice}
                  </p>
                )}
                <p className="text-3xl font-bold">EGP {product.price}</p>
                <p className="text-sm">+ {product.points} loyalty points</p>
              </div>

              {/* Meta Info */}
              <div className="mb-4 text-sm space-y-1">
                <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>Availability:</strong> {product.availability}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p className="flex items-center gap-1">
                  <Tag size={16} />
                  {product.tags.map(tag => (
                    <span key={tag} className="mr-2 underline">{tag}</span>
                  ))}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-black text-white border-4 border-black px-6 py-3 uppercase font-bold hover:bg-white hover:text-black transition-all">
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button className="flex items-center gap-2 bg-yellow-300 text-black border-4 border-black px-6 py-3 uppercase font-bold hover:bg-yellow-400 transition-all">
                <Zap size={20} />
                Buy Now
              </button>

              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white border-4 border-black px-6 py-3 uppercase font-bold hover:bg-green-600 transition-all"
              >
                <MessageSquare size={20} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Extra Details / Footer Info */}
        <div className="mt-12 border-t-4 border-black pt-6">
          <p className="uppercase font-bold text-lg">Shipping & Returns</p>
          <p className="text-sm">
            Ships within 2–3 business days. Returns accepted within 14 days. Brutalist packaging guaranteed.
          </p>
        </div>
      </section>
    </main>
  )
}
