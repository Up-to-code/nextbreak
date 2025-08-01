"use client"
// components/ImageNavigation.tsx
import React from 'react';

interface ImageNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const ImageNavigation: React.FC<ImageNavigationProps> = ({ onPrevious, onNext }) => {
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        aria-label="Previous image"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        aria-label="Next image"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
};