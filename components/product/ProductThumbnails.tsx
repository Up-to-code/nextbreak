

// components/ProductThumbnails.tsx
import React from 'react';

interface ProductThumbnailsProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

export const ProductThumbnails: React.FC<ProductThumbnailsProps> = ({ 
  images, 
  selectedImage, 
  onImageSelect 
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={`relative border-4 transition-all transform hover:scale-105 active:scale-95 ${
            selectedImage === index 
              ? 'border-yellow-400 shadow-[4px_4px_0px_0px_rgba(255,193,7,1)]' 
              : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          }`}
          aria-label={`View image ${index + 1}`}
        >
          <img 
            src={img} 
            alt={`View ${index + 1}`} 
            className="w-20 h-20 object-cover object-center" 
          />
          {selectedImage === index && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-black"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );        
};