// app/admin/carousel/page.tsx
import React from 'react'
import { Plus, ExternalLink } from 'lucide-react'
import { getAllCarouselItems } from '@/actions/carousel' // Only import what's needed
import Link from 'next/link'
import CarouselItemCard from './CarouselItemCard'
import { CarouselItem } from './types'

export default async function AdminCarouselPage() {
  let carouselItems: CarouselItem[] = []
  
  try {
    const result = await getAllCarouselItems()
    carouselItems = Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Failed to fetch carousel items:", error)
    carouselItems = []
  }

  // Filter valid items
  const validItems = carouselItems.filter(item => 
    item && item.id && typeof item.id === 'string'
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-[6px] border-black rounded-none p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-black mb-2">Carousel Management</h1>
              <p className="text-gray-600">Manage your carousel advertisements and images</p>
            </div>
            <Link
              href="/admin/carousel/new"
              className="bg-green-500 text-black border-[4px] border-black px-6 py-3 font-extrabold hover:bg-green-400 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Item
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border-[4px] border-black p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 border-[3px] border-black">
                <ExternalLink size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-2xl">{validItems.length}</p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Carousel Items */}
        <div className="bg-white border-[4px] border-black rounded-none p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-black">All Carousel Items</h2>
            <span className="bg-blue-500 text-black px-3 py-1 border-[3px] border-black font-bold text-sm">
              {validItems.length} Items
            </span>
          </div>
          
          {validItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ExternalLink size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No carousel items</p>
              <p className="text-sm">Add some items to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validItems.map((item) => (
                <CarouselItemCard 
                  key={item.id} 
                  item={item} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}