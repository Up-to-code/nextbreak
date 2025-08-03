'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCarouselImages } from '@/actions/carousel'

export default function Carousel() {
  const [images, setImages] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Fetch images from server
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getCarouselImages()
        if (data && data.length > 0) {
          setImages(data)
        } else {
          setImages(['/fallback-image.jpg']) // Default fallback
        }
      } catch (error) {
        console.error('Failed to load carousel images:', error)
        setImages(['/fallback-image.jpg']) // Default fallback
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchImages()
  }, [])

  const next = () => setIndex((i) => (i + 1) % images.length)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

  // Auto-scroll with pause on hover
  useEffect(() => {
    if (!isPaused && images.length > 0) {
      timer.current = setTimeout(next, 3000)
    }
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [index, isPaused, images])

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      next()
    }
    if (touchStart - touchEnd < -50) {
      prev()
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6">
        <div className="relative bg-white border-[6px] border-black rounded-none overflow-hidden h-[50vh] max-h-[400px] md:h-[60vh] max-h-[600px] flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6">
      <div 
        ref={carouselRef}
        className="relative bg-white border-[6px] border-black rounded-none overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image with brutalist border */}
        <img
          src={images[index]}
          alt="Carousel image"
          className="w-full h-[50vh] max-h-[400px] md:h-[60vh] max-h-[600px] object-cover border-b-[6px] border-black"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-image.jpg'
          }}
        />

        {/* Navigation Arrows - Larger on mobile */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-yellow-400 text-black border-[5px] border-black p-2 sm:p-3 rounded-none active:bg-yellow-500"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} strokeWidth={3} className="sm:w-8 sm:h-8" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-yellow-400 text-black border-[5px] border-black p-2 sm:p-3 rounded-none active:bg-yellow-500"
          aria-label="Next image"
        >
          <ChevronRight size={28} strokeWidth={3} className="sm:w-8 sm:h-8" />
        </button>

        {/* Progress Indicators - Larger touch targets */}
        {images.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 bg-white px-3 sm:px-4 py-2 sm:py-3 border-[5px] border-black">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-none border-[3px] sm:border-[4px] border-black ${
                  i === index ? 'bg-red-600' : 'bg-white'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter - Optimized for mobile */}
        <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-black text-white px-3 py-1 border-[4px] sm:border-[5px] border-white font-mono font-extrabold text-sm sm:text-lg">
          {index + 1} / {images.length}
        </div>

        {/* Auto-scroll Status Indicator - Mobile friendly */}
        <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-black text-white px-2 py-1 border-[4px] sm:border-[5px] border-white font-mono text-xs sm:text-sm font-extrabold">
          {isPaused ? '☝️' : '▶️'}
        </div>
      </div>
    </div>
  )
}