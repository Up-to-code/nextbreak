'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface ContentDisplayProps {
  title: string;
  content: string;
  currentYear: number;
}

export const ContentDisplay = ({ title, content, currentYear }: ContentDisplayProps) => {
  const router = useRouter();

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-yellow-50 px-4 py-12">
      <div className="relative w-full max-w-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
        <header className="border-b-4 border-black bg-yellow-500 px-6 py-4">
          <h1 className="text-center text-3xl font-black uppercase tracking-tight text-black">
            {title}
          </h1>
        </header>

        <main className="space-y-6 p-6 sm:p-8">
          <div 
            className="prose prose-sm max-w-none text-black sm:prose-base"
            dangerouslySetInnerHTML={{ __html: content }}
          />

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

      <footer className="mt-8 text-sm font-bold text-black">
        © {currentYear} Our Company. All rights reserved.
      </footer>
    </div>
  );
};

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
);