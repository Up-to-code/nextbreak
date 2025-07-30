"use client"
import React, { useState } from 'react';

function Filleter() {
  const [priceRange, setPriceRange] = useState('none');
  const [level, setLevel] = useState('All');

  const priceOptions = [
    { value: 'none', label: 'none' },
    { value: 'free', label: 'Free' },
    { value: 'under500', label: 'Under 500 ₹' },
    { value: 'under1000', label: 'Under 1000 ₹' },
    { value: 'custom', label: 'Custom' }
  ];
  
  const levelOptions = [
    { value: 'All', label: 'All' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  return (
    <div className="w-full max-w-52 min-w-52 border-2 border-black rounded-lg mt-6">
      {/* Header */}
      <div className="bg-white border-b-4 border-black px-4 py-3">
        <h2 className="text-black font-black text-lg uppercase tracking-wide">
          Filter
        </h2>
      </div>

      {/* Price Section */}
      <div className="border-b-4 border-black px-4 py-4 bg-white">
        <h3 className="text-black font-black text-base uppercase mb-4 tracking-wide">Price</h3>
        <div className="space-y-3">
          {priceOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="price"
                  value={option.value}
                  checked={priceRange === option.value}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 border-3 border-black rounded-full flex items-center justify-center transition-all ${
                  priceRange === option.value 
                    ? 'bg-red-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-red-200'
                }`}>
                  {priceRange === option.value && (
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-black font-bold text-sm">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Level Section */}
      <div className="px-4 py-4 bg-white">
        <h3 className="text-black font-black text-base uppercase mb-4 tracking-wide">Level</h3>
        <div className="space-y-3">
          {levelOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="level"
                  value={option.value}
                  checked={level === option.value}
                  onChange={(e) => setLevel(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 border-3 border-black rounded-full flex items-center justify-center transition-all ${
                  level === option.value 
                    ? 'bg-green-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-green-200'
                }`}>
                  {level === option.value && (
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-black font-bold text-sm">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filleter;