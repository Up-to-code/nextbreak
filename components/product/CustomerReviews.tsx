// components/CustomerReviews.tsx
import React from 'react';
import { StarRating } from './StarRating';
import { CustomerReview } from './CustomerReview';
import { Product } from '../types/product';

interface CustomerReviewsProps {
  reviews: Product['reviews'];
  averageRating: number;
  totalReviews: number;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  reviews, 
  averageRating, 
  totalReviews 
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-black mb-2 tracking-wider">CUSTOMER REVIEWS</h3>
          <div className="flex items-center">
            <StarRating rating={averageRating} />
            <span className="ml-2 font-bold">{averageRating} out of 5 • {totalReviews} reviews</span>
          </div>
        </div>
        <button className="mt-4 sm:mt-0 py-3 px-6 bg-yellow-400 border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          ✍️ WRITE A REVIEW
        </button>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <CustomerReview
            key={index}
            rating={review.rating}
            name={review.name}
            comment={review.comment}
            date={review.date}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="py-3 px-8 bg-white border-4 border-black font-black hover:bg-gray-100">
          LOAD MORE REVIEWS
        </button>
      </div>
    </div>
  );
};