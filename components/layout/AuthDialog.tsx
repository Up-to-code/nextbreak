'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthDialogProps {
  mode: 'signin' | 'signup'
  onClose: () => void
  onSwitchMode: () => void
}

export const AuthDialog = ({ mode, onClose, onSwitchMode }: AuthDialogProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [grade, setGrade] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        ...(mode === 'signup' && { name, phone, grade }),
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Authentication error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0_0_#000] w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white flex items-center justify-center border-4 border-black rounded-full hover:bg-red-600 transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold uppercase mb-1">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 font-medium">
            {mode === 'signin' 
              ? 'Sign in to access your account' 
              : 'Join us to get started'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border-2 border-red-700 font-bold rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-bold mb-1 uppercase text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-black rounded shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#000] transition-all"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-bold mb-1 uppercase text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-black rounded shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#000] transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Additional fields for signup */}
          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="name" className="block font-bold mb-1 uppercase text-sm">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#000] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-bold mb-1 uppercase text-sm">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#000] transition-all"
                  placeholder="+1 (123) 456-7890"
                />
              </div>

              {/* Grade Field - Now as text input */}
              <div>
                <label htmlFor="grade" className="block font-bold mb-1 uppercase text-sm">
                  Grade Level
                </label>
                <input
                  id="grade"
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#000] transition-all"
                  placeholder="Enter your grade (e.g., 10th Grade)"
                />
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 font-extrabold uppercase border-4 border-black rounded shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : mode === 'signin'
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                  : 'bg-black hover:bg-gray-900 text-white'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Sign Up'
            )}
          </button>

          {/* Switch mode */}
          <div className="text-center text-sm font-medium">
            {mode === 'signin' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="font-extrabold text-black hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="font-extrabold text-black hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}