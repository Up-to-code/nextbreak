'use client'
import React from 'react'

interface BrutalTitleProps {
  mainText: string
  subText?: string
  accentColor?: 'red' | 'yellow' | 'blue' | 'green' | 'pink'
  borderSize?: 'sm' | 'md' | 'lg'
}

export default function BrutalTitle({
  mainText,
  subText,
  accentColor = 'yellow',
  borderSize = 'md'
}: BrutalTitleProps) {
  // Border size mapping
  const borderSizes = {
    sm: '2px',
    md: '4px',
    lg: '6px'
  }

  // Color mapping
  const colorMap = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    pink: 'bg-pink-400'
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Main Title Container */}
      <div 
        className={`relative bg-white border-${borderSize} border-black p-6`}
        style={{ borderWidth: borderSizes[borderSize] }}
      >
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter mb-2">
          {mainText}
        </h1>
        
        {/* Subtitle */}
        {subText && (
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
            {subText}
          </h2>
        )}
        
        {/* Accent Bar */}
        <div 
          className={`absolute bottom-0 left-0 h-2 ${colorMap[accentColor]} w-full`}
          style={{ borderTop: `${borderSizes[borderSize]} solid #000` }}
        />
      </div>
    </div>
  )
}