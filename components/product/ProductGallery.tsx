"use client"
import React, { useState } from 'react';
import { ProductImage } from './ProductImage';
import { ImageNavigation } from './ImageNavigation';
import { ProductThumbnails } from './ProductThumbnails';
 
interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageChange = (index: number) => {
    setImageLoading(true);
    setSelectedImage(index);
    setTimeout(() => setImageLoading(false), 200);
  };

  const handlePrevious = () => {
    handleImageChange(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
  };

  const handleNext = () => {
    handleImageChange(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative">
        <ProductImage
          src={images[selectedImage]}
          alt={productName}
          isLoading={imageLoading}
          onLoad={() => setImageLoading(false)}
        />
        <ImageNavigation onPrevious={handlePrevious} onNext={handleNext} />
      </div>
      
      <ProductThumbnails
        images={images}
        selectedImage={selectedImage}
        onImageSelect={handleImageChange}
      />
    </div>
  );
};
