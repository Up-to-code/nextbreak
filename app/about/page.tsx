'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const AboutPage = () => {
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-yellow-50 px-4 py-12">
      {/* Content card with neo-brutalist styling */}
      <div className="relative w-full max-w-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
        {/* Header with bold typography */}
        <header className="border-b-4 border-black bg-yellow-500 px-6 py-4">
          <h1 className="text-center text-3xl font-black uppercase tracking-tight text-black">
            About Our Company
          </h1>
        </header>

        {/* Main content */}
        <main className="space-y-6 p-6 sm:p-8">
          <div className="prose prose-sm max-w-none text-black sm:prose-base">
            <p className="font-medium">
              We&apos;re a passionate team dedicated to creating simple, effective solutions that make a difference in people&apos;s everyday lives.
            </p>
            
            <h2 className="mb-4 mt-8 text-xl font-black uppercase text-black">Our Story</h2>
            <p className="font-medium">
              Founded in 2020, we started as a small garage operation and have grown into a trusted brand serving customers worldwide, 
              while maintaining our commitment to quality and innovation.
            </p>

            <h2 className="mb-4 mt-8 text-xl font-black uppercase text-black">Our Values</h2>
            <ul className="space-y-4">
              {[
                "Quality craftsmanship",
                "Honest business practices",
                "Customer-first approach"
              ].map((value) => (
                <li key={value} className="flex items-start">
                  <span className="mr-3 flex-shrink-0 rounded-full border-2 border-black bg-yellow-400 p-1">
                    <CheckIcon />
                  </span>
                  <span className="font-bold">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons with brutalist styling */}
          <div className="flex flex-col gap-4 pt-6 sm:flex-row">
            <Button 
              onClick={() => router.push('/')}
              variant="primary"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => router.push('/contact')}
              variant="secondary"
            >
              Contact Us
            </Button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm font-bold text-black">
        © {currentYear} Our Company. All rights reserved.
      </footer>
    </div>
  )
}

// Reusable components with brutalist styling
const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-black uppercase tracking-wide transition-all hover:shadow-none border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none ${
      variant === 'primary' 
        ? 'bg-green-400 text-black hover:bg-green-500' 
        : 'bg-white text-black hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
)

export default AboutPage