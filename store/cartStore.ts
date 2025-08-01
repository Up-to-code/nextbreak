import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartStore = {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void
  increaseQuantity: (id: string, amount?: number) => void
  decreaseQuantity: (id: string, amount?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
  prepareOrderItems: () => Array<{
    productId: string
    quantity: number
    priceAtPurchase: number
  }>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      // Add to cart with optional quantity (defaults to 1)
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(item => item.id === product.id)
          
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.cartItems]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity
            }
            return { cartItems: updatedItems }
          }
          
          return {
            cartItems: [...state.cartItems, { ...product, quantity }]
          }
        })
      },
      
      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== id)
        }))
      },
      
      // Increase quantity by amount (default 1)
      increaseQuantity: (id, amount = 1) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: item.quantity + amount }
              : item
          )
        }))
      },
      
      // Decrease quantity by amount (default 1), never goes below 1
      decreaseQuantity: (id, amount = 1) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: Math.max(1, item.quantity - amount) }
              : item
          )
        }))
      },
      
      // Directly set quantity (minimum 1)
      updateQuantity: (id, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ cartItems: [] })
      },
      
      // Get total number of items in cart (sum of quantities)
      totalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },
      
      // Calculate total price of all items in cart
      totalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        )
      },
      
      // Format cart items for order processing
      prepareOrderItems: () => {
        return get().cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        }))
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
      onRehydrateStorage: () => (state) => {
        console.log('Cart data loaded from localStorage')
      },
    }
  )
)