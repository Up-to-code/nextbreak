'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-black px-6 py-12 md:px-12 font-mono">
      <div className="max-w-5xl mx-auto border-4 border-black p-8 md:p-12 bg-white shadow-[8px_8px_0px_0px_black]">

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold uppercase mb-4 border-b-4 border-black pb-3 leading-tight">
          Who We Are
        </h1>

        {/* Intro Text */}
        <p className="text-lg md:text-xl leading-relaxed mb-10">
          We’re a small, passionate team building brutally honest digital experiences.
          No trends. No noise. Just design with guts, function with clarity, and code that doesn’t lie.
        </p>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Vision Block */}
          <div className="p-6 bg-[#eaeaea] border-4 border-black">
            <h2 className="text-2xl font-bold uppercase mb-2">Our Vision</h2>
            <p>
              Redefining modern digital by rejecting minimalism’s sterility. We make designs that speak loud, code that speaks clearer.
            </p>
          </div>

          {/* Team Block */}
          <div className="p-6 bg-[#eaeaea] border-4 border-black">
            <h2 className="text-2xl font-bold uppercase mb-2">The Team</h2>
            <p>
              Designers, devs, rebels. We’re not just building websites — we’re breaking the mold one component at a time.
            </p>
          </div>
        </div>

        {/* Brutalist Quote */}
        <div className="border-4 border-black p-6 bg-yellow-300 text-black mb-12">
          <p className="text-2xl font-bold uppercase">
            “Good design is honest.”
          </p>
          <p className="mt-2 text-right">– Dieter Rams</p>
        </div>

        {/* Stats or Quick Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-12">
          <div className="bg-[#f1f1f1] p-6 border-4 border-black">
            <p className="text-4xl font-bold">8+</p>
            <p className="uppercase text-sm">Years Building</p>
          </div>
          <div className="bg-[#f1f1f1] p-6 border-4 border-black">
            <p className="text-4xl font-bold">200+</p>
            <p className="uppercase text-sm">Projects Launched</p>
          </div>
          <div className="bg-[#f1f1f1] p-6 border-4 border-black">
            <p className="text-4xl font-bold">∞</p>
            <p className="uppercase text-sm">Ideas Daily</p>
          </div>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-block px-6 py-3 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold uppercase"
        >
          ← Back Home
        </Link>
      </div>
    </main>
  )
}
