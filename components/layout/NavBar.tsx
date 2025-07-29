'use client'
import React, { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'UX Design Course', price: 99, quantity: 1 },
    { id: 2, name: 'AI Fundamentals', price: 149, quantity: 1 }
  ])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleCart = () => setIsCartOpen(!isCartOpen)

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <nav className='bg-white text-black h-[80px] border-b-4 border-black sticky top-0 z-50'>
      <div className='container mx-auto px-4 h-full'>
        <div className='flex justify-between items-center h-full'>
          {/* Logo Section */}
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-black flex items-center justify-center border-4 border-black'>
              <span className='text-white font-extrabold text-xl'>A</span>
            </div>
            <h1 className='text-3xl font-extrabold uppercase tracking-tighter'>AIcademy</h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            <a href='#' className='text-black hover:bg-yellow-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1'>
              Home
            </a>
            <a href='#' className='text-black hover:bg-pink-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1'>
              Courses
            </a>
            <a href='#' className='text-black hover:bg-blue-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1'>
              About
            </a>
            <a href='#' className='text-black hover:bg-green-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1'>
              Contact
            </a>
          </div>

          {/* Desktop Right Section */}
          <div className='hidden md:flex items-center space-x-2'>
            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className='relative p-3 border-4 border-black hover:bg-gray-200'
            >
              <ShoppingCart size={24} strokeWidth={3} />
              {cartItems.length > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs font-extrabold w-6 h-6 flex items-center justify-center border-2 border-black'>
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            <button className='text-black px-6 py-3 font-extrabold uppercase border-4 border-black hover:bg-gray-200'>
              Sign In
            </button>
            <button className='bg-black text-white px-6 py-3 font-extrabold uppercase border-4 border-black hover:bg-red-600'>
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center space-x-2'>
            {/* Mobile Cart Button */}
            <button 
              onClick={toggleCart}
              className='relative w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black'
            >
              <ShoppingCart size={20} strokeWidth={3} />
              {cartItems.length > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-extrabold w-5 h-5 flex items-center justify-center border-2 border-black'>
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className='w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black'
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden absolute top-full left-0 right-0 bg-white border-b-4 border-black border-t-4 border-black'>
            <div className='px-4 py-2'>
              <div className='space-y-1 mb-4'>
                <a href='#' className='block text-black bg-yellow-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1'>
                  Home
                </a>
                <a href='#' className='block text-black bg-pink-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1'>
                  Courses
                </a>
                <a href='#' className='block text-black bg-blue-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1'>
                  About
                </a>
                <a href='#' className='block text-black bg-green-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1'>
                  Contact
                </a>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <button className='text-black px-4 py-3 font-extrabold uppercase border-4 border-black bg-white'>
                  Sign In
                </button>
                <button className='bg-black text-white px-4 py-3 font-extrabold uppercase border-4 border-black'>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Popup */}
      {isCartOpen && (
        <div className='absolute top-full right-0 w-full md:w-96 bg-white border-4 border-black z-50 shadow-[8px_8px_0_0_#000]'>
          <div className='p-4 border-b-4 border-black'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-extrabold uppercase'>Your Cart</h2>
              <button 
                onClick={toggleCart}
                className='w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black'
              >
                ✕
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className='max-h-96 overflow-y-auto'>
            {cartItems.length === 0 ? (
              <div className='p-8 text-center border-b-4 border-black'>
                <p className='text-lg font-bold'>YOUR CART IS EMPTY</p>
              </div>
            ) : (
              <ul>
                {cartItems.map(item => (
                  <li key={item.id} className='border-b-4 border-black p-4'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-extrabold uppercase'>{item.name}</h3>
                        <p className='font-bold'>${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className='w-8 h-8 bg-red-600 text-white flex items-center justify-center border-2 border-black'
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Footer */}
          <div className='p-4 bg-yellow-400 border-t-4 border-black'>
            <div className='flex justify-between items-center mb-4'>
              <span className='font-extrabold uppercase'>Total:</span>
              <span className='font-extrabold text-xl'>${total}</span>
            </div>
            <button className='w-full bg-black text-white py-3 font-extrabold uppercase border-4 border-white hover:bg-red-600'>
              Checkout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar