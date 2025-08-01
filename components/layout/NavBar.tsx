'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, User as UserIcon, Loader2, ChevronDown } from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cartStore'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { AuthDialog } from './AuthDialog'

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [authDialog, setAuthDialog] = useState<'signin' | 'signup' | null>(null)
  const [loadingStates, setLoadingStates] = useState({
    cart: false,
    signOut: false,
    checkout: false,
    cartItemOperations: {} as Record<number, boolean>
  })
  const { data: session } = useSession()

  // Refs for dropdown containers
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileDropdownOpen(false)
        setIsMobileMenuOpen(false)
        setIsCartOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Prevent body scroll when mobile menu or cart is open
  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isMobileMenuOpen, isCartOpen])

  // Focus management for accessibility
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector('a') as HTMLElement
      firstLink?.focus()
    }
  }, [isMobileMenuOpen])

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCartStore()

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    ...(session ? [{ name: 'Profile', href: '/profile' }] : [])
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isCartOpen) setIsCartOpen(false)
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
    if (isCartOpen) setIsCartOpen(false)
  }

  const handleAuthDialog = (mode: 'signin' | 'signup') => {
    setAuthDialog(mode)
    setIsMobileMenuOpen(false)
  }

  const handleCartAction = async (action: () => Promise<void> | void, itemId?: number) => {
    try {
      setLoadingStates(prev => ({
        ...prev,
        cart: !itemId,
        cartItemOperations: itemId ? { ...prev.cartItemOperations, [itemId]: true } : prev.cartItemOperations
      }))
      await action()
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        cart: false,
        cartItemOperations: itemId ? { ...prev.cartItemOperations, [itemId]: false } : prev.cartItemOperations
      }))
    }
  }

  const handleSignOut = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, signOut: true }))
      await signOut()
      setIsProfileDropdownOpen(false)
      setIsMobileMenuOpen(false)
    } finally {
      setLoadingStates(prev => ({ ...prev, signOut: false }))
    }
  }

  const handleCheckout = async () => {
    if (!session) {
      setAuthDialog('signin')
      setIsCartOpen(false)
      return
    }

    try {
      setLoadingStates(prev => ({ ...prev, checkout: true }))
      // Add your checkout logic here
    } finally {
      setLoadingStates(prev => ({ ...prev, checkout: false }))
    }
  }

  const truncateName = (name: string, maxLength = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name
  }

  return (
    <nav className='bg-white text-black h-[80px] border-b-4 border-black sticky top-0 z-50 shadow-[0_4px_0_0_#000]'>
      <div className='container mx-auto px-4 h-full'>
        <div className='flex justify-between items-center h-full'>
          {/* Logo and Desktop Links */}
          <div className='flex items-center space-x-8'>
            <Link href="/" className='flex items-center space-x-3 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 rounded'>
              <div className='w-12 h-12 bg-black flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all'>
                <span className='text-white font-extrabold text-xl'>A</span>
              </div>
              <h1 className='text-3xl font-extrabold uppercase tracking-tighter hover:text-yellow-500 transition-colors'>
                AIcademy
              </h1>
            </Link>

            <div className='hidden md:flex items-center space-x-4'>
              {links.filter(link => link.href !== '/profile').map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className='uppercase font-bold hover:text-yellow-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 rounded px-2 py-1'
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-2'>
            <div className='relative' ref={cartRef}>
              <button
                onClick={toggleCart}
                disabled={loadingStates.cart}
                className='relative p-3 border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                aria-label={`Shopping Cart (${totalItems()} items)`}
              >
                {loadingStates.cart ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    {totalItems() > 0 && (
                      <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs font-extrabold w-6 h-6 flex items-center justify-center border-2 border-black'>
                        {totalItems()}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className='absolute right-0 mt-2 w-96 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] z-50'>
                  <div className='p-4 border-b-4 border-black bg-yellow-400'>
                    <div className='flex justify-between items-center'>
                      <h2 className='text-xl font-extrabold uppercase'>Your Cart ({totalItems()})</h2>
                      <button
                        onClick={toggleCart}
                        className='w-6 h-6 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        aria-label="Close Cart"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className='max-h-[60vh] overflow-y-auto'>
                    {cartItems.length === 0 ? (
                      <div className='p-6 text-center'>
                        <p className='text-lg font-bold'>YOUR CART IS EMPTY</p>
                        <button
                          onClick={toggleCart}
                          className='mt-4 bg-black text-white px-6 py-2 font-extrabold uppercase border-4 border-white hover:bg-red-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        >
                          Browse Courses
                        </button>
                      </div>
                    ) : (
                      <div className='p-4'>
                        <ul className='space-y-4'>
                          {cartItems.map(item => (
                            <li key={item.id} className='border-b-4 border-black p-3 hover:bg-gray-50'>
                              <div className='flex justify-between items-start mb-2'>
                                <div className='flex-1 min-w-0'>
                                  <h3 className='font-extrabold uppercase'>{truncateName(item.name)}</h3>
                                  <p className='font-bold'>${item.price.toFixed(2)}</p>
                                </div>
                                <button
                                  onClick={() => handleCartAction(() => removeFromCart(item.id), item.id)}
                                  disabled={loadingStates.cartItemOperations[item.id]}
                                  className='w-6 h-6 bg-red-600 text-white flex items-center justify-center border-2 border-black hover:bg-red-700 transition-colors ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                                  aria-label={`Remove ${item.name}`}
                                >
                                  {loadingStates.cartItemOperations[item.id] ? (
                                    <Loader2 className='animate-spin h-3 w-3' />
                                  ) : (
                                    <X size={14} />
                                  )}
                                </button>
                              </div>
                              <div className='flex items-center'>
                                <button
                                  onClick={() => handleCartAction(() => decreaseQuantity(item.id), item.id)}
                                  disabled={loadingStates.cartItemOperations[item.id] || item.quantity <= 1}
                                  className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1 ${
                                    loadingStates.cartItemOperations[item.id] || item.quantity <= 1
                                      ? 'bg-gray-400 cursor-not-allowed'
                                      : 'bg-black text-white hover:bg-gray-800'
                                  }`}
                                  aria-label="Decrease quantity"
                                >
                                  {loadingStates.cartItemOperations[item.id] ? (
                                    <Loader2 className='animate-spin h-3 w-3' />
                                  ) : (
                                    '-'
                                  )}
                                </button>
                                <span className='mx-3 font-bold'>{item.quantity}</span>
                                <button
                                  onClick={() => handleCartAction(() => increaseQuantity(item.id), item.id)}
                                  disabled={loadingStates.cartItemOperations[item.id]}
                                  className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1 ${
                                    loadingStates.cartItemOperations[item.id]
                                      ? 'bg-gray-400 cursor-not-allowed'
                                      : 'bg-black text-white hover:bg-gray-800'
                                  }`}
                                  aria-label="Increase quantity"
                                >
                                  {loadingStates.cartItemOperations[item.id] ? (
                                    <Loader2 className='animate-spin h-3 w-3' />
                                  ) : (
                                    '+'
                                  )}
                                </button>
                                <span className='ml-auto font-extrabold'>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className='p-4 bg-yellow-400 border-t-4 border-black'>
                      <div className='flex justify-between items-center mb-4'>
                        <span className='font-extrabold uppercase'>Total:</span>
                        <span className='font-extrabold text-lg'>${totalPrice().toFixed(2)}</span>
                      </div>
                      <div className='grid grid-cols-2 gap-2'>
                        <button
                          onClick={() => handleCartAction(clearCart)}
                          disabled={loadingStates.cart}
                          className='bg-red-600 text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-red-700 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        >
                          {loadingStates.cart ? (
                            <Loader2 className='animate-spin h-4 w-4 mr-2' />
                          ) : (
                            'Clear All'
                          )}
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={loadingStates.checkout}
                          className='bg-black text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-green-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        >
                          {loadingStates.checkout ? (
                            <Loader2 className='animate-spin h-4 w-4 mr-2' />
                          ) : (
                            'Checkout'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {session ? (
              <div className='relative' ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  aria-expanded={isProfileDropdownOpen}
                  aria-controls="profile-dropdown"
                  aria-haspopup="true"
                  className='flex items-center space-x-2 bg-black text-white px-4 py-2 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                >
                  <UserIcon size={18} />
                  <span>Account</span>
                  <ChevronDown size={18} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div 
                    id="profile-dropdown"
                    className='absolute right-0 mt-2 w-64 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] z-50'
                  >
                    <div className='p-4 border-b-4 border-black'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black'>
                          <UserIcon size={18} className='text-black' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-bold truncate'>{truncateName(session.user?.name || 'User')}</p>
                          <p className='text-sm text-gray-600 truncate'>{session.user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className='p-2 space-y-1'>
                      <Link 
                        href='/profile' 
                        className='block px-4 py-2 font-bold hover:bg-yellow-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1'
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        disabled={loadingStates.signOut}
                        className='w-full text-left px-4 py-2 font-bold hover:bg-yellow-100 rounded flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1'
                      >
                        {loadingStates.signOut ? (
                          <Loader2 className='animate-spin h-4 w-4 mr-2' />
                        ) : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthDialog('signin')}
                  className='text-black px-6 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthDialog('signup')}
                  className='bg-black text-white px-6 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className='md:hidden flex items-center space-x-2'>
            <div className='relative' ref={cartRef}>
              <button
                onClick={toggleCart}
                disabled={loadingStates.cart}
                className='relative w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                aria-label={`Shopping Cart (${totalItems()} items)`}
              >
                {loadingStates.cart ? (
                  <Loader2 className='animate-spin h-5 w-5' />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {totalItems() > 0 && (
                      <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-extrabold w-5 h-5 flex items-center justify-center border-2 border-black'>
                        {totalItems()}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Mobile Cart Dropdown */}
              {isCartOpen && (
                <div className='fixed inset-0 top-[80px] bg-white z-40 overflow-y-auto'>
                  <div className='p-4 border-b-4 border-black bg-yellow-400 sticky top-0 z-10'>
                    <div className='flex justify-between items-center'>
                      <h2 className='text-xl font-extrabold uppercase'>Your Cart ({totalItems()})</h2>
                      <button
                        onClick={toggleCart}
                        className='w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        aria-label="Close Cart"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className='p-4'>
                    {cartItems.length === 0 ? (
                      <div className='p-8 text-center border-b-4 border-black'>
                        <p className='text-lg font-bold'>YOUR CART IS EMPTY</p>
                        <button
                          onClick={toggleCart}
                          className='mt-4 bg-black text-white px-6 py-2 font-extrabold uppercase border-4 border-white hover:bg-red-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        >
                          Browse Courses
                        </button>
                      </div>
                    ) : (
                      <ul className='space-y-4'>
                        {cartItems.map(item => (
                          <li key={item.id} className='border-b-4 border-black p-4 hover:bg-gray-50'>
                            <div className='flex justify-between items-start mb-2'>
                              <div className='flex-1 min-w-0'>
                                <h3 className='font-extrabold uppercase'>{truncateName(item.name)}</h3>
                                <p className='font-bold'>${item.price.toFixed(2)}</p>
                              </div>
                              <button
                                onClick={() => handleCartAction(() => removeFromCart(item.id), item.id)}
                                disabled={loadingStates.cartItemOperations[item.id]}
                                className='w-8 h-8 bg-red-600 text-white flex items-center justify-center border-2 border-black hover:bg-red-700 transition-colors ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                                aria-label={`Remove ${item.name}`}
                              >
                                {loadingStates.cartItemOperations[item.id] ? (
                                  <Loader2 className='animate-spin h-4 w-4' />
                                ) : (
                                  <X size={16} />
                                )}
                              </button>
                            </div>
                            <div className='flex items-center'>
                              <button
                                onClick={() => handleCartAction(() => decreaseQuantity(item.id), item.id)}
                                disabled={loadingStates.cartItemOperations[item.id] || item.quantity <= 1}
                                className={`w-8 h-8 flex items-center justify-center border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1 ${
                                  loadingStates.cartItemOperations[item.id] || item.quantity <= 1
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                                aria-label="Decrease quantity"
                              >
                                {loadingStates.cartItemOperations[item.id] ? (
                                  <Loader2 className='animate-spin h-4 w-4' />
                                ) : (
                                  '-'
                                )}
                              </button>
                              <span className='mx-4 font-bold'>{item.quantity}</span>
                              <button
                                onClick={() => handleCartAction(() => increaseQuantity(item.id), item.id)}
                                disabled={loadingStates.cartItemOperations[item.id]}
                                className={`w-8 h-8 flex items-center justify-center border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1 ${
                                  loadingStates.cartItemOperations[item.id]
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                                aria-label="Increase quantity"
                              >
                                {loadingStates.cartItemOperations[item.id] ? (
                                  <Loader2 className='animate-spin h-4 w-4' />
                                ) : (
                                  '+'
                                )}
                              </button>
                              <span className='ml-auto font-extrabold'>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className='p-4 bg-yellow-400 border-t-4 border-black sticky bottom-0'>
                      <div className='flex justify-between items-center mb-4'>
                        <span className='font-extrabold uppercase'>Total:</span>
                        <span className='font-extrabold text-xl'>${totalPrice().toFixed(2)}</span>
                      </div>
                      <div className='grid grid-cols-2 gap-2'>
                        <button
                          onClick={() => handleCartAction(clearCart)}
                          disabled={loadingStates.cart}
                          className='bg-red-600 text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-red-700 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        >
                          {loadingStates.cart ? (
                            <Loader2 className='animate-spin h-4 w-4 mr-2' />
                          ) : (
                            'Clear All'
                          )}
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={loadingStates.checkout}
                          className='bg-black text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-green-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                        >
                          {loadingStates.checkout ? (
                            <Loader2 className='animate-spin h-4 w-4 mr-2' />
                          ) : (
                            'Checkout'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className='w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            ref={mobileMenuRef}
            className='md:hidden fixed inset-0 top-[80px] bg-white z-40 overflow-y-auto'
          >
            <div className='px-4 py-2'>
              {session && (
                <div className='flex items-center space-x-3 mb-4 p-3 bg-yellow-100 border-4 border-black'>
                  <div className='w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black'>
                    <UserIcon size={24} className='text-black' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-bold truncate'>{session.user?.name || 'User'}</p>
                    <p className='text-sm text-gray-600 truncate'>{session.user?.email}</p>
                  </div>
                </div>
              )}
              
              <div className='space-y-1 mb-4'>
                {links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className='block text-black bg-yellow-300 px-5 py-4 font-extrabold uppercase border-4 border-black my-1 shadow-[4px_4px_0_0_#000] hover:bg-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {session ? (
                <button
                  onClick={handleSignOut}
                  disabled={loadingStates.signOut}
                  className='w-full bg-red-600 text-white px-4 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-700 transition-all flex items-center justify-center mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                >
                  {loadingStates.signOut ? (
                    <Loader2 className='animate-spin h-4 w-4 mr-2' />
                  ) : 'Sign Out'}
                </button>
              ) : (
                <div className='grid grid-cols-2 gap-2'>
                  <button
                    onClick={() => handleAuthDialog('signin')}
                    className='text-black px-4 py-3 font-extrabold uppercase border-4 border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthDialog('signup')}
                    className='bg-black text-white px-4 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2'
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Dialog */}
      {authDialog && (
        <AuthDialog
          mode={authDialog}
          onClose={() => setAuthDialog(null)}
          onSwitchMode={() => setAuthDialog(authDialog === 'signin' ? 'signup' : 'signin')}
        />
      )}
    </nav>
  )
}

export default NavBar