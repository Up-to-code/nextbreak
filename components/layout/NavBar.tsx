'use client'
import React, { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Use cart store
  const {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCartStore()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleCart = () => setIsCartOpen(!isCartOpen)

  // Example product to add (you would normally get this from props or context)
  const sampleProduct = {
    id: 3,
    name: 'React Masterclass',
    price: 199,
    image: '/react-course.jpg'
  }

  return (
    <nav className='bg-white text-black h-[80px] border-b-4 border-black sticky top-0 z-50 shadow-[0_4px_0_0_#000]'>
      <div className='container mx-auto px-4 h-full'>
        <div className='flex justify-between items-center h-full'>
          {/* Logo Section */}
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-black flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all'>
              <span className='text-white font-extrabold text-xl'>A</span>
            </div>
            <h1 className='text-3xl font-extrabold uppercase tracking-tighter hover:text-yellow-500 transition-colors'>
              AIcademy
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            <a href='#' className='text-black hover:bg-yellow-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'>
              Home
            </a>
            <a href='#' className='text-black hover:bg-pink-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'>
              Courses
            </a>
            <button 
              onClick={() => addToCart(sampleProduct)}
              className='text-black hover:bg-blue-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'
            >
              Add Sample Course
            </button>
            <a href='#' className='text-black hover:bg-green-400 px-5 py-3 font-extrabold uppercase border-4 border-black mx-1 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'>
              Contact
            </a>
          </div>

          {/* Desktop Right Section */}
          <div className='hidden md:flex items-center space-x-2'>
            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className='relative p-3 border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'
            >
              <ShoppingCart size={24} strokeWidth={3} />
              {totalItems() > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs font-extrabold w-6 h-6 flex items-center justify-center border-2 border-black'>
                  {totalItems()}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            <button className='text-black px-6 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'>
              Sign In
            </button>
            <button className='bg-black text-white px-6 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-600 transition-all hover:-translate-y-0.5 hover:-translate-x-0.5'>
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center space-x-2'>
            {/* Mobile Cart Button */}
            <button 
              onClick={toggleCart}
              className='relative w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
            >
              <ShoppingCart size={20} strokeWidth={3} />
              {totalItems() > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-extrabold w-5 h-5 flex items-center justify-center border-2 border-black'>
                  {totalItems()}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className='w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden absolute top-full left-0 right-0 bg-white border-b-4 border-black border-t-4 border-black shadow-[0_4px_0_0_#000]'>
            <div className='px-4 py-2'>
              <div className='space-y-1 mb-4'>
                <a href='#' className='block text-black bg-yellow-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1 shadow-[4px_4px_0_0_#000]'>
                  Home
                </a>
                <a href='#' className='block text-black bg-pink-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1 shadow-[4px_4px_0_0_#000]'>
                  Courses
                </a>
                <button 
                  onClick={() => addToCart(sampleProduct)}
                  className='w-full block text-black bg-blue-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1 shadow-[4px_4px_0_0_#000]'
                >
                  Add Sample Course
                </button>
                <a href='#' className='block text-black bg-green-400 px-5 py-4 font-extrabold uppercase border-4 border-black my-1 shadow-[4px_4px_0_0_#000]'>
                  Contact
                </a>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <button className='text-black px-4 py-3 font-extrabold uppercase border-4 border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'>
                  Sign In
                </button>
                <button className='bg-black text-white px-4 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-600'>
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
          <div className='p-4 border-b-4 border-black bg-yellow-400'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-extrabold uppercase'>Your Cart</h2>
              <button 
                onClick={toggleCart}
                className='w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-red-600'
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className='max-h-96 overflow-y-auto'>
            {cartItems.length === 0 ? (
              <div className='p-8 text-center border-b-4 border-black'>
                <p className='text-lg font-bold'>YOUR CART IS EMPTY</p>
                <button 
                  onClick={toggleCart}
                  className='mt-4 bg-black text-white px-6 py-2 font-extrabold uppercase border-4 border-white hover:bg-red-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <ul>
                {cartItems.map(item => (
                  <li key={item.id} className='border-b-4 border-black p-4 hover:bg-gray-100'>
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <h3 className='font-extrabold uppercase'>{item.name}</h3>
                        <p className='font-bold'>${item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className='w-8 h-8 bg-red-600 text-white flex items-center justify-center border-2 border-black hover:bg-red-700'
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className='flex items-center'>
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className='w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-gray-800'
                      >
                        -
                      </button>
                      <span className='mx-4 font-bold'>{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className='w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-gray-800'
                      >
                        +
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

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className='p-4 bg-yellow-400 border-t-4 border-black'>
              <div className='flex justify-between items-center mb-4'>
                <span className='font-extrabold uppercase'>Total:</span>
                <span className='font-extrabold text-xl'>${totalPrice().toFixed(2)}</span>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <button 
                  onClick={clearCart}
                  className='bg-red-600 text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-red-700 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                >
                  Clear All
                </button>
                <button className='bg-black text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-green-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'>
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar