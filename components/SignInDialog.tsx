'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function SignInDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2 border-4 border-black bg-yellow-300 text-black font-bold uppercase hover:bg-yellow-400 transition-all"
      >
        Sign In
      </button>

      {/* Overlay + Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black] text-black relative">

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 p-1 border-2 border-black bg-red-500 text-white hover:bg-red-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-bold uppercase mb-4 border-b-4 border-black pb-2">
              Welcome Back
            </h2>

            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="border-4 border-black px-4 py-2 bg-[#f1f1f1] placeholder:text-black focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="border-4 border-black px-4 py-2 bg-[#f1f1f1] placeholder:text-black focus:outline-none"
              />

              <button
                type="submit"
                className="mt-2 bg-black text-white border-4 border-black px-4 py-2 font-bold uppercase hover:bg-white hover:text-black transition-all"
              >
                Sign In
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600 font-mono">
              Don’t have an account? <span className="underline cursor-pointer">Sign up</span>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
