// app/admin/carousel/CarouselItemCard.tsx
'use client'

import React from 'react'
import { Edit, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { CarouselItem } from './types'
import { deleteCarouselItem } from '@/actions/carousel' // Import server action directly

interface CarouselItemCardProps {
  item?: CarouselItem | null
}

export default function CarouselItemCard({ 
  item, 
}: CarouselItemCardProps) {
  // Return placeholder for invalid items
  if (!item || !item.id) {
    return (
      <div className="bg-white border-[4px] border-black rounded-none overflow-hidden">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Invalid Item</span>
        </div>
        <div className="p-4">
          <div className="text-gray-500 mb-3">Invalid carousel item</div>
          <div className="flex gap-2">
 
            <button disabled className="bg-gray-300 text-gray-500 border-[3px] border-black px-3 py-2 font-bold text-sm cursor-not-allowed">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this carousel item?')) {
      try {
        await deleteCarouselItem(item.id)
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete item. Please try again.')
      }
    }
  }

  return (
    <div className="bg-white border-[4px] border-black rounded-none overflow-hidden">
      {/* Image with fallback */}
      <div className="relative w-full h-48 bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt="Carousel item"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ExternalLink size={14} />
            {item.link ? (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 truncate"
              >
                {item.link}
              </a>
            ) : (
              <span className="text-gray-400">No link provided</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
     
          
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white border-[3px] border-black px-3 py-2 font-bold text-sm hover:bg-red-400 transition-colors flex items-center justify-center"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 border-t pt-2">
          Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
        </div>
      </div>
    </div>
  )
}