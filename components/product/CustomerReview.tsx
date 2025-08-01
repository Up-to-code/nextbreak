import React from 'react';
import { StarRating } from './StarRating';

interface CustomerReviewProps {
  rating: number;
  name: string;
  comment: string;
  date: string;
}

export const CustomerReview: React.FC<CustomerReviewProps> = ({ 
  rating, 
  name, 
  comment, 
  date 
}) => {
  return (
    <div className="bg-gray-100 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center mb-1">
            <StarRating rating={rating} />
          </div>
          <h4 className="font-black">{name}</h4>
        </div>
        <span className="text-sm text-gray-600">{date}</span>
      </div>
      <p className="font-bold">{comment}</p>
    </div>
  );
};
