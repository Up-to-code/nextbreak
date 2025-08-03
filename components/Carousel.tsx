/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { getCarouselItems } from '@/actions/carousel'

interface CarouselItem {
  id: string
  image: string
  link: string
  title?: string
}

export default function BrutalistCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getCarouselItems()
        setItems(data || [])
      } catch (error) {
        console.error('Failed to load carousel items:', error)
        setItems([{
          id: 'fallback',
          image: '/fallback-image.jpg',
          link: '#',
          title: 'Failed to load content'
        }])
      }
    }
    fetchItems()
  }, [])

  const next = () => setIndex((i) => (i + 1) % items.length)
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)

  useEffect(() => {
    if (!isPaused && items.length > 1) {
      timer.current = setTimeout(next, 4000)
    }
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [index, isPaused, items])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) next()
    if (isRightSwipe) prev()
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white border-[4px] sm:border-[6px] border-black h-[40vh] sm:h-[50vh] flex items-center justify-center">
          <div className="border-[3px] sm:border-[4px] border-black p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-2xl font-bold">LOADING CONTENT</p>
          </div>
        </div>
      </div>
    )
  }

  const currentItem = items[index]

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Outer container with double border effect */}
      <div className="border-[4px] sm:border-[6px] border-black bg-black p-[2px] sm:p-1">
        <div 
          ref={carouselRef}
          className="relative bg-white border-[3px] sm:border-[4px] border-yellow-400"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Clickable image */}
          <a 
            href={currentItem.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block border-b-[3px] sm:border-b-[4px] border-black"
          >
            <img
              src={currentItem.image}
              alt={currentItem.title || 'Carousel image'}
              className="w-full h-[250px] xs:h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
       
            />
          </a>

          {/* Title bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white p-2 sm:p-3 border-t-[3px] sm:border-t-[4px] border-yellow-400">
            <div className="flex justify-between items-center gap-2">
              {currentItem.title && (
                <h3 className="text-sm xs:text-base sm:text-xl font-bold truncate flex-1 leading-tight">
                  {currentItem.title}
                </h3>
              )}
              <ExternalLink 
                size={16} 
                className="text-yellow-400 flex-shrink-0 xs:w-5 xs:h-5 sm:w-6 sm:h-6" 
              />
            </div>
          </div>

          {/* Navigation controls */}
          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-yellow-400 text-black border-[3px] sm:border-[4px] border-black p-1 sm:p-2 hover:bg-yellow-300 active:bg-yellow-200 touch-manipulation"
                aria-label="Previous"
              >
                <ChevronLeft size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 bg-yellow-400 text-black border-[3px] sm:border-[4px] border-black p-1 sm:p-2 hover:bg-yellow-300 active:bg-yellow-200 touch-manipulation"
                aria-label="Next"
              >
                <ChevronRight size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
              </button>

              {/* Progress indicators - simplified for mobile */}
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 bg-white px-1 sm:px-2 py-1 border-[2px] sm:border-[3px] border-black">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 border-[1px] sm:border-[2px] border-black touch-manipulation ${
                      i === index ? 'bg-red-600' : 'bg-white'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Status indicator - repositioned for mobile */}
              <div className="absolute top-2 right-2 bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 border-[2px] sm:border-[3px] border-white text-xs sm:text-sm font-bold">
                {index + 1}/{items.length}
              </div>
            </>
          )}

          {/* Swipe indicator (mobile only) */}
          <div className="absolute top-2 left-2 bg-white text-black px-1 py-0.5 border-[2px] border-black text-xs font-bold sm:hidden">
            ← SWIPE →
          </div>
        </div>
      </div>
    </div>
  )
}