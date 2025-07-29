'use client'
import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  '/1.jpeg',
  '/2.jpeg',
  '/3.jpeg',
  '/4.jpeg',
  '/5.jpeg',
]

export default function NeoBrutalistCarousel() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const next = () => setIndex((i) => (i + 1) % images.length)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

  // Auto-scroll with pause on hover
  useEffect(() => {
    if (!isPaused) {
      timer.current = setTimeout(next, 3000)
    }
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [index, isPaused])

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      next() // Swipe left
    }
    if (touchStart - touchEnd < -50) {
      prev() // Swipe right
    }
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
          alt=""
          className="w-full h-[50vh] max-h-[400px] md:h-[60vh] max-h-[600px] object-cover border-b-[6px] border-black"
        />

        {/* Navigation Arrows - Larger on mobile */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-yellow-400 text-black border-[5px] border-black p-2 sm:p-3 rounded-none active:bg-yellow-500"
        >
          <ChevronLeft size={28} strokeWidth={3} className="sm:w-8 sm:h-8" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-yellow-400 text-black border-[5px] border-black p-2 sm:p-3 rounded-none active:bg-yellow-500"
        >
          <ChevronRight size={28} strokeWidth={3} className="sm:w-8 sm:h-8" />
        </button>

        {/* Progress Indicators - Larger touch targets */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 bg-white px-3 sm:px-4 py-2 sm:py-3 border-[5px] border-black">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-none border-[3px] sm:border-[4px] border-black ${
                i === index ? 'bg-red-600' : 'bg-white'
              }`}
            />
          ))}
        </div>

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