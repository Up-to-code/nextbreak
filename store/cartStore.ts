import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

type CartStore = {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id)
          
          if (existingItem) {
            return {
              cartItems: state.cartItems.map(item =>
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
          }
          
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }]
          }
        })
      },
      
      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== id)
        }))
      },
      
      increaseQuantity: (id) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }))
      },
      
      decreaseQuantity: (id) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === id 
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ cartItems: [] })
      },
      
      totalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },
      
      totalPrice: () => {
        return get().cartItems.reduce((total, item) => 
          total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      // Optional: customize what gets persisted
      partialize: (state) => ({ cartItems: state.cartItems }),
      // Optional: handle storage errors
      onRehydrateStorage: () => (state) => {
        console.log('Cart data loaded from localStorage')
      },
    }
  )
)