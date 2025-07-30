"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const AboutPage = () => {
  const router = useRouter();

  return (  
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background container with subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Content card with consistent not-found styling */}
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Decorative header */}
        <div className="bg-black px-6 py-4">
          <h1 className="text-2xl font-semibold text-white text-center">
            About Our Company
          </h1>
        </div>

        {/* Main content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
            <p>
              We&apos;re a passionate team dedicated to creating simple, effective solutions that make a difference in people&apos;s everyday lives.
            </p>
            
            <h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">Our Story</h2>
            <p>
              Founded in 2020, we started as a small garage operation and have grown into a trusted brand serving customers worldwide, 
              while maintaining our commitment to quality and innovation.
            </p>

            <h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">Our Values</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-gray-100 rounded-full p-1 mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Quality craftsmanship</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-gray-100 rounded-full p-1 mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Honest business practices</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-gray-100 rounded-full p-1 mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Customer-first approach</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Our Company. All rights reserved.
      </p>
    </div>
  );
};

export default AboutPage;